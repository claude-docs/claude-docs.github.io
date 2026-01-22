---
sidebar_position: 8
title: Scripting Guide
description: Integrate Claude Code with scripts and task runners
---

# Scripting Guide

Integrate Claude Code into your development workflow with scripts, task runners, and automation tools.

## Bash Scripts with Claude

### Basic Script Structure

```bash title="scripts/example.sh"
#!/bin/bash
# Basic Claude Code script template

set -e  # Exit on error

# Configuration
ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:?ANTHROPIC_API_KEY required}"

# Run Claude with a prompt
claude -p "Your prompt here" --json
```

### Capturing Output

```bash title="scripts/capture-output.sh"
#!/bin/bash
# Capture and process Claude output

# Simple text output
RESULT=$(claude -p "Explain this code briefly" 2>/dev/null)
echo "$RESULT"

# JSON output for parsing
JSON_RESULT=$(claude -p "List 5 improvements" --json)
echo "$JSON_RESULT" | jq '.result'

# Stream output for long tasks
claude -p "Generate documentation" --output-format stream-json | while read -r line; do
  echo "$line" | jq -r '.content // empty'
done
```

### Error Handling

```bash title="scripts/error-handling.sh"
#!/bin/bash
# Robust error handling for Claude scripts

run_claude() {
  local prompt="$1"
  local max_retries="${2:-3}"
  local retry_delay="${3:-5}"

  local attempt=1
  while [ $attempt -le $max_retries ]; do
    if RESULT=$(claude -p "$prompt" --json 2>&1); then
      echo "$RESULT"
      return 0
    fi

    echo "Attempt $attempt failed, retrying in ${retry_delay}s..." >&2
    sleep "$retry_delay"
    ((attempt++))
  done

  echo "Failed after $max_retries attempts" >&2
  return 1
}

# Usage
if OUTPUT=$(run_claude "Generate a summary" 3 5); then
  echo "Success: $OUTPUT"
else
  echo "Failed to get response"
  exit 1
fi
```

### Working with Files

```bash title="scripts/file-processing.sh"
#!/bin/bash
# Process files with Claude

process_file() {
  local file="$1"
  local action="${2:-review}"

  if [ ! -f "$file" ]; then
    echo "File not found: $file" >&2
    return 1
  fi

  local content
  content=$(cat "$file")

  case "$action" in
    review)
      claude -p "Review this code for issues:

$content

Provide specific, actionable feedback."
      ;;
    document)
      claude -p "Generate documentation for this code:

$content

Include function descriptions, parameters, and examples."
      ;;
    test)
      claude -p "Generate unit tests for this code:

$content

Use Jest/Vitest syntax with comprehensive test cases."
      ;;
    *)
      echo "Unknown action: $action" >&2
      return 1
      ;;
  esac
}

# Process multiple files
for file in "$@"; do
  echo "Processing: $file"
  process_file "$file" "review"
  echo "---"
done
```

### Interactive Scripts

```bash title="scripts/interactive.sh"
#!/bin/bash
# Interactive Claude assistant script

echo "Claude Code Assistant"
echo "Type 'exit' to quit"
echo ""

while true; do
  read -p "> " -r prompt

  if [ "$prompt" = "exit" ]; then
    echo "Goodbye!"
    break
  fi

  if [ -z "$prompt" ]; then
    continue
  fi

  claude -p "$prompt"
  echo ""
done
```

### Parallel Processing

```bash title="scripts/parallel.sh"
#!/bin/bash
# Process multiple items in parallel

process_item() {
  local item="$1"
  local output_dir="$2"

  claude -p "Process: $item" --json > "$output_dir/$(basename "$item").json"
}

export -f process_item

ITEMS=("item1" "item2" "item3" "item4")
OUTPUT_DIR="./output"
mkdir -p "$OUTPUT_DIR"

# Process in parallel (4 at a time)
printf '%s\n' "${ITEMS[@]}" | xargs -P 4 -I {} bash -c 'process_item "$@"' _ {} "$OUTPUT_DIR"

echo "Processing complete. Results in $OUTPUT_DIR"
```

