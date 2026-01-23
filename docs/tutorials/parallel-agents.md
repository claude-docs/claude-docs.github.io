---
sidebar_position: 3
title: Parallel Development with Git Worktrees
description: Run multiple Claude agents simultaneously on the same codebase
format: md
---

# Parallel Development with Git Worktrees

Learn how to run multiple Claude Code instances simultaneously, each working on different features without conflicts.

**What you'll learn:**
- Why git worktrees solve the parallel agent problem
- Setting up worktrees for multi-agent development
- Managing multiple Claude sessions effectively
- Real-world parallel development patterns

**Time:** 20 minutes

---

## The Problem: Agents Stepping on Each Other

When you run multiple Claude agents on the same codebase, they modify files in real-time. This creates chaos:
- Agent A changes `auth.js` while Agent B is reading it
- Merge conflicts appear mid-task
- Agents overwrite each other's work

**Git worktrees solve this** by giving each agent an isolated workspace while sharing the same repository history.

---

## Understanding Git Worktrees

A worktree is a separate checkout of your repository. Each worktree:
- Has its own working directory with independent files
- Shares the same `.git` history and branches
- Can be on a different branch than other worktrees

```
my-project/                    # Main worktree (main branch)
├── .git/
├── src/
└── package.json

../my-project-feature-a/       # Worktree (feature-a branch)
├── src/                       # Independent copy
└── package.json

../my-project-feature-b/       # Worktree (feature-b branch)
├── src/                       # Independent copy
└── package.json
```

---

## Setting Up Your First Worktree

### Step 1: Create a Worktree with New Branch

```bash
# From your main project directory
cd my-project

# Create worktree with new branch
git worktree add ../my-project-auth -b feature/auth-system
```

This creates:
- A new directory `../my-project-auth`
- A new branch `feature/auth-system`
- An independent working copy

### Step 2: Create Worktree from Existing Branch

```bash
# Checkout existing branch into worktree
git worktree add ../my-project-bugfix bugfix/login-error
```

### Step 3: Verify Your Worktrees

```bash
git worktree list
```

Output:
```
/home/user/my-project              abc1234 [main]
/home/user/my-project-auth         def5678 [feature/auth-system]
/home/user/my-project-bugfix       ghi9012 [bugfix/login-error]
```

---

## Running Parallel Claude Agents

### Step 1: Open Multiple Terminals

```bash
# Terminal 1: Main project
cd ~/my-project
claude

# Terminal 2: Auth feature
cd ~/my-project-auth
claude

# Terminal 3: Bugfix
cd ~/my-project-bugfix
claude
```

### Step 2: Initialize Each Session

In each Claude session, run `/init` to orient Claude to that worktree:

```
> /init
```

Claude will analyze the codebase and understand its context.

### Step 3: Give Each Agent Its Task

**Terminal 1 (Main):**
```
> Update the documentation for the API endpoints
```

**Terminal 2 (Auth):**
```
> Implement OAuth2 authentication with Google provider
```

**Terminal 3 (Bugfix):**
```
> Fix the login error where users get logged out after 5 minutes
```

Each agent works independently without interference.

---

## Practical Workflow: Feature Development

### Scenario: Building Three Features in Parallel

```bash
# Setup
cd my-project
git worktree add ../project-search -b feature/search
git worktree add ../project-notifications -b feature/notifications
git worktree add ../project-dashboard -b feature/dashboard

# Install dependencies in each (if needed)
cd ../project-search && npm install
cd ../project-notifications && npm install
cd ../project-dashboard && npm install
```

### Running the Agents

Use a terminal multiplexer like tmux or separate terminal tabs:

```bash
# tmux example
tmux new-session -d -s claude-1 'cd ~/project-search && claude'
tmux new-session -d -s claude-2 'cd ~/project-notifications && claude'
tmux new-session -d -s claude-3 'cd ~/project-dashboard && claude'

# Attach to any session
tmux attach -t claude-1
```

### Merging Completed Work

When a feature is complete:

```bash
# Switch to main project
cd ~/my-project

# Merge completed feature
git merge feature/search

# Remove the worktree
git worktree remove ../project-search
```

---

## Session Management Across Worktrees

### Resuming Sessions

Sessions are stored per project directory. The `/resume` picker shows sessions from the same git repository, including worktrees:

```bash
cd ~/project-search
claude --resume  # Shows sessions from all worktrees
```

### Naming Sessions for Clarity

