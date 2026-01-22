---
sidebar_position: 11
title: Parallel Development Techniques
description: Run multiple Claude Code sessions simultaneously for maximum productivity
---

# Parallel Development Techniques

Maximize productivity by running multiple Claude Code sessions simultaneously. This guide covers git worktrees, terminal multiplexing, task distribution, and synchronization patterns.

## Why Parallel Development?

Traditional development limits you to one task at a time. Parallel development with Claude Code enables:

- **Concurrent Feature Development**: Work on multiple features simultaneously
- **Isolated Contexts**: Each session has its own clean context window
- **Faster Iteration**: Test changes in one branch while coding in another
- **Team Simulation**: One developer can act as an entire team

## Git Worktrees for Parallel Sessions

Git worktrees allow multiple working directories to share the same repository, enabling parallel development without branch switching.

### Understanding Worktrees

```
Main Repository
├── .git/                    # Shared git data
├── src/                     # Main branch working files
├── ...
│
├── ../myapp-feature-auth/   # Worktree 1: feature/auth branch
├── ../myapp-feature-api/    # Worktree 2: feature/api branch
└── ../myapp-bugfix-login/   # Worktree 3: fix/login branch
```

### Creating Worktrees

```bash title="Create a worktree for a new feature"
# From your main repository
cd ~/projects/myapp

# Create worktree with new branch
git worktree add ../myapp-feature-auth -b feature/auth main

# Create worktree from existing branch
git worktree add ../myapp-feature-api feature/api

# Create worktree for a bugfix
git worktree add ../myapp-fix-login -b fix/login-validation main
```

### Worktree Management Commands

```bash title="List all worktrees"
git worktree list
# /home/user/projects/myapp                 abc1234 [main]
# /home/user/projects/myapp-feature-auth    def5678 [feature/auth]
# /home/user/projects/myapp-feature-api     ghi9012 [feature/api]
```

```bash title="Remove a worktree"
# After merging a feature
git worktree remove ../myapp-feature-auth

# Force remove (discards changes)
git worktree remove --force ../myapp-feature-auth
```

```bash title="Prune stale worktrees"
# Clean up worktree references for deleted directories
git worktree prune
```

### Automated Worktree Setup

```bash title="scripts/create-feature-worktree.sh"
#!/bin/bash
# Create a feature worktree with Claude Code ready

FEATURE_NAME="${1:?Feature name required}"
BASE_BRANCH="${2:-main}"

# Sanitize feature name for branch/directory
SAFE_NAME=$(echo "$FEATURE_NAME" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
BRANCH_NAME="feature/${SAFE_NAME}"
WORKTREE_DIR="../$(basename "$(pwd)")-${SAFE_NAME}"

# Check if worktree already exists
if git worktree list | grep -q "$WORKTREE_DIR"; then
    echo "Worktree already exists: $WORKTREE_DIR"
    exit 1
fi

# Create worktree
git worktree add "$WORKTREE_DIR" -b "$BRANCH_NAME" "$BASE_BRANCH"

# Copy local Claude configuration if it exists
if [ -d ".claude" ]; then
    cp -r .claude "$WORKTREE_DIR/"
fi

# Create feature-specific context
mkdir -p "$WORKTREE_DIR/.claude"
cat > "$WORKTREE_DIR/.claude/feature-context.md" << EOF
# Feature: $FEATURE_NAME

## Branch
$BRANCH_NAME

## Created
$(date)

## Status
In Progress

## Notes
Add feature-specific notes here.
EOF

echo ""
echo "Worktree created: $WORKTREE_DIR"
echo "Branch: $BRANCH_NAME"
echo ""
echo "Start Claude Code:"
echo "  cd $WORKTREE_DIR && claude"
```

```bash title="scripts/cleanup-worktrees.sh"
#!/bin/bash
# Clean up merged feature worktrees

MAIN_BRANCH="${1:-main}"

# Get list of worktrees
while IFS= read -r line; do
    WORKTREE_PATH=$(echo "$line" | awk '{print $1}')
    BRANCH=$(echo "$line" | sed 's/.*\[\(.*\)\].*/\1/')

    # Skip main worktree
    if [ "$BRANCH" = "$MAIN_BRANCH" ]; then
        continue
    fi

    # Check if branch is merged
    if git branch --merged "$MAIN_BRANCH" | grep -q "$BRANCH"; then
        echo "Branch '$BRANCH' is merged. Remove worktree? [y/N]"
        read -r CONFIRM

        if [ "$CONFIRM" = "y" ] || [ "$CONFIRM" = "Y" ]; then
            git worktree remove "$WORKTREE_PATH"
            echo "Removed: $WORKTREE_PATH"
        fi
    fi
done < <(git worktree list)

# Prune any stale entries
git worktree prune
```

