---
sidebar_position: 12
title: Advanced Troubleshooting
description: In-depth troubleshooting for Claude Code internals, MCP, and IDE integration
---

# Advanced Troubleshooting

Deep dive into troubleshooting Claude Code internals, MCP server issues, IDE integration problems, and advanced debugging techniques.

## Claude Code Internal Debugging

### Verbose Mode

Enable detailed logging to understand Claude Code's behavior:

```bash
# Full verbose output
claude --verbose

# Combine with your prompt
claude --verbose "analyze the authentication flow"

# Save verbose output to file
claude --verbose "debug the tests" 2>&1 | tee debug.log
```

**Verbose mode reveals:**
- API request/response timing
- Tool invocation details
- Context management operations
- Token usage per operation
- Configuration loading sequence

### MCP Debug Mode

Debug Model Context Protocol server connections:

```bash
# Enable MCP debugging
claude --mcp-debug

# Combine verbose and MCP debug
claude --verbose --mcp-debug "use the postgres tool"
```

**MCP debug output shows:**
- Server initialization sequence
- Connection handshakes
- Tool availability negotiation
- Request/response payloads
- Error details from servers

### Debug Flag Combinations

```bash
# Maximum visibility
claude --verbose --mcp-debug "complex task"

# Debug specific MCP issues
claude --mcp-debug "list available databases"

# Performance investigation
time claude --verbose -p "quick task" 2>&1 | grep -E "took|ms|tokens"
```

### Interpreting Debug Output

```
# Example verbose output interpretation:

[INFO] Loading configuration from ~/.claude/settings.json    # Config load
[INFO] Loading project configuration from .claude/settings.json
[DEBUG] Model: claude-sonnet-4-5-20250929                           # Model selection
[DEBUG] Context window: 200000 tokens
[INFO] Starting MCP server: postgres                         # MCP initialization
[DEBUG] MCP postgres: Connection established
[DEBUG] MCP postgres: 5 tools available
[INFO] Sending request (estimated 1,234 tokens)              # API call
[DEBUG] API response received in 2,341ms
[DEBUG] Tool call: Read(/src/app.ts)                         # Tool usage
[DEBUG] Tool result: 45 lines, 1,892 characters
[INFO] Response tokens: 567, Cost: $0.0023                   # Cost tracking
```

## Context Issues Diagnosis

### Context Size Problems

**Symptoms:**
- Slow responses
- Auto-compaction triggering frequently
- "Context too large" errors
- Claude forgetting recent information

**Diagnosis:**

```
# Check current context usage
/context

# Look for context hogs
> Show me context usage breakdown - what's taking the most space?
```

**Solutions:**

```
# Proactive compaction
/compact

# Full reset if needed
/clear

# More selective file reading
> Read only lines 50-100 of src/large-file.ts
```

### Context Quality Issues

**Symptoms:**
- Claude misunderstands project structure
- Incorrect assumptions about code
- Forgetting established patterns

**Diagnosis:**

```
> What do you understand about this project's:
> - Tech stack
> - Architecture
> - Coding conventions
> - File structure
```

**Solutions:**

```markdown
# Add to CLAUDE.md for persistent context

## Project Structure
- src/api/ - REST API handlers
- src/services/ - Business logic
- src/models/ - Data models

## Key Patterns
- All services use dependency injection
- Models use TypeORM decorators
- Error handling via custom AppError class
```

### Context Pollution

**Symptoms:**
- Mixed contexts from different tasks
- Claude referencing wrong files
- Confusion about current goal

**Solutions:**

```
# Clear and restart with fresh context
/clear

# Be explicit about scope
> Focus only on the authentication module. Ignore all other code.

# Use compact with guidance
> /compact - preserve context about the auth refactor we're doing
```

## MCP Server Debugging

### Server Connection Issues

**Symptoms:**
- "MCP server failed to start"
- Timeout errors
- Missing tools

**Step-by-step diagnosis:**

```bash
# 1. Test the command directly
npx -y @anthropic-ai/mcp-server-filesystem /home/user/project

# 2. Check for errors
echo $?  # Should be 0

# 3. Verify npm/npx works
npx --version

# 4. Check permissions
ls -la /home/user/project

# 5. Run with debug mode
claude --mcp-debug "list filesystem tools"
```

### Configuration Validation

```bash
# Check your MCP configuration
cat .claude/settings.json | jq '.mcpServers'

# Validate JSON syntax
cat .claude/settings.json | jq . > /dev/null && echo "Valid JSON"

# Test each server individually
for server in $(cat .claude/settings.json | jq -r '.mcpServers | keys[]'); do
  echo "Testing: $server"
  claude --mcp-debug -p "list tools from $server" 2>&1 | head -5
done
```

### Common MCP Issues

#### Server Timeout

```json
{
  "mcpServers": {
    "slow-server": {
      "command": "python",
      "args": ["server.py"],
      "timeout": 60000,
      "startupTimeout": 30000
    }
  }
}
```

#### Environment Variable Issues

