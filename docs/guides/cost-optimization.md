---
sidebar_position: 3
title: Cost Optimization
description: Optimize Claude Code costs effectively
---

# Cost Optimization

Manage your Claude Code usage costs while maintaining productivity.

## Understanding Costs

### Usage Statistics

Average usage patterns:
- **Average cost**: ~$6 per developer per day
- **90th percentile**: Under $12 per day
- **Heavy users**: May reach $20+ per day

### Cost Factors

| Factor | Impact |
|--------|--------|
| Model choice | Highest impact |
| Context size | High impact |
| Session length | Medium impact |
| Tool usage | Low impact |

## Model Selection

### Cost Per Model

| Model | Relative Cost | Best For |
|-------|---------------|----------|
| Haiku | Lowest | Quick tasks, scaffolding |
| Sonnet | Medium | Daily development |
| Opus | Highest | Complex reasoning |

### Switching Strategy

```
# Quick tasks
/model haiku

# Standard work
/model sonnet

# Complex problems
/model opus
```

### Task-Based Selection

| Task | Model |
|------|-------|
| File scaffolding | Haiku |
| Bug fixes | Sonnet |
| Code review | Sonnet |
| Architecture | Opus |
| Documentation | Haiku |
| Refactoring | Sonnet |
| Security audit | Opus |

## Context Optimization

### Reduce Context Size

```
# Monitor usage
/context

# Compact proactively
/compact
```

### Efficient File References

```
# Less efficient (loads entire file)
> Review the auth module

# More efficient (specific lines)
> Review src/auth/login.ts:45-80
```

### CLAUDE.md Management

Keep CLAUDE.md under 500 lines:

```markdown
# Essential Info Only

## Project Type
TypeScript React app

## Key Commands
npm run dev
npm test
```

## Session Strategies

### Short Sessions

For quick tasks, use brief sessions:

```bash
claude "fix the typo in README.md"
```

### Focused Sessions

One topic per session reduces context waste:

```bash
# Session 1: Frontend
claude "work on the UI components"

# Session 2: Backend
claude "work on the API endpoints"
```

### Fresh Starts

For new tasks, clear context:

```
/clear
```

## Headless Mode

For automation, use minimal interaction:

```bash
# Quick, focused query
claude -p "generate types for User model" --model haiku
```

## Cost Tracking

### Monitor Usage

Check your usage in the Claude console or billing dashboard.

### Set Alerts

Configure spending alerts in your Anthropic account.

### Team Budgets

For teams, set per-developer or per-project limits.

## Cost-Saving Patterns

### Haiku-First Pattern

Start with Haiku, escalate if needed:

```
/model haiku
> Create the basic structure

/model sonnet
> Add the complex logic
```

### Batch Pattern

Group related tasks:

```
# Instead of multiple small requests
> Add test for function A
> Add test for function B

# Batch into one
> Add tests for all functions in utils/
```

### Cache Pattern

Save reusable outputs:

```
# Generate once
> Create a TypeScript interface for our API response

# Save it
# Copy the output to a types file for reuse
```

### Template Pattern

Create templates for common tasks:

```markdown title=".claude/commands/quick-fix.md"
Fix this issue quickly, minimal changes only.
$ARGUMENTS
```

## Enterprise Considerations

### API Key Usage

Direct API access may be more cost-effective for heavy usage.

### Bedrock/Vertex

Consider AWS Bedrock or Google Vertex for enterprise pricing.

### Usage Auditing

Track usage across teams:

```json
{
  "hooks": {
    "Stop": [{
      "command": "log_usage.sh $SESSION_ID $TURN_COUNT"
    }]
  }
}
```

## Quick Reference

### Reduce Costs

- Use Haiku for simple tasks
- Compact context regularly
- Clear sessions for new topics
- Use specific file references
- Keep CLAUDE.md lean

### Track Costs

- Monitor `/context` usage
- Check billing dashboard
- Set spending alerts
- Review weekly usage

## Next Steps

- [Context Management](/guides/context-management)
- [Best Practices](/guides/best-practices)
- [Model Selection](/reference/models)