## Python Automation Scripts

### Basic Python Integration

```python title="scripts/claude_helper.py"
#!/usr/bin/env python3
"""Claude Code Python integration utilities."""

import json
import subprocess
import sys
from typing import Optional


def run_claude(
    prompt: str,
    model: str = "sonnet",
    json_output: bool = True,
    timeout: int = 300
) -> dict:
    """Run Claude Code and return the result."""
    cmd = ["claude", "-p", prompt]

    if json_output:
        cmd.append("--json")

    cmd.extend(["--model", model])

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout,
            check=True
        )

        if json_output:
            return json.loads(result.stdout)
        return {"result": result.stdout}

    except subprocess.TimeoutExpired:
        return {"error": "Request timed out"}
    except subprocess.CalledProcessError as e:
        return {"error": e.stderr}
    except json.JSONDecodeError:
        return {"error": "Invalid JSON response", "raw": result.stdout}


def review_file(filepath: str) -> dict:
    """Review a file for issues."""
    with open(filepath, 'r') as f:
        content = f.read()

    prompt = f"""Review this code for issues:

{content}

Identify:
1. Bugs or errors
2. Security issues
3. Performance problems
4. Code style issues

Format as JSON with structure:
{{"issues": [{{"severity": "high|medium|low", "line": N, "description": "..."}}]}}
"""

    return run_claude(prompt)


def generate_tests(filepath: str, framework: str = "pytest") -> str:
    """Generate tests for a file."""
    with open(filepath, 'r') as f:
        content = f.read()

    prompt = f"""Generate {framework} tests for this code:

{content}

Include:
- Unit tests for all functions
- Edge cases
- Mocking where needed

Return only the test code."""

    result = run_claude(prompt, json_output=False)
    return result.get("result", "")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python claude_helper.py <prompt>")
        sys.exit(1)

    prompt = " ".join(sys.argv[1:])
    result = run_claude(prompt)
    print(json.dumps(result, indent=2))
```

### Async Python Integration

```python title="scripts/claude_async.py"
#!/usr/bin/env python3
"""Async Claude Code integration for parallel processing."""

import asyncio
import json
from pathlib import Path
from typing import List


async def run_claude_async(prompt: str, timeout: int = 300) -> dict:
    """Run Claude Code asynchronously."""
    proc = await asyncio.create_subprocess_exec(
        "claude", "-p", prompt, "--json",
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )

    try:
        stdout, stderr = await asyncio.wait_for(
            proc.communicate(),
            timeout=timeout
        )

        if proc.returncode == 0:
            return json.loads(stdout.decode())
        return {"error": stderr.decode()}

    except asyncio.TimeoutError:
        proc.kill()
        return {"error": "Request timed out"}


async def process_files_parallel(
    files: List[Path],
    action: str,
    max_concurrent: int = 5
) -> List[dict]:
    """Process multiple files in parallel."""
    semaphore = asyncio.Semaphore(max_concurrent)

    async def process_one(filepath: Path) -> dict:
        async with semaphore:
            content = filepath.read_text()
            prompt = f"{action}:\n\n{content}"
            result = await run_claude_async(prompt)
            return {"file": str(filepath), "result": result}

    tasks = [process_one(f) for f in files]
    return await asyncio.gather(*tasks)


async def main():
    """Example usage."""
    # Process all Python files in parallel
    files = list(Path("src").glob("**/*.py"))

    results = await process_files_parallel(
        files,
        action="Review this code for issues",
        max_concurrent=3
    )

    for result in results:
        print(f"\n=== {result['file']} ===")
        print(json.dumps(result['result'], indent=2))


if __name__ == "__main__":
    asyncio.run(main())
```

### Python CLI Tool

