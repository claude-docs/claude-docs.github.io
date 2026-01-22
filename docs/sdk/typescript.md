---
sidebar_position: 3
title: TypeScript SDK
description: Claude Agent SDK for TypeScript and JavaScript
---

# TypeScript SDK

Complete guide to using the Claude Agent SDK with TypeScript and JavaScript.

## Installation

```bash
npm install @anthropic-ai/claude-agent-sdk
```

Or with yarn:

```bash
yarn add @anthropic-ai/claude-agent-sdk
```

## Basic Usage

### Simple Agent

```typescript
import { Agent } from "@anthropic-ai/claude-agent-sdk";

const agent = new Agent();
const result = await agent.run("Explain the code in main.ts");
console.log(result.output);
```

### With Configuration

```typescript
import { Agent, AgentConfig } from "@anthropic-ai/claude-agent-sdk";

const config: AgentConfig = {
  model: "claude-opus-4-5-20251101",
  timeout: 300000,
  maxTokens: 4096
};

const agent = new Agent(config);
```

## Agent Methods

### run()

Execute a task and wait for completion:

```typescript
const result = await agent.run({
  prompt: "Create an Express API",
  tools: ["read", "write", "bash"],
  workingDirectory: "./backend"
});

console.log(result.output);
console.log(result.filesModified);
console.log(result.commandsRun);
```

### stream()

Get real-time events:

```typescript
for await (const event of agent.stream("Build a REST API")) {
  switch (event.type) {
    case "thinking":
      console.log(`Thinking: ${event.content}`);
      break;
    case "tool_use":
      console.log(`Tool: ${event.tool} - ${JSON.stringify(event.input)}`);
      break;
    case "tool_result":
      console.log(`Result: ${event.output}`);
      break;
    case "text":
      console.log(event.content);
      break;
    case "done":
      console.log("Complete!");
      break;
  }
}
```

### chat()

Multi-turn conversation:

```typescript
const conversation = agent.chat();

const response1 = await conversation.send("What files are in this project?");
const response2 = await conversation.send("Explain the main entry point");
const response3 = await conversation.send("Add error handling");
```

## Tool Control

### Allowing Tools

```typescript
const result = await agent.run({
  prompt: "Review this code",
  tools: ["read", "grep"]  // Only read access
});
```

### Denying Tools

```typescript
const result = await agent.run({
  prompt: "Fix the bug",
  denyTools: ["bash"]  // Prevent shell access
});
```

### Custom Tools

```typescript
import { Tool, ToolInput } from "@anthropic-ai/claude-agent-sdk";

const getTime: Tool = {
  name: "get_time",
  description: "Get the current time",
  inputSchema: {
    type: "object",
    properties: {}
  },
  handler: async (input: ToolInput) => {
    return new Date().toISOString();
  }
};

const agent = new Agent({ customTools: [getTime] });
```

## Sandboxing

### Basic Sandbox

```typescript
import { Sandbox } from "@anthropic-ai/claude-agent-sdk";

const sandbox = new Sandbox({
  allowedPaths: ["./src", "./tests"],
  deniedPaths: ["./secrets"]
});

const agent = new Agent({ sandbox });
```

### Network Restrictions

```typescript
const sandbox = new Sandbox({
  networkAccess: false
});
```

### Resource Limits

```typescript
const sandbox = new Sandbox({
  maxFileSize: 1024 * 1024,  // 1MB
  maxFiles: 100
});
```

## Error Handling

```typescript
import {
  AgentError,
  TimeoutError,
  PermissionError
} from "@anthropic-ai/claude-agent-sdk";

try {
  const result = await agent.run({
    prompt: "Complex task",
    timeout: 60000
  });
} catch (error) {
  if (error instanceof TimeoutError) {
    console.log("Task took too long");
  } else if (error instanceof PermissionError) {
    console.log(`Permission denied: ${error.tool} - ${error.reason}`);
  } else if (error instanceof AgentError) {
    console.log(`Agent error: ${error.message}`);
  }
}
```

## Context Management

```typescript
import { Context } from "@anthropic-ai/claude-agent-sdk";

const context = new Context();
await context.addFile("./README.md");
context.addText("Project uses TypeScript 5.0");

const agent = new Agent({ context });
```

## Output Parsing

```typescript
const result = await agent.run({
  prompt: "List all TODO comments",
  outputFormat: "json"
});

const todos = JSON.parse(result.output);
```

## Callbacks

```typescript
const agent = new Agent({
  onToolUse: async (tool: string, input: object) => {
    console.log(`About to use: ${tool}`);
    return true;  // Allow
  },
  onToolResult: async (tool: string, output: string) => {
    console.log(`Tool ${tool} returned: ${output.slice(0, 100)}`);
  }
});
```

## Examples

### Code Review Bot

```typescript
async function reviewPR(diff: string): Promise<object> {
  const agent = new Agent({ model: "claude-opus-4-5-20251101" });

  const result = await agent.run({
    prompt: `Review this pull request:

${diff}

Provide:
1. Summary of changes
2. Potential issues
3. Suggestions for improvement`,
    outputFormat: "json"
  });

  return JSON.parse(result.output);
}
```

### Test Generator

```typescript
async function generateTests(filePath: string): Promise<string | null> {
  const agent = new Agent();

  const result = await agent.run({
    prompt: `Generate comprehensive unit tests for ${filePath}`,
    tools: ["read", "write"],
    workingDirectory: "./tests"
  });

  return result.filesModified[0] ?? null;
}
```

### Express Middleware

```typescript
import express from "express";
import { Agent } from "@anthropic-ai/claude-agent-sdk";

const app = express();
const agent = new Agent();

app.post("/api/review", async (req, res) => {
  const { code } = req.body;

  const result = await agent.run({
    prompt: `Review this code:\n\n${code}`,
    tools: ["grep"],
    outputFormat: "json"
  });

  res.json(JSON.parse(result.output));
});
```

## Next Steps

- [Python SDK](/sdk/python)
- [Use Cases](/sdk/use-cases)
- [CI/CD Integration](/guides/ci-cd)
