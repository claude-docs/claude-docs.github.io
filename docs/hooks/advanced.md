---
sidebar_position: 5
title: Advanced Hooks
description: Advanced patterns for Claude Code hooks
---

# Advanced Hooks

Advanced patterns for conditional execution, chaining, debugging, and optimizing hooks.

## Conditional Execution

### Environment-Based Conditions

Run hooks only in specific environments:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.ts",
        "command": "[ \"$NODE_ENV\" = 'development' ] && prettier --write \"$FILE\" || true"
      }
    ]
  }
}
```

### File Content Conditions

Execute based on file contents:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.ts",
        "command": "grep -q 'use client' \"$FILE\" && npm run build:client 2>/dev/null || true"
      }
    ]
  }
}
```

### Git Branch Conditions

Different behavior based on branch:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null); case \"$BRANCH\" in main|master) npm run lint:strict \"$FILE\" ;; feature/*) npm run lint \"$FILE\" ;; *) true ;; esac 2>/dev/null || true"
      }
    ]
  }
}
```

### Project Type Detection

Detect project type and run appropriate tools:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.{js,ts}",
        "command": "[ -f package.json ] && ([ -f .eslintrc* ] || [ -f eslint.config.* ]) && eslint --fix \"$FILE\" 2>/dev/null || true"
      },
      {
        "tool": "Write",
        "pattern": "*.py",
        "command": "[ -f pyproject.toml ] && grep -q 'black' pyproject.toml && black \"$FILE\" 2>/dev/null || true"
      }
    ]
  }
}
```

### Time-Based Conditions

Run expensive operations only during off-hours:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "HOUR=$(date +%H); [ $HOUR -ge 22 ] || [ $HOUR -le 6 ] && npm run full-lint \"$FILE\" || npm run quick-lint \"$FILE\" 2>/dev/null || true"
      }
    ]
  }
}
```

### Conditional on File Size

Skip large files:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "[ $(stat -f%z \"$FILE\" 2>/dev/null || stat -c%s \"$FILE\" 2>/dev/null) -lt 100000 ] && prettier --write \"$FILE\" || echo 'Skipping large file' 2>/dev/null"
      }
    ]
  }
}
```

---

## Chaining Hooks

### Sequential Execution

Run multiple commands in sequence:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.ts",
        "command": "prettier --write \"$FILE\" && eslint --fix \"$FILE\" && tsc --noEmit \"$FILE\""
      }
    ]
  }
}
```

### Fail-Safe Chaining

Continue even if some commands fail:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.py",
        "command": "(black \"$FILE\" || true) && (isort \"$FILE\" || true) && (mypy \"$FILE\" || true) && (pylint \"$FILE\" || true)"
      }
    ]
  }
}
```

### Parallel Execution

Run independent commands in parallel:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.ts",
        "command": "prettier --write \"$FILE\" & eslint --fix \"$FILE\" & wait"
      }
    ]
  }
}
```

### Pipeline Pattern

Pass data between commands:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.json",
        "command": "cat \"$FILE\" | jq -S '.' > \"$FILE.tmp\" && mv \"$FILE.tmp\" \"$FILE\""
      }
    ]
  }
}
```

### Multi-Stage Validation

Stage-based validation pipeline:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.ts",
        "command": "echo '=== Stage 1: Format ===' && prettier --write \"$FILE\" && echo '=== Stage 2: Lint ===' && eslint --fix \"$FILE\" && echo '=== Stage 3: Type Check ===' && tsc --noEmit \"$FILE\" && echo '=== Stage 4: Test ===' && npm test -- --findRelatedTests \"$FILE\" --passWithNoTests && echo '=== All stages passed ==='"
      }
    ]
  }
}
```

---

## Async Hooks

### Background Execution

Run hooks without blocking:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.ts",
        "command": "(prettier --write \"$FILE\" &) && (eslint --fix \"$FILE\" &)",
        "blocking": false
      }
    ]
  }
}
```

### Deferred Processing