```
> /rename search-implementation
```

Now you can easily identify which session belongs to which worktree.

### Cross-Worktree Session Visibility

```
> /resume
```

Shows:
```
Recent sessions:
[1] search-implementation (project-search) - 2h ago
[2] notification-api (project-notifications) - 3h ago
[3] dashboard-ui (project-dashboard) - 4h ago
```

---

## Advanced Patterns

### Pattern 1: Review Agent + Implementation Agent

Run one Claude as a reviewer while another implements:

```bash
# Terminal 1: Implementer
cd ~/project-feature
claude
> Implement the user profile page with edit functionality

# Terminal 2: Reviewer (same worktree, different session)
cd ~/project-feature
claude
> Review the changes in src/components/UserProfile.tsx for bugs and best practices
```

### Pattern 2: Test Writer + Code Writer

```bash
# Worktree 1: Write tests first (TDD)
cd ~/project-tests
claude
> Write comprehensive tests for the PaymentService class

# Worktree 2: Implement to pass tests
cd ~/project-impl
git pull origin feature/payment-tests  # Get the tests
claude
> Implement PaymentService to pass all the tests in payment.test.ts
```

### Pattern 3: Parallel Bug Squashing

```bash
# Create worktrees for each bug
git worktree add ../bug-123 -b fix/bug-123
git worktree add ../bug-124 -b fix/bug-124
git worktree add ../bug-125 -b fix/bug-125

# Assign each to a Claude instance
# Each works independently, merge as completed
```

---

## Tooling: ccswitch

The [ccswitch](https://github.com/ksred/ccswitch) tool simplifies worktree management:

```bash
# Install
npm install -g ccswitch

# Create and switch to worktree
ccswitch create feature/new-feature

# List all worktrees with Claude sessions
ccswitch list

# Switch between worktrees
ccswitch switch feature/new-feature

# Clean up completed worktrees
ccswitch cleanup
```

---

## Cost and Token Considerations

Running multiple agents increases API usage significantly. Consider:

### Monitoring Usage

```bash
# Check usage in each session
> /usage
```

### Cost-Effective Strategies

1. **Use Sonnet for exploration, Opus for implementation**
   ```
   > /model sonnet
   > Explore the codebase and plan the implementation
   > /model opus
   > Now implement the plan
   ```

2. **Limit parallel agents** - Start with 2-3 until you understand the costs

3. **Use `/compact` regularly** - Reduce context in long sessions
   ```
   > /compact
   ```

4. **Close idle sessions** - Don't leave agents waiting
   ```
   > /exit
   ```

---

## Cleanup

Remove worktrees when done:

```bash
# Remove specific worktree
git worktree remove ../project-feature

# List and clean up stale entries
git worktree prune

# Force remove (if there are uncommitted changes)
git worktree remove --force ../project-feature
```

---

## Quick Reference

```bash
# Create worktree with new branch
git worktree add ../path -b branch-name

# Create worktree from existing branch
git worktree add ../path existing-branch

# List all worktrees
git worktree list

# Remove worktree
git worktree remove ../path

# Clean up stale references
git worktree prune

# In Claude, initialize for worktree
/init

# Name your session
/rename descriptive-name

# Resume any session
claude --resume
```

---

## Common Issues

### "Branch already checked out"

```bash
# Error: 'feature-x' is already checked out at '/path/to/other-worktree'

# Solution: Use a different branch name
git worktree add ../new-worktree -b feature-x-v2
```

### Node modules / Dependencies

Each worktree needs its own `node_modules`:

```bash
cd ../new-worktree
npm install  # or yarn install
```

### IDE Confusion

Some IDEs get confused with multiple worktrees. Options:
- Open each worktree as a separate project/window
- Use terminal-based Claude Code for worktrees
- Configure IDE to recognize worktree structure

---

## Next Steps

Now you can run multiple Claude agents in parallel. Continue with:

1. **[Custom Commands](/tutorials/custom-commands)** - Create reusable workflows
2. **[Automated Code Review](/tutorials/automated-review)** - Review code at scale
3. **[Hooks & Automation](/tutorials/hooks-automation)** - Auto-format and lint

---

## Resources

- [Git Worktree Documentation](https://git-scm.com/docs/git-worktree)
- [ccswitch on GitHub](https://github.com/ksred/ccswitch)
- [How incident.io uses worktrees](https://incident.io/blog/shipping-faster-with-claude-code-and-git-worktrees)
