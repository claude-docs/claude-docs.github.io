---
sidebar_position: 11
title: Productivity Tips
description: Power user tips and tricks to maximize your efficiency with Claude Code
---

# Productivity Tips

Master these tips and tricks to dramatically increase your productivity with Claude Code.

## Keyboard Shortcuts Mastery

### Essential Shortcuts

| Shortcut | Action | When to Use |
|----------|--------|-------------|
| `Esc` | Cancel current operation | Stop mid-generation |
| `Esc` `Esc` | Open checkpoint menu | Access undo/restore points |
| `Ctrl+C` | Interrupt and keep partial | Get partial response |
| `Ctrl+L` | Clear screen | Clean up visual clutter |
| `Tab` | Accept suggestion | Auto-complete commands |
| `Up/Down` | Navigate history | Recall previous prompts |

### Advanced Navigation

```bash
# Quickly recall and modify previous prompts
# Press Up arrow, edit, then Enter

# Multi-line input
# Press Enter for new line in prompt
# Shift+Enter submits on some terminals

# Clear and start fresh
Ctrl+L  # Then type your new prompt
```

### Vim-Style Navigation (if enabled)

```bash
# In response viewer
j/k     # Scroll up/down
g/G     # Go to top/bottom
/       # Search in output
n/N     # Next/previous search result
q       # Exit viewer
```

### Terminal Multiplexer Integration

```bash title="tmux shortcuts for Claude Code"
# Split pane for Claude + editor
Ctrl+b %     # Vertical split
Ctrl+b "     # Horizontal split
Ctrl+b o     # Switch panes

# Recommended layout
# ┌─────────────────┬─────────────────┐
# │                 │                 │
# │    Claude       │    Editor       │
# │     Code        │    (nvim)       │
# │                 │                 │
# └─────────────────┴─────────────────┘
```

---

## Context Management Tips

### Monitor Your Context

```bash
# Check current usage
/context

# Typical output:
# Context: 45% used (90k/200k tokens)
# Files in context: 12
# Conversation turns: 23
```

### Proactive Compacting

Compact **before** you need to, not after:

```bash
# Good practice: Compact at 60-70% usage
/context  # Check usage
/compact  # Compact proactively

# Create custom compact with focus
> Compact the conversation, keeping details about the auth system we're building
```

### Strategic File Loading

```bash
# Load specific files rather than entire directories
> Read src/auth/login.ts and src/auth/types.ts

# Avoid loading entire codebases
# Bad:  "Read everything in src/"
# Good: "Read the main entry point and the file we're modifying"
```

### Clear When Switching Tasks

```bash
# Starting a new, unrelated task?
/clear

# Then provide fresh context
> I'm now working on the payment system.
> The relevant files are in src/payments/
```

### Use CLAUDE.md Effectively

```markdown title="CLAUDE.md"
# Project Context (automatically loaded)

## Quick Reference
- API runs on port 3000
- Tests: `npm test`
- Build: `npm run build`

## Current Focus
Working on user authentication feature

## Architecture Notes
- Express backend with TypeScript
- PostgreSQL database
- Redis for sessions
```

---

## Prompt Shortcuts and Patterns

### Save Common Prompts

Create shell aliases for frequent operations:

```bash title="~/.bashrc or ~/.zshrc"
# Quick code review
alias cr='claude -p "Review this diff for issues:" < '

# Generate tests
alias gt='claude -p "Generate comprehensive tests for:"'

# Explain code
alias explain='claude -p "Explain this code in detail:"'

# Fix linting
alias fixlint='claude "Fix all ESLint errors in the current file"'

# Quick refactor
alias refactor='claude "Refactor this for better readability"'
```

### Template Prompts

```bash
# Save prompt templates in files
cat > ~/.claude-prompts/review.txt << 'EOF'
Review this code for:
1. Potential bugs
2. Performance issues
3. Security concerns
4. Code style improvements

Be specific and actionable.
EOF

# Use template
claude -p "$(cat ~/.claude-prompts/review.txt)" < myfile.ts
```

### Prompt Chaining

```bash
# Chain prompts for complex workflows
claude -p "List all TODO comments in src/" | \
  claude -p "Prioritize these TODOs by importance"

# Generate and improve
claude -p "Generate a function to parse CSV" | \
  claude -p "Add error handling and TypeScript types to this"
```

