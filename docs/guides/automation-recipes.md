---
sidebar_position: 6
title: Automation Recipes
description: Ready-to-use automation recipes for Claude Code
---

# Automation Recipes

Copy-paste ready automation scripts for common development tasks.

## Daily Standup Generator

### Automated Git Summary

```bash title="scripts/standup.sh"
#!/bin/bash
# Generate a daily standup summary from git activity

AUTHOR="${GIT_AUTHOR:-$(git config user.email)}"
SINCE="${SINCE:-yesterday}"

# Get commits from the last day
COMMITS=$(git log --author="$AUTHOR" --since="$SINCE" --pretty=format:"- %s" 2>/dev/null)

# Get files changed
FILES_CHANGED=$(git log --author="$AUTHOR" --since="$SINCE" --name-only --pretty=format: | sort -u | grep -v '^$')

# Generate standup with Claude
claude -p "Generate a brief standup update based on these commits:

Commits:
$COMMITS

Files changed:
$FILES_CHANGED

Format as:
- Yesterday: [summary of work done]
- Today: [planned work based on patterns]
- Blockers: [any potential issues]

Keep it concise and professional."
```

### GitHub Actions Daily Standup

```yaml title=".github/workflows/standup.yml"
name: Daily Standup Generator

on:
  schedule:
    - cron: '0 9 * * 1-5'  # 9 AM on weekdays
  workflow_dispatch:

jobs:
  standup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Generate Standup
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          COMMITS=$(git log --since="yesterday" --pretty=format:"- %s (%an)")

          claude -p "Generate a team standup summary:

          Recent commits:
          $COMMITS

          Format as a Slack message with sections for each contributor." --json > standup.json

      - name: Post to Slack
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
        run: |
          MESSAGE=$(jq -r '.result' standup.json)
          curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$MESSAGE\"}" \
            $SLACK_WEBHOOK
```

## Changelog Automation

### Generate Changelog from Commits

```bash title="scripts/changelog.sh"
#!/bin/bash
# Generate changelog entries from commits between tags

FROM_TAG="${1:-$(git describe --tags --abbrev=0 HEAD^ 2>/dev/null || echo '')}"
TO_TAG="${2:-HEAD}"

if [ -z "$FROM_TAG" ]; then
  COMMITS=$(git log --pretty=format:"%H %s" "$TO_TAG")
else
  COMMITS=$(git log --pretty=format:"%H %s" "$FROM_TAG".."$TO_TAG")
fi

claude -p "Generate a changelog from these commits:

$COMMITS

Group by:
- Features (feat:, feature:, add:)
- Bug Fixes (fix:, bugfix:)
- Breaking Changes (BREAKING:, breaking:)
- Performance (perf:)
- Documentation (docs:)
- Other

Use conventional changelog format. Include commit hashes as links.
Output in Markdown format suitable for CHANGELOG.md"
```

### Automated CHANGELOG.md Update

```bash title="scripts/update-changelog.sh"
#!/bin/bash
# Update CHANGELOG.md with new version entries

VERSION="${1:?Version required (e.g., 1.2.0)}"
DATE=$(date +%Y-%m-%d)

# Get previous version
PREV_VERSION=$(git describe --tags --abbrev=0 2>/dev/null || echo "")

# Generate changelog content
if [ -z "$PREV_VERSION" ]; then
  COMMITS=$(git log --pretty=format:"- %s (%h)" HEAD)
else
  COMMITS=$(git log --pretty=format:"- %s (%h)" "$PREV_VERSION"..HEAD)
fi

# Generate formatted changelog entry
ENTRY=$(claude -p "Format these commits as a changelog entry for version $VERSION:

$COMMITS

Use this format:
## [$VERSION] - $DATE

### Added
- New features...

### Changed
- Changes...

### Fixed
- Bug fixes...

### Removed
- Removed features...

Only include sections that have content. Keep descriptions concise.")

# Prepend to CHANGELOG.md
if [ -f CHANGELOG.md ]; then
  # Insert after the title
  awk -v entry="$ENTRY" '
    /^# Changelog/ { print; print ""; print entry; next }
    { print }
  ' CHANGELOG.md > CHANGELOG.tmp && mv CHANGELOG.tmp CHANGELOG.md
else
  echo -e "# Changelog\n\n$ENTRY" > CHANGELOG.md
fi

echo "Updated CHANGELOG.md with version $VERSION"
```

### GitHub Release Notes Generator

