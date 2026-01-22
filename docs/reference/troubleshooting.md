---
sidebar_position: 3
title: Troubleshooting
description: Common issues and solutions for Claude Code
---

# Troubleshooting

Solutions for common Claude Code issues.

## Diagnostics

### Run Doctor

```bash
claude doctor
```

This checks:
- Installation
- Authentication
- Configuration
- MCP servers
- Common issues

### Verbose Mode

```bash
claude --verbose
```

Shows detailed logging for debugging.

### MCP Debug

```bash
claude --mcp-debug
```

Debug MCP server connections.

## Installation Issues

### "command not found"

**Cause:** Claude Code not in PATH.

**Solution:**

```bash
# Check npm global bin
npm bin -g

# Add to PATH
export PATH="$(npm bin -g):$PATH"

# Add to shell profile
echo 'export PATH="$(npm bin -g):$PATH"' >> ~/.bashrc
```

### Node.js Version

**Cause:** Node.js below v18.

**Solution:**

```bash
# Check version
node --version

# Install newer version with nvm
nvm install 20
nvm use 20
```

### Permission Errors (npm)

**Cause:** npm needs sudo.

**Solution:**

```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Reinstall
npm install -g @anthropic-ai/claude-code
```

## Authentication Issues

### "Authentication failed"

**Causes:**
- Invalid or expired token
- Subscription inactive
- API key incorrect

**Solutions:**

```bash
# Sign out and back in
claude logout
claude

# Check subscription status
# Visit console.anthropic.com

# Verify API key if using one
echo $ANTHROPIC_API_KEY
```

### "Rate limited"

**Cause:** Hit usage limits.

**Solutions:**

1. Wait for reset
2. Upgrade plan (Pro → Max)
3. Use Haiku model (lower quota usage)

```
/model haiku
```

### Browser Not Opening

**Cause:** No browser detected.

**Solution:**

```bash
# Set browser manually
export BROWSER=firefox
claude
```

Or use API key authentication instead.

## Performance Issues

### Slow Responses

**Causes:**
- Large context
- Network issues
- Model overload

**Solutions:**

```
# Compact context
/compact

# Check context usage
/context

# Switch to faster model
/model haiku
```

### High Memory Usage

**Cause:** Large files or long sessions.

**Solutions:**

```
# Clear session
/clear

# Use specific file ranges
> Look at src/app.ts:10-50
```

## MCP Issues

### Server Not Starting

**Cause:** Invalid configuration.

**Solution:**

```bash
# Test command directly
npx -y @anthropic-ai/mcp-server-filesystem ./path

# Check configuration
cat .claude/settings.json | jq '.mcpServers'
```

### Connection Timeout

**Cause:** Slow server startup.

**Solution:**

```json
{
  "mcpServers": {
    "slow-server": {
      "command": "...",
      "timeout": 60000
    }
  }
}
```

### Missing Environment Variables

**Cause:** Variables not set.

**Solution:**

```bash
# Check variable
echo $GITHUB_TOKEN

# Set in shell
export GITHUB_TOKEN="..."

# Or use .env file
```

## IDE Integration

### VS Code Not Connecting

**Solutions:**

1. Restart VS Code
2. Reinstall extension
3. Run Claude in integrated terminal
4. Use `/ide vscode` command

### JetBrains Connection Issues

**Solutions:**

1. Check WSL2 networking (if applicable)
2. Verify firewall rules
3. Use `/ide jetbrains` explicitly

## Context Issues

### "Context too large"

**Solutions:**

```
# Compact immediately
/compact

# If still too large
/clear

# Re-add essential context only
```

### Claude Forgets Things

**Solutions:**

1. Add to CLAUDE.md:
```bash
# Important: Use PostgreSQL 15
```

2. Re-state in conversation
3. Use more specific prompts

## File Operation Issues

### "Permission denied"

**Cause:** Permission rules blocking.

**Solution:**

```
# Check permissions
/permissions

# Add allow rule
/permissions allow Write(./path/**)
```

### Changes Not Appearing

**Cause:** File not saved or refreshed.

**Solutions:**

1. Check IDE file sync
2. Verify file was actually written
3. Clear IDE cache

## Recovery

### Restore Previous State

```
# Access checkpoints
/rewind

# Or press Esc Esc
```

### Reset Everything

```
# Clear configuration
claude config --reset

# Fresh session
/clear
```

## Getting Help

### Report Bugs

```
/bug
```

### Community Support

- [GitHub Issues](https://github.com/anthropics/claude-code/issues)
- [Discord](https://discord.gg/anthropic)

### Debug Info

When reporting issues, include:

```bash
claude doctor > debug.txt
claude --version >> debug.txt
```

## Next Steps

- [FAQ](/reference/faq)
- [Configuration](/cli/configuration)
- [Best Practices](/guides/best-practices)
