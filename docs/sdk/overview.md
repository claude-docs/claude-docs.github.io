---
sidebar_position: 1
title: Agent SDK Overview
description: Build autonomous agents with the Claude Agent SDK
---

# Claude Agent SDK Overview

The Claude Agent SDK enables developers to build autonomous agents programmatically, leveraging Claude's capabilities in custom applications.

## What is the Agent SDK?

The Agent SDK (formerly Claude Code SDK) provides:

- **Programmatic access** to Claude's agentic capabilities
- **Tool orchestration** through code
- **Sandboxed execution** for safe automation
- **Integration APIs** for CI/CD and custom workflows

## Available SDKs

### Python

```bash
pip install claude-agent-sdk
```

### TypeScript/JavaScript

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Quick Example

### Python

```python
from claude_agent_sdk import Agent

agent = Agent()

result = agent.run(
    prompt="Create a function that validates email addresses",
    tools=["write", "read"],
    working_directory="./src"
)

print(result.output)
```

### TypeScript

```typescript
import { Agent } from "@anthropic-ai/claude-agent-sdk";

const agent = new Agent();

const result = await agent.run({
  prompt: "Create a function that validates email addresses",
  tools: ["write", "read"],
  workingDirectory: "./src"
});

console.log(result.output);
```

## Key Features

### Autonomous Execution

The agent can:
- Read and write files
- Execute shell commands
- Search codebases
- Make multi-step plans

### Tool Control

Specify which tools the agent can use:

```python
agent.run(
    prompt="Review this code",
    tools=["read", "grep"],  # Read-only tools
    deny_tools=["write", "bash"]  # Explicitly deny
)
```

### Sandboxing

Run agents in isolated environments:

```python
from claude_agent_sdk import Agent, Sandbox

sandbox = Sandbox(
    allowed_paths=["./src"],
    network_access=False
)

agent = Agent(sandbox=sandbox)
```

### Streaming

Get real-time updates:

```python
for event in agent.stream(prompt="Build a REST API"):
    if event.type == "tool_use":
        print(f"Using tool: {event.tool}")
    elif event.type == "text":
        print(event.content)
```

## Use Cases

### Automated Code Review

```python
result = agent.run(
    prompt=f"Review this PR for security issues:\n{pr_diff}",
    model="claude-opus-4-5-20251101"
)
```

### Test Generation

```python
result = agent.run(
    prompt="Generate unit tests for src/auth.py",
    tools=["read", "write"],
    working_directory="./tests"
)
```

### Documentation

```python
result = agent.run(
    prompt="Generate API documentation for the routes folder",
    output_format="markdown"
)
```

### Migration Scripts

```python
result = agent.run(
    prompt="Migrate all class components to functional components",
    tools=["read", "write", "grep"],
    working_directory="./src/components"
)
```

## Configuration

### Model Selection

```python
agent = Agent(model="claude-opus-4-5-20251101")
```

### Timeout and Limits

```python
agent = Agent(
    timeout=300,  # 5 minutes
    max_tokens=8192,
    max_turns=50
)
```

### Custom System Prompt

```python
agent = Agent(
    system_prompt="You are a senior Python developer..."
)
```

## CI/CD Integration

### GitHub Actions

```yaml
- name: Code Review
  run: |
    pip install claude-agent-sdk
    python review.py
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### GitLab CI

```yaml
review:
  script:
    - pip install claude-agent-sdk
    - python review.py
  variables:
    ANTHROPIC_API_KEY: $ANTHROPIC_API_KEY
```

## Best Practices

1. **Limit tool access** - Only enable tools needed for the task
2. **Use sandboxing** - Especially for untrusted inputs
3. **Set timeouts** - Prevent runaway agents
4. **Log actions** - Track what the agent does
5. **Review outputs** - Validate agent-generated code

## Next Steps

- [Python SDK Guide](/sdk/python)
- [TypeScript SDK Guide](/sdk/typescript)
- [Example Use Cases](/sdk/use-cases)