### Worktree Best Practices

1. **Consistent Naming**: Use a pattern like `project-feature-name`
2. **Same Parent Directory**: Keep worktrees siblings of main repo
3. **Clean Before Creating**: Commit or stash changes first
4. **Regular Cleanup**: Remove worktrees after merging

## Multiple Terminal Sessions

### Terminal Emulator Setup

Modern terminal emulators support tabs and panes:

```bash title="iTerm2 (macOS) - Open multiple sessions"
# Open new tab
Cmd + T

# Split horizontally
Cmd + D

# Split vertically
Cmd + Shift + D
```

```bash title="Windows Terminal - Multiple sessions"
# New tab
Ctrl + Shift + T

# Split pane horizontally
Alt + Shift + -

# Split pane vertically
Alt + Shift + +
```

```bash title="GNOME Terminal (Linux)"
# New tab
Ctrl + Shift + T

# New window
Ctrl + Shift + N
```

### Session Organization

Organize sessions by responsibility:

```
┌─────────────────────────────────────────────────────────────┐
│ Tab 1: Feature Development                                  │
├─────────────────────────────┬───────────────────────────────┤
│ Pane 1: Frontend (React)    │ Pane 2: Backend (API)        │
│ ~/myapp-frontend            │ ~/myapp-backend              │
│ claude                      │ claude                        │
├─────────────────────────────┴───────────────────────────────┤
│ Tab 2: Testing & Documentation                              │
├─────────────────────────────┬───────────────────────────────┤
│ Pane 1: Tests               │ Pane 2: Docs                  │
│ ~/myapp-tests               │ ~/myapp-docs                  │
│ claude                      │ claude                        │
└─────────────────────────────┴───────────────────────────────┘
```

## tmux Integration

tmux provides powerful session management for parallel development.

### Basic tmux Setup

```bash title="Install tmux"
# macOS
brew install tmux

# Ubuntu/Debian
sudo apt install tmux

# Fedora
sudo dnf install tmux
```

### tmux Workflow for Claude Code

```bash title="scripts/start-parallel-session.sh"
#!/bin/bash
# Start a tmux session for parallel Claude development

SESSION_NAME="${1:-claude-dev}"

# Check if session exists
if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo "Session '$SESSION_NAME' already exists. Attaching..."
    tmux attach-session -t "$SESSION_NAME"
    exit 0
fi

# Get project directories
MAIN_DIR="$(pwd)"
FEATURE_AUTH="../myapp-feature-auth"
FEATURE_API="../myapp-feature-api"
TESTS="../myapp-tests"

# Create new session with first window
tmux new-session -d -s "$SESSION_NAME" -n "main" -c "$MAIN_DIR"

# Create feature-auth window
if [ -d "$FEATURE_AUTH" ]; then
    tmux new-window -t "$SESSION_NAME" -n "auth" -c "$FEATURE_AUTH"
fi

# Create feature-api window
if [ -d "$FEATURE_API" ]; then
    tmux new-window -t "$SESSION_NAME" -n "api" -c "$FEATURE_API"
fi

# Create tests window
if [ -d "$TESTS" ]; then
    tmux new-window -t "$SESSION_NAME" -n "tests" -c "$TESTS"
fi

# Select first window
tmux select-window -t "$SESSION_NAME:main"

# Attach to session
tmux attach-session -t "$SESSION_NAME"
```

### tmux Configuration for Claude Code

```bash title="~/.tmux.conf"
# Increase history limit for long Claude sessions
set-option -g history-limit 50000

# Enable mouse support
set -g mouse on

# Better colors
set -g default-terminal "screen-256color"

# Status bar showing session info
set -g status-right '#[fg=green]#S #[fg=yellow]| #[fg=cyan]%H:%M'

# Quick window switching
bind -n M-1 select-window -t 1
bind -n M-2 select-window -t 2
bind -n M-3 select-window -t 3
bind -n M-4 select-window -t 4

# Split panes with easier keys
bind | split-window -h -c "#{pane_current_path}"
bind - split-window -v -c "#{pane_current_path}"

# Navigate panes with Alt+arrow
bind -n M-Left select-pane -L
bind -n M-Right select-pane -R
bind -n M-Up select-pane -U
bind -n M-Down select-pane -D

# Reload config
bind r source-file ~/.tmux.conf \; display "Config reloaded!"
```

### tmux Commands Reference

```bash title="Session Management"
# Create named session
tmux new-session -s parallel-dev

# List sessions
tmux list-sessions

# Attach to session
tmux attach -t parallel-dev

# Detach from session
# Press: Ctrl+b, then d

# Kill session
tmux kill-session -t parallel-dev
```

