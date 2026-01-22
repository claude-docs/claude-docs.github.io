---
sidebar_position: 4
title: Hooks Cookbook
description: 20+ production-ready hook recipes for Claude Code
---

# Hooks Cookbook

Production-ready hook recipes for common development workflows. Copy, customize, and use these hooks in your `.claude/settings.json`.

## Auto-Formatting

### 1. Prettier for JavaScript/TypeScript

Format JavaScript, TypeScript, JSX, and TSX files on save:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.{js,jsx,ts,tsx,json,css,scss,md}",
        "command": "prettier --write \"$FILE\" 2>/dev/null || true"
      }
    ]
  }
}
```

**With configuration check:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.{js,jsx,ts,tsx}",
        "command": "[ -f .prettierrc ] && prettier --write \"$FILE\" || npx prettier --write \"$FILE\""
      }
    ]
  }
}
```

### 2. Black for Python

Format Python files with Black and sort imports with isort:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.py",
        "command": "black \"$FILE\" && isort \"$FILE\""
      }
    ]
  }
}
```

**With Ruff (faster alternative):**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.py",
        "command": "ruff format \"$FILE\" && ruff check --fix \"$FILE\""
      }
    ]
  }
}
```

### 3. gofmt for Go

Format Go files with gofmt and organize imports with goimports:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.go",
        "command": "gofmt -w \"$FILE\" && goimports -w \"$FILE\""
      }
    ]
  }
}
```

### 4. rustfmt for Rust

Format Rust files:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.rs",
        "command": "rustfmt \"$FILE\" 2>/dev/null || cargo fmt -- \"$FILE\""
      }
    ]
  }
}
```

### 5. Multi-Language Formatter

Universal formatter that detects language:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "case \"$FILE\" in *.py) black \"$FILE\" && isort \"$FILE\" ;; *.{js,ts,jsx,tsx}) prettier --write \"$FILE\" ;; *.go) gofmt -w \"$FILE\" ;; *.rs) rustfmt \"$FILE\" ;; *.rb) rubocop -a \"$FILE\" ;; esac 2>/dev/null || true"
      }
    ]
  }
}
```

---

## Linting

### 6. ESLint Auto-fix

Run ESLint with auto-fix:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.{js,jsx,ts,tsx}",
        "command": "eslint --fix \"$FILE\" 2>/dev/null || true"
      }
    ]
  }
}
```

**Strict mode (fail on errors):**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.{js,jsx,ts,tsx}",
        "command": "eslint --fix \"$FILE\" --max-warnings 0"
      }
    ]
  }
}
```

### 7. Pylint for Python

Run Pylint check after writing Python files:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.py",
        "command": "pylint \"$FILE\" --output-format=colorized --disable=C0114,C0115,C0116 || true"
      }
    ]
  }
}
```

**With mypy type checking:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.py",
        "command": "black \"$FILE\" && mypy \"$FILE\" --ignore-missing-imports || true"
      }
    ]
  }
}
```

### 8. golangci-lint for Go

Comprehensive Go linting:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.go",
        "command": "golangci-lint run \"$FILE\" --fix 2>/dev/null || true"
      }
    ]
  }
}
```

---

## Testing

### 9. Auto-run Related Tests (Jest)

Run tests related to changed files:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "src/**/*.{ts,tsx}",
        "command": "npm test -- --findRelatedTests \"$FILE\" --passWithNoTests --colors 2>/dev/null || true"
      }
    ]
  }
}
```

### 10. Auto-run Related Tests (pytest)

Run pytest for related Python files:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.py",
        "command": "TEST_FILE=$(echo \"$FILE\" | sed 's|/\\([^/]*\\)\\.py$|/test_\\1.py|'); [ -f \"$TEST_FILE\" ] && pytest \"$TEST_FILE\" -v || true"
      }
    ]
  }
}
```

**Using pytest-testmon for smart test selection:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.py",
        "command": "pytest --testmon --tb=short 2>/dev/null || true"
      }
    ]
  }
}
```

### 11. Go Test Runner

Run Go tests for modified packages:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.go",
        "command": "go test -v $(dirname \"$FILE\") 2>/dev/null || true"
      }
    ]
  }
}
```

