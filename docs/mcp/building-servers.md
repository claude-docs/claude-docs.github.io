---
sidebar_position: 5
title: Building Servers
description: Build custom MCP servers from scratch
format: md
---

# Building MCP Servers

Learn how to build custom MCP servers to extend Claude Code with your own tools, resources, and prompts.

## Overview

MCP servers are standalone processes that communicate with Claude Code via JSON-RPC. You can build servers in any language, but TypeScript and Python have official SDKs with full protocol support.

### What You Can Build

- **Tools** - Actions Claude can invoke (query APIs, run commands, process data)
- **Resources** - Data sources Claude can read (databases, files, configurations)
- **Prompts** - Reusable prompt templates with parameters

## TypeScript Server

### Project Setup

```bash
mkdir my-mcp-server
cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true
  },
  "include": ["src/**/*"]
}
```

### Basic Server Structure

Create `src/index.ts`:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Create server instance
const server = new Server(
  {
    name: "my-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server running on stdio");
}

main().catch(console.error);
```

### Adding Tools

Tools are actions Claude can invoke. Define them with a name, description, and JSON Schema for parameters:

```typescript
import { z } from "zod";

// Define tool input schema
const WeatherInputSchema = z.object({
  city: z.string().describe("City name"),
  units: z.enum(["celsius", "fahrenheit"]).default("celsius"),
});

