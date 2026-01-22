---
sidebar_position: 11
title: Git Integration
description: Master Git workflows with Claude Code for commits, PRs, merges, and release management
---

# Git Integration

Master the complete Git workflow with Claude Code, from commit messages to release management.

## Git Workflow Overview

Claude Code integrates deeply with Git to streamline your version control workflow.

### Basic Git Operations

```text title="Check Repository Status"
> What's the current git status? Show me uncommitted changes.
```

```text title="Stage and Commit"
> Stage the changes in src/auth/ and commit with an appropriate message
```

```text title="Create Feature Branch"
> Create a new branch called feature/user-dashboard from main
```

### Interactive Git Session

```text title="Full Git Workflow"
> Let's work through the git workflow:
> 1. Show me what's changed
> 2. Stage the relevant files
> 3. Create a meaningful commit
> 4. Push to remote
```

## Commit Message Generation

### Automatic Commit Messages

Claude analyzes your changes and generates conventional commit messages.

```text title="Generate Commit Message"
> Look at the staged changes and create an appropriate commit message
```

Claude will analyze the diff and produce:

```
feat(auth): add JWT refresh token rotation

- Implement automatic token refresh before expiration
- Add refresh token storage in httpOnly cookies
- Include token revocation on logout
- Add tests for refresh flow
```

### Conventional Commits

Configure Claude to follow conventional commits:

```markdown title="CLAUDE.md"
## Git Conventions

Use conventional commits format:
- feat: New features
- fix: Bug fixes
- docs: Documentation changes
- style: Code style changes (formatting, semicolons)
- refactor: Code refactoring
- test: Adding or updating tests
- chore: Maintenance tasks
- perf: Performance improvements
- ci: CI/CD changes
- build: Build system changes

Include scope when relevant: feat(auth), fix(api), docs(readme)
```

### Commit Message Templates

```bash title="scripts/commit-with-claude.sh"
#!/bin/bash
# Generate commit message with Claude

# Get staged diff
DIFF=$(git diff --cached)

if [ -z "$DIFF" ]; then
  echo "No staged changes"
  exit 1
fi

# Generate commit message
MESSAGE=$(claude -p "Generate a conventional commit message for these changes:

$DIFF

Requirements:
- Use conventional commits format (feat/fix/docs/etc.)
- Include scope if changes are focused on one area
- Write a clear subject line (max 72 chars)
- Add bullet points for significant changes
- Be specific but concise")

echo "Suggested commit message:"
echo "$MESSAGE"
echo ""
read -p "Use this message? (y/n/e for edit): " CHOICE

case $CHOICE in
  y|Y) git commit -m "$MESSAGE" ;;
  e|E) git commit -e -m "$MESSAGE" ;;
  *) echo "Commit cancelled" ;;
esac
```

### Multi-File Commit Analysis

```bash title="scripts/smart-commit.sh"
#!/bin/bash
# Analyze changes and suggest commit strategy

CHANGED_FILES=$(git diff --cached --name-only)
FILE_COUNT=$(echo "$CHANGED_FILES" | wc -l)

if [ "$FILE_COUNT" -gt 10 ]; then
  claude -p "These files are staged for commit:

$CHANGED_FILES

Diff summary:
$(git diff --cached --stat)

Should these changes be:
1. One commit (if logically related)
2. Split into multiple commits (if separate concerns)

If splitting, suggest the groupings and commit messages for each."
else
  claude -p "Generate a commit message for these staged changes:

Files:
$CHANGED_FILES

Diff:
$(git diff --cached)"
fi
```

## Pull Request Creation

### Automated PR Creation

```bash title="scripts/create-pr.sh"
#!/bin/bash
# Create a pull request with Claude-generated description

BRANCH=$(git branch --show-current)
BASE="${1:-main}"

# Get all commits in this branch
COMMITS=$(git log "$BASE".."$BRANCH" --oneline)
DIFF_STAT=$(git diff "$BASE"..."$BRANCH" --stat)
FULL_DIFF=$(git diff "$BASE"..."$BRANCH")

# Generate PR description
PR_BODY=$(claude -p "Generate a pull request description:

Branch: $BRANCH
Base: $BASE

Commits:
$COMMITS

Files changed:
$DIFF_STAT

Full diff:
$FULL_DIFF

Create a PR description with:
1. Summary of changes (2-3 sentences)
2. Key changes (bullet points)
3. Testing done
4. Screenshots needed (if UI changes)
5. Checklist for reviewers")

# Extract title from first commit or branch name
TITLE=$(echo "$COMMITS" | head -1 | cut -d' ' -f2-)

# Create PR
gh pr create \
  --title "$TITLE" \
  --body "$PR_BODY" \
  --base "$BASE"
```

