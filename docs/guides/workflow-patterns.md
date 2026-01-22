---
sidebar_position: 7
title: Workflow Patterns
description: Structured workflows for common development scenarios with Claude Code
---

# Workflow Patterns

Structured, repeatable workflows for common development scenarios.

## Feature Development Workflow

### Overview

A complete workflow for implementing new features from planning to deployment.

### Step-by-Step Process

```bash title="1. Create Feature Branch"
git checkout -b feature/user-authentication
```

```text title="2. Plan the Feature"
> Plan the implementation of user authentication with:
> - JWT token-based auth
> - Refresh token rotation
> - Password hashing with bcrypt
> Don't code yet, just outline the approach
```

```text title="3. Implement Incrementally"
> Let's start with step 1: Create the User model with email and password fields
```

```text title="4. Add Tests"
> Write unit tests for the User model
```

```text title="5. Continue Implementation"
> Now implement step 2: JWT token generation and validation
```

```text title="6. Integration Test"
> Create integration tests for the complete auth flow
```

```text title="7. Documentation"
> Update the API documentation for the new auth endpoints
```

```text title="8. Final Review"
> Review all changes, check for security issues, and ensure test coverage
```

### Automated Feature Workflow

```bash title="scripts/start-feature.sh"
#!/bin/bash
# Initialize a new feature with proper setup

FEATURE_NAME="${1:?Feature name required}"
BRANCH_NAME="feature/${FEATURE_NAME// /-}"

# Create branch
git checkout -b "$BRANCH_NAME"

# Create feature planning document
mkdir -p .claude/features

claude -p "Create a feature planning document for: $FEATURE_NAME

Include:
1. Feature overview
2. User stories
3. Technical requirements
4. Implementation steps
5. Testing strategy
6. Acceptance criteria

Format as Markdown." > ".claude/features/$FEATURE_NAME.md"

echo "Feature branch '$BRANCH_NAME' created"
echo "Planning document: .claude/features/$FEATURE_NAME.md"
echo ""
echo "Next steps:"
echo "  1. Review and refine the planning document"
echo "  2. Run 'claude' to start implementation"
```

### Feature Completion Checklist

```bash title="scripts/complete-feature.sh"
#!/bin/bash
# Validate feature completion before PR

echo "Running feature completion checklist..."

# Run tests
echo "1. Running tests..."
npm test || { echo "Tests failed"; exit 1; }

# Check coverage
echo "2. Checking test coverage..."
npm run coverage || echo "Coverage check skipped"

# Lint check
echo "3. Running linter..."
npm run lint || { echo "Lint errors found"; exit 1; }

# Type check
echo "4. Running type checker..."
npm run typecheck || { echo "Type errors found"; exit 1; }

# Generate summary
CHANGES=$(git diff --stat main)
COMMITS=$(git log main..HEAD --oneline)

claude -p "Review this feature branch for completion:

Changes:
$CHANGES

Commits:
$COMMITS

Check:
1. Are all planned features implemented?
2. Is there adequate test coverage?
3. Is documentation updated?
4. Are there any obvious issues?

Provide a completion assessment."
```

## Bug Fix Workflow

### Quick Bug Fix

```text title="1. Describe the Bug"
> There's a bug where users can submit the form with an empty email field
> even though it should be required. The validation seems to run but doesn't
> prevent submission.
```

```text title="2. Locate the Issue"
> Find where form validation is handled and identify why empty emails pass
```

```text title="3. Implement Fix"
> Fix the email validation to properly block empty values
```

```text title="4. Add Regression Test"
> Add a test case for empty email validation
```

```text title="5. Verify Fix"
> Run the tests to confirm the fix works
```

### Automated Bug Investigation

