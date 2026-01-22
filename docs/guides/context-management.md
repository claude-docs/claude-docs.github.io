---
sidebar_position: 2
title: Context Management
description: Managing Claude Code's context window effectively
---

# Context Management

Claude Code operates within a context window that contains conversation history, file contents, and tool outputs. Managing this effectively is key to performance.

## Understanding Context

### What Uses Context

| Item | Approximate Size |
|------|------------------|
| System prompt | ~2,000 tokens |
| CLAUDE.md files | Variable |
| Conversation history | Cumulative |
| File contents | ~1 token per 4 chars |
| Tool outputs | Variable |
| MCP server resources | Variable |

### Context Limits

Different models have different limits:
- Claude Opus: 200K tokens
- Claude Sonnet: 200K tokens
- Claude Haiku: 200K tokens

## Monitoring Context

### View Usage

```
/context
```

Shows:
- Current usage percentage
- Breakdown by category
- Remaining capacity

### Status Check

```
/status
```

Shows overall session health including context.

## Managing Context

### Manual Compaction

Compress conversation history:

```
/compact
```

Best used at ~70% capacity before auto-compact triggers.

### Clear Session

Start fresh:

```
/clear
```

Removes all history but keeps CLAUDE.md context.

### Auto-Compaction

Claude automatically compacts at 95% capacity:
- Preserves important context
- Summarizes older messages
- Maintains continuity

## Optimization Strategies

### CLAUDE.md Size

Keep CLAUDE.md files concise:

```markdown
# Project (< 500 lines)

## Key Info
Essential project facts only.

## Commands
Most-used commands only.
```

### File References

Reference specific sections instead of whole files:

```
# Instead of
> Look at the entire auth module

# Use
> Look at the login function in src/auth/login.ts:45-80
```

### MCP Server Management

Disable unused servers before compacting:

```json
{
  "mcpServers": {
    "unused-server": {
      "disabled": true
    }
  }
}
```

### Conversation Hygiene

For long sessions:

1. Summarize progress periodically
2. Clear irrelevant tangents
3. Focus on current task

## Context Patterns

### Fresh Start Pattern

For new major tasks:

```
/clear
```

Then re-establish necessary context:

```
> I'm working on the authentication system. The key files are...
```

### Incremental Pattern

For ongoing work:

1. Work on focused tasks
2. Compact at 70%
3. Continue with preserved context

### Checkpoint Pattern

Before major changes:

1. Note current progress
2. Save important context to CLAUDE.md
3. Clear or compact
4. Resume with notes

## Troubleshooting

### "Context too large"

1. Run `/compact`
2. If still too large, `/clear`
3. Re-add essential context only

### Slow responses

Often indicates high context usage:

1. Check `/context`
2. Compact if >70%
3. Consider switching to Haiku for quick tasks

### Lost context

If Claude forgets important information:

1. Add to CLAUDE.md for persistence
2. Re-state in conversation
3. Use more specific references

## Best Practices

1. **Monitor regularly** - Check `/context` periodically
2. **Compact proactively** - Don't wait for auto-compact
3. **Keep CLAUDE.md lean** - Essential info only
4. **Reference specifically** - File sections, not entire files
5. **Clear for new tasks** - Fresh context for major work

## Context Economics

### Tokens → Cost

More context = higher API costs. Manage context to manage costs.

### Tokens → Speed

More context = slower responses. Lean context is faster.

### Tokens → Quality

Focused context = better responses. Noise degrades output.

## Next Steps

- [Cost Optimization](/guides/cost-optimization)
- [Best Practices](/guides/best-practices)
- [Configure settings](/cli/configuration)
