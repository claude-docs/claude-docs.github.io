---
sidebar_position: 10
title: Multi-Agent Architecture Patterns
description: Advanced patterns for multi-agent orchestration with Claude Code
---

# Multi-Agent Architecture Patterns

Build sophisticated multi-agent systems for complex development workflows. This guide covers agent types, communication patterns, orchestration frameworks, and cost optimization strategies.

## Understanding Subagents

Claude Code can spawn specialized subagents to handle different aspects of development. Each subagent runs in its own context with specific capabilities.

### Built-in Subagent Types

#### Plan Subagent

The Plan subagent focuses on architectural thinking and task decomposition:

```text
> Use plan mode to design the authentication system architecture
```

Characteristics:
- Uses more expensive models for complex reasoning
- Maintains planning context separate from implementation
- Can resume and iterate on plans
- Ideal for breaking down complex features

#### Explore Subagent

Fast, cost-effective codebase navigation:

```text
> Explore how the payment processing works in this codebase
```

Characteristics:
- Uses Haiku model for speed and cost efficiency
- Read-only access to codebase
- Optimized for search and understanding
- Returns structured findings to main agent

### Subagent Capabilities Matrix

| Subagent | Model | Tools | Best For |
|----------|-------|-------|----------|
| Plan | Opus/Sonnet | Read, Think | Architecture, design decisions |
| Explore | Haiku | Read, Grep, Glob | Code search, understanding |
| Implement | Sonnet | Read, Write, Bash | Code changes |
| Review | Opus | Read, Grep | Quality assurance |
| Test | Sonnet | Read, Write, Bash | Test creation |

## Custom Subagent Creation

### JSON Configuration

Create specialized agents in `.claude/agents/`:

```json title=".claude/agents/security-reviewer.json"
{
  "name": "security-reviewer",
  "description": "Security-focused code reviewer",
  "model": "claude-opus-4-5-20251101",
  "systemPrompt": "You are a senior security engineer. Focus on:\n- OWASP Top 10 vulnerabilities\n- Input validation gaps\n- Authentication/authorization issues\n- Injection vulnerabilities\n- Secrets exposure\n\nProvide severity ratings and remediation steps.",
  "tools": ["read", "grep", "glob"],
  "maxTokens": 8192,
  "temperature": 0.1
}
```

```json title=".claude/agents/performance-analyst.json"
{
  "name": "performance-analyst",
  "description": "Performance and optimization specialist",
  "model": "claude-sonnet-4-5-20250929",
  "systemPrompt": "You are a performance engineer. Analyze code for:\n- Time complexity issues\n- Memory leaks\n- N+1 queries\n- Unnecessary computations\n- Cache opportunities\n\nProvide benchmarking suggestions.",
  "tools": ["read", "grep", "glob"],
  "maxTokens": 4096
}
```

```json title=".claude/agents/documentation-writer.json"
{
  "name": "documentation-writer",
  "description": "Technical documentation specialist",
  "model": "claude-sonnet-4-5-20250929",
  "systemPrompt": "You are a technical writer. Create clear, comprehensive documentation following:\n- API documentation standards\n- JSDoc/TSDoc conventions\n- README best practices\n- Architecture decision records (ADR) format",
  "tools": ["read", "write", "grep"],
  "maxTokens": 4096
}
```

### Invoking Custom Agents

```text
> Use the security-reviewer agent to audit the authentication module

> Ask the performance-analyst to review the database queries in src/db/

> Have the documentation-writer create API docs for the user service
```

### SDK-Based Custom Agents

Create programmatic agents with the TypeScript SDK:

```typescript title="agents/code-reviewer.ts"
import { Agent, AgentConfig } from "@anthropic-ai/claude-agent-sdk";

interface ReviewResult {
  summary: string;
  issues: Array<{
    severity: "critical" | "high" | "medium" | "low";
    file: string;
    line: number;
    description: string;
    suggestion: string;
  }>;
  score: number;
}

export async function createReviewAgent(): Promise<Agent> {
  const config: AgentConfig = {
    model: "claude-opus-4-5-20251101",
    systemPrompt: `You are an expert code reviewer. Analyze code for:
    - Bugs and potential errors
    - Code style and readability
    - Performance issues
    - Security vulnerabilities
    - Test coverage gaps

    Return structured JSON with your findings.`,
    maxTokens: 8192,
    timeout: 180000
  };

  return new Agent(config);
}

export async function reviewCode(
  agent: Agent,
  files: string[]
): Promise<ReviewResult> {
  const result = await agent.run({
    prompt: `Review these files: ${files.join(", ")}`,
    tools: ["read", "grep"],
    outputFormat: "json"
  });

  return JSON.parse(result.output);
}
```