```bash title="scripts/investigate-bug.sh"
#!/bin/bash
# Investigate a bug with Claude's help

BUG_DESCRIPTION="${1:?Bug description required}"
ERROR_LOG="${2:-}"

# Gather context
RECENT_CHANGES=$(git log --oneline -20)
RELATED_FILES=""

if [ -n "$ERROR_LOG" ]; then
  # Extract file paths from error log
  FILES_IN_ERROR=$(grep -oE '[a-zA-Z0-9_/]+\.(ts|js|tsx|jsx)' "$ERROR_LOG" | sort -u)
  for FILE in $FILES_IN_ERROR; do
    if [ -f "$FILE" ]; then
      RELATED_FILES="$RELATED_FILES

=== $FILE ===
$(cat "$FILE")"
    fi
  done
fi

claude -p "Investigate this bug:

Description: $BUG_DESCRIPTION

Error log:
$(cat "$ERROR_LOG" 2>/dev/null || echo "No error log provided")

Recent changes:
$RECENT_CHANGES

Related files:
$RELATED_FILES

Analyze:
1. What is likely causing this bug?
2. Which files should be examined?
3. What's the probable fix?
4. How should we test the fix?"
```

### Bug Fix Branch Template

```bash title="scripts/start-bugfix.sh"
#!/bin/bash
# Create a bug fix branch with proper setup

ISSUE_NUMBER="${1:?Issue number required}"
DESCRIPTION="${2:-bugfix}"

BRANCH_NAME="fix/${ISSUE_NUMBER}-${DESCRIPTION// /-}"

git checkout -b "$BRANCH_NAME"

# If GitHub CLI is available, fetch issue details
if command -v gh &> /dev/null; then
  ISSUE=$(gh issue view "$ISSUE_NUMBER" --json title,body)
  TITLE=$(echo "$ISSUE" | jq -r '.title')
  BODY=$(echo "$ISSUE" | jq -r '.body')

  claude -p "Analyze this bug report and suggest an investigation plan:

Title: $TITLE

Description:
$BODY

Provide:
1. Steps to reproduce
2. Files to examine
3. Potential root causes
4. Testing approach"
fi

echo "Bug fix branch '$BRANCH_NAME' created"
```

## Code Review Workflow

### Self-Review Before PR

```bash title="scripts/self-review.sh"
#!/bin/bash
# Run self-review before creating PR

BRANCH=$(git branch --show-current)
BASE="${1:-main}"

# Get all changes
DIFF=$(git diff "$BASE"..."$BRANCH")
FILES=$(git diff --name-only "$BASE"..."$BRANCH")
COMMITS=$(git log "$BASE".."$BRANCH" --oneline)

claude -p "Review these changes before PR submission:

Branch: $BRANCH
Base: $BASE

Commits:
$COMMITS

Files changed:
$FILES

Diff:
$DIFF

Review for:
1. Code quality and best practices
2. Potential bugs or edge cases
3. Security concerns
4. Performance issues
5. Missing tests
6. Documentation needs

Provide specific, actionable feedback."
```

### PR Review Assistant

```bash title="scripts/review-pr.sh"
#!/bin/bash
# Review a pull request

PR_NUMBER="${1:?PR number required}"

# Get PR details
PR=$(gh pr view "$PR_NUMBER" --json title,body,files,additions,deletions)
DIFF=$(gh pr diff "$PR_NUMBER")

TITLE=$(echo "$PR" | jq -r '.title')
BODY=$(echo "$PR" | jq -r '.body')
FILES=$(echo "$PR" | jq -r '.files[].path')

claude -p "Review this Pull Request:

Title: $TITLE

Description:
$BODY

Files changed:
$FILES

Diff:
$DIFF

Provide a thorough code review including:
1. Summary of changes
2. Potential issues or bugs
3. Suggestions for improvement
4. Questions for the author
5. Approval recommendation (approve/request changes/needs discussion)

Format as GitHub PR review comments."
```

### Review Checklist Generator

