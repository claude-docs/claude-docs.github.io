---
sidebar_position: 11
title: Debugging with Claude Code
description: Systematic debugging approaches and techniques using Claude Code
---

# Debugging with Claude Code

Master the art of debugging with Claude Code's powerful analysis capabilities. This guide covers systematic approaches to identifying and resolving bugs across various scenarios.

## Systematic Debugging Approach

### The DEBUG Framework

Follow this structured approach for efficient debugging:

```
D - Describe the problem precisely
E - Examine the evidence (logs, errors, behavior)
B - Build hypotheses about causes
U - Use Claude to investigate
G - Generate and test solutions
```

### Starting a Debug Session

```
> I'm debugging an issue where user authentication fails intermittently.
> Here's what I know:
> - Happens about 20% of login attempts
> - No clear pattern in timing
> - Error logs show "token validation failed"
> - Started after last week's deployment
>
> Help me investigate systematically.
```

### Effective Debug Prompts

```
# Initial investigation
> Analyze the authentication flow in src/auth/ and identify
> potential race conditions or timing issues

# Deep dive
> Look at the token validation logic and compare it with
> the token generation. Are there any mismatches in encoding or timing?

# Root cause analysis
> Given the intermittent nature, what could cause 20% of
> validations to fail? Check for:
> - Async timing issues
> - Cache invalidation problems
> - Clock skew handling
```

## Error Analysis

### Stack Trace Interpretation

When you encounter an error, share the full context:

```
> Analyze this stack trace and identify the root cause:
>
> TypeError: Cannot read property 'id' of undefined
>     at UserService.getProfile (src/services/user.ts:45:23)
>     at AuthController.me (src/controllers/auth.ts:78:31)
>     at processTicksAndRejections (internal/process/task_queues.js:95:5)
>
> The relevant code paths are in src/services/ and src/controllers/
```

Claude will:
1. Read the referenced files
2. Trace the call path
3. Identify where the undefined value originates
4. Suggest fixes with proper null handling

### Multi-Error Analysis

```
> I'm getting multiple related errors after a refactor:
>
> 1. TypeError: user.preferences is not iterable (user-settings.ts:23)
> 2. ReferenceError: oldPreferences is not defined (migration.ts:56)
> 3. ValidationError: preferences must be an object (api-handler.ts:89)
>
> These seem connected. Analyze the preferences handling across
> these files and find the common issue.
```

### Error Pattern Recognition

```
> These errors appear randomly in production:
>
> - ECONNRESET (15% of requests)
> - ETIMEDOUT (8% of requests)
> - Socket hang up (3% of requests)
>
> Analyze our HTTP client configuration in src/lib/http-client.ts
> and our retry logic. What could cause this pattern?
```

## Log Analysis Techniques

### Structured Log Analysis

```
> Analyze these application logs and identify anomalies:
>
> [2024-01-15 10:23:45] INFO  Request started: /api/users/123
> [2024-01-15 10:23:45] DEBUG DB query: SELECT * FROM users WHERE id = 123
> [2024-01-15 10:23:47] WARN  Slow query detected: 2045ms
> [2024-01-15 10:23:47] DEBUG Cache miss for user:123
> [2024-01-15 10:23:48] INFO  Request completed: 3002ms
> [2024-01-15 10:23:48] ERROR Memory usage critical: 95%
>
> What's the performance issue here?
```

### Log Correlation

```bash
# Pipe logs directly to Claude
grep "ERROR\|WARN" /var/log/app/error.log | tail -100 | \
  claude -p "Analyze these error logs and categorize by root cause"

# Correlate multiple log sources
paste <(grep "request_id=abc123" app.log) \
      <(grep "abc123" nginx.log) | \
  claude -p "Correlate these logs to trace the request lifecycle"
```

### Time-Based Analysis

```
> Compare these two time periods from our logs:
>
> Working period (Monday 9am):
> - Avg response time: 45ms
> - Error rate: 0.1%
> - CPU: 35%
>
> Degraded period (Monday 2pm):
> - Avg response time: 890ms
> - Error rate: 5%
> - CPU: 95%
>
> What changed? Check for deployments, config changes, or
> traffic patterns in our monitoring files.
```

## Memory Leak Detection

### Identifying Memory Leaks

```
> I suspect a memory leak. Here's the memory profile over 24 hours:
>
> Hour 0:  256 MB
> Hour 6:  312 MB
> Hour 12: 445 MB
> Hour 18: 623 MB
> Hour 24: 891 MB (OOM kill)
>
> Analyze src/services/ for:
> - Event listener accumulation
> - Unclosed resources
> - Growing caches without eviction
> - Circular references
```

