---
sidebar_position: 2
title: Permissions
description: Claude Code permission system reference
---

# Permission System

Claude Code uses a permission system to control what actions can be performed.

## Permission Levels

| Level | Behavior |
|-------|----------|
| **Allow** | Action proceeds automatically |
| **Ask** | User approval required |
| **Deny** | Action blocked entirely |

## Configuration

### In settings.json

```json
{
  "permissions": {
    "allow": [
      "Read(./src/**)",
      "Write(./src/**)",
      "Bash(npm test)"
    ],
    "deny": [
      "Read(./.env)",
      "Bash(rm *)"
    ]
  }
}
```

### Via CLI

```bash
claude --allowedTools "Read" "Write"
claude --disallowedTools "Bash" "WebFetch"
```

### Via Command

```
/permissions allow Read(./tests/**)
/permissions deny Bash(curl *)
```

## Permission Syntax

### Basic Format

```
Tool(pattern)
```

### Examples

| Rule | Matches |
|------|---------|
| `Read(./src/**)` | All files in src recursively |
| `Write(*.ts)` | TypeScript files in current dir |
| `Bash(npm *)` | Any npm command |
| `Bash(git status)` | Specific git command |

## Tool Types

### Read

File reading operations:

```json
"allow": [
  "Read(./src/**)",
  "Read(./docs/**)",
  "Read(./package.json)"
]
```

### Write

File writing operations:

```json
"allow": [
  "Write(./src/**)"
],
"deny": [
  "Write(./.env)",
  "Write(*.lock)"
]
```

### Bash

Shell commands:

```json
"allow": [
  "Bash(npm *)",
  "Bash(git *)",
  "Bash(yarn *)"
],
"deny": [
  "Bash(rm -rf *)",
  "Bash(curl *)"
]
```

### WebFetch

Web requests:

```json
"allow": [
  "WebFetch(https://api.github.com/*)"
],
"deny": [
  "WebFetch"  // Deny all web fetch
]
```

### MCP Tools

MCP server tools:

```json
"allow": [
  "mcp__postgres__query",
  "mcp__filesystem__read"
]
```

## Wildcards

| Pattern | Meaning |
|---------|---------|
| `*` | Match any characters |
| `**` | Match any path depth |
| `*.ts` | Match extension |
| `src/**/*.ts` | Match recursive with extension |

## Common Patterns

### Development

```json
{
  "permissions": {
    "allow": [
      "Read(./src/**)",
      "Write(./src/**)",
      "Read(./tests/**)",
      "Write(./tests/**)",
      "Bash(npm *)",
      "Bash(git *)"
    ]
  }
}
```

### Read-Only Review

```json
{
  "permissions": {
    "allow": [
      "Read(**)"
    ],
    "deny": [
      "Write",
      "Bash"
    ]
  }
}
```

### CI/CD

```json
{
  "permissions": {
    "allow": [
      "Read(**)",
      "Bash(npm test)",
      "Bash(npm run build)"
    ],
    "deny": [
      "Write",
      "Bash(npm publish)"
    ]
  }
}
```

### Security Audit

```json
{
  "permissions": {
    "allow": [
      "Read(**)"
    ],
    "deny": [
      "Write",
      "Bash",
      "Read(./.env*)",
      "Read(**/*secret*)"
    ]
  }
}
```

## Sandboxing

### Enable Sandbox

```bash
claude --sandbox
```

### Sandbox Features

- Filesystem isolation
- Network restrictions
- Process isolation

### Configuration

```json
{
  "sandbox": {
    "enabled": true,
    "allowedPaths": ["./src", "./tests"],
    "networkAccess": false
  }
}
```

## Permission Prompts

When an action requires approval:

```
Claude wants to: Write to src/app.ts

[a]llow once | [A]lways allow | [d]eny | [D]eny always
```

### Responses

| Key | Effect |
|-----|--------|
| `a` | Allow this instance |
| `A` | Add to allow rules |
| `d` | Deny this instance |
| `D` | Add to deny rules |

## Viewing Permissions

```
/permissions
```

Shows current permission configuration.

## Best Practices

1. **Deny sensitive files** - `.env`, credentials, keys
2. **Limit shell access** - Specific commands only
3. **Scope to directories** - Don't allow global write
4. **Review periodically** - Update as needs change
5. **Use project settings** - Committed with code

## Next Steps

- [Troubleshooting](/reference/troubleshooting)
- [Configuration](/cli/configuration)
- [Security Best Practices](/guides/best-practices)