### PR Description Templates

```markdown title=".github/PULL_REQUEST_TEMPLATE.md"
## Summary
<!-- Claude: Generate 2-3 sentence summary -->

## Changes
<!-- Claude: List key changes -->
-

## Testing
<!-- Claude: Describe testing approach -->
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots
<!-- If applicable -->

## Checklist
- [ ] Code follows project style guidelines
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] No hardcoded values
```

### Interactive PR Creation

```text title="Claude Interactive PR"
> I'm ready to create a PR for this feature branch. Help me:
> 1. Review all the changes since main
> 2. Generate a comprehensive PR description
> 3. Identify any issues before submission
> 4. Create the PR with gh cli
```

## PR Review Assistance

### Reviewing Incoming PRs

```bash title="scripts/review-pr.sh"
#!/bin/bash
# Get Claude's review of a PR

PR_NUMBER="${1:?PR number required}"

# Fetch PR details
PR_DATA=$(gh pr view "$PR_NUMBER" --json title,body,files,additions,deletions,commits)
DIFF=$(gh pr diff "$PR_NUMBER")

TITLE=$(echo "$PR_DATA" | jq -r '.title')
BODY=$(echo "$PR_DATA" | jq -r '.body')
FILES=$(echo "$PR_DATA" | jq -r '.files[].path' | tr '\n' ', ')
ADDITIONS=$(echo "$PR_DATA" | jq -r '.additions')
DELETIONS=$(echo "$PR_DATA" | jq -r '.deletions')

claude -p "Review this Pull Request:

**Title:** $TITLE

**Description:**
$BODY

**Files changed:** $FILES
**Lines:** +$ADDITIONS / -$DELETIONS

**Diff:**
$DIFF

Provide a thorough review:

1. **Summary**: What does this PR do?
2. **Code Quality**: Any issues with the implementation?
3. **Bugs**: Potential bugs or edge cases?
4. **Security**: Any security concerns?
5. **Performance**: Any performance implications?
6. **Tests**: Are there adequate tests?
7. **Suggestions**: Specific improvements?
8. **Verdict**: Approve / Request Changes / Needs Discussion

Format as actionable review comments."
```

### Addressing Review Comments

```text title="Address PR Feedback"
> Review the comments on PR #42 and help me address each one:
> 1. List all the review comments
> 2. For each comment, suggest how to address it
> 3. Make the necessary changes
> 4. Generate response comments
```

### Bulk Review Processing

```bash title="scripts/process-reviews.sh"
#!/bin/bash
# Process all review comments on a PR

PR_NUMBER="${1:?PR number required}"

# Get review comments
COMMENTS=$(gh api repos/:owner/:repo/pulls/$PR_NUMBER/comments --jq '.[] | "\(.path):\(.line) - \(.body)"')

claude -p "Process these PR review comments:

$COMMENTS

For each comment:
1. Understand the feedback
2. Determine if code change is needed
3. Suggest the fix or explain why no change needed
4. Draft a response comment

Format as an action plan."
```

## Branch Management

### Branch Strategy with Claude

```text title="Plan Branch Strategy"
> We're starting a new feature that will take 2 weeks. Help me plan:
> 1. Main feature branch structure
> 2. Sub-task branches if needed
> 3. Integration strategy
> 4. Review checkpoints
```

### Branch Cleanup

```bash title="scripts/cleanup-branches.sh"
#!/bin/bash
# Clean up merged and stale branches

echo "=== Branch Cleanup Analysis ==="

# Get merged branches
MERGED=$(git branch --merged main | grep -v "main\|master\|\*")

# Get stale branches (no commits in 30 days)
STALE=""
for BRANCH in $(git branch --format='%(refname:short)'); do
  LAST_COMMIT=$(git log -1 --format=%ci "$BRANCH" 2>/dev/null)
  if [ -n "$LAST_COMMIT" ]; then
    DAYS_OLD=$(( ($(date +%s) - $(date -d "$LAST_COMMIT" +%s)) / 86400 ))
    if [ "$DAYS_OLD" -gt 30 ]; then
      STALE="$STALE$BRANCH ($DAYS_OLD days old)\n"
    fi
  fi
done

claude -p "Analyze these branches for cleanup:

**Merged branches (safe to delete):**
$MERGED

**Stale branches (no activity > 30 days):**
$(echo -e "$STALE")

For each branch, recommend:
1. Delete immediately
2. Archive (tag and delete)
3. Keep (explain why)
4. Needs investigation

Consider branch naming patterns to identify purpose."
```

