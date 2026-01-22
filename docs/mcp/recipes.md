---
sidebar_position: 7
title: Recipes
description: Ready-to-use MCP server recipes for common use cases
---

# MCP Recipes

Production-ready recipes for common MCP server implementations.

## Database Query Assistant

A comprehensive database assistant with query building, schema exploration, and data analysis.

### TypeScript Implementation

```typescript
// src/database-assistant.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Pool } from "pg";
import { z } from "zod";

// Configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

const server = new Server(
  { name: "database-assistant", version: "1.0.0" },
  { capabilities: { tools: {}, resources: {} } }
);

// Input schemas
const QuerySchema = z.object({
  sql: z.string().max(10000),
  params: z.array(z.unknown()).optional(),
});

const TableInfoSchema = z.object({
  table: z.string(),
  schema: z.string().default("public"),
});

// Tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "execute_query",
      description: "Execute a SELECT query and return results",
      inputSchema: {
        type: "object",
        properties: {
          sql: { type: "string", description: "SQL SELECT query" },
          params: {
            type: "array",
            items: {},
            description: "Query parameters",
          },
        },
        required: ["sql"],
      },
    },
    {
      name: "describe_table",
      description: "Get detailed information about a table",
      inputSchema: {
        type: "object",
        properties: {
          table: { type: "string", description: "Table name" },
          schema: { type: "string", default: "public" },
        },
        required: ["table"],
      },
    },
    {
      name: "list_tables",
      description: "List all tables in the database",
      inputSchema: {
        type: "object",
        properties: {
          schema: { type: "string", default: "public" },
        },
      },
    },
    {
      name: "analyze_query",
      description: "Analyze a query execution plan",
      inputSchema: {
        type: "object",
        properties: {
          sql: { type: "string", description: "SQL query to analyze" },
        },
        required: ["sql"],
      },
    },
    {
      name: "get_table_stats",
      description: "Get statistics for a table",
      inputSchema: {
        type: "object",
        properties: {
          table: { type: "string" },
          schema: { type: "string", default: "public" },
        },
        required: ["table"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "execute_query": {
        const { sql, params } = QuerySchema.parse(args);

        // Security: Only allow SELECT queries
        if (!sql.trim().toLowerCase().startsWith("select")) {
          return {
            content: [
              { type: "text", text: "Error: Only SELECT queries are allowed" },
            ],
            isError: true,
          };
        }

        const result = await pool.query(sql, params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  rows: result.rows.slice(0, 100), // Limit results
                  rowCount: result.rowCount,
                  fields: result.fields.map((f) => ({
                    name: f.name,
                    dataType: f.dataTypeID,
                  })),
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "describe_table": {
        const { table, schema } = TableInfoSchema.parse(args);
        const result = await pool.query(
          `
          SELECT
            c.column_name,
            c.data_type,
            c.is_nullable,
            c.column_default,
            c.character_maximum_length,
            tc.constraint_type
          FROM information_schema.columns c
          LEFT JOIN information_schema.key_column_usage kcu
            ON c.table_name = kcu.table_name
            AND c.column_name = kcu.column_name
          LEFT JOIN information_schema.table_constraints tc
            ON kcu.constraint_name = tc.constraint_name
          WHERE c.table_schema = $1 AND c.table_name = $2
          ORDER BY c.ordinal_position
        `,
          [schema, table]
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result.rows, null, 2) }],
        };
      }

      case "list_tables": {
        const { schema } = z.object({ schema: z.string().default("public") }).parse(args);
        const result = await pool.query(
          `
          SELECT
            t.table_name,
            t.table_type,
            pg_size_pretty(pg_total_relation_size(quote_ident(t.table_name)::text)) as size,
            (SELECT count(*) FROM information_schema.columns c
             WHERE c.table_name = t.table_name) as column_count
          FROM information_schema.tables t
          WHERE t.table_schema = $1
          ORDER BY t.table_name
        `,
          [schema]
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result.rows, null, 2) }],
        };
      }

      case "analyze_query": {
        const { sql } = z.object({ sql: z.string() }).parse(args);
        const result = await pool.query(`EXPLAIN ANALYZE ${sql}`);
        return {
          content: [
            {
              type: "text",
              text: result.rows.map((r) => r["QUERY PLAN"]).join("\n"),
            },
          ],
        };
      }

      case "get_table_stats": {
        const { table, schema } = TableInfoSchema.parse(args);
        const result = await pool.query(
          `
          SELECT
            reltuples::bigint as row_estimate,
            pg_size_pretty(pg_total_relation_size(quote_ident($2)::text)) as total_size,
            pg_size_pretty(pg_indexes_size(quote_ident($2)::text)) as index_size,
            (SELECT count(*) FROM pg_indexes WHERE tablename = $2) as index_count
          FROM pg_class
          WHERE relname = $2 AND relnamespace = (
            SELECT oid FROM pg_namespace WHERE nspname = $1
          )
        `,
          [schema, table]
        );
        return {
          content: [
            { type: "text", text: JSON.stringify(result.rows[0], null, 2) },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      isError: true,
    };
  }
});

// Resources - expose schema as resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const result = await pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
  `);

  return {
    resources: result.rows.map((row) => ({
      uri: `postgres://table/${row.table_name}`,
      name: row.table_name,
      description: `Schema for ${row.table_name} table`,
      mimeType: "application/json",
    })),
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  const tableName = uri.replace("postgres://table/", "");

  const result = await pool.query(
    `
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = $1
    ORDER BY ordinal_position
  `,
    [tableName]
  );

  return {
    contents: [
      {
        uri,
        mimeType: "application/json",
        text: JSON.stringify(result.rows, null, 2),
      },
    ],
  };
});

