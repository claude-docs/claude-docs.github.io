---
sidebar_position: 1
title: Skills Overview
description: Extend Claude Code with custom skills
---

# Skills Overview

Skills are markdown-based guides that teach Claude specific tasks and workflows. They extend Claude's capabilities with project-specific knowledge.

## What are Skills?

Skills are structured instructions that Claude can discover and use:
- **Task-specific** - Focus on particular workflows
- **Reusable** - Share across projects and teams
- **Discoverable** - Claude finds relevant skills automatically
- **Versioned** - Track changes with your code

## Skills vs Commands

| Skills | Custom Commands |
|--------|-----------------|
| Detailed instructions | Simple templates |
| Auto-discovered | Explicitly invoked |
| Multi-step workflows | Single actions |
| Project knowledge | Quick shortcuts |

Both approaches work and can be combined.

## Skill Structure

Skills live in `.claude/skills/`:

```
.claude/
└── skills/
    └── review/
        └── SKILL.md
```

### SKILL.md Format

```markdown
---
name: review
description: Code review with security focus
version: 1.0.0
---

# Code Review Skill

When reviewing code, follow these steps:

1. Check for security vulnerabilities
2. Verify error handling
3. Review performance implications
4. Ensure test coverage

## Security Checklist

- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] SQL injection prevention
- [ ] XSS prevention
...
```

## Quick Start

### Create a Skill

```bash
mkdir -p .claude/skills/deploy
cat > .claude/skills/deploy/SKILL.md << 'EOF'
---
name: deploy
description: Safe deployment workflow
---

# Deployment Skill

Before deploying, ensure:
1. All tests pass
2. No linting errors
3. Changelog updated
4. Version bumped

## Deployment Steps

1. Create a release branch
2. Run full test suite
3. Build production assets
4. Deploy to staging
5. Run smoke tests
6. Deploy to production
EOF
```

### Use the Skill

Claude automatically discovers skills when relevant:

```
> Deploy the application
```

Or invoke explicitly:

```
> Use the deploy skill to release v2.0
```

## Skill Discovery

Claude finds skills when:

1. **Keywords match** - Skill name or description matches your request
2. **Context is relevant** - Task aligns with skill purpose
3. **Explicitly requested** - You mention the skill by name

## Built-in Skill Types

### Project Skills

Located in `.claude/skills/` (committed to repo):
- Shared with team
- Versioned with code
- Project-specific workflows

### Personal Skills

Located in `~/.claude/skills/` (user-only):
- Personal preferences
- Cross-project utilities
- Private workflows

## Skill Metadata

```yaml
---
name: skill-name          # Required: Identifier
description: Brief desc   # Required: What it does
version: 1.0.0           # Optional: Semantic version
triggers:                 # Optional: Auto-activation keywords
  - keyword1
  - keyword2
requires:                 # Optional: Dependencies
  - other-skill
---
```

## Best Practices

1. **Keep focused** - One skill, one purpose
2. **Be specific** - Clear, actionable instructions
3. **Include examples** - Show expected inputs/outputs
4. **Update regularly** - Keep skills current with codebase
5. **Document triggers** - Help Claude discover skills

## Community Skills

Find community-created skills:

- [Awesome Claude Skills](https://github.com/travisvn/awesome-claude-skills)
- [Claude Skills Hub](https://github.com/claude-skills)

## Next Steps

- [Creating Skills](/skills/creating-skills)
- [Custom Commands](/skills/custom-commands)
- [Configure settings](/cli/configuration)
