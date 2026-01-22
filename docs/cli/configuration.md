---
sidebar_position: 4
title: Configuration
description: Configure Claude Code settings and preferences
---

# Configuration

Claude Code can be configured through settings files, environment variables, and CLAUDE.md files.

## Configuration Hierarchy

Settings are loaded in order (later overrides earlier):

1. **Default settings** - Built-in defaults
2. **User settings** - `~/.claude/settings.json`
3. **Project settings** - `.claude/settings.json`
4. **Local settings** - `.claude/settings.local.json` (not committed)
5. **Environment variables** - Override any setting
6. **CLI flags** - Highest priority

## Settings Files

### User Settings

Global settings for all projects:

```json title="~/.claude/settings.json"
{
  "model": "claude-sonnet-4-5-20250929",
  "theme": "dark",
  "autoCompact": true,
  "permissions": {
    "allow": ["Bash(git *)"]
  }
}
```

### Project Settings

Project-specific settings (commit to repo):

```json title=".claude/settings.json"
{
  "model": "claude-opus-4-5-20251101",
  "permissions": {
    "allow": ["Bash(npm *)"],
    "deny": ["Read(./.env)"]
  },
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-postgres"]
    }
  }
}
```

### Local Settings

Machine-specific settings (add to .gitignore):

```json title=".claude/settings.local.json"
{
  "apiKey": "sk-ant-...",
  "mcpServers": {
    "local-db": {
      "command": "npx",
      "args": ["-y", "mcp-server-sqlite", "./dev.db"]
    }
  }
}
```

## Key Settings

### Model Configuration

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "extendedThinking": true,
  "maxTokens": 8192
}
```

### Permission Rules

```json
{
  "permissions": {
    "allow": [
      "Read(./src/**)",
      "Write(./src/**)",
      "Bash(npm test)",
      "Bash(git *)"
    ],
    "deny": [
      "Read(./.env)",
      "Bash(rm -rf *)",
      "WebFetch"
    ]
  }
}
```

### MCP Servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "/path"]
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

### Hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "prettier --write $FILE"
      }
    ]
  }
}
```

## CLAUDE.md Files

CLAUDE.md files store project knowledge and instructions.

### Project Memory

```markdown title="./CLAUDE.md"
# Project: My App

## Structure
- src/ - Application source code
- tests/ - Test files
- docs/ - Documentation

## Commands
- `npm run dev` - Start development server
- `npm test` - Run tests
- `npm run build` - Production build

## Conventions
- Use TypeScript for all new files
- Follow ESLint configuration
- Write tests for new features
```

### User Memory

Global instructions across all projects:

```markdown title="~/.claude/CLAUDE.md"
# My Preferences

## Coding Style
- Prefer functional programming patterns
- Use explicit types over inference
- Add comments for complex logic

## Git
- Use conventional commits
- Always create feature branches
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | API key |
| `CLAUDE_MODEL` | Default model |
| `CLAUDE_CONFIG_DIR` | Config directory |
| `CLAUDE_CODE_USE_BEDROCK` | Enable AWS Bedrock |
| `CLAUDE_CODE_USE_VERTEX` | Enable Google Vertex |

## Managing Settings

### View Current Settings

```bash
claude config --show
```

### Edit Settings

```bash
claude config
# or
claude /config
```

### Reset Settings

```bash
claude config --reset
```

## Best Practices

1. **Use project settings** for team-shared configuration
2. **Use local settings** for machine-specific values (API keys, local paths)
3. **Keep CLAUDE.md concise** - Under 500 lines for optimal context usage
4. **Use permission deny lists** for sensitive files
5. **Define MCP servers** per project for reproducibility

## Next Steps

- [Set up MCP servers](/mcp/configuration)
- [Configure hooks](/hooks/overview)
- [Create custom skills](/skills/overview)