```python title="scripts/claude_cli.py"
#!/usr/bin/env python3
"""CLI tool for common Claude Code operations."""

import argparse
import json
import subprocess
import sys
from pathlib import Path


def claude_command(prompt: str, **kwargs) -> dict:
    """Execute a Claude command."""
    cmd = ["claude", "-p", prompt, "--json"]

    if kwargs.get("model"):
        cmd.extend(["--model", kwargs["model"]])

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode == 0:
        return json.loads(result.stdout)
    return {"error": result.stderr}


def cmd_review(args):
    """Review code files."""
    for filepath in args.files:
        path = Path(filepath)
        if not path.exists():
            print(f"File not found: {filepath}", file=sys.stderr)
            continue

        content = path.read_text()
        prompt = f"Review this {path.suffix[1:]} code:\n\n{content}"

        result = claude_command(prompt, model=args.model)
        print(f"\n=== {filepath} ===")
        print(result.get("result", result.get("error", "Unknown error")))


def cmd_explain(args):
    """Explain code."""
    content = Path(args.file).read_text()
    prompt = f"""Explain this code:

{content}

Cover:
- What it does
- How it works
- Key concepts used"""

    result = claude_command(prompt, model=args.model)
    print(result.get("result", result.get("error")))


def cmd_refactor(args):
    """Suggest refactoring."""
    content = Path(args.file).read_text()
    prompt = f"""Suggest refactoring for this code:

{content}

Focus on: {args.focus if args.focus else 'general improvements'}"""

    result = claude_command(prompt, model=args.model)
    print(result.get("result", result.get("error")))


def main():
    parser = argparse.ArgumentParser(description="Claude Code CLI helper")
    parser.add_argument("--model", default="sonnet", help="Model to use")

    subparsers = parser.add_subparsers(dest="command", required=True)

    # Review command
    review_parser = subparsers.add_parser("review", help="Review code files")
    review_parser.add_argument("files", nargs="+", help="Files to review")
    review_parser.set_defaults(func=cmd_review)

    # Explain command
    explain_parser = subparsers.add_parser("explain", help="Explain code")
    explain_parser.add_argument("file", help="File to explain")
    explain_parser.set_defaults(func=cmd_explain)

    # Refactor command
    refactor_parser = subparsers.add_parser("refactor", help="Suggest refactoring")
    refactor_parser.add_argument("file", help="File to refactor")
    refactor_parser.add_argument("--focus", help="Focus area")
    refactor_parser.set_defaults(func=cmd_refactor)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
```

## Node.js Automation

### Basic Node.js Integration

```javascript title="scripts/claude.js"
#!/usr/bin/env node
/**
 * Claude Code Node.js integration
 */

const { spawn } = require('child_process');

/**
 * Run Claude Code with a prompt
 * @param {string} prompt - The prompt to send
 * @param {Object} options - Options
 * @returns {Promise<Object>} The result
 */
async function runClaude(prompt, options = {}) {
  const args = ['-p', prompt, '--json'];

  if (options.model) {
    args.push('--model', options.model);
  }

  return new Promise((resolve, reject) => {
    const proc = spawn('claude', args);
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        try {
          resolve(JSON.parse(stdout));
        } catch (e) {
          resolve({ result: stdout });
        }
      } else {
        reject(new Error(stderr || `Process exited with code ${code}`));
      }
    });

    proc.on('error', reject);

    // Handle timeout
    if (options.timeout) {
      setTimeout(() => {
        proc.kill();
        reject(new Error('Request timed out'));
      }, options.timeout);
    }
  });
}

/**
 * Review a file
 * @param {string} filepath - Path to file
 * @returns {Promise<Object>} Review results
 */
async function reviewFile(filepath) {
  const fs = require('fs');
  const content = fs.readFileSync(filepath, 'utf-8');

  return runClaude(`Review this code for issues:

${content}

