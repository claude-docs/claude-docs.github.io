---
sidebar_position: 2
title: Installation
description: How to install Claude Code on macOS, Windows, and Linux
---

# Installation

Claude Code can be installed on macOS, Windows, and Linux. Choose the installation method that works best for your platform.

## Requirements

- **Node.js 18+** - Required for npm installation
- **Claude Pro, Max, Teams, or Enterprise** subscription - For authentication

## Installation Methods

### macOS (Homebrew)

The recommended method for macOS users:

```bash
brew install claude-code
```

### Windows (WinGet)

For Windows users:

```bash
winget install Anthropic.ClaudeCode
```

### npm (All Platforms)

Works on any platform with Node.js:

```bash
npm install -g @anthropic-ai/claude-code
```

:::tip
Native installers (Homebrew, WinGet) are recommended over npm for better system integration.
:::

## Verify Installation

After installation, verify Claude Code is working:

```bash
claude --version
```

You should see output like:

```
Claude Code v1.x.x
```

## First Run

Start Claude Code for the first time:

```bash
claude
```

On first run, you'll be prompted to authenticate with your Anthropic account.

## Updating

### Homebrew

```bash
brew upgrade claude-code
```

### WinGet

```bash
winget upgrade Anthropic.ClaudeCode
```

### npm

```bash
npm update -g @anthropic-ai/claude-code
```

## Troubleshooting

### Command not found

If you get "command not found" after npm install:

1. Check your PATH includes npm global bin directory:
   ```bash
   npm bin -g
   ```

2. Add it to your shell profile if needed:
   ```bash
   export PATH="$(npm bin -g):$PATH"
   ```

### Node.js version

Ensure you have Node.js 18 or higher:

```bash
node --version
```

If outdated, use [nvm](https://github.com/nvm-sh/nvm) to install a newer version:

```bash
nvm install 20
nvm use 20
```

### Permission issues

If you get permission errors with npm:

```bash
# Fix npm permissions (don't use sudo)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Diagnostics

Run the built-in diagnostics:

```bash
claude doctor
```

This checks common issues and suggests fixes.

## Next Steps

- [Set up authentication](/getting-started/authentication)
- [Follow the quick start guide](/getting-started/quick-start)
- [Learn about configuration](/cli/configuration)