### Effective Prompt Patterns

```bash
# Be specific about output format
> Create a User model. Output only the code, no explanation.

# Set constraints upfront
> Refactor this function. Keep the same public API. Use async/await.

# Ask for alternatives
> Show me 3 different ways to implement this caching strategy

# Request incremental work
> Let's implement this step by step. Start with step 1 only.
```

---

## Session Organization

### Project-Based Sessions

```bash
# Start Claude in project directory
cd ~/projects/my-api
claude

# Or specify project explicitly
claude --cwd ~/projects/my-api
```

### Named Sessions for Context

```bash
# Use meaningful branch names as session context
git checkout -b feature/user-dashboard
claude

# Claude sees the branch name and understands the focus
```

### Session Documentation

```bash
# At end of session, create summary
> Summarize what we accomplished today and what's left to do

# Save for next session
> Add these notes to CLAUDE.md under "Current Status"
```

### Quick Session Setup

```bash title="scripts/dev-session.sh"
#!/bin/bash
# Start a focused development session

# Get current branch and recent work
BRANCH=$(git branch --show-current)
RECENT=$(git log --oneline -5)

echo "Starting session on: $BRANCH"
echo "Recent commits:"
echo "$RECENT"
echo ""

# Start Claude with context
claude -p "I'm continuing work on branch: $BRANCH
Recent commits: $RECENT
What should I focus on next?"
```

---

## File Navigation Tricks

### Quick File Finding

```bash
# In Claude, use patterns to find files
> Find all files related to authentication

# Use glob patterns
> List all TypeScript files in src/components/

# Search by content
> Find files that import from './database'
```

### Smart File References

```bash
# Reference files without full paths
> Open the main config file
# Claude typically finds the right one

# Be specific when ambiguous
> Open the Jest config, not the TypeScript config

# Reference by function/class name
> Open the file containing the UserService class
```

### Efficient Multi-File Operations

```bash
# Batch operations
> Update all test files to use the new mock helper

# Pattern-based changes
> Add error handling to all API route handlers in src/routes/

# Related files together
> Update the User model and its corresponding repository
```

### Project Structure Commands

```bash
# Get project overview
> Show me the project structure focusing on src/

# Find entry points
> What's the main entry point and how does the app bootstrap?

# Trace dependencies
> What files depend on src/utils/helpers.ts?
```

---

## Code Review Speedrun

### Quick PR Review

```bash
# One-liner PR review
gh pr diff 123 | claude -p "Review this PR for issues"

# Focused review
gh pr diff 123 | claude -p "Check this PR for security issues only"
```

### Review Checklist Generator

```bash
# Generate contextual checklist
claude -p "Generate a review checklist for changes to: $(git diff --name-only main)"
```

### Batch Review

```bash
# Review multiple PRs
for PR in 123 124 125; do
  echo "=== PR #$PR ==="
  gh pr diff $PR | claude -p "Quick summary and main concerns:"
done
```

### Self-Review Before PR

```bash
# Pre-PR self review
> Review my changes against main. What would a reviewer flag?

# Check specific concerns
> Do my changes have adequate test coverage?
> Are there any breaking changes I should document?
```

### Interactive Review Session

```text
> Let's review the changes in this PR together

# Claude shows diff summary

> What about the error handling in the new endpoint?

# Claude focuses on specific area

> Is there a better way to handle the edge case on line 45?

# Claude suggests alternatives
```

---

## Quick Fix Patterns

### Common Fix Commands

```bash
# Fix all lint errors
> Fix all ESLint errors in src/

# Fix specific error type
> Fix all TypeScript strict null check errors

# Fix imports
> Fix and organize all imports in this file

# Fix formatting
> Apply consistent formatting to src/components/
```

### Error-Driven Fixes

```bash
# Copy error, let Claude fix
> Fix this error: [paste error message]

# Fix failing test
> This test is failing: [paste test output]
> Fix the implementation to make it pass
```

### Rapid Iteration Pattern

```bash
# 1. Make change
> Add input validation to the createUser function

# 2. Run tests
> Run the tests for createUser

# 3. If fails, fix
> Fix the failing tests

# 4. Repeat until green
```