// Startup
async function main() {
  // Verify database connection
  await pool.query("SELECT 1");
  console.error("Database connected");

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
```

### Configuration

```json
{
  "mcpServers": {
    "database": {
      "command": "npx",
      "args": ["ts-node", "src/database-assistant.ts"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

## API Integration Hub

A unified interface for multiple REST APIs with authentication, rate limiting, and response transformation.

### TypeScript Implementation

```typescript
// src/api-hub.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// API Configuration
interface ApiConfig {
  name: string;
  baseUrl: string;
  authType: "bearer" | "api_key" | "basic" | "none";
  authHeader?: string;
  authEnvVar?: string;
  rateLimit: { requests: number; windowMs: number };
  defaultHeaders?: Record<string, string>;
}

const APIS: Record<string, ApiConfig> = {
  github: {
    name: "GitHub",
    baseUrl: "https://api.github.com",
    authType: "bearer",
    authEnvVar: "GITHUB_TOKEN",
    rateLimit: { requests: 5000, windowMs: 3600000 },
    defaultHeaders: { Accept: "application/vnd.github.v3+json" },
  },
  openai: {
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    authType: "bearer",
    authEnvVar: "OPENAI_API_KEY",
    rateLimit: { requests: 60, windowMs: 60000 },
  },
  stripe: {
    name: "Stripe",
    baseUrl: "https://api.stripe.com/v1",
    authType: "bearer",
    authEnvVar: "STRIPE_SECRET_KEY",
    rateLimit: { requests: 100, windowMs: 1000 },
  },
  slack: {
    name: "Slack",
    baseUrl: "https://slack.com/api",
    authType: "bearer",
    authEnvVar: "SLACK_TOKEN",
    rateLimit: { requests: 50, windowMs: 60000 },
  },
};

// Rate limiter
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  check(api: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(api) ?? [];

    // Remove old timestamps
    const valid = timestamps.filter((t) => now - t < windowMs);

    if (valid.length >= limit) {
      return false;
    }

    valid.push(now);
    this.requests.set(api, valid);
    return true;
  }
}

const rateLimiter = new RateLimiter();

// Server
const server = new Server(
  { name: "api-hub", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Build tools from API configs
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "api_request",
      description: "Make an HTTP request to a configured API",
      inputSchema: {
        type: "object",
        properties: {
          api: {
            type: "string",
            enum: Object.keys(APIS),
            description: "API to call",
          },
          method: {
            type: "string",
            enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            default: "GET",
          },
          path: { type: "string", description: "API endpoint path" },
          params: {
            type: "object",
            description: "Query parameters",
          },
          body: {
            type: "object",
            description: "Request body (for POST/PUT/PATCH)",
          },
        },
        required: ["api", "path"],
      },
    },
    {
      name: "list_apis",
      description: "List all available APIs and their status",
      inputSchema: { type: "object", properties: {} },
    },
    // API-specific convenience tools
    {
      name: "github_search_repos",
      description: "Search GitHub repositories",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query" },
          sort: {
            type: "string",
            enum: ["stars", "forks", "updated"],
          },
          limit: { type: "number", default: 10 },
        },
        required: ["query"],
      },
    },
    {
      name: "slack_send_message",
      description: "Send a message to a Slack channel",
      inputSchema: {
        type: "object",
        properties: {
          channel: { type: "string", description: "Channel ID" },
          text: { type: "string", description: "Message text" },
        },
        required: ["channel", "text"],
      },
    },
  ],
}));

// Helper: Make API request
async function makeRequest(
  api: string,
  method: string,
  path: string,
  params?: Record<string, string>,
  body?: object
): Promise<object> {
  const config = APIS[api];
  if (!config) throw new Error(`Unknown API: ${api}`);

  // Check rate limit
  if (!rateLimiter.check(api, config.rateLimit.requests, config.rateLimit.windowMs)) {
    throw new Error(`Rate limit exceeded for ${api}`);
  }

  // Build URL
  const url = new URL(path, config.baseUrl);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  // Build headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...config.defaultHeaders,
  };

  // Add authentication
  if (config.authType !== "none" && config.authEnvVar) {
    const token = process.env[config.authEnvVar];
    if (!token) {
      throw new Error(`Missing ${config.authEnvVar} environment variable`);
    }

    switch (config.authType) {
      case "bearer":
        headers.Authorization = `Bearer ${token}`;
        break;
      case "api_key":
        headers[config.authHeader ?? "X-API-Key"] = token;
        break;
      case "basic":
        headers.Authorization = `Basic ${Buffer.from(token).toString("base64")}`;
        break;
    }
  }

  // Make request
  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`${api} API error ${response.status}: ${error}`);
  }

  return response.json();
}

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "api_request": {
        const input = z
          .object({
            api: z.string(),
            method: z.string().default("GET"),
            path: z.string(),
            params: z.record(z.string()).optional(),
            body: z.record(z.unknown()).optional(),
          })
          .parse(args);

        const result = await makeRequest(
          input.api,
          input.method,
          input.path,
          input.params,
          input.body
        );

        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "list_apis": {
        const status = Object.entries(APIS).map(([id, config]) => ({
          id,
          name: config.name,
          baseUrl: config.baseUrl,
          configured: config.authEnvVar
            ? !!process.env[config.authEnvVar]
            : true,
          rateLimit: config.rateLimit,
        }));
        return {
          content: [{ type: "text", text: JSON.stringify(status, null, 2) }],
        };
      }

      case "github_search_repos": {
        const { query, sort, limit } = z
          .object({
            query: z.string(),
            sort: z.string().optional(),
            limit: z.number().default(10),
          })
          .parse(args);

        const result = await makeRequest("github", "GET", "/search/repositories", {
          q: query,
          sort: sort ?? "stars",
          per_page: String(limit),
        });

        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "slack_send_message": {
        const { channel, text } = z
          .object({
            channel: z.string(),
            text: z.string(),
          })
          .parse(args);

        const result = await makeRequest(
          "slack",
          "POST",
          "/chat.postMessage",
          undefined,
          { channel, text }
        );

        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      isError: true,
    };
  }
});

// Startup
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("API Hub running");
}

main().catch(console.error);
```

## File System Watcher

Monitor file changes and provide intelligent file analysis.

### TypeScript Implementation

```typescript
// src/file-watcher.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs/promises";
import * as path from "path";
import { watch, FSWatcher } from "chokidar";
import { z } from "zod";

// Configuration
const WATCH_DIR = process.env.WATCH_DIR ?? ".";
const IGNORE_PATTERNS = [
  "**/node_modules/**",
  "**/.git/**",
  "**/dist/**",
  "**/*.log",
];

// State
interface FileChange {
  path: string;
  type: "add" | "change" | "unlink";
  timestamp: string;
}

const recentChanges: FileChange[] = [];
let watcher: FSWatcher | null = null;

// Server
const server = new Server(
  { name: "file-watcher", version: "1.0.0" },
  { capabilities: { tools: {}, resources: { subscribe: true } } }
);

// File utilities
async function getFileInfo(filePath: string) {
  const stats = await fs.stat(filePath);
  const content = stats.isFile() ? await fs.readFile(filePath, "utf-8") : null;

  return {
    path: filePath,
    name: path.basename(filePath),
    extension: path.extname(filePath),
    size: stats.size,
    isDirectory: stats.isDirectory(),
    modified: stats.mtime.toISOString(),
    created: stats.birthtime.toISOString(),
    lineCount: content ? content.split("\n").length : 0,
  };
}

async function searchFiles(
  dir: string,
  pattern: RegExp,
  maxDepth = 5
): Promise<string[]> {
  const results: string[] = [];

  async function scan(currentDir: string, depth: number) {
    if (depth > maxDepth) return;

    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      // Skip ignored patterns
      if (IGNORE_PATTERNS.some((p) => fullPath.includes(p.replace(/\*/g, "")))) {
        continue;
      }

      if (entry.isDirectory()) {
        await scan(fullPath, depth + 1);
      } else if (pattern.test(entry.name)) {
        results.push(fullPath);
      }
    }
  }

  await scan(dir, 0);
  return results;
}

// Tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "watch_start",
      description: "Start watching a directory for changes",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "Directory to watch" },
          patterns: {
            type: "array",
            items: { type: "string" },
            description: "Glob patterns to watch",
          },
        },
      },
    },
    {
      name: "watch_stop",
      description: "Stop watching for changes",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "get_recent_changes",
      description: "Get recent file changes",
      inputSchema: {
        type: "object",
        properties: {
          limit: { type: "number", default: 20 },
        },
      },
    },
    {
      name: "read_file",
      description: "Read a file's contents",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "File path" },
          startLine: { type: "number", description: "Start line (1-indexed)" },
          endLine: { type: "number", description: "End line (1-indexed)" },
        },
        required: ["path"],
      },
    },
    {
      name: "search_files",
      description: "Search for files matching a pattern",
      inputSchema: {
        type: "object",
        properties: {
          pattern: { type: "string", description: "File name pattern (regex)" },
          directory: { type: "string", description: "Directory to search" },
        },
        required: ["pattern"],
      },
    },
    {
      name: "get_file_info",
      description: "Get detailed information about a file",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "File path" },
        },
        required: ["path"],
      },
    },
    {
      name: "compare_files",
      description: "Compare two files and show differences",
      inputSchema: {
        type: "object",
        properties: {
          file1: { type: "string" },
          file2: { type: "string" },
        },
        required: ["file1", "file2"],
      },
    },
    {
      name: "list_directory",
      description: "List contents of a directory",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "Directory path" },
          recursive: { type: "boolean", default: false },
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
      case "watch_start": {
        const { path: watchPath, patterns } = z
          .object({
            path: z.string().optional(),
            patterns: z.array(z.string()).optional(),
          })
          .parse(args);

        if (watcher) {
          await watcher.close();
        }

        const targetPath = watchPath ?? WATCH_DIR;
        watcher = watch(targetPath, {
          ignored: IGNORE_PATTERNS,
          persistent: true,
          ignoreInitial: true,
        });

        watcher.on("all", (event, filePath) => {
          if (event === "add" || event === "change" || event === "unlink") {
            recentChanges.unshift({
              path: filePath,
              type: event,
              timestamp: new Date().toISOString(),
            });
            // Keep only last 100 changes
            if (recentChanges.length > 100) recentChanges.pop();
          }
        });

        return {
          content: [{ type: "text", text: `Watching ${targetPath} for changes` }],
        };
      }

      case "watch_stop": {
        if (watcher) {
          await watcher.close();
          watcher = null;
        }
        return {
          content: [{ type: "text", text: "File watching stopped" }],
        };
      }

      case "get_recent_changes": {
        const { limit } = z.object({ limit: z.number().default(20) }).parse(args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(recentChanges.slice(0, limit), null, 2),
            },
          ],
        };
      }

      case "read_file": {
        const { path: filePath, startLine, endLine } = z
          .object({
            path: z.string(),
            startLine: z.number().optional(),
            endLine: z.number().optional(),
          })
          .parse(args);

        const content = await fs.readFile(filePath, "utf-8");
        const lines = content.split("\n");

        if (startLine !== undefined || endLine !== undefined) {
          const start = (startLine ?? 1) - 1;
          const end = endLine ?? lines.length;
          const selected = lines.slice(start, end);
          return {
            content: [
              {
                type: "text",
                text: selected
                  .map((line, i) => `${start + i + 1}: ${line}`)
                  .join("\n"),
              },
            ],
          };
        }

        return {
          content: [{ type: "text", text: content }],
        };
      }

      case "search_files": {
        const { pattern, directory } = z
          .object({
            pattern: z.string(),
            directory: z.string().optional(),
          })
          .parse(args);

        const files = await searchFiles(
          directory ?? WATCH_DIR,
          new RegExp(pattern)
        );

        return {
          content: [{ type: "text", text: JSON.stringify(files, null, 2) }],
        };
      }

      case "get_file_info": {
        const { path: filePath } = z.object({ path: z.string() }).parse(args);
        const info = await getFileInfo(filePath);
        return {
          content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
        };
      }

      case "compare_files": {
        const { file1, file2 } = z
          .object({
            file1: z.string(),
            file2: z.string(),
          })
          .parse(args);

        const content1 = await fs.readFile(file1, "utf-8");
        const content2 = await fs.readFile(file2, "utf-8");
        const lines1 = content1.split("\n");
        const lines2 = content2.split("\n");

        const diff: string[] = [];
        const maxLines = Math.max(lines1.length, lines2.length);

        for (let i = 0; i < maxLines; i++) {
          const line1 = lines1[i] ?? "";
          const line2 = lines2[i] ?? "";

          if (line1 !== line2) {
            diff.push(`Line ${i + 1}:`);
            if (line1) diff.push(`- ${line1}`);
            if (line2) diff.push(`+ ${line2}`);
          }
        }

        return {
          content: [
            {
              type: "text",
              text: diff.length > 0 ? diff.join("\n") : "Files are identical",
            },
          ],
        };
      }

      case "list_directory": {
        const { path: dirPath, recursive } = z
          .object({
            path: z.string(),
            recursive: z.boolean().default(false),
          })
          .parse(args);

        async function listDir(dir: string, depth = 0): Promise<object[]> {
          const entries = await fs.readdir(dir, { withFileTypes: true });
          const result = [];

          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const item: Record<string, unknown> = {
              name: entry.name,
              path: fullPath,
              isDirectory: entry.isDirectory(),
            };

            if (entry.isDirectory() && recursive && depth < 3) {
              item.children = await listDir(fullPath, depth + 1);
            }

            result.push(item);
          }

          return result;
        }

        const listing = await listDir(dirPath);
        return {
          content: [{ type: "text", text: JSON.stringify(listing, null, 2) }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      isError: true,
    };
  }
});

// Resources - expose watched files
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const files = await searchFiles(WATCH_DIR, /\.(ts|js|py|md|json)$/);
  return {
    resources: files.slice(0, 50).map((f) => ({
      uri: `file://${path.resolve(f)}`,
      name: path.basename(f),
      mimeType: "text/plain",
    })),
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  const filePath = uri.replace("file://", "");
  const content = await fs.readFile(filePath, "utf-8");

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

// Startup
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`File watcher running on ${WATCH_DIR}`);
}