// Register tool list handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_weather",
      description: "Get current weather for a city",
      inputSchema: {
        type: "object",
        properties: {
          city: { type: "string", description: "City name" },
          units: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            default: "celsius",
          },
        },
        required: ["city"],
      },
    },
    {
      name: "calculate",
      description: "Perform mathematical calculations",
      inputSchema: {
        type: "object",
        properties: {
          expression: { type: "string", description: "Math expression" },
        },
        required: ["expression"],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "get_weather": {
      const { city, units } = WeatherInputSchema.parse(args);
      // In production, call a real weather API
      const temp = units === "celsius" ? "22°C" : "72°F";
      return {
        content: [
          {
            type: "text",
            text: `Weather in ${city}: ${temp}, partly cloudy`,
          },
        ],
      };
    }

    case "calculate": {
      const { expression } = args as { expression: string };
      try {
        // WARNING: eval is dangerous - use a proper math parser in production
        const result = Function(`"use strict"; return (${expression})`)();
        return {
          content: [{ type: "text", text: `Result: ${result}` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error: Invalid expression` }],
          isError: true,
        };
      }
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});
```

### Adding Resources

Resources are data sources that Claude can read:

```typescript
// In-memory data store for this example
const documents = new Map<string, string>([
  ["config", '{"version": "1.0", "debug": false}'],
  ["users", '[{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]'],
]);

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "app://config",
      name: "Application Configuration",
      description: "Current app configuration",
      mimeType: "application/json",
    },
    {
      uri: "app://users",
      name: "User List",
      description: "All registered users",
      mimeType: "application/json",
    },
  ],
}));

// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  const key = uri.replace("app://", "");
  const content = documents.get(key);

  if (!content) {
    throw new Error(`Resource not found: ${uri}`);
  }

  return {
    contents: [
      {
        uri,
        mimeType: "application/json",
        text: content,
      },
    ],
  };
});
```

### Adding Prompts

Prompts are reusable templates:

```typescript
// List available prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: [
    {
      name: "analyze_code",
      description: "Analyze code for issues and improvements",
      arguments: [
        {
          name: "language",
          description: "Programming language",
          required: true,
        },
        {
          name: "focus",
          description: "Focus area (security, performance, style)",
          required: false,
        },
      ],
    },
    {
      name: "explain_error",
      description: "Explain an error message",
      arguments: [
        {
          name: "error",
          description: "The error message",
          required: true,
        },
      ],
    },
  ],
}));

// Get prompt content
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "analyze_code": {
      const language = args?.language ?? "unknown";
      const focus = args?.focus ?? "general";
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Analyze the following ${language} code with focus on ${focus}.
Provide specific, actionable feedback.`,
            },
          },
        ],
      };
    }

    case "explain_error": {
      const error = args?.error ?? "";
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Explain this error message and suggest fixes:\n\n${error}`,
            },
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
});
```

### Complete TypeScript Server

Here is a complete, production-ready server example:

```typescript
// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";

// Configuration
const CONFIG = {
  allowedPaths: process.env.ALLOWED_PATHS?.split(",") ?? ["."],
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE ?? "1048576"), // 1MB
};

// Input schemas
const ReadFileSchema = z.object({
  path: z.string().describe("File path to read"),
});

const WriteFileSchema = z.object({
  path: z.string().describe("File path to write"),
  content: z.string().describe("Content to write"),
});

const SearchFilesSchema = z.object({
  pattern: z.string().describe("Glob pattern to match"),
  directory: z.string().optional().describe("Directory to search in"),
});

// Helper: validate path is allowed
function validatePath(filePath: string): string {
  const resolved = path.resolve(filePath);
  const isAllowed = CONFIG.allowedPaths.some((allowed) =>
    resolved.startsWith(path.resolve(allowed))
  );
  if (!isAllowed) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `Access denied: ${filePath}`
    );
  }
  return resolved;
}

// Create server
const server = new Server(
  {
    name: "file-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: { subscribe: true },
    },
  }
);

// Tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "read_file",
      description: "Read contents of a file",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "File path to read" },
        },
        required: ["path"],
      },
    },
    {
      name: "write_file",
      description: "Write content to a file",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "File path to write" },
          content: { type: "string", description: "Content to write" },
        },
        required: ["path", "content"],
      },
    },
    {
      name: "list_directory",
      description: "List files in a directory",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "Directory path" },
        },
        required: ["path"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "read_file": {
        const { path: filePath } = ReadFileSchema.parse(args);
        const resolved = validatePath(filePath);
        const stats = await fs.stat(resolved);

        if (stats.size > CONFIG.maxFileSize) {
          throw new McpError(
            ErrorCode.InvalidRequest,
            `File too large: ${stats.size} bytes`
          );
        }

        const content = await fs.readFile(resolved, "utf-8");
        return {
          content: [{ type: "text", text: content }],
        };
      }

      case "write_file": {
        const { path: filePath, content } = WriteFileSchema.parse(args);
        const resolved = validatePath(filePath);
        await fs.writeFile(resolved, content, "utf-8");
        return {
          content: [{ type: "text", text: `Wrote ${content.length} bytes to ${filePath}` }],
        };
      }

      case "list_directory": {
        const { path: dirPath } = z.object({ path: z.string() }).parse(args);
        const resolved = validatePath(dirPath);
        const entries = await fs.readdir(resolved, { withFileTypes: true });
        const listing = entries.map((e) =>
          `${e.isDirectory() ? "[DIR]" : "[FILE]"} ${e.name}`
        );
        return {
          content: [{ type: "text", text: listing.join("\n") }],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof McpError) throw error;
    if (error instanceof z.ZodError) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: ${error.message}`
      );
    }
    throw new McpError(
      ErrorCode.InternalError,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

// Resources - expose current directory structure
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const files = await fs.readdir(".", { withFileTypes: true });
  return {
    resources: files
      .filter((f) => f.isFile())
      .slice(0, 10)
      .map((f) => ({
        uri: `file://${path.resolve(f.name)}`,
        name: f.name,
        mimeType: "text/plain",
      })),
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  const filePath = uri.replace("file://", "");
  const resolved = validatePath(filePath);
  const content = await fs.readFile(resolved, "utf-8");

  return {
    contents: [
      {
        uri,
        mimeType: "text/plain",
        text: content,
      },
    ],
  };
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("File server running");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
```

Build and run:

```bash
npm run build
node dist/index.js
```

## Python Server

### Project Setup

```bash
mkdir my-mcp-server
cd my-mcp-server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install mcp pydantic
```

Create `pyproject.toml`:

```toml
[project]
name = "my-mcp-server"
version = "1.0.0"
requires-python = ">=3.10"
dependencies = ["mcp>=1.0.0", "pydantic>=2.0"]

[project.scripts]
my-mcp-server = "my_mcp_server:main"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

### Basic Server Structure

Create `my_mcp_server/__init__.py`:

```python
import asyncio
from mcp.server import Server
from mcp.server.stdio import stdio_server

# Create server instance
server = Server("my-mcp-server")


async def run():
    """Run the MCP server."""
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options(),
        )


def main():
    """Entry point."""
    asyncio.run(run())


if __name__ == "__main__":
    main()
```

### Adding Tools

```python
from mcp.server import Server
from mcp.types import Tool, TextContent
from pydantic import BaseModel, Field
import httpx

server = Server("api-server")


class WeatherInput(BaseModel):
    """Input schema for weather tool."""
    city: str = Field(description="City name")
    units: str = Field(default="celsius", description="Temperature units")


class CalculateInput(BaseModel):
    """Input schema for calculate tool."""
    expression: str = Field(description="Mathematical expression")


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List available tools."""
    return [
        Tool(
            name="get_weather",
            description="Get current weather for a city",
            inputSchema=WeatherInput.model_json_schema(),
        ),
        Tool(
            name="calculate",
            description="Perform mathematical calculations",
            inputSchema=CalculateInput.model_json_schema(),
        ),
        Tool(
            name="fetch_url",
            description="Fetch content from a URL",
            inputSchema={
                "type": "object",
                "properties": {
                    "url": {"type": "string", "description": "URL to fetch"},
                },
                "required": ["url"],
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls."""
    match name:
        case "get_weather":
            input_data = WeatherInput(**arguments)
            # In production, call a real weather API
            temp = "22°C" if input_data.units == "celsius" else "72°F"
            return [
                TextContent(
                    type="text",
                    text=f"Weather in {input_data.city}: {temp}, partly cloudy",
                )
            ]

        case "calculate":
            input_data = CalculateInput(**arguments)
            try:
                # WARNING: eval is dangerous - use a proper math parser
                result = eval(input_data.expression, {"__builtins__": {}})
                return [TextContent(type="text", text=f"Result: {result}")]
            except Exception as e:
                return [TextContent(type="text", text=f"Error: {e}")]

        case "fetch_url":
            url = arguments.get("url", "")
            async with httpx.AsyncClient() as client:
                response = await client.get(url, timeout=30)
                return [
                    TextContent(
                        type="text",
                        text=f"Status: {response.status_code}\n\n{response.text[:2000]}",
                    )
                ]

        case _:
            raise ValueError(f"Unknown tool: {name}")
```

### Adding Resources

```python
from mcp.types import Resource, ResourceContents, TextResourceContents
from pathlib import Path

# Configuration
DATA_DIR = Path("./data")


@server.list_resources()
async def list_resources() -> list[Resource]:
    """List available resources."""
    resources = []

    # Add static resources
    resources.append(
        Resource(
            uri="config://app",
            name="Application Config",
            description="Application configuration",
            mimeType="application/json",
        )
    )

    # Add dynamic resources from data directory
    if DATA_DIR.exists():
        for file_path in DATA_DIR.glob("*.json"):
            resources.append(
                Resource(
                    uri=f"file://{file_path.absolute()}",
                    name=file_path.name,
                    mimeType="application/json",
                )
            )

    return resources


@server.read_resource()
async def read_resource(uri: str) -> ResourceContents:
    """Read resource content."""
    if uri == "config://app":
        return TextResourceContents(
            uri=uri,
            mimeType="application/json",
            text='{"version": "1.0.0", "environment": "development"}',
        )

    if uri.startswith("file://"):
        file_path = Path(uri.replace("file://", ""))
        if not file_path.exists():
            raise FileNotFoundError(f"Resource not found: {uri}")

        content = file_path.read_text()
        return TextResourceContents(
            uri=uri,
            mimeType="application/json",
            text=content,
        )

    raise ValueError(f"Unknown resource: {uri}")
```

### Adding Prompts

```python
from mcp.types import Prompt, PromptArgument, PromptMessage, TextContent


@server.list_prompts()
async def list_prompts() -> list[Prompt]:
    """List available prompts."""
    return [
        Prompt(
            name="code_review",
            description="Review code for issues and improvements",
            arguments=[
                PromptArgument(
                    name="language",
                    description="Programming language",
                    required=True,
                ),
                PromptArgument(
                    name="focus",
                    description="Review focus (security, performance, style)",
                    required=False,
                ),
            ],
        ),
        Prompt(
            name="debug_error",
            description="Help debug an error",
            arguments=[
                PromptArgument(
                    name="error_message",
                    description="The error message",
                    required=True,
                ),
                PromptArgument(
                    name="context",
                    description="Additional context",
                    required=False,
                ),
            ],
        ),
    ]


@server.get_prompt()
async def get_prompt(name: str, arguments: dict | None) -> list[PromptMessage]:
    """Get prompt content."""
    args = arguments or {}

    match name:
        case "code_review":
            language = args.get("language", "code")
            focus = args.get("focus", "general quality")
            return [
                PromptMessage(
                    role="user",
                    content=TextContent(
                        type="text",
                        text=f"""Please review the following {language} code with a focus on {focus}.

Provide:
1. Summary of what the code does
2. Potential issues or bugs
3. Security concerns
4. Performance improvements
5. Code style suggestions

Be specific and provide code examples for fixes.""",
                    ),
                )
            ]

        case "debug_error":
            error = args.get("error_message", "Unknown error")
            context = args.get("context", "")
            context_section = f"\n\nContext:\n{context}" if context else ""
            return [
                PromptMessage(
                    role="user",
                    content=TextContent(
                        type="text",
                        text=f"""Help me debug this error:

{error}

{context_section}

Please:
1. Explain what the error means
2. Identify likely causes
3. Suggest specific fixes
4. Recommend how to prevent similar errors""",
                    ),
                )
            ]

        case _:
            raise ValueError(f"Unknown prompt: {name}")
```

### Complete Python Server

```python
# my_mcp_server/__init__.py
"""Complete MCP server implementation."""

import asyncio
import json
import os
from pathlib import Path
from typing import Any

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import (
    Tool,
    Resource,
    Prompt,
    PromptArgument,
    PromptMessage,
    TextContent,
    TextResourceContents,
)
from pydantic import BaseModel, Field

# Configuration from environment
CONFIG = {
    "data_dir": Path(os.getenv("DATA_DIR", "./data")),
    "max_file_size": int(os.getenv("MAX_FILE_SIZE", "1048576")),
    "allowed_extensions": os.getenv("ALLOWED_EXTENSIONS", ".json,.txt,.md").split(","),
}

server = Server("data-server")


# --- Input Schemas ---
class QueryInput(BaseModel):
    collection: str = Field(description="Collection name")
    filter: dict = Field(default_factory=dict, description="Query filter")
    limit: int = Field(default=10, description="Max results")


class WriteInput(BaseModel):
    collection: str = Field(description="Collection name")
    data: dict = Field(description="Data to write")


# --- Tools ---
@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="query_data",
            description="Query data from a collection",
            inputSchema=QueryInput.model_json_schema(),
        ),
        Tool(
            name="write_data",
            description="Write data to a collection",
            inputSchema=WriteInput.model_json_schema(),
        ),
        Tool(
            name="list_collections",
            description="List all available collections",
            inputSchema={"type": "object", "properties": {}},
        ),
    ]


def get_collection_path(name: str) -> Path:
    """Get path for a collection, ensuring it's safe."""
    # Prevent path traversal
    safe_name = Path(name).name
    if not safe_name or safe_name.startswith("."):
        raise ValueError(f"Invalid collection name: {name}")
    return CONFIG["data_dir"] / f"{safe_name}.json"


def load_collection(name: str) -> list[dict]:
    """Load a collection from disk."""
    path = get_collection_path(name)
    if not path.exists():
        return []
    return json.loads(path.read_text())


def save_collection(name: str, data: list[dict]) -> None:
    """Save a collection to disk."""
    path = get_collection_path(name)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2))


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    match name:
        case "query_data":
            input_data = QueryInput(**arguments)
            collection = load_collection(input_data.collection)

            # Simple filter matching
            results = []
            for item in collection:
                matches = all(
                    item.get(k) == v for k, v in input_data.filter.items()
                )
                if matches:
                    results.append(item)
                    if len(results) >= input_data.limit:
                        break

            return [
                TextContent(
                    type="text",
                    text=json.dumps(results, indent=2),
                )
            ]

        case "write_data":
            input_data = WriteInput(**arguments)
            collection = load_collection(input_data.collection)
            collection.append(input_data.data)
            save_collection(input_data.collection, collection)
            return [
                TextContent(
                    type="text",
                    text=f"Added item to {input_data.collection}",
                )
            ]

        case "list_collections":
            CONFIG["data_dir"].mkdir(parents=True, exist_ok=True)
            collections = [
                f.stem for f in CONFIG["data_dir"].glob("*.json")
            ]
            return [
                TextContent(
                    type="text",
                    text=json.dumps(collections),
                )
            ]

        case _:
            raise ValueError(f"Unknown tool: {name}")


# --- Resources ---
@server.list_resources()
async def list_resources() -> list[Resource]:
    resources = []
    CONFIG["data_dir"].mkdir(parents=True, exist_ok=True)

    for file_path in CONFIG["data_dir"].glob("*.json"):
        resources.append(
            Resource(
                uri=f"data://{file_path.stem}",
                name=f"{file_path.stem} collection",
                mimeType="application/json",
            )
        )
    return resources


@server.read_resource()
async def read_resource(uri: str) -> TextResourceContents:
    if not uri.startswith("data://"):
        raise ValueError(f"Invalid URI scheme: {uri}")

    collection_name = uri.replace("data://", "")
    data = load_collection(collection_name)

    return TextResourceContents(
        uri=uri,
        mimeType="application/json",
        text=json.dumps(data, indent=2),
    )


# --- Prompts ---
@server.list_prompts()
async def list_prompts() -> list[Prompt]:
    return [
        Prompt(
            name="analyze_data",
            description="Analyze data in a collection",
            arguments=[
                PromptArgument(
                    name="collection",
                    description="Collection to analyze",
                    required=True,
                ),
            ],
        ),
    ]


@server.get_prompt()
async def get_prompt(name: str, arguments: dict | None) -> list[PromptMessage]:
    args = arguments or {}

    if name == "analyze_data":
        collection = args.get("collection", "")
        data = load_collection(collection) if collection else []
        return [
            PromptMessage(
                role="user",
                content=TextContent(
                    type="text",
                    text=f"""Analyze this data from the '{collection}' collection:

```json
{json.dumps(data, indent=2)}
```

Provide insights about:
1. Data structure and schema
2. Patterns and trends
3. Anomalies or issues
4. Recommendations""",
                ),
            )
        ]

    raise ValueError(f"Unknown prompt: {name}")


# --- Entry Point ---
async def run():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options(),
        )


def main():
    asyncio.run(run())


if __name__ == "__main__":
    main()
```

## Error Handling

### Standard MCP Errors

```typescript
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";

// Throw standard errors
throw new McpError(ErrorCode.InvalidRequest, "Missing required parameter");
throw new McpError(ErrorCode.MethodNotFound, "Unknown tool");
throw new McpError(ErrorCode.InternalError, "Database connection failed");
```

```python
from mcp.types import McpError, ErrorCode

# Throw standard errors
raise McpError(ErrorCode.INVALID_REQUEST, "Missing required parameter")
raise McpError(ErrorCode.METHOD_NOT_FOUND, "Unknown tool")
raise McpError(ErrorCode.INTERNAL_ERROR, "Database connection failed")
```

### Error Response Format

```typescript
// Return error in tool response
return {
  content: [
    {
      type: "text",
      text: "Error: File not found",
    },
  ],
  isError: true,
};
```

### Graceful Error Handling

```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    // Tool logic
    return await handleTool(request);
  } catch (error) {
    // Log for debugging
    console.error("Tool error:", error);

    // Return user-friendly error
    if (error instanceof McpError) {
      throw error;
    }

    // Wrap unexpected errors
    throw new McpError(
      ErrorCode.InternalError,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});
```

## Authentication Patterns

### API Key Authentication

```typescript
// Read from environment
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("API_KEY environment variable required");
  process.exit(1);
}

// Use in tool handlers
async function callExternalAPI(endpoint: string, data: object) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

### OAuth Token Refresh

```typescript
class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string;
  private expiresAt: number = 0;

  constructor(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  async getToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.expiresAt - 60000) {
      return this.accessToken;
    }

    const response = await fetch("https://oauth.example.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: this.refreshToken,
        client_id: process.env.CLIENT_ID!,
      }),
    });

    const data = await response.json();
    this.accessToken = data.access_token;
    this.expiresAt = Date.now() + data.expires_in * 1000;

    return this.accessToken;
  }
}
```

### Database Connection

```typescript
import { Pool } from "pg";