### Bulk Fixes

```bash
# Fix pattern across codebase
> Replace all instances of deprecated Logger.log() with Logger.info()

# Update API calls
> Update all fetch calls to use the new apiClient helper

# Modernize syntax
> Convert all callback-style functions in src/utils to async/await
```

---

## Daily Workflow Optimization

### Morning Routine

```bash title="scripts/morning.sh"
#!/bin/bash
# Start your day with context

echo "=== Good morning! ==="
echo ""

# Show what's in progress
echo "In-progress branches:"
git branch | grep -v main

# Show recent activity
echo ""
echo "Yesterday's commits:"
git log --since="yesterday" --oneline

# Start Claude with context
claude -p "Here's what I was working on yesterday:
$(git log --since='yesterday' --oneline)

What should I focus on today?"
```

### Task Switching

```bash
# When switching tasks
/clear

# Load new context
> I'm switching to work on the payment feature.
> Here's the ticket: [paste ticket]
> What files should I look at first?
```

### End of Day

```bash
# Before ending
> Summarize what we accomplished and create notes for tomorrow

# Commit work in progress
> Create a WIP commit with a descriptive message

# Update status
> Update CLAUDE.md with current status
```

### Focus Time Blocks

```bash
# Dedicated Claude sessions
# 1. Bug fixing (30 min)
claude  # Start session
> Let's fix the top 3 bugs in our backlog

# 2. Feature work (2 hours)
claude  # Fresh session
> Let's implement the user settings feature

# 3. Code review (30 min)
# Use separate terminal for reviews
```

---

## Time-Saving Configurations

### Shell Integration

```bash title="~/.bashrc or ~/.zshrc"
# Auto-start Claude in project directories
function dev() {
  cd "$1"
  if [ -f CLAUDE.md ] || [ -f .claude/settings.json ]; then
    echo "Claude-enabled project detected"
    claude
  fi
}

# Quick Claude commands
function c() {
  claude -p "$*"
}

# Explain last command's error
function why() {
  claude -p "Explain this error and how to fix it: $(fc -ln -1) returned: $?"
}
```

### Git Integration

```bash title="~/.gitconfig"
[alias]
  # Claude-assisted commit message
  cm = "!f() { git diff --staged | claude -p 'Generate a commit message for these changes' | git commit -F -; }; f"

  # Review before push
  review = "!f() { git diff origin/main..HEAD | claude -p 'Review these changes before I push'; }; f"
```

### VS Code Integration

```json title=".vscode/tasks.json"
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Ask Claude",
      "type": "shell",
      "command": "claude -p '${input:question}'",
      "problemMatcher": []
    },
    {
      "label": "Review Current File",
      "type": "shell",
      "command": "cat '${file}' | claude -p 'Review this code'",
      "problemMatcher": []
    }
  ],
  "inputs": [
    {
      "id": "question",
      "type": "promptString",
      "description": "What do you want to ask Claude?"
    }
  ]
}
```

### Project-Specific Settings

```json title=".claude/settings.json"
{
  "model": "sonnet",
  "permissions": {
    "allow": [
      "Read(src/**)",
      "Write(src/**)",
      "Bash(npm test)",
      "Bash(npm run lint)"
    ],
    "deny": [
      "Read(.env*)",
      "Write(package-lock.json)"
    ]
  }
}
```

---

## Power User Secrets

### Use Model Strategically

```bash
# Quick questions -> Haiku
/model haiku
> What's the syntax for TypeScript generics?

# Regular coding -> Sonnet
/model sonnet
> Implement the user registration endpoint

# Complex architecture -> Opus
/model opus
> Design the event sourcing system for our app
```

### Parallel Sessions

```bash
# Terminal 1: Main coding
claude

# Terminal 2: Quick lookups/questions
claude --model haiku

# Terminal 3: Background tasks
claude -p "Run full test suite and summarize failures"
```

### Output Piping Mastery

```bash
# Direct to file
claude -p "Generate API documentation" > api-docs.md

# To clipboard (macOS)
claude -p "Summarize this" | pbcopy

# To clipboard (Linux)
claude -p "Summarize this" | xclip -selection clipboard

# Process output
claude -p "List all function names in src/" | sort | uniq
```