```bash title="scripts/review-checklist.sh"
#!/bin/bash
# Generate a review checklist for PR

FILES=$(git diff --name-only main)

claude -p "Generate a code review checklist for these changed files:

$FILES

Create a checklist covering:
1. Functionality (does it work as intended?)
2. Code quality (readability, maintainability)
3. Testing (adequate coverage?)
4. Security (any vulnerabilities?)
5. Performance (any concerns?)
6. Documentation (updated if needed?)

Format as a Markdown checklist that reviewers can copy."
```

## Release Workflow

### Pre-Release Checklist

```bash title="scripts/pre-release.sh"
#!/bin/bash
# Run pre-release validation

echo "=== Pre-Release Checklist ==="
echo ""

# 1. Run all tests
echo "1. Running full test suite..."
npm test || { echo "FAIL: Tests failed"; exit 1; }
echo "   PASS: All tests passed"

# 2. Build check
echo "2. Running production build..."
npm run build || { echo "FAIL: Build failed"; exit 1; }
echo "   PASS: Build successful"

# 3. Lint check
echo "3. Running linter..."
npm run lint || { echo "FAIL: Lint errors"; exit 1; }
echo "   PASS: No lint errors"

# 4. Security audit
echo "4. Running security audit..."
npm audit --audit-level=high || echo "   WARN: Security issues found"

# 5. Check for uncommitted changes
echo "5. Checking for uncommitted changes..."
if [ -n "$(git status --porcelain)" ]; then
  echo "   WARN: Uncommitted changes found"
  git status --short
else
  echo "   PASS: Working directory clean"
fi

# 6. Generate release summary
echo ""
echo "=== Release Summary ==="
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
COMMITS=$(git log "$LAST_TAG"..HEAD --oneline 2>/dev/null || git log --oneline -20)

claude -p "Generate a release summary:

Commits since last release:
$COMMITS

Include:
1. Highlights
2. Breaking changes (if any)
3. Migration notes (if any)
4. Known issues (if any)"
```

### Automated Release Process

```bash title="scripts/release.sh"
#!/bin/bash
# Complete release workflow

set -e

VERSION_TYPE="${1:-patch}"  # major, minor, or patch

echo "Starting release process..."

# 1. Ensure on main branch
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ]; then
  echo "Error: Must be on main branch"
  exit 1
fi

# 2. Pull latest
git pull origin main

# 3. Run pre-release checks
./scripts/pre-release.sh || exit 1

# 4. Bump version
NEW_VERSION=$(npm version "$VERSION_TYPE" --no-git-tag-version | tr -d 'v')
echo "New version: $NEW_VERSION"

# 5. Update changelog
./scripts/update-changelog.sh "$NEW_VERSION"

# 6. Commit and tag
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore(release): v$NEW_VERSION"
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"

# 7. Generate release notes
LAST_TAG=$(git describe --tags --abbrev=0 HEAD^)
COMMITS=$(git log "$LAST_TAG"..HEAD~1 --pretty=format:"- %s")

NOTES=$(claude -p "Generate release notes for v$NEW_VERSION:

Changes:
$COMMITS

Format as professional release notes with:
- Highlights
- New Features
- Bug Fixes
- Breaking Changes (if any)")

# 8. Push
git push origin main --tags

# 9. Create GitHub release
gh release create "v$NEW_VERSION" \
  --title "v$NEW_VERSION" \
  --notes "$NOTES"

# 10. Publish to npm (if applicable)
if [ -f package.json ] && grep -q '"publishConfig"' package.json; then
  npm publish
fi

echo ""
echo "Released v$NEW_VERSION successfully!"
```

### Hotfix Release

```bash title="scripts/hotfix.sh"
#!/bin/bash
# Create and release a hotfix

DESCRIPTION="${1:?Hotfix description required}"

# Get current version
CURRENT_VERSION=$(cat package.json | jq -r '.version')
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
NEW_VERSION="$MAJOR.$MINOR.$((PATCH + 1))"

# Create hotfix branch
git checkout -b "hotfix/v$NEW_VERSION"

echo "Hotfix branch created: hotfix/v$NEW_VERSION"
echo "Current version: $CURRENT_VERSION"
echo "New version: $NEW_VERSION"
echo ""
echo "Make your fixes, then run:"
echo "  ./scripts/complete-hotfix.sh"
```