```yaml title=".github/workflows/release-notes.yml"
name: Generate Release Notes

on:
  release:
    types: [created]

jobs:
  notes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Generate Notes
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          # Get commits since last release
          PREV_TAG=$(git describe --tags --abbrev=0 HEAD^ 2>/dev/null || echo "")

          if [ -n "$PREV_TAG" ]; then
            COMMITS=$(git log --pretty=format:"- %s" "$PREV_TAG"..HEAD)
          else
            COMMITS=$(git log --pretty=format:"- %s")
          fi

          # Generate release notes
          NOTES=$(claude -p "Generate professional release notes:

          Version: ${{ github.event.release.tag_name }}

          Commits:
          $COMMITS

          Include:
          - Highlights section
          - What's New
          - Bug Fixes
          - Breaking Changes (if any)
          - Upgrade instructions (if needed)

          Make it user-friendly and highlight the most important changes.")

          # Update release body
          gh release edit ${{ github.event.release.tag_name }} --notes "$NOTES"
```

## Release Management

### Semantic Version Bump

```bash title="scripts/version-bump.sh"
#!/bin/bash
# Analyze commits and suggest version bump

CURRENT_VERSION=$(cat package.json | jq -r '.version' 2>/dev/null || echo "0.0.0")
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")

if [ -n "$LAST_TAG" ]; then
  COMMITS=$(git log --pretty=format:"%s" "$LAST_TAG"..HEAD)
else
  COMMITS=$(git log --pretty=format:"%s")
fi

claude -p "Analyze these commits and recommend a semantic version bump:

Current version: $CURRENT_VERSION

Commits since last release:
$COMMITS

Rules:
- MAJOR: Breaking changes (look for 'BREAKING', 'breaking change', major API changes)
- MINOR: New features (look for 'feat:', 'feature:', 'add:')
- PATCH: Bug fixes and minor changes (look for 'fix:', 'patch:', 'chore:')

Respond with ONLY the new version number (e.g., 1.2.3) and a brief explanation."
```

### Complete Release Script

```bash title="scripts/release.sh"
#!/bin/bash
# Automated release workflow

set -e

# Determine version bump
echo "Analyzing commits for version bump..."
CURRENT=$(cat package.json | jq -r '.version')
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")

COMMITS=$(git log --pretty=format:"- %s" "$LAST_TAG"..HEAD)

NEW_VERSION=$(claude -p "Given current version $CURRENT and these commits:
$COMMITS

Determine the next semantic version. Reply with ONLY the version number (e.g., 1.2.3)." | tr -d '[:space:]')

echo "Bumping from $CURRENT to $NEW_VERSION"

# Update package.json
npm version "$NEW_VERSION" --no-git-tag-version

# Generate changelog
./scripts/update-changelog.sh "$NEW_VERSION"

# Generate release notes
RELEASE_NOTES=$(claude -p "Generate release notes for v$NEW_VERSION:

Changes:
$COMMITS

Format as GitHub release notes with highlights, features, and fixes.")

# Create commit and tag
git add package.json CHANGELOG.md
git commit -m "chore: release v$NEW_VERSION"
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"

# Push
git push && git push --tags

# Create GitHub release
gh release create "v$NEW_VERSION" \
  --title "v$NEW_VERSION" \
  --notes "$RELEASE_NOTES"

echo "Released v$NEW_VERSION"
```

## Dependency Updates

### Analyze Outdated Dependencies

```bash title="scripts/analyze-deps.sh"
#!/bin/bash
# Analyze outdated dependencies and suggest updates

# Get outdated packages
OUTDATED=$(npm outdated --json 2>/dev/null || echo "{}")

if [ "$OUTDATED" = "{}" ]; then
  echo "All dependencies are up to date!"
  exit 0
fi

claude -p "Analyze these outdated npm dependencies and provide recommendations:

$OUTDATED

For each dependency:
1. Risk level (low/medium/high) for updating
2. Breaking changes to watch for
3. Recommended update order
4. Any dependencies that should be updated together

Format as a prioritized update plan."
```

### Automated Dependency PR

```yaml title=".github/workflows/deps.yml"
name: Dependency Updates

on:
  schedule:
    - cron: '0 6 * * 1'  # Weekly on Monday
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Analyze and Update
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          # Get outdated packages
          OUTDATED=$(npm outdated --json 2>/dev/null || echo "{}")

          if [ "$OUTDATED" = "{}" ]; then
            echo "All dependencies up to date"
            exit 0
          fi

          # Get Claude's recommendations
          PLAN=$(claude -p "Analyze outdated dependencies:
          $OUTDATED

          Return a JSON array of packages safe to update: [\"package1\", \"package2\"]
          Only include packages where the update is low risk.")

          # Parse and update safe packages
          echo "$PLAN" | jq -r '.[]' | while read pkg; do
            npm update "$pkg"
          done

      - name: Run Tests
        run: npm test

      - name: Create PR
        uses: peter-evans/create-pull-request@v5
        with:
          title: "chore(deps): weekly dependency updates"
          commit-message: "chore(deps): update dependencies"
          body: |
            Automated dependency updates.

            Please review the changes and ensure tests pass.
          branch: deps/weekly-update
```

