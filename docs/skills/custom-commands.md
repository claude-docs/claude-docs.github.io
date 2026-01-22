---
sidebar_position: 3
title: Custom Commands
description: Create custom slash commands for Claude Code
---

# Custom Commands

Custom commands are slash commands you create for your project or personal use.

## Overview

Custom commands provide:
- Quick shortcuts for common tasks
- Parameterized templates
- Project-specific workflows

## Command Location

### Project Commands

Shared with your team:

```
.claude/commands/
├── review.md
├── deploy.md
└── test.md
```

### Personal Commands

Available in all projects:

```
~/.claude/commands/
├── format.md
└── my-workflow.md
```

## Creating Commands

### Basic Command

```markdown title=".claude/commands/review.md"
Review the code in the current file for:
- Security vulnerabilities
- Performance issues
- Code style violations
```

### Using Parameters

Use `$ARGUMENTS` for dynamic input:

```markdown title=".claude/commands/create-component.md"
Create a React component named $ARGUMENTS with:
- TypeScript types
- Props interface
- Basic styling
- Unit test file
```

Usage:
```
/create-component Button
```

### Multi-Parameter Commands

```markdown title=".claude/commands/migrate.md"
Create a database migration:
- Migration name: $ARGUMENTS
- Include up and down migrations
- Add to migrations folder
```

## Command Naming

The filename becomes the command name:

| Filename | Command |
|----------|---------|
| `review.md` | `/review` |
| `create-test.md` | `/create-test` |
| `my-workflow.md` | `/my-workflow` |

## Examples

### Code Review

```markdown title=".claude/commands/review.md"
Perform a thorough code review:

1. Check for bugs and logic errors
2. Identify security vulnerabilities
3. Suggest performance improvements
4. Verify error handling
5. Check test coverage

Provide specific, actionable feedback.
```

### Test Generation

```markdown title=".claude/commands/test.md"
Generate tests for $ARGUMENTS:

- Use the existing test framework
- Cover happy path and edge cases
- Include error scenarios
- Add meaningful test descriptions
- Mock external dependencies
```

### Documentation

```markdown title=".claude/commands/doc.md"
Document $ARGUMENTS:

- Add JSDoc comments to all exports
- Create a README section if needed
- Include usage examples
- List parameters and return types
```

### Git Workflows

```markdown title=".claude/commands/pr.md"
Prepare a pull request:

1. Review all changes
2. Write a clear PR description
3. List any breaking changes
4. Add testing instructions
5. Tag relevant reviewers
```

```markdown title=".claude/commands/commit.md"
Create a commit for the current changes:

- Use conventional commit format
- Write a clear, concise message
- Reference any related issues
```

### Refactoring

```markdown title=".claude/commands/refactor.md"
Refactor $ARGUMENTS:

- Improve code structure
- Extract reusable functions
- Simplify complex logic
- Maintain existing behavior
- Update any affected tests
```

## Advanced Usage

### Conditional Instructions

```markdown title=".claude/commands/build.md"
Build the project:

If package.json exists:
  - Run `npm run build`

If Cargo.toml exists:
  - Run `cargo build --release`

If Makefile exists:
  - Run `make build`
```

### Multi-Step Workflows

```markdown title=".claude/commands/release.md"
Prepare a release:

Step 1: Version Bump
- Update version in package.json
- Update CHANGELOG.md

Step 2: Build
- Run production build
- Verify no errors

Step 3: Test
- Run full test suite
- Ensure all pass

Step 4: Tag
- Create git tag
- Push to remote
```

### Integration with Hooks

Commands can trigger hooks:

```markdown title=".claude/commands/format.md"
Format all files in $ARGUMENTS:

1. Find all source files
2. Run prettier on each
3. Run eslint --fix
4. Report any remaining issues
```

## Viewing Commands

List available commands:

```
/help
```

Or check the commands directory:

```bash
ls .claude/commands/
ls ~/.claude/commands/
```

## Best Practices

1. **Keep commands focused** - One command, one purpose
2. **Use clear names** - Command name should indicate action
3. **Document parameters** - Explain what $ARGUMENTS expects
4. **Include examples** - Show expected usage
5. **Test commands** - Verify they work as expected

## Migrating to Skills

For complex commands, consider upgrading to skills:

| Use Commands For | Use Skills For |
|------------------|----------------|
| Simple templates | Multi-step workflows |
| Quick actions | Project knowledge |
| One-off tasks | Reusable patterns |

## Next Steps

- [Learn about Skills](/skills/overview)
- [Create Skills](/skills/creating-skills)
- [Configure settings](/cli/configuration)