Identify bugs, security issues, and improvements.`);
}

/**
 * Generate documentation
 * @param {string} filepath - Path to file
 * @returns {Promise<string>} Generated documentation
 */
async function generateDocs(filepath) {
  const fs = require('fs');
  const content = fs.readFileSync(filepath, 'utf-8');

  const result = await runClaude(`Generate documentation for this code:

${content}

Include JSDoc comments and a README section.`);

  return result.result;
}

// CLI interface
if (require.main === module) {
  const [, , prompt] = process.argv;

  if (!prompt) {
    console.error('Usage: node claude.js "your prompt"');
    process.exit(1);
  }

  runClaude(prompt)
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}

module.exports = { runClaude, reviewFile, generateDocs };
```

### TypeScript Integration

```typescript title="scripts/claude.ts"
#!/usr/bin/env ts-node
/**
 * Claude Code TypeScript integration
 */

import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface ClaudeOptions {
  model?: 'opus' | 'sonnet' | 'haiku';
  timeout?: number;
  json?: boolean;
}

interface ClaudeResult {
  result?: string;
  error?: string;
  cost?: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Run Claude Code with a prompt
 */
export async function runClaude(
  prompt: string,
  options: ClaudeOptions = {}
): Promise<ClaudeResult> {
  const args = ['-p', prompt];

  if (options.json !== false) {
    args.push('--json');
  }

  if (options.model) {
    args.push('--model', options.model);
  }

  return new Promise((resolve, reject) => {
    const proc = spawn('claude', args);
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    proc.on('close', (code: number) => {
      if (code === 0) {
        try {
          resolve(JSON.parse(stdout));
        } catch {
          resolve({ result: stdout });
        }
      } else {
        reject(new Error(stderr || `Process exited with code ${code}`));
      }
    });

    if (options.timeout) {
      setTimeout(() => {
        proc.kill();
        reject(new Error('Request timed out'));
      }, options.timeout);
    }
  });
}

/**
 * Review TypeScript/JavaScript files
 */
export async function reviewCode(
  filepath: string
): Promise<{ issues: Array<{ severity: string; description: string }> }> {
  const content = fs.readFileSync(filepath, 'utf-8');
  const ext = path.extname(filepath);

  const result = await runClaude(`Review this ${ext} code:

${content}

Return JSON: {"issues": [{"severity": "high|medium|low", "description": "..."}]}`);

  try {
    return JSON.parse(result.result || '{"issues": []}');
  } catch {
    return { issues: [] };
  }
}

/**
 * Generate tests for a file
 */
export async function generateTests(
  filepath: string,
  framework: 'jest' | 'vitest' | 'mocha' = 'jest'
): Promise<string> {
  const content = fs.readFileSync(filepath, 'utf-8');

  const result = await runClaude(`Generate ${framework} tests for:

${content}

Return only the test code.`, { json: false });

  return result.result || '';
}

// CLI
if (require.main === module) {
  const prompt = process.argv.slice(2).join(' ');

  if (!prompt) {
    console.error('Usage: ts-node claude.ts "your prompt"');
    process.exit(1);
  }

  runClaude(prompt)
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}
```

### Streaming Handler

```javascript title="scripts/claude-stream.js"
#!/usr/bin/env node
/**
 * Handle streaming output from Claude Code
 */

const { spawn } = require('child_process');
const readline = require('readline');

/**
 * Stream Claude output with callback
 */
function streamClaude(prompt, onChunk, onComplete) {
  const proc = spawn('claude', [
    '-p', prompt,
    '--output-format', 'stream-json'
  ]);

  const rl = readline.createInterface({
    input: proc.stdout,
    crlfDelay: Infinity
  });

  let fullContent = '';

  rl.on('line', (line) => {
    try {
      const data = JSON.parse(line);
      if (data.type === 'content') {
        fullContent += data.content;
        onChunk(data.content);
      }
    } catch (e) {
      // Skip non-JSON lines
    }
  });

  proc.on('close', (code) => {
    if (onComplete) {
      onComplete(fullContent, code);
    }
  });

  return proc;
}

// Example usage
if (require.main === module) {
  const prompt = process.argv.slice(2).join(' ') || 'Tell me a joke';

  console.log('Streaming response:\n');

  streamClaude(
    prompt,
    (chunk) => process.stdout.write(chunk),
    (full, code) => {
      console.log('\n\nStreaming complete.');
    }
  );
}

module.exports = { streamClaude };
```

