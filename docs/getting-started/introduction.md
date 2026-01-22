---
sidebar_position: 1
title: Introduction
description: Welcome to Claude Code - your AI-powered coding assistant
---

# Introduction to Claude Code

Claude Code is an agentic coding tool from Anthropic that lives in your terminal, understands your codebase, and helps you code faster through natural language commands.

## What is Claude Code?

Claude Code is more than a simple code assistant - it's an autonomous agent that can:

- **Understand your codebase** - Automatically indexes and comprehends your project structure
- **Write and edit code** - Creates, modifies, and refactors code based on natural language instructions
- **Run commands** - Executes terminal commands, runs tests, and manages your development workflow
- **Use tools** - Integrates with external tools and services through the Model Context Protocol (MCP)
- **Learn your preferences** - Remembers project-specific instructions via CLAUDE.md files

## Key Features

### Natural Language Interface

Simply describe what you want to accomplish:

```bash
claude "add a logout button to the navbar that clears the session"
```

### Multi-Model Support

Choose the right model for your task:

| Model | Best For |
|-------|----------|
| **Opus 4.5** | Complex reasoning, architecture, long-horizon planning |
| **Sonnet 4.5** | Day-to-day coding, balanced performance |
| **Haiku 4.5** | Quick tasks, scaffolding, simple prompts |

### IDE Integration

Works seamlessly with your favorite editors:
- VS Code extension with native diff viewer
- JetBrains plugins for IntelliJ, PyCharm, and more
- Neovim integration via claude-code.nvim

### Extensible Architecture

Extend Claude Code's capabilities with:
- **MCP Servers** - Connect to databases, APIs, and external tools
- **Hooks** - Automate workflows with lifecycle events
- **Skills** - Create reusable, project-specific commands

## The Ecosystem

Claude Code is part of a larger ecosystem:

- **Claude Code CLI** - The core terminal application
- **Model Context Protocol (MCP)** - Open standard for AI-tool integration
- **Claude Agent SDK** - Build autonomous agents programmatically
- **IDE Extensions** - Native integrations for popular editors

## Getting Started

Ready to dive in?

1. [Install Claude Code](/getting-started/installation) on your system
2. [Set up authentication](/getting-started/authentication) with your Anthropic account
3. Follow the [Quick Start guide](/getting-started/quick-start) to write your first code

## Community

Join the growing Claude Code community:

- [GitHub Repository](https://github.com/anthropics/claude-code) - Source code and issues
- [Awesome Claude Code](https://github.com/hesreallyhim/awesome-claude-code) - Community resources
- [Discord](https://discord.gg/anthropic) - Chat with other developers

---

*Claude Code is developed by Anthropic. These community docs aim to provide comprehensive coverage of the entire ecosystem.*
