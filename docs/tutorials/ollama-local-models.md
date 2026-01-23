---
sidebar_position: 9
title: Local Models with Ollama
description: Run Claude Code with free local open-source models
---

# Local Models with Ollama

Run Claude Code with local open-source models for free, private, offline development.

**Time:** 10 minutes
**Difficulty:** Beginner
**What you'll gain:** Run Claude Code without API costs using local models

## Why Use Local Models?

- **Free:** No API costs - run unlimited queries
- **Private:** Code never leaves your machine
- **Offline:** Work without internet access
- **Fast:** No network latency for simple tasks

## Prerequisites

1. Claude Code installed
2. [Ollama](https://ollama.com) installed and running

```bash
# Install Ollama (macOS/Linux)
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama
ollama serve
```

## Step 1: Pull a Model

Download a coding-optimized model:

```bash
# Recommended local models
ollama pull qwen3-coder
ollama pull codellama:34b
ollama pull deepseek-coder:33b
```

For more powerful cloud-backed options:

```bash
ollama pull glm-4.7:cloud
ollama pull minimax-m2.1:cloud
```

## Step 2: Configure Environment

Set environment variables to point Claude Code at Ollama:

```bash
export ANTHROPIC_AUTH_TOKEN=ollama
export ANTHROPIC_BASE_URL=http://localhost:11434
```

Add to your shell profile (`~/.bashrc`, `~/.zshrc`) for persistence:

```bash
echo 'export ANTHROPIC_AUTH_TOKEN=ollama' >> ~/.zshrc
echo 'export ANTHROPIC_BASE_URL=http://localhost:11434' >> ~/.zshrc
source ~/.zshrc
```

## Step 3: Run Claude Code

Start Claude Code with your local model:

```bash
# Use a local model
claude --model qwen3-coder

# Or specify a cloud model through Ollama
claude --model glm-4.7:cloud
```

## Model Recommendations

### Local Models (Free, Private)

| Model | Size | Best For |
|-------|------|----------|
| `qwen3-coder` | 7B-32B | General coding tasks |
| `codellama:34b` | 34B | Code completion, debugging |
| `deepseek-coder:33b` | 33B | Complex reasoning |

### Cloud Models (via Ollama)

| Model | Best For |
|-------|----------|
| `glm-4.7:cloud` | Full context, complex tasks |
| `minimax-m2.1:cloud` | Extended conversations |

## Context Length Configuration

Local models need sufficient context for complex tasks:

```bash
# Check model context length
ollama show qwen3-coder

# Minimum recommended: 32K tokens
# Adjust in Ollama's Modelfile if needed
```

Cloud models automatically run at full context length.

## Switching Between Local and Cloud

Create shell aliases for easy switching:

```bash
# Add to ~/.zshrc or ~/.bashrc

# Local Ollama mode
alias claude-local='ANTHROPIC_AUTH_TOKEN=ollama ANTHROPIC_BASE_URL=http://localhost:11434 claude'

# Cloud Anthropic mode (default)
alias claude-cloud='unset ANTHROPIC_BASE_URL && claude'
```

Usage:

```bash
# Use local model
claude-local --model qwen3-coder

# Switch back to Anthropic
claude-cloud
```

## Supported Features

Ollama models support:

- Messages and streaming
- System prompts
- Tool calling
- Extended thinking
- Vision (for multimodal models)

## Troubleshooting

### Connection Refused

```bash
# Ensure Ollama is running
ollama serve

# Check it's listening
curl http://localhost:11434/api/tags
```

### Model Not Found

```bash
# List available models
ollama list

# Pull the model you need
ollama pull qwen3-coder
```

### Slow Response Times

- Use a smaller model for simple tasks
- Ensure sufficient RAM (16GB+ recommended for 34B models)
- Consider GPU acceleration if available

### Context Too Short

Edit the model's parameters:

```bash
# Create custom Modelfile
echo 'FROM qwen3-coder
PARAMETER num_ctx 32768' > Modelfile

# Create custom model
ollama create qwen3-coder-32k -f Modelfile
```

## Best Practices

1. **Match model to task** - Use smaller models for simple tasks, larger for complex reasoning
2. **Keep Ollama running** - Start it as a background service
3. **Monitor memory** - Large models need significant RAM
4. **Test locally first** - Verify your workflow before switching back to cloud

## What's Next?

- [Bulk Processing](/tutorials/bulk-processing) - Process many files with headless mode
- [Custom Commands](/tutorials/custom-commands) - Create reusable prompts
- [Model Routing](/community/tools#model-routing) - Advanced multi-provider setups