## Makefile Integration

### Basic Makefile

```makefile title="Makefile"
# Claude Code Makefile integration

.PHONY: help review test-gen docs lint-ai format-ai

# Default target
help:
	@echo "Claude Code automation targets:"
	@echo "  review     - Review code changes"
	@echo "  test-gen   - Generate missing tests"
	@echo "  docs       - Generate documentation"
	@echo "  lint-ai    - AI-powered code linting"
	@echo "  format-ai  - AI-powered code formatting suggestions"

# Review staged changes
review:
	@echo "Reviewing staged changes..."
	@git diff --cached | claude -p "Review this diff for issues. Be specific about problems and suggestions."

# Generate tests for a file
test-gen:
ifndef FILE
	$(error FILE is required. Usage: make test-gen FILE=src/utils.ts)
endif
	@echo "Generating tests for $(FILE)..."
	@claude -p "Generate comprehensive unit tests for: $$(cat $(FILE))" > $(FILE:.ts=.test.ts)
	@echo "Tests written to $(FILE:.ts=.test.ts)"

# Generate documentation
docs:
	@echo "Generating documentation..."
	@find src -name "*.ts" -type f | head -20 | while read file; do \
		echo "Processing $$file..."; \
		claude -p "Generate JSDoc documentation for: $$(cat $$file)" > /dev/null; \
	done

# AI-powered linting
lint-ai:
	@echo "Running AI lint check..."
	@for file in $$(git diff --name-only --cached | grep -E '\.(ts|js|tsx|jsx)$$'); do \
		echo "Checking $$file..."; \
		claude -p "Lint this code and report issues: $$(cat $$file)" --json | jq -r '.result'; \
	done

# Format suggestions
format-ai:
ifndef FILE
	$(error FILE is required. Usage: make format-ai FILE=src/utils.ts)
endif
	@claude -p "Suggest formatting improvements for: $$(cat $(FILE))"

# Release preparation
release-prep:
	@echo "Preparing release..."
	@./scripts/pre-release.sh

# Changelog generation
changelog:
	@echo "Generating changelog..."
	@./scripts/update-changelog.sh $$(cat package.json | jq -r '.version')
```

### Advanced Makefile

