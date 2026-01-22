---
sidebar_position: 5
title: Advanced CLI Techniques
description: Power user techniques for Claude Code CLI automation and scripting
---

# Advanced CLI Techniques

Master Claude Code's command-line interface with these power user techniques for automation, scripting, and advanced workflows.

## Power User Flags

### Flag Combinations

Combine flags for precise control:

```bash
# Full automation mode
claude -p "generate API docs" \
  --model haiku \
  --json \
  --allowedTools "Read" "Grep" \
  --max-turns 10

# Debug mode with verbose logging
claude --verbose --mcp-debug "diagnose the test failures"

# Strict permissions with specific model
claude --model opus \
  --dangerously-skip-permissions \
  --allowedTools "Read" "Write" "Bash(npm test)"
```

### Output Format Control

```bash
# JSON output for parsing
claude -p "list all TODO comments" --json

# Streaming JSON for real-time processing
claude -p "refactor large file" --output-format stream-json

# Text output (default for interactive)
claude -p "explain this error" --output-format text
```

### Turn Limits

Control conversation depth:

```bash
# Limit autonomous operation
claude -p "fix all lint errors" --max-turns 5

# Single response (no tool use)
claude -p "explain this code" --max-turns 1
```

## Piping and Chaining

### Input Piping

Pipe content directly to Claude:

```bash
# Pipe file contents
cat src/utils.ts | claude -p "review this code for bugs"

# Pipe command output
git diff HEAD~3 | claude -p "summarize these changes"

# Pipe error logs
npm test 2>&1 | claude -p "analyze these test failures"

# Pipe multiple files
cat src/*.ts | claude -p "find inconsistent naming conventions"
```

### Output Piping

Process Claude's output:

```bash
# Save to file
claude -p "write a Dockerfile" > Dockerfile

# Append to file
claude -p "add more test cases" >> tests.md

# Pipe to another command
claude -p "list files to delete" --json | xargs rm
```

### Command Chaining

Chain operations together:

```bash
# Sequential operations
claude -p "fix the bug" && npm test && git commit -m "fix: resolved issue"

# Conditional execution
claude -p "generate migration" --json && \
  npm run migrate || \
  echo "Migration failed"

# Pipeline with error handling
claude -p "review code" --json 2>/dev/null | jq '.output' || echo "Review failed"
```

## JSON Output Parsing with jq

### Basic Extraction

```bash
# Get just the output text
claude -p "explain this" --json | jq -r '.result'

# Get token usage
claude -p "query" --json | jq '.usage'

# Get cost estimate
claude -p "query" --json | jq '.cost_usd'
```

### Complex Queries

```bash
# Extract code blocks from response
claude -p "write a function" --json | jq -r '.result' | sed -n '/```/,/```/p'

# Get tool calls made
claude -p "fix the tests" --json | jq '.messages[] | select(.role == "assistant") | .tool_calls'

# Filter by message type
claude -p "debug" --json | jq '[.messages[] | select(.type == "tool_result")]'
```

### Structured Data Processing

```bash
# Parse into CSV
claude -p "list all functions with their line counts" --json | \
  jq -r '.result | split("\n")[] | @csv'

# Create report
claude -p "analyze codebase" --json | \
  jq '{
    summary: .result,
    tokens: .usage.total_tokens,
    cost: .cost_usd,
    timestamp: now | todate
  }' > report.json
```

### Error Handling with jq

```bash
# Safe extraction with defaults
claude -p "query" --json | jq -r '.result // "No result"'

# Check for errors
claude -p "query" --json | jq -e '.error' && echo "Error occurred"

# Validate response
claude -p "query" --json | jq -e 'select(.result != null and .result != "")'
```

## Headless Automation Patterns

### Script Template

```bash
#!/bin/bash
set -euo pipefail

# Configuration
MODEL="${CLAUDE_MODEL:-sonnet}"
MAX_TURNS="${MAX_TURNS:-10}"
OUTPUT_DIR="${OUTPUT_DIR:-./output}"

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Run Claude with error handling
run_claude() {
    local prompt="$1"
    local output_file="$2"

    claude -p "$prompt" \
        --model "$MODEL" \
        --max-turns "$MAX_TURNS" \
        --json > "$output_file" 2>&1

    if jq -e '.error' "$output_file" > /dev/null 2>&1; then
        echo "Error: $(jq -r '.error' "$output_file")"
        return 1
    fi
}

# Main execution
run_claude "your prompt here" "$OUTPUT_DIR/result.json"
```

### Batch Processing

```bash
#!/bin/bash

# Process multiple files
process_files() {
    local pattern="$1"
    local prompt_template="$2"

    for file in $pattern; do
        echo "Processing: $file"
        local prompt=$(echo "$prompt_template" | sed "s|{FILE}|$file|g")

        claude -p "$prompt" --json > "${file%.ts}.analysis.json"
    done
}

# Usage
process_files "src/**/*.ts" "Review {FILE} for security issues"
```

### Parallel Execution