```typescript title="agents/test-generator.ts"
import { Agent, AgentConfig } from "@anthropic-ai/claude-agent-sdk";

export async function createTestAgent(
  framework: "jest" | "vitest" | "pytest" | "mocha"
): Promise<Agent> {
  const config: AgentConfig = {
    model: "claude-sonnet-4-5-20250929",
    systemPrompt: `You are a test automation expert using ${framework}.

    Generate comprehensive tests including:
    - Unit tests for individual functions
    - Integration tests for modules
    - Edge cases and error conditions
    - Mocking strategies for dependencies

    Follow ${framework} best practices and conventions.`,
    maxTokens: 4096
  };

  return new Agent(config);
}

export async function generateTests(
  agent: Agent,
  sourceFile: string,
  outputDir: string
): Promise<string[]> {
  const result = await agent.run({
    prompt: `Generate tests for ${sourceFile}`,
    tools: ["read", "write"],
    workingDirectory: outputDir
  });

  return result.filesModified;
}
```

## Agent Communication Patterns

### Direct Messaging

Agents pass results directly to each other:

```typescript title="patterns/direct-messaging.ts"
import { Agent } from "@anthropic-ai/claude-agent-sdk";

async function directMessagePipeline(task: string): Promise<string> {
  const planAgent = new Agent({ model: "claude-opus-4-5-20251101" });
  const implementAgent = new Agent({ model: "claude-sonnet-4-5-20250929" });
  const reviewAgent = new Agent({ model: "claude-opus-4-5-20251101" });

  // Plan phase
  const plan = await planAgent.run({
    prompt: `Create implementation plan for: ${task}`,
    tools: ["read"]
  });

  // Implement phase - receives plan as context
  const implementation = await implementAgent.run({
    prompt: `Implement based on this plan:\n\n${plan.output}`,
    tools: ["read", "write", "bash"]
  });

  // Review phase - receives implementation as context
  const review = await reviewAgent.run({
    prompt: `Review this implementation:\n\nPlan: ${plan.output}\n\nChanges: ${implementation.filesModified.join(", ")}`,
    tools: ["read", "grep"]
  });

  return review.output;
}
```

### Shared State Pattern

Agents communicate through a shared state file:

```typescript title="patterns/shared-state.ts"
import { Agent } from "@anthropic-ai/claude-agent-sdk";
import * as fs from "fs";

interface AgentState {
  phase: string;
  completedTasks: string[];
  pendingTasks: string[];
  context: Record<string, unknown>;
  errors: string[];
}

const STATE_FILE = ".claude/agent-state.json";

function loadState(): AgentState {
  if (fs.existsSync(STATE_FILE)) {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  }
  return {
    phase: "init",
    completedTasks: [],
    pendingTasks: [],
    context: {},
    errors: []
  };
}

function saveState(state: AgentState): void {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

async function runWithSharedState(
  agent: Agent,
  task: string,
  taskId: string
): Promise<void> {
  const state = loadState();

  try {
    const result = await agent.run({
      prompt: `${task}\n\nCurrent context: ${JSON.stringify(state.context)}`,
      tools: ["read", "write"]
    });

    state.completedTasks.push(taskId);
    state.context[taskId] = result.output;

  } catch (error) {
    state.errors.push(`${taskId}: ${error}`);
  }

  saveState(state);
}
```

### Event-Based Communication

Agents emit and listen to events:

```typescript title="patterns/event-based.ts"
import { EventEmitter } from "events";
import { Agent } from "@anthropic-ai/claude-agent-sdk";

const agentBus = new EventEmitter();

interface AgentEvent {
  source: string;
  type: "started" | "completed" | "error" | "progress";
  payload: unknown;
}

async function createEventDrivenAgent(
  name: string,
  config: object
): Promise<void> {
  const agent = new Agent(config);

  // Listen for tasks
  agentBus.on(`task:${name}`, async (task: string) => {
    agentBus.emit("agent:event", {
      source: name,
      type: "started",
      payload: { task }
    } as AgentEvent);

    try {
      const result = await agent.run({ prompt: task });

      agentBus.emit("agent:event", {
        source: name,
        type: "completed",
        payload: result.output
      } as AgentEvent);

    } catch (error) {
      agentBus.emit("agent:event", {
        source: name,
        type: "error",
        payload: error
      } as AgentEvent);
    }
  });
}

// Coordinator listens to all events
agentBus.on("agent:event", (event: AgentEvent) => {
  console.log(`[${event.source}] ${event.type}: ${JSON.stringify(event.payload)}`);

  // Trigger follow-up tasks based on events
  if (event.type === "completed" && event.source === "planner") {
    agentBus.emit("task:implementer", event.payload);
  }
});
```

