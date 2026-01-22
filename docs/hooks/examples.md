---
sidebar_position: 3
title: Hook Examples
description: Practical examples of Claude Code hooks
---

# Hook Examples

Practical examples of hooks for common workflows.

## Code Formatting

### Prettier for JavaScript/TypeScript

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.{js,jsx,ts,tsx}",
        "command": "prettier --write \"$FILE\""
      }
    ]
  }
}
```

### Black for Python

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.py",
        "command": "black \"$FILE\" && isort \"$FILE\""
      }
    ]
  }
}
```

### gofmt for Go

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.go",
        "command": "gofmt -w \"$FILE\""
      }
    ]
  }
}
```

### rustfmt for Rust

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.rs",
        "command": "rustfmt \"$FILE\""
      }
    ]
  }
}
```

## Linting

### ESLint Auto-fix

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.{js,jsx,ts,tsx}",
        "command": "eslint --fix \"$FILE\""
      }
    ]
  }
}
```

### Run Tests After Changes

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "src/**/*.ts",
        "command": "npm test -- --findRelatedTests \"$FILE\""
      }
    ]
  }
}
```

## Notifications

### Desktop Notification on Complete

macOS:
```json
{
  "hooks": {
    "Stop": [
      {
        "command": "terminal-notifier -title 'Claude Code' -message 'Task completed' -sound default"
      }
    ]
  }
}
```

Linux:
```json
{
  "hooks": {
    "Stop": [
      {
        "command": "notify-send -i terminal 'Claude Code' 'Task completed'"
      }
    ]
  }
}
```

### Slack Notification

```json
{
  "hooks": {
    "Stop": [
      {
        "command": "curl -X POST -H 'Content-type: application/json' --data '{\"text\":\"Claude finished a task\"}' $SLACK_WEBHOOK_URL"
      }
    ]
  }
}
```

## Security

### Block Sensitive Files

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "tool": "Write",
        "pattern": ".env*",
        "command": "echo 'Blocked: Cannot write to .env files' && exit 1"
      },
      {
        "tool": "Write",
        "pattern": "*.pem",
        "command": "echo 'Blocked: Cannot write to key files' && exit 1"
      },
      {
        "tool": "Write",
        "pattern": "**/secrets/**",
        "command": "echo 'Blocked: Cannot write to secrets directory' && exit 1"
      }
    ]
  }
}
```

### Audit Logging

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "command": "echo \"$(date -Iseconds) | PRE | $TOOL | $FILE\" >> ~/.claude/audit.log"
      }
    ],
    "PostToolUse": [
      {
        "command": "echo \"$(date -Iseconds) | POST | $TOOL | $FILE | $EXIT_CODE\" >> ~/.claude/audit.log"
      }
    ]
  }
}
```

## Git Integration

### Auto-Stage Changes

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "git add \"$FILE\""
      }
    ]
  }
}
```

### Pre-commit Check

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "pre-commit run --files \"$FILE\" || true"
      }
    ]
  }
}
```

## Development Workflow

### Restart Dev Server

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "src/**/*.ts",
        "command": "touch .trigger-reload"
      }
    ]
  }
}
```

### Rebuild on Change

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "src/**/*",
        "command": "npm run build:quick 2>/dev/null &"
      }
    ]
  }
}
```

## Context Management

### Prompt Logging

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "command": "echo \"$(date): $PROMPT\" >> ~/.claude/prompts.log"
      }
    ]
  }
}
```

### Session Summary

```json
{
  "hooks": {
    "Stop": [
      {
        "command": "echo 'Session $SESSION_ID ended with $TURN_COUNT turns' >> ~/.claude/sessions.log"
      }
    ]
  }
}
```

## Multi-Step Hooks

### Format, Lint, and Test

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.ts",
        "command": "prettier --write \"$FILE\" && eslint --fix \"$FILE\" && npm test -- --findRelatedTests \"$FILE\" --passWithNoTests"
      }
    ]
  }
}
```

## Conditional Hooks

### Run Only in Development

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "[ \"$NODE_ENV\" = 'development' ] && prettier --write \"$FILE\" || true"
      }
    ]
  }
}
```

### Skip for Generated Files

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "echo \"$FILE\" | grep -v 'generated' && prettier --write \"$FILE\" || true"
      }
    ]
  }
}
```

## Next Steps

- [Learn about events](/hooks/events)
- [Configure settings](/cli/configuration)
- [Create custom skills](/skills/overview)