main().catch(console.error);
```

## Git Automation

Comprehensive Git operations with branch management, commit analysis, and workflow automation.

### TypeScript Implementation

```typescript
// src/git-automation.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { exec } from "child_process";
import { promisify } from "util";
import { z } from "zod";

const execAsync = promisify(exec);
const REPO_PATH = process.env.REPO_PATH ?? ".";

// Helper: Run git command
async function git(
  args: string,
  options: { cwd?: string; maxBuffer?: number } = {}
): Promise<string> {
  const { stdout, stderr } = await execAsync(`git ${args}`, {
    cwd: options.cwd ?? REPO_PATH,
    maxBuffer: options.maxBuffer ?? 10 * 1024 * 1024,
  });
  if (stderr && !stderr.includes("warning")) {
    console.error("Git stderr:", stderr);
  }
  return stdout.trim();
}

const server = new Server(
  { name: "git-automation", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "git_status",
      description: "Get repository status",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "git_log",
      description: "Get commit history",
      inputSchema: {
        type: "object",
        properties: {
          limit: { type: "number", default: 10 },
          branch: { type: "string" },
          author: { type: "string" },
          since: { type: "string", description: "Date like 2024-01-01" },
          path: { type: "string", description: "Filter by file path" },
        },
      },
    },
    {
      name: "git_diff",
      description: "Show changes between commits or working tree",
      inputSchema: {
        type: "object",
        properties: {
          ref1: { type: "string", description: "First ref (default: HEAD)" },
          ref2: { type: "string", description: "Second ref" },
          file: { type: "string", description: "Specific file" },
          staged: { type: "boolean", description: "Show staged changes" },
        },
      },
    },
    {
      name: "git_branch",
      description: "List, create, or switch branches",
      inputSchema: {
        type: "object",
        properties: {
          action: {
            type: "string",
            enum: ["list", "create", "switch", "delete"],
            default: "list",
          },
          name: { type: "string", description: "Branch name" },
          startPoint: { type: "string", description: "Start point for new branch" },
        },
      },
    },
    {
      name: "git_commit",
      description: "Create a commit",
      inputSchema: {
        type: "object",
        properties: {
          message: { type: "string", description: "Commit message" },
          files: {
            type: "array",
            items: { type: "string" },
            description: "Files to stage (default: all)",
          },
        },
        required: ["message"],
      },
    },
    {
      name: "git_stash",
      description: "Stash changes",
      inputSchema: {
        type: "object",
        properties: {
          action: {
            type: "string",
            enum: ["push", "pop", "list", "drop"],
            default: "push",
          },
          message: { type: "string" },
          index: { type: "number", description: "Stash index for pop/drop" },
        },
      },
    },
    {
      name: "git_blame",
      description: "Show who changed each line of a file",
      inputSchema: {
        type: "object",
        properties: {
          file: { type: "string" },
          startLine: { type: "number" },
          endLine: { type: "number" },
        },
        required: ["file"],
      },
    },
    {
      name: "git_show",
      description: "Show commit details",
      inputSchema: {
        type: "object",
        properties: {
          ref: { type: "string", default: "HEAD" },
        },
      },
    },
    {
      name: "git_remote",
      description: "Manage remotes",
      inputSchema: {
        type: "object",
        properties: {
          action: {
            type: "string",
            enum: ["list", "add", "remove"],
            default: "list",
          },
          name: { type: "string" },
          url: { type: "string" },
        },
      },
    },
    {
      name: "git_analyze_commits",
      description: "Analyze commit patterns and statistics",
      inputSchema: {
        type: "object",
        properties: {
          since: { type: "string", description: "Start date" },
          until: { type: "string", description: "End date" },
        },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "git_status": {
        const status = await git("status --porcelain -b");
        const branch = await git("branch --show-current");
        const ahead = await git("rev-list --count @{u}..HEAD").catch(() => "0");
        const behind = await git("rev-list --count HEAD..@{u}").catch(() => "0");

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  branch,
                  ahead: parseInt(ahead),
                  behind: parseInt(behind),
                  changes: status.split("\n").filter(Boolean),
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "git_log": {
        const { limit, branch, author, since, path: filePath } = z
          .object({
            limit: z.number().default(10),
            branch: z.string().optional(),
            author: z.string().optional(),
            since: z.string().optional(),
            path: z.string().optional(),
          })
          .parse(args);

        let cmd = `log --format="%H|%an|%ae|%at|%s" -n ${limit}`;
        if (branch) cmd += ` ${branch}`;
        if (author) cmd += ` --author="${author}"`;
        if (since) cmd += ` --since="${since}"`;
        if (filePath) cmd += ` -- "${filePath}"`;

        const output = await git(cmd);
        const commits = output.split("\n").filter(Boolean).map((line) => {
          const [hash, author, email, timestamp, message] = line.split("|");
          return {
            hash,
            author,
            email,
            date: new Date(parseInt(timestamp) * 1000).toISOString(),
            message,
          };
        });

        return {
          content: [{ type: "text", text: JSON.stringify(commits, null, 2) }],
        };
      }

      case "git_diff": {
        const { ref1, ref2, file, staged } = z
          .object({
            ref1: z.string().optional(),
            ref2: z.string().optional(),
            file: z.string().optional(),
            staged: z.boolean().optional(),
          })
          .parse(args);

        let cmd = "diff";
        if (staged) cmd += " --staged";
        if (ref1) cmd += ` ${ref1}`;
        if (ref2) cmd += ` ${ref2}`;
        if (file) cmd += ` -- "${file}"`;

        const diff = await git(cmd);
        return {
          content: [{ type: "text", text: diff || "No changes" }],
        };
      }

      case "git_branch": {
        const { action, name: branchName, startPoint } = z
          .object({
            action: z.enum(["list", "create", "switch", "delete"]).default("list"),
            name: z.string().optional(),
            startPoint: z.string().optional(),
          })
          .parse(args);

        switch (action) {
          case "list": {
            const branches = await git("branch -a --format='%(refname:short)|%(upstream:short)|%(committerdate:relative)'");
            const current = await git("branch --show-current");
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      current,
                      branches: branches.split("\n").filter(Boolean).map((b) => {
                        const [name, upstream, date] = b.split("|");
                        return { name, upstream, lastCommit: date };
                      }),
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }
          case "create":
            await git(`branch ${branchName} ${startPoint ?? ""}`);
            return {
              content: [{ type: "text", text: `Created branch ${branchName}` }],
            };
          case "switch":
            await git(`switch ${branchName}`);
            return {
              content: [{ type: "text", text: `Switched to ${branchName}` }],
            };
          case "delete":
            await git(`branch -d ${branchName}`);
            return {
              content: [{ type: "text", text: `Deleted branch ${branchName}` }],
            };
        }
        break;
      }

      case "git_commit": {
        const { message, files } = z
          .object({
            message: z.string(),
            files: z.array(z.string()).optional(),
          })
          .parse(args);

        if (files && files.length > 0) {
          await git(`add ${files.join(" ")}`);
        } else {
          await git("add -A");
        }

        const result = await git(`commit -m "${message.replace(/"/g, '\\"')}"`);
        return {
          content: [{ type: "text", text: result }],
        };
      }

      case "git_stash": {
        const { action, message, index } = z
          .object({
            action: z.enum(["push", "pop", "list", "drop"]).default("push"),
            message: z.string().optional(),
            index: z.number().optional(),
          })
          .parse(args);

        switch (action) {
          case "push": {
            const cmd = message ? `stash push -m "${message}"` : "stash push";
            const result = await git(cmd);
            return { content: [{ type: "text", text: result }] };
          }
          case "pop": {
            const result = await git(`stash pop ${index ?? ""}`);
            return { content: [{ type: "text", text: result }] };
          }
          case "list": {
            const result = await git("stash list");
            return { content: [{ type: "text", text: result || "No stashes" }] };
          }
          case "drop": {
            const result = await git(`stash drop ${index ?? ""}`);
            return { content: [{ type: "text", text: result }] };
          }
        }
        break;
      }

      case "git_blame": {
        const { file, startLine, endLine } = z
          .object({
            file: z.string(),
            startLine: z.number().optional(),
            endLine: z.number().optional(),
          })
          .parse(args);

        let cmd = "blame --line-porcelain";
        if (startLine && endLine) {
          cmd += ` -L ${startLine},${endLine}`;
        }
        cmd += ` "${file}"`;

        const output = await git(cmd);
        return {
          content: [{ type: "text", text: output }],
        };
      }

      case "git_show": {
        const { ref } = z.object({ ref: z.string().default("HEAD") }).parse(args);
        const output = await git(`show ${ref} --stat`);
        return {
          content: [{ type: "text", text: output }],
        };
      }

      case "git_remote": {
        const { action, name: remoteName, url } = z
          .object({
            action: z.enum(["list", "add", "remove"]).default("list"),
            name: z.string().optional(),
            url: z.string().optional(),
          })
          .parse(args);

        switch (action) {
          case "list": {
            const result = await git("remote -v");
            return { content: [{ type: "text", text: result || "No remotes" }] };
          }
          case "add": {
            await git(`remote add ${remoteName} ${url}`);
            return { content: [{ type: "text", text: `Added remote ${remoteName}` }] };
          }
          case "remove": {
            await git(`remote remove ${remoteName}`);
            return { content: [{ type: "text", text: `Removed remote ${remoteName}` }] };
          }
        }
        break;
      }

      case "git_analyze_commits": {
        const { since, until } = z
          .object({
            since: z.string().optional(),
            until: z.string().optional(),
          })
          .parse(args);

        let dateFilter = "";
        if (since) dateFilter += ` --since="${since}"`;
        if (until) dateFilter += ` --until="${until}"`;

        // Get commit stats
        const commitCount = await git(`rev-list --count HEAD${dateFilter}`);
        const authors = await git(`shortlog -sn${dateFilter}`);
        const filesChanged = await git(
          `diff --stat $(git rev-list --max-parents=0 HEAD) HEAD -- 2>/dev/null | tail -1`
        ).catch(() => "");

        // Commits by day of week
        const dayStats = await git(
          `log --format="%ad" --date=format:"%A"${dateFilter}`
        );
        const byDay: Record<string, number> = {};
        dayStats.split("\n").forEach((day) => {
          byDay[day] = (byDay[day] ?? 0) + 1;
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  totalCommits: parseInt(commitCount),
                  topAuthors: authors
                    .split("\n")
                    .slice(0, 5)
                    .map((line) => {
                      const match = line.trim().match(/(\d+)\s+(.+)/);
                      return match
                        ? { commits: parseInt(match[1]), author: match[2] }
                        : null;
                    })
                    .filter(Boolean),
                  commitsByDay: byDay,
                  filesChanged,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      isError: true,
    };
  }
});

// Startup
async function main() {
  // Verify git repo
  await git("rev-parse --git-dir");
  console.error(`Git automation running in ${REPO_PATH}`);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
```

## Docker Management

Manage Docker containers, images, and compose stacks.

### Python Implementation

```python
# docker_manager/__init__.py
"""Docker management MCP server."""

import asyncio
import json
from typing import Any

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

import docker
from docker.errors import DockerException, NotFound

# Initialize Docker client
try:
    client = docker.from_env()
except DockerException as e:
    client = None
    startup_error = str(e)

server = Server("docker-manager")


@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="docker_ps",
            description="List running containers",
            inputSchema={
                "type": "object",
                "properties": {
                    "all": {"type": "boolean", "default": False},
                },
            },
        ),
        Tool(
            name="docker_images",
            description="List Docker images",
            inputSchema={"type": "object", "properties": {}},
        ),
        Tool(
            name="docker_logs",
            description="Get container logs",
            inputSchema={
                "type": "object",
                "properties": {
                    "container": {"type": "string"},
                    "tail": {"type": "number", "default": 100},
                    "since": {"type": "string", "description": "Timestamp or relative (e.g., '10m')"},
                },
                "required": ["container"],
            },
        ),
        Tool(
            name="docker_exec",
            description="Execute a command in a container",
            inputSchema={
                "type": "object",
                "properties": {
                    "container": {"type": "string"},
                    "command": {"type": "string"},
                },
                "required": ["container", "command"],
            },
        ),
        Tool(
            name="docker_start",
            description="Start a stopped container",
            inputSchema={
                "type": "object",
                "properties": {
                    "container": {"type": "string"},
                },
                "required": ["container"],
            },
        ),
        Tool(
            name="docker_stop",
            description="Stop a running container",
            inputSchema={
                "type": "object",
                "properties": {
                    "container": {"type": "string"},
                    "timeout": {"type": "number", "default": 10},
                },
                "required": ["container"],
            },
        ),
        Tool(
            name="docker_restart",
            description="Restart a container",
            inputSchema={
                "type": "object",
                "properties": {
                    "container": {"type": "string"},
                },
                "required": ["container"],
            },
        ),
        Tool(
            name="docker_inspect",
            description="Get detailed container information",
            inputSchema={
                "type": "object",
                "properties": {
                    "container": {"type": "string"},
                },
                "required": ["container"],
            },
        ),
        Tool(
            name="docker_stats",
            description="Get container resource usage",
            inputSchema={
                "type": "object",
                "properties": {
                    "container": {"type": "string"},
                },
            },
        ),
        Tool(
            name="docker_compose_up",
            description="Start docker-compose services",
            inputSchema={
                "type": "object",
                "properties": {
                    "file": {"type": "string", "default": "docker-compose.yml"},
                    "services": {"type": "array", "items": {"type": "string"}},
                    "detach": {"type": "boolean", "default": True},
                },
            },
        ),
        Tool(
            name="docker_compose_down",
            description="Stop docker-compose services",
            inputSchema={
                "type": "object",
                "properties": {
                    "file": {"type": "string", "default": "docker-compose.yml"},
                    "volumes": {"type": "boolean", "default": False},
                },
            },
        ),
        Tool(
            name="docker_network_list",
            description="List Docker networks",
            inputSchema={"type": "object", "properties": {}},
        ),
        Tool(
            name="docker_volume_list",
            description="List Docker volumes",
            inputSchema={"type": "object", "properties": {}},
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    if client is None:
        return [TextContent(type="text", text=f"Docker not available: {startup_error}")]

    try:
        match name:
            case "docker_ps":
                all_containers = arguments.get("all", False)
                containers = client.containers.list(all=all_containers)
                result = [
                    {
                        "id": c.short_id,
                        "name": c.name,
                        "image": c.image.tags[0] if c.image.tags else c.image.short_id,
                        "status": c.status,
                        "ports": c.ports,
                    }
                    for c in containers
                ]
                return [TextContent(type="text", text=json.dumps(result, indent=2))]

            case "docker_images":
                images = client.images.list()
                result = [
                    {
                        "id": img.short_id,
                        "tags": img.tags,
                        "size": f"{img.attrs['Size'] / 1024 / 1024:.1f}MB",
                        "created": img.attrs["Created"],
                    }
                    for img in images
                ]
                return [TextContent(type="text", text=json.dumps(result, indent=2))]

            case "docker_logs":
                container = client.containers.get(arguments["container"])
                logs = container.logs(
                    tail=arguments.get("tail", 100),
                    since=arguments.get("since"),
                ).decode("utf-8")
                return [TextContent(type="text", text=logs)]

            case "docker_exec":
                container = client.containers.get(arguments["container"])
                exit_code, output = container.exec_run(arguments["command"])
                return [
                    TextContent(
                        type="text",
                        text=f"Exit code: {exit_code}\n\n{output.decode('utf-8')}",
                    )
                ]

            case "docker_start":
                container = client.containers.get(arguments["container"])
                container.start()
                return [TextContent(type="text", text=f"Started {container.name}")]

            case "docker_stop":
                container = client.containers.get(arguments["container"])
                container.stop(timeout=arguments.get("timeout", 10))
                return [TextContent(type="text", text=f"Stopped {container.name}")]

            case "docker_restart":
                container = client.containers.get(arguments["container"])
                container.restart()
                return [TextContent(type="text", text=f"Restarted {container.name}")]

            case "docker_inspect":
                container = client.containers.get(arguments["container"])
                return [
                    TextContent(
                        type="text",
                        text=json.dumps(container.attrs, indent=2),
                    )
                ]

            case "docker_stats":
                container_name = arguments.get("container")
                if container_name:
                    container = client.containers.get(container_name)
                    stats = container.stats(stream=False)
                    return [TextContent(type="text", text=json.dumps(stats, indent=2))]
                else:
                    # All containers
                    results = []
                    for container in client.containers.list():
                        stats = container.stats(stream=False)
                        cpu_delta = (
                            stats["cpu_stats"]["cpu_usage"]["total_usage"]
                            - stats["precpu_stats"]["cpu_usage"]["total_usage"]
                        )
                        system_delta = (
                            stats["cpu_stats"]["system_cpu_usage"]
                            - stats["precpu_stats"]["system_cpu_usage"]
                        )
                        cpu_percent = (
                            (cpu_delta / system_delta) * 100
                            if system_delta > 0
                            else 0
                        )

                        mem_usage = stats["memory_stats"].get("usage", 0)
                        mem_limit = stats["memory_stats"].get("limit", 1)

                        results.append(
                            {
                                "name": container.name,
                                "cpu_percent": f"{cpu_percent:.2f}%",
                                "memory": f"{mem_usage / 1024 / 1024:.1f}MB / {mem_limit / 1024 / 1024:.1f}MB",
                            }
                        )
                    return [TextContent(type="text", text=json.dumps(results, indent=2))]

            case "docker_compose_up":
                import subprocess

                file = arguments.get("file", "docker-compose.yml")
                services = arguments.get("services", [])
                detach = arguments.get("detach", True)

                cmd = ["docker-compose", "-f", file, "up"]
                if detach:
                    cmd.append("-d")
                cmd.extend(services)

                result = subprocess.run(cmd, capture_output=True, text=True)
                return [
                    TextContent(
                        type="text",
                        text=f"stdout:\n{result.stdout}\n\nstderr:\n{result.stderr}",
                    )
                ]

            case "docker_compose_down":
                import subprocess

                file = arguments.get("file", "docker-compose.yml")
                volumes = arguments.get("volumes", False)

                cmd = ["docker-compose", "-f", file, "down"]
                if volumes:
                    cmd.append("-v")

                result = subprocess.run(cmd, capture_output=True, text=True)
                return [
                    TextContent(
                        type="text",
                        text=f"stdout:\n{result.stdout}\n\nstderr:\n{result.stderr}",
                    )
                ]

            case "docker_network_list":
                networks = client.networks.list()
                result = [
                    {
                        "id": n.short_id,
                        "name": n.name,
                        "driver": n.attrs["Driver"],
                        "scope": n.attrs["Scope"],
                    }
                    for n in networks
                ]
                return [TextContent(type="text", text=json.dumps(result, indent=2))]

            case "docker_volume_list":
                volumes = client.volumes.list()
                result = [
                    {
                        "name": v.name,
                        "driver": v.attrs["Driver"],
                        "mountpoint": v.attrs["Mountpoint"],
                    }
                    for v in volumes
                ]
                return [TextContent(type="text", text=json.dumps(result, indent=2))]

            case _:
                return [TextContent(type="text", text=f"Unknown tool: {name}")]

    except NotFound as e:
        return [TextContent(type="text", text=f"Not found: {e}")]
    except DockerException as e:
        return [TextContent(type="text", text=f"Docker error: {e}")]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {e}")]


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

## Kubernetes Operations

Manage Kubernetes clusters, deployments, and troubleshooting.

### TypeScript Implementation

```typescript
// src/kubernetes-ops.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as k8s from "@kubernetes/client-node";
import { z } from "zod";

// Initialize Kubernetes client
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const coreV1 = kc.makeApiClient(k8s.CoreV1Api);
const appsV1 = kc.makeApiClient(k8s.AppsV1Api);
const batchV1 = kc.makeApiClient(k8s.BatchV1Api);

const server = new Server(
  { name: "kubernetes-ops", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "k8s_get_pods",
      description: "List pods in a namespace",
      inputSchema: {
        type: "object",
        properties: {
          namespace: { type: "string", default: "default" },
          labelSelector: { type: "string" },
        },
      },
    },
    {
      name: "k8s_get_deployments",
      description: "List deployments",
      inputSchema: {
        type: "object",
        properties: {
          namespace: { type: "string", default: "default" },
        },
      },
    },
    {
      name: "k8s_get_services",
      description: "List services",
      inputSchema: {
        type: "object",
        properties: {
          namespace: { type: "string", default: "default" },
        },
      },
    },
    {
      name: "k8s_get_logs",
      description: "Get pod logs",
      inputSchema: {
        type: "object",
        properties: {
          pod: { type: "string" },
          namespace: { type: "string", default: "default" },
          container: { type: "string" },
          tailLines: { type: "number", default: 100 },
          since: { type: "string", description: "Duration like 1h, 30m" },
        },
        required: ["pod"],
      },
    },
    {
      name: "k8s_describe_pod",
      description: "Get detailed pod information",
      inputSchema: {
        type: "object",
        properties: {
          pod: { type: "string" },
          namespace: { type: "string", default: "default" },
        },
        required: ["pod"],
      },
    },
    {
      name: "k8s_scale_deployment",
      description: "Scale a deployment",
      inputSchema: {
        type: "object",
        properties: {
          deployment: { type: "string" },
          replicas: { type: "number" },
          namespace: { type: "string", default: "default" },
        },
        required: ["deployment", "replicas"],
      },
    },
    {
      name: "k8s_restart_deployment",
      description: "Restart a deployment (rolling restart)",
      inputSchema: {
        type: "object",
        properties: {
          deployment: { type: "string" },
          namespace: { type: "string", default: "default" },
        },
        required: ["deployment"],
      },
    },
    {
      name: "k8s_get_events",
      description: "Get cluster events",
      inputSchema: {
        type: "object",
        properties: {
          namespace: { type: "string" },
          limit: { type: "number", default: 50 },
        },
      },
    },
    {
      name: "k8s_get_nodes",
      description: "List cluster nodes",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "k8s_get_namespaces",
      description: "List all namespaces",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "k8s_exec",
      description: "Execute command in a pod",
      inputSchema: {
        type: "object",
        properties: {
          pod: { type: "string" },
          namespace: { type: "string", default: "default" },
          container: { type: "string" },
          command: { type: "array", items: { type: "string" } },
        },
        required: ["pod", "command"],
      },
    },
    {
      name: "k8s_apply_yaml",
      description: "Apply a YAML manifest",
      inputSchema: {
        type: "object",
        properties: {
          yaml: { type: "string", description: "YAML manifest content" },
        },
        required: ["yaml"],
      },
    },
    {
      name: "k8s_delete_pod",
      description: "Delete a pod",
      inputSchema: {
        type: "object",
        properties: {
          pod: { type: "string" },
          namespace: { type: "string", default: "default" },
        },
        required: ["pod"],
      },
    },
  ],
}));

// Helper: Format pod status
function formatPodStatus(pod: k8s.V1Pod): object {
  const containerStatuses = pod.status?.containerStatuses ?? [];
  return {
    name: pod.metadata?.name,
    namespace: pod.metadata?.namespace,
    phase: pod.status?.phase,
    ready: containerStatuses.every((c) => c.ready),
    restarts: containerStatuses.reduce((sum, c) => sum + c.restartCount, 0),
    age: pod.metadata?.creationTimestamp,
    ip: pod.status?.podIP,
    node: pod.spec?.nodeName,
    containers: containerStatuses.map((c) => ({
      name: c.name,
      ready: c.ready,
      restarts: c.restartCount,
      state: Object.keys(c.state ?? {})[0],
    })),
  };
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "k8s_get_pods": {
        const { namespace, labelSelector } = z
          .object({
            namespace: z.string().default("default"),
            labelSelector: z.string().optional(),
          })
          .parse(args);

        const response = await coreV1.listNamespacedPod(
          namespace,
          undefined,
          undefined,
          undefined,
          undefined,
          labelSelector
        );

        const pods = response.body.items.map(formatPodStatus);
        return {
          content: [{ type: "text", text: JSON.stringify(pods, null, 2) }],
        };
      }

      case "k8s_get_deployments": {
        const { namespace } = z
          .object({ namespace: z.string().default("default") })
          .parse(args);

        const response = await appsV1.listNamespacedDeployment(namespace);
        const deployments = response.body.items.map((d) => ({
          name: d.metadata?.name,
          replicas: d.status?.replicas ?? 0,
          ready: d.status?.readyReplicas ?? 0,
          available: d.status?.availableReplicas ?? 0,
          age: d.metadata?.creationTimestamp,
        }));

        return {
          content: [{ type: "text", text: JSON.stringify(deployments, null, 2) }],
        };
      }

      case "k8s_get_services": {
        const { namespace } = z
          .object({ namespace: z.string().default("default") })
          .parse(args);

        const response = await coreV1.listNamespacedService(namespace);
        const services = response.body.items.map((s) => ({
          name: s.metadata?.name,
          type: s.spec?.type,
          clusterIP: s.spec?.clusterIP,
          ports: s.spec?.ports?.map((p) => ({
            port: p.port,
            targetPort: p.targetPort,
            protocol: p.protocol,
          })),
        }));

        return {
          content: [{ type: "text", text: JSON.stringify(services, null, 2) }],
        };
      }

      case "k8s_get_logs": {
        const { pod, namespace, container, tailLines, since } = z
          .object({
            pod: z.string(),
            namespace: z.string().default("default"),
            container: z.string().optional(),
            tailLines: z.number().default(100),
            since: z.string().optional(),
          })
          .parse(args);

        let sinceSeconds: number | undefined;
        if (since) {
          const match = since.match(/(\d+)([hms])/);
          if (match) {
            const value = parseInt(match[1]);
            const unit = match[2];
            sinceSeconds =
              unit === "h" ? value * 3600 : unit === "m" ? value * 60 : value;
          }
        }

        const response = await coreV1.readNamespacedPodLog(
          pod,
          namespace,
          container,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          sinceSeconds,
          tailLines
        );

        return {
          content: [{ type: "text", text: response.body }],
        };
      }

      case "k8s_describe_pod": {
        const { pod, namespace } = z
          .object({
            pod: z.string(),
            namespace: z.string().default("default"),
          })
          .parse(args);

        const response = await coreV1.readNamespacedPod(pod, namespace);
        return {
          content: [
            { type: "text", text: JSON.stringify(response.body, null, 2) },
          ],
        };
      }

      case "k8s_scale_deployment": {
        const { deployment, replicas, namespace } = z
          .object({
            deployment: z.string(),
            replicas: z.number(),
            namespace: z.string().default("default"),
          })
          .parse(args);

        await appsV1.patchNamespacedDeploymentScale(
          deployment,
          namespace,
          { spec: { replicas } },
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          { headers: { "Content-Type": "application/strategic-merge-patch+json" } }
        );

        return {
          content: [
            { type: "text", text: `Scaled ${deployment} to ${replicas} replicas` },
          ],
        };
      }

      case "k8s_restart_deployment": {
        const { deployment, namespace } = z
          .object({
            deployment: z.string(),
            namespace: z.string().default("default"),
          })
          .parse(args);

        // Trigger rolling restart by updating annotation
        await appsV1.patchNamespacedDeployment(
          deployment,
          namespace,
          {
            spec: {
              template: {
                metadata: {
                  annotations: {
                    "kubectl.kubernetes.io/restartedAt": new Date().toISOString(),
                  },
                },
              },
            },
          },
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          { headers: { "Content-Type": "application/strategic-merge-patch+json" } }
        );

        return {
          content: [{ type: "text", text: `Restarted ${deployment}` }],
        };
      }

      case "k8s_get_events": {
        const { namespace, limit } = z
          .object({
            namespace: z.string().optional(),
            limit: z.number().default(50),
          })
          .parse(args);

        const response = namespace
          ? await coreV1.listNamespacedEvent(namespace, undefined, undefined, undefined, undefined, undefined, limit)
          : await coreV1.listEventForAllNamespaces(undefined, undefined, undefined, undefined, limit);

        const events = response.body.items
          .sort(
            (a, b) =>
              new Date(b.lastTimestamp ?? 0).getTime() -
              new Date(a.lastTimestamp ?? 0).getTime()
          )
          .map((e) => ({
            namespace: e.metadata?.namespace,
            name: e.involvedObject?.name,
            kind: e.involvedObject?.kind,
            type: e.type,
            reason: e.reason,
            message: e.message,
            count: e.count,
            lastSeen: e.lastTimestamp,
          }));

        return {
          content: [{ type: "text", text: JSON.stringify(events, null, 2) }],
        };
      }

      case "k8s_get_nodes": {
        const response = await coreV1.listNode();
        const nodes = response.body.items.map((n) => ({
          name: n.metadata?.name,
          status: n.status?.conditions?.find((c) => c.type === "Ready")?.status,
          version: n.status?.nodeInfo?.kubeletVersion,
          os: n.status?.nodeInfo?.osImage,
          cpu: n.status?.capacity?.cpu,
          memory: n.status?.capacity?.memory,
        }));

        return {
          content: [{ type: "text", text: JSON.stringify(nodes, null, 2) }],
        };
      }

      case "k8s_get_namespaces": {
        const response = await coreV1.listNamespace();
        const namespaces = response.body.items.map((n) => ({
          name: n.metadata?.name,
          status: n.status?.phase,
          age: n.metadata?.creationTimestamp,
        }));

        return {
          content: [{ type: "text", text: JSON.stringify(namespaces, null, 2) }],
        };
      }

      case "k8s_delete_pod": {
        const { pod, namespace } = z
          .object({
            pod: z.string(),
            namespace: z.string().default("default"),
          })
          .parse(args);

        await coreV1.deleteNamespacedPod(pod, namespace);
        return {
          content: [{ type: "text", text: `Deleted pod ${pod}` }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      isError: true,
    };
  }
});

// Startup
async function main() {
  console.error(`Kubernetes ops connected to ${kc.getCurrentCluster()?.name}`);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
```

## Cloud Provider Integration (AWS)

Manage AWS resources with comprehensive SDK integration.

### TypeScript Implementation

```typescript
// src/aws-manager.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  EC2Client,
  DescribeInstancesCommand,
  StartInstancesCommand,
  StopInstancesCommand,
  DescribeSecurityGroupsCommand,
} from "@aws-sdk/client-ec2";
import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import {
  LambdaClient,
  ListFunctionsCommand,
  InvokeCommand,
} from "@aws-sdk/client-lambda";
import {
  CloudWatchLogsClient,
  DescribeLogGroupsCommand,
  GetLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";
import { z } from "zod";

// Initialize AWS clients
const region = process.env.AWS_REGION ?? "us-east-1";
const ec2 = new EC2Client({ region });
const s3 = new S3Client({ region });
const lambda = new LambdaClient({ region });
const cloudwatch = new CloudWatchLogsClient({ region });

const server = new Server(
  { name: "aws-manager", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // EC2
    {
      name: "ec2_list_instances",
      description: "List EC2 instances",
      inputSchema: {
        type: "object",
        properties: {
          state: {
            type: "string",
            enum: ["running", "stopped", "all"],
            default: "all",
          },
        },
      },
    },
    {
      name: "ec2_start_instance",
      description: "Start an EC2 instance",
      inputSchema: {
        type: "object",
        properties: { instanceId: { type: "string" } },
        required: ["instanceId"],
      },
    },
    {
      name: "ec2_stop_instance",
      description: "Stop an EC2 instance",
      inputSchema: {
        type: "object",
        properties: { instanceId: { type: "string" } },
        required: ["instanceId"],
      },
    },
    // S3
    {
      name: "s3_list_buckets",
      description: "List S3 buckets",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "s3_list_objects",
      description: "List objects in an S3 bucket",
      inputSchema: {
        type: "object",
        properties: {
          bucket: { type: "string" },
          prefix: { type: "string" },
          maxKeys: { type: "number", default: 100 },
        },
        required: ["bucket"],
      },
    },
    {
      name: "s3_get_object",
      description: "Get an object from S3",
      inputSchema: {
        type: "object",
        properties: {
          bucket: { type: "string" },
          key: { type: "string" },
        },
        required: ["bucket", "key"],
      },
    },
    {
      name: "s3_put_object",
      description: "Put an object to S3",
      inputSchema: {
        type: "object",
        properties: {
          bucket: { type: "string" },
          key: { type: "string" },
          content: { type: "string" },
          contentType: { type: "string", default: "text/plain" },
        },
        required: ["bucket", "key", "content"],
      },
    },
    // Lambda
    {
      name: "lambda_list_functions",
      description: "List Lambda functions",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "lambda_invoke",
      description: "Invoke a Lambda function",
      inputSchema: {
        type: "object",
        properties: {
          functionName: { type: "string" },
          payload: { type: "object" },
        },
        required: ["functionName"],
      },
    },
    // CloudWatch
    {
      name: "cloudwatch_list_log_groups",
      description: "List CloudWatch log groups",
      inputSchema: {
        type: "object",
        properties: {
          prefix: { type: "string" },
        },
      },
    },
    {
      name: "cloudwatch_get_logs",
      description: "Get logs from CloudWatch",
      inputSchema: {
        type: "object",
        properties: {
          logGroup: { type: "string" },
          logStream: { type: "string" },
          limit: { type: "number", default: 100 },
        },
        required: ["logGroup"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // EC2
      case "ec2_list_instances": {
        const { state } = z
          .object({ state: z.string().default("all") })
          .parse(args);

        const command = new DescribeInstancesCommand({
          Filters:
            state !== "all"
              ? [{ Name: "instance-state-name", Values: [state] }]
              : undefined,
        });

        const response = await ec2.send(command);
        const instances =
          response.Reservations?.flatMap((r) =>
            r.Instances?.map((i) => ({
              id: i.InstanceId,
              type: i.InstanceType,
              state: i.State?.Name,
              publicIp: i.PublicIpAddress,
              privateIp: i.PrivateIpAddress,
              name: i.Tags?.find((t) => t.Key === "Name")?.Value,
              launchTime: i.LaunchTime,
            }))
          ) ?? [];

        return {
          content: [{ type: "text", text: JSON.stringify(instances, null, 2) }],
        };
      }

      case "ec2_start_instance": {
        const { instanceId } = z
          .object({ instanceId: z.string() })
          .parse(args);

        await ec2.send(new StartInstancesCommand({ InstanceIds: [instanceId] }));
        return {
          content: [{ type: "text", text: `Started instance ${instanceId}` }],
        };
      }

      case "ec2_stop_instance": {
        const { instanceId } = z
          .object({ instanceId: z.string() })
          .parse(args);

        await ec2.send(new StopInstancesCommand({ InstanceIds: [instanceId] }));
        return {
          content: [{ type: "text", text: `Stopped instance ${instanceId}` }],
        };
      }

      // S3
      case "s3_list_buckets": {
        const response = await s3.send(new ListBucketsCommand({}));
        const buckets =
          response.Buckets?.map((b) => ({
            name: b.Name,
            createdAt: b.CreationDate,
          })) ?? [];

        return {
          content: [{ type: "text", text: JSON.stringify(buckets, null, 2) }],
        };
      }

      case "s3_list_objects": {
        const { bucket, prefix, maxKeys } = z
          .object({
            bucket: z.string(),
            prefix: z.string().optional(),
            maxKeys: z.number().default(100),
          })
          .parse(args);

        const response = await s3.send(
          new ListObjectsV2Command({
            Bucket: bucket,
            Prefix: prefix,
            MaxKeys: maxKeys,
          })
        );

        const objects =
          response.Contents?.map((o) => ({
            key: o.Key,
            size: o.Size,
            lastModified: o.LastModified,
          })) ?? [];

        return {
          content: [{ type: "text", text: JSON.stringify(objects, null, 2) }],
        };
      }

      case "s3_get_object": {
        const { bucket, key } = z
          .object({
            bucket: z.string(),
            key: z.string(),
          })
          .parse(args);

        const response = await s3.send(
          new GetObjectCommand({ Bucket: bucket, Key: key })
        );

        const content = await response.Body?.transformToString();
        return {
          content: [{ type: "text", text: content ?? "" }],
        };
      }

      case "s3_put_object": {
        const { bucket, key, content, contentType } = z
          .object({
            bucket: z.string(),
            key: z.string(),
            content: z.string(),
            contentType: z.string().default("text/plain"),
          })
          .parse(args);

        await s3.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: content,
            ContentType: contentType,
          })
        );

        return {
          content: [{ type: "text", text: `Uploaded to s3://${bucket}/${key}` }],
        };
      }

      // Lambda
      case "lambda_list_functions": {
        const response = await lambda.send(new ListFunctionsCommand({}));
        const functions =
          response.Functions?.map((f) => ({
            name: f.FunctionName,
            runtime: f.Runtime,
            memory: f.MemorySize,
            timeout: f.Timeout,
            lastModified: f.LastModified,
          })) ?? [];

        return {
          content: [{ type: "text", text: JSON.stringify(functions, null, 2) }],
        };
      }

      case "lambda_invoke": {
        const { functionName, payload } = z
          .object({
            functionName: z.string(),
            payload: z.record(z.unknown()).optional(),
          })
          .parse(args);

        const response = await lambda.send(
          new InvokeCommand({
            FunctionName: functionName,
            Payload: payload ? JSON.stringify(payload) : undefined,
          })
        );

        const result = response.Payload
          ? JSON.parse(new TextDecoder().decode(response.Payload))
          : null;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  statusCode: response.StatusCode,
                  result,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      // CloudWatch
      case "cloudwatch_list_log_groups": {
        const { prefix } = z
          .object({ prefix: z.string().optional() })
          .parse(args);

        const response = await cloudwatch.send(
          new DescribeLogGroupsCommand({
            logGroupNamePrefix: prefix,
          })
        );

        const groups =
          response.logGroups?.map((g) => ({
            name: g.logGroupName,
            storedBytes: g.storedBytes,
            retentionDays: g.retentionInDays,
          })) ?? [];

        return {
          content: [{ type: "text", text: JSON.stringify(groups, null, 2) }],
        };
      }

      case "cloudwatch_get_logs": {
        const { logGroup, logStream, limit } = z
          .object({
            logGroup: z.string(),
            logStream: z.string().optional(),
            limit: z.number().default(100),
          })
          .parse(args);

        // If no stream specified, get the latest
        let streamName = logStream;
        if (!streamName) {
          const { logStreams } = await cloudwatch.send(
            new DescribeLogGroupsCommand({ logGroupNamePrefix: logGroup })
          );
          streamName = logStreams?.[0]?.logStreamName;
        }

        if (!streamName) {
          return {
            content: [{ type: "text", text: "No log streams found" }],
          };
        }

        const response = await cloudwatch.send(
          new GetLogEventsCommand({
            logGroupName: logGroup,
            logStreamName: streamName,
            limit,
          })
        );

        const events =
          response.events?.map((e) => ({
            timestamp: e.timestamp
              ? new Date(e.timestamp).toISOString()
              : null,
            message: e.message,
          })) ?? [];

        return {
          content: [{ type: "text", text: JSON.stringify(events, null, 2) }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      isError: true,
    };
  }
});

// Startup
async function main() {
  console.error(`AWS manager running in ${region}`);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
```

## Configuration Examples

### Combined Setup

Use multiple recipe servers together:

```json
{
  "mcpServers": {
    "database": {
      "command": "node",
      "args": ["./mcp-servers/database-assistant/dist/index.js"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    },
    "api-hub": {
      "command": "node",
      "args": ["./mcp-servers/api-hub/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}",
        "SLACK_TOKEN": "${SLACK_TOKEN}"
      }
    },
    "file-watcher": {
      "command": "node",
      "args": ["./mcp-servers/file-watcher/dist/index.js"],
      "env": {
        "WATCH_DIR": "${PWD}"
      }
    },
    "git": {
      "command": "node",
      "args": ["./mcp-servers/git-automation/dist/index.js"],
      "env": {
        "REPO_PATH": "${PWD}"
      }
    },
    "docker": {
      "command": "python",
      "args": ["-m", "docker_manager"]
    },
    "kubernetes": {
      "command": "node",
      "args": ["./mcp-servers/kubernetes-ops/dist/index.js"]
    },
    "aws": {
      "command": "node",
      "args": ["./mcp-servers/aws-manager/dist/index.js"],
      "env": {
        "AWS_REGION": "${AWS_REGION}"
      }
    }
  }
}
```

## Next Steps

- [Building Servers](/mcp/building-servers)
- [Advanced Patterns](/mcp/advanced-patterns)
- [MCP Configuration](/mcp/configuration)