```bash title="Window Management"
# Create new window
# Press: Ctrl+b, then c

# Name current window
# Press: Ctrl+b, then ,

# Switch windows
# Press: Ctrl+b, then 0-9

# List windows
# Press: Ctrl+b, then w
```

```bash title="Pane Management"
# Split horizontally
# Press: Ctrl+b, then "

# Split vertically
# Press: Ctrl+b, then %

# Navigate panes
# Press: Ctrl+b, then arrow keys

# Zoom pane (toggle)
# Press: Ctrl+b, then z

# Close pane
# Press: Ctrl+b, then x
```

### Advanced tmux Script

```bash title="scripts/parallel-dev-session.sh"
#!/bin/bash
# Create comprehensive parallel development environment

PROJECT="${1:?Project name required}"
SESSION="$PROJECT-parallel"

# Kill existing session
tmux kill-session -t "$SESSION" 2>/dev/null

# Create session with main window
tmux new-session -d -s "$SESSION" -n "main" -c "$HOME/projects/$PROJECT"

# Window 1: Main + Tests split
tmux send-keys -t "$SESSION:main" 'claude' C-m
tmux split-window -h -t "$SESSION:main" -c "$HOME/projects/$PROJECT"
tmux send-keys -t "$SESSION:main.1" 'npm run test:watch' C-m

# Window 2: Feature Development
tmux new-window -t "$SESSION" -n "feature"
tmux send-keys -t "$SESSION:feature" "cd ../\${PROJECT}-feature && claude" C-m

# Window 3: Backend API
tmux new-window -t "$SESSION" -n "api"
tmux send-keys -t "$SESSION:api" "cd ../\${PROJECT}-api && claude" C-m

# Window 4: Monitoring
tmux new-window -t "$SESSION" -n "monitor"
tmux send-keys -t "$SESSION:monitor" 'htop' C-m
tmux split-window -v -t "$SESSION:monitor"
tmux send-keys -t "$SESSION:monitor.1" 'watch -n 5 git status' C-m

# Window 5: Git operations
tmux new-window -t "$SESSION" -n "git"

# Set up status bar
tmux set-option -t "$SESSION" status-right '#[fg=green]Parallel Dev #[fg=yellow]| #[fg=cyan]%H:%M'

# Select main window
tmux select-window -t "$SESSION:main"

# Attach
tmux attach-session -t "$SESSION"
```

## Screen Integration

GNU Screen is an alternative to tmux available on most systems.

### Basic Screen Setup

```bash title="Install screen"
# Usually pre-installed, otherwise:
# Ubuntu/Debian
sudo apt install screen

# macOS
brew install screen
```

### Screen for Parallel Development

```bash title="Create named screen sessions"
# Start session for feature work
screen -S feature-auth
cd ~/projects/myapp-feature-auth
claude

# Detach: Ctrl+a, then d

# Start another session
screen -S feature-api
cd ~/projects/myapp-feature-api
claude
```

```bash title="Screen management"
# List running screens
screen -ls

# Reattach to a session
screen -r feature-auth

# Reattach or create
screen -R feature-auth
```

### Screen Configuration

```bash title="~/.screenrc"
# Enable scrollback
defscrollback 10000

# Disable startup message
startup_message off

# Status line
hardstatus alwayslastline
hardstatus string '%{= kG}[ %{G}%H %{g}][%= %{= kw}%?%-Lw%?%{r}(%{W}%n*%f%t%?(%u)%?%{r})%{w}%?%+Lw%?%?%= %{g}][%{B} %m-%d %{W}%c %{g}]'

# Window list on Ctrl+a "
bind '"' windowlist -b

# Easy window switching
bindkey "^[1" select 0
bindkey "^[2" select 1
bindkey "^[3" select 2
bindkey "^[4" select 3
```

## Task Distribution Strategies

### Domain-Based Distribution

Assign Claude sessions to specific domains:

```bash title="Domain distribution setup"
# Terminal 1: Frontend
cd ~/projects/myapp-frontend
claude
# Focus: React components, CSS, client-side logic

# Terminal 2: Backend
cd ~/projects/myapp-backend
claude
# Focus: API routes, database, server logic

# Terminal 3: Infrastructure
cd ~/projects/myapp-infra
claude
# Focus: Docker, CI/CD, deployment

# Terminal 4: Tests
cd ~/projects/myapp-tests
claude
# Focus: Unit tests, integration tests, E2E
```

### Feature-Based Distribution

Each session owns a complete feature:

