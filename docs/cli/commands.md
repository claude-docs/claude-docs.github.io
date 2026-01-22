---
sidebar_position: 2
title: Commands
description: Complete reference for Claude Code CLI commands
---

# CLI Commands

Complete reference for Claude Code command-line options.

## Startup Commands

### Basic Start

```bash
claude                    # Start interactive session
claude "prompt"           # Start with initial prompt
claude -c                 # Continue last conversation
```

### Model Selection

```bash
claude --model claude-opus-4-5-20251101
claude --model claude-sonnet-4-5-20250929
claude --model claude-haiku-4-5-20251001

# Short forms
claude --model opus
claude --model sonnet
claude --model haiku
```

### Output Formats

```bash
claude -p "prompt"                      # Headless mode
claude -p "prompt" --json               # JSON output
claude -p "prompt" --output-format stream-json  # Streaming JSON
```

## Tool Control

### Allow/Deny Tools

```bash
# Allow specific tools
claude --allowedTools "Bash" "Read" "Write"

# Deny specific tools
claude --disallowedTools "WebFetch" "WebSearch"
```

### Permission Modes

```bash
# Skip permission prompts for trusted tools
claude --dangerously-skip-permissions

# Require approval for all actions
claude --require-approval
```

## Debug and Diagnostics

```bash
claude doctor       # Run diagnostics
claude --verbose    # Detailed logging
claude --mcp-debug  # Debug MCP connections
```

## Configuration Commands

```bash
claude config          # Open settings
claude config --show   # Display current settings
claude config --reset  # Reset to defaults
```

## Session Management

```bash
claude logout     # Sign out
claude --version  # Show version
claude --help     # Show help
```

## Pipeline Usage

### Input from Stdin

```bash
cat code.py | claude -p "review this code"
```

### Output to File

```bash
claude -p "write a README" > README.md
```

### Chaining Commands

```bash
claude -p "generate test data" --json | jq '.output' > test-data.json
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | - | API key for authentication |
| `CLAUDE_CODE_USE_BEDROCK` | 0 | Use AWS Bedrock |
| `CLAUDE_CODE_USE_VERTEX` | 0 | Use Google Vertex |
| `CLAUDE_MODEL` | sonnet | Default model |
| `CLAUDE_CONFIG_DIR` | ~/.claude | Config directory |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Authentication error |
| 3 | Configuration error |
| 130 | User interrupted (Ctrl+C) |

## Examples

### Code Review

```bash
claude "review the changes in the last commit for security issues"
```

### File Generation

```bash
claude -p "create a Dockerfile for a Node.js app" > Dockerfile
```

### Batch Processing

```bash
for file in src/*.ts; do
  claude -p "add JSDoc comments to $file" --json >> results.json
done
```

### CI Integration

```bash
# In GitHub Actions
- name: Code Review
  run: |
    claude -p "review PR changes" --json > review.json
    cat review.json
```

## Next Steps

- [Learn slash commands](/cli/slash-commands)
- [Configure settings](/cli/configuration)
- [Set up CI/CD](/guides/ci-cd)
