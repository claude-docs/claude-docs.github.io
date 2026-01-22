---
sidebar_position: 4
title: Multi-Agent
description: Working with multiple Claude agents
---

# Multi-Agent Workflows

Run multiple Claude agents for parallel development and specialized tasks.

## Built-in Subagents

Claude Code includes specialized subagents:

### Plan Subagent

Dedicated planning with resumption:

```
> Plan how to implement this feature, don't code yet
```

### Explore Subagent

Fast codebase search (uses Haiku):

```
> Explore how authentication works in this project
```

## Git Worktrees

Run multiple Claude sessions on different branches:

### Setup

```bash
# Create worktree for a feature
git worktree add ../myapp-auth -b feature/auth main

# Start Claude in the worktree
cd ../myapp-auth
claude
```

### Benefits

- Isolated working directories
- Shared Git history
- Parallel development
- No stash/switch needed

### Cleanup

```bash
git worktree remove ../myapp-auth
```

## Parallel Sessions

### Terminal Multiplexing

Use tmux or screen for multiple sessions:

```bash
# Create sessions
tmux new-session -s frontend
tmux new-session -s backend

# Each runs its own Claude
claude
```

### Task Separation

| Session | Focus |
|---------|-------|
| Frontend | UI components |
| Backend | API endpoints |
| Testing | Test coverage |
| Docs | Documentation |

## Multi-Agent Frameworks

### Claude Squad

Terminal app for managing multiple Claude instances:

```bash
# Install
npm install -g claude-squad

# Launch squad
claude-squad init
```

Features:
- Multiple simultaneous agents
- Task coordination
- Shared context

### Claude-Flow

Advanced multi-agent orchestration:

```bash
# Install
npm install -g claude-flow

# Initialize
claude-flow init
```

Features:
- 54+ specialized agents
- Swarm orchestration
- Task distribution

## Custom Subagents

Create specialized agents for specific tasks:

### Agent Definition

```json title=".claude/agents/reviewer.json"
{
  "name": "reviewer",
  "description": "Code review specialist",
  "systemPrompt": "You are a senior code reviewer...",
  "tools": ["read", "grep"],
  "model": "claude-sonnet-4-5-20250929"
}
```

### Usage

```
> Use the reviewer agent to check this PR
```

## Orchestration Patterns

### Pipeline Pattern

Sequential processing:

```
Agent 1 (Plan) → Agent 2 (Implement) → Agent 3 (Test)
```

### Fan-Out Pattern

Parallel processing:

```
                ┌→ Agent 1 (Frontend)
Main Agent ─────┼→ Agent 2 (Backend)
                └→ Agent 3 (Tests)
```

### Specialist Pattern

Route by task type:

```
Router → Task Type A → Specialist A
       → Task Type B → Specialist B
       → Task Type C → Specialist C
```

## Benefits

### Cost Reduction

Smart model allocation:
- Haiku for exploration
- Sonnet for implementation
- Opus for review

### Context Isolation

Independent context windows prevent cross-contamination.

### Accuracy

Domain-specific prompts improve results.

## Best Practices

### Task Boundaries

Define clear boundaries between agents:

```
Agent 1: All frontend code
Agent 2: All backend code
Agent 3: All test code
```

### Coordination

Use files or external systems for agent coordination:

```bash
# Shared state file
echo "frontend: complete" >> .agent-state
```

### Resource Management

- Limit concurrent agents
- Monitor total API usage
- Close idle agents

## Next Steps

- [CI/CD Integration](/guides/ci-cd)
- [Best Practices](/guides/best-practices)
- [Agent SDK](/sdk/overview)