```bash title="Feature distribution"
# Session 1: User Authentication
> Implement complete user authentication:
> - Login/logout flows
> - JWT token handling
> - Password reset
> - Remember me functionality

# Session 2: Payment Processing
> Implement payment processing:
> - Stripe integration
> - Subscription management
> - Invoice generation
> - Payment history

# Session 3: Notification System
> Implement notifications:
> - Email notifications
> - In-app notifications
> - Push notifications
> - Notification preferences
```

### Layer-Based Distribution

Distribute by application layers:

```
Session 1: Data Layer
├── Database models
├── Migrations
├── Repositories
└── Data validation

Session 2: Business Logic
├── Services
├── Use cases
├── Domain events
└── Business rules

Session 3: Presentation
├── API controllers
├── Request/response DTOs
├── API documentation
└── Error handling

Session 4: Infrastructure
├── External integrations
├── Caching
├── Message queues
└── Monitoring
```

### Coordinated Task Script

```bash title="scripts/distribute-tasks.sh"
#!/bin/bash
# Distribute tasks across multiple Claude sessions

TASKS_FILE="${1:?Tasks file required}"
NUM_SESSIONS="${2:-4}"

# Read tasks into array
mapfile -t TASKS < "$TASKS_FILE"
TOTAL_TASKS=${#TASKS[@]}

echo "Distributing $TOTAL_TASKS tasks across $NUM_SESSIONS sessions"
echo ""

# Create distribution plan
for ((i=0; i<NUM_SESSIONS; i++)); do
    SESSION_NUM=$((i + 1))
    echo "=== Session $SESSION_NUM ==="

    # Assign tasks round-robin
    for ((j=i; j<TOTAL_TASKS; j+=NUM_SESSIONS)); do
        echo "  - ${TASKS[$j]}"
    done
    echo ""
done

# Create individual task files
for ((i=0; i<NUM_SESSIONS; i++)); do
    SESSION_NUM=$((i + 1))
    OUTPUT_FILE=".claude/session-${SESSION_NUM}-tasks.md"

    echo "# Session $SESSION_NUM Tasks" > "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"

    for ((j=i; j<TOTAL_TASKS; j+=NUM_SESSIONS)); do
        echo "- [ ] ${TASKS[$j]}" >> "$OUTPUT_FILE"
    done

    echo "Created: $OUTPUT_FILE"
done
```

## Merge Conflict Prevention

### Pre-Commit Coordination

```bash title="scripts/check-conflicts.sh"
#!/bin/bash
# Check for potential conflicts before committing

BASE_BRANCH="${1:-main}"

# Get files changed in current branch
CURRENT_FILES=$(git diff --name-only "$BASE_BRANCH")

# Check each worktree for overlapping changes
for WORKTREE in $(git worktree list --porcelain | grep "^worktree" | cut -d' ' -f2); do
    # Skip current directory
    [ "$WORKTREE" = "$(pwd)" ] && continue

    WORKTREE_BRANCH=$(git -C "$WORKTREE" branch --show-current)

    # Get files changed in worktree
    WORKTREE_FILES=$(git -C "$WORKTREE" diff --name-only "$BASE_BRANCH" 2>/dev/null)

    # Find overlapping files
    CONFLICTS=$(comm -12 <(echo "$CURRENT_FILES" | sort) <(echo "$WORKTREE_FILES" | sort))

    if [ -n "$CONFLICTS" ]; then
        echo "Potential conflicts with $WORKTREE_BRANCH:"
        echo "$CONFLICTS" | sed 's/^/  - /'
        echo ""
    fi
done
```

### File Locking Strategy

```bash title="scripts/lock-files.sh"
#!/bin/bash
# Simple file locking for parallel development

LOCK_DIR=".claude/locks"
LOCK_FILE="$LOCK_DIR/${1//\//_}.lock"
SESSION_ID="${CLAUDE_SESSION_ID:-$$}"

mkdir -p "$LOCK_DIR"

lock_file() {
    local FILE="$1"
    local LOCK="$LOCK_DIR/${FILE//\//_}.lock"

    if [ -f "$LOCK" ]; then
        OWNER=$(cat "$LOCK")
        echo "File locked by session: $OWNER"
        return 1
    fi

    echo "$SESSION_ID" > "$LOCK"
    echo "Locked: $FILE"
    return 0
}

unlock_file() {
    local FILE="$1"
    local LOCK="$LOCK_DIR/${FILE//\//_}.lock"

    if [ -f "$LOCK" ]; then
        OWNER=$(cat "$LOCK")
        if [ "$OWNER" = "$SESSION_ID" ]; then
            rm "$LOCK"
            echo "Unlocked: $FILE"
            return 0
        else
            echo "Cannot unlock: owned by $OWNER"
            return 1
        fi
    fi
}

list_locks() {
    echo "Current locks:"
    for LOCK in "$LOCK_DIR"/*.lock; do
        [ -f "$LOCK" ] || continue
        FILE=$(basename "$LOCK" .lock | tr '_' '/')
        OWNER=$(cat "$LOCK")
        echo "  $FILE (session: $OWNER)"
    done
}

case "${1:-list}" in
    lock)
        lock_file "$2"
        ;;
    unlock)
        unlock_file "$2"
        ;;
    list)
        list_locks
        ;;
esac
```

