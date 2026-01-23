---
sidebar_position: 6
title: Essential MCP Servers
description: Supercharge Claude Code with Model Context Protocol servers
format: md
---

# Essential MCP Servers

Learn how to extend Claude Code's capabilities with Model Context Protocol (MCP) servers that give Claude access to databases, APIs, file systems, and more.

**What you'll learn:**
- What MCP servers are and why they matter
- Installing and configuring essential servers
- Using MCP tools in your workflows
- Building custom MCP servers

**Time:** 15 minutes

---

## What is MCP?

Model Context Protocol (MCP) is an open standard that lets Claude Code connect to external tools and data sources. Think of MCP servers as plugins that give Claude new abilities:

- **Read from databases** - Query PostgreSQL, SQLite, MongoDB directly
- **Access file systems** - Browse and manipulate files beyond the current directory
- **Call APIs** - Interact with GitHub, Slack, Jira, and custom services
- **Run specialized tools** - Execute code analysis, linting, testing frameworks

```mermaid
flowchart TD
    A[Claude Code] --> B[Database Server]
    A --> C[GitHub Server]
    A --> D[File System]

    style A fill:#e0e7ff,stroke:#6366f1
    style B fill:#dbeafe,stroke:#3b82f6
    style C fill:#dbeafe,stroke:#3b82f6
    style D fill:#dbeafe,stroke:#3b82f6
```

---

## Setting Up Your First MCP Server

### Step 1: Configure MCP in Claude Code

Create or edit your MCP configuration file:

```bash
# Global configuration (all projects)
mkdir -p ~/.claude
touch ~/.claude/mcp_servers.json

# Or project-specific
touch .claude/mcp_servers.json
```

### Step 2: Add a Server Configuration

```json title="~/.claude/mcp_servers.json"
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/directory"]
    }
  }
}
```

### Step 3: Restart Claude Code

```bash
# Exit and restart to load new MCP servers
claude
```

You'll see available MCP tools when Claude starts.

---

## Essential MCP Servers

### 1. Filesystem Server

Access files outside your current working directory:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem",
               "/home/user/projects",
               "/home/user/documents"]
    }
  }
}
```

**Use cases:**
- Access configuration files in home directory
- Read documentation from other projects
- Manage files across multiple locations

**Example prompt:**
```
> Read my SSH config file and explain the settings
```

### 2. GitHub Server

Full GitHub integration beyond basic git:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

**Use cases:**
- Create and manage issues
- Review PRs across repositories
- Search code across your organization
- Manage releases and workflows

**Example prompts:**
```
> Create an issue for the login bug we discussed
> Find all open PRs that modify authentication code
> List my assigned issues across all repos
```

### 3. PostgreSQL Server

Direct database access:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@localhost/mydb"
      }
    }
  }
}
```

**Use cases:**
- Explore database schemas
- Write and test queries
- Debug data issues
- Generate migrations

**Example prompts:**
```
> Show me the schema for the users table
> Find all orders from the last 24 hours with status 'pending'
> Write a migration to add an 'email_verified' column
```

### 4. SQLite Server

For local databases:

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "--db-path", "./data/app.db"]
    }
  }
}
```

### 5. Memory Server

Persistent memory across sessions:

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

**Use cases:**
- Remember project context between sessions
- Store user preferences
- Track ongoing tasks

**Example prompts:**
```
> Remember that our API uses camelCase for all endpoints
> What do you remember about this project?
```

---

## Community MCP Servers

### Context7 - Documentation Fetcher

Get up-to-date library documentation:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@anthropic/context7-mcp"]
    }
  }
}
```

**Example prompts:**
```
> Get the latest React 19 documentation for Server Components
> Show me the Prisma documentation for migrations
```

### Desktop Commander

Enhanced system control:

```json
{
  "mcpServers": {
    "desktop-commander": {
      "command": "npx",
      "args": ["-y", "desktop-commander-mcp"]
    }
  }
}
```

**Capabilities:**
- Run long-running processes
- Manage terminal sessions
- Control desktop applications

### Brave Search

Web search integration:

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@anthropic/brave-search-mcp"],
      "env": {
        "BRAVE_API_KEY": "your_api_key"
      }
    }
  }
}
```

---

## Full Configuration Example

Here's a complete MCP setup for a typical development environment:

```json title="~/.claude/mcp_servers.json"
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem",
               "/home/user/projects",
               "/home/user/.config"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${DATABASE_URL}"
      }
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

**Tip:** Use environment variables (`${VAR_NAME}`) for sensitive data instead of hardcoding.

---

## Using MCP Tools

### Discovering Available Tools

```
> What MCP tools do you have access to?
```

Claude will list all connected servers and their capabilities.

### Tool-Specific Commands

```
> Use the GitHub server to list my open PRs
> Query the database for users created today
> Search my filesystem for all .env files
```

### Combining Tools

MCP servers work together:

```
> Find the database schema for 'orders', then create a GitHub issue
> describing the missing index we need for the status column
```

---

## Troubleshooting

### Server Won't Start

```bash
# Check if the server runs manually
npx -y @modelcontextprotocol/server-filesystem /tmp

# Check Claude Code logs
claude --mcp-debug
```

### Permission Errors

Ensure the MCP server has access to the resources it needs:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem",
               "/path/with/read/access"]
    }
  }
}
```

### Environment Variables Not Loading

Use absolute paths for env files or export variables before running Claude:

```bash
export GITHUB_TOKEN="ghp_xxx"
export DATABASE_URL="postgresql://..."
claude
```

---

## Building Custom MCP Servers

Create servers for your specific needs:

### Basic Server Template (TypeScript)

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "my-custom-server",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

// Define a tool
server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "my_tool",
    description: "Does something useful",
    inputSchema: {
      type: "object",
      properties: {
        input: { type: "string", description: "The input" }
      },
      required: ["input"]
    }
  }]
}));

// Handle tool calls
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "my_tool") {
    const input = request.params.arguments.input;
    return { content: [{ type: "text", text: `Processed: ${input}` }] };
  }
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Register Your Custom Server

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/path/to/my-server/index.js"]
    }
  }
}
```

---

## Quick Reference

```json
// Filesystem access
"filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path"]
}

// GitHub integration
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "token" }
}

// PostgreSQL database
"postgres": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres"],
  "env": { "POSTGRES_CONNECTION_STRING": "connection_string" }
}

// SQLite database
"sqlite": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-sqlite", "--db-path", "./db.sqlite"]
}

// Persistent memory
"memory": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-memory"]
}
```

---

## Next Steps

1. **[Hooks & Automation](/tutorials/hooks-automation)** - Trigger MCP actions automatically
2. **[Headless CI/CD](/tutorials/headless-cicd)** - Use MCP in pipelines
3. **[Custom Commands](/tutorials/custom-commands)** - Combine MCP with slash commands

---

## Resources

- [MCP Specification](https://modelcontextprotocol.io)
- [Official MCP Servers](https://github.com/modelcontextprotocol/servers)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Community MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