### Branch Naming Convention

```markdown title="CLAUDE.md"
## Branch Naming

Follow this convention:
- feature/TICKET-123-short-description
- fix/TICKET-456-bug-description
- hotfix/critical-issue
- release/v1.2.0
- chore/dependency-updates

Examples:
- feature/AUTH-101-jwt-refresh
- fix/API-202-null-pointer
- hotfix/security-patch
```

## Merge Conflict Resolution

### Automated Conflict Analysis

```bash title="scripts/resolve-conflicts.sh"
#!/bin/bash
# Get Claude's help resolving merge conflicts

# Check for conflicts
CONFLICTS=$(git diff --name-only --diff-filter=U)

if [ -z "$CONFLICTS" ]; then
  echo "No merge conflicts found"
  exit 0
fi

echo "Found conflicts in:"
echo "$CONFLICTS"
echo ""

for FILE in $CONFLICTS; do
  echo "=== Analyzing: $FILE ==="

  # Get the conflicted content
  CONTENT=$(cat "$FILE")

  # Get the base, ours, and theirs versions
  BASE=$(git show :1:"$FILE" 2>/dev/null || echo "")
  OURS=$(git show :2:"$FILE" 2>/dev/null || echo "")
  THEIRS=$(git show :3:"$FILE" 2>/dev/null || echo "")

  claude -p "Help resolve this merge conflict:

**File:** $FILE

**Current content with conflict markers:**
$CONTENT

**Our version (current branch):**
$OURS

**Their version (incoming branch):**
$THEIRS

**Base version (common ancestor):**
$BASE

Analyze the conflict and suggest:
1. What each side is trying to do
2. The correct resolution
3. The merged code
4. Any concerns about the merge"
done
```

### Interactive Conflict Resolution

```text title="Resolve Conflicts Interactively"
> I have merge conflicts after merging main into my feature branch.
> Walk me through resolving each conflict:
> 1. Show me each conflicted file
> 2. Explain what each side changed
> 3. Recommend the best resolution
> 4. Apply the fix
```

### Complex Merge Strategy

```bash title="scripts/complex-merge.sh"
#!/bin/bash
# Handle complex merges with strategy

SOURCE="${1:?Source branch required}"
TARGET="${2:-$(git branch --show-current)}"

echo "Analyzing merge: $SOURCE -> $TARGET"

# Get divergence info
COMMON_ANCESTOR=$(git merge-base "$SOURCE" "$TARGET")
COMMITS_SOURCE=$(git rev-list --count "$COMMON_ANCESTOR".."$SOURCE")
COMMITS_TARGET=$(git rev-list --count "$COMMON_ANCESTOR".."$TARGET")

# Get changed files
FILES_SOURCE=$(git diff --name-only "$COMMON_ANCESTOR".."$SOURCE")
FILES_TARGET=$(git diff --name-only "$COMMON_ANCESTOR".."$TARGET")

# Find overlapping files
OVERLAP=$(comm -12 <(echo "$FILES_SOURCE" | sort) <(echo "$FILES_TARGET" | sort))

claude -p "Analyze this merge scenario:

**Merging:** $SOURCE -> $TARGET
**Common ancestor:** $COMMON_ANCESTOR

**Source branch:**
- Commits: $COMMITS_SOURCE
- Files changed: $(echo "$FILES_SOURCE" | wc -l)

**Target branch:**
- Commits: $COMMITS_TARGET
- Files changed: $(echo "$FILES_TARGET" | wc -l)

**Overlapping files (potential conflicts):**
$OVERLAP

Recommend:
1. Merge strategy (merge/rebase/squash)
2. Potential conflict areas
3. Files needing manual review
4. Pre-merge checklist"
```

## Git Hooks Integration

### Claude-Powered Pre-Commit Hook