```makefile title="Makefile.advanced"
# Advanced Claude Code Makefile

# Configuration
CLAUDE_MODEL ?= sonnet
CLAUDE_TIMEOUT ?= 300000
SRC_DIR ?= src
TEST_DIR ?= tests

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

.PHONY: all check review test docs clean

# === Code Quality ===

check: lint typecheck test
	@echo "$(GREEN)All checks passed$(NC)"

lint:
	@echo "Running linter..."
	@npm run lint

typecheck:
	@echo "Running type checker..."
	@npm run typecheck

test:
	@echo "Running tests..."
	@npm test

# === AI-Powered Tasks ===

# Review all changed files
ai-review:
	@echo "$(YELLOW)AI Code Review$(NC)"
	@CHANGES=$$(git diff --name-only HEAD~1 | grep -E '\.(ts|js|tsx|jsx)$$'); \
	if [ -z "$$CHANGES" ]; then \
		echo "No code files changed"; \
	else \
		echo "Reviewing: $$CHANGES"; \
		claude -p "Review these changed files for issues: $$CHANGES" \
			--model $(CLAUDE_MODEL) --timeout $(CLAUDE_TIMEOUT); \
	fi

# Generate tests for uncovered code
ai-test-coverage:
	@echo "$(YELLOW)Generating tests for uncovered code$(NC)"
	@npm run coverage -- --json > coverage.json 2>/dev/null || true
	@claude -p "Based on this coverage report, suggest files that need tests: $$(cat coverage.json)" \
		--model $(CLAUDE_MODEL)

# Security audit with AI analysis
ai-security:
	@echo "$(YELLOW)AI Security Audit$(NC)"
	@AUDIT=$$(npm audit --json 2>/dev/null || echo '{}'); \
	claude -p "Analyze this security audit and provide remediation steps: $$AUDIT" \
		--model opus

# Performance analysis
ai-perf:
	@echo "$(YELLOW)AI Performance Analysis$(NC)"
	@claude -p "Analyze the $(SRC_DIR) directory for performance issues. Look for: \
		- N+1 queries \
		- Memory leaks \
		- Unnecessary re-renders \
		- Inefficient algorithms" \
		--model $(CLAUDE_MODEL)

# === Documentation ===

# Generate API docs
docs-api:
	@echo "$(YELLOW)Generating API documentation$(NC)"
	@mkdir -p docs/api
	@find $(SRC_DIR) -name "*.ts" -type f | while read file; do \
		echo "Documenting $$file..."; \
		BASENAME=$$(basename $$file .ts); \
		claude -p "Generate API documentation for: $$(cat $$file)" \
			> docs/api/$$BASENAME.md; \
	done

# Generate README
docs-readme:
	@echo "$(YELLOW)Updating README$(NC)"
	@claude -p "Update the README.md based on current project structure and package.json: \
		Structure: $$(find $(SRC_DIR) -type f -name '*.ts' | head -30) \
		Package: $$(cat package.json)"

# === Release ===

release-notes:
	@echo "$(YELLOW)Generating release notes$(NC)"
	@LAST_TAG=$$(git describe --tags --abbrev=0 2>/dev/null || echo ""); \
	if [ -n "$$LAST_TAG" ]; then \
		COMMITS=$$(git log $$LAST_TAG..HEAD --pretty=format:"- %s"); \
	else \
		COMMITS=$$(git log --pretty=format:"- %s" -20); \
	fi; \
	claude -p "Generate release notes from these commits: $$COMMITS"

# === Maintenance ===

# Dependency analysis
deps-analyze:
	@echo "$(YELLOW)Analyzing dependencies$(NC)"
	@OUTDATED=$$(npm outdated --json 2>/dev/null || echo '{}'); \
	claude -p "Analyze these outdated dependencies and recommend updates: $$OUTDATED" \
		--model $(CLAUDE_MODEL)

# Code health report
health-report:
	@echo "$(YELLOW)Generating code health report$(NC)"
	@claude -p "Generate a code health report for this project. \
		Analyze: complexity, test coverage, documentation, dependencies. \
		Package.json: $$(cat package.json)" \
		--model opus > health-report.md
	@echo "Report saved to health-report.md"

# Clean generated files
clean:
	@rm -rf coverage.json health-report.md docs/api/*.md
	@echo "$(GREEN)Cleaned generated files$(NC)"
```

## npm Scripts Integration

### package.json Scripts