// Create connection pool at startup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

// Use in tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "query") {
    const client = await pool.connect();
    try {
      const result = await client.query(request.params.arguments.sql);
      return {
        content: [{ type: "text", text: JSON.stringify(result.rows) }],
      };
    } finally {
      client.release();
    }
  }
});

// Cleanup on shutdown
process.on("SIGTERM", async () => {
  await pool.end();
  process.exit(0);
});
```

## Testing MCP Servers

### Unit Testing Tools

```typescript
// tests/tools.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { handleToolCall } from "../src/tools";

describe("get_weather tool", () => {
  it("returns weather for valid city", async () => {
    const result = await handleToolCall("get_weather", {
      city: "London",
      units: "celsius",
    });

    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("London");
    expect(result.isError).toBeUndefined();
  });

  it("handles missing city parameter", async () => {
    const result = await handleToolCall("get_weather", {});

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("required");
  });
});
```

### Integration Testing

```typescript
// tests/integration.test.ts
import { spawn } from "child_process";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("MCP Server Integration", () => {
  let serverProcess: ReturnType<typeof spawn>;
  let requestId = 0;

  beforeAll(() => {
    serverProcess = spawn("node", ["dist/index.js"], {
      stdio: ["pipe", "pipe", "pipe"],
    });
  });

  afterAll(() => {
    serverProcess.kill();
  });

  async function sendRequest(method: string, params: object): Promise<object> {
    return new Promise((resolve, reject) => {
      const request = {
        jsonrpc: "2.0",
        id: ++requestId,
        method,
        params,
      };

      serverProcess.stdout!.once("data", (data) => {
        resolve(JSON.parse(data.toString()));
      });

      serverProcess.stdin!.write(JSON.stringify(request) + "\n");
    });
  }

  it("initializes correctly", async () => {
    const response = await sendRequest("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "test", version: "1.0.0" },
    });

    expect(response).toHaveProperty("result.serverInfo");
  });

  it("lists tools", async () => {
    const response = await sendRequest("tools/list", {});
    expect(response).toHaveProperty("result.tools");
    expect(Array.isArray(response.result.tools)).toBe(true);
  });
});
```

### Testing with MCP Inspector

```bash
# Install the MCP inspector
npm install -g @modelcontextprotocol/inspector