### Domain Boundaries

Define clear ownership per session:

```yaml title=".claude/parallel-config.yml"
sessions:
  frontend:
    owns:
      - src/components/**
      - src/pages/**
      - src/styles/**
      - public/**
    can_read:
      - src/api/**
      - src/types/**

  backend:
    owns:
      - src/api/**
      - src/services/**
      - src/models/**
      - src/middleware/**
    can_read:
      - src/types/**

  shared:
    owns:
      - src/types/**
      - src/utils/**
      - src/constants/**
    note: "Coordinate before changes"

  tests:
    owns:
      - tests/**
      - __mocks__/**
    can_read:
      - "**"
```

### Automated Boundary Enforcement

```bash title="scripts/enforce-boundaries.sh"
#!/bin/bash
# Enforce file ownership boundaries

CONFIG_FILE=".claude/parallel-config.yml"
CURRENT_SESSION="${CLAUDE_SESSION:-unknown}"

# Get staged files
STAGED_FILES=$(git diff --cached --name-only)

check_ownership() {
    local FILE="$1"

    # Parse config to find owner
    # This is simplified - real implementation would parse YAML properly
    for SESSION in frontend backend shared tests; do
        # Check if file matches session's "owns" patterns
        PATTERNS=$(grep -A 10 "^  $SESSION:" "$CONFIG_FILE" | grep -A 5 "owns:" | grep "^\s*-" | sed 's/^\s*- //')

        for PATTERN in $PATTERNS; do
            if [[ "$FILE" == $PATTERN ]]; then
                if [ "$SESSION" != "$CURRENT_SESSION" ]; then
                    echo "WARNING: $FILE is owned by session '$SESSION'"
                    echo "         Current session: '$CURRENT_SESSION'"
                    return 1
                fi
                return 0
            fi
        done
    done

    return 0
}

VIOLATIONS=0
for FILE in $STAGED_FILES; do
    if ! check_ownership "$FILE"; then
        VIOLATIONS=$((VIOLATIONS + 1))
    fi
done

if [ $VIOLATIONS -gt 0 ]; then
    echo ""
    echo "$VIOLATIONS file(s) outside your session's boundaries."
    echo "Coordinate with other sessions before committing."
    exit 1
fi
```

## Synchronization Patterns

### Shared State File

```bash title="Synchronization via shared file"
# Create shared state
cat > .claude/parallel-state.json << 'EOF'
{
  "sessions": {},
  "completed_tasks": [],
  "pending_handoffs": [],
  "conflicts": []
}
EOF
```

```typescript title="scripts/sync-state.ts"
import * as fs from "fs";

interface ParallelState {
  sessions: Record<string, SessionState>;
  completed_tasks: string[];
  pending_handoffs: Handoff[];
  conflicts: string[];
}

interface SessionState {
  name: string;
  status: "active" | "idle" | "blocked";
  current_task: string | null;
  last_update: number;
}

interface Handoff {
  from: string;
  to: string;
  task: string;
  context: string;
  timestamp: number;
}

const STATE_FILE = ".claude/parallel-state.json";

function loadState(): ParallelState {
  if (fs.existsSync(STATE_FILE)) {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  }
  return {
    sessions: {},
    completed_tasks: [],
    pending_handoffs: [],
    conflicts: []
  };
}

function saveState(state: ParallelState): void {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// Session registration
function registerSession(name: string): void {
  const state = loadState();
  state.sessions[name] = {
    name,
    status: "active",
    current_task: null,
    last_update: Date.now()
  };
  saveState(state);
}

// Task completion
function completeTask(session: string, task: string): void {
  const state = loadState();
  state.completed_tasks.push(task);
  if (state.sessions[session]) {
    state.sessions[session].current_task = null;
    state.sessions[session].last_update = Date.now();
  }
  saveState(state);
}

// Request handoff
function requestHandoff(from: string, to: string, task: string, context: string): void {
  const state = loadState();
  state.pending_handoffs.push({
    from,
    to,
    task,
    context,
    timestamp: Date.now()
  });
  saveState(state);
}

// Check for handoffs
function checkHandoffs(session: string): Handoff[] {
  const state = loadState();
  return state.pending_handoffs.filter(h => h.to === session);
}
```