```bash title=".git/hooks/pre-commit"
#!/bin/bash
# Claude-enhanced pre-commit checks

# Get staged files
STAGED=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED" ]; then
  exit 0
fi

# Quick lint check
npm run lint --silent || {
  echo "Lint errors found. Fix before committing."
  exit 1
}

# Security scan for sensitive files
SENSITIVE=$(echo "$STAGED" | grep -E '\.(env|pem|key|secret)$')
if [ -n "$SENSITIVE" ]; then
  echo "WARNING: Attempting to commit potentially sensitive files:"
  echo "$SENSITIVE"
  read -p "Continue? (y/n): " CONFIRM
  [ "$CONFIRM" != "y" ] && exit 1
fi

# Large file check
for FILE in $STAGED; do
  SIZE=$(stat -c%s "$FILE" 2>/dev/null || stat -f%z "$FILE" 2>/dev/null)
  if [ "$SIZE" -gt 1048576 ]; then
    echo "WARNING: Large file detected: $FILE ($(($SIZE / 1024))KB)"
    read -p "Continue? (y/n): " CONFIRM
    [ "$CONFIRM" != "y" ] && exit 1
  fi
done

exit 0
```

### Commit Message Hook with Claude

```bash title=".git/hooks/commit-msg"
#!/bin/bash
# Validate and enhance commit message with Claude

COMMIT_MSG_FILE="$1"
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Skip if message starts with "Merge" or "Revert"
if echo "$COMMIT_MSG" | grep -qE "^(Merge|Revert)"; then
  exit 0
fi

# Validate conventional commit format
if ! echo "$COMMIT_MSG" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .+"; then
  echo "Invalid commit message format."
  echo "Expected: type(scope): description"
  echo ""

  # Offer to fix with Claude
  if [ -t 0 ]; then
    STAGED_DIFF=$(git diff --cached --stat)
    SUGGESTED=$(claude -p "Convert this commit message to conventional format:

Current message: $COMMIT_MSG

Staged changes:
$STAGED_DIFF

Provide just the corrected commit message, nothing else." 2>/dev/null)

    if [ -n "$SUGGESTED" ]; then
      echo "Suggested message: $SUGGESTED"
      read -p "Use this message? (y/n): " CONFIRM
      if [ "$CONFIRM" = "y" ]; then
        echo "$SUGGESTED" > "$COMMIT_MSG_FILE"
        exit 0
      fi
    fi
  fi

  exit 1
fi

exit 0
```

### Pre-Push Security Check

```bash title=".git/hooks/pre-push"
#!/bin/bash
# Security check before pushing

REMOTE="$1"
URL="$2"

# Check for secrets in recent commits
COMMITS=$(git rev-list @{u}..HEAD 2>/dev/null || git rev-list HEAD~5..HEAD)

for COMMIT in $COMMITS; do
  # Check commit diff for secrets
  DIFF=$(git show "$COMMIT" --format="" -p)

  # Pattern check for common secrets
  if echo "$DIFF" | grep -qE "(password|secret|api_key|apikey|token|auth).*['\"][a-zA-Z0-9]{16,}['\"]"; then
    echo "WARNING: Potential secret detected in commit $COMMIT"
    echo "Review with: git show $COMMIT"
    read -p "Push anyway? (y/n): " CONFIRM
    [ "$CONFIRM" != "y" ] && exit 1
  fi
done

exit 0
```

### Claude Code Hooks Integration

```json title=".claude/settings.json"
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "if echo \"$TOOL_INPUT\" | grep -q 'git push.*--force'; then echo 'BLOCKED: Force push requires confirmation'; exit 1; fi"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "command": "if echo \"$TOOL_INPUT\" | grep -q 'git commit'; then echo 'Commit created - remember to push'; fi"
      }
    ]
  }
}
```

## Changelog Generation

### Automated Changelog Updates