---

## Git Hooks Integration

### 12. Auto-Stage Changes

Automatically stage files after Claude writes them:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "git add \"$FILE\" 2>/dev/null || true"
      }
    ]
  }
}
```

### 13. Pre-commit Integration

Run pre-commit hooks on changed files:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "pre-commit run --files \"$FILE\" 2>/dev/null || true"
      }
    ]
  }
}
```

### 14. Commit Message Validation

Validate conventional commit format:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "tool": "Bash",
        "command": "if echo \"$INPUT\" | jq -r '.command' | grep -q '^git commit'; then COMMIT_MSG=$(echo \"$INPUT\" | jq -r '.command' | grep -oP '(?<=-m \")[^\"]+'); echo \"$COMMIT_MSG\" | grep -qE '^(feat|fix|docs|style|refactor|test|chore)(\\(.+\\))?: .+' || (echo 'Invalid commit message format. Use: type(scope): message' && exit 1); fi"
      }
    ]
  }
}
```

---

## Notification Systems

### 15. Slack Notifications

Send Slack message when Claude completes:

```json
{
  "hooks": {
    "Stop": [
      {
        "command": "curl -s -X POST -H 'Content-type: application/json' --data '{\"text\":\"Claude Code completed a task in '\"$(basename $(pwd))\"'\",\"username\":\"Claude Bot\",\"icon_emoji\":\":robot_face:\"}' \"$SLACK_WEBHOOK_URL\" >/dev/null 2>&1 || true"
      }
    ]
  }
}
```

**With detailed message:**

```json
{
  "hooks": {
    "Stop": [
      {
        "command": "curl -s -X POST -H 'Content-type: application/json' --data '{\"blocks\":[{\"type\":\"section\",\"text\":{\"type\":\"mrkdwn\",\"text\":\"*Claude Code Session Complete*\\nProject: '\"$(basename $(pwd))\"'\\nTurns: '\"$TURN_COUNT\"'\\nSession: '\"$SESSION_ID\"'\"}}]}' \"$SLACK_WEBHOOK_URL\" >/dev/null 2>&1 || true"
      }
    ]
  }
}
```

### 16. Discord Notifications

Send Discord webhook notification:

```json
{
  "hooks": {
    "Stop": [
      {
        "command": "curl -s -X POST -H 'Content-type: application/json' --data '{\"content\":\"Claude Code completed a task\",\"embeds\":[{\"title\":\"Session Complete\",\"description\":\"Project: '\"$(basename $(pwd))\"'\",\"color\":5814783}]}' \"$DISCORD_WEBHOOK_URL\" >/dev/null 2>&1 || true"
      }
    ]
  }
}
```

### 17. Email Notifications

Send email via sendmail or mailx:

```json
{
  "hooks": {
    "Stop": [
      {
        "command": "echo -e \"Subject: Claude Code Task Complete\\n\\nSession $SESSION_ID completed with $TURN_COUNT turns in $(basename $(pwd))\" | sendmail \"$USER_EMAIL\" 2>/dev/null || true"
      }
    ]
  }
}
```

**Using curl with SMTP API (SendGrid):**

```json
{
  "hooks": {
    "Stop": [
      {
        "command": "curl -s --request POST --url https://api.sendgrid.com/v3/mail/send --header \"Authorization: Bearer $SENDGRID_API_KEY\" --header 'Content-Type: application/json' --data '{\"personalizations\":[{\"to\":[{\"email\":\"'\"$USER_EMAIL\"'\"}]}],\"from\":{\"email\":\"claude@example.com\"},\"subject\":\"Claude Task Complete\",\"content\":[{\"type\":\"text/plain\",\"value\":\"Session completed in '\"$(basename $(pwd))\"'\"}]}' >/dev/null 2>&1 || true"
      }
    ]
  }
}
```

### 18. Desktop Notifications

**macOS:**

```json
{
  "hooks": {
    "Stop": [
      {
        "command": "osascript -e 'display notification \"Task completed in '\"$(basename $(pwd))\"'\" with title \"Claude Code\" sound name \"Glass\"'"
      }
    ],
    "Notification": [
      {
        "command": "osascript -e 'display notification \"'\"$MESSAGE\"'\" with title \"Claude Code\" sound name \"Submarine\"'"
      }
    ]
  }
}
```

**Linux:**

```json
{
  "hooks": {
    "Stop": [
      {
        "command": "notify-send -i terminal -u normal 'Claude Code' 'Task completed in '\"$(basename $(pwd))\"''"
      }
    ],
    "Notification": [
      {
        "command": "notify-send -i terminal -u normal 'Claude Code' \"$MESSAGE\""
      }
    ]
  }
}
```

**Windows (PowerShell):**

```json
{
  "hooks": {
    "Stop": [
      {
        "command": "powershell -Command \"Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('Task completed', 'Claude Code')\""
      }
    ]
  }
}
```

---

## Logging and Auditing

### 19. Comprehensive Audit Log

Log all tool usage with timestamps:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "command": "mkdir -p ~/.claude/logs && echo \"{\\\"timestamp\\\":\\\"$(date -Iseconds)\\\",\\\"event\\\":\\\"pre\\\",\\\"tool\\\":\\\"$TOOL\\\",\\\"file\\\":\\\"$FILE\\\",\\\"session\\\":\\\"$SESSION_ID\\\"}\" >> ~/.claude/logs/audit.jsonl"
      }
    ],
    "PostToolUse": [
      {
        "command": "echo \"{\\\"timestamp\\\":\\\"$(date -Iseconds)\\\",\\\"event\\\":\\\"post\\\",\\\"tool\\\":\\\"$TOOL\\\",\\\"file\\\":\\\"$FILE\\\",\\\"exit_code\\\":\\\"$EXIT_CODE\\\",\\\"session\\\":\\\"$SESSION_ID\\\"}\" >> ~/.claude/logs/audit.jsonl"
      }
    ],
    "UserPromptSubmit": [
      {
        "command": "echo \"{\\\"timestamp\\\":\\\"$(date -Iseconds)\\\",\\\"event\\\":\\\"prompt\\\",\\\"session\\\":\\\"$SESSION_ID\\\",\\\"prompt_length\\\":$(echo -n \"$PROMPT\" | wc -c)}\" >> ~/.claude/logs/audit.jsonl"
      }
    ]
  }
}
```

