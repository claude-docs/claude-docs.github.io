---
sidebar_position: 6
title: Prompt Engineering
description: Effective prompting techniques for Claude Code CLI
---

# Prompt Engineering for CLI

Master the art of crafting effective prompts for Claude Code to get better results faster.

## Effective Prompt Structures

### The Context-Task-Format Pattern

Structure prompts with clear components:

```bash
# Context: What Claude needs to know
# Task: What you want done
# Format: How you want the output

claude "
Context: This is a React TypeScript project using Redux for state management.
Task: Add error handling to the fetchUsers action.
Format: Show me the complete updated file with comments explaining changes.
"
```

### Imperative vs Descriptive

Use imperative verbs for action, descriptive for analysis:

```bash
# Imperative - for changes
claude "Add input validation to the login form"
claude "Refactor the database module to use async/await"
claude "Fix the memory leak in the event handler"

# Descriptive - for analysis
claude "Explain how the authentication flow works"
claude "What are the potential security issues in this API?"
claude "Describe the data flow between these components"
```

### Scope Specification

Be explicit about scope:

```bash
# Too vague
claude "improve the code"

# Properly scoped
claude "improve error handling in src/api/users.ts, specifically the createUser function"

# Multi-file scope
claude "add TypeScript types to all files in src/utils/"
```

## Context Priming Techniques

### Project Context Priming

Start sessions with context:

```bash
# Initial context load
claude "
Before we begin, note:
- This is a Node.js Express API
- We use PostgreSQL with Prisma ORM
- Authentication uses JWT tokens
- All responses follow REST conventions

Now, let's work on adding a new endpoint for user profiles.
"
```

### File Context Priming

Reference specific files:

```bash
# Direct file reference
claude "Review src/auth/middleware.ts and suggest security improvements"

# Multiple file context
claude "
Looking at these files:
- src/models/User.ts
- src/services/UserService.ts
- src/controllers/UserController.ts

Add soft delete functionality throughout.
"
```

### Constraint Priming

Set boundaries upfront:

```bash
claude "
Constraints:
- Don't modify the public API signatures
- Keep backward compatibility
- Follow existing code style
- No new dependencies

Task: Optimize the search algorithm in src/search/engine.ts
"
```

### Pattern Priming

Show examples of desired patterns:

```bash
claude "
We follow this error handling pattern:

try {
  const result = await operation();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed', { error });
  return { success: false, error: error.message };
}

Apply this pattern to all functions in src/services/PaymentService.ts
"
```

## Multi-Step Instruction Patterns

### Sequential Steps

Break complex tasks into steps:

```bash
claude "
Implement user authentication in these steps:

1. Create the User model with email, passwordHash, and timestamps
2. Add a registration endpoint with email validation
3. Add a login endpoint that returns JWT tokens
4. Create auth middleware for protected routes

Execute each step, showing me the code after each one.
"
```

### Conditional Steps

Include decision points:

```bash
claude "
Analyze the test coverage:

1. Run the test suite and check coverage
2. If coverage is below 80%:
   - Identify untested functions
   - Generate tests for the top 5 most critical uncovered functions
3. If coverage is above 80%:
   - Focus on edge cases in existing tests
   - Add boundary condition tests
"
```

### Iterative Refinement

Build up solutions:

```bash
claude "
Let's build this feature iteratively:

Round 1: Create a basic working implementation
Round 2: Add error handling and validation
Round 3: Optimize for performance
Round 4: Add comprehensive tests

Start with Round 1.
"
```

### Checkpoint Pattern

Create explicit save points:

```bash
claude "
Implement the payment system with checkpoints:

CHECKPOINT 1: Basic Stripe integration
- Set up Stripe client
- Create payment intent endpoint
[Stop and verify before continuing]

CHECKPOINT 2: Webhook handling
- Add webhook endpoint
- Handle payment success/failure events
[Stop and verify before continuing]

CHECKPOINT 3: Subscription support
- Add subscription creation
- Handle subscription lifecycle events
"
```

## Code-Specific Prompting

### Function Generation

```bash
# Specify signature and behavior
claude "
Create a function with this signature:

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  baseDelay: number
): Promise<T>

Behavior:
- Retry failed operations up to maxRetries times
- Use exponential backoff starting at baseDelay ms
- Throw the last error if all retries fail
- Log each retry attempt
"
```

### Type Generation

```bash
# Generate types from examples
claude "
Generate TypeScript types for this API response:

{
  \"user\": {
    \"id\": 123,
    \"email\": \"user@example.com\",
    \"profile\": {
      \"name\": \"John\",
      \"avatar\": \"https://...\"
    }
  },
  \"permissions\": [\"read\", \"write\"],
  \"metadata\": {
    \"lastLogin\": \"2024-01-15T10:30:00Z\"
  }
}

Make all fields that could be null optional.
"
```