```bash
#!/bin/bash

# Run multiple Claude instances in parallel
parallel_review() {
    local files=("$@")
    local pids=()

    for file in "${files[@]}"; do
        claude -p "review $file" --json > "${file}.review.json" &
        pids+=($!)
    done

    # Wait for all to complete
    for pid in "${pids[@]}"; do
        wait $pid
    done
}

# With GNU parallel
find src -name "*.ts" | parallel -j4 'claude -p "review {}" --json > {}.review.json'
```

### Retry Logic

```bash
#!/bin/bash

retry_claude() {
    local prompt="$1"
    local max_attempts="${2:-3}"
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        echo "Attempt $attempt of $max_attempts"

        if claude -p "$prompt" --json > output.json 2>&1; then
            if ! jq -e '.error' output.json > /dev/null 2>&1; then
                return 0
            fi
        fi

        attempt=$((attempt + 1))
        sleep $((attempt * 2))  # Exponential backoff
    done

    return 1
}
```

## Session Management Tricks

### Continue Previous Sessions

```bash
# Continue last conversation
claude -c

# Continue with additional context
claude -c "now also add error handling"

# Continue in headless mode
claude -c -p "run the tests" --json
```

### Session Inspection

```bash
# Find recent sessions
ls -la ~/.claude/sessions/

# Export session for backup
claude -c -p "summarize our conversation" --json > session-summary.json
```

### Multi-Session Workflows

```bash
#!/bin/bash

# Start a new session for each feature
work_on_feature() {
    local feature="$1"

    # Clear any existing context
    claude -p "Starting work on: $feature" --json

    # Continue in that session
    claude -c -p "implement the feature"
    claude -c -p "write tests"
    claude -c -p "update documentation"
}
```

### Context Preservation

```bash
# Save important context to CLAUDE.md
claude -c -p "Add to memory: the database uses PostgreSQL 15"

# Start session with specific context
echo "Focus on performance optimization" | claude -p "$(cat -)"
```

## Environment Variable Mastery

### Core Variables

```bash
# Authentication
export ANTHROPIC_API_KEY="sk-ant-..."

# Default model
export CLAUDE_MODEL="claude-sonnet-4-5-20250929"

# Configuration directory
export CLAUDE_CONFIG_DIR="$HOME/.claude-custom"

# Cloud provider backends
export CLAUDE_CODE_USE_BEDROCK=1
export CLAUDE_CODE_USE_VERTEX=1
```

### AWS Bedrock Configuration

```bash
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION="us-east-1"
export AWS_PROFILE="production"

# Or with explicit credentials
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
```

### Google Vertex Configuration

```bash
export CLAUDE_CODE_USE_VERTEX=1
export GOOGLE_CLOUD_PROJECT="my-project"
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
export GOOGLE_CLOUD_REGION="us-central1"
```

### Environment-Based Configuration

```bash
# Development environment
dev_claude() {
    CLAUDE_MODEL=haiku \
    CLAUDE_CONFIG_DIR=~/.claude-dev \
    claude "$@"
}

# Production environment
prod_claude() {
    CLAUDE_MODEL=opus \
    CLAUDE_CONFIG_DIR=~/.claude-prod \
    claude "$@"
}

# Usage
dev_claude -p "quick test"
prod_claude -p "critical review"
```

### Dynamic Configuration

```bash
#!/bin/bash

# Load environment from file
if [ -f .claude-env ]; then
    export $(grep -v '^#' .claude-env | xargs)
fi

# Override based on context
if [ "$CI" = "true" ]; then
    export CLAUDE_MODEL="haiku"
    export MAX_TURNS=5
fi

claude -p "$@"
```

## Shell Integration

### Bash Completion

Add to `~/.bashrc`:

```bash
# Claude Code completion
_claude_completions() {
    local cur="${COMP_WORDS[COMP_CWORD]}"
    local prev="${COMP_WORDS[COMP_CWORD-1]}"

    case "$prev" in
        --model)
            COMPREPLY=($(compgen -W "opus sonnet haiku claude-opus-4-5-20251101 claude-sonnet-4-5-20250929" -- "$cur"))
            return
            ;;
        --output-format)
            COMPREPLY=($(compgen -W "json text stream-json" -- "$cur"))
            return
            ;;
        --allowedTools|--disallowedTools)
            COMPREPLY=($(compgen -W "Bash Read Write Edit Glob Grep WebFetch WebSearch" -- "$cur"))
            return
            ;;
    esac

    if [[ "$cur" == -* ]]; then
        COMPREPLY=($(compgen -W "-c --continue -p --print --model --json --verbose --mcp-debug --help --version --max-turns --allowedTools --disallowedTools --output-format --dangerously-skip-permissions" -- "$cur"))
    fi
}
complete -F _claude_completions claude
```

### Zsh Completion

Add to `~/.zshrc`:

