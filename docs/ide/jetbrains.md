---
sidebar_position: 3
title: JetBrains
description: Claude Code plugin for JetBrains IDEs
---

# JetBrains Integration

The Claude Code plugin for JetBrains IDEs including IntelliJ IDEA, PyCharm, WebStorm, and more.

## Supported IDEs

- IntelliJ IDEA
- PyCharm
- WebStorm
- GoLand
- Android Studio
- PhpStorm
- Rider
- RubyMine

## Installation

### From Marketplace

1. Open your JetBrains IDE
2. Go to Settings → Plugins
3. Search for "Claude Code"
4. Click Install

Or install from: [Claude Code Beta Plugin](https://plugins.jetbrains.com/plugin/27310-claude-code-beta-)

### From CLI

Connect from an external terminal:

```bash
claude /ide jetbrains
```

## Features

### Quick Launch

Open Claude instantly:
- **Mac**: Cmd+Esc
- **Windows/Linux**: Ctrl+Esc

### Native Diff Viewer

View changes in JetBrains' diff interface:
- Familiar three-panel view
- Accept/reject per change
- Syntax highlighting

### Selection Sharing

Share code context:
1. Select code in editor
2. Trigger Claude
3. Selection is included

### Diagnostic Integration

Share IDE warnings and errors:
- Inspection results
- Compilation errors
- Linter warnings

## Configuration

### Plugin Settings

Settings → Tools → Claude Code:

| Setting | Default | Description |
|---------|---------|-------------|
| Auto-connect | true | Connect when terminal opens |
| Show toolbar | true | Show Claude in toolbar |
| Diff mode | side-by-side | Diff display style |

### Keyboard Shortcuts

Configure in Settings → Keymap → Claude:

| Action | Default |
|--------|---------|
| Open Claude | Cmd/Ctrl+Esc |
| Send Selection | Cmd/Ctrl+Enter |
| Accept Changes | Cmd/Ctrl+Shift+Enter |

## Workflow

### From Integrated Terminal

1. Open Terminal (Alt+F12)
2. Run `claude`
3. Plugin auto-connects

### From External Terminal

1. Open terminal outside IDE
2. Navigate to project
3. Run `claude /ide`
4. Plugin receives connection

### Reviewing Changes

1. Changes appear in IDE diff viewer
2. Use standard JetBrains diff controls
3. Accept or reject per file

## Tips

### Project SDK

Ensure your Project SDK is configured for best results.

### File Indexing

Wait for initial indexing to complete for better code analysis.

### WSL Users

If using WSL, ensure the IDE can communicate with the WSL network.

## Troubleshooting

### Plugin not connecting

1. Check IDE terminal for errors
2. Verify Claude Code is installed
3. Run `claude doctor`

### Diff viewer not opening

1. Ensure changes are not auto-saved
2. Check project VCS settings
3. Restart IDE

### Connection issues on WSL2

WSL2 networking may need additional configuration:

1. Check Windows firewall rules
2. Verify WSL network bridge
3. Try port forwarding if needed

## Next Steps

- [Learn slash commands](/cli/slash-commands)
- [Configure settings](/cli/configuration)
- [Set up hooks](/hooks/overview)
