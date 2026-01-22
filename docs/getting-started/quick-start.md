---
sidebar_position: 3
title: Quick Start
description: Get up and running with Claude Code in 5 minutes
---

# Quick Start

This guide will have you coding with Claude in just a few minutes.

## Prerequisites

Make sure you have:
- [Installed Claude Code](/getting-started/installation)
- [Set up authentication](/getting-started/authentication)

## Your First Session

### 1. Navigate to Your Project

```bash
cd your-project
```

### 2. Start Claude Code

```bash
claude
```

You'll see the Claude Code prompt:

```
Claude Code v1.x.x
Type your request or /help for commands

>
```

### 3. Ask Claude to Explore

Let Claude understand your codebase:

```
> What is this project and how is it structured?
```

Claude will analyze your project and provide an overview.

### 4. Make Your First Change

Ask Claude to do something:

```
> Add a function to validate email addresses in the utils folder
```

Claude will:
1. Create or locate the appropriate file
2. Write the function
3. Show you the changes for approval

### 5. Review and Accept

Claude presents changes in a diff format. You can:
- **Accept** - Apply the changes
- **Reject** - Discard the changes
- **Edit** - Modify before applying

## Quick Commands

Use slash commands for common actions:

| Command | Description |
|---------|-------------|
| `/help` | Show all available commands |
| `/clear` | Clear conversation history |
| `/compact` | Compress context to save space |
| `/context` | View current context usage |
| `/model` | Switch between Claude models |

## Headless Mode

Run Claude without interactive mode for scripts:

```bash
claude -p "create a new React component called Button"
```

## Resume Conversations

Continue your last conversation:

```bash
claude -c
```

## Initialize Project Memory

Create a CLAUDE.md file for project-specific instructions:

```bash
claude /init
```

This generates a CLAUDE.md with:
- Project structure overview
- Common commands
- Coding conventions
- Dependencies

## Example Workflows

### Bug Fix

```
> There's a bug where the login form doesn't validate empty fields.
> Find and fix it, then add a test.
```

### New Feature

```
> Add a dark mode toggle to the settings page.
> Use the existing theme context.
```

### Refactoring

```
> Refactor the UserService class to use async/await instead of callbacks
```

### Code Review

```
> Review the changes in the last commit for potential issues
```

## Tips for Better Results

1. **Be specific** - "Add a blue button" is better than "add a button"
2. **Provide context** - "Using our existing Button component..." helps Claude understand patterns
3. **Break down large tasks** - Smaller, focused requests work better
4. **Use plan mode** - For complex changes, let Claude plan first

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Esc` `Esc` | Open checkpoint menu |
| `Ctrl+C` | Cancel current operation |
| `#` | Add note to memory |

## Next Steps

- [Learn the CLI commands](/cli/commands)
- [Configure Claude Code](/cli/configuration)
- [Set up MCP servers](/mcp/overview)
- [Read best practices](/guides/best-practices)
