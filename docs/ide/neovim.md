---
sidebar_position: 4
title: Neovim
description: Claude Code integration for Neovim
---

# Neovim Integration

Community-maintained Claude Code integration for Neovim.

## Installation

### Using lazy.nvim

```lua
{
  "anthropics/claude-code.nvim",
  dependencies = {
    "nvim-lua/plenary.nvim",
  },
  config = function()
    require("claude-code").setup({
      -- options
    })
  end,
}
```

### Using packer.nvim

```lua
use {
  "anthropics/claude-code.nvim",
  requires = { "nvim-lua/plenary.nvim" },
  config = function()
    require("claude-code").setup()
  end,
}
```

## Configuration

```lua
require("claude-code").setup({
  -- Terminal settings
  terminal = {
    split = "vertical",  -- "vertical", "horizontal", or "float"
    size = 0.4,          -- Size as percentage
  },

  -- Keymaps
  keymaps = {
    toggle = "<leader>cc",
    send_selection = "<leader>cs",
    send_buffer = "<leader>cb",
  },

  -- Appearance
  float = {
    border = "rounded",
    width = 0.8,
    height = 0.8,
  },
})
```

## Usage

### Open Claude

```vim
:ClaudeCode
```

Or use the keymap (default: `<leader>cc`).

### Send Selection

1. Select text in visual mode
2. Press `<leader>cs` (or configured keymap)
3. Selection is sent to Claude

### Send Current Buffer

```vim
:ClaudeCodeBuffer
```

Or use `<leader>cb`.

### Keymaps Reference

| Action | Default Keymap |
|--------|---------------|
| Toggle Claude | `<leader>cc` |
| Send selection | `<leader>cs` |
| Send buffer | `<leader>cb` |
| Accept change | `<leader>ca` |
| Reject change | `<leader>cr` |

## Features

### Split Terminal

Claude runs in a Neovim terminal split:
- Vertical or horizontal split
- Floating window option
- Adjustable size

### Visual Selection

Send selected code to Claude:

```lua
-- In visual mode
:'<,'>ClaudeCodeSelection
```

### File References

Reference files using @-mentions in the Claude terminal.

### Buffer Integration

Send entire buffers for context:

```vim
:ClaudeCodeBuffer %
```

## Workflow

### Basic Flow

1. Open Claude: `<leader>cc`
2. Type your request in the terminal
3. Review output
4. Apply changes manually or via commands

### Code Review

```vim
" Select code to review
'<,'>ClaudeCodeSelection
" Then type in Claude: "Review this code"
```

### Quick Fix

```vim
" Position cursor on error
:ClaudeCode
" Type: "Fix the error on the current line"
```

## Tips

### Floating Window

For a less intrusive experience, use float mode:

```lua
require("claude-code").setup({
  terminal = { split = "float" },
})
```

### Persistent Session

Keep Claude open across buffer changes:

```lua
require("claude-code").setup({
  terminal = { persist = true },
})
```

### Custom Commands

Create Neovim commands for common tasks:

```lua
vim.api.nvim_create_user_command("ClaudeReview", function()
  vim.cmd("'<,'>ClaudeCodeSelection")
  -- Send "Review this code" automatically
end, { range = true })
```

## Troubleshooting

### Terminal not opening

1. Ensure Claude Code CLI is installed
2. Check `:messages` for errors
3. Verify terminal configuration

### Slow response

1. Check network connection
2. Try a faster model
3. Reduce context size

### Plugin conflicts

1. Check for terminal plugin conflicts
2. Adjust keymap conflicts
3. Review lazy-loading settings

## Related Plugins

- **toggleterm.nvim** - Alternative terminal management
- **nvim-dap** - Debug integration
- **telescope.nvim** - File finding

## Next Steps

- [Learn CLI commands](/cli/commands)
- [Configure Claude Code](/cli/configuration)
- [Set up hooks](/hooks/overview)
