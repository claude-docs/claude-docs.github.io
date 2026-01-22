---
sidebar_position: 3
title: Available Servers
description: Directory of MCP servers for Claude Code
---

# Available MCP Servers

A curated directory of MCP servers that extend Claude Code's capabilities.

## Official Servers

These servers are maintained by Anthropic:

### Filesystem

Secure file operations with access controls.

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "/allowed/path"]
  }
}
```

**Features:**
- Read/write files
- Directory listing
- File search
- Access control by path

### GitHub

Comprehensive GitHub integration.

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@anthropic-ai/mcp-server-github"],
    "env": {
      "GITHUB_TOKEN": "${GITHUB_TOKEN}"
    }
  }
}
```

**Features:**
- Repository management
- Issues and PRs
- CI/CD workflows
- Code search

### PostgreSQL

Query PostgreSQL databases.

```json
{
  "postgres": {
    "command": "npx",
    "args": ["-y", "@anthropic-ai/mcp-server-postgres"],
    "env": {
      "DATABASE_URL": "${DATABASE_URL}"
    }
  }
}
```

**Features:**
- SQL queries
- Schema inspection
- Read-only by default
- Connection pooling

### SQLite

Local SQLite database access.

```json
{
  "sqlite": {
    "command": "npx",
    "args": ["-y", "@anthropic-ai/mcp-server-sqlite", "./database.db"]
  }
}
```

### Fetch

Retrieve web content.

```json
{
  "fetch": {
    "command": "npx",
    "args": ["-y", "@anthropic-ai/mcp-server-fetch"]
  }
}
```

**Features:**
- HTTP requests
- HTML to markdown conversion
- Rate limiting
- Caching

### Git

Version control operations.

```json
{
  "git": {
    "command": "npx",
    "args": ["-y", "@anthropic-ai/mcp-server-git"]
  }
}
```

## Database Servers

### MongoDB

```json
{
  "mongodb": {
    "command": "npx",
    "args": ["-y", "mcp-server-mongodb"],
    "env": {
      "MONGODB_URI": "${MONGODB_URI}"
    }
  }
}
```

### Redis

```json
{
  "redis": {
    "command": "npx",
    "args": ["-y", "mcp-server-redis"],
    "env": {
      "REDIS_URL": "${REDIS_URL}"
    }
  }
}
```

### MySQL

```json
{
  "mysql": {
    "command": "npx",
    "args": ["-y", "mcp-server-mysql"],
    "env": {
      "MYSQL_URL": "${MYSQL_URL}"
    }
  }
}
```

## Productivity Servers

### Slack

```json
{
  "slack": {
    "command": "npx",
    "args": ["-y", "mcp-server-slack"],
    "env": {
      "SLACK_TOKEN": "${SLACK_TOKEN}"
    }
  }
}
```

### Notion

```json
{
  "notion": {
    "command": "npx",
    "args": ["-y", "mcp-server-notion"],
    "env": {
      "NOTION_TOKEN": "${NOTION_TOKEN}"
    }
  }
}
```

### Linear

```json
{
  "linear": {
    "command": "npx",
    "args": ["-y", "mcp-server-linear"],
    "env": {
      "LINEAR_API_KEY": "${LINEAR_API_KEY}"
    }
  }
}
```

## Development Servers

### Docker

```json
{
  "docker": {
    "command": "npx",
    "args": ["-y", "mcp-server-docker"]
  }
}
```

### Kubernetes

```json
{
  "k8s": {
    "command": "npx",
    "args": ["-y", "mcp-server-kubernetes"]
  }
}
```

### AWS

```json
{
  "aws": {
    "command": "npx",
    "args": ["-y", "mcp-server-aws"],
    "env": {
      "AWS_REGION": "${AWS_REGION}",
      "AWS_ACCESS_KEY_ID": "${AWS_ACCESS_KEY_ID}",
      "AWS_SECRET_ACCESS_KEY": "${AWS_SECRET_ACCESS_KEY}"
    }
  }
}
```

## Finding More Servers

### Official Registries

- [GitHub MCP Registry](https://github.com/modelcontextprotocol/servers)
- [MCP Community Registry](https://github.com/modelcontextprotocol/registry)

### Search npm

```bash
npm search mcp-server
```

### Docker Hub

Search for `mcp` on Docker Hub for containerized servers.

## Security Considerations

When adding MCP servers:

1. **Review the source** - Check the repository before installing
2. **Limit permissions** - Use minimal required access
3. **Use environment variables** - Never hardcode secrets
4. **Sandbox when possible** - Run in containers if untrusted

## Next Steps

- [Configure MCP servers](/mcp/configuration)
- [Build custom servers](/mcp/architecture)
- [MCP Specification](https://modelcontextprotocol.io)
