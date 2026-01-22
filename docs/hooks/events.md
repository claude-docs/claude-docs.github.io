---
sidebar_position: 2
title: Hook Events
description: Detailed reference for Claude Code hook events
---

# Hook Events

Detailed reference for each hook event type.

## PreToolUse

Triggered **before** a tool executes.

### Use Cases

- Validate inputs
- Log actions
- Block operations
- Transform parameters

### Configuration

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "tool": "Write",
        "command": "echo 'About to write $FILE'"
      }
    ]
  }
}
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `$TOOL` | Tool name |
| `$FILE` | File path (if applicable) |
| `$INPUT` | JSON-encoded tool input |

### Blocking

Return non-zero exit code to block the tool:

```json
{
  "PreToolUse": [
    {
      "tool": "Write",
      "pattern": ".env*",
      "command": "echo 'Cannot modify .env files' && exit 1"
    }
  ]
}
```

## PostToolUse

Triggered **after** a tool completes successfully.

### Use Cases

- Format code
- Run tests
- Update indexes
- Send notifications

### Configuration

```json
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

### Environment Variables

| Variable | Description |
|----------|-------------|
| `$TOOL` | Tool name |
| `$FILE` | File path (if applicable) |
| `$OUTPUT` | Tool output/result |
| `$EXIT_CODE` | Tool exit code |

### Chaining

Run multiple commands after a tool:

```json
{
  "PostToolUse": [
    {
      "tool": "Write",
      "pattern": "*.py",
      "command": "black \"$FILE\" && isort \"$FILE\" && mypy \"$FILE\""
    }
  ]
}
```

## Notification

Triggered when Claude sends a notification to the user.

### Use Cases

- Desktop notifications
- Slack/Discord alerts
- Email notifications
- Sound alerts

### Configuration

```json
{
  "hooks": {
    "Notification": [
      {
        "command": "notify-send 'Claude' \"$MESSAGE\""
      }
    ]
  }
}
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `$MESSAGE` | Notification content |
| `$LEVEL` | Notification level (info, warn, error) |

### Platform-Specific Examples

#### macOS

```json
{
  "Notification": [
    {
      "command": "terminal-notifier -title 'Claude Code' -message \"$MESSAGE\""
    }
  ]
}
```

#### Linux

```json
{
  "Notification": [
    {
      "command": "notify-send 'Claude Code' \"$MESSAGE\""
    }
  ]
}
```

#### Windows

```json
{
  "Notification": [
    {
      "command": "powershell -Command \"[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null; ...\""
    }
  ]
}
```

## Stop

Triggered when Claude finishes responding.

### Use Cases

- Cleanup tasks
- Summary generation
- Metrics logging
- State persistence

### Configuration

```json
{
  "hooks": {
    "Stop": [
      {
        "command": "echo 'Session ended' >> ~/.claude/session.log"
      }
    ]
  }
}
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `$SESSION_ID` | Current session ID |
| `$TURN_COUNT` | Number of turns in session |

## UserPromptSubmit

Triggered when the user submits a prompt.

### Use Cases

- Input preprocessing
- Prompt logging
- Rate limiting
- Context injection

### Configuration

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

### Environment Variables

| Variable | Description |
|----------|-------------|
| `$PROMPT` | User's input text |
| `$SESSION_ID` | Current session ID |

## SessionStart

Triggered when a new session begins.

### Use Cases

- Environment setup
- Dependency checks
- Welcome messages
- State initialization

### Configuration

```json
{
  "hooks": {
    "SessionStart": [
      {
        "command": "echo 'Session started: $SESSION_ID'"
      }
    ]
  }
}
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `$SESSION_ID` | New session ID |
| `$WORKING_DIR` | Current directory |

## Event Ordering

Events fire in this order:

```
SessionStart
  └── UserPromptSubmit
      └── PreToolUse
          └── [Tool Execution]
              └── PostToolUse
  └── Stop
      └── Notification (if any)
```

## Next Steps

- [See example hooks](/hooks/examples)
- [Configure settings](/cli/configuration)
- [Learn about permissions](/reference/permissions)