## Task Decomposition Strategies

### Hierarchical Decomposition

Break complex tasks into subtasks with parent-child relationships:

```typescript title="decomposition/hierarchical.ts"
interface Task {
  id: string;
  description: string;
  parentId: string | null;
  children: string[];
  status: "pending" | "in_progress" | "completed";
  assignedAgent: string | null;
  result: unknown;
}

class TaskManager {
  private tasks: Map<string, Task> = new Map();

  createTask(description: string, parentId: string | null = null): string {
    const id = `task_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const task: Task = {
      id,
      description,
      parentId,
      children: [],
      status: "pending",
      assignedAgent: null,
      result: null
    };

    this.tasks.set(id, task);

    if (parentId) {
      const parent = this.tasks.get(parentId);
      if (parent) {
        parent.children.push(id);
      }
    }

    return id;
  }

  async decomposeTask(taskId: string, agent: Agent): Promise<string[]> {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    const result = await agent.run({
      prompt: `Decompose this task into subtasks: ${task.description}

      Return a JSON array of subtask descriptions.`,
      outputFormat: "json"
    });

    const subtasks = JSON.parse(result.output) as string[];

    return subtasks.map(desc => this.createTask(desc, taskId));
  }

  getExecutableTask(): Task | null {
    // Find tasks with no incomplete children
    for (const task of this.tasks.values()) {
      if (task.status !== "pending") continue;

      const hasIncompleteChildren = task.children.some(childId => {
        const child = this.tasks.get(childId);
        return child && child.status !== "completed";
      });

      if (!hasIncompleteChildren) {
        return task;
      }
    }

    return null;
  }
}
```

### Domain-Based Decomposition

Split tasks by domain expertise:

```typescript title="decomposition/domain-based.ts"
type Domain = "frontend" | "backend" | "database" | "devops" | "security";

interface DomainTask {
  domain: Domain;
  description: string;
  dependencies: string[];
}

function classifyTask(description: string): Domain {
  const keywords: Record<Domain, string[]> = {
    frontend: ["react", "vue", "css", "ui", "component", "page", "style"],
    backend: ["api", "endpoint", "controller", "service", "handler"],
    database: ["query", "migration", "schema", "model", "table"],
    devops: ["deploy", "ci", "docker", "kubernetes", "pipeline"],
    security: ["auth", "permission", "encrypt", "token", "vulnerability"]
  };

  const lowerDesc = description.toLowerCase();

  for (const [domain, words] of Object.entries(keywords)) {
    if (words.some(word => lowerDesc.includes(word))) {
      return domain as Domain;
    }
  }

  return "backend"; // Default
}

async function decomposeByDomain(
  plannerAgent: Agent,
  task: string
): Promise<DomainTask[]> {
  const result = await plannerAgent.run({
    prompt: `Break this task into domain-specific subtasks:

    Task: ${task}

    Domains: frontend, backend, database, devops, security

    Return JSON array with: domain, description, dependencies (other task indices)`,
    outputFormat: "json"
  });

  return JSON.parse(result.output);
}
```

### Capability-Based Decomposition

Route tasks based on required capabilities:

```typescript title="decomposition/capability-based.ts"
type Capability =
  | "code_generation"
  | "code_review"
  | "testing"
  | "documentation"
  | "refactoring"
  | "debugging";

interface CapabilityAgent {
  capabilities: Capability[];
  agent: Agent;
  currentLoad: number;
  maxLoad: number;
}

class CapabilityRouter {
  private agents: CapabilityAgent[] = [];

  registerAgent(
    capabilities: Capability[],
    config: object,
    maxLoad: number = 3
  ): void {
    this.agents.push({
      capabilities,
      agent: new Agent(config),
      currentLoad: 0,
      maxLoad
    });
  }

  findAgent(requiredCapabilities: Capability[]): CapabilityAgent | null {
    return this.agents.find(a =>
      requiredCapabilities.every(cap => a.capabilities.includes(cap)) &&
      a.currentLoad < a.maxLoad
    ) ?? null;
  }

  async routeTask(
    task: string,
    requiredCapabilities: Capability[]
  ): Promise<string> {
    const agentWrapper = this.findAgent(requiredCapabilities);

    if (!agentWrapper) {
      throw new Error(`No agent available for capabilities: ${requiredCapabilities}`);
    }

    agentWrapper.currentLoad++;

    try {
      const result = await agentWrapper.agent.run({ prompt: task });
      return result.output;
    } finally {
      agentWrapper.currentLoad--;
    }
  }
}