### Git-Based Synchronization

```bash title="scripts/sync-branches.sh"
#!/bin/bash
# Synchronize parallel branches with main

BASE_BRANCH="${1:-main}"

echo "Fetching latest from remote..."
git fetch origin "$BASE_BRANCH"

for WORKTREE in $(git worktree list --porcelain | grep "^worktree" | cut -d' ' -f2); do
    BRANCH=$(git -C "$WORKTREE" branch --show-current)

    if [ "$BRANCH" = "$BASE_BRANCH" ]; then
        continue
    fi

    echo ""
    echo "=== Syncing $WORKTREE ($BRANCH) ==="

    # Check for uncommitted changes
    if ! git -C "$WORKTREE" diff --quiet; then
        echo "  Uncommitted changes - skipping"
        continue
    fi

    # Rebase on base branch
    echo "  Rebasing on $BASE_BRANCH..."
    if git -C "$WORKTREE" rebase "origin/$BASE_BRANCH"; then
        echo "  Success"
    else
        echo "  Conflicts detected - aborting rebase"
        git -C "$WORKTREE" rebase --abort
    fi
done
```

### Event-Based Coordination

```typescript title="scripts/event-coordinator.ts"
import * as fs from "fs";
import * as path from "path";

interface Event {
  id: string;
  type: "task_complete" | "conflict" | "handoff" | "sync_request";
  session: string;
  payload: unknown;
  timestamp: number;
  acknowledged: string[];
}

const EVENTS_DIR = ".claude/events";

function ensureEventsDir(): void {
  if (!fs.existsSync(EVENTS_DIR)) {
    fs.mkdirSync(EVENTS_DIR, { recursive: true });
  }
}

function emitEvent(
  type: Event["type"],
  session: string,
  payload: unknown
): string {
  ensureEventsDir();

  const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const event: Event = {
    id,
    type,
    session,
    payload,
    timestamp: Date.now(),
    acknowledged: []
  };

  fs.writeFileSync(
    path.join(EVENTS_DIR, `${id}.json`),
    JSON.stringify(event, null, 2)
  );

  return id;
}

function getUnacknowledgedEvents(session: string): Event[] {
  ensureEventsDir();

  const events: Event[] = [];

  for (const file of fs.readdirSync(EVENTS_DIR)) {
    if (!file.endsWith(".json")) continue;

    const event: Event = JSON.parse(
      fs.readFileSync(path.join(EVENTS_DIR, file), "utf-8")
    );

    // Skip own events
    if (event.session === session) continue;

    // Skip acknowledged events
    if (event.acknowledged.includes(session)) continue;

    events.push(event);
  }

  return events.sort((a, b) => a.timestamp - b.timestamp);
}

function acknowledgeEvent(eventId: string, session: string): void {
  const eventPath = path.join(EVENTS_DIR, `${eventId}.json`);

  if (!fs.existsSync(eventPath)) return;

  const event: Event = JSON.parse(fs.readFileSync(eventPath, "utf-8"));
  event.acknowledged.push(session);
  fs.writeFileSync(eventPath, JSON.stringify(event, null, 2));
}

// Clean up old events
function cleanupEvents(maxAgeMs: number = 3600000): void {
  ensureEventsDir();

  const now = Date.now();

  for (const file of fs.readdirSync(EVENTS_DIR)) {
    if (!file.endsWith(".json")) continue;

    const eventPath = path.join(EVENTS_DIR, file);
    const event: Event = JSON.parse(fs.readFileSync(eventPath, "utf-8"));

    if (now - event.timestamp > maxAgeMs) {
      fs.unlinkSync(eventPath);
    }
  }
}
```

## Real-World Parallel Workflow Examples

### Example 1: Full-Stack Feature Development

```bash title="Scenario: Building a User Dashboard"

# === SETUP ===

# Create worktrees
git worktree add ../dashboard-frontend -b feature/dashboard-frontend main
git worktree add ../dashboard-backend -b feature/dashboard-backend main
git worktree add ../dashboard-tests -b feature/dashboard-tests main

# Start tmux session
tmux new-session -d -s dashboard -n frontend -c ../dashboard-frontend
tmux new-window -t dashboard -n backend -c ../dashboard-backend
tmux new-window -t dashboard -n tests -c ../dashboard-tests
tmux attach -t dashboard
```

```text title="Frontend Session (Window 1)"
> I'm working on the user dashboard frontend in parallel with backend
> development. I'll focus on:
> - Dashboard layout component
> - Widget components (stats, charts, activity feed)
> - State management for dashboard data
> - API integration hooks
>
> The backend team is building the API endpoints. I'll use mock data
> initially and swap to real API calls when ready.

> Start with the dashboard layout and basic widget structure
```