### 20. Session Analytics

Track session statistics:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "command": "mkdir -p ~/.claude/analytics && echo \"$(date -Iseconds),session_start,$SESSION_ID,$(pwd)\" >> ~/.claude/analytics/sessions.csv"
      }
    ],
    "Stop": [
      {
        "command": "echo \"$(date -Iseconds),session_end,$SESSION_ID,$TURN_COUNT\" >> ~/.claude/analytics/sessions.csv"
      }
    ]
  }
}
```

---

## Security Scanning

### 21. Secret Detection

Scan for secrets before commits:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "gitleaks detect --source \"$FILE\" --no-git --verbose 2>/dev/null && echo 'No secrets detected' || (echo 'WARNING: Potential secrets detected in $FILE' && exit 1)"
      }
    ]
  }
}
```

**Using truffleHog:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "trufflehog filesystem --directory $(dirname \"$FILE\") --only-verified 2>/dev/null || true"
      }
    ]
  }
}
```

### 22. Dependency Vulnerability Scan

Check for vulnerable dependencies:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "package.json",
        "command": "npm audit --audit-level=high 2>/dev/null || true"
      },
      {
        "tool": "Write",
        "pattern": "requirements.txt",
        "command": "pip-audit -r requirements.txt 2>/dev/null || safety check -r requirements.txt 2>/dev/null || true"
      },
      {
        "tool": "Write",
        "pattern": "go.mod",
        "command": "govulncheck ./... 2>/dev/null || true"
      }
    ]
  }
}
```

### 23. Block Sensitive File Writes