// Usage
const router = new CapabilityRouter();

router.registerAgent(
  ["code_generation", "refactoring"],
  { model: "claude-sonnet-4-5-20250929" }
);

router.registerAgent(
  ["code_review", "debugging"],
  { model: "claude-opus-4-5-20251101" }
);

router.registerAgent(
  ["testing", "documentation"],
  { model: "claude-sonnet-4-5-20250929" }
);
```

## Context Sharing Between Agents

### Explicit Context Passing

```typescript title="context/explicit-passing.ts"
interface SharedContext {
  projectStructure: string;
  conventions: string;
  recentChanges: string[];
  relevantFiles: string[];
}

async function buildSharedContext(
  explorerAgent: Agent
): Promise<SharedContext> {
  const structure = await explorerAgent.run({
    prompt: "Describe the project structure",
    tools: ["read", "glob"]
  });

  const conventions = await explorerAgent.run({
    prompt: "What coding conventions does this project follow?",
    tools: ["read", "grep"]
  });

  return {
    projectStructure: structure.output,
    conventions: conventions.output,
    recentChanges: [],
    relevantFiles: []
  };
}

async function runWithContext(
  agent: Agent,
  task: string,
  context: SharedContext
): Promise<string> {
  const contextPrompt = `
## Project Context

### Structure
${context.projectStructure}

### Conventions
${context.conventions}

### Recent Changes
${context.recentChanges.join("\n")}

### Relevant Files
${context.relevantFiles.join(", ")}

## Task
${task}`;

  const result = await agent.run({ prompt: contextPrompt });
  return result.output;
}
```

### Context Files

Use files as shared context between agents:

```typescript title="context/file-based.ts"
const CONTEXT_DIR = ".claude/context";

async function writeContext(
  key: string,
  content: string
): Promise<void> {
  const fs = await import("fs/promises");
  await fs.mkdir(CONTEXT_DIR, { recursive: true });
  await fs.writeFile(`${CONTEXT_DIR}/${key}.md`, content);
}

async function readContext(key: string): Promise<string> {
  const fs = await import("fs/promises");
  try {
    return await fs.readFile(`${CONTEXT_DIR}/${key}.md`, "utf-8");
  } catch {
    return "";
  }
}

// Each agent reads/writes context files
async function agentWithFileContext(
  agent: Agent,
  task: string,
  contextKeys: string[]
): Promise<string> {
  // Read relevant context
  const contextParts = await Promise.all(
    contextKeys.map(async key => {
      const content = await readContext(key);
      return content ? `## ${key}\n${content}` : "";
    })
  );

  const result = await agent.run({
    prompt: `${contextParts.join("\n\n")}\n\n## Task\n${task}`
  });

  return result.output;
}
```

### Memory Systems

Implement agent memory for long-running workflows:

```typescript title="context/memory-system.ts"
interface Memory {
  timestamp: number;
  type: "fact" | "decision" | "learning" | "error";
  content: string;
  tags: string[];
  importance: number;
}

class AgentMemory {
  private memories: Memory[] = [];
  private maxMemories: number = 1000;

  remember(
    type: Memory["type"],
    content: string,
    tags: string[] = [],
    importance: number = 0.5
  ): void {
    this.memories.push({
      timestamp: Date.now(),
      type,
      content,
      tags,
      importance
    });

    // Prune low-importance memories if over limit
    if (this.memories.length > this.maxMemories) {
      this.memories.sort((a, b) => b.importance - a.importance);
      this.memories = this.memories.slice(0, this.maxMemories);
    }
  }

  recall(tags: string[], limit: number = 10): Memory[] {
    return this.memories
      .filter(m => tags.some(t => m.tags.includes(t)))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, limit);
  }

  getRecentMemories(count: number = 10): Memory[] {
    return [...this.memories]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, count);
  }

  toPromptContext(): string {
    const recent = this.getRecentMemories(5);
    const important = this.memories
      .filter(m => m.importance > 0.8)
      .slice(0, 5);

    const uniqueMemories = [...new Map(
      [...recent, ...important].map(m => [m.content, m])
    ).values()];

    return uniqueMemories
      .map(m => `[${m.type}] ${m.content}`)
      .join("\n");
  }
}
```

## Cost Optimization with Agent Routing

### Model Selection Strategy

```typescript title="optimization/model-selection.ts"
type TaskComplexity = "trivial" | "simple" | "moderate" | "complex" | "expert";

interface CostConfig {
  model: string;
  maxTokens: number;
  estimatedCostPer1KTokens: number;
}

