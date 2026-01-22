---
sidebar_position: 1
title: Hooks Overview
description: Automate workflows with Claude Code hooks
---

# Hooks Overview

Hooks are user-defined shell commands that execute at specific points in Claude Code's lifecycle. They provide deterministic control over Claude's behavior.

## What are Hooks?

Hooks let you:
- **Automate tasks** - Run formatters, linters, tests automatically
- **Enforce policies** - Block certain operations or require validation
- **Send notifications** - Alert when Claude completes tasks
- **Log actions** - Record what Claude does for audit trails

## Available Hook Events

| Event | Trigger | Common Uses |
|-------|---------|-------------|
| `PreToolUse` | Before a tool runs | Validation, logging |
| `PostToolUse` | After a tool completes | Formatting, testing |
| `Notification` | When Claude sends an alert | External notifications |
| `Stop` | When Claude finishes responding | Cleanup, reporting |
| `UserPromptSubmit` | When user submits a prompt | Preprocessing |
| `SessionStart` | When session begins | Setup, initialization |

## Quick Example

Auto-format TypeScript files after Claude writes them:

```json title=".claude/settings.json"
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.ts",
        "command": "prettier --write \"$FILE\""
      }
    ]
  }
}
```

## Configuration

### In settings.json

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "eslint --fix \"$FILE\""
      }
    ],
    "Stop": [
      {
        "command": "notify-send 'Claude finished'"
      }
    ]
  }
}
```

### Via /hooks Command

```
/hooks add PostToolUse --tool Write --command "prettier --write $FILE"
```

### View Configured Hooks

```
/hooks
```

## Hook Properties

| Property | Required | Description |
|----------|----------|-------------|
| `command` | Yes | Shell command to execute |
| `tool` | No | Specific tool to match |
| `pattern` | No | File pattern to match |
| `timeout` | No | Max execution time (ms) |
| `blocking` | No | Wait for completion |

## Environment Variables

Hooks receive context via environment variables:

| Variable | Description |
|----------|-------------|
| `$FILE` | File path (for file operations) |
| `$TOOL` | Tool name that triggered hook |
| `$CONTENT` | Content being written |
| `$SESSION_ID` | Current session ID |

## Security

### Timeout

Hooks have a 60-second default timeout to prevent hangs:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "command": "my-slow-command",
        "timeout": 120000
      }
    ]
  }
}
```

### Safe Practices

- Always quote variables: `"$FILE"` not `$FILE`
- Validate inputs before use
- Avoid destructive commands
- Test hooks thoroughly before enabling

## Use Cases

### Code Quality

```json
{
  "PostToolUse": [
    {
      "tool": "Write",
      "pattern": "*.py",
      "command": "black \"$FILE\" && isort \"$FILE\""
    }
  ]
}
```

### Notifications

```json
{
  "Stop": [
    {
      "command": "terminal-notifier -title 'Claude' -message 'Task complete'"
    }
  ]
}
```

### Logging

```json
{
  "PreToolUse": [
    {
      "command": "echo \"$(date): $TOOL\" >> ~/.claude/audit.log"
    }
  ]
}
```

### File Protection

```json
{
  "PreToolUse": [
    {
      "tool": "Write",
      "pattern": "*.lock",
      "command": "exit 1"  // Block writes to lock files
    }
  ]
}
```

## Next Steps

- [Learn about events](/hooks/events)
- [See more examples](/hooks/examples)
- [Configure settings](/cli/configuration)