### Heap Analysis Support

```
> Analyze this heap snapshot summary:
>
> Top retained objects:
> - (closure) processRequest: 45MB (growing)
> - EventEmitter listeners: 23MB (stable)
> - Buffer pool: 78MB (growing)
> - String cache: 12MB (stable)
>
> The processRequest closures and Buffer pool are concerning.
> Check src/middleware/request-handler.ts and src/lib/buffer-pool.ts
```

### Memory Leak Patterns

```
> Look for these common memory leak patterns in our codebase:
>
> 1. Event listeners not removed on cleanup
> 2. Timers/intervals not cleared
> 3. Closures capturing large objects
> 4. Caches growing unbounded
> 5. Promise chains holding references
>
> Start with src/services/ and src/lib/
```

## Performance Profiling

### CPU Performance Analysis

```
> This function is showing high CPU usage in production profiles:
>
> processLargeDataset (src/processing/data.ts)
> - Self time: 2340ms
> - Total time: 3120ms
> - Called: 50 times/minute
>
> Analyze the function and suggest optimizations for:
> - Algorithm efficiency
> - Loop optimizations
> - Caching opportunities
```

### Database Query Performance

```
> These queries are slow according to our monitoring:
>
> 1. getUserWithOrders - 450ms avg (should be <50ms)
> 2. searchProducts - 1200ms avg (should be <200ms)
> 3. generateReport - 8000ms avg (acceptable but want faster)
>
> Analyze the query logic in src/repositories/ and suggest:
> - Index improvements
> - Query restructuring
> - N+1 query elimination
```

### Profiling Session

```
> I've captured performance data:
>
> Flame graph shows:
> - 40% time in JSON.parse/stringify
> - 25% time in database queries
> - 20% time in encryption
> - 15% other
>
> The JSON operations seem excessive. Analyze our API handlers
> and find unnecessary serialization/deserialization cycles.
```

## Race Condition Debugging

### Identifying Race Conditions

```
> I suspect a race condition in our order processing:
>
> Symptoms:
> - Occasional duplicate orders
> - Inventory sometimes goes negative
> - Happens under high load
>
> Analyze src/services/order-service.ts for:
> - Missing locks/mutexes
> - Non-atomic operations
> - Time-of-check to time-of-use bugs
```

### Concurrent Operation Analysis

```
> These operations can run concurrently:
>
> 1. updateUserBalance() - modifies user.balance
> 2. processPayment() - reads and modifies user.balance
> 3. refundOrder() - modifies user.balance
>
> Analyze the implementations and identify:
> - Where they might interleave incorrectly
> - Missing transaction boundaries
> - Needed synchronization points
```

### Async Flow Debugging

```
> This async code sometimes fails:
>
> ```javascript
> async function processItems(items) {
>   const results = [];
>   items.forEach(async (item) => {
>     const result = await processItem(item);
>     results.push(result);
>   });
>   return results; // Sometimes returns empty!
> }
> ```
>
> What's wrong and how should I fix it?
```

## Network Debugging

### API Communication Issues

```
> Our frontend is getting inconsistent responses from the API:
>
> - Sometimes 200 with correct data
> - Sometimes 200 with stale data
> - Occasionally 504 Gateway Timeout
>
> Analyze:
> 1. Our caching headers in src/middleware/cache.ts
> 2. CDN configuration in cloudfront.json
> 3. Load balancer health checks
```

### Connection Issues

```
> Analyze our HTTP client configuration for connection issues:
>
> Current symptoms:
> - ECONNRESET errors under load
> - Connection pool exhaustion
> - Slow response times
>
> Check src/lib/api-client.ts for:
> - Connection pool settings
> - Timeout configurations
> - Keep-alive settings
> - Retry logic
```

### WebSocket Debugging

```
> WebSocket connections are dropping intermittently:
>
> Client logs:
> - "Connection closed unexpectedly" (code: 1006)
> - Reconnection attempts cycling
>
> Server logs:
> - "Client heartbeat timeout"
> - Memory growing during reconnection storms
>
> Analyze our WebSocket implementation in src/websocket/
```

## Database Query Debugging

### Query Optimization

```
> This query is slow (2.5 seconds):
>
> SELECT u.*, COUNT(o.id) as order_count, SUM(o.total) as total_spent
> FROM users u
> LEFT JOIN orders o ON u.id = o.user_id
> WHERE u.created_at > '2024-01-01'
> GROUP BY u.id
> ORDER BY total_spent DESC
> LIMIT 100;
>
> Explain plan shows full table scan.
> Suggest index improvements and query restructuring.
```