### Test Generation

```bash
# Comprehensive test prompts
claude "
Generate tests for src/utils/validation.ts:

Requirements:
- Use Jest with TypeScript
- Cover all exported functions
- Include edge cases: empty strings, null, undefined
- Include boundary conditions
- Test error messages match expected format
- Aim for 100% branch coverage
"
```

### Migration Generation

```bash
# Database migrations
claude "
Create a Prisma migration that:

1. Adds a 'preferences' JSONB column to the User table
2. Adds an index on 'email' for faster lookups
3. Creates a new 'AuditLog' table with:
   - id (UUID, primary key)
   - userId (foreign key to User)
   - action (string)
   - timestamp (datetime, default now)
   - metadata (JSONB, nullable)

Include both up and down migrations.
"
```

## Debugging Prompts

### Error Analysis

```bash
# With full error context
claude "
Debug this error:

Error: ECONNREFUSED 127.0.0.1:5432

Context:
- Running: npm run dev
- Environment: development
- Database: PostgreSQL in Docker
- Docker container status: running

Recent changes:
- Updated database connection string
- Added connection pooling

Find the root cause and fix.
"
```

### Trace-Based Debugging

```bash
# Provide execution trace
claude "
This function returns incorrect results:

Input: [3, 1, 4, 1, 5, 9, 2, 6]
Expected output: [1, 1, 2, 3, 4, 5, 6, 9]
Actual output: [9, 6, 5, 4, 3, 2, 1, 1]

Function is in src/utils/sort.ts

Debug step by step and fix the issue.
"
```

### Performance Debugging

```bash
claude "
This API endpoint is slow (>2s response time):

GET /api/users/search?q=john

Profile information:
- Database query: 1500ms
- JSON serialization: 300ms
- Network: 50ms

Relevant files:
- src/controllers/UserController.ts
- src/services/UserService.ts
- src/repositories/UserRepository.ts

Identify bottlenecks and optimize.
"
```

### Memory Leak Detection

```bash
claude "
Investigate potential memory leak:

Symptoms:
- Memory usage grows from 200MB to 2GB over 24 hours
- No obvious pattern in request types

Suspect areas:
- Event listeners in src/events/
- Cache implementation in src/cache/
- WebSocket connections in src/ws/

Analyze these areas and find the leak.
"
```

## Refactoring Prompts

### Pattern-Based Refactoring

```bash
claude "
Refactor src/api/*.ts from callbacks to async/await:

Current pattern:
function getData(callback) {
  db.query('SELECT *', (err, results) => {
    if (err) callback(err);
    else callback(null, results);
  });
}

Target pattern:
async function getData(): Promise<Data[]> {
  return await db.query('SELECT *');
}

Maintain all existing functionality and error handling.
"
```

### Extraction Refactoring

```bash
claude "
The UserController has grown too large (800+ lines).

Extract these concerns into separate modules:
1. Validation logic -> UserValidator.ts
2. Transformation logic -> UserTransformer.ts
3. Email sending -> UserNotificationService.ts

Keep the controller as a thin orchestration layer.
"
```

### Architecture Refactoring

```bash
claude "
Refactor from monolithic to layered architecture:

Current: Everything in src/routes/*.ts (logic + DB + validation)

Target:
- src/controllers/ - HTTP handling
- src/services/ - Business logic
- src/repositories/ - Data access
- src/validators/ - Input validation

Start with the user module as an example.
"
```

### Dependency Injection Refactoring

```bash
claude "
Add dependency injection to src/services/:

Current:
class UserService {
  private db = new Database();
  private cache = new RedisCache();
}

Target:
class UserService {
  constructor(
    private db: IDatabase,
    private cache: ICache
  ) {}
}

Create interfaces and update all instantiation points.
"
```

## Review Prompts

### Security Review

```bash
claude "
Security review for src/auth/:

Check for:
- SQL injection vulnerabilities
- XSS attack vectors
- CSRF protection
- Secure password handling
- JWT security (expiration, signing)
- Rate limiting
- Input sanitization

Format: List each issue with severity (Critical/High/Medium/Low) and fix.
"
```

### Performance Review

```bash
claude "
Performance review for src/api/search.ts:

Analyze:
- Algorithm complexity
- Database query efficiency
- Memory usage patterns
- Caching opportunities
- N+1 query problems
- Unnecessary computations

Provide specific optimization recommendations with expected impact.
"
```

### Code Quality Review

```bash
claude "
Code quality review for the last 5 commits:

Evaluate:
- SOLID principles adherence
- DRY violations
- Error handling completeness
- Test coverage
- Documentation quality
- Naming conventions
- Code complexity (cyclomatic)

Score each category 1-5 and provide specific improvement suggestions.
"
```

