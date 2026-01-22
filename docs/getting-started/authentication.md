---
sidebar_position: 4
title: Authentication
description: Set up authentication for Claude Code
---

# Authentication

Claude Code supports multiple authentication methods to access Claude models.

## Subscription Options

| Plan | Monthly Cost | Best For |
|------|--------------|----------|
| **Claude Pro** | $20 | Individual developers |
| **Claude Max** | $100+ | Heavy users, extended limits |
| **Claude Teams** | Per seat | Team collaboration |
| **Claude Enterprise** | Custom | Organization-wide deployment |

## Authentication Methods

### 1. Claude Account (Recommended)

The simplest method - authenticate with your existing Claude subscription:

```bash
claude
```

On first run, a browser window opens for authentication. Sign in with your Claude account.

### 2. API Key

Use an Anthropic API key for direct API access:

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
claude
```

Or set it in your configuration:

```json title="~/.claude/settings.json"
{
  "apiKey": "sk-ant-..."
}
```

:::warning Security
Never commit API keys to version control. Use environment variables or secure secret management.
:::

### 3. Amazon Bedrock

Use Claude through AWS Bedrock:

```bash
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=your-key-id
export AWS_SECRET_ACCESS_KEY=your-secret-key
claude
```

### 4. Google Vertex AI

Use Claude through Google Cloud:

```bash
export CLAUDE_CODE_USE_VERTEX=1
export GOOGLE_PROJECT_ID=your-project
export GOOGLE_REGION=us-central1
claude
```

## Verifying Authentication

Check your authentication status:

```bash
claude doctor
```

This shows:
- Current authentication method
- Account information
- Usage limits
- Any configuration issues

## Session Management

### View Current Session

```bash
claude /status
```

### Sign Out

```bash
claude logout
```

### Switch Accounts

Sign out and re-authenticate:

```bash
claude logout
claude
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Direct API key |
| `CLAUDE_CODE_USE_BEDROCK` | Enable AWS Bedrock |
| `CLAUDE_CODE_USE_VERTEX` | Enable Google Vertex |
| `AWS_REGION` | AWS region for Bedrock |
| `GOOGLE_PROJECT_ID` | Google Cloud project |

## Troubleshooting

### "Authentication failed"

1. Check your subscription is active
2. Try signing out and back in
3. Verify your API key if using one

### "Rate limited"

You've hit usage limits. Options:
- Wait for limits to reset
- Upgrade to Claude Max for higher limits
- Use a different model (Haiku uses less quota)

### Browser doesn't open

Set your browser manually:

```bash
export BROWSER=firefox
claude
```

Or use API key authentication instead.

## Next Steps

- [Follow the quick start guide](/getting-started/quick-start)
- [Configure Claude Code](/cli/configuration)
- [Manage costs](/guides/cost-optimization)