### Security Audit with Recommendations

```bash title="scripts/security-audit.sh"
#!/bin/bash
# Run security audit and get fix recommendations

AUDIT=$(npm audit --json 2>/dev/null)
VULN_COUNT=$(echo "$AUDIT" | jq '.metadata.vulnerabilities.total // 0')

if [ "$VULN_COUNT" -eq 0 ]; then
  echo "No vulnerabilities found!"
  exit 0
fi

claude -p "Analyze this npm security audit and provide a remediation plan:

$AUDIT

For each vulnerability:
1. Severity and impact assessment
2. Recommended fix (update, replace, or accept risk)
3. Commands to run
4. Any breaking changes to expect

Prioritize by severity and ease of fix."
```

## Code Migration Scripts

### API Migration Helper

```bash title="scripts/migrate-api.sh"
#!/bin/bash
# Help migrate from one API version to another

OLD_PATTERN="${1:?Old API pattern required}"
NEW_PATTERN="${2:?New API pattern required}"

# Find all files using old API
FILES=$(grep -rl "$OLD_PATTERN" --include="*.ts" --include="*.js" src/)

if [ -z "$FILES" ]; then
  echo "No files found using pattern: $OLD_PATTERN"
  exit 0
fi

echo "Found files to migrate:"
echo "$FILES"

for FILE in $FILES; do
  CONTENT=$(cat "$FILE")

  claude -p "Migrate this file from the old API to the new API:

Old pattern: $OLD_PATTERN
New pattern: $NEW_PATTERN

File: $FILE
Content:
$CONTENT

Rules:
1. Replace old API calls with new equivalents
2. Update imports if needed
3. Maintain all existing functionality
4. Add any necessary type updates

Return ONLY the complete updated file content, no explanations." > "$FILE.migrated"

  # Show diff
  diff "$FILE" "$FILE.migrated" || true

  # Prompt for confirmation
  read -p "Apply changes to $FILE? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    mv "$FILE.migrated" "$FILE"
    echo "Updated $FILE"
  else
    rm "$FILE.migrated"
    echo "Skipped $FILE"
  fi
done
```

### TypeScript Migration

```bash title="scripts/migrate-to-ts.sh"
#!/bin/bash
# Convert JavaScript files to TypeScript

JS_FILE="${1:?JavaScript file required}"
TS_FILE="${JS_FILE%.js}.ts"

if [ ! -f "$JS_FILE" ]; then
  echo "File not found: $JS_FILE"
  exit 1
fi

CONTENT=$(cat "$JS_FILE")

claude -p "Convert this JavaScript file to TypeScript:

$CONTENT

Requirements:
1. Add proper type annotations
2. Use interfaces for object shapes
3. Handle null/undefined appropriately
4. Use modern TypeScript features
5. Preserve all functionality
6. Add JSDoc-style comments where helpful

Return ONLY the TypeScript code." > "$TS_FILE"

echo "Created $TS_FILE"
echo "Review and delete $JS_FILE when ready"
```

### Database Schema Migration

```bash title="scripts/generate-migration.sh"
#!/bin/bash
# Generate database migration from schema changes

OLD_SCHEMA="${1:?Old schema file required}"
NEW_SCHEMA="${2:?New schema file required}"

OLD_CONTENT=$(cat "$OLD_SCHEMA")
NEW_CONTENT=$(cat "$NEW_SCHEMA")

claude -p "Generate a database migration from the schema diff:

Old Schema:
$OLD_CONTENT

New Schema:
$NEW_CONTENT

Generate:
1. Up migration (apply changes)
2. Down migration (rollback)
3. Data migration steps if needed
4. Warnings about data loss

Use standard SQL migration format."
```

## Batch Refactoring

### Rename Across Codebase