```json title="package.json"
{
  "name": "my-project",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "lint": "eslint src/",

    "claude:review": "git diff | claude -p 'Review this diff'",
    "claude:review:staged": "git diff --cached | claude -p 'Review staged changes'",
    "claude:review:file": "claude -p \"Review this file: $(cat $npm_config_file)\"",

    "claude:test": "claude -p \"Generate tests for: $(cat $npm_config_file)\"",
    "claude:test:coverage": "npm run coverage && claude -p \"Analyze coverage gaps: $(cat coverage/coverage-summary.json)\"",

    "claude:docs": "claude -p \"Generate documentation for src/ directory\"",
    "claude:docs:api": "claude -p \"Generate API docs for: $(find src -name '*.ts' -exec cat {} +)\"",

    "claude:explain": "claude -p \"Explain this codebase: $(cat package.json) $(find src -name '*.ts' | head -10)\"",
    "claude:refactor": "claude -p \"Suggest refactoring for: $(cat $npm_config_file)\"",

    "claude:release": "claude -p \"Generate release notes from: $(git log $(git describe --tags --abbrev=0)..HEAD --oneline)\"",
    "claude:changelog": "./scripts/update-changelog.sh",

    "claude:security": "npm audit --json | claude -p 'Analyze security issues and provide fixes'",
    "claude:deps": "npm outdated --json | claude -p 'Recommend dependency updates'",

    "precommit": "npm run lint && npm run claude:review:staged",
    "prepush": "npm test && npm run claude:review"
  }
}
```

### Usage Examples

```bash
# Review a specific file
npm run claude:review:file --file=src/utils/auth.ts

# Generate tests for a file
npm run claude:test --file=src/services/user.ts

# Analyze test coverage gaps
npm run claude:test:coverage

# Security audit with AI analysis
npm run claude:security
```

## Just Task Runner

### Justfile

```just title="justfile"
# Claude Code automation with just

# Default recipe
default:
    @just --list

# === Development ===

# Start development server
dev:
    npm run dev

# Run tests
test:
    npm test

# Build for production
build:
    npm run build

# === AI-Powered Tasks ===

# Review code changes
review:
    #!/usr/bin/env bash
    DIFF=$(git diff)
    if [ -z "$DIFF" ]; then
        echo "No changes to review"
    else
        echo "$DIFF" | claude -p "Review this diff for issues"
    fi

# Review a specific file
review-file FILE:
    claude -p "Review this code: $(cat {{FILE}})"

# Generate tests for a file
gen-tests FILE:
    #!/usr/bin/env bash
    CONTENT=$(cat {{FILE}})
    TEST_FILE={{FILE/%.ts/.test.ts}}
    claude -p "Generate tests for: $CONTENT" > $TEST_FILE
    echo "Tests written to $TEST_FILE"

# Explain a file
explain FILE:
    claude -p "Explain this code in detail: $(cat {{FILE}})"

# Suggest refactoring
refactor FILE:
    claude -p "Suggest refactoring improvements: $(cat {{FILE}})"

# === Documentation ===

# Generate API documentation
docs-api:
    #!/usr/bin/env bash
    mkdir -p docs/api
    for file in src/**/*.ts; do
        echo "Documenting $file..."
        name=$(basename "$file" .ts)
        claude -p "Generate API docs: $(cat $file)" > "docs/api/$name.md"
    done

# Update README
docs-readme:
    claude -p "Update README based on: $(cat package.json)"

# === Release ===

# Generate changelog entry
changelog VERSION:
    ./scripts/update-changelog.sh {{VERSION}}

# Generate release notes
release-notes:
    #!/usr/bin/env bash
    LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
    if [ -n "$LAST_TAG" ]; then
        COMMITS=$(git log $LAST_TAG..HEAD --oneline)
    else
        COMMITS=$(git log --oneline -20)
    fi
    claude -p "Generate release notes: $COMMITS"

# Prepare release
release TYPE="patch":
    #!/usr/bin/env bash
    npm version {{TYPE}} --no-git-tag-version
    VERSION=$(cat package.json | jq -r '.version')
    just changelog $VERSION
    git add package.json CHANGELOG.md
    git commit -m "chore: release v$VERSION"
    git tag -a "v$VERSION" -m "Release v$VERSION"
    echo "Ready to push v$VERSION"

# === Maintenance ===

# Security audit
security:
    npm audit --json | claude -p "Analyze and prioritize security fixes"

# Dependency check
deps:
    npm outdated --json | claude -p "Recommend safe dependency updates"

# Code health check
health:
    claude -p "Analyze codebase health: $(cat package.json)"
```