```bash title="scripts/update-changelog.sh"
#!/bin/bash
# Generate changelog entry for new version

VERSION="${1:?Version required}"
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")

if [ -n "$LAST_TAG" ]; then
  COMMITS=$(git log "$LAST_TAG"..HEAD --pretty=format:"- %s (%h)" --no-merges)
  RANGE="$LAST_TAG..HEAD"
else
  COMMITS=$(git log --pretty=format:"- %s (%h)" --no-merges -50)
  RANGE="last 50 commits"
fi

ENTRY=$(claude -p "Generate a changelog entry for version $VERSION:

Commits since $RANGE:
$COMMITS

Format as:
## [$VERSION] - $(date +%Y-%m-%d)

### Added
- New features

### Changed
- Changes to existing features

### Fixed
- Bug fixes

### Removed
- Removed features

### Security
- Security fixes

### Deprecated
- Deprecated features

Only include sections that have entries.
Group related commits together.
Write user-friendly descriptions, not just commit messages.")

# Prepend to CHANGELOG.md
if [ -f CHANGELOG.md ]; then
  # Insert after the header
  sed -i "0,/^## /s//$(echo "$ENTRY" | sed 's/[&/\]/\\&/g')\n\n## /" CHANGELOG.md
else
  echo "# Changelog

All notable changes to this project will be documented in this file.

$ENTRY" > CHANGELOG.md
fi

echo "Changelog updated for version $VERSION"
```

### Keep-a-Changelog Format

```markdown title="CHANGELOG.md"
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New features go here

## [1.2.0] - 2024-01-15

### Added
- User authentication with JWT
- Password reset flow
- Remember me functionality

### Changed
- Improved login form validation
- Updated password requirements

### Fixed
- Session timeout handling
- Token refresh race condition
```

### Changelog from PR Labels

```bash title="scripts/changelog-from-prs.sh"
#!/bin/bash
# Generate changelog from merged PRs using labels

SINCE="${1:-$(git describe --tags --abbrev=0)}"

# Get merged PRs since last release
PRS=$(gh pr list --state merged --json number,title,labels,mergedAt --jq ".[] | select(.mergedAt > \"$SINCE\")")

claude -p "Generate a changelog from these merged PRs:

$PRS

Group by PR labels:
- 'enhancement' -> Added
- 'bug' -> Fixed
- 'documentation' -> Documentation
- 'breaking' -> Breaking Changes
- 'security' -> Security
- 'performance' -> Performance

Format as a proper changelog section."
```

## Release Tagging

### Semantic Version Tagging

```bash title="scripts/tag-release.sh"
#!/bin/bash
# Create a semantic version tag with release notes

VERSION_TYPE="${1:-patch}"  # major, minor, patch, or explicit version

# Get current version
CURRENT=$(git describe --tags --abbrev=0 2>/dev/null | sed 's/^v//')

if [ -z "$CURRENT" ]; then
  CURRENT="0.0.0"
fi

IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"

# Calculate new version
case $VERSION_TYPE in
  major)
    NEW_VERSION="$((MAJOR + 1)).0.0"
    ;;
  minor)
    NEW_VERSION="$MAJOR.$((MINOR + 1)).0"
    ;;
  patch)
    NEW_VERSION="$MAJOR.$MINOR.$((PATCH + 1))"
    ;;
  *)
    NEW_VERSION="$VERSION_TYPE"
    ;;
esac

echo "Current version: $CURRENT"
echo "New version: $NEW_VERSION"
echo ""

# Generate release notes
COMMITS=$(git log "v$CURRENT"..HEAD --pretty=format:"- %s" --no-merges 2>/dev/null || git log --pretty=format:"- %s" --no-merges -20)

NOTES=$(claude -p "Generate release notes for v$NEW_VERSION:

Changes since v$CURRENT:
$COMMITS

Create professional release notes with:
1. Headline (what's the main theme?)
2. Highlights (3-5 key items)
3. Full changelog (categorized)
4. Upgrade notes (if breaking changes)
5. Contributors (if from PR authors)")

echo "Release Notes:"
echo "$NOTES"
echo ""

read -p "Create tag v$NEW_VERSION with these notes? (y/n): " CONFIRM
if [ "$CONFIRM" = "y" ]; then
  git tag -a "v$NEW_VERSION" -m "$NOTES"
  echo "Tag v$NEW_VERSION created"
  echo "Push with: git push origin v$NEW_VERSION"
fi
```

### GitHub Release Creation

