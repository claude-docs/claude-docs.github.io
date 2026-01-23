---
sidebar_position: 1
title: Community Tools
description: Community-built tools for Claude Code
---

# Community Tools

Explore tools built by the Claude Code community.

## Desktop GUIs

### Claudia

Beautiful desktop GUI for Claude Code with project and session management:

- Visual project/session browser
- Custom agent creation with sandboxed execution
- Usage analytics dashboard
- Built with Tauri 2 + React

```bash
# Build from source (native installers coming soon)
git clone https://github.com/marcusbey/claudia
```

[Website](https://claudia.so/) | [GitHub](https://github.com/marcusbey/claudia)

### opcode

Elegant desktop companion for Claude Code:

- Create custom agents with system prompts
- Manage interactive sessions
- Run secure background agents
- Process isolation and permission control

[Website](https://opcode.sh/) | [GitHub](https://github.com/winfunc/opcode)

---

## Web Interfaces

### claude-code-templates

Comprehensive CLI tool with web interface for configuration and monitoring:

```bash
# Interactive setup
npx claude-code-templates@latest

# Mobile-optimized chat interface
npx claude-code-templates@latest --chats

# Remote access via Cloudflare Tunnel
npx claude-code-templates@latest --chats --tunnel

# Analytics dashboard
npx claude-code-templates@latest --analytics
```

Features: 100+ agents, real-time analytics, session monitoring, health checks

[GitHub](https://github.com/davila7/claude-code-templates) | [npm](https://www.npmjs.com/package/claude-code-templates)

### claude-code-webui

Modern web interface for Claude Code CLI:

```bash
npm install -g claude-code-webui
claude-code-webui
# Open http://localhost:8080
```

[GitHub](https://github.com/sugyan/claude-code-webui)

### CloudCLI (Claude Code UI)

Desktop and mobile UI with remote access:

- Interactive chat interface
- Integrated shell terminal
- File explorer with syntax highlighting
- Git explorer for staging/committing

[GitHub](https://github.com/siteboon/claudecodeui) | [npm](https://www.npmjs.com/package/@siteboon/claude-code-ui)

### claude-run

Beautiful web UI for browsing conversation history:

```bash
npx claude-run
```

[GitHub](https://github.com/kamranahmedse/claude-run)

### Claudeman

Autonomous Claude Code with persistent GNU Screen sessions:

- Sessions survive restarts and network drops
- Multi-session dashboards
- Monitor panel

[GitHub](https://github.com/Ark0N/Claudeman)

---

## Model Routing

### Ollama

Run Claude Code with free local open-source models:

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Configure Claude Code to use Ollama
export ANTHROPIC_AUTH_TOKEN=ollama
export ANTHROPIC_BASE_URL=http://localhost:11434

# Run with a local model
claude --model qwen3-coder
```

Features:
- No API costs - run unlimited queries
- Private - code never leaves your machine
- Offline capable
- Supports qwen3-coder, codellama, deepseek-coder, and cloud models

[Blog Post](https://ollama.com/blog/claude) | [Tutorial](/tutorials/ollama-local-models)

### claude-code-router

Route Claude Code requests to alternative AI providers:

```bash
npm install -g @musistudio/claude-code-router
```

Supported providers:
- OpenRouter
- DeepSeek
- Ollama (local models)
- Gemini
- VolcEngine
- SiliconFlow

Features:
- Dynamic model switching: `/model deepseek,deepseek-chat`
- Context-based routing for background/reasoning tasks
- Cost optimization

[GitHub](https://github.com/musistudio/claude-code-router) | [Website](https://claudecoderouter.com/)

---

## Usage Monitoring

| Tool | Description | Install |
|------|-------------|---------|
| [ccusage](https://github.com/ryoppippi/ccusage) | Fast CLI usage analyzer | `npm i -g ccusage` |
| [Claude-Code-Usage-Monitor](https://github.com/Maciek-roboblog/Claude-Code-Usage-Monitor) | Real-time terminal monitor with ML predictions | `uv tool install claude-monitor` |
| [ccburn](https://github.com/juanjofuchs/ccburn) | Visual token tracking with tmux integration | GitHub |
| [claude-code-usage-analyzer](https://github.com/aarora79/claude-code-usage-analyzer) | Comprehensive cost analyzer | GitHub |

---

## Multi-Agent Orchestration

### Claude Squad

Terminal app for managing multiple Claude instances:

```bash
npm install -g claude-squad
claude-squad init
```

[GitHub](https://github.com/smtg-ai/claude-squad)

### Claude-Flow

Advanced multi-agent orchestration with 54+ specialized agents:

```bash
npm install -g claude-flow
claude-flow init
```

[GitHub](https://github.com/ruvnet/claude-flow)

### wshobson/agents

Production-ready system with 108 specialized agents:

- 15 multi-agent workflow orchestrators
- 129 agent skills
- 72 development tools

[GitHub](https://github.com/wshobson/agents)

---

## Skills Directories

### skills.sh

Vercel's open skills directory with leaderboard and easy installation:

```bash
npx skills add vercel-labs/react-best-practices
```

Popular skills include React best practices (32K+ installs), web design guidelines, and framework-specific patterns.

**Features:**
- Agent-agnostic (Claude Code, Cursor, Copilot, Codex)
- Open SKILL.md standard
- Leaderboard by install count

**Security warnings:**
- Skills are executable instructions, not just documentation - [audit before installing](https://www.aikido.dev/blog/agent-skills-spreading-hallucinated-npx-commands)
- Rankings come from Vercel's own telemetry (Vercel skills dominate leaderboard)
- No built-in version management or update mechanism
- Installation paths vary by agent - removal can be unclear

[Website](https://skills.sh/) | [GitHub](https://github.com/vercel-labs/agent-skills)

### Alternative Directories

| Directory | Description |
|-----------|-------------|
| [anthropics/skills](https://github.com/anthropics/skills) | Official Anthropic skills repository |
| [SkillsMP](https://skillsmp.com/) | Community marketplace with 71K+ skills |
| [OpenSkills](https://github.com/numman-ali/openskills) | Universal loader for multiple agents |

---

## Skills & Subagents

### Awesome Claude Code Subagents

100+ specialized subagents for development use cases:

[GitHub](https://github.com/VoltAgent/awesome-claude-code-subagents)

### Build With Claude

Hub for Skills, Agents, Commands, Hooks, and Plugins:

[GitHub](https://github.com/davepoon/buildwithclaude)

### claude-skills

Factory toolkit for generating production-ready skills:

[GitHub](https://github.com/alirezarezvani/claude-skills)

### claude-code-settings

Curated settings, commands, and subagents for vibe coding:

[GitHub](https://github.com/feiskyer/claude-code-settings)

---

## IDE Extensions

### VS Code Extension

Official extension for Visual Studio Code:

[Marketplace](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code)

### JetBrains Plugin

Beta plugin for JetBrains IDEs:

[JetBrains Marketplace](https://plugins.jetbrains.com/plugin/27310-claude-code-beta-)

### Neovim Plugin

Community Neovim integration:

```lua
use "anthropics/claude-code.nvim"
```

[GitHub](https://github.com/anthropics/claude-code.nvim)

---

## Worktree Management

### ccswitch

Simplified git worktree management for parallel agents:

```bash
npm install -g ccswitch
ccswitch create feature/new-feature
ccswitch list
ccswitch switch feature/new-feature
```

[GitHub](https://github.com/ksred/ccswitch)

---

## MCP Servers

### Official Servers

| Server | Purpose |
|--------|---------|
| Filesystem | File operations |
| GitHub | Repository management |
| PostgreSQL | Database queries |
| SQLite | Local databases |
| Memory | Persistent memory |

[GitHub](https://github.com/modelcontextprotocol/servers)

### Community Servers

Thousands of community-built servers:

- Database connectors (MongoDB, Redis, MySQL)
- API integrations (Slack, Notion, Jira)
- Development tools (Docker, Kubernetes)

[awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) | [MCP Registry](https://github.com/modelcontextprotocol/registry)

### claude-code-mcp

Run Claude Code as a one-shot MCP server (agent in your agent):

[GitHub](https://github.com/steipete/claude-code-mcp)

---

## Awesome Lists

| List | Focus |
|------|-------|
| [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | Skills, hooks, commands, plugins |
| [awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) | Skills collection |
| [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) | MCP servers |
| [jqueryscript/awesome-claude-code](https://github.com/jqueryscript/awesome-claude-code) | IDE tools |
| [awesomeclaude.ai](https://awesomeclaude.ai) | Visual directory |

---

## Official Plugins

Anthropic maintains an official plugins directory:

[GitHub](https://github.com/anthropics/claude-plugins-official)

---

## Resources

### ClaudeLog

Documentation, guides, and tutorials:

[ClaudeLog](https://claudelog.com/)

### Claude Plugins Hub

Marketplace for Claude plugins:

[Claude Plugins Hub](https://claude-plugins.dev/)

---

## Contributing Tools

Want to share your tool?

1. Add to [Awesome Claude Code](https://github.com/hesreallyhim/awesome-claude-code)
2. Submit to community registries
3. Share on [Discord](https://discord.gg/anthropic) or [r/ClaudeCode](https://reddit.com/r/ClaudeCode)

## Next Steps

- [Community Resources](/community/resources)
- [Contributing](/community/contributing)
- [MCP Servers](/mcp/servers)