```zsh
# Claude Code completion
_claude() {
    local -a commands
    local -a options

    options=(
        '-c[Continue last conversation]'
        '--continue[Continue last conversation]'
        '-p[Print mode (headless)]'
        '--print[Print mode (headless)]'
        '--model[Specify model]:model:(opus sonnet haiku)'
        '--json[JSON output]'
        '--verbose[Verbose logging]'
        '--mcp-debug[Debug MCP connections]'
        '--max-turns[Maximum turns]:number'
        '--output-format[Output format]:format:(json text stream-json)'
        '--allowedTools[Allowed tools]:tools'
        '--disallowedTools[Disallowed tools]:tools'
        '--dangerously-skip-permissions[Skip permission prompts]'
        '--help[Show help]'
        '--version[Show version]'
    )

    _arguments -s $options
}
compdef _claude claude
```

### Shell Aliases

```bash
# Quick shortcuts
alias c='claude'
alias cc='claude -c'
alias cq='claude -p'

# Model-specific aliases
alias copus='claude --model opus'
alias csonnet='claude --model sonnet'
alias chaiku='claude --model haiku'

# Task-specific aliases
alias creview='claude -p "review the last commit" --json'
alias ctest='claude -p "run tests and fix failures"'
alias cdocs='claude -p "update documentation"'

# JSON output aliases
alias cj='claude -p --json'
alias cjs='claude -p --output-format stream-json'
```

### Shell Functions

```bash
# Interactive code review
cr() {
    local file="${1:-.}"
    claude "review $file for bugs and improvements"
}

# Quick explain
cexplain() {
    claude -p "explain: $*"
}

# Git commit with Claude message
cgit() {
    local diff=$(git diff --cached)
    if [ -z "$diff" ]; then
        echo "No staged changes"
        return 1
    fi

    local message=$(echo "$diff" | claude -p "write a conventional commit message for these changes" --json | jq -r '.result')

    echo "Proposed message: $message"
    read -p "Use this message? [y/N] " confirm

    if [ "$confirm" = "y" ]; then
        git commit -m "$message"
    fi
}

# Debug helper
cdebug() {
    local error_log="$1"
    if [ -f "$error_log" ]; then
        cat "$error_log" | claude -p "analyze this error and suggest fixes"
    else
        echo "$*" | claude -p "debug this error: $(cat -)"
    fi
}

# Code generation
cgen() {
    local output_file="$1"
    shift
    claude -p "$*" --json | jq -r '.result' > "$output_file"
    echo "Generated: $output_file"
}
```

### Integration with fzf

```bash
# Interactive file selection for review
creview_fzf() {
    local file=$(find . -type f -name "*.ts" -o -name "*.js" | fzf --preview 'head -50 {}')
    if [ -n "$file" ]; then
        claude "review $file"
    fi
}

# Select from recent sessions
csession_fzf() {
    local session=$(ls -t ~/.claude/sessions/ | fzf)
    if [ -n "$session" ]; then
        claude -c
    fi
}
```

### Tmux Integration

```bash
# Run Claude in a new tmux pane
ctmux() {
    tmux split-window -h "claude $*; read -p 'Press enter to close'"
}

# Background Claude task
cbg() {
    tmux new-window -d -n "claude" "claude $*"
    echo "Running in tmux window 'claude'"
}
```

## Advanced Scripting Patterns

### Conditional Model Selection

```bash
#!/bin/bash

select_model() {
    local task_type="$1"

    case "$task_type" in
        "review"|"architecture"|"security")
            echo "opus"
            ;;
        "code"|"refactor"|"debug")
            echo "sonnet"
            ;;
        "simple"|"format"|"typo")
            echo "haiku"
            ;;
        *)
            echo "sonnet"
            ;;
    esac
}

MODEL=$(select_model "$TASK_TYPE")
claude --model "$MODEL" -p "$PROMPT"
```

### Progress Tracking

```bash
#!/bin/bash

# Track multi-step operations
run_with_progress() {
    local steps=("$@")
    local total=${#steps[@]}
    local current=0

    for step in "${steps[@]}"; do
        current=$((current + 1))
        echo "[$current/$total] $step"

        if ! claude -p "$step" --json > "step_${current}.json"; then
            echo "Failed at step $current"
            return 1
        fi
    done

    echo "All steps completed"
}

run_with_progress \
    "analyze the codebase structure" \
    "identify areas for improvement" \
    "implement the improvements" \
    "write tests for changes"
```

### Result Aggregation

```bash
#!/bin/bash

# Aggregate results from multiple Claude calls
aggregate_reviews() {
    local output_file="$1"
    shift
    local files=("$@")

    echo '{"reviews": [' > "$output_file"

    local first=true
    for file in "${files[@]}"; do
        if [ "$first" = false ]; then
            echo ',' >> "$output_file"
        fi
        first=false

        claude -p "review $file" --json | \
            jq "{file: \"$file\", review: .result}" >> "$output_file"
    done

    echo ']}' >> "$output_file"
}

# Usage
aggregate_reviews reviews.json src/*.ts
```

## Next Steps

- [CLI Commands Reference](/cli/commands)
- [Prompt Engineering](/cli/prompting)
- [CI/CD Integration](/guides/ci-cd)
- [Cost Optimization](/guides/cost-optimization)