Queue work for later:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "echo \"$FILE\" >> ~/.claude/pending-lint.txt",
        "blocking": false
      }
    ],
    "Stop": [
      {
        "command": "[ -f ~/.claude/pending-lint.txt ] && cat ~/.claude/pending-lint.txt | xargs -P4 eslint --fix 2>/dev/null; rm -f ~/.claude/pending-lint.txt || true"
      }
    ]
  }
}
```

### Debounced Execution

Debounce rapid changes:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "LOCK=/tmp/claude_debounce_$(echo \"$FILE\" | md5sum | cut -d' ' -f1); (flock -n 200 || exit 0; sleep 2; prettier --write \"$FILE\" 2>/dev/null) 200>$LOCK &",
        "blocking": false
      }
    ]
  }
}
```

### Rate-Limited Notifications

Prevent notification spam:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "LAST=/tmp/claude_last_notify; NOW=$(date +%s); PREV=$(cat $LAST 2>/dev/null || echo 0); [ $((NOW - PREV)) -gt 30 ] && (notify-send 'Claude' 'File updated' && echo $NOW > $LAST) || true"
      }
    ]
  }
}
```

---

## Error Recovery

### Graceful Degradation

Fall back to alternatives:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.ts",
        "command": "prettier --write \"$FILE\" 2>/dev/null || npx prettier --write \"$FILE\" 2>/dev/null || dprint fmt \"$FILE\" 2>/dev/null || echo 'No formatter available'"
      }
    ]
  }
}
```

### Automatic Retry

Retry failed operations:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "for i in 1 2 3; do prettier --write \"$FILE\" && break || sleep 1; done 2>/dev/null || true"
      }
    ]
  }
}
```

### Error Logging

Log errors for debugging:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.ts",
        "command": "prettier --write \"$FILE\" 2>&1 || (echo \"$(date -Iseconds) ERROR: prettier failed on $FILE\" >> ~/.claude/logs/errors.log && echo \"$?\" > /tmp/claude_last_error)"
      }
    ]
  }
}
```

### Rollback on Failure

Restore file on error:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "tool": "Write",
        "command": "[ -f \"$FILE\" ] && cp \"$FILE\" \"$FILE.claude-backup\" || true"
      }
    ],
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "prettier --write \"$FILE\" 2>/dev/null || ([ -f \"$FILE.claude-backup\" ] && mv \"$FILE.claude-backup\" \"$FILE\" && echo 'Restored from backup'); rm -f \"$FILE.claude-backup\" 2>/dev/null || true"
      }
    ]
  }
}
```

### Health Checks

Verify tools are available:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "command": "MISSING=''; command -v prettier >/dev/null || MISSING=\"$MISSING prettier\"; command -v eslint >/dev/null || MISSING=\"$MISSING eslint\"; command -v black >/dev/null || MISSING=\"$MISSING black\"; [ -n \"$MISSING\" ] && echo \"WARNING: Missing tools:$MISSING\" || echo 'All hook tools available'"
      }
    ]
  }
}
```

---

## Hook Debugging

### Verbose Logging

Enable detailed logging:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "command": "echo \"[DEBUG $(date +%T)] PreToolUse: tool=$TOOL file=$FILE\" >> ~/.claude/logs/debug.log"
      }
    ],
    "PostToolUse": [
      {
        "command": "echo \"[DEBUG $(date +%T)] PostToolUse: tool=$TOOL file=$FILE exit=$EXIT_CODE\" >> ~/.claude/logs/debug.log"
      }
    ]
  }
}
```

### Environment Inspection

Log all environment variables:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "command": "env | grep -E '^(TOOL|FILE|INPUT|SESSION|CONTENT)=' >> ~/.claude/logs/env-debug.log"
      }
    ]
  }
}
```

### Timing Analysis

Measure hook execution time:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "START=$(date +%s%N); prettier --write \"$FILE\" 2>/dev/null; END=$(date +%s%N); echo \"prettier: $((($END-$START)/1000000))ms\" >> ~/.claude/logs/timing.log || true"
      }
    ]
  }
}
```

### Dry Run Mode

Test hooks without executing:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "[ \"$CLAUDE_HOOK_DRY_RUN\" = 'true' ] && echo \"[DRY RUN] Would run: prettier --write $FILE\" || prettier --write \"$FILE\""
      }
    ]
  }
}
```