const MODEL_CONFIGS: Record<TaskComplexity, CostConfig> = {
  trivial: {
    model: "claude-haiku-3-5-sonnet-20240307",
    maxTokens: 1024,
    estimatedCostPer1KTokens: 0.00025
  },
  simple: {
    model: "claude-haiku-3-5-sonnet-20240307",
    maxTokens: 2048,
    estimatedCostPer1KTokens: 0.00025
  },
  moderate: {
    model: "claude-sonnet-4-5-20250929",
    maxTokens: 4096,
    estimatedCostPer1KTokens: 0.003
  },
  complex: {
    model: "claude-sonnet-4-5-20250929",
    maxTokens: 8192,
    estimatedCostPer1KTokens: 0.003
  },
  expert: {
    model: "claude-opus-4-5-20251101",
    maxTokens: 8192,
    estimatedCostPer1KTokens: 0.015
  }
};

function classifyComplexity(task: string): TaskComplexity {
  const taskLower = task.toLowerCase();

  // Expert: Architecture, security review, complex debugging
  if (taskLower.match(/architect|design system|security audit|debug.*complex/)) {
    return "expert";
  }

  // Complex: Multi-file changes, refactoring
  if (taskLower.match(/refactor|multiple files|integrate|migration/)) {
    return "complex";
  }

  // Moderate: Single feature implementation
  if (taskLower.match(/implement|create|build|add feature/)) {
    return "moderate";
  }

  // Simple: Small changes, fixes
  if (taskLower.match(/fix|update|change|modify/)) {
    return "simple";
  }

  // Trivial: Questions, exploration
  return "trivial";
}

async function costOptimizedRun(
  task: string
): Promise<{ output: string; estimatedCost: number }> {
  const complexity = classifyComplexity(task);
  const config = MODEL_CONFIGS[complexity];

  const agent = new Agent({
    model: config.model,
    maxTokens: config.maxTokens
  });

  const result = await agent.run({ prompt: task });

  // Rough cost estimate
  const tokensUsed = result.tokensUsed ?? config.maxTokens;
  const estimatedCost = (tokensUsed / 1000) * config.estimatedCostPer1KTokens;

  return {
    output: result.output,
    estimatedCost
  };
}
```

### Budget-Aware Orchestration

```typescript title="optimization/budget-aware.ts"
interface BudgetConfig {
  maxDailyBudget: number;
  warningThreshold: number;
  preferCheapModels: boolean;
}

class BudgetAwareOrchestrator {
  private dailySpend: number = 0;
  private config: BudgetConfig;

  constructor(config: BudgetConfig) {
    this.config = config;
  }

  async runTask(
    task: string,
    requiredComplexity: TaskComplexity
  ): Promise<string> {
    const remainingBudget = this.config.maxDailyBudget - this.dailySpend;

    if (remainingBudget <= 0) {
      throw new Error("Daily budget exhausted");
    }

    // Downgrade model if budget is tight
    let actualComplexity = requiredComplexity;
    if (this.config.preferCheapModels || remainingBudget < this.config.warningThreshold) {
      actualComplexity = this.downgradeComplexity(requiredComplexity);
    }

    const config = MODEL_CONFIGS[actualComplexity];
    const agent = new Agent({
      model: config.model,
      maxTokens: config.maxTokens
    });

    const result = await agent.run({ prompt: task });

    // Track spending
    const tokensUsed = result.tokensUsed ?? config.maxTokens;
    const cost = (tokensUsed / 1000) * config.estimatedCostPer1KTokens;
    this.dailySpend += cost;

    return result.output;
  }

  private downgradeComplexity(complexity: TaskComplexity): TaskComplexity {
    const levels: TaskComplexity[] = ["trivial", "simple", "moderate", "complex", "expert"];
    const currentIndex = levels.indexOf(complexity);
    return levels[Math.max(0, currentIndex - 1)];
  }

  getBudgetStatus(): { spent: number; remaining: number; percentage: number } {
    return {
      spent: this.dailySpend,
      remaining: this.config.maxDailyBudget - this.dailySpend,
      percentage: (this.dailySpend / this.config.maxDailyBudget) * 100
    };
  }
}
```

### Caching Strategies

```typescript title="optimization/caching.ts"
import * as crypto from "crypto";

interface CacheEntry {
  result: string;
  timestamp: number;
  model: string;
  tokensUsed: number;
}

class AgentCache {
  private cache: Map<string, CacheEntry> = new Map();
  private ttl: number = 3600000; // 1 hour