## Maintenance Workflow

### Dependency Maintenance

```bash title="scripts/maintenance.sh"
#!/bin/bash
# Regular maintenance tasks

echo "=== Running Maintenance Tasks ==="

# 1. Update dependencies
echo ""
echo "1. Checking for outdated dependencies..."
npm outdated || true

# 2. Security audit
echo ""
echo "2. Running security audit..."
npm audit || true

# 3. Check for deprecated code
echo ""
echo "3. Scanning for deprecated patterns..."
DEPRECATED=$(grep -rn "@deprecated\|TODO\|FIXME\|HACK" --include="*.ts" --include="*.js" src/ || true)

if [ -n "$DEPRECATED" ]; then
  claude -p "Review these deprecated/TODO items:

$DEPRECATED

For each item:
1. Is it still relevant?
2. What's needed to address it?
3. Priority (high/medium/low)

Format as a maintenance task list."
fi

# 4. Code health check
echo ""
echo "4. Running code health analysis..."
claude -p "Analyze the codebase health:

Run a general health check looking at:
1. Code complexity hotspots
2. Potential technical debt
3. Test coverage gaps
4. Documentation staleness
5. Dependency health

Provide a maintenance report with actionable items."
```

### Weekly Maintenance Automation

```yaml title=".github/workflows/maintenance.yml"
name: Weekly Maintenance

on:
  schedule:
    - cron: '0 6 * * 1'  # Monday 6 AM
  workflow_dispatch:

jobs:
  maintenance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Run Maintenance
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          # Dependency check
          OUTDATED=$(npm outdated --json 2>/dev/null || echo "{}")

          # Security audit
          AUDIT=$(npm audit --json 2>/dev/null || echo "{}")

          # Generate report
          REPORT=$(claude -p "Generate a weekly maintenance report:

          Outdated dependencies:
          $OUTDATED

          Security audit:
          $AUDIT

          Format as a summary with priority items.")

          echo "$REPORT" > maintenance-report.md

      - name: Create Issue
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('maintenance-report.md', 'utf8');

            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `Weekly Maintenance Report - ${new Date().toISOString().split('T')[0]}`,
              body: report,
              labels: ['maintenance']
            });
```

## Incident Response Workflow

### Initial Incident Response

```bash title="scripts/incident-start.sh"
#!/bin/bash
# Start incident response

INCIDENT_NAME="${1:?Incident name required}"
SEVERITY="${2:-P2}"  # P1, P2, P3

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
INCIDENT_DIR=".claude/incidents/$TIMESTAMP-$INCIDENT_NAME"

mkdir -p "$INCIDENT_DIR"

# Create incident log
cat > "$INCIDENT_DIR/incident.md" << EOF
# Incident: $INCIDENT_NAME

**Severity:** $SEVERITY
**Started:** $(date)
**Status:** Investigating

## Timeline

- $(date +%H:%M) - Incident declared

## Impact

[Describe impact here]

## Investigation

[Investigation notes]

## Actions Taken

[List actions]

## Root Cause

[To be determined]

## Resolution

[To be determined]
EOF

echo "Incident workspace created: $INCIDENT_DIR"
echo ""
echo "Quick commands:"
echo "  claude 'Analyze recent error logs for $INCIDENT_NAME'"
echo "  claude 'Find recent changes that might cause $INCIDENT_NAME'"
```

### Incident Investigation