# Run your server with the inspector
mcp-inspector node dist/index.js
```

## Publishing to Registries

### npm Registry

Update `package.json`:

```json
{
  "name": "@yourorg/mcp-server-myservice",
  "version": "1.0.0",
  "description": "MCP server for MyService integration",
  "main": "dist/index.js",
  "bin": {
    "mcp-server-myservice": "dist/index.js"
  },
  "files": ["dist"],
  "keywords": ["mcp", "mcp-server", "claude", "ai"],
  "repository": {
    "type": "git",
    "url": "https://github.com/yourorg/mcp-server-myservice"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

Publish:

```bash
npm run build
npm publish
```

### PyPI Registry

Update `pyproject.toml`:

```toml
[project]
name = "mcp-server-myservice"
version = "1.0.0"
description = "MCP server for MyService integration"
readme = "README.md"
requires-python = ">=3.10"
keywords = ["mcp", "mcp-server", "claude", "ai"]
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
]
dependencies = ["mcp>=1.0.0"]

[project.scripts]
mcp-server-myservice = "mcp_server_myservice:main"

[project.urls]
Homepage = "https://github.com/yourorg/mcp-server-myservice"
Repository = "https://github.com/yourorg/mcp-server-myservice"
```

Publish:

```bash
pip install build twine
python -m build
twine upload dist/*
```

### Docker Registry

Create `Dockerfile`:

```dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist ./dist
ENTRYPOINT ["node", "dist/index.js"]
```

Build and push:

```bash
docker build -t yourorg/mcp-server-myservice:1.0.0 .
docker push yourorg/mcp-server-myservice:1.0.0
```

## Best Practices

### Server Design

1. **Single responsibility** - Each server should focus on one domain
2. **Stateless when possible** - Avoid storing state between requests
3. **Idempotent tools** - Same input should produce same output
4. **Clear descriptions** - Help Claude understand when to use each tool

### Security

1. **Validate all inputs** - Use schemas and sanitize data
2. **Limit permissions** - Only request necessary access
3. **Protect secrets** - Use environment variables
4. **Log securely** - Never log sensitive data

### Performance

1. **Connection pooling** - Reuse database/HTTP connections
2. **Async operations** - Use non-blocking I/O
3. **Timeouts** - Set reasonable limits
4. **Caching** - Cache expensive operations

## Next Steps

- [Advanced MCP Patterns](/mcp/advanced-patterns)
- [MCP Recipes](/mcp/recipes)
- [MCP Configuration](/mcp/configuration)
