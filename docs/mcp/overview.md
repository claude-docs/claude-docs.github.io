---
sidebar_position: 1
title: MCP Overview
description: Introduction to the Model Context Protocol
---

# Model Context Protocol Overview

The Model Context Protocol (MCP) is an open standard for connecting AI systems to external tools and data sources. It enables Claude Code to interact with databases, APIs, file systems, and more.

## What is MCP?

MCP provides a standardized way for AI applications to:

- **Access external data** - Query databases, read files, fetch web content
- **Execute actions** - Run commands, send notifications, create resources
- **Maintain context** - Keep connections across conversation turns

## Architecture

MCP uses a client-server architecture:

```
┌─────────────────┐     JSON-RPC     ┌─────────────────┐
│   Claude Code   │◄────────────────►│   MCP Server    │
│   (MCP Client)  │                  │   (Tool Provider)│
└─────────────────┘                  └─────────────────┘
                                            │
                                            ▼
                                     ┌─────────────────┐
                                     │  External       │
                                     │  Resource       │
                                     │  (DB, API, etc.)│
                                     └─────────────────┘
```

### Key Components

- **MCP Client** - Claude Code acts as the client, making requests to servers
- **MCP Server** - Standalone process providing tools and resources
- **Transport** - JSON-RPC over stdio or HTTP

## Core Concepts

### Tools

Actions that Claude can invoke:

```json
{
  "name": "query_database",
  "description": "Execute a SQL query",
  "parameters": {
    "query": "SELECT * FROM users"
  }
}
```

### Resources

Data sources Claude can read:

```json
{
  "uri": "postgres://localhost/mydb/users",
  "name": "Users Table",
  "mimeType": "application/json"
}
```

### Prompts

Pre-defined prompt templates:

```json
{
  "name": "analyze_data",
  "description": "Analyze database contents",
  "arguments": [
    {"name": "table", "required": true}
  ]
}
```

## Available Servers

### Official Servers

| Server | Purpose |
|--------|---------|
| **Filesystem** | Secure file operations |
| **GitHub** | Repository management |
| **PostgreSQL** | Database queries |
| **SQLite** | Local database access |
| **Fetch** | Web content retrieval |
| **Git** | Version control operations |

### Community Servers

The ecosystem includes 10,000+ community-built servers:

- Database connectors (MongoDB, Redis, MySQL)
- API integrations (Slack, Notion, Jira)
- Development tools (Docker, Kubernetes)
- And many more

## Getting Started

### 1. Configure a Server

Add to your `.claude/settings.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "/path/to/dir"]
    }
  }
}
```

### 2. Restart Claude Code

```bash
claude
```

### 3. Use the Tools

Claude automatically discovers and uses available tools:

```
> List the files in the project directory
```

## MCP Registries

Find servers in official registries:

- [GitHub MCP Registry](https://github.com/modelcontextprotocol/servers) - Official curated list
- [MCP Community Registry](https://github.com/modelcontextprotocol/registry) - Community submissions
- [Docker MCP Catalog](https://hub.docker.com/search?q=mcp) - Containerized servers

## Benefits

1. **Standardized** - One protocol for all integrations
2. **Secure** - Explicit permissions and sandboxing
3. **Extensible** - Easy to create custom servers
4. **Portable** - Works across different AI applications

## Next Steps

- [Learn the architecture](/mcp/architecture)
- [Browse available servers](/mcp/servers)
- [Configure MCP servers](/mcp/configuration)