```bash title="scripts/batch-rename.sh"
#!/bin/bash
# Intelligently rename a symbol across the codebase

OLD_NAME="${1:?Old name required}"
NEW_NAME="${2:?New name required}"
FILE_PATTERN="${3:-*.ts}"

# Find all occurrences
FILES=$(grep -rl "$OLD_NAME" --include="$FILE_PATTERN" .)

if [ -z "$FILES" ]; then
  echo "No occurrences found"
  exit 0
fi

echo "Found occurrences in:"
echo "$FILES"
echo

read -p "Proceed with refactoring? (y/n) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  exit 0
fi

for FILE in $FILES; do
  CONTENT=$(cat "$FILE")

  claude -p "Refactor this file to rename '$OLD_NAME' to '$NEW_NAME':

$CONTENT

Rules:
1. Rename all references (variables, functions, types, imports, exports)
2. Update string literals that reference the name (like error messages)
3. Update comments
4. Do NOT rename partial matches (e.g., if renaming 'user', don't change 'username')
5. Preserve all formatting

Return ONLY the updated file content." > "$FILE"

  echo "Updated $FILE"
done

echo "Refactoring complete. Run tests to verify."
```

### Extract Common Code

```bash title="scripts/extract-common.sh"
#!/bin/bash
# Find and extract duplicated code patterns

SOURCE_DIR="${1:-.}"
FILE_PATTERN="${2:-*.ts}"

# Find similar code blocks
SIMILAR=$(grep -rh "function\|const.*=.*=>" --include="$FILE_PATTERN" "$SOURCE_DIR" | sort | uniq -c | sort -rn | head -20)

claude -p "Analyze this codebase for refactoring opportunities:

Directory: $SOURCE_DIR
File pattern: $FILE_PATTERN

Most common patterns:
$SIMILAR

Suggest:
1. Code that should be extracted to shared utilities
2. Similar functions that could be consolidated
3. Repeated patterns that could use abstractions
4. Files to examine more closely

Format as an actionable refactoring plan."
```

### Update Import Statements

```bash title="scripts/update-imports.sh"
#!/bin/bash
# Update import statements after moving files

OLD_PATH="${1:?Old import path required}"
NEW_PATH="${2:?New import path required}"

FILES=$(grep -rl "from ['\"].*$OLD_PATH" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" .)

for FILE in $FILES; do
  CONTENT=$(cat "$FILE")

  claude -p "Update import statements in this file:

Old path: $OLD_PATH
New path: $NEW_PATH

File content:
$CONTENT

Update all imports from the old path to the new path.
Handle relative imports correctly based on the file location: $FILE

Return ONLY the updated file content." > "$FILE"

  echo "Updated $FILE"
done
```

## Documentation Sync

### Sync README with Code

```bash title="scripts/sync-readme.sh"
#!/bin/bash
# Keep README.md in sync with actual code

# Extract current API from code
API_EXPORTS=$(grep -h "^export" src/index.ts src/*/index.ts 2>/dev/null || echo "")
CURRENT_README=$(cat README.md)

claude -p "Update the README.md to match the current API exports:

Current README:
$CURRENT_README

Current API exports:
$API_EXPORTS

Tasks:
1. Update the API documentation section
2. Ensure all exported functions/types are documented
3. Remove documentation for removed exports
4. Keep existing examples if they're still valid
5. Preserve non-API sections (intro, installation, etc.)

Return the complete updated README.md"
```

### Generate API Documentation

```bash title="scripts/generate-api-docs.sh"
#!/bin/bash
# Generate API documentation from source code

SOURCE_DIR="${1:-src}"
OUTPUT_FILE="${2:-docs/api.md}"

# Collect all TypeScript files with exports
FILES=$(find "$SOURCE_DIR" -name "*.ts" -type f)

echo "Generating API documentation..."

for FILE in $FILES; do
  CONTENT=$(cat "$FILE")

  claude -p "Extract API documentation from this TypeScript file:

$CONTENT

Generate Markdown documentation including:
1. Module description (from top-level comments)
2. Exported functions with signatures and descriptions
3. Exported types/interfaces
4. Usage examples where JSDoc @example exists

Format for inclusion in a larger API doc." >> "$OUTPUT_FILE.tmp"
done

# Combine and format
claude -p "Combine and format this API documentation into a cohesive document:

$(cat "$OUTPUT_FILE.tmp")

Create a well-organized API reference with:
1. Table of contents
2. Logical grouping of related items
3. Consistent formatting
4. Cross-references where appropriate" > "$OUTPUT_FILE"

rm "$OUTPUT_FILE.tmp"
echo "Generated $OUTPUT_FILE"
```

### Keep Examples Updated

