---
sidebar_position: 2
title: Bulk Processing & Automation
description: Process hundreds of files automatically with Claude Code
format: md
---

# Bulk Processing & Automation

Learn how to use Claude Code's headless mode to process multiple files, automate repetitive tasks, and build powerful batch workflows.

**What you'll learn:**
- Running Claude Code non-interactively with `-p` flag
- Processing multiple files in batch
- Controlling output format for scripting
- Building real-world automation pipelines

**Time:** 15 minutes

---

## Understanding Headless Mode

Claude Code's **headless mode** lets you run commands non-interactively, perfect for:
- Processing multiple files in a loop
- CI/CD pipeline integration
- Automated code review
- Batch refactoring operations

### The `-p` (Print) Flag

The `-p` flag is your gateway to bulk processing:

```bash
claude -p "Your prompt here"
```

This sends the prompt to Claude, prints the response to stdout, and exits. No interactive session, no waiting for input.

### Basic Example

```bash
# Explain a file
claude -p "Explain what this file does: $(cat src/auth.js)"

# Analyze code from stdin
cat src/utils.js | claude -p "Find bugs in this code"

# Save output to file
claude -p "Generate unit tests for auth.js" > tests/auth.test.js
```

---

## Your First Bulk Operation

Let's process multiple files to find potential bugs:

### Step 1: Find Files to Process

```bash
# Find all JavaScript files
find src -name "*.js" -type f

# Find files modified in last 7 days
find src -name "*.js" -mtime -7

# Find files matching a pattern
find . -name "*.controller.js"
```

### Step 2: Process Each File

```bash
# Basic loop - analyze each file
for file in src/*.js; do
  echo "=== Analyzing $file ==="
  claude -p "Analyze this file for bugs and security issues: $(cat $file)"
  echo ""
done
```

### Step 3: Save Results

```bash
# Save analysis to individual files
for file in src/*.js; do
  basename=$(basename "$file" .js)
  claude -p "Analyze for bugs: $(cat $file)" > "reports/${basename}-analysis.txt"
done

# Or append all to one report
for file in src/*.js; do
  echo "## $file" >> bulk-report.md
  claude -p "Summarize this file in 2-3 sentences: $(cat $file)" >> bulk-report.md
  echo "" >> bulk-report.md
done
```

---

## Output Formats for Scripting

Control how Claude returns data using `--output-format`:

### Plain Text (Default)

```bash
claude -p "List the functions in auth.js" --output-format text
```

### JSON Output

```bash
claude -p "Analyze this code" --output-format json
```

Returns structured data:
```json
{
  "result": "The analysis text...",
  "session_id": "abc123",
  "usage": {
    "input_tokens": 150,
    "output_tokens": 200
  }
}
```

### Streaming JSON

```bash
claude -p "Process this data" --output-format stream-json
```

Returns newline-delimited JSON, useful for real-time processing.

### Structured Output with Schema

Force Claude to return data in a specific format:

```bash
claude -p "Extract all function names from auth.js" \
  --output-format json \
  --json-schema '{
    "type": "object",
    "properties": {
      "functions": {
        "type": "array",
        "items": {"type": "string"}
      }
    },
    "required": ["functions"]
  }'
```

---

## Bulk Review Processing

Here's the pattern for processing code reviews at scale:

### Review All Changed Files

```bash
#!/bin/bash
# bulk-review.sh - Review all files changed vs main branch

# Get list of changed files
changed_files=$(git diff --name-only main...HEAD -- '*.js' '*.ts')

# Process each file
for file in $changed_files; do
  if [ -f "$file" ]; then
    echo "Reviewing: $file"

    # Get the diff for context
    diff_content=$(git diff main...HEAD -- "$file")

    # Run review
    claude -p "Review this code change for bugs, security issues, and style problems:

File: $file

Changes:
$diff_content

Provide specific feedback with line numbers." --output-format json | jq -r '.result'

    echo "---"
  fi
done
```

### Bulk Security Audit