```bash title="scripts/github-release.sh"
#!/bin/bash
# Create a GitHub release with generated notes

TAG="${1:?Tag required (e.g., v1.2.0)}"
PREVIOUS_TAG=$(git describe --tags --abbrev=0 "$TAG^" 2>/dev/null)

# Get commits between tags
if [ -n "$PREVIOUS_TAG" ]; then
  COMMITS=$(git log "$PREVIOUS_TAG".."$TAG" --pretty=format:"- %s (%an)" --no-merges)
  # Get PRs merged in this release
  PRS=$(gh pr list --state merged --json number,title --jq ".[] | \"- #\(.number) \(.title)\"" 2>/dev/null | head -20)
else
  COMMITS=$(git log "$TAG" --pretty=format:"- %s (%an)" --no-merges -30)
  PRS=""
fi

# Generate release notes
NOTES=$(claude -p "Generate GitHub release notes for $TAG:

Commits:
$COMMITS

Pull Requests:
$PRS

Format as professional release notes with:
## What's New
Brief description of the release

## Features
- New features

## Bug Fixes
- Fixed issues

## Improvements
- Improvements

## Breaking Changes
- Any breaking changes (if applicable)

## Full Changelog
Link format: **Full Changelog**: https://github.com/owner/repo/compare/$PREVIOUS_TAG...$TAG")

# Determine if prerelease
PRERELEASE=""
if echo "$TAG" | grep -qE "(alpha|beta|rc)"; then
  PRERELEASE="--prerelease"
fi

# Create release
gh release create "$TAG" \
  --title "$TAG" \
  --notes "$NOTES" \
  $PRERELEASE

echo "Release $TAG created on GitHub"
```

## Git Bisect with Claude

### Automated Bisect Helper

```bash title="scripts/bisect-helper.sh"
#!/bin/bash
# Use Claude to help with git bisect

ISSUE="${1:?Describe the bug to find}"

echo "Starting bisect helper for: $ISSUE"
echo ""

# Provide guidance
claude -p "I'm going to use git bisect to find when this bug was introduced:

Issue: $ISSUE

Provide:
1. A test command I can run to verify if the bug exists
2. Signs to look for that indicate the bug
3. Potential areas of code that might be related
4. Tips for efficient bisecting"
```

### Bisect Test Script

```bash title="scripts/bisect-test.sh"
#!/bin/bash
# Automated test script for git bisect
# Usage: git bisect run ./scripts/bisect-test.sh

# Define your test here
# Exit 0 = good (bug not present)
# Exit 1 = bad (bug present)
# Exit 125 = skip (can't test this commit)

# Build the project (skip if build fails)
npm run build 2>/dev/null || exit 125

# Run specific test
npm test -- --grep "authentication" || exit 1

# Additional custom check
if grep -q "bug pattern" src/auth.ts; then
  exit 1  # Bug present
fi

exit 0  # Bug not present
```

### Bisect Analysis

```bash title="scripts/bisect-analyze.sh"
#!/bin/bash
# Analyze the result of git bisect

FIRST_BAD=$(git bisect log | grep "first bad commit" | cut -d' ' -f4)

if [ -z "$FIRST_BAD" ]; then
  echo "Run git bisect first"
  exit 1
fi

echo "First bad commit: $FIRST_BAD"
echo ""

# Get commit details
COMMIT_INFO=$(git show "$FIRST_BAD" --stat)
DIFF=$(git show "$FIRST_BAD" -p)

claude -p "Analyze this commit that introduced a bug:

$COMMIT_INFO

Full diff:
$DIFF

Identify:
1. What change likely caused the bug
2. Why it might have been missed in review
3. The fix that should be applied
4. How to prevent similar issues"
```

## Monorepo Strategies

### Monorepo Navigation

```text title="Monorepo Context"
> This is a monorepo with packages in /packages. When I'm working in
> packages/web, focus on that package but be aware of shared packages
> in packages/common and packages/api-client.
```

### Package-Specific Commits

```bash title="scripts/monorepo-commit.sh"
#!/bin/bash
# Smart commits for monorepo

# Detect which packages changed
CHANGED_PACKAGES=$(git diff --cached --name-only | grep "^packages/" | cut -d'/' -f2 | sort -u)
PACKAGE_COUNT=$(echo "$CHANGED_PACKAGES" | wc -l)

if [ "$PACKAGE_COUNT" -eq 0 ]; then
  # Root level changes
  claude -p "Generate a commit message for these root-level changes:

$(git diff --cached --stat)

Use format: chore(root): description"

elif [ "$PACKAGE_COUNT" -eq 1 ]; then
  # Single package change
  PACKAGE="$CHANGED_PACKAGES"
  claude -p "Generate a commit message for changes in the $PACKAGE package:

$(git diff --cached --stat)

Use format: type($PACKAGE): description"

else
  # Multiple packages
  claude -p "Multiple packages changed:
$CHANGED_PACKAGES

Changes:
$(git diff --cached --stat)

Recommend:
1. Should this be one commit or multiple?
2. If one commit, what's the message?
3. If multiple, how should changes be grouped?"
fi
```

