---
sidebar_position: 9
title: Session Management Mastery
description: Resume, organize, and optimize your Claude Code sessions
format: md
---

# Session Management Mastery

Learn how to effectively manage Claude Code sessions - resume past work, organize sessions by project, reduce costs, and maintain context across long tasks.

**What you'll learn:**
- Understanding session persistence
- Resuming and continuing sessions
- Organizing sessions for projects
- Optimizing token usage
- Session best practices

**Time:** 10 minutes

---

## How Sessions Work

Every Claude Code interaction creates a session that stores:

- **Conversation history** - All messages exchanged
- **File context** - Files Claude has read
- **Tool results** - Output from commands run
- **Session metadata** - Timestamps, directory, costs

```
┌─────────────────────────────────────────────────────────────┐
│                     Session Storage                          │
├─────────────────────────────────────────────────────────────┤
│  ~/.claude/                                                  │
│  └── projects/                                               │
│      └── my-project-hash/                                    │
│          ├── session-abc123.json    # Session 1              │
│          ├── session-def456.json    # Session 2              │
│          └── session-ghi789.json    # Session 3              │
└─────────────────────────────────────────────────────────────┘
```

---

## Resuming Sessions

### Continue Most Recent Session

```bash
# Resume where you left off
claude --continue

# Or use the short flag
claude -c
```

This loads your most recent session from the current directory.

### Resume Specific Session

```bash
# Interactive session picker
claude --resume

# Or resume by session ID
claude --resume abc123
```

### Resume from Another Directory

```bash
# Sessions are stored per project
cd ~/other-project
claude --resume  # Shows sessions from that project
```

---

## Session Commands

### Inside Claude Code

```bash
# List recent sessions
> /sessions

# Rename current session
> /rename auth-refactor

# View session info
> /status

# Check token usage
> /usage

# Compact the session (reduce context)
> /compact

# Clear and start fresh
> /clear
```

### Session Picker

When you run `claude --resume`, you see:

```
Recent sessions:
[1] auth-refactor (2h ago) - 15k tokens
[2] api-migration (1d ago) - 8k tokens
[3] bug-fix-login (3d ago) - 5k tokens

Enter number or session ID:
```

---

## Organizing Sessions

### Naming Conventions

Use descriptive names that help you find sessions later:

```bash
> /rename feature/user-auth
> /rename bugfix/login-timeout
> /rename refactor/api-layer
> /rename docs/api-reference
```

### Project-Based Organization

Sessions are automatically organized by project directory:

```
~/projects/
├── frontend/          # Frontend sessions stored here
├── backend/           # Backend sessions stored here
└── shared-lib/        # Library sessions stored here
```

### Multi-Feature Sessions

When working on multiple features, use separate sessions:

```bash
# Start session for feature A
cd ~/project
claude
> /rename feature-a

# Exit and start new session for feature B
> /exit
claude
> /rename feature-b

# Later, resume either
claude --resume  # Pick from list
```

---

## Optimizing Token Usage

### The /compact Command

Long sessions accumulate context. Use `/compact` to summarize and reduce:

```bash
# Before: 50k tokens in context
> /compact

# After: ~10k tokens (summarized history)
```

**When to compact:**
- Session feels slow
- Getting "context too long" errors
- Before a major new task
- Periodically in long sessions

### Strategic Session Boundaries

Start fresh when changing topics:

```bash
# Finished auth work
> /exit

# Start new session for different feature
claude
> Now let's work on the payment system
```

### Read Files Selectively

```bash
# Bad: Reading entire codebase
> Read all files in src/

# Good: Read what you need
> Read src/auth/login.js
```

### Use Summaries for Large Files

```bash
# For large files, ask for summary first
> Summarize src/large-module.js, focusing on the public API
> Now read just the authenticateUser function
```

---

## Session Workflows

### Daily Development Pattern

```bash
# Morning: Resume yesterday's work
claude --continue

# Check where you left off
> What were we working on?

# Continue the task
> Let's finish implementing the login flow
```

### Feature Branch Pattern