```bash title="scripts/validate-examples.sh"
#!/bin/bash
# Validate and update code examples in documentation

DOC_FILE="${1:?Documentation file required}"

# Extract code blocks
CODE_BLOCKS=$(grep -n '```' "$DOC_FILE" | paste - - | while read start end; do
  START_LINE=$(echo "$start" | cut -d: -f1)
  END_LINE=$(echo "$end" | cut -d: -f1)
  sed -n "${START_LINE},${END_LINE}p" "$DOC_FILE"
done)

claude -p "Review and update the code examples in this documentation:

File: $DOC_FILE

Code blocks found:
$CODE_BLOCKS

For each code block:
1. Check if the syntax is valid
2. Update deprecated API usage
3. Ensure examples are complete and runnable
4. Fix any obvious errors

Return a report of issues found and suggested fixes."
```

## Test Coverage Improvement

### Generate Missing Tests

```bash title="scripts/generate-tests.sh"
#!/bin/bash
# Generate tests for uncovered code

SOURCE_FILE="${1:?Source file required}"
TEST_FILE="${SOURCE_FILE%.ts}.test.ts"

# Get coverage data if available
COVERAGE=$(npx nyc report --reporter=json 2>/dev/null | jq ".\"$SOURCE_FILE\"" || echo "{}")

SOURCE_CONTENT=$(cat "$SOURCE_FILE")

# Check for existing tests
EXISTING_TESTS=""
if [ -f "$TEST_FILE" ]; then
  EXISTING_TESTS=$(cat "$TEST_FILE")
fi

claude -p "Generate comprehensive unit tests for this file:

Source file: $SOURCE_FILE
$SOURCE_CONTENT

Existing tests:
$EXISTING_TESTS

Coverage data:
$COVERAGE

Requirements:
1. Use Jest/Vitest syntax
2. Test all exported functions
3. Include edge cases
4. Mock external dependencies
5. Aim for high coverage
6. Don't duplicate existing tests

Return the complete test file." > "$TEST_FILE"

echo "Generated tests in $TEST_FILE"
echo "Run: npm test -- $TEST_FILE"
```

### Improve Test Quality

```bash title="scripts/improve-tests.sh"
#!/bin/bash
# Analyze and improve existing tests

TEST_FILE="${1:?Test file required}"
SOURCE_FILE="${TEST_FILE%.test.ts}.ts"

TEST_CONTENT=$(cat "$TEST_FILE")
SOURCE_CONTENT=$(cat "$SOURCE_FILE" 2>/dev/null || echo "Source not found")

claude -p "Review and improve these tests:

Test file: $TEST_FILE
$TEST_CONTENT

Source file: $SOURCE_FILE
$SOURCE_CONTENT

Analyze:
1. Missing test cases
2. Weak assertions
3. Tests that could be more specific
4. Missing edge cases
5. Opportunities for parameterized tests
6. Test organization improvements

Return the improved test file with explanatory comments for changes."
```

### Generate Integration Tests

```bash title="scripts/generate-integration-tests.sh"
#!/bin/bash
# Generate integration tests for an API endpoint

ROUTE_FILE="${1:?Route file required}"
OUTPUT_FILE="${2:-tests/integration/api.test.ts}"

ROUTE_CONTENT=$(cat "$ROUTE_FILE")

claude -p "Generate integration tests for these API routes:

$ROUTE_CONTENT

Requirements:
1. Use supertest for HTTP testing
2. Test all endpoints (GET, POST, PUT, DELETE)
3. Test authentication/authorization
4. Test validation errors
5. Test success cases
6. Test error handling
7. Include setup and teardown
8. Use realistic test data

Return a complete integration test file." > "$OUTPUT_FILE"

echo "Generated $OUTPUT_FILE"
```

## Complete Automation Setup

### Project Automation Bootstrap

```bash title="scripts/setup-automation.sh"
#!/bin/bash
# Set up all automation scripts for a project

mkdir -p scripts .github/workflows

# Create all scripts
cat > scripts/standup.sh << 'SCRIPT'
# Paste standup.sh content here
SCRIPT

cat > scripts/release.sh << 'SCRIPT'
# Paste release.sh content here
SCRIPT

# Create GitHub Actions workflows
cat > .github/workflows/ci.yml << 'WORKFLOW'
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
WORKFLOW

# Make scripts executable
chmod +x scripts/*.sh

echo "Automation scripts created in ./scripts/"
echo "GitHub Actions workflows created in ./.github/workflows/"
```

## Next Steps

- [Workflow Patterns](/guides/workflow-patterns) - Learn structured workflows
- [Scripting Guide](/guides/scripting) - Deeper scripting integration
- [CI/CD Integration](/guides/ci-cd) - Pipeline integration
- [Best Practices](/guides/best-practices) - General best practices