```text title="Backend Session (Window 2)"
> I'm building the dashboard API endpoints in parallel with frontend
> development. My focus:
> - /api/dashboard/stats endpoint
> - /api/dashboard/activity endpoint
> - /api/dashboard/widgets endpoint
> - WebSocket for real-time updates
>
> I'll provide API contracts to the frontend team.

> Start with the dashboard stats endpoint and document the response format
```

```text title="Tests Session (Window 3)"
> I'm responsible for testing both frontend and backend dashboard code.
> I'll write tests as features are completed:
> - Unit tests for components and services
> - Integration tests for API endpoints
> - E2E tests for complete dashboard flows
>
> Watch for commits in both feature branches.

> Set up the test structure for the dashboard feature
```

### Example 2: Microservices Development

```bash title="Scenario: Building interconnected services"

# Create worktrees for each service
git worktree add ../user-service -b feature/user-service main
git worktree add ../order-service -b feature/order-service main
git worktree add ../payment-service -b feature/payment-service main
git worktree add ../gateway-service -b feature/gateway main

# Create session script
cat > start-microservices-dev.sh << 'EOF'
#!/bin/bash

SESSION="microservices"
tmux new-session -d -s $SESSION -n user -c ../user-service
tmux send-keys -t $SESSION:user 'claude' C-m

tmux new-window -t $SESSION -n order -c ../order-service
tmux send-keys -t $SESSION:order 'claude' C-m

tmux new-window -t $SESSION -n payment -c ../payment-service
tmux send-keys -t $SESSION:payment 'claude' C-m

tmux new-window -t $SESSION -n gateway -c ../gateway-service
tmux send-keys -t $SESSION:gateway 'claude' C-m

tmux select-window -t $SESSION:user
tmux attach -t $SESSION
EOF
chmod +x start-microservices-dev.sh
```

```text title="Service Contract Definition"
# All sessions start with shared context

> We're building microservices with these contracts:

User Service (port 3001):
- POST /users - Create user
- GET /users/:id - Get user
- PUT /users/:id - Update user

Order Service (port 3002):
- POST /orders - Create order (calls User Service)
- GET /orders/:id - Get order
- GET /orders/user/:userId - Get user's orders

Payment Service (port 3003):
- POST /payments - Process payment (calls Order Service)
- GET /payments/:id - Get payment status

Gateway (port 3000):
- Routes to all services
- Handles authentication
- Rate limiting
```

### Example 3: Legacy Migration

```bash title="Scenario: Migrating from monolith to modern architecture"

# Create worktrees
git worktree add ../migration-analysis -b migration/analysis main
git worktree add ../migration-new-api -b migration/new-api main
git worktree add ../migration-data -b migration/data main
git worktree add ../migration-tests -b migration/tests main
```

```text title="Analysis Session"
> I'm analyzing the legacy codebase for migration. Focus:
> - Identify all database queries and models
> - Map dependencies between modules
> - Document business logic that needs preservation
> - Create migration risk assessment

> Start by mapping the database schema and identifying all models
```

```text title="New API Session"
> I'm building the new API based on analysis findings. Focus:
> - Modern REST API design
> - New data models with proper relationships
> - Service layer with clean architecture
> - Documentation with OpenAPI

> Wait for initial analysis, then start with the user domain
```

```text title="Data Migration Session"
> I'm building data migration scripts. Focus:
> - Schema transformation scripts
> - Data validation and cleaning
> - Rollback procedures
> - Migration testing framework

> Start designing the migration framework while waiting for schema analysis
```

### Example 4: Bug Blitz

```bash title="Scenario: Tackling multiple bugs simultaneously"

# Create worktrees for each bug
git worktree add ../fix-auth-timeout -b fix/auth-timeout main
git worktree add ../fix-payment-calc -b fix/payment-calculation main
git worktree add ../fix-search-perf -b fix/search-performance main

# Quick session setup
for DIR in ../fix-*; do
    WINDOW=$(basename $DIR)
    tmux new-window -t bugs -n "$WINDOW" -c "$DIR"
done
```

```text title="Each session gets focused context"
# Auth Timeout Session
> Bug: Users are logged out after 5 minutes instead of 30
> Files: src/auth/session.ts, src/middleware/auth.ts
> Repro: Login, wait 6 minutes, try to access dashboard
> Fix this bug

# Payment Calculation Session
> Bug: Tax calculation is wrong for international orders
> Files: src/services/payment.ts, src/utils/tax.ts
> Repro: Create order with non-US shipping address
> Fix this bug

# Search Performance Session
> Bug: Search takes 10+ seconds for common queries
> Files: src/services/search.ts, src/db/queries.ts
> Repro: Search for "electronics" in product catalog
> Fix this bug
```