```bash
# Create session per feature branch
git checkout -b feature/new-auth
claude
> /rename feature/new-auth

# Work on feature...

# Switch branches, switch sessions
git checkout feature/api-refactor
claude --resume  # Pick api-refactor session
```

### Code Review Pattern

```bash
# Start review session
claude
> /rename review/pr-123

# Review the PR
> Review the changes in this PR: $(git diff main...HEAD)

# Save session for follow-up
> /exit

# Later, continue review
claude --resume  # Select review/pr-123
> Did the author address the feedback?
```

---

## Session Persistence Settings

### Configure Session Storage

```json title="~/.claude/settings.json"
{
  "sessions": {
    "maxSessions": 50,
    "autoCompactThreshold": 100000,
    "defaultSessionName": "auto"
  }
}
```

### Session Retention

Old sessions are automatically cleaned up. To keep important sessions:

```bash
# Mark session as important
> /rename KEEP-auth-implementation
```

Sessions starting with "KEEP-" are preserved longer.

---

## Headless Session Management

### Continue Session in Scripts

```bash
# Get session ID from output
session_id=$(claude -p "Start analyzing the codebase" \
  --output-format json | jq -r '.session_id')

# Continue in subsequent calls
claude -p "What files did you find?" --resume "$session_id"
claude -p "Summarize the architecture" --resume "$session_id"
```

### Session in CI/CD

```yaml
- name: Start Analysis
  run: |
    result=$(claude -p "Analyze codebase" --output-format json)
    echo "SESSION_ID=$(echo $result | jq -r '.session_id')" >> $GITHUB_ENV

- name: Continue Analysis
  run: |
    claude -p "Generate report" --resume $SESSION_ID
```

---

## Troubleshooting

### Session Won't Resume

```bash
# Check if session exists
ls ~/.claude/projects/

# Try with verbose output
claude --resume --verbose
```

### Lost Session Context

If Claude seems to have forgotten context:

```bash
# Check current session info
> /status

# Reload file context
> Read src/main.js again to refresh your memory
```

### Session Too Large

```bash
# Compact aggressively
> /compact

# Or start fresh with context
> /clear
> Let me re-read the key files: src/auth.js, src/api.js
```

### Corrupted Session

```bash
# Remove specific session
rm ~/.claude/projects/PROJECT_HASH/session-ID.json

# Or clear all sessions for project
rm -rf ~/.claude/projects/PROJECT_HASH/
```

---

## Best Practices

### 1. Name Sessions Immediately

```bash
claude
> /rename feature-name
```

### 2. Compact Before Big Tasks

```bash
> /compact
> Now let's implement the new payment system
```

### 3. Use Multiple Sessions for Multiple Features

Don't try to do everything in one session.

### 4. Review Token Usage

```bash
> /usage
```

Keep an eye on costs, especially for long sessions.

### 5. Exit Cleanly

```bash
> /exit
```

This ensures session state is saved properly.

### 6. Start Fresh for New Problems

When switching to an unrelated task:

```bash
> /exit
claude  # Fresh session
```

---

## Quick Reference

```bash
# Resume commands
claude --continue        # Most recent session
claude -c                # Short form
claude --resume          # Interactive picker
claude --resume ID       # Specific session

# In-session commands
/sessions               # List sessions
/rename NAME            # Rename current
/status                 # Session info
/usage                  # Token usage
/compact                # Reduce context
/clear                  # Fresh start
/exit                   # Save and exit

# Headless
claude -p "..." --continue
claude -p "..." --resume SESSION_ID
```

### Session States

| State | Description |
|-------|-------------|
| Active | Currently running |
| Paused | Exited but resumable |
| Archived | Old, may be auto-cleaned |
| Compacted | History summarized |

---

## Next Steps

1. **[Custom Commands](/tutorials/custom-commands)** - Build session-aware commands
2. **[Parallel Development](/tutorials/parallel-agents)** - Manage multiple agent sessions
3. **[Bulk Processing](/tutorials/bulk-processing)** - Session management at scale