### Monorepo Release Workflow

```bash title="scripts/monorepo-release.sh"
#!/bin/bash
# Release workflow for monorepo

PACKAGE="${1:?Package name required}"
VERSION_TYPE="${2:-patch}"

PACKAGE_DIR="packages/$PACKAGE"

if [ ! -d "$PACKAGE_DIR" ]; then
  echo "Package not found: $PACKAGE"
  exit 1
fi

cd "$PACKAGE_DIR"

# Get current version
CURRENT_VERSION=$(cat package.json | jq -r '.version')

# Get changes since last release
LAST_TAG=$(git tag -l "$PACKAGE@*" | sort -V | tail -1)
if [ -n "$LAST_TAG" ]; then
  COMMITS=$(git log "$LAST_TAG"..HEAD --oneline -- .)
else
  COMMITS=$(git log --oneline -20 -- .)
fi

claude -p "Analyze changes in $PACKAGE for release:

Current version: $CURRENT_VERSION
Requested bump: $VERSION_TYPE

Changes:
$COMMITS

Provide:
1. Is $VERSION_TYPE the right bump? (consider semver)
2. Release notes for this package
3. Any dependencies that need updating
4. Breaking change warnings"
```

### Cross-Package Impact Analysis

```bash title="scripts/impact-analysis.sh"
#!/bin/bash
# Analyze cross-package impact of changes

CHANGED_FILES=$(git diff --name-only HEAD~1)

# Find which packages are affected
DIRECT=$(echo "$CHANGED_FILES" | grep "^packages/" | cut -d'/' -f2 | sort -u)

# Build dependency graph
DEPS=""
for PKG in $(ls packages/); do
  PKG_DEPS=$(cat "packages/$PKG/package.json" | jq -r '.dependencies // {} | keys[]' 2>/dev/null | grep "^@myorg/" | sed 's/@myorg\///')
  if [ -n "$PKG_DEPS" ]; then
    DEPS="$DEPS\n$PKG depends on: $PKG_DEPS"
  fi
done

claude -p "Analyze cross-package impact:

**Directly changed packages:**
$DIRECT

**Package dependencies:**
$(echo -e "$DEPS")

**Changed files:**
$CHANGED_FILES

Identify:
1. Directly impacted packages
2. Transitively impacted packages
3. Packages that need testing
4. Suggested testing order
5. Potential integration issues"
```

## Advanced Git Operations

### Interactive Rebase Planning

```bash title="scripts/rebase-plan.sh"
#!/bin/bash
# Plan an interactive rebase with Claude's help

COMMITS="${1:-10}"
BASE="${2:-main}"

HISTORY=$(git log --oneline "$BASE"..HEAD | head -"$COMMITS")

claude -p "Help me plan an interactive rebase:

Commits to rebase:
$HISTORY

Suggest a rebase plan:
1. Which commits to squash together
2. Which commits to reword
3. Which commits to reorder
4. Any commits to drop
5. The resulting clean history

Provide the rebase-todo format:
pick/squash/reword/drop commit-hash"
```

### Cherry-Pick Assistant

```bash title="scripts/cherry-pick.sh"
#!/bin/bash
# Smart cherry-pick with conflict prediction

COMMIT="${1:?Commit hash required}"
TARGET="${2:-$(git branch --show-current)}"

# Get commit info
COMMIT_INFO=$(git show "$COMMIT" --stat)
COMMIT_DIFF=$(git show "$COMMIT" -p)

# Get target branch recent changes
TARGET_CHANGES=$(git log -10 --oneline "$TARGET")

claude -p "Analyze this cherry-pick operation:

**Commit to cherry-pick:**
$COMMIT_INFO

**Target branch:** $TARGET
**Recent target changes:**
$TARGET_CHANGES

**Commit diff:**
$COMMIT_DIFF

Predict:
1. Likelihood of conflicts (low/medium/high)
2. Files likely to conflict
3. Any dependencies this commit has
4. Recommended approach (cherry-pick vs manual apply)"
```

### Git Stash Management