  private hashPrompt(prompt: string, model: string): string {
    return crypto
      .createHash("sha256")
      .update(`${model}:${prompt}`)
      .digest("hex");
  }

  get(prompt: string, model: string): CacheEntry | null {
    const key = this.hashPrompt(prompt, model);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry;
  }

  set(prompt: string, model: string, result: string, tokensUsed: number): void {
    const key = this.hashPrompt(prompt, model);
    this.cache.set(key, {
      result,
      timestamp: Date.now(),
      model,
      tokensUsed
    });
  }

  getStats(): { hits: number; misses: number; hitRate: number } {
    // Implementation would track actual hits/misses
    return { hits: 0, misses: 0, hitRate: 0 };
  }
}

const cache = new AgentCache();

async function cachedAgentRun(
  agent: Agent,
  prompt: string
): Promise<string> {
  const model = agent.config.model;
  const cached = cache.get(prompt, model);

  if (cached) {
    return cached.result;
  }

  const result = await agent.run({ prompt });
  cache.set(prompt, model, result.output, result.tokensUsed ?? 0);

  return result.output;
}
```

## Error Handling Across Agents

### Retry Strategies

```typescript title="errors/retry-strategies.ts"
interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig
): Promise<T> {
  let lastError: Error | null = null;
  let delay = config.baseDelayMs;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < config.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * config.backoffMultiplier, config.maxDelayMs);
      }
    }
  }

  throw lastError;
}

// Usage
async function reliableAgentRun(agent: Agent, task: string): Promise<string> {
  return withRetry(
    () => agent.run({ prompt: task }).then(r => r.output),
    {
      maxRetries: 3,
      baseDelayMs: 1000,
      maxDelayMs: 30000,
      backoffMultiplier: 2
    }
  );
}
```

### Fallback Chains

```typescript title="errors/fallback-chains.ts"
interface AgentFallback {
  agent: Agent;
  name: string;
}

async function runWithFallbacks(
  task: string,
  fallbacks: AgentFallback[]
): Promise<{ output: string; usedAgent: string }> {
  const errors: Array<{ agent: string; error: string }> = [];

  for (const { agent, name } of fallbacks) {
    try {
      const result = await agent.run({ prompt: task });
      return { output: result.output, usedAgent: name };
    } catch (error) {
      errors.push({ agent: name, error: String(error) });
    }
  }

  throw new Error(
    `All agents failed:\n${errors.map(e => `${e.agent}: ${e.error}`).join("\n")}`
  );
}

// Usage
const fallbacks: AgentFallback[] = [
  { agent: new Agent({ model: "claude-opus-4-5-20251101" }), name: "opus" },
  { agent: new Agent({ model: "claude-sonnet-4-5-20250929" }), name: "sonnet" },
  { agent: new Agent({ model: "claude-haiku-3-5-sonnet-20240307" }), name: "haiku" }
];

const result = await runWithFallbacks("Complex task", fallbacks);
```

### Error Recovery Patterns

```typescript title="errors/recovery-patterns.ts"
import { AgentError, TimeoutError, PermissionError } from "@anthropic-ai/claude-agent-sdk";

interface RecoveryStrategy {
  canHandle: (error: Error) => boolean;
  recover: (error: Error, task: string) => Promise<string>;
}

const recoveryStrategies: RecoveryStrategy[] = [
  {
    // Timeout: Simplify task and retry
    canHandle: (error) => error instanceof TimeoutError,
    recover: async (error, task) => {
      const simplerTask = `Briefly: ${task.slice(0, 500)}`;
      const agent = new Agent({ timeout: 120000 });
      const result = await agent.run({ prompt: simplerTask });
      return result.output;
    }
  },
  {
    // Permission: Retry without restricted tools
    canHandle: (error) => error instanceof PermissionError,
    recover: async (error, task) => {
      const agent = new Agent();
      const result = await agent.run({
        prompt: task,
        tools: ["read", "grep"] // Read-only
      });
      return result.output;
    }
  },
  {
    // Generic: Use a more capable model
    canHandle: () => true,
    recover: async (error, task) => {
      const agent = new Agent({ model: "claude-opus-4-5-20251101" });
      const result = await agent.run({
        prompt: `Previous attempt failed with: ${error.message}\n\nTask: ${task}`
      });
      return result.output;
    }
  }
];

async function runWithRecovery(task: string): Promise<string> {
  const agent = new Agent();

  try {
    const result = await agent.run({ prompt: task });
    return result.output;
  } catch (error) {
    for (const strategy of recoveryStrategies) {
      if (strategy.canHandle(error as Error)) {
        return await strategy.recover(error as Error, task);
      }
    }
    throw error;
  }
}
```

## Agent Orchestration Frameworks

### Claude Squad

Terminal-based multi-agent management:

```bash title="Setup Claude Squad"
# Install
npm install -g claude-squad

