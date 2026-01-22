---
sidebar_position: 4
title: FAQ
description: Frequently asked questions about Claude Code
---

# Frequently Asked Questions

Common questions about Claude Code.

## General

### What is Claude Code?

Claude Code is an agentic coding tool from Anthropic that runs in your terminal. It understands your codebase and helps you code faster through natural language commands.

### How is it different from ChatGPT or Copilot?

Claude Code is an *agent* that can:
- Read and write files directly
- Run terminal commands
- Make multi-step plans
- Use external tools (MCP)

Unlike copilot-style tools, it operates autonomously on your codebase.

### What subscription do I need?

You need one of:
- Claude Pro ($20/month)
- Claude Max ($100+/month)
- Claude Teams (per seat)
- Claude Enterprise (custom)

Or use an Anthropic API key directly.

### What models are available?

- Claude Opus 4.5 - Complex reasoning
- Claude Sonnet 4.5 - Day-to-day coding
- Claude Haiku 4.5 - Quick tasks

## Usage

### How do I start?

```bash
claude
```

This opens an interactive session in your terminal.

### Can I use it without a subscription?

Yes, you can use an Anthropic API key instead. Set it via:

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

### How do I resume a conversation?

```bash
claude -c
```

### Can I use it in CI/CD?

Yes, use headless mode:

```bash
claude -p "your prompt" --json
```

## Features

### What can Claude Code do?

- Write and edit code
- Run shell commands
- Read your codebase
- Create and modify files
- Run tests
- Git operations
- Connect to external tools (databases, APIs)

### What is MCP?

Model Context Protocol - an open standard for connecting AI to external tools. Claude Code can use MCP servers to access databases, APIs, and more.

### What are hooks?

User-defined shell commands that run at lifecycle points (before/after tools run, when sessions start, etc.).

### What are skills?

Markdown-based guides that teach Claude project-specific workflows.

## Context

### How much context can Claude handle?

All models support 200K tokens, which is approximately:
- 500 pages of text
- Thousands of lines of code

### How do I manage context?

- `/context` - View usage
- `/compact` - Compress history
- `/clear` - Start fresh

### What is CLAUDE.md?

A file containing project-specific memory and instructions that Claude loads automatically.

## Security

### Is my code sent to Anthropic?

Yes, your code is sent to Anthropic's API for processing. Review Anthropic's privacy policy for details.

### Can I restrict what Claude can access?

Yes, use permissions:

```json
{
  "permissions": {
    "deny": ["Read(./.env)", "Bash(rm *)"]
  }
}
```

### Does Claude commit to Git automatically?

No, Claude only commits when explicitly asked.

## Cost

### How much does it cost?

With a Claude Pro subscription:
- Average: ~$6/day per developer
- 90th percentile: ~$12/day

### How do I reduce costs?

- Use Haiku for simple tasks
- Compact context regularly
- Use specific file references
- Don't keep idle sessions

### Is there a free tier?

No, Claude Code requires a Claude subscription or API key.

## Technical

### What are the system requirements?

- Node.js 18+
- macOS, Windows, or Linux
- Terminal emulator

### Does it work on Windows?

Yes, via:
- Native Windows
- WSL/WSL2
- Git Bash

### Can I use it offline?

No, Claude Code requires internet connection to communicate with Anthropic's API.

### Does it support all programming languages?

Yes, Claude understands all major programming languages. Quality may vary for obscure languages.

## Comparison

### Claude Code vs Cursor?

| Feature | Claude Code | Cursor |
|---------|-------------|--------|
| Interface | Terminal | IDE |
| Agent mode | Full | Partial |
| MCP support | Yes | Limited |
| IDE required | No | Yes |

### Claude Code vs Aider?

| Feature | Claude Code | Aider |
|---------|-------------|-------|
| Provider | Anthropic | Multi |
| MCP | Yes | No |
| IDE plugins | Yes | No |
| Hooks | Yes | No |

## Troubleshooting

### It's not working, help!

1. Run `claude doctor`
2. Check the [troubleshooting guide](/reference/troubleshooting)
3. [Report a bug](/bug)

### Where do I get help?

- [GitHub Issues](https://github.com/anthropics/claude-code/issues)
- [Discord](https://discord.gg/anthropic)
- This documentation

## Next Steps

- [Getting Started](/getting-started/introduction)
- [CLI Reference](/cli/overview)
- [Troubleshooting](/reference/troubleshooting)
