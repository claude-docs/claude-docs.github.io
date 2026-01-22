---
sidebar_position: 1
title: Models
description: Claude models available in Claude Code
---

# Claude Models

Claude Code supports multiple Claude models, each optimized for different use cases.

## Available Models

| Model | ID | Best For |
|-------|-----|----------|
| **Opus 4.5** | `claude-opus-4-5-20251101` | Complex reasoning, architecture |
| **Sonnet 4.5** | `claude-sonnet-4-5-20250929` | Day-to-day coding |
| **Haiku 4.5** | `claude-haiku-4-5-20251001` | Quick tasks, scaffolding |

## Model Comparison

### Claude Opus 4.5

**Strengths:**
- Complex, multi-step reasoning
- Architectural decisions
- Deep code analysis
- Long-horizon planning
- Security audits

**Context:** 200K tokens

**Use when:**
- Designing complex systems
- Debugging difficult issues
- Reviewing security
- Analyzing large codebases

### Claude Sonnet 4.5

**Strengths:**
- Balanced performance and cost
- Fast responses
- Good code generation
- Effective for most tasks

**Context:** 200K tokens

**Use when:**
- Daily development
- Bug fixes
- Feature implementation
- Code review

### Claude Haiku 4.5

**Strengths:**
- Fastest responses
- Lowest cost
- Good for simple tasks
- Efficient for exploration

**Context:** 200K tokens

**Use when:**
- Quick questions
- File scaffolding
- Simple formatting
- Code exploration

## Model Selection

### CLI Flag

```bash
claude --model claude-opus-4-5-20251101
```

### Short Forms

```bash
claude --model opus
claude --model sonnet
claude --model haiku
```

### In-Session Switch

```
/model opus
/model sonnet
/model haiku
```

### Configuration

```json title="settings.json"
{
  "model": "claude-sonnet-4-5-20250929"
}
```

## Extended Thinking

Opus 4.5 supports extended thinking mode:

```json
{
  "model": "claude-opus-4-5-20251101",
  "extendedThinking": true
}
```

This shows Claude's step-by-step reasoning process, ideal for:
- Complex debugging
- Architectural decisions
- Niche problems

## Model-Task Matrix

| Task | Recommended | Alternative |
|------|-------------|-------------|
| New feature | Sonnet | Opus for complex |
| Bug fix | Sonnet | Haiku for simple |
| Refactoring | Sonnet | Opus for large |
| Code review | Sonnet | Opus for security |
| Documentation | Haiku | Sonnet for API docs |
| Tests | Sonnet | Haiku for basic |
| Architecture | Opus | - |
| Quick question | Haiku | - |
| File creation | Haiku | Sonnet |

## Cost Optimization

Models have different pricing tiers:

| Model | Relative Cost |
|-------|---------------|
| Opus | Highest |
| Sonnet | Medium |
| Haiku | Lowest |

### Strategy

1. Start with Haiku for exploration
2. Use Sonnet for implementation
3. Reserve Opus for complex reasoning

## Performance Tips

### Optimize for Speed

```
/model haiku
```

Haiku provides fastest responses for quick tasks.

### Optimize for Quality

```
/model opus
```

Opus provides highest quality for complex tasks.

### Balance

```
/model sonnet
```

Sonnet balances speed, quality, and cost.

## Next Steps

- [Permission System](/reference/permissions)
- [Cost Optimization](/guides/cost-optimization)
- [Configuration](/cli/configuration)