Prevent writes to sensitive files:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "tool": "Write",
        "pattern": ".env*",
        "command": "echo 'BLOCKED: Cannot write to .env files' && exit 1"
      },
      {
        "tool": "Write",
        "pattern": "*.pem",
        "command": "echo 'BLOCKED: Cannot write to certificate files' && exit 1"
      },
      {
        "tool": "Write",
        "pattern": "*.key",
        "command": "echo 'BLOCKED: Cannot write to key files' && exit 1"
      },
      {
        "tool": "Write",
        "pattern": "**/secrets/**",
        "command": "echo 'BLOCKED: Cannot write to secrets directory' && exit 1"
      },
      {
        "tool": "Write",
        "pattern": "**/.ssh/**",
        "command": "echo 'BLOCKED: Cannot write to SSH directory' && exit 1"
      },
      {
        "tool": "Write",
        "pattern": "*credentials*",
        "command": "echo 'BLOCKED: Cannot write to credentials files' && exit 1"
      }
    ]
  }
}
```

---

## Performance Profiling

### 24. Track Tool Execution Time

Measure how long tools take:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "command": "echo $(date +%s%N) > /tmp/claude_hook_start_$TOOL"
      }
    ],
    "PostToolUse": [
      {
        "command": "START=$(cat /tmp/claude_hook_start_$TOOL 2>/dev/null || echo 0); END=$(date +%s%N); DURATION=$(( (END - START) / 1000000 )); echo \"$(date -Iseconds),$TOOL,$FILE,$DURATION\" >> ~/.claude/logs/performance.csv; rm -f /tmp/claude_hook_start_$TOOL"
      }
    ]
  }
}
```

---

## Documentation Generation

### 25. Auto-generate JSDoc

Generate documentation stubs:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.ts",
        "command": "npx jsdoc-automation \"$FILE\" 2>/dev/null || true"
      }
    ]
  }
}
```

### 26. Update README on API Changes

Regenerate API docs when interfaces change:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "src/api/**/*.ts",
        "command": "npx typedoc --out docs/api src/api 2>/dev/null &"
      }
    ]
  }
}
```

---

## Deployment Triggers

### 27. Trigger Staging Deploy

Auto-deploy to staging when certain files change:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "src/**/*",
        "command": "[ \"$CLAUDE_AUTO_DEPLOY\" = 'true' ] && curl -s -X POST \"$DEPLOY_WEBHOOK_URL\" -d '{\"environment\":\"staging\"}' >/dev/null 2>&1 || true"
      }
    ]
  }
}
```

---

## Database Migrations

### 28. Auto-generate Migration

Create migration when schema files change:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "**/models/*.py",
        "command": "[ -f manage.py ] && python manage.py makemigrations --dry-run 2>/dev/null || true"
      },
      {
        "tool": "Write",
        "pattern": "**/entities/*.ts",
        "command": "npx typeorm migration:generate -n AutoMigration 2>/dev/null || true"
      }
    ]
  }
}
```

---

## Cache Invalidation

### 29. Clear Build Cache

Invalidate caches when config changes:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "{webpack,vite,rollup}.config.*",
        "command": "rm -rf node_modules/.cache .cache dist/.cache 2>/dev/null; echo 'Build cache cleared'"
      },
      {
        "tool": "Write",
        "pattern": "tsconfig.json",
        "command": "rm -rf node_modules/.cache/typescript 2>/dev/null; echo 'TypeScript cache cleared'"
      }
    ]
  }
}
```

---

## API Mocking

### 30. Update Mock Data

Regenerate mocks when API types change:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "src/types/api/*.ts",
        "command": "npx openapi-typescript-codegen --input openapi.yaml --output src/mocks --generate-client false 2>/dev/null || true"
      }
    ]
  }
}
```

---

## Screenshot Capture

### 31. Capture UI Screenshots

Take screenshots when UI components change:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "src/components/**/*.tsx",
        "command": "[ \"$CLAUDE_SCREENSHOT\" = 'true' ] && npx playwright screenshot --url http://localhost:3000 --output screenshots/$(basename \"$FILE\" .tsx).png 2>/dev/null || true"
      }
    ]
  }
}
```

---

## Metrics Collection

### 32. Collect Code Metrics

Track code complexity and size:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.{ts,js}",
        "command": "npx plato -r -d report \"$FILE\" 2>/dev/null || true"
      },
      {
        "tool": "Write",
        "pattern": "*.py",
        "command": "radon cc \"$FILE\" -s 2>/dev/null | tee -a ~/.claude/logs/complexity.log || true"
      }
    ]
  }
}
```