```bash title="scripts/incident-investigate.sh"
#!/bin/bash
# Investigate an active incident

SEARCH_TERM="${1:?Search term required}"
HOURS="${2:-1}"

# Collect recent logs (adjust path as needed)
LOGS=$(journalctl --since "$HOURS hours ago" 2>/dev/null | tail -500 || echo "No system logs available")

# Get recent deployments
RECENT_DEPLOYS=$(git log --since="$HOURS hours ago" --oneline 2>/dev/null || echo "No recent commits")

# Get recent changes
RECENT_CHANGES=$(git diff HEAD~10 --stat 2>/dev/null || echo "")

claude -p "Investigate this incident:

Search term: $SEARCH_TERM
Time window: Last $HOURS hour(s)

Recent logs:
$LOGS

Recent deployments:
$RECENT_DEPLOYS

Recent code changes:
$RECENT_CHANGES

Analyze:
1. Potential root causes
2. Correlation with recent changes
3. Suggested immediate actions
4. Diagnostic commands to run"
```

### Post-Incident Review

```bash title="scripts/incident-postmortem.sh"
#!/bin/bash
# Generate post-incident review

INCIDENT_DIR="${1:?Incident directory required}"

if [ ! -d "$INCIDENT_DIR" ]; then
  echo "Incident directory not found: $INCIDENT_DIR"
  exit 1
fi

INCIDENT_LOG=$(cat "$INCIDENT_DIR/incident.md")

# Get relevant commits during incident window
START_TIME=$(stat -c %Y "$INCIDENT_DIR/incident.md")
COMMITS=$(git log --since="@$START_TIME" --oneline)

claude -p "Generate a post-incident review:

Incident log:
$INCIDENT_LOG

Related commits:
$COMMITS

Generate a postmortem document including:
1. Executive summary
2. Timeline of events
3. Root cause analysis (5 Whys)
4. Impact assessment
5. What went well
6. What could be improved
7. Action items with owners
8. Preventive measures

Format as a professional postmortem document." > "$INCIDENT_DIR/postmortem.md"

echo "Postmortem generated: $INCIDENT_DIR/postmortem.md"
```

## Onboarding Workflow

### New Developer Setup

```bash title="scripts/onboard.sh"
#!/bin/bash
# Onboard a new developer to the project

echo "=== Project Onboarding ==="
echo ""

# 1. Check prerequisites
echo "1. Checking prerequisites..."
MISSING=""
command -v node >/dev/null || MISSING="$MISSING node"
command -v npm >/dev/null || MISSING="$MISSING npm"
command -v git >/dev/null || MISSING="$MISSING git"

if [ -n "$MISSING" ]; then
  echo "   Missing:$MISSING"
  echo "   Please install missing tools and re-run"
  exit 1
fi
echo "   All prerequisites installed"

# 2. Install dependencies
echo ""
echo "2. Installing dependencies..."
npm install

# 3. Setup environment
echo ""
echo "3. Setting up environment..."
if [ -f .env.example ] && [ ! -f .env ]; then
  cp .env.example .env
  echo "   Created .env from .env.example"
  echo "   Please update .env with your values"
fi

# 4. Generate project overview
echo ""
echo "4. Generating project overview..."
claude -p "Generate a comprehensive project overview for a new developer:

Project structure:
$(find . -type f -name '*.ts' -o -name '*.js' -o -name '*.json' | grep -v node_modules | head -50)

Package.json:
$(cat package.json)

Include:
1. What this project does
2. Key technologies used
3. Project structure explanation
4. Important files to know
5. Development workflow
6. Common tasks and commands
7. Where to find documentation
8. Who to ask for help

Format as a friendly onboarding guide." > ONBOARDING.md

echo "   Created ONBOARDING.md"

# 5. Run tests to verify setup
echo ""
echo "5. Verifying setup..."
npm test || echo "   Note: Some tests may require additional configuration"

echo ""
echo "=== Onboarding Complete ==="
echo "Read ONBOARDING.md to get started"
echo "Run 'claude' to start coding with AI assistance"
```

### Codebase Tour

