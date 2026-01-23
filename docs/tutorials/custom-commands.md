---
sidebar_position: 4
title: Custom Slash Commands
description: Create reusable commands for your team
format: md
---

# Custom Slash Commands

Build your own slash commands that automate repetitive tasks and share workflows with your team.

**What you'll learn:**
- Creating custom slash commands
- Using arguments and file references
- Team-wide command sharing
- Real-world command examples

**Time:** 10 minutes

---

## Why Custom Commands?

Instead of typing the same complex prompts repeatedly:

```
Review this code for security vulnerabilities, check for SQL injection,
XSS, authentication bypasses, and provide specific line numbers...
```

Create a command once and use it forever:

```
/security-review src/auth.js
```

---

## Your First Custom Command

### Step 1: Create the Commands Directory

```bash
mkdir -p .claude/commands
```

### Step 2: Create a Command File

```bash
cat > .claude/commands/review.md << 'EOF'
# Code Review

Review the file @$ARGUMENTS for:

1. **Bugs**: Logic errors, off-by-one, null checks
2. **Security**: Input validation, injection risks
3. **Performance**: Inefficient algorithms, memory leaks
4. **Style**: Naming, formatting, documentation

Format your response as:
- 🔴 Critical: [issue]
- 🟡 Warning: [issue]
- 🟢 Suggestion: [issue]

Include specific line numbers for each finding.
EOF
```

### Step 3: Use Your Command

```
> /review src/auth.js
```

Claude receives the file content via `@$ARGUMENTS` and runs your review template.

---

## Command Syntax

### The `$ARGUMENTS` Variable

`$ARGUMENTS` captures everything after the command name:

```
/mycommand hello world
         └── $ARGUMENTS = "hello world"
```

Use it in your command file:
```markdown
Process this input: $ARGUMENTS
```

### File References with `@`

Reference files using `@` syntax:

```markdown
# Analyze the file
Review @$ARGUMENTS and explain what it does.
```

When you run `/analyze src/utils.js`, Claude sees:
```
Review @src/utils.js and explain what it does.
```

The `@src/utils.js` gets expanded to the file contents.

### Multiple Arguments

```markdown
# Compare files
Compare @$1 and @$2, highlighting the differences.
```

Usage: `/compare old.js new.js`

---

## Essential Commands to Create

### 1. Explain Code

```markdown title=".claude/commands/explain.md"
# Explain This Code

Explain @$ARGUMENTS in plain English:

1. **Purpose**: What does this code do?
2. **How it works**: Step-by-step explanation
3. **Key concepts**: Important patterns or techniques used
4. **Dependencies**: What does it rely on?

Use simple language suitable for a junior developer.
```

### 2. Write Tests

```markdown title=".claude/commands/test.md"
# Generate Tests

Generate comprehensive unit tests for @$ARGUMENTS.

Requirements:
- Use the existing test framework in this project
- Cover happy path scenarios
- Cover edge cases and error conditions
- Include setup and teardown if needed
- Match the testing style used elsewhere in the codebase

Run the tests after writing them to verify they pass.
```

### 3. Security Audit

```markdown title=".claude/commands/security.md"
# Security Audit

Perform a security audit on @$ARGUMENTS.

Check for:
- [ ] SQL Injection vulnerabilities
- [ ] XSS (Cross-Site Scripting)
- [ ] CSRF vulnerabilities
- [ ] Authentication/Authorization issues
- [ ] Sensitive data exposure
- [ ] Input validation problems
- [ ] Insecure dependencies

For each finding:
1. Describe the vulnerability
2. Show the vulnerable code (line number)
3. Explain the risk (CVSS if applicable)
4. Provide a fix with code example
```

### 4. Refactor

```markdown title=".claude/commands/refactor.md"
# Refactor Code

Refactor @$ARGUMENTS to improve:

1. **Readability**: Clear naming, reduced complexity
2. **Maintainability**: Single responsibility, DRY
3. **Performance**: Optimize hot paths if obvious
4. **Type Safety**: Add/improve types if TypeScript

Constraints:
- Maintain the same public interface
- Don't change behavior (unless it's a bug)
- Keep the same test coverage

Show the refactored code and explain each change.
```

### 5. Document