```bash
#!/bin/bash
# security-audit.sh - Scan all files for security issues

echo "# Security Audit Report" > security-report.md
echo "Generated: $(date)" >> security-report.md
echo "" >> security-report.md

for file in $(find src -name "*.js" -o -name "*.ts"); do
  echo "Scanning: $file"

  result=$(claude -p "You are a security auditor. Analyze this code for:
1. SQL injection vulnerabilities
2. XSS vulnerabilities
3. Authentication/authorization issues
4. Sensitive data exposure
5. Input validation problems

Code:
$(cat $file)

Return ONLY findings in this format:
- [SEVERITY] Issue description (line X)" --output-format text)

  if [ -n "$result" ] && [ "$result" != "No security issues found." ]; then
    echo "## $file" >> security-report.md
    echo "$result" >> security-report.md
    echo "" >> security-report.md
  fi
done

echo "Report saved to security-report.md"
```

### Bulk Documentation Generator

```bash
#!/bin/bash
# generate-docs.sh - Auto-generate documentation for all modules

for file in src/modules/*.js; do
  module_name=$(basename "$file" .js)

  echo "Documenting: $module_name"

  claude -p "Generate comprehensive JSDoc documentation for this module.
Include:
- Module description
- All function signatures with @param and @return
- Usage examples
- Any important notes

Code:
$(cat $file)" > "docs/api/${module_name}.md"
done
```

---

## Tool Permissions in Bulk Mode

Control which tools Claude can use with `--allowedTools`:

### Basic Tool Access

```bash
# Allow read and bash
claude -p "Find all TODO comments" --allowedTools "Read,Bash"

# Allow editing files
claude -p "Fix the typo in README.md" --allowedTools "Read,Edit"
```

### Prefix Matching with `:*`

```bash
# Allow any git command
claude -p "Show recent commits" --allowedTools "Bash(git:*)"

# Allow specific git operations
claude -p "Stage and commit changes" \
  --allowedTools "Bash(git add:*),Bash(git commit:*),Bash(git status:*)"
```

### Full Automation Mode

```bash
# Allow all common tools
claude -p "Run tests and fix any failures" \
  --allowedTools "Read,Edit,Bash" \
  --permission-mode acceptEdits
```

---

## Real-World Bulk Workflows

### 1. Migration Helper

Migrate all files from one API to another:

```bash
#!/bin/bash
# migrate-api.sh - Migrate from old API to new API

for file in $(grep -rl "oldApi.call" src/); do
  echo "Migrating: $file"

  claude -p "Migrate this file from oldApi to newApi.

Rules:
- oldApi.call(x) -> newApi.request(x)
- oldApi.get(x) -> newApi.fetch(x)
- Update all imports
- Preserve all other code exactly

File content:
$(cat $file)

Return ONLY the migrated code, no explanations." \
    --allowedTools "Read,Edit" \
    --output-format text > "${file}.migrated"

  # Review before replacing
  diff "$file" "${file}.migrated"
done
```

### 2. Test Coverage Booster

Generate missing tests:

```bash
#!/bin/bash
# boost-coverage.sh - Generate tests for uncovered functions

# Get uncovered functions from coverage report
uncovered=$(cat coverage/lcov.info | grep -A1 "FN:" | grep "FNH:0" -B1 | grep "FN:" | cut -d',' -f2)

for func in $uncovered; do
  # Find the file containing this function
  file=$(grep -rl "function $func\|const $func" src/)

  if [ -n "$file" ]; then
    echo "Generating tests for: $func in $file"

    claude -p "Generate comprehensive unit tests for the '$func' function.

Source code:
$(cat $file)

Requirements:
- Use Jest syntax
- Cover happy path and edge cases
- Include error scenarios
- Match existing test style in the project" >> "tests/${func}.test.js"
  fi
done
```

### 3. Dependency Update Analyzer

