---
sidebar_position: 1
title: Best Practices
description: Best practices for using Claude Code effectively
---

# Best Practices

Maximize your productivity with Claude Code by following these proven practices.

## Prompting

### Be Specific

```
# Less effective
> Fix the bug

# More effective
> Fix the login form validation bug where empty email fields aren't caught
```

### Provide Context

```
# Less effective
> Add authentication

# More effective
> Add JWT authentication to the Express API using our existing User model
```

### Break Down Large Tasks

```
# Less effective
> Build a complete user management system

# More effective
> Let's build user management in steps:
> 1. First, create the User model
> 2. Then, add CRUD API endpoints
> 3. Finally, add the UI components
```

### Use Plan Mode

For complex changes, plan first:

```
> Plan how to implement dark mode across the app, don't code yet
```

## Workflow

### Start with Context

Begin each session by letting Claude understand your codebase:

```
> What does this project do and how is it structured?
```

### Use Git Branches

Start each feature on a new branch:

```bash
git checkout -b feature/new-feature
claude
```

### Leverage Checkpoints

Use `Esc` `Esc` to access checkpoints and undo changes safely.

### Save Important Context

Use `#` to add important information to CLAUDE.md:

```
# This project uses PostgreSQL 15 and requires the uuid-ossp extension
```

## Model Selection

### Match Model to Task

| Task | Recommended Model |
|------|-------------------|
| Complex architecture | Opus |
| Day-to-day coding | Sonnet |
| Quick questions | Haiku |
| Debugging | Sonnet/Opus |
| Documentation | Sonnet |

### Switch When Needed

```
/model opus    # For complex reasoning
/model haiku   # For quick tasks
```

## Context Management

### Monitor Usage

```
/context
```

### Compact Proactively

Compact at ~70% usage rather than waiting for auto-compact:

```
/compact
```

### Keep CLAUDE.md Lean

Aim for under 500 lines for optimal performance.

## Code Quality

### Let Claude Run Tests

```
> Run the tests after making these changes
```

### Review Before Accepting

Always review diffs before accepting changes.

### Use Type Hints

Provide type information when relevant:

```
> Create a function that takes a User object and returns a Promise<boolean>
```

## Cost Optimization

### Use Appropriate Models

- Haiku for setup and simple tasks
- Sonnet for standard development
- Opus for complex problems

### Manage Context

- Compact regularly
- Clear unnecessary history
- Use specific file references

### Batch Operations

Group related requests:

```
# Instead of multiple separate requests
> Add logging to function A
> Add logging to function B

# Use a single request
> Add logging to all functions in the utils folder
```

## Security

### Protect Secrets

Configure deny rules for sensitive files:

```json
{
  "permissions": {
    "deny": ["Read(./.env)", "Read(**/*secret*)"]
  }
}
```

### Review Tool Usage

Check what tools Claude can use:

```
/permissions
```

### Audit Actions

Enable logging hooks for compliance:

```json
{
  "hooks": {
    "PreToolUse": [{
      "command": "echo \"$TOOL: $FILE\" >> audit.log"
    }]
  }
}
```

## Team Collaboration

### Share CLAUDE.md

Commit project CLAUDE.md with team conventions:

```markdown
# Project Guidelines

## Architecture
- Use feature folders
- Keep components small

## Commands
- `npm run dev` - Start development
- `npm test` - Run tests
```

### Standardize Settings

Share `.claude/settings.json` for consistent configuration.

### Document Skills

Create skills for team workflows:

```
.claude/skills/
├── code-review/
├── deployment/
└── release/
```

## Troubleshooting Workflow

### When Things Go Wrong

1. Use `/rewind` to restore previous state
2. Check `/context` for usage issues
3. Run `/doctor` for diagnostics
4. Try `/clear` for a fresh start

### Common Fixes

| Issue | Solution |
|-------|----------|
| Slow responses | `/compact` or `/clear` |
| Wrong changes | `/rewind` |
| Model confusion | `/clear` and rephrase |
| Tool errors | Check permissions |

## Next Steps

- [Context Management](/guides/context-management)
- [Cost Optimization](/guides/cost-optimization)
- [Configure settings](/cli/configuration)