# Initialize in project
cs init

# Configure agents
cs config set agents.count 4
cs config set agents.model claude-sonnet-4-5-20250929
```

```bash title="Using Claude Squad"
# Start a squad session
cs start

# Assign tasks to agents
cs assign 1 "Implement user authentication"
cs assign 2 "Create API endpoints"
cs assign 3 "Write unit tests"
cs assign 4 "Update documentation"

# Monitor progress
cs status

# View agent output
cs logs 1

# Coordinate handoffs
cs handoff 1 2 "Auth complete, ready for API integration"
```

Claude Squad Configuration:

```yaml title=".claude-squad/config.yml"
agents:
  count: 4
  model: claude-sonnet-4-5-20250929

workspaces:
  - name: frontend
    path: ./frontend
    agent: 1
  - name: backend
    path: ./backend
    agent: 2
  - name: tests
    path: ./tests
    agent: 3
  - name: docs
    path: ./docs
    agent: 4

coordination:
  shared_context: true
  auto_handoff: false
  conflict_resolution: manual

git:
  worktrees: true
  auto_branch: true
  branch_prefix: agent
```

### Claude-Flow

Advanced swarm orchestration:

```bash title="Setup Claude-Flow"
# Install
npm install -g claude-flow

# Initialize project
claude-flow init

# Configure orchestration
claude-flow configure
```

```yaml title=".claude-flow/config.yml"
orchestration:
  mode: swarm  # swarm, pipeline, hybrid
  max_agents: 10

agents:
  planner:
    model: claude-opus-4-5-20251101
    role: coordinator
    capabilities: [planning, review]

  implementers:
    count: 4
    model: claude-sonnet-4-5-20250929
    role: worker
    capabilities: [coding, testing]

  specialists:
    security:
      model: claude-opus-4-5-20251101
      capabilities: [security_review]
    performance:
      model: claude-sonnet-4-5-20250929
      capabilities: [performance_analysis]

workflows:
  feature_development:
    steps:
      - agent: planner
        action: decompose_task
      - agents: implementers
        action: parallel_implement
        distribute: round_robin
      - agent: specialists.security
        action: security_review
      - agent: planner
        action: integration_review

communication:
  method: event_bus
  persistence: redis

monitoring:
  enabled: true
  dashboard_port: 3000
```

```bash title="Claude-Flow Commands"
# Start orchestration
claude-flow start "Implement payment processing system"

# Monitor swarm
claude-flow dashboard

# View agent status
claude-flow agents list
claude-flow agents status implementer-1

# Manual intervention
claude-flow agents pause implementer-2
claude-flow agents resume implementer-2

# Emergency stop
claude-flow stop --all
```

### Building Your Own Orchestrator

```typescript title="orchestrator/custom-orchestrator.ts"
import { Agent, AgentConfig } from "@anthropic-ai/claude-agent-sdk";
import { EventEmitter } from "events";

type AgentRole = "planner" | "implementer" | "reviewer" | "specialist";

interface OrchestratorAgent {
  id: string;
  role: AgentRole;
  agent: Agent;
  status: "idle" | "busy" | "error";
  currentTask: string | null;
}

interface Task {
  id: string;
  description: string;
  requiredRole: AgentRole;
  priority: number;
  dependencies: string[];
  status: "pending" | "in_progress" | "completed" | "failed";
  result: string | null;
}

class CustomOrchestrator extends EventEmitter {
  private agents: Map<string, OrchestratorAgent> = new Map();
  private taskQueue: Task[] = [];
  private completedTasks: Map<string, Task> = new Map();

  registerAgent(id: string, role: AgentRole, config: AgentConfig): void {
    this.agents.set(id, {
      id,
      role,
      agent: new Agent(config),
      status: "idle",
      currentTask: null
    });
  }