### 33. Lines of Code Tracking

Track project growth:

```json
{
  "hooks": {
    "Stop": [
      {
        "command": "LOC=$(find . -name '*.ts' -o -name '*.py' -o -name '*.go' | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}'); echo \"$(date -Iseconds),$SESSION_ID,$LOC\" >> ~/.claude/logs/loc.csv"
      }
    ]
  }
}
```

---

## Complete Production Setup

Here is a comprehensive hook configuration combining multiple recipes:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "command": "mkdir -p ~/.claude/logs && echo '{\"event\":\"session_start\",\"timestamp\":\"'$(date -Iseconds)'\",\"session\":\"'$SESSION_ID'\",\"cwd\":\"'$(pwd)'\"}' >> ~/.claude/logs/audit.jsonl"
      }
    ],
    "PreToolUse": [
      {
        "tool": "Write",
        "pattern": ".env*",
        "command": "echo 'BLOCKED: Cannot modify .env files' && exit 1"
      },
      {
        "tool": "Write",
        "pattern": "*.{pem,key}",
        "command": "echo 'BLOCKED: Cannot modify key files' && exit 1"
      },
      {
        "command": "echo '{\"event\":\"pre_tool\",\"timestamp\":\"'$(date -Iseconds)'\",\"tool\":\"'$TOOL'\",\"file\":\"'$FILE'\"}' >> ~/.claude/logs/audit.jsonl"
      }
    ],
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.{js,jsx,ts,tsx}",
        "command": "prettier --write \"$FILE\" 2>/dev/null && eslint --fix \"$FILE\" 2>/dev/null || true"
      },
      {
        "tool": "Write",
        "pattern": "*.py",
        "command": "black \"$FILE\" 2>/dev/null && isort \"$FILE\" 2>/dev/null || true"
      },
      {
        "tool": "Write",
        "pattern": "*.go",
        "command": "gofmt -w \"$FILE\" 2>/dev/null && goimports -w \"$FILE\" 2>/dev/null || true"
      },
      {
        "tool": "Write",
        "pattern": "*.rs",
        "command": "rustfmt \"$FILE\" 2>/dev/null || true"
      },
      {
        "tool": "Write",
        "command": "git add \"$FILE\" 2>/dev/null || true"
      },
      {
        "command": "echo '{\"event\":\"post_tool\",\"timestamp\":\"'$(date -Iseconds)'\",\"tool\":\"'$TOOL'\",\"file\":\"'$FILE'\",\"exit_code\":\"'$EXIT_CODE'\"}' >> ~/.claude/logs/audit.jsonl"
      }
    ],
    "Stop": [
      {
        "command": "echo '{\"event\":\"session_end\",\"timestamp\":\"'$(date -Iseconds)'\",\"session\":\"'$SESSION_ID'\",\"turns\":\"'$TURN_COUNT'\"}' >> ~/.claude/logs/audit.jsonl"
      },
      {
        "command": "notify-send -i terminal 'Claude Code' 'Session completed ($TURN_COUNT turns)' 2>/dev/null || osascript -e 'display notification \"Session completed ('$TURN_COUNT' turns)\" with title \"Claude Code\"' 2>/dev/null || true"
      }
    ],
    "Notification": [
      {
        "command": "notify-send -i terminal 'Claude Code' \"$MESSAGE\" 2>/dev/null || osascript -e 'display notification \"'$MESSAGE'\" with title \"Claude Code\"' 2>/dev/null || true"
      }
    ]
  }
}
```

## Next Steps

- [Advanced hooks patterns](/hooks/advanced) - Conditional execution, chaining, debugging
- [Hook events reference](/hooks/events) - Detailed event documentation
- [Configuration guide](/cli/configuration) - Settings management