```bash title="scripts/stash-manager.sh"
#!/bin/bash
# Intelligent stash management

ACTION="${1:-list}"

case $ACTION in
  list)
    STASHES=$(git stash list)
    if [ -z "$STASHES" ]; then
      echo "No stashes found"
      exit 0
    fi

    claude -p "Analyze these git stashes and recommend action:

$STASHES

For each stash:
1. What it likely contains (based on message)
2. Recommended action (apply, drop, keep)
3. Age assessment (recent vs old)"
    ;;

  organize)
    # Show stash contents and suggest cleanup
    for i in $(seq 0 $(( $(git stash list | wc -l) - 1 ))); do
      echo "=== Stash $i ==="
      git stash show "stash@{$i}" --stat
    done | claude -p "Review these stashes and suggest:
1. Which to apply to current branch
2. Which to create branches from
3. Which to delete
4. Any duplicates"
    ;;
esac
```

## Workflow Automation

### Daily Git Workflow

```bash title="scripts/daily-git.sh"
#!/bin/bash
# Daily git maintenance routine

echo "=== Daily Git Workflow ==="
echo ""

# 1. Fetch all remotes
echo "1. Fetching all remotes..."
git fetch --all --prune

# 2. Check branch status
echo ""
echo "2. Branch status:"
BRANCH=$(git branch --show-current)
BEHIND=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo "0")
AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")
echo "   Current: $BRANCH"
echo "   Behind main: $BEHIND commits"
echo "   Ahead of main: $AHEAD commits"

# 3. Stash check
echo ""
echo "3. Stash status:"
STASH_COUNT=$(git stash list | wc -l)
echo "   Stashes: $STASH_COUNT"

# 4. Uncommitted changes
echo ""
echo "4. Working directory:"
if [ -n "$(git status --porcelain)" ]; then
  git status --short
else
  echo "   Clean"
fi

# 5. Today's work summary
echo ""
echo "5. Today's commits:"
git log --oneline --since="6am" --author="$(git config user.email)"

# Recommendations
if [ "$BEHIND" -gt 5 ]; then
  echo ""
  echo "RECOMMENDATION: Consider rebasing on main (behind by $BEHIND commits)"
fi

if [ "$STASH_COUNT" -gt 3 ]; then
  echo ""
  echo "RECOMMENDATION: Clean up stashes (have $STASH_COUNT)"
fi
```

### Git Aliases with Claude

```bash title="~/.gitconfig"
[alias]
    # Claude-assisted commit
    cc = "!f() { git diff --cached | claude -p 'Generate commit message:' | git commit -F -; }; f"

    # Quick PR creation
    cpr = "!f() { claude -p \"Generate PR title and body for branch $(git branch --show-current)\" | gh pr create --title \"$(head -1)\" --body \"$(tail -n +2)\"; }; f"

    # Smart log with summary
    sl = "!git log --oneline -20 | claude -p 'Summarize these commits in 2-3 sentences'"

    # Conflict helper
    resolve = "!f() { git diff --name-only --diff-filter=U | xargs -I{} claude -p \"Help resolve conflict in {}: $(cat {})\"; }; f"
```

## Best Practices

### Git Workflow Checklist

```markdown title="CLAUDE.md"
## Git Workflow

### Before Starting Work
- [ ] Pull latest from main
- [ ] Create feature branch
- [ ] Verify no uncommitted changes from previous work

### During Development
- [ ] Make atomic commits
- [ ] Write meaningful commit messages
- [ ] Push regularly to remote

### Before PR
- [ ] Rebase on latest main
- [ ] Run all tests
- [ ] Self-review changes
- [ ] Update documentation

### PR Review
- [ ] Address all comments
- [ ] Re-request review after changes
- [ ] Squash fixup commits before merge
```

### Common Git Tasks Reference

| Task | Command | Claude Prompt |
|------|---------|---------------|
| Stage specific files | `git add file1 file2` | "Stage only the auth-related changes" |
| Amend last commit | `git commit --amend` | "Add these changes to my last commit" |
| Undo last commit | `git reset HEAD~1` | "Undo the last commit but keep changes" |
| View file history | `git log -p file` | "Show me the history of this file" |
| Find who changed line | `git blame file` | "Who last modified line 42?" |
| Clean untracked | `git clean -fd` | "Remove all untracked files" |

## Next Steps

- [Workflow Patterns](/guides/workflow-patterns) - Complete development workflows
- [CI/CD Integration](/guides/ci-cd) - Pipeline integration
- [Best Practices](/guides/best-practices) - General best practices
- [Automation Recipes](/guides/automation-recipes) - More automation scripts