  addTask(
    description: string,
    requiredRole: AgentRole,
    priority: number = 5,
    dependencies: string[] = []
  ): string {
    const id = `task_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    this.taskQueue.push({
      id,
      description,
      requiredRole,
      priority,
      dependencies,
      status: "pending",
      result: null
    });

    this.taskQueue.sort((a, b) => b.priority - a.priority);

    return id;
  }

  private findAvailableAgent(role: AgentRole): OrchestratorAgent | null {
    for (const agent of this.agents.values()) {
      if (agent.role === role && agent.status === "idle") {
        return agent;
      }
    }
    return null;
  }

  private canExecuteTask(task: Task): boolean {
    return task.dependencies.every(depId =>
      this.completedTasks.has(depId) &&
      this.completedTasks.get(depId)!.status === "completed"
    );
  }

  async runOnce(): Promise<void> {
    for (const task of this.taskQueue) {
      if (task.status !== "pending") continue;
      if (!this.canExecuteTask(task)) continue;

      const agent = this.findAvailableAgent(task.requiredRole);
      if (!agent) continue;

      // Execute task
      task.status = "in_progress";
      agent.status = "busy";
      agent.currentTask = task.id;

      this.emit("task:started", { taskId: task.id, agentId: agent.id });

      try {
        // Build context from dependencies
        const depContext = task.dependencies
          .map(depId => this.completedTasks.get(depId)?.result ?? "")
          .filter(Boolean)
          .join("\n\n");

        const prompt = depContext
          ? `Context from previous tasks:\n${depContext}\n\nNew task: ${task.description}`
          : task.description;

        const result = await agent.agent.run({ prompt });

        task.status = "completed";
        task.result = result.output;

        this.emit("task:completed", { taskId: task.id, result: result.output });

      } catch (error) {
        task.status = "failed";
        task.result = String(error);

        this.emit("task:failed", { taskId: task.id, error });
      }

      agent.status = "idle";
      agent.currentTask = null;

      // Move to completed
      this.completedTasks.set(task.id, task);
      this.taskQueue = this.taskQueue.filter(t => t.id !== task.id);
    }
  }

  async run(): Promise<void> {
    while (this.taskQueue.some(t => t.status === "pending")) {
      await this.runOnce();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  getStatus(): object {
    return {
      pendingTasks: this.taskQueue.filter(t => t.status === "pending").length,
      inProgressTasks: this.taskQueue.filter(t => t.status === "in_progress").length,
      completedTasks: this.completedTasks.size,
      agents: Array.from(this.agents.values()).map(a => ({
        id: a.id,
        role: a.role,
        status: a.status
      }))
    };
  }
}

// Usage
async function main(): Promise<void> {
  const orchestrator = new CustomOrchestrator();

  // Register agents
  orchestrator.registerAgent("planner-1", "planner", {
    model: "claude-opus-4-5-20251101"
  });
  orchestrator.registerAgent("impl-1", "implementer", {
    model: "claude-sonnet-4-5-20250929"
  });
  orchestrator.registerAgent("impl-2", "implementer", {
    model: "claude-sonnet-4-5-20250929"
  });
  orchestrator.registerAgent("reviewer-1", "reviewer", {
    model: "claude-opus-4-5-20251101"
  });

  // Add tasks
  const planId = orchestrator.addTask(
    "Create implementation plan for user authentication",
    "planner",
    10
  );

  const implId = orchestrator.addTask(
    "Implement the authentication module",
    "implementer",
    5,
    [planId]
  );

  orchestrator.addTask(
    "Review the authentication implementation",
    "reviewer",
    3,
    [implId]
  );

  // Monitor events
  orchestrator.on("task:started", (e) => console.log(`Started: ${e.taskId}`));
  orchestrator.on("task:completed", (e) => console.log(`Completed: ${e.taskId}`));
  orchestrator.on("task:failed", (e) => console.log(`Failed: ${e.taskId}`));

  // Run orchestration
  await orchestrator.run();

  console.log("Final status:", orchestrator.getStatus());
}
```

## Best Practices

### Agent Design Principles

1. **Single Responsibility**: Each agent should have one clear purpose
2. **Minimal Toolset**: Only grant tools necessary for the task
3. **Clear Boundaries**: Define what each agent can and cannot do
4. **Explicit Handoffs**: Make agent transitions deliberate

### Performance Guidelines

1. **Parallelize When Possible**: Run independent tasks concurrently
2. **Cache Aggressively**: Store and reuse results for identical queries
3. **Monitor Token Usage**: Track costs across all agents
4. **Set Timeouts**: Prevent runaway agents from consuming resources

### Reliability Patterns

1. **Idempotent Operations**: Design tasks that can be safely retried
2. **Checkpoint Progress**: Save intermediate state for recovery
3. **Graceful Degradation**: Fall back to simpler models when needed
4. **Health Monitoring**: Track agent success rates and latency

## Next Steps

- [Parallel Development](/guides/parallel-development) - Git worktrees and concurrent sessions
- [Agent SDK Overview](/sdk/overview) - Programmatic agent control
- [Cost Optimization](/guides/cost-optimization) - Reduce API costs
- [CI/CD Integration](/guides/ci-cd) - Automate with agents