### Interactive Debugging

Pause for inspection:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "command": "[ \"$CLAUDE_HOOK_DEBUG\" = 'true' ] && (echo \"Press enter to continue (tool=$TOOL, file=$FILE)\" && read) || true"
      }
    ]
  }
}
```

---

## Performance Optimization

### Caching Results

Cache expensive computations:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.ts",
        "command": "HASH=$(md5sum \"$FILE\" | cut -d' ' -f1); CACHE=~/.claude/cache/lint_$HASH; [ -f \"$CACHE\" ] && cat \"$CACHE\" || (eslint \"$FILE\" 2>&1 | tee \"$CACHE\") || true"
      }
    ]
  }
}
```

### Incremental Processing

Only process changed parts:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.ts",
        "command": "git diff --name-only HEAD -- \"$FILE\" | xargs -r eslint --fix 2>/dev/null || eslint --fix \"$FILE\" 2>/dev/null || true"
      }
    ]
  }
}
```

### Lazy Loading

Load tools only when needed:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.ts",
        "command": "type prettier >/dev/null 2>&1 || npm install -g prettier; prettier --write \"$FILE\" 2>/dev/null || true"
      }
    ]
  }
}
```

### Skip Unchanged Files

Check if file actually changed:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "HASH_FILE=~/.claude/hashes/$(echo \"$FILE\" | md5sum | cut -d' ' -f1); OLD_HASH=$(cat \"$HASH_FILE\" 2>/dev/null); NEW_HASH=$(md5sum \"$FILE\" | cut -d' ' -f1); [ \"$OLD_HASH\" != \"$NEW_HASH\" ] && (prettier --write \"$FILE\" && echo \"$NEW_HASH\" > \"$HASH_FILE\") || true"
      }
    ]
  }
}
```

### Batched Processing

Batch multiple files:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "mkdir -p /tmp/claude_batch && echo \"$FILE\" >> /tmp/claude_batch/files.txt",
        "blocking": false
      }
    ],
    "Stop": [
      {
        "command": "[ -f /tmp/claude_batch/files.txt ] && cat /tmp/claude_batch/files.txt | sort -u | xargs -P4 prettier --write 2>/dev/null; rm -rf /tmp/claude_batch || true"
      }
    ]
  }
}
```

---

## Cross-Platform Hooks

### Platform Detection

Run platform-specific commands:

```json
{
  "hooks": {
    "Stop": [
      {
        "command": "case \"$(uname -s)\" in Darwin) osascript -e 'display notification \"Task complete\" with title \"Claude\"' ;; Linux) notify-send 'Claude' 'Task complete' ;; MINGW*|CYGWIN*|MSYS*) powershell -Command \"[System.Windows.Forms.MessageBox]::Show('Task complete')\" ;; esac 2>/dev/null || true"
      }
    ]
  }
}
```

### Portable Path Handling

Handle path differences:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "NORMALIZED_FILE=$(echo \"$FILE\" | sed 's|\\\\|/|g'); prettier --write \"$NORMALIZED_FILE\" 2>/dev/null || true"
      }
    ]
  }
}
```

### Shell Compatibility

Support multiple shells:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "/bin/sh -c 'prettier --write \"$FILE\"' 2>/dev/null || cmd /c \"prettier --write %FILE%\" 2>/dev/null || true"
      }
    ]
  }
}
```

### Cross-Platform Notifications

Universal notification system:

```json
{
  "hooks": {
    "Notification": [
      {
        "command": "(command -v notify-send && notify-send 'Claude' \"$MESSAGE\") || (command -v osascript && osascript -e 'display notification \"'\"$MESSAGE\"'\" with title \"Claude\"') || (command -v powershell && powershell -Command \"Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('$MESSAGE', 'Claude')\") || echo \"$MESSAGE\" 2>/dev/null"
      }
    ]
  }
}
```

---