```markdown title=".claude/commands/document.md"
# Generate Documentation

Generate documentation for @$ARGUMENTS.

Include:
- Module/function description
- Parameters with types and descriptions
- Return values
- Usage examples
- Edge cases or important notes

Use the documentation style that matches this project:
- JSDoc for JavaScript
- Docstrings for Python
- XML comments for C#
- etc.
```

### 6. Quick Fix

```markdown title=".claude/commands/fix.md"
# Quick Fix

Fix the issue in @$ARGUMENTS: $2

Steps:
1. Identify the root cause
2. Implement the minimal fix
3. Verify the fix doesn't break anything
4. Run relevant tests

Keep changes minimal and focused.
```

Usage: `/fix src/auth.js "users can't log in after password reset"`

---

## Team Commands

### Sharing Commands via Git

Commands in `.claude/commands/` can be committed to your repo:

```bash
git add .claude/commands/
git commit -m "Add team slash commands"
git push
```

Now everyone on your team has access to the same commands.

### Project-Specific Commands

Create commands for your specific project needs:

```markdown title=".claude/commands/deploy-check.md"
# Pre-Deployment Checklist

Before deploying, verify:

1. [ ] All tests pass: `npm test`
2. [ ] No TypeScript errors: `npm run typecheck`
3. [ ] No lint errors: `npm run lint`
4. [ ] Environment variables documented
5. [ ] Database migrations ready
6. [ ] API versioning correct
7. [ ] Changelog updated

Run each check and report the results.
```

```markdown title=".claude/commands/db-migrate.md"
# Database Migration

Create a database migration for: $ARGUMENTS

Requirements:
- Use our migration framework (Prisma/Knex/etc.)
- Include both up and down migrations
- Handle data transformation if needed
- Add appropriate indexes
- Update the schema documentation

Generate the migration file in the correct location.
```

---

## Advanced Command Patterns

### Commands with Defaults

```markdown title=".claude/commands/lint.md"
# Lint and Fix

Lint and fix issues in: ${ARGUMENTS:-src/}

If no path provided, lint the entire src/ directory.

Steps:
1. Run the linter
2. Auto-fix what's possible
3. Report remaining issues
4. Suggest manual fixes for complex issues
```

### Commands that Chain Tools

```markdown title=".claude/commands/pr.md"
# Create Pull Request

Create a PR for the current changes:

1. Stage all relevant changes (not node_modules, .env, etc.)
2. Create a descriptive commit message based on the changes
3. Push to a feature branch
4. Create a PR with:
   - Clear title
   - Description of changes
   - Testing instructions
   - Screenshots if UI changes
```

### Commands with Context

```markdown title=".claude/commands/debug.md"
# Debug Issue

Debug this issue: $ARGUMENTS

Context gathering:
1. Find relevant code files
2. Check recent git changes
3. Look for related tests
4. Check error logs if available

Then:
1. Form a hypothesis
2. Add strategic logging/debugging
3. Reproduce the issue
4. Identify root cause
5. Propose fix
```

---

## Listing Available Commands

See all available commands:

```
> /help
```

Or view command files directly:

```bash
ls .claude/commands/
```

---

## Command Organization

For larger projects, organize commands in subdirectories:

```
.claude/commands/
├── review/
│   ├── security.md
│   ├── performance.md
│   └── accessibility.md
├── generate/
│   ├── test.md
│   ├── docs.md
│   └── migration.md
└── workflow/
    ├── pr.md
    ├── deploy.md
    └── release.md
```

Access nested commands: `/review/security src/auth.js`

---

## Quick Reference

```bash
# Create commands directory
mkdir -p .claude/commands

# Create a command
echo "Your prompt with @\$ARGUMENTS" > .claude/commands/mycommand.md

# Use the command
/mycommand file.js

# Share with team
git add .claude/commands/ && git commit -m "Add commands"

# List commands
/help
```

### Template Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `$ARGUMENTS` | Everything after command name | `/cmd foo bar` → `foo bar` |
| `$1`, `$2`, etc. | Individual arguments | `/cmd a b` → `$1=a, $2=b` |
| `@$ARGUMENTS` | File reference from arguments | `/cmd file.js` → contents of file.js |

---

## Next Steps

1. **[Automated Code Review](/tutorials/automated-review)** - Build a PR review command
2. **[Hooks & Automation](/tutorials/hooks-automation)** - Trigger commands automatically
3. **[Bulk Processing](/tutorials/bulk-processing)** - Run commands on many files