```bash
#!/bin/bash
# analyze-updates.sh - Analyze impact of dependency updates

outdated=$(npm outdated --json)

echo "$outdated" | jq -r 'keys[]' | while read package; do
  current=$(echo "$outdated" | jq -r ".\"$package\".current")
  latest=$(echo "$outdated" | jq -r ".\"$package\".latest")

  echo "Analyzing: $package ($current -> $latest)"

  # Find files using this package
  files=$(grep -rl "from ['\"]$package" src/ || true)

  if [ -n "$files" ]; then
    claude -p "Analyze the impact of updating $package from $current to $latest.

Files using this package:
$files

Key questions:
1. What breaking changes exist between versions?
2. Which files need updates?
3. What's the migration effort (low/medium/high)?

Be specific about code changes needed." --output-format text
  fi
done
```

### 4. Codebase Health Check

```bash
#!/bin/bash
# health-check.sh - Weekly codebase health report

report="health-report-$(date +%Y%m%d).md"

echo "# Codebase Health Report" > $report
echo "Date: $(date)" >> $report
echo "" >> $report

# Complexity analysis
echo "## Complexity Analysis" >> $report
for file in $(find src -name "*.js" | head -20); do
  result=$(claude -p "Rate the complexity of this code from 1-10 and explain why in one sentence:
$(cat $file)" --output-format text)
  echo "- **$file**: $result" >> $report
done

# Dead code detection
echo "" >> $report
echo "## Potential Dead Code" >> $report
claude -p "Analyze the exports and imports in this codebase to find potentially unused code:
$(find src -name "*.js" -exec grep -l "export" {} \; | head -10 | xargs cat)" >> $report

# Technical debt
echo "" >> $report
echo "## Technical Debt" >> $report
claude -p "Find all TODO, FIXME, HACK, and XXX comments in this codebase and prioritize them:
$(grep -rn "TODO\|FIXME\|HACK\|XXX" src/ | head -50)" >> $report

echo "Report saved to $report"
```

---

## Performance Tips

### Parallel Processing

Process files in parallel using `xargs` or GNU `parallel`:

```bash
# Using xargs (4 parallel jobs)
find src -name "*.js" | xargs -P 4 -I {} claude -p "Analyze: $(cat {})"

# Using GNU parallel
find src -name "*.js" | parallel -j 4 'claude -p "Analyze: $(cat {})"'
```

### Rate Limiting

Add delays to avoid rate limits:

```bash
for file in src/*.js; do
  claude -p "Analyze: $(cat $file)"
  sleep 2  # Wait 2 seconds between requests
done
```

### Token Management

Truncate large files to stay within limits:

```bash
# Only send first 500 lines
head -500 large-file.js | claude -p "Analyze this code"

# Or use Claude to extract relevant parts first
claude -p "Extract only the function definitions from: $(cat large-file.js)" | \
  claude -p "Analyze these functions for bugs"
```

---

## Session Continuation

Continue conversations across batch operations:

```bash
# Start analysis
session_id=$(claude -p "I'm going to analyze multiple files for security issues. Acknowledge." \
  --output-format json | jq -r '.session_id')

# Continue with same session
for file in src/*.js; do
  claude -p "Analyze this file: $(cat $file)" --resume "$session_id"
done

# Get final summary
claude -p "Summarize all the security issues you found across all files." --resume "$session_id"
```

---

## Next Steps

You now have the tools to process hundreds of files automatically. Try these next:

1. **[Parallel Development](/tutorials/parallel-agents)** - Run multiple Claude agents at once
2. **[Automated Code Review](/tutorials/automated-review)** - Set up bulk PR reviews
3. **[Headless CI/CD](/tutorials/headless-cicd)** - Integrate into your pipeline

---

## Quick Reference

```bash
# Basic headless mode
claude -p "prompt"

# With output format
claude -p "prompt" --output-format json

# With tool permissions
claude -p "prompt" --allowedTools "Read,Edit,Bash"

# Accept all edits
claude -p "prompt" --permission-mode acceptEdits

# Continue session
claude -p "prompt" --continue
claude -p "prompt" --resume "session-id"

# Structured output
claude -p "prompt" --output-format json --json-schema '{"type":"object"}'
```