### Meta-Prompting

```bash
# Ask Claude to improve your prompt
> I want to ask you to help me refactor authentication.
> How should I phrase my request for best results?

# Let Claude suggest next steps
> What questions should I be asking to improve this code?
```

### Hidden Efficiency Boosters

```bash
# Use /rewind instead of manual fixes
# Much faster than trying to manually fix Claude's changes
/rewind

# Use /compact with instructions
/compact but keep the database schema details

# Checkpoint before risky operations
> Before we refactor, note this as a checkpoint I can return to
```

### Response Control

```bash
# Get code only, no explanation
> [code only] Create a debounce function

# Get explanation only
> [explain only] How does this regex work?

# Get specific format
> Create the config as JSON only, no markdown
```

### Smart Defaults

```bash
# Set up your defaults in CLAUDE.md
# These will apply to every session
```

```markdown title="CLAUDE.md defaults section"
## Preferences
- Write TypeScript, not JavaScript
- Use async/await, not callbacks
- Prefer functional patterns
- Include error handling
- Add JSDoc comments for public APIs
```

### Debugging Speed Tips

```bash
# Quick error lookup
> What does this error mean: [error]

# Stack trace analysis
> Analyze this stack trace and identify the root cause: [trace]

# Log analysis
> Parse these logs and find the issue: [logs]
```

### Batch Automation

```bash title="scripts/batch-improve.sh"
#!/bin/bash
# Improve all files matching pattern

PATTERN="${1:-*.ts}"
INSTRUCTION="${2:-Add error handling}"

find src -name "$PATTERN" | while read FILE; do
  echo "Processing: $FILE"
  claude -p "$INSTRUCTION in this file:
$(cat "$FILE")" > "$FILE.improved"

  # Show diff
  diff "$FILE" "$FILE.improved"

  # Confirm before replacing
  read -p "Apply changes? (y/n) " CONFIRM
  if [ "$CONFIRM" = "y" ]; then
    mv "$FILE.improved" "$FILE"
  else
    rm "$FILE.improved"
  fi
done
```

---

## Speed Comparison Cheatsheet

| Task | Slow Way | Fast Way |
|------|----------|----------|
| Fix lint errors | Fix one by one | `> Fix all lint errors in src/` |
| Understand code | Read file by file | `> Explain how the auth system works` |
| Write tests | Write manually | `> Generate tests for UserService` |
| Update imports | Manual find/replace | `> Update all imports from old to new` |
| Code review | Read diff manually | `gh pr diff \| claude -p "Review"` |
| Debug error | Search Stack Overflow | `> Explain and fix: [error]` |
| Refactor | Careful manual changes | `/rewind` if anything goes wrong |
| Switch models | Default for everything | Haiku for quick, Opus for complex |

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│              Claude Code Quick Reference            │
├─────────────────────────────────────────────────────┤
│  NAVIGATION                                         │
│    Esc Esc     Checkpoint menu                      │
│    Ctrl+L      Clear screen                         │
│    Up/Down     Command history                      │
│                                                     │
│  SLASH COMMANDS                                     │
│    /context    Check usage                          │
│    /compact    Reduce context                       │
│    /clear      Fresh start                          │
│    /rewind     Undo changes                         │
│    /model X    Switch model                         │
│                                                     │
│  PROMPT TIPS                                        │
│    [code only] Skip explanations                    │
│    "step by step" Incremental work                  │
│    "don't code yet" Planning mode                   │
│                                                     │
│  EFFICIENCY                                         │
│    Haiku    Quick questions                         │
│    Sonnet   Daily coding                            │
│    Opus     Complex problems                        │
│                                                     │
│  SHORTCUTS                                          │
│    c "prompt"  Quick Claude (alias)                 │
│    gh pr diff | claude  PR review                   │
│    /compact at 60-70%   Proactive                   │
└─────────────────────────────────────────────────────┘
```

---

## Next Steps

- [Real-World Examples](/guides/real-world-examples) - Complete project walkthroughs
- [Workflow Patterns](/guides/workflow-patterns) - Structured development workflows
- [Best Practices](/guides/best-practices) - General best practices
- [CLI Configuration](/cli/configuration) - Advanced configuration