```bash title="scripts/tour.sh"
#!/bin/bash
# Interactive codebase tour

echo "Starting codebase tour..."
echo "This will walk you through the key parts of the project."
echo ""

# Get project structure
STRUCTURE=$(find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.tsx" -o -name "*.jsx" \) | grep -v node_modules | grep -v dist | head -100)

claude -p "Create an interactive codebase tour:

Project files:
$STRUCTURE

Package.json:
$(cat package.json)

Create a guided tour that covers:
1. Entry points
2. Core business logic
3. API/Routes
4. Database/Data layer
5. Utilities and helpers
6. Tests
7. Configuration

For each area, explain:
- What it does
- Key files to examine
- How it connects to other parts

Format as a numbered tour with clear explanations."
```

### First Task Generator

```bash title="scripts/first-task.sh"
#!/bin/bash
# Generate a good first task for new developers

SKILL_LEVEL="${1:-intermediate}"  # beginner, intermediate, advanced

# Get open issues
ISSUES=""
if command -v gh &> /dev/null; then
  ISSUES=$(gh issue list --label "good first issue" --json title,body,labels --limit 10 2>/dev/null || echo "")
fi

# Get TODO items
TODOS=$(grep -rn "TODO\|FIXME" --include="*.ts" --include="*.js" src/ 2>/dev/null | head -20 || echo "")

claude -p "Suggest a good first task for a new developer:

Skill level: $SKILL_LEVEL

Open 'good first issue' items:
$ISSUES

TODO items in code:
$TODOS

Suggest 3 appropriate first tasks that:
1. Are well-scoped (completable in 1-2 days)
2. Touch important parts of the codebase
3. Have clear success criteria
4. Are appropriate for the skill level

For each suggestion include:
- Task description
- Files to modify
- Acceptance criteria
- Learning outcomes"
```

## Workflow Integration

### Git Hooks Setup

```bash title="scripts/setup-hooks.sh"
#!/bin/bash
# Set up git hooks for workflow enforcement

mkdir -p .git/hooks

# Pre-commit hook
cat > .git/hooks/pre-commit << 'HOOK'
#!/bin/bash
# Run pre-commit checks

npm run lint-staged || exit 1
HOOK
chmod +x .git/hooks/pre-commit

# Commit message hook
cat > .git/hooks/commit-msg << 'HOOK'
#!/bin/bash
# Validate commit message format

COMMIT_MSG=$(cat "$1")

# Check for conventional commit format
if ! echo "$COMMIT_MSG" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .+"; then
  echo "Error: Commit message must follow conventional commits format"
  echo "Example: feat(auth): add login functionality"
  exit 1
fi
HOOK
chmod +x .git/hooks/commit-msg

echo "Git hooks installed"
```

### Workflow Dashboard

```bash title="scripts/dashboard.sh"
#!/bin/bash
# Display project workflow status

echo "=== Project Dashboard ==="
echo ""

# Git status
echo "Git Status:"
echo "  Branch: $(git branch --show-current)"
echo "  Ahead: $(git rev-list --count origin/main..HEAD 2>/dev/null || echo 'N/A')"
echo "  Behind: $(git rev-list --count HEAD..origin/main 2>/dev/null || echo 'N/A')"
echo ""

# Test status
echo "Test Status:"
npm test -- --passWithNoTests --silent 2>/dev/null && echo "  All tests passing" || echo "  Tests failing"
echo ""

# Open issues/PRs
if command -v gh &> /dev/null; then
  echo "GitHub:"
  echo "  Open PRs: $(gh pr list --json number | jq length)"
  echo "  Open Issues: $(gh issue list --json number | jq length)"
  echo ""
fi

# Recent activity
echo "Recent Activity:"
git log --oneline -5
```

## Next Steps

- [Automation Recipes](/guides/automation-recipes) - Ready-to-use automation scripts
- [Scripting Guide](/guides/scripting) - Deeper scripting integration
- [CI/CD Integration](/guides/ci-cd) - Pipeline integration
- [Best Practices](/guides/best-practices) - General best practices
