---
sidebar_position: 2
title: VS Code
description: Claude Code extension for Visual Studio Code
---

# VS Code Integration

The official Claude Code extension for Visual Studio Code.

## Installation

### From Marketplace

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Claude Code"
4. Click Install

Or install directly: [Claude Code for VS Code](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code)

### From CLI

```bash
code --install-extension anthropic.claude-code
```

### Auto-Install

The extension auto-installs when you run `claude` in VS Code's integrated terminal.

## Features

### Conversation Panel

Open Claude in a dedicated panel:
- Ctrl+Shift+P → "Claude Code: Open Panel"
- Or click the Claude icon in the activity bar

### Native Diff Viewer

Code changes appear in VS Code's diff interface:
- Familiar UI
- Accept/reject changes
- Per-line review

### File References

Reference files with @-mentions:

```
@src/components/Button.tsx
@src/hooks/useAuth.ts:10-50
```

### Selection Sharing

1. Select code in the editor
2. Ask Claude about it
3. Context is automatically included

### Diagnostic Sharing

Share TypeScript/ESLint errors:
- Problems panel integration
- Click to share error context

## Configuration

### Extension Settings

Open settings and search for "Claude":

| Setting | Default | Description |
|---------|---------|-------------|
| `claude.autoConnect` | true | Auto-connect in integrated terminal |
| `claude.showInStatusBar` | true | Show Claude in status bar |
| `claude.diffStyle` | "inline" | Diff display style |

### Keyboard Shortcuts

Default shortcuts (customizable):

| Action | Shortcut |
|--------|----------|
| Open Claude Panel | Ctrl+Shift+C |
| Send Selection | Ctrl+Enter |
| Accept All Changes | Ctrl+Shift+A |

## Workflow

### Starting a Session

1. Open integrated terminal (Ctrl+`)
2. Run `claude`
3. Claude auto-detects VS Code

### Using the Panel

```
> Add error handling to the selected function
```

Changes appear in the diff viewer.

### Reviewing Changes

1. Changes appear in Source Control panel
2. Click to view diff
3. Accept or reject hunks
4. Accept all when satisfied

### Multi-File Changes

Claude can modify multiple files:
- Each file appears in the diff list
- Review individually or accept all

## Tips

### Workspace Trust

Ensure your workspace is trusted for full functionality.

### Large Files

For large files, reference specific line ranges:
```
@src/bigfile.ts:100-200
```

### Terminal Mode

For complex tasks, the terminal experience may be more responsive than the panel.

## Troubleshooting

### Extension not connecting

1. Restart VS Code
2. Check terminal output for errors
3. Run `claude doctor`

### Diff not appearing

1. Ensure VS Code has Git initialized
2. Check Source Control panel
3. Verify workspace trust

### Slow performance

1. Disable unused extensions
2. Use line range references for large files
3. Try terminal mode instead of panel

## Next Steps

- [Learn slash commands](/cli/slash-commands)
- [Configure settings](/cli/configuration)
- [Set up hooks](/hooks/overview)