### Architecture Review

```bash
claude "
Architecture review for the entire project:

Examine:
- Module boundaries and coupling
- Dependency direction (no circular deps)
- Separation of concerns
- API design consistency
- Error handling strategy
- Logging and monitoring hooks
- Scalability considerations

Provide an architecture diagram and improvement roadmap.
"
```

## Prompt Templates

### Bug Fix Template

```bash
claude "
BUG FIX REQUEST

Summary: [Brief description]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected: [What should happen]
Actual: [What actually happens]

Relevant Files:
- [file1.ts]
- [file2.ts]

Error Output:
[Paste error here]

Fix this bug and add a regression test.
"
```

### Feature Implementation Template

```bash
claude "
FEATURE REQUEST

Feature: [Name]
Priority: [High/Medium/Low]

Description:
[Detailed description of the feature]

Acceptance Criteria:
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

Technical Requirements:
- [Requirement 1]
- [Requirement 2]

Affected Areas:
- [Component/Module 1]
- [Component/Module 2]

Implement this feature following existing patterns.
"
```

### Code Review Template

```bash
claude "
CODE REVIEW REQUEST

Files to Review:
- [file1.ts]
- [file2.ts]

Review Focus:
- [ ] Security vulnerabilities
- [ ] Performance issues
- [ ] Code style consistency
- [ ] Error handling
- [ ] Test coverage

Context:
[Brief context about the changes]

Provide feedback in this format:
[FILE:LINE] [SEVERITY] - Description of issue
Suggestion: How to fix
"
```

### Documentation Template

```bash
claude "
DOCUMENTATION REQUEST

Target: [File/Module/API]
Audience: [Developers/Users/Both]

Generate:
- [ ] JSDoc comments for all public APIs
- [ ] README with usage examples
- [ ] API reference documentation
- [ ] Architecture decision records

Style:
- Concise but complete
- Include code examples
- Note any gotchas or edge cases
"
```

## Advanced Techniques

### Chain of Thought

```bash
claude "
Think through this step by step:

Problem: Users report intermittent 500 errors on checkout.

1. First, analyze the checkout flow and identify all failure points
2. For each failure point, list possible causes
3. Rank causes by likelihood based on the 'intermittent' pattern
4. Propose investigation steps for the top 3 causes
5. Suggest fixes for each

Show your reasoning at each step.
"
```

### Few-Shot Learning

```bash
claude "
Follow this pattern for generating API endpoints:

Example 1:
Input: 'list all users'
Output:
GET /api/users
Returns: { users: User[], total: number }

Example 2:
Input: 'get user by id'
Output:
GET /api/users/:id
Returns: { user: User }

Now generate for:
Input: 'search users by email'
Input: 'update user preferences'
Input: 'delete user account'
"
```

### Constraint Satisfaction

```bash
claude "
Generate a solution that satisfies ALL constraints:

Must:
- Work with Node.js 18+
- Not add new dependencies
- Maintain backward compatibility
- Complete in under 100ms
- Use less than 50MB memory

Should:
- Follow existing code style
- Include error handling
- Be testable

Nice to have:
- Support streaming
- Allow cancellation

Task: Implement batch user import from CSV
"
```

### Comparative Analysis

```bash
claude "
Compare these two approaches for implementing caching:

Approach A: Redis-based distributed cache
Approach B: In-memory LRU cache

Evaluate on:
- Performance (latency, throughput)
- Scalability
- Complexity
- Cost
- Failure modes

Recommend which to use for our use case:
- 10K requests/second
- 50MB cache size
- 3 server instances
- Cost-sensitive
"
```

## Quick Reference

### Prompt Prefixes

| Prefix | Use Case | Example |
|--------|----------|---------|
| `Fix:` | Bug fixes | `Fix: null pointer in user lookup` |
| `Add:` | New features | `Add: email verification flow` |
| `Refactor:` | Code improvement | `Refactor: extract validation logic` |
| `Review:` | Code analysis | `Review: security of auth module` |
| `Explain:` | Understanding | `Explain: how the cache works` |
| `Test:` | Test generation | `Test: cover edge cases in parser` |
| `Doc:` | Documentation | `Doc: add JSDoc to public APIs` |

### Quality Modifiers

```bash
# Thoroughness
claude "thoroughly review..."    # Deep analysis
claude "quick check..."          # Surface scan

# Output detail
claude "...with detailed explanation"
claude "...brief summary only"
claude "...show your reasoning"

# Confidence
claude "...are you certain about..."
claude "...what are the risks of..."
```

## Next Steps

- [Advanced CLI Techniques](/cli/advanced)
- [Best Practices](/guides/best-practices)
- [Context Management](/guides/context-management)