```bash
# Check if variable is set
echo $GITHUB_TOKEN

# Set in current session
export GITHUB_TOKEN="ghp_xxxx"

# Use in configuration
```

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

#### Path Issues

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/absolute/path/to/directory"
      ]
    }
  }
}
```

### MCP Server Logs

```bash
# Capture MCP server output
claude --mcp-debug "use mcp tool" 2>&1 | tee mcp-debug.log

# Filter for specific server
grep "postgres" mcp-debug.log

# Look for errors
grep -i "error\|fail\|exception" mcp-debug.log
```

## IDE Integration Issues

### VS Code Integration

**Connection Issues:**

```bash
# 1. Ensure Claude Code is installed
claude --version

# 2. Check VS Code extension
code --list-extensions | grep claude

# 3. Restart VS Code
# (Close and reopen VS Code)

# 4. Use the command palette
# Ctrl+Shift+P -> "Claude: Connect"
```

**Settings Sync:**

```json
// In VS Code settings.json
{
  "claude.path": "/usr/local/bin/claude",
  "claude.model": "claude-sonnet-4-5-20250929",
  "claude.autoConnect": true
}
```

**Terminal Integration:**

```bash
# Run Claude in VS Code integrated terminal
claude

# If issues, check terminal shell
echo $SHELL
echo $PATH | tr ':' '\n' | head -10
```

### JetBrains Integration

**Connection Issues:**

```bash
# Check plugin installation
ls ~/.local/share/JetBrains/*/plugins/ | grep -i claude

# Verify Claude is accessible
which claude
claude --version

# Test connection
claude --verbose "test"
```

**WSL2 Issues (Windows):**

```bash
# Ensure WSL networking is correct
ip addr show eth0

# Check if Windows can reach WSL
# From PowerShell:
wsl -- claude --version

# Configure firewall if needed
```

**Settings:**

```
File -> Settings -> Tools -> Claude Code
- Path: /usr/local/bin/claude
- Enable: Automatic connection
- Model: sonnet
```

### Neovim Integration

**Plugin Issues:**

```lua
-- Check plugin is loaded
:lua print(vim.inspect(require('claude')))

-- Verify configuration
:lua print(vim.inspect(vim.g.claude_config))

-- Manual connection test
:ClaudeConnect
```

**Common Fixes:**

```lua
-- In init.lua or init.vim
require('claude').setup({
  path = vim.fn.exepath('claude'),
  auto_connect = true,
  debug = true,  -- Enable for troubleshooting
})
```

## Performance Optimization

### Slow Response Diagnosis

**Identify the bottleneck:**

```bash
# Time the full request
time claude -p "simple query" --json 2>&1

# Check verbose timing
claude --verbose -p "query" 2>&1 | grep -E "ms|took|time"
```

**Common causes and solutions:**

| Symptom | Cause | Solution |
|---------|-------|----------|
| Initial delay >5s | MCP server startup | Add startupTimeout, preload servers |
| Consistent slow | Large context | /compact regularly |
| Variable slow | Network issues | Check connection, try different network |
| Tool calls slow | Inefficient operations | Use specific file ranges |

### Optimizing Context Usage

```
# Monitor context growth
/context

# Before context gets large
/compact

# Be specific about what to read
> Read src/auth/login.ts lines 1-50
# Instead of
> Read src/auth/login.ts
```

### Model Selection for Speed

```bash
# Use Haiku for speed-critical operations
claude --model haiku -p "quick lint check"

# Use Sonnet for balanced performance
claude --model sonnet -p "code review"

# Reserve Opus for complex tasks
claude --model opus -p "architectural analysis"
```

### Batch Operations

```bash
# Inefficient: Multiple separate calls
claude -p "check file1.ts"
claude -p "check file2.ts"
claude -p "check file3.ts"

# Efficient: Single batched call
claude -p "check these files: file1.ts, file2.ts, file3.ts"
```

## Memory Management

### High Memory Usage

**Diagnosis:**

```bash
# Monitor Claude process memory
ps aux | grep claude

# Watch memory over time
watch -n 1 'ps aux | grep claude | grep -v grep'

# Check system memory
free -h
```

**Solutions:**

```
# Clear session to free memory
/clear

# Use smaller context windows
> Focus only on src/auth/, ignore other directories

# Read file segments instead of whole files
> Read lines 100-200 of the large config file
```

### Memory Leaks

**Symptoms:**
- Memory grows over long sessions
- System becomes sluggish
- OOM errors

**Solutions:**

```bash
# Restart Claude periodically for long tasks
claude -p "task 1" && claude -p "task 2"  # Fresh process each time

# Use print mode for scripts
claude -p "generate report" --json > report.json

# Session-based work
claude "start task"
# ... work ...
/clear  # Clean up
claude "continue with fresh context"
```

## Network Issues

### Connection Problems

**Diagnosis:**

```bash
# Test API connectivity
curl -I https://api.anthropic.com

# Check DNS resolution
nslookup api.anthropic.com

# Test with verbose mode
claude --verbose -p "test" 2>&1 | grep -i "connect\|network\|error"
```

**Proxy Configuration:**

```bash
# Set proxy environment variables
export HTTP_PROXY="http://proxy.company.com:8080"
export HTTPS_PROXY="http://proxy.company.com:8080"
export NO_PROXY="localhost,127.0.0.1"

# Then run Claude
claude "test connection"
```

### Rate Limiting

**Symptoms:**
- "Rate limited" errors
- HTTP 429 responses
- Requests failing after heavy use

**Solutions:**

```bash
# Use lower-quota models
claude --model haiku -p "quick task"

# Add delays between requests (in scripts)
claude -p "task1" && sleep 5 && claude -p "task2"

# Implement exponential backoff
for i in 1 2 3; do
  claude -p "task" && break
  sleep $((i * 5))
done
```

### Timeout Issues

**Configuration:**

```json
{
  "apiTimeout": 120000,
  "mcpServers": {
    "slow-server": {
      "timeout": 60000
    }
  }
}
```

**Environment variable:**

```bash
export CLAUDE_API_TIMEOUT=120000
claude -p "long-running task"
```

## Authentication Problems

### Token Issues

**Diagnosis:**

```bash
# Check authentication status
claude doctor

# Re-authenticate
claude logout
claude

# Verify API key (if using one)
echo $ANTHROPIC_API_KEY | head -c 20
```

**OAuth Issues:**

```bash
# Clear OAuth tokens
rm ~/.claude/auth.json

# Re-authenticate
claude

# If browser doesn't open
export BROWSER=firefox  # or chrome, chromium
claude
```

### Subscription Issues

**Symptoms:**
- "No active subscription"
- "Quota exceeded"
- Features not available

**Solutions:**

1. Check subscription at [console.anthropic.com](https://console.anthropic.com)
2. Verify correct account is logged in
3. Check billing status
4. Upgrade plan if needed

### Enterprise/API Key Authentication

```bash
# Using API key
export ANTHROPIC_API_KEY="sk-ant-..."
claude -p "test"

# Using AWS Bedrock
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_PROFILE="production"
claude -p "test"

# Using Google Vertex
export CLAUDE_CODE_USE_VERTEX=1
export GOOGLE_CLOUD_PROJECT="my-project"
claude -p "test"
```

## Common Error Patterns

### Error Reference Table

| Error | Cause | Solution |
|-------|-------|----------|
| "Context too large" | Exceeded token limit | `/compact` or `/clear` |
| "Rate limited" | Too many requests | Wait or use Haiku |
| "Authentication failed" | Invalid/expired token | `claude logout && claude` |
| "MCP server timeout" | Slow server startup | Increase timeout in config |
| "Permission denied" | File access blocked | Update permissions config |
| "Tool not found" | MCP server not loaded | Check MCP configuration |
| "Model not available" | Invalid model name | Use valid model identifier |
| "Network error" | Connection issues | Check internet, proxy settings |

### Diagnostic Commands

```bash
# Full system check
claude doctor

# Configuration status
claude config --show

# Version info
claude --version

# Generate debug bundle
claude doctor > debug-info.txt 2>&1
echo "---" >> debug-info.txt
claude --version >> debug-info.txt
cat .claude/settings.json >> debug-info.txt 2>/dev/null
```

### Recovery Procedures

**Complete Reset:**

```bash
# 1. Stop any running Claude processes
pkill -f claude

# 2. Clear session data
rm -rf ~/.claude/sessions/*

# 3. Reset configuration (optional)
claude config --reset

# 4. Re-authenticate
claude logout
claude
```

**Partial Reset:**

```
# Just clear current session
/clear

# Reset permissions
/permissions reset

# Reload configuration
/config reload
```

## Getting Help

### Reporting Issues

```bash
# Generate diagnostic info
claude doctor > bug-report.txt

# Add configuration (remove secrets)
cat .claude/settings.json | jq 'del(.apiKey)' >> bug-report.txt

# Include error output
claude --verbose "failing command" 2>&1 >> bug-report.txt
```

### In-App Bug Reporting

```
/bug

# Describe the issue when prompted
# Logs are automatically attached
```

### Community Resources

- [GitHub Issues](https://github.com/anthropics/claude-code/issues) - Bug reports and feature requests
- [Discord](https://discord.gg/anthropic) - Community support
- [Documentation](https://docs.anthropic.com) - Official docs

### Debug Information Checklist

When reporting issues, include:

- [ ] Claude Code version (`claude --version`)
- [ ] Operating system and version
- [ ] Node.js version (`node --version`)
- [ ] Output of `claude doctor`
- [ ] Relevant configuration (sanitized)
- [ ] Steps to reproduce
- [ ] Error messages (full text)
- [ ] Verbose mode output if applicable

## Next Steps

- [Debugging Guide](/guides/debugging) - Application debugging with Claude
- [CLI Reference](/cli/commands) - Command reference
- [Configuration](/cli/configuration) - Configuration options
- [FAQ](/reference/faq) - Frequently asked questions