## Scheduled Tasks

### GitHub Actions Scheduled Workflows

```yaml title=".github/workflows/scheduled.yml"
name: Scheduled AI Tasks

on:
  schedule:
    # Daily at 6 AM UTC
    - cron: '0 6 * * *'
  workflow_dispatch:

jobs:
  daily-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup
        run: npm install -g @anthropic-ai/claude-code

      - name: Daily Code Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          # Get yesterday's commits
          COMMITS=$(git log --since="24 hours ago" --oneline)

          if [ -z "$COMMITS" ]; then
            echo "No commits in the last 24 hours"
            exit 0
          fi

          # Generate review
          REVIEW=$(claude -p "Review these commits from the last 24 hours:
          $COMMITS

          Summarize:
          1. What was done
          2. Any concerns
          3. Suggestions for follow-up")

          echo "$REVIEW"

  weekly-maintenance:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 6 * * 1'  # Mondays only
    steps:
      - uses: actions/checkout@v4

      - name: Setup
        run: |
          npm install -g @anthropic-ai/claude-code
          npm ci

      - name: Weekly Health Check
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          # Dependency check
          OUTDATED=$(npm outdated --json 2>/dev/null || echo "{}")

          # Security audit
          AUDIT=$(npm audit --json 2>/dev/null || echo "{}")

          # Generate report
          claude -p "Generate weekly maintenance report:

          Outdated Dependencies:
          $OUTDATED

          Security Audit:
          $AUDIT

          Include:
          1. Critical items requiring attention
          2. Recommended updates
          3. Security fixes needed" > weekly-report.md

      - name: Create Issue
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('weekly-report.md', 'utf8');

            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `Weekly Maintenance Report - ${new Date().toISOString().split('T')[0]}`,
              body: report,
              labels: ['maintenance', 'automated']
            });
```

### Cron Jobs (Linux/macOS)

```bash title="crontab"
# Edit with: crontab -e

# Daily standup at 9 AM
0 9 * * 1-5 /home/user/project/scripts/standup.sh >> /var/log/standup.log 2>&1

# Weekly dependency check on Mondays at 6 AM
0 6 * * 1 /home/user/project/scripts/deps-check.sh >> /var/log/deps.log 2>&1

# Nightly backup review at midnight
0 0 * * * /home/user/project/scripts/nightly-review.sh >> /var/log/review.log 2>&1
```

```bash title="scripts/cron-wrapper.sh"
#!/bin/bash
# Wrapper for cron jobs with proper environment

# Load environment
source ~/.bashrc
export PATH="$HOME/.nvm/versions/node/v20/bin:$PATH"

# Ensure API key is available
if [ -z "$ANTHROPIC_API_KEY" ]; then
  source ~/.env
fi

# Run the actual script
"$@"
```

### systemd Timer (Linux)

```ini title="/etc/systemd/system/claude-daily.service"
[Unit]
Description=Daily Claude Code Tasks
After=network.target

[Service]
Type=oneshot
User=developer
WorkingDirectory=/home/developer/project
Environment=ANTHROPIC_API_KEY=your-key
ExecStart=/home/developer/project/scripts/daily-tasks.sh
StandardOutput=journal
StandardError=journal
```

```ini title="/etc/systemd/system/claude-daily.timer"
[Unit]
Description=Run Claude tasks daily

[Timer]
OnCalendar=*-*-* 06:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
# Enable the timer
sudo systemctl enable claude-daily.timer
sudo systemctl start claude-daily.timer

# Check status
systemctl list-timers
```

## Next Steps

- [Automation Recipes](/guides/automation-recipes) - Ready-to-use automation scripts
- [Workflow Patterns](/guides/workflow-patterns) - Structured development workflows
- [CI/CD Integration](/guides/ci-cd) - Pipeline integration
- [Hooks Examples](/hooks/examples) - Event-driven automation