### N+1 Query Detection

```
> Our user list page is slow. API shows 50+ queries:
>
> SELECT * FROM users LIMIT 10;
> SELECT * FROM profiles WHERE user_id = 1;
> SELECT * FROM profiles WHERE user_id = 2;
> ... (repeats for each user)
>
> Analyze src/repositories/user-repository.ts and the
> GraphQL resolvers in src/graphql/. Fix the N+1 pattern.
```

### Transaction Debugging

```
> We're getting deadlocks in production:
>
> ERROR: deadlock detected
> DETAIL: Process 1234 waits for ShareLock on transaction 5678
>         Process 5678 waits for ShareLock on transaction 1234
>
> Analyze our transaction usage in:
> - src/services/order-service.ts
> - src/services/inventory-service.ts
>
> Find the conflicting lock acquisition order.
```

## Integration Debugging

### Third-Party API Issues

```
> Our Stripe integration is failing:
>
> Error: "No such customer: cus_xxx"
>
> But the customer exists in Stripe dashboard.
>
> Check:
> 1. src/services/payment-service.ts
> 2. Environment variable usage for API keys
> 3. Test vs live mode switching logic
```

### Webhook Debugging

```
> GitHub webhooks aren't triggering our builds:
>
> - GitHub shows successful delivery (200 response)
> - Our logs show the request received
> - But the build job never starts
>
> Trace the flow from:
> 1. Webhook handler (src/webhooks/github.ts)
> 2. Event processor (src/services/event-processor.ts)
> 3. Build trigger (src/services/build-service.ts)
```

### Authentication Flow Debugging

```
> OAuth login flow is failing:
>
> User clicks "Login with Google"
> -> Redirects to Google
> -> Google redirects back
> -> Error: "Invalid state parameter"
>
> Analyze our OAuth implementation:
> - State generation (src/auth/oauth.ts)
> - Session handling (src/middleware/session.ts)
> - Callback processing (src/controllers/auth-controller.ts)
```

## Debugging Workflows

### Automated Debug Session

```bash
#!/bin/bash
# debug-session.sh - Automated debugging workflow

ERROR_LOG="$1"

# Step 1: Initial analysis
echo "Analyzing error log..."
cat "$ERROR_LOG" | claude -p "
Analyze these errors and:
1. Categorize by type
2. Identify the most critical issues
3. Suggest investigation starting points
" --json > analysis.json

# Step 2: Deep dive on critical issues
critical=$(jq -r '.result' analysis.json | head -20)
claude -p "
Based on this analysis:
$critical

Investigate the top issue. Read relevant source files
and identify the root cause.
"
```

### Continuous Debug Monitoring

```bash
# Monitor logs and alert on patterns
tail -f /var/log/app/error.log | while read line; do
  if echo "$line" | grep -q "CRITICAL\|FATAL"; then
    echo "$line" | claude -p "
      Quick analysis of this critical error:
      $(cat -)

      What immediate action should we take?
    " --model haiku --json >> alerts.json
  fi
done
```

### Debug Report Generation

```
> Generate a debug report for the issues we've investigated:
>
> Include:
> 1. Summary of symptoms
> 2. Root causes identified
> 3. Fixes implemented
> 4. Verification steps
> 5. Prevention recommendations
>
> Format as a technical incident report.
```

## Best Practices

### Effective Debug Prompts

| Scenario | Effective Prompt |
|----------|-----------------|
| Error investigation | "Analyze this error with full stack trace context" |
| Performance issue | "Profile this code path and identify bottlenecks" |
| Intermittent bug | "What conditions could cause this to fail 20% of the time" |
| Memory issue | "Check for memory leaks in this service" |
| Integration bug | "Trace the data flow between these systems" |

### Debug Session Tips

1. **Provide full context** - Include error messages, logs, and relevant code
2. **Describe the expected vs actual behavior** - Be specific about what's wrong
3. **Share reproduction steps** - Help Claude understand the scenario
4. **Mention recent changes** - Often bugs relate to recent modifications
5. **Include environment details** - OS, versions, configurations

### Systematic Approach

```
# Good debugging flow
1. /compact (ensure clean context)
2. Describe the problem with evidence
3. Let Claude investigate systematically
4. Review proposed fixes before applying
5. Test the fix thoroughly
6. Document the root cause
```

## Next Steps

- [Advanced Troubleshooting](/guides/troubleshooting-advanced)
- [Best Practices](/guides/best-practices)
- [Cost Optimization](/guides/cost-optimization) - Optimize debug session costs
- [CLI Reference](/cli/commands)
