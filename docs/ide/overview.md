---
sidebar_position: 1
title: IDE Overview
description: Claude Code IDE integrations overview
---

# IDE Integrations

Claude Code integrates with popular IDEs and editors for a seamless development experience.

## Available Integrations

| IDE | Extension | Status |
|-----|-----------|--------|
| **VS Code** | Official | Stable |
| **JetBrains** | Official | Beta |
| **Neovim** | Community | Active |
| **Cursor** | Built-in | Native |

## Key Features

### Native Diff Viewer

Review code changes in your IDE's native diff interface:
- Side-by-side comparison
- Inline change highlighting
- Accept/reject per hunk

### Conversation Sync

Share context between CLI and IDE:
- Resume conversations in either interface
- Synchronized history
- Shared memory (CLAUDE.md)

### File Selection

Select code directly in your editor:
- @-mention files with line ranges
- Share current selection
- Reference diagnostic errors

### Multiple Sessions

Run multiple Claude conversations:
- Tab-based conversation management
- Independent contexts
- Switch between tasks

## Getting Started

### Quick Setup

1. Install the extension for your IDE
2. Start Claude Code in your terminal
3. Run `/ide` to connect

Or let it auto-detect when using the integrated terminal.

### Connection Methods

**Auto-connect**: Claude detects the IDE when started in integrated terminal

**Manual connect**: Use `/ide` command:
```
/ide           # Auto-detect
/ide vscode    # Force VS Code
/ide jetbrains # Force JetBrains
```

## IDE Comparison

| Feature | VS Code | JetBrains | Neovim |
|---------|---------|-----------|--------|
| Diff viewer | Native | Native | External |
| Auto-connect | Yes | Yes | Manual |
| Selection sharing | Yes | Yes | Yes |
| Multiple tabs | Yes | Yes | Via buffers |
| Plan approval | Yes | Yes | Text-based |

## Standalone vs Integrated

### Integrated Terminal

Using Claude in your IDE's terminal:
- Automatic IDE detection
- Direct diff integration
- Faster file operations

### External Terminal

Using Claude in a separate terminal:
- Connect with `/ide`
- Same features, slightly slower sync
- Useful for multi-monitor setups

## Workflow Tips

1. **Use @ mentions** - Reference files directly: `@src/app.ts:10-20`
2. **Review in IDE** - Let diffs appear in your familiar interface
3. **Share selections** - Select code before asking questions
4. **Use plan mode** - Review complex changes before applying

## Next Steps

- [VS Code setup](/ide/vscode)
- [JetBrains setup](/ide/jetbrains)
- [Neovim setup](/ide/neovim)