## Integration with CI/CD

### Parallel Branch Testing

```yaml title=".github/workflows/parallel-tests.yml"
name: Test Parallel Branches

on:
  push:
    branches:
      - 'feature/**'
      - 'fix/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Check for conflicts with main
        run: |
          git fetch origin main
          if ! git merge-tree $(git merge-base HEAD origin/main) HEAD origin/main | grep -q "^"; then
            echo "No conflicts detected"
          else
            echo "::warning::Potential merge conflicts detected"
          fi

      - name: Run tests
        run: npm test

      - name: Check for parallel branch conflicts
        run: |
          # Get all active feature branches
          BRANCHES=$(git branch -r | grep 'origin/feature/' | tr -d ' ')

          for BRANCH in $BRANCHES; do
            if [ "$BRANCH" != "origin/${GITHUB_REF#refs/heads/}" ]; then
              # Check for file overlap
              OUR_FILES=$(git diff --name-only origin/main...HEAD)
              THEIR_FILES=$(git diff --name-only origin/main...$BRANCH 2>/dev/null || echo "")

              OVERLAP=$(comm -12 <(echo "$OUR_FILES" | sort) <(echo "$THEIR_FILES" | sort))

              if [ -n "$OVERLAP" ]; then
                echo "::warning::File overlap with $BRANCH:"
                echo "$OVERLAP"
              fi
            fi
          done
```

### Automated Merge Coordination

```bash title="scripts/coordinate-merge.sh"
#!/bin/bash
# Coordinate merging multiple parallel branches

BASE_BRANCH="${1:-main}"

echo "Checking parallel branches for merge readiness..."

READY_BRANCHES=""
BLOCKED_BRANCHES=""

for WORKTREE in $(git worktree list --porcelain | grep "^worktree" | cut -d' ' -f2); do
    BRANCH=$(git -C "$WORKTREE" branch --show-current)

    [ "$BRANCH" = "$BASE_BRANCH" ] && continue

    # Check if tests pass
    if git -C "$WORKTREE" log -1 --format="%s" | grep -q "tests pass"; then
        # Check for conflicts with already-ready branches
        HAS_CONFLICT=false

        for READY in $READY_BRANCHES; do
            if ! git merge-tree $(git merge-base "$BRANCH" "$READY") "$BRANCH" "$READY" | grep -q "^"; then
                continue
            else
                HAS_CONFLICT=true
                BLOCKED_BRANCHES="$BLOCKED_BRANCHES $BRANCH(conflicts with $READY)"
                break
            fi
        done

        if [ "$HAS_CONFLICT" = false ]; then
            READY_BRANCHES="$READY_BRANCHES $BRANCH"
        fi
    else
        BLOCKED_BRANCHES="$BLOCKED_BRANCHES $BRANCH(tests not passing)"
    fi
done

echo ""
echo "Ready to merge:"
for BRANCH in $READY_BRANCHES; do
    echo "  - $BRANCH"
done

echo ""
echo "Blocked:"
for BRANCH in $BLOCKED_BRANCHES; do
    echo "  - $BRANCH"
done

echo ""
echo "Merge order:"
echo "$READY_BRANCHES" | tr ' ' '\n' | nl
```

## Best Practices

### Session Management

1. **Clear Naming**: Use descriptive session/worktree names
2. **Regular Syncs**: Rebase from main frequently
3. **Clean Commits**: Keep commits atomic and well-described
4. **Document Handoffs**: Use shared files for cross-session communication

### Conflict Prevention

1. **Define Boundaries**: Assign file ownership per session
2. **Interface First**: Define contracts before implementation
3. **Small Changes**: Keep individual changes focused
4. **Frequent Merges**: Don't let branches diverge too far

### Performance

1. **Limit Sessions**: 3-4 parallel sessions is usually optimal
2. **Monitor Resources**: Watch CPU/memory usage
3. **Use Haiku**: For exploration tasks in parallel sessions
4. **Compact Regularly**: Keep context windows lean

### Communication

1. **Status Files**: Use `.claude/status.md` for cross-session updates
2. **Git Messages**: Reference other branches in commit messages
3. **Lock Files**: Implement simple locking for shared resources
4. **Regular Syncs**: Schedule synchronization points

## Next Steps

- [Multi-Agent Patterns](/guides/multi-agent-patterns) - Agent orchestration
- [Workflow Patterns](/guides/workflow-patterns) - Structured development workflows
- [CI/CD Integration](/guides/ci-cd) - Automated pipelines
- [Best Practices](/guides/best-practices) - General recommendations
