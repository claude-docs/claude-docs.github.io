---
sidebar_position: 2
title: Resources
description: Learning resources for Claude Code
---

# Community Resources

Resources for learning and mastering Claude Code.

## Official Documentation

- [Claude Code Docs](https://code.claude.com/docs) - Official documentation
- [Anthropic Docs](https://docs.anthropic.com) - Anthropic platform docs
- [MCP Specification](https://modelcontextprotocol.io) - Protocol specification

## Repositories

### Official

- [claude-code](https://github.com/anthropics/claude-code) - Main repository
- [mcp-servers](https://github.com/modelcontextprotocol/servers) - Official MCP servers
- [claude-agent-sdk](https://github.com/anthropics/claude-agent-sdk-python) - Python SDK

### Community

- [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) - Curated resources
- [awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) - Skills collection
- [claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) - Subagent library

## Learning

### Courses

- [MCP Introduction](https://anthropic.skilljar.com/introduction-to-model-context-protocol) - Official MCP course by Anthropic

### Tutorials

- [Getting Started Guide](/getting-started/introduction) - This site
- [Best Practices](/guides/best-practices) - Effective usage patterns
- [CI/CD Integration](/guides/ci-cd) - Automation tutorials

### Blog Posts & Articles

#### Official
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) - Anthropic engineering blog
- [Building with Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk) - Agent development
- [Claude Code Sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing) - Security deep-dive

#### Community Favorites
- [24 Claude Code Tips Advent Calendar](https://dev.to/oikon/24-claude-code-tips-claudecodeadventcalendar-52b5) - Daily tips covering advanced features
- [7 Essential Best Practices](https://www.eesel.ai/blog/claude-code-best-practices) - Production-ready workflows
- [15 Hidden Features](https://www.sidetool.co/post/claude-code-hidden-features-15-secrets-productivity-2025/) - Lesser-known productivity secrets
- [Advanced Workflows](https://www.sidetool.co/post/advanced-claude-code-workflows-tips-and-tricks-for-power-users/) - Power user tips and tricks
- [40% Productivity Increase Case Study](https://dev.to/dzianiskarviha/integrating-claude-code-into-production-workflows-lbn) - Real-world production integration
- [Claude Code Playbook](https://blog.whiteprompt.com/the-claude-code-playbook-5-tips-worth-1000s-in-productivity-22489d67dd89) - 5 high-value tips

#### Model Providers
- [Ollama + Claude Code](https://ollama.com/blog/claude) - Run Claude Code with local open-source models via Ollama
- [Local Models Tutorial](/tutorials/ollama-local-models) - Step-by-step guide to setting up Ollama with Claude Code

## Community

### Reddit

The Claude Code subreddit for tips, discussions, and community projects:

[r/ClaudeCode](https://www.reddit.com/r/ClaudeCode/)

### Discord

Join the Anthropic Discord for:
- Real-time help
- Announcements
- Community discussion

[Discord](https://discord.gg/anthropic)

### GitHub Discussions

For in-depth technical discussions:

[GitHub Discussions](https://github.com/anthropics/claude-code/discussions)

### Issues

Report bugs and request features:

[GitHub Issues](https://github.com/anthropics/claude-code/issues)

## Events

### Code with Claude

Annual developer event:

[Code with Claude 2025](https://www.anthropic.com/events/code-with-claude-2025)

## Tools & Extensions

### Usage Monitoring

Track your Claude Code token usage and costs:

| Tool | Description | Install |
|------|-------------|---------|
| [ccusage](https://github.com/ryoppippi/ccusage) | Fast CLI analyzer for token usage from JSONL files | `npm i -g ccusage` |
| [Claude-Code-Usage-Monitor](https://github.com/Maciek-roboblog/Claude-Code-Usage-Monitor) | Real-time terminal monitor with ML predictions | `uv tool install claude-monitor` |
| [ccburn](https://juanjofuchs.github.io/ai-development/2026/01/13/introducing-ccburn-visual-token-tracking.html) | Visual token tracking with tmux integration | GitHub |
| [claude-code-usage-analyzer](https://github.com/aarora79/claude-code-usage-analyzer) | Comprehensive cost analyzer with LiteLLM pricing | GitHub |

### Worktree Management

| Tool | Description |
|------|-------------|
| [ccswitch](https://github.com/ksred/ccswitch) | Simplified git worktree management for parallel agents |

### Awesome Lists

| List | Focus |
|------|-------|
| [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | General resources |
| [awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) | Skills |
| [jqueryscript/awesome-claude-code](https://github.com/jqueryscript/awesome-claude-code) | IDE tools |

### Plugins & Extensions

- [Claude Plugins Hub](https://claude-plugins.dev/) - Plugin marketplace
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code) - Official VS Code
- [JetBrains Plugin](https://plugins.jetbrains.com/plugin/27310-claude-code-beta-) - JetBrains IDEs

## Cheat Sheets

### CLI Commands

| Command | Action |
|---------|--------|
| `claude` | Start session |
| `claude -c` | Continue last |
| `claude -p "..."` | Headless mode |
| `/help` | Show help |
| `/clear` | Clear context |
| `/compact` | Compress context |
| `/rewind` | Rollback to checkpoint |
| `/context` | Check context usage |
| `/sandbox` | Restrict file/network access |
| `Shift+Tab` | Enter planning mode |
| `Ctrl+G` | Open in external editor |

### Model Selection

| Shortcut | Model |
|----------|-------|
| `/model opus` | Opus 4.5 |
| `/model sonnet` | Sonnet 4.5 |
| `/model haiku` | Haiku 4.5 |

### Power User Tips

| Tip | Description |
|-----|-------------|
| `&` prefix | Send task to Claude Code Web |
| `ultrathink` | Activate extended thinking mode |
| CLAUDE.md | Project memory - add rules when Claude makes mistakes |
| `.claude/commands/` | Store reusable prompt templates |
| `.claude/rules/` | Topic-specific rules with YAML frontmatter |
| Git worktrees | Run parallel Claude instances without conflicts |

## Books & Guides

### Community Guides

- [Builder.io Claude Code Guide](https://www.builder.io/blog/claude-code) - Practical guide
- [Shipyard CLI Cheatsheet](https://shipyard.build/blog/claude-code-cheat-sheet/) - Quick reference

## Stay Updated

### Changelog

[GitHub Releases](https://github.com/anthropics/claude-code/releases)

### Blog

[Anthropic Blog](https://www.anthropic.com/news)

### Twitter/X

Follow [@AnthropicAI](https://twitter.com/AnthropicAI) for updates.

## Next Steps

- [Contributing](/community/contributing)
- [Community Tools](/community/tools)
- [Getting Started](/getting-started/introduction)
