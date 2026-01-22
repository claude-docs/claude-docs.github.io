---
sidebar_position: 3
title: Slash Commands
description: Built-in slash commands for Claude Code
---

# Slash Commands

Slash commands are shortcuts for common actions within Claude Code. Type `/` in the prompt to see available commands.

## Session Management

### /clear

Reset the conversation and start fresh.

```
/clear
```

Clears all context, messages, and file contents from the current session.

### /compact

Compress the conversation history to save context space.

```
/compact
```

Useful when approaching context limits. Preserves important information while reducing token usage.

### /context

View current context usage and breakdown.

```
/context
```

Shows:
- Total tokens used
- Breakdown by category (messages, files, tools)
- Remaining capacity

## Configuration

### /config

Open or modify settings.

```
/config                 # Interactive settings
/config show            # Display current settings
/config set key value   # Set a specific value
```

### /model

Switch Claude models during a session.

```
/model opus     # Switch to Opus
/model sonnet   # Switch to Sonnet
/model haiku    # Switch to Haiku
```

### /permissions

View and modify permission rules.

```
/permissions            # Show current rules
/permissions allow ...  # Add allow rule
/permissions deny ...   # Add deny rule
```

## Project

### /init

Generate a CLAUDE.md file for your project.

```
/init
```

Creates a CLAUDE.md with:
- Project overview
- Structure summary
- Common commands
- Coding conventions

### /ide

Connect to an IDE extension.

```
/ide           # Auto-detect IDE
/ide vscode    # Connect to VS Code
```

## Recovery

### /rewind

Restore to a previous checkpoint.

```
/rewind
```

Opens a menu to:
- Restore conversation only
- Restore code only
- Restore both

Also accessible via `Esc` `Esc`.

### /status

Check conversation size and health.

```
/status
```

Shows:
- Message count
- Context usage
- Session duration
- Any warnings

## Debugging

### /doctor

Run diagnostics to check for issues.

```
/doctor
```

Checks:
- Authentication
- Configuration
- MCP servers
- Common problems

### /bug

Report an issue.

```
/bug
```

Opens the issue reporter with system information pre-filled.

## Hooks

### /hooks

Configure lifecycle hooks.

```
/hooks              # List configured hooks
/hooks add ...      # Add a new hook
/hooks remove ...   # Remove a hook
```

See [Hooks documentation](/hooks/overview) for details.

## Help

### /help

Show available commands.

```
/help
/help <command>   # Help for specific command
```

## Custom Commands

You can create custom slash commands in your project. See [Custom Commands](/skills/custom-commands) for details.

## Quick Reference

| Command | Description |
|---------|-------------|
| `/clear` | Reset conversation |
| `/compact` | Compress context |
| `/config` | Settings |
| `/context` | View context usage |
| `/doctor` | Run diagnostics |
| `/help` | Show help |
| `/hooks` | Configure hooks |
| `/ide` | Connect to IDE |
| `/init` | Create CLAUDE.md |
| `/model` | Switch model |
| `/permissions` | Manage permissions |
| `/rewind` | Restore checkpoint |
| `/status` | Session status |

## Next Steps

- [Configure settings](/cli/configuration)
- [Create custom commands](/skills/custom-commands)
- [Set up hooks](/hooks/overview)
