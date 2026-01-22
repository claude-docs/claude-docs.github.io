---
sidebar_position: 4
title: Configuration
description: How to configure MCP servers in Claude Code
---

# MCP Configuration

Learn how to configure and manage MCP servers in Claude Code.

## Configuration Files

### Project Configuration

Add MCP servers to your project's `.claude/settings.json`:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "mcp-server-package"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

### User Configuration

For personal servers, add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "personal-db": {
      "command": "/usr/local/bin/my-server",
      "args": ["--config", "/path/to/config.json"]
    }
  }
}
```

### Standalone File

You can also use `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "./data"]
    }
  }
}
```

## Configuration Options

### Basic Options

```json
{
  "server-name": {
    "command": "string",     // Executable to run
    "args": ["array"],       // Command arguments
    "env": {},               // Environment variables
    "cwd": "string"          // Working directory
  }
}
```

### Advanced Options

```json
{
  "server-name": {
    "command": "npx",
    "args": ["-y", "mcp-server"],
    "env": {
      "LOG_LEVEL": "debug"
    },
    "timeout": 30000,        // Connection timeout (ms)
    "retries": 3,            // Retry attempts
    "disabled": false        // Temporarily disable
  }
}
```

## Environment Variables

### Using Variables

Reference environment variables with `${VAR_NAME}`:

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

### Setting Variables

Set them in your shell:

```bash
export GITHUB_TOKEN="ghp_..."
export DATABASE_URL="postgres://..."
```

Or in a `.env` file (add to `.gitignore`):

```env
GITHUB_TOKEN=ghp_...
DATABASE_URL=postgres://...
```

## Multiple Servers

Configure multiple servers for different purposes:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "./src"]
    },
    "database": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

## Server Lifecycle

### Startup

Servers start when Claude Code launches:

1. Read configuration
2. Spawn server processes
3. Exchange capabilities
4. Ready for use

### Runtime

Check server status:

```bash
/config mcpServers
```

### Shutdown

Servers stop when Claude Code exits or on `/clear`.

## Troubleshooting

### Debug Mode

Enable MCP debugging:

```bash
claude --mcp-debug
```

### Common Issues

#### Server not starting

```bash
# Check the command directly
npx -y @anthropic-ai/mcp-server-filesystem ./path
```

#### Missing environment variables

```bash
# Verify variables are set
echo $GITHUB_TOKEN
```

#### Permission errors

Ensure the server has access to required resources:

```bash
# Check file permissions
ls -la ./data
```

### Logs

View server logs:

```bash
# Enable verbose output
claude --verbose --mcp-debug
```

## Best Practices

1. **Use project settings** for team-shared servers
2. **Use local settings** for personal/sensitive servers
3. **Never commit secrets** - Use environment variables
4. **Disable unused servers** to reduce startup time
5. **Set appropriate timeouts** for slow servers

## Example Configurations

### Full-Stack Development

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "./"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-postgres"],
      "env": {"DATABASE_URL": "${DATABASE_URL}"}
    },
    "redis": {
      "command": "npx",
      "args": ["-y", "mcp-server-redis"],
      "env": {"REDIS_URL": "${REDIS_URL}"}
    }
  }
}
```

### DevOps

```json
{
  "mcpServers": {
    "docker": {
      "command": "npx",
      "args": ["-y", "mcp-server-docker"]
    },
    "kubernetes": {
      "command": "npx",
      "args": ["-y", "mcp-server-kubernetes"]
    },
    "aws": {
      "command": "npx",
      "args": ["-y", "mcp-server-aws"]
    }
  }
}
```

## Next Steps

- [Browse available servers](/mcp/servers)
- [Learn the architecture](/mcp/architecture)
- [Configure hooks](/hooks/overview)