## Hook Composition Patterns

### Factory Pattern

Generate hooks dynamically:

```bash
#!/bin/bash
# ~/.claude/scripts/generate-hooks.sh

cat << EOF
{
  "hooks": {
    "PostToolUse": [
$(for ext in js ts jsx tsx; do
  echo "      {\"tool\": \"Write\", \"pattern\": \"*.$ext\", \"command\": \"prettier --write \\\"\$FILE\\\"\"},"
done)
    ]
  }
}
EOF
```

### Decorator Pattern

Wrap hooks with common behavior:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "~/.claude/scripts/with-logging.sh prettier --write \"$FILE\""
      }
    ]
  }
}
```

**with-logging.sh:**

```bash
#!/bin/bash
# ~/.claude/scripts/with-logging.sh
START=$(date +%s%N)
echo "[$(date -Iseconds)] Running: $@" >> ~/.claude/logs/hooks.log
"$@"
EXIT_CODE=$?
END=$(date +%s%N)
DURATION=$(( ($END - $START) / 1000000 ))
echo "[$(date -Iseconds)] Completed ($EXIT_CODE) in ${DURATION}ms: $@" >> ~/.claude/logs/hooks.log
exit $EXIT_CODE
```

### Strategy Pattern

Select hook behavior based on context:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "~/.claude/scripts/format-strategy.sh \"$FILE\""
      }
    ]
  }
}
```

**format-strategy.sh:**

```bash
#!/bin/bash
# ~/.claude/scripts/format-strategy.sh
FILE="$1"
EXT="${FILE##*.}"

case "$EXT" in
  ts|tsx|js|jsx)
    [ -f .prettierrc ] && prettier --write "$FILE" || dprint fmt "$FILE"
    ;;
  py)
    [ -f pyproject.toml ] && black "$FILE" || autopep8 --in-place "$FILE"
    ;;
  go)
    gofmt -w "$FILE"
    ;;
  rs)
    rustfmt "$FILE"
    ;;
  *)
    echo "No formatter for .$EXT"
    ;;
esac
```

### Observer Pattern

Broadcast events to multiple handlers:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "~/.claude/scripts/broadcast.sh post_write \"$FILE\" \"$TOOL\""
      }
    ]
  }
}
```

**broadcast.sh:**

```bash
#!/bin/bash
# ~/.claude/scripts/broadcast.sh
EVENT="$1"
shift

