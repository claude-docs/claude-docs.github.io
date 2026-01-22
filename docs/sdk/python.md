---
sidebar_position: 2
title: Python SDK
description: Claude Agent SDK for Python
---

# Python SDK

Complete guide to using the Claude Agent SDK with Python.

## Installation

```bash
pip install claude-agent-sdk
```

Or with optional dependencies:

```bash
pip install claude-agent-sdk[all]
```

## Basic Usage

### Simple Agent

```python
from claude_agent_sdk import Agent

agent = Agent()
result = agent.run("Explain the code in main.py")
print(result.output)
```

### With Configuration

```python
from claude_agent_sdk import Agent, AgentConfig

config = AgentConfig(
    model="claude-opus-4-5-20251101",
    timeout=300,
    max_tokens=4096
)

agent = Agent(config=config)
```

## Agent Methods

### run()

Execute a task and wait for completion:

```python
result = agent.run(
    prompt="Create a Flask API",
    tools=["read", "write", "bash"],
    working_directory="./backend"
)

print(result.output)
print(result.files_modified)
print(result.commands_run)
```

### stream()

Get real-time events:

```python
for event in agent.stream("Build a REST API"):
    match event.type:
        case "thinking":
            print(f"Thinking: {event.content}")
        case "tool_use":
            print(f"Tool: {event.tool} - {event.input}")
        case "tool_result":
            print(f"Result: {event.output}")
        case "text":
            print(event.content)
        case "done":
            print("Complete!")
```

### chat()

Multi-turn conversation:

```python
conversation = agent.chat()

response1 = conversation.send("What files are in this project?")
response2 = conversation.send("Explain the main entry point")
response3 = conversation.send("Add error handling")
```

## Tool Control

### Allowing Tools

```python
result = agent.run(
    prompt="Review this code",
    tools=["read", "grep"]  # Only read access
)
```

### Denying Tools

```python
result = agent.run(
    prompt="Fix the bug",
    deny_tools=["bash"]  # Prevent shell access
)
```

### Custom Tools

```python
from claude_agent_sdk import Tool

@Tool(description="Get the current time")
def get_time() -> str:
    from datetime import datetime
    return datetime.now().isoformat()

agent = Agent(custom_tools=[get_time])
```

## Sandboxing

### Basic Sandbox

```python
from claude_agent_sdk import Sandbox

sandbox = Sandbox(
    allowed_paths=["./src", "./tests"],
    denied_paths=["./secrets"]
)

agent = Agent(sandbox=sandbox)
```

### Network Restrictions

```python
sandbox = Sandbox(
    network_access=False
)
```

### Resource Limits

```python
sandbox = Sandbox(
    max_file_size=1024 * 1024,  # 1MB
    max_files=100
)
```

## Error Handling

```python
from claude_agent_sdk import AgentError, TimeoutError, PermissionError

try:
    result = agent.run("Complex task", timeout=60)
except TimeoutError:
    print("Task took too long")
except PermissionError as e:
    print(f"Permission denied: {e.tool} - {e.reason}")
except AgentError as e:
    print(f"Agent error: {e}")
```

## Async Support

```python
import asyncio
from claude_agent_sdk import AsyncAgent

async def main():
    agent = AsyncAgent()

    result = await agent.run("Create unit tests")
    print(result.output)

    # Or stream
    async for event in agent.stream("Build feature"):
        print(event)

asyncio.run(main())
```

## Context Management

```python
from claude_agent_sdk import Context

# Add context before running
context = Context()
context.add_file("./README.md")
context.add_text("Project uses Python 3.11")

agent = Agent(context=context)
```

## Output Parsing

```python
result = agent.run(
    prompt="List all TODO comments",
    output_format="json"
)

import json
todos = json.loads(result.output)
```

## Callbacks

```python
def on_tool_use(tool: str, input: dict):
    print(f"About to use: {tool}")
    return True  # Allow

def on_tool_result(tool: str, output: str):
    print(f"Tool {tool} returned: {output[:100]}")

agent = Agent(
    on_tool_use=on_tool_use,
    on_tool_result=on_tool_result
)
```

## Examples

### Code Review Bot

```python
def review_pr(diff: str) -> dict:
    agent = Agent(model="claude-opus-4-5-20251101")

    result = agent.run(
        prompt=f"""Review this pull request:

{diff}

Provide:
1. Summary of changes
2. Potential issues
3. Suggestions for improvement""",
        output_format="json"
    )

    return json.loads(result.output)
```

### Test Generator

```python
def generate_tests(file_path: str) -> str:
    agent = Agent()

    result = agent.run(
        prompt=f"Generate comprehensive unit tests for {file_path}",
        tools=["read", "write"],
        working_directory="./tests"
    )

    return result.files_modified[0] if result.files_modified else None
```

## Next Steps

- [TypeScript SDK](/sdk/typescript)
- [Use Cases](/sdk/use-cases)
- [CI/CD Integration](/guides/ci-cd)