for handler in ~/.claude/handlers/$EVENT/*.sh; do
  [ -x "$handler" ] && "$handler" "$@" &
done
wait
```

### Plugin System

Extensible hook system:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "for plugin in ~/.claude/plugins/post-write/*.sh; do [ -x \"$plugin\" ] && \"$plugin\" \"$FILE\" || true; done"
      }
    ]
  }
}
```

### Configuration Inheritance

Base configuration with overrides:

```bash
# ~/.claude/hooks/base.json - Base configuration
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "command": "~/.claude/scripts/base-formatter.sh \"$FILE\""
      }
    ]
  }
}
```

```bash
# Project .claude/settings.json - Override for project
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.ts",
        "command": "biome format --write \"$FILE\""
      }
    ]
  }
}
```

---

## Complete Advanced Example

Here is a production-ready advanced hook configuration:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "command": "mkdir -p ~/.claude/{logs,cache,hashes} && echo '{\"event\":\"start\",\"time\":\"'$(date -Iseconds)'\",\"session\":\"'$SESSION_ID'\",\"cwd\":\"'$(pwd)'\",\"tools\":{\"prettier\":'$(command -v prettier >/dev/null && echo true || echo false)',\"eslint\":'$(command -v eslint >/dev/null && echo true || echo false)',\"black\":'$(command -v black >/dev/null && echo true || echo false)'}}' >> ~/.claude/logs/sessions.jsonl"
      }
    ],
    "PreToolUse": [
      {
        "tool": "Write",
        "pattern": ".env*",
        "command": "echo 'BLOCKED: .env files protected' && exit 1"
      },
      {
        "tool": "Write",
        "pattern": "*.{pem,key,p12}",
        "command": "echo 'BLOCKED: Certificate files protected' && exit 1"
      },
      {
        "tool": "Write",
        "command": "[ -f \"$FILE\" ] && cp \"$FILE\" \"/tmp/claude_backup_$(basename \"$FILE\")_$(date +%s)\" || true"
      }
    ],
    "PostToolUse": [
      {
        "tool": "Write",
        "pattern": "*.{ts,tsx,js,jsx}",
        "command": "HASH=$(md5sum \"$FILE\" 2>/dev/null | cut -d' ' -f1); CACHE=~/.claude/cache/fmt_$HASH; [ ! -f \"$CACHE\" ] && (prettier --write \"$FILE\" 2>/dev/null && eslint --fix \"$FILE\" 2>/dev/null && touch \"$CACHE\") || true"
      },
      {
        "tool": "Write",
        "pattern": "*.py",
        "command": "(black \"$FILE\" 2>/dev/null || ruff format \"$FILE\" 2>/dev/null) && (isort \"$FILE\" 2>/dev/null || ruff check --fix \"$FILE\" 2>/dev/null) || true"
      },
      {
        "tool": "Write",
        "pattern": "*.go",
        "command": "gofmt -w \"$FILE\" 2>/dev/null && goimports -w \"$FILE\" 2>/dev/null || true"
      },
      {
        "tool": "Write",
        "pattern": "*.rs",
        "command": "rustfmt \"$FILE\" 2>/dev/null || cargo fmt -- \"$FILE\" 2>/dev/null || true"
      },
      {
        "tool": "Write",
        "command": "echo '{\"event\":\"write\",\"time\":\"'$(date -Iseconds)'\",\"file\":\"'$FILE'\",\"exit\":\"'$EXIT_CODE'\"}' >> ~/.claude/logs/writes.jsonl"
      },
      {
        "tool": "Write",
        "command": "git add \"$FILE\" 2>/dev/null || true",
        "blocking": false
      }
    ],
    "Stop": [
      {
        "command": "echo '{\"event\":\"stop\",\"time\":\"'$(date -Iseconds)'\",\"session\":\"'$SESSION_ID'\",\"turns\":'$TURN_COUNT'}' >> ~/.claude/logs/sessions.jsonl"
      },
      {
        "command": "case \"$(uname -s)\" in Darwin) osascript -e 'display notification \"Session complete ('$TURN_COUNT' turns)\" with title \"Claude Code\" sound name \"Glass\"' ;; Linux) notify-send -i terminal 'Claude Code' \"Session complete ($TURN_COUNT turns)\" ;; esac 2>/dev/null || true"
      },
      {
        "command": "find /tmp -name 'claude_backup_*' -mmin +60 -delete 2>/dev/null || true"
      }
    ],
    "Notification": [
      {
        "command": "LEVEL=\"${LEVEL:-info}\"; case \"$(uname -s)\" in Darwin) osascript -e 'display notification \"'\"$MESSAGE\"'\" with title \"Claude Code ['$LEVEL']\"' ;; Linux) notify-send -u $([ \"$LEVEL\" = 'error' ] && echo critical || echo normal) 'Claude Code' \"$MESSAGE\" ;; esac 2>/dev/null || true"
      }
    ]
  }
}
```

## Best Practices Summary

1. **Always handle errors gracefully** - Use `|| true` or proper error handling
2. **Quote all variables** - Prevent word splitting and glob expansion
3. **Use timeouts** - Prevent hooks from hanging indefinitely
4. **Log for debugging** - Maintain audit trails for troubleshooting
5. **Test hooks thoroughly** - Verify behavior before production use
6. **Keep hooks fast** - Use async execution for slow operations
7. **Cache when possible** - Avoid redundant processing
8. **Support all platforms** - Use portable shell constructs

## Next Steps

- [Hooks cookbook](/hooks/cookbook) - More recipes and examples
- [Hook events reference](/hooks/events) - Event documentation
- [Configuration guide](/cli/configuration) - Settings management
- [Best practices](/guides/best-practices) - General guidelines
