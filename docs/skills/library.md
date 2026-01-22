---
sidebar_position: 5
title: Skill Library
description: Ready-to-use skills for Claude Code
---

# Skill Library

Copy these production-ready skills directly into your `.claude/skills/` directory.

## Development Skills

### Code Review Skill

Thorough code review with security and performance focus.

```markdown title=".claude/skills/code-review/SKILL.md"
---
name: code-review
description: Comprehensive code review with security and performance analysis
version: 1.0.0
triggers:
  - review
  - code review
  - pr review
  - pull request
---

# Code Review Skill

When reviewing code, follow this systematic approach:

## Review Phases

### Phase 1: Security Analysis

Check for common vulnerabilities:

- [ ] **Injection flaws** - SQL, NoSQL, OS command, LDAP injection
- [ ] **Authentication issues** - Weak passwords, missing MFA, session management
- [ ] **Sensitive data exposure** - Hardcoded secrets, unencrypted data
- [ ] **Access control** - Broken authorization, privilege escalation
- [ ] **Security misconfiguration** - Default credentials, verbose errors
- [ ] **XSS vulnerabilities** - Reflected, stored, DOM-based
- [ ] **Insecure deserialization** - Untrusted data deserialization
- [ ] **Known vulnerabilities** - Outdated dependencies with CVEs

### Phase 2: Code Quality

Evaluate code health:

- [ ] **Readability** - Clear naming, appropriate comments
- [ ] **Complexity** - Cyclomatic complexity under 10
- [ ] **DRY principle** - No unnecessary duplication
- [ ] **SOLID principles** - Single responsibility, open/closed
- [ ] **Error handling** - Comprehensive try/catch, meaningful messages
- [ ] **Edge cases** - Null checks, boundary conditions

### Phase 3: Performance

Identify performance issues:

- [ ] **Algorithm efficiency** - O(n) analysis, unnecessary loops
- [ ] **Memory usage** - Leaks, large allocations, caching
- [ ] **Database queries** - N+1 problems, missing indexes
- [ ] **Network calls** - Batching, caching, timeout handling
- [ ] **Async operations** - Proper await, parallelization

### Phase 4: Testing

Verify test coverage:

- [ ] **Unit tests** - Functions and methods covered
- [ ] **Integration tests** - Component interactions tested
- [ ] **Edge cases** - Error paths and boundaries tested
- [ ] **Mocking** - External dependencies properly mocked

## Output Format

Provide feedback in this structure:

```markdown
## Summary

[1-2 sentence overview]

## Critical Issues (Must Fix)

1. **[Issue Title]**
   - Location: `file:line`
   - Problem: [Description]
   - Solution: [Code suggestion]

## Recommendations (Should Fix)

1. **[Issue Title]**
   - Location: `file:line`
   - Suggestion: [Description]

## Minor Suggestions (Nice to Have)

1. **[Suggestion]** - `file:line`

## Positive Observations

- [What was done well]
```
```

### Test Generation Skill

Generate comprehensive tests with edge case coverage.

```markdown title=".claude/skills/test-generation/SKILL.md"
---
name: test-generation
description: Generate comprehensive test suites with edge cases
version: 1.0.0
triggers:
  - generate tests
  - write tests
  - test coverage
  - unit test
  - spec
---

# Test Generation Skill

Generate thorough, maintainable tests.

## Framework Detection

First, detect the testing framework:

| File | Framework |
|------|-----------|
| `jest.config.js` | Jest |
| `vitest.config.ts` | Vitest |
| `pytest.ini` | Pytest |
| `*.test.go` | Go testing |
| `*.spec.rb` | RSpec |

## Test Structure

### Unit Test Template

```typescript
describe('[Component/Function Name]', () => {
  // Setup and teardown
  beforeEach(() => {
    // Reset state, create mocks
  });

  afterEach(() => {
    // Cleanup
  });

  describe('[method/feature]', () => {
    // Happy path
    it('should [expected behavior] when [condition]', () => {
      // Arrange
      const input = createTestInput();

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toEqual(expectedOutput);
    });

    // Edge cases
    it('should handle empty input', () => {
      expect(functionUnderTest([])).toEqual([]);
    });

    it('should handle null values', () => {
      expect(() => functionUnderTest(null)).toThrow();
    });

    // Error cases
    it('should throw [ErrorType] when [condition]', () => {
      expect(() => functionUnderTest(invalidInput))
        .toThrow(ExpectedError);
    });
  });
});
```

## Coverage Requirements

### Minimum Coverage Targets

- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 90%
- **Lines**: 80%

### Required Test Cases

For each function/method, test:

1. **Happy path** - Normal, expected input
2. **Edge cases** - Empty, null, undefined, boundary values
3. **Error cases** - Invalid input, exceptions
4. **Async behavior** - Promises, timeouts, race conditions
5. **State changes** - Side effects, mutations

## Mocking Guidelines

### Mock External Dependencies

```typescript
// Mock HTTP clients
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.get.mockResolvedValue({ data: mockData });

// Mock database
jest.mock('../db');
const mockDb = db as jest.Mocked<typeof db>;
mockDb.query.mockResolvedValue(mockRows);

// Mock time
jest.useFakeTimers();
jest.setSystemTime(new Date('2024-01-01'));
```

### Avoid Mocking

- Pure functions
- Simple utility functions
- Data transformations

## Test Naming Convention

Use descriptive names: `should [action] when [condition]`

```typescript
// Good
it('should return empty array when input is empty')
it('should throw ValidationError when email is invalid')
it('should retry 3 times when network fails')

// Bad
it('test1')
it('works')
it('handles error')
```
```

### Documentation Skill

Generate comprehensive documentation.

```markdown title=".claude/skills/documentation/SKILL.md"
---
name: documentation
description: Generate comprehensive code documentation
version: 1.0.0
triggers:
  - document
  - docs
  - jsdoc
  - readme
  - api docs
---

# Documentation Skill

Create clear, comprehensive documentation.

## Documentation Types

### 1. Code Comments (JSDoc/TSDoc)

```typescript
/**
 * Calculates the total price including tax and discounts.
 *
 * @description Applies discount first, then calculates tax on discounted price.
 * Tax rates are looked up by region code.
 *
 * @param {number} basePrice - The original price before modifications
 * @param {number} discountPercent - Discount as percentage (0-100)
 * @param {string} regionCode - ISO region code for tax lookup
 * @returns {PriceBreakdown} Object containing itemized price breakdown
 * @throws {InvalidRegionError} When region code is not recognized
 * @throws {RangeError} When discount percent is outside 0-100
 *
 * @example
 * // Calculate price with 10% discount in US
 * const breakdown = calculateTotal(100, 10, 'US');
 * // Returns: { subtotal: 90, tax: 7.20, total: 97.20 }
 *
 * @see {@link TaxCalculator} for tax rate details
 * @since 2.0.0
 */
function calculateTotal(
  basePrice: number,
  discountPercent: number,
  regionCode: string
): PriceBreakdown {
  // Implementation
}
```

### 2. README Structure

```markdown
# Project Name

Brief description of what this project does.

## Features

- Feature 1 description
- Feature 2 description
- Feature 3 description

## Installation

\`\`\`bash
npm install project-name
\`\`\`

## Quick Start

\`\`\`typescript
import { Client } from 'project-name';

const client = new Client({ apiKey: 'your-key' });
const result = await client.doSomething();
\`\`\`

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | string | required | Your API key |
| `timeout` | number | 5000 | Request timeout in ms |

## API Reference

### `Client`

Main client class.

#### Constructor

\`\`\`typescript
new Client(options: ClientOptions)
\`\`\`

#### Methods

##### `doSomething(input: Input): Promise<Output>`

Does something useful.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

MIT
```

### 3. API Documentation

For REST APIs, document:

```markdown
## Endpoints

### Create User

\`POST /api/v1/users\`

Creates a new user account.

**Request Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer token |
| Content-Type | Yes | application/json |

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "name": "John Doe",
  "role": "admin"
}
\`\`\`

**Response 201:**
\`\`\`json
{
  "id": "usr_123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-15T10:30:00Z"
}
\`\`\`

**Error Responses:**
| Code | Description |
|------|-------------|
| 400 | Invalid request body |
| 401 | Missing or invalid token |
| 409 | Email already exists |
```

## Documentation Standards

1. **Be concise** - Say more with less
2. **Include examples** - Show, don't just tell
3. **Keep updated** - Documentation rots quickly
4. **Link related content** - Help readers navigate
5. **Use consistent formatting** - Tables, code blocks, headers
```

### Refactoring Skill

Safe code refactoring with behavior preservation.

```markdown title=".claude/skills/refactoring/SKILL.md"
---
name: refactoring
description: Safe code refactoring preserving behavior
version: 1.0.0
triggers:
  - refactor
  - clean up
  - improve code
  - restructure
---

# Refactoring Skill

Improve code structure while maintaining functionality.

## Pre-Refactoring Checklist

Before any refactoring:

- [ ] Tests exist and pass
- [ ] Code is under version control
- [ ] Changes are committed (clean working tree)
- [ ] Understand current behavior fully

## Refactoring Catalog

### Extract Function

**When:** Code block does one identifiable thing

```typescript
// Before
function processOrder(order: Order) {
  // Validate order
  if (!order.items.length) throw new Error('Empty order');
  if (!order.customer) throw new Error('No customer');
  if (order.total < 0) throw new Error('Invalid total');

  // Process payment
  // ...
}

// After
function processOrder(order: Order) {
  validateOrder(order);
  processPayment(order);
}

function validateOrder(order: Order): void {
  if (!order.items.length) throw new Error('Empty order');
  if (!order.customer) throw new Error('No customer');
  if (order.total < 0) throw new Error('Invalid total');
}
```

### Replace Conditional with Polymorphism

**When:** Switch statements based on type

```typescript
// Before
function calculatePay(employee: Employee): number {
  switch (employee.type) {
    case 'hourly':
      return employee.hours * employee.rate;
    case 'salary':
      return employee.salary / 12;
    case 'commission':
      return employee.basePay + employee.sales * 0.1;
  }
}

// After
interface PayCalculator {
  calculate(): number;
}

class HourlyEmployee implements PayCalculator {
  calculate(): number {
    return this.hours * this.rate;
  }
}

class SalariedEmployee implements PayCalculator {
  calculate(): number {
    return this.salary / 12;
  }
}
```

### Introduce Parameter Object

**When:** Functions have many related parameters

```typescript
// Before
function createUser(
  name: string,
  email: string,
  phone: string,
  street: string,
  city: string,
  country: string
) { }

// After
interface UserData {
  name: string;
  email: string;
  phone: string;
  address: Address;
}

function createUser(data: UserData) { }
```

### Replace Magic Numbers

**When:** Literal values have meaning

```typescript
// Before
if (user.age >= 18) { }
setTimeout(callback, 86400000);

// After
const LEGAL_AGE = 18;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

if (user.age >= LEGAL_AGE) { }
setTimeout(callback, ONE_DAY_MS);
```

## Post-Refactoring Verification

After each refactoring step:

1. **Run tests** - All must pass
2. **Manual verification** - Spot check behavior
3. **Commit** - Small, atomic commits
4. **Review diff** - Ensure no unintended changes

## Red Flags

Stop refactoring if:

- Tests start failing unexpectedly
- Refactoring scope is growing
- You're unsure about behavior
- Time pressure is high
```

### Security Audit Skill

Comprehensive security vulnerability assessment.

```markdown title=".claude/skills/security-audit/SKILL.md"
---
name: security-audit
description: Comprehensive security vulnerability assessment
version: 1.0.0
triggers:
  - security audit
  - security review
  - vulnerability scan
  - security check
---

# Security Audit Skill

Systematic security vulnerability assessment.

## OWASP Top 10 Checklist

### 1. Injection (A03:2021)

Check for:
- [ ] SQL injection in database queries
- [ ] NoSQL injection in MongoDB/etc
- [ ] Command injection in shell calls
- [ ] LDAP injection in directory queries
- [ ] XPath injection in XML processing

**Detection Pattern:**
```typescript
// VULNERABLE
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.query(query);

// SECURE
const query = 'SELECT * FROM users WHERE id = $1';
db.query(query, [userId]);
```

### 2. Broken Authentication (A07:2021)

Check for:
- [ ] Weak password requirements
- [ ] Missing brute force protection
- [ ] Session fixation vulnerabilities
- [ ] Insecure session storage
- [ ] Missing MFA for sensitive operations

### 3. Sensitive Data Exposure (A02:2021)

Check for:
- [ ] Hardcoded secrets in code
- [ ] Secrets in version control
- [ ] Unencrypted sensitive data
- [ ] Weak cryptographic algorithms
- [ ] Missing HTTPS enforcement

**Secrets Scanner:**
```bash
# Common patterns to search
grep -r "password\s*=" --include="*.ts" .
grep -r "api_key\s*=" --include="*.ts" .
grep -r "secret\s*=" --include="*.ts" .
grep -rE "[A-Za-z0-9]{32,}" --include="*.ts" .
```

### 4. XML External Entities (A05:2021)

Check for:
- [ ] XXE in XML parsers
- [ ] Unsafe deserialization
- [ ] DTD processing enabled

### 5. Broken Access Control (A01:2021)

Check for:
- [ ] Missing authorization checks
- [ ] IDOR vulnerabilities
- [ ] Privilege escalation paths
- [ ] CORS misconfiguration

### 6. Security Misconfiguration (A05:2021)

Check for:
- [ ] Default credentials
- [ ] Unnecessary features enabled
- [ ] Verbose error messages
- [ ] Missing security headers

**Required Headers:**
```typescript
// Security headers to verify
Content-Security-Policy
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security
X-XSS-Protection: 1; mode=block
```

### 7. Cross-Site Scripting (A03:2021)

Check for:
- [ ] Reflected XSS
- [ ] Stored XSS
- [ ] DOM-based XSS
- [ ] Missing output encoding

### 8. Insecure Deserialization (A08:2021)

Check for:
- [ ] Untrusted data deserialization
- [ ] Missing integrity checks
- [ ] Type confusion vulnerabilities

### 9. Known Vulnerabilities (A06:2021)

Check for:
- [ ] Outdated dependencies
- [ ] Known CVEs in packages
- [ ] Unsupported software versions

```bash
# Run dependency audit
npm audit
pip-audit
bundle audit
```

### 10. Logging & Monitoring (A09:2021)

Check for:
- [ ] Sensitive data in logs
- [ ] Missing audit logs
- [ ] Insufficient monitoring
- [ ] Missing alerting

## Security Report Template

```markdown
# Security Audit Report

**Date:** [Date]
**Scope:** [Files/Components reviewed]
**Auditor:** Claude Code

## Executive Summary

[1-2 paragraphs summarizing findings]

## Critical Findings

| ID | Title | Severity | Location |
|----|-------|----------|----------|
| SEC-001 | SQL Injection | Critical | src/db.ts:45 |

### SEC-001: SQL Injection

**Severity:** Critical
**Location:** `src/db.ts:45`

**Description:**
User input is directly concatenated into SQL query.

**Impact:**
Attackers can read/modify database, potentially
gain full system access.

**Recommendation:**
Use parameterized queries.

**Before:**
\`\`\`typescript
const q = `SELECT * FROM users WHERE id = ${id}`;
\`\`\`

**After:**
\`\`\`typescript
const q = 'SELECT * FROM users WHERE id = $1';
db.query(q, [id]);
\`\`\`

## Medium Findings
...

## Low Findings
...

## Recommendations Summary

1. Immediate: Fix critical SQL injection
2. Short-term: Update vulnerable dependencies
3. Long-term: Implement security headers
```
```

### Performance Optimization Skill

Identify and fix performance bottlenecks.

```markdown title=".claude/skills/performance/SKILL.md"
---
name: performance
description: Identify and fix performance bottlenecks
version: 1.0.0
triggers:
  - performance
  - optimize
  - speed up
  - slow
  - bottleneck
---

# Performance Optimization Skill

Systematic performance analysis and optimization.

## Performance Analysis Framework

### 1. Measure First

Never optimize without data:

```typescript
// Timing measurement
console.time('operation');
await expensiveOperation();
console.timeEnd('operation');

// Memory measurement
const before = process.memoryUsage().heapUsed;
await operation();
const after = process.memoryUsage().heapUsed;
console.log(`Memory: ${(after - before) / 1024 / 1024}MB`);
```

### 2. Identify Bottlenecks

Common performance issues:

| Issue | Symptom | Solution |
|-------|---------|----------|
| N+1 queries | Slow with more data | Batch/eager load |
| Missing indexes | Slow queries | Add database indexes |
| Memory leaks | Growing memory | Fix references |
| Sync I/O | Blocking | Use async |
| Large payloads | Slow network | Pagination/compression |

### 3. Optimization Patterns

#### Database Optimization

```typescript
// N+1 Problem - BAD
const users = await db.query('SELECT * FROM users');
for (const user of users) {
  user.orders = await db.query(
    'SELECT * FROM orders WHERE user_id = ?',
    [user.id]
  );
}

// Batch Loading - GOOD
const users = await db.query('SELECT * FROM users');
const userIds = users.map(u => u.id);
const orders = await db.query(
  'SELECT * FROM orders WHERE user_id IN (?)',
  [userIds]
);

// Group by user
const ordersByUser = groupBy(orders, 'user_id');
users.forEach(u => u.orders = ordersByUser[u.id] || []);
```

#### Caching

```typescript
// In-memory cache
const cache = new Map<string, { data: any; expires: number }>();

async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 60000
): Promise<T> {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(key, { data, expires: Date.now() + ttl });
  return data;
}
```

#### Async Optimization

```typescript
// Sequential - SLOW
const user = await getUser(id);
const orders = await getOrders(id);
const reviews = await getReviews(id);

// Parallel - FAST
const [user, orders, reviews] = await Promise.all([
  getUser(id),
  getOrders(id),
  getReviews(id)
]);
```

#### Lazy Loading

```typescript
// Eager - WASTEFUL
class Dashboard {
  constructor() {
    this.heavyData = loadHeavyData(); // Always loads
  }
}

// Lazy - EFFICIENT
class Dashboard {
  private _heavyData?: HeavyData;

  get heavyData(): HeavyData {
    if (!this._heavyData) {
      this._heavyData = loadHeavyData();
    }
    return this._heavyData;
  }
}
```

### 4. Verification

After optimization:

- [ ] Performance improved (measure again)
- [ ] Behavior unchanged (run tests)
- [ ] No regressions (benchmark suite)
- [ ] Code still readable
```

### API Design Skill

Design consistent, scalable REST APIs.

```markdown title=".claude/skills/api-design/SKILL.md"
---
name: api-design
description: Design consistent, scalable REST APIs
version: 1.0.0
triggers:
  - api
  - endpoint
  - rest
  - route
---

# API Design Skill

Design RESTful APIs following best practices.

## URL Structure

### Resource Naming

```
# Collections (plural nouns)
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id

# Nested resources
GET    /api/v1/users/:id/orders
POST   /api/v1/users/:id/orders

# Actions (when REST doesn't fit)
POST   /api/v1/users/:id/activate
POST   /api/v1/orders/:id/cancel
```

### Query Parameters

```
# Filtering
GET /api/v1/products?category=electronics&minPrice=100

# Sorting
GET /api/v1/products?sort=-createdAt,name

# Pagination
GET /api/v1/products?page=2&limit=20

# Field selection
GET /api/v1/users?fields=id,name,email

# Search
GET /api/v1/products?q=laptop
```

## Request/Response Format

### Success Response

```typescript
// Single resource
{
  "data": {
    "id": "usr_123",
    "type": "user",
    "attributes": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}

// Collection
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  },
  "links": {
    "self": "/api/v1/users?page=1",
    "next": "/api/v1/users?page=2",
    "last": "/api/v1/users?page=5"
  }
}
```

### Error Response

```typescript
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "requestId": "req_abc123"
  }
}
```

## HTTP Status Codes

| Code | Use Case |
|------|----------|
| 200 | Success (GET, PUT) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Implementation Template

```typescript
// src/routes/users.ts
import { Router } from 'express';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { UserController } from '../controllers/UserController';
import { createUserSchema, updateUserSchema } from '../validators/user';

const router = Router();
const controller = new UserController();

router.get('/',
  authenticate,
  controller.list
);

router.post('/',
  authenticate,
  validate(createUserSchema),
  controller.create
);

router.get('/:id',
  authenticate,
  controller.get
);

router.put('/:id',
  authenticate,
  validate(updateUserSchema),
  controller.update
);

router.delete('/:id',
  authenticate,
  controller.delete
);

export default router;
```
```

### Database Design Skill

Design efficient, scalable database schemas.

```markdown title=".claude/skills/database-design/SKILL.md"
---
name: database-design
description: Design efficient, scalable database schemas
version: 1.0.0
triggers:
  - database
  - schema
  - table
  - migration
  - model
---

# Database Design Skill

Design robust database schemas.

## Schema Design Principles

### 1. Normalization

Follow normal forms:

- **1NF**: Atomic values, no repeating groups
- **2NF**: No partial dependencies
- **3NF**: No transitive dependencies

```sql
-- Denormalized (bad)
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  product_name VARCHAR(255),
  product_price DECIMAL(10,2)
);

-- Normalized (good)
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50)
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);
```

### 2. Indexing Strategy

```sql
-- Primary keys (automatic)
-- Foreign keys
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Frequently queried columns
CREATE INDEX idx_products_category ON products(category);

-- Composite indexes (order matters)
CREATE INDEX idx_orders_customer_date
  ON orders(customer_id, created_at DESC);

-- Partial indexes
CREATE INDEX idx_orders_pending
  ON orders(status) WHERE status = 'pending';

-- Unique constraints
CREATE UNIQUE INDEX idx_users_email ON users(lower(email));
```

### 3. Data Types

Choose appropriate types:

```sql
-- IDs
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
-- or
id SERIAL PRIMARY KEY

-- Strings
name VARCHAR(255)           -- Variable with limit
description TEXT            -- Unlimited text
status VARCHAR(20)          -- Short enum-like

-- Numbers
quantity INTEGER            -- Whole numbers
price DECIMAL(10,2)         -- Exact decimals
rating NUMERIC(3,2)         -- 0.00 to 9.99

-- Dates
created_at TIMESTAMPTZ DEFAULT NOW()
date_of_birth DATE
duration INTERVAL

-- JSON
metadata JSONB              -- Indexed JSON
```

### 4. Constraints

Ensure data integrity:

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_category CHECK (
    category IN ('electronics', 'clothing', 'food')
  )
);
```

## Migration Template

```typescript
// migrations/20240115_create_users.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email', 255).notNullable().unique();
    table.string('name', 255).notNullable();
    table.string('password_hash', 255).notNullable();
    table.enum('role', ['user', 'admin']).defaultTo('user');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('email');
    table.index('created_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
```
```

### Migration Skill

Safe database and code migrations.

```markdown title=".claude/skills/migration/SKILL.md"
---
name: migration
description: Safe database and code migrations
version: 1.0.0
triggers:
  - migrate
  - migration
  - upgrade
  - schema change
---

# Migration Skill

Execute safe, reversible migrations.

## Pre-Migration Checklist

- [ ] Backup database
- [ ] Test migration on staging
- [ ] Plan rollback procedure
- [ ] Schedule maintenance window (if needed)
- [ ] Notify stakeholders

## Database Migration Patterns

### Adding a Column

```sql
-- Safe: Add nullable column
ALTER TABLE users ADD COLUMN phone VARCHAR(50);

-- Then backfill
UPDATE users SET phone = 'unknown' WHERE phone IS NULL;

-- Then add constraint
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;
```

### Removing a Column

```sql
-- Step 1: Stop writing to column (code change)
-- Step 2: Deploy code
-- Step 3: Wait for old instances to drain
-- Step 4: Drop column
ALTER TABLE users DROP COLUMN legacy_field;
```

### Renaming a Column

```sql
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN full_name VARCHAR(255);

-- Step 2: Copy data
UPDATE users SET full_name = name;

-- Step 3: Deploy code using new column
-- Step 4: Drop old column
ALTER TABLE users DROP COLUMN name;
```

### Adding an Index

```sql
-- Use CONCURRENTLY to avoid locking
CREATE INDEX CONCURRENTLY idx_users_email
  ON users(email);
```

## Code Migration Patterns

### Feature Flags

```typescript
// Gradual rollout
if (featureFlags.isEnabled('new-payment-flow', user)) {
  return newPaymentFlow(order);
} else {
  return legacyPaymentFlow(order);
}
```

### Strangler Pattern

```typescript
// Route to old or new implementation
class PaymentService {
  async process(order: Order) {
    if (this.shouldUseNewSystem(order)) {
      return this.newPaymentSystem.process(order);
    }
    return this.legacySystem.process(order);
  }

  private shouldUseNewSystem(order: Order): boolean {
    // Gradual migration logic
    return order.amount < 1000 || order.customer.isBeta;
  }
}
```

## Rollback Plan

```markdown
## Rollback Procedure

### Database Rollback
\`\`\`bash
# Restore from backup
pg_restore -d mydb backup_pre_migration.dump

# Or run down migration
npm run migrate:rollback
\`\`\`

### Code Rollback
\`\`\`bash
# Revert to previous deployment
kubectl rollout undo deployment/myapp

# Or specific revision
kubectl rollout undo deployment/myapp --to-revision=42
\`\`\`
```

## Post-Migration Verification

- [ ] Application starts successfully
- [ ] Health checks pass
- [ ] Key user flows work
- [ ] No error rate increase
- [ ] Performance metrics stable
```

### Debugging Skill

Systematic debugging approach.

```markdown title=".claude/skills/debugging/SKILL.md"
---
name: debugging
description: Systematic debugging and issue resolution
version: 1.0.0
triggers:
  - debug
  - bug
  - error
  - issue
  - fix
  - broken
---

# Debugging Skill

Systematic approach to finding and fixing bugs.

## Debugging Framework

### 1. Reproduce the Issue

Before debugging:
- Get exact reproduction steps
- Identify affected environments
- Determine when it started
- Check recent changes

### 2. Gather Information

```typescript
// Add logging
console.log('State before:', JSON.stringify(state, null, 2));
console.log('Input:', input);
console.log('User:', user.id);

// Check error details
try {
  result = await operation();
} catch (error) {
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  console.error('Context:', { userId, orderId, timestamp });
  throw error;
}
```

### 3. Isolate the Problem

Binary search approach:
1. Find a known good state
2. Find the failing state
3. Bisect to find the cause

```bash
# Git bisect for finding bad commits
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
# Git will checkout commits, test each one
git bisect reset
```

### 4. Form Hypotheses

Common bug causes:
- [ ] Null/undefined values
- [ ] Race conditions
- [ ] Off-by-one errors
- [ ] Type mismatches
- [ ] Stale cache
- [ ] Environment differences
- [ ] Missing error handling

### 5. Test and Fix

```typescript
// Before fix - add tests
describe('bugfix: issue #123', () => {
  it('should handle null user', () => {
    // This currently fails
    expect(() => processOrder(null)).not.toThrow();
  });
});

// Apply fix
function processOrder(user: User | null) {
  if (!user) {
    throw new ValidationError('User required');
  }
  // ...
}

// Verify test passes
```

## Debugging Tools

### Node.js

```bash
# Debugger
node --inspect src/index.js

# Memory profiling
node --inspect --expose-gc src/index.js

# CPU profiling
node --prof src/index.js
```

### Browser

```javascript
// Breakpoints
debugger;

// Console methods
console.table(data);
console.trace();
console.time('operation');
console.group('Section');
```

### Network

```bash
# Capture requests
curl -v https://api.example.com/endpoint

# Test connectivity
nc -zv hostname port
```

## Bug Report Template

```markdown
## Bug Report

**Summary:** [One line description]

**Environment:**
- Version: 2.1.0
- OS: Ubuntu 22.04
- Node: 18.17.0

**Reproduction Steps:**
1. Log in as admin
2. Navigate to /settings
3. Click "Save" without changes
4. Error appears

**Expected:** Settings page saves successfully
**Actual:** Error: "Cannot read property 'id' of undefined"

**Stack Trace:**
\`\`\`
TypeError: Cannot read property 'id' of undefined
    at SettingsController.save (settings.ts:45)
    at ...
\`\`\`

**Workaround:** Refresh page before saving
```
```

## DevOps Skills

### Deploy Skill

Safe deployment workflows.

```markdown title=".claude/skills/deploy/SKILL.md"
---
name: deploy
description: Safe deployment with rollback capability
version: 1.0.0
triggers:
  - deploy
  - release
  - ship
  - production
---

# Deploy Skill

Safe, reliable deployment workflows.

## Pre-Deployment Checklist

- [ ] All tests pass
- [ ] Code review approved
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Staging deployment successful
- [ ] Rollback plan documented

## Deployment Strategies

### Blue-Green Deployment

```yaml
# Deploy to green environment
kubectl apply -f k8s/deployment-green.yaml

# Verify health
kubectl wait --for=condition=available deployment/app-green

# Switch traffic
kubectl patch service/app -p '{"spec":{"selector":{"version":"green"}}}'

# Monitor for issues
# If problems, switch back to blue
kubectl patch service/app -p '{"spec":{"selector":{"version":"blue"}}}'
```

### Canary Deployment

```yaml
# Deploy canary (10% traffic)
kubectl apply -f k8s/deployment-canary.yaml

# Monitor metrics
# - Error rate
# - Latency
# - Business metrics

# If healthy, increase traffic
kubectl scale deployment/app-canary --replicas=5

# Full rollout
kubectl apply -f k8s/deployment-stable.yaml
kubectl delete deployment/app-canary
```

### Rolling Update

```yaml
# k8s/deployment.yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 0
```

## Deployment Script

```bash
#!/bin/bash
set -e

VERSION=$1
ENVIRONMENT=${2:-staging}

echo "Deploying version $VERSION to $ENVIRONMENT"

# Pre-flight checks
npm test
npm run build

# Create backup
./scripts/backup-db.sh

# Deploy
if [ "$ENVIRONMENT" = "production" ]; then
  # Require manual confirmation
  read -p "Deploy to PRODUCTION? (yes/no) " confirm
  [ "$confirm" = "yes" ] || exit 1
fi

kubectl set image deployment/app app=myapp:$VERSION

# Wait for rollout
kubectl rollout status deployment/app --timeout=5m

# Verify health
./scripts/health-check.sh

echo "Deployment successful!"
```

## Post-Deployment

- [ ] Verify health checks
- [ ] Check error rates
- [ ] Monitor performance
- [ ] Verify key user flows
- [ ] Update status page
```

### Monitoring Skill

Set up comprehensive monitoring.

```markdown title=".claude/skills/monitoring/SKILL.md"
---
name: monitoring
description: Set up comprehensive application monitoring
version: 1.0.0
triggers:
  - monitoring
  - metrics
  - observability
  - alerts
  - logs
---

# Monitoring Skill

Implement comprehensive observability.

## The Three Pillars

### 1. Metrics

```typescript
// Prometheus metrics
import { Counter, Histogram, Gauge } from 'prom-client';

// Request counter
const httpRequests = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'path', 'status']
});

// Latency histogram
const httpLatency = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency',
  labelNames: ['method', 'path'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 5]
});

// Active connections gauge
const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// Middleware
app.use((req, res, next) => {
  const end = httpLatency.startTimer({ method: req.method, path: req.path });
  res.on('finish', () => {
    end();
    httpRequests.inc({
      method: req.method,
      path: req.path,
      status: res.statusCode
    });
  });
  next();
});
```

### 2. Logging

```typescript
// Structured logging
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label })
  }
});

// Request logging
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuid();

  req.log = logger.child({
    requestId,
    method: req.method,
    path: req.path,
    userId: req.user?.id
  });

  req.log.info('Request started');

  res.on('finish', () => {
    req.log.info({
      statusCode: res.statusCode,
      duration: Date.now() - req.startTime
    }, 'Request completed');
  });

  next();
});

// Error logging
logger.error({
  err: error,
  userId: user.id,
  action: 'payment_failed'
}, 'Payment processing failed');
```

### 3. Tracing

```typescript
// OpenTelemetry
import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('my-service');

async function processOrder(order: Order) {
  return tracer.startActiveSpan('processOrder', async (span) => {
    try {
      span.setAttribute('order.id', order.id);
      span.setAttribute('order.total', order.total);

      await validateOrder(order);
      await processPayment(order);
      await sendConfirmation(order);

      span.setStatus({ code: SpanStatusCode.OK });
      return { success: true };
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message
      });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

## Alert Rules

```yaml
# Prometheus alerting rules
groups:
  - name: application
    rules:
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m]))
          / sum(rate(http_requests_total[5m])) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: High error rate detected
          description: Error rate is {{ $value | humanizePercentage }}

      - alert: HighLatency
        expr: |
          histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High latency detected
          description: p95 latency is {{ $value }}s

      - alert: InstanceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: Instance {{ $labels.instance }} down
```

## Dashboard Checklist

Essential metrics to display:

- [ ] Request rate (RPS)
- [ ] Error rate (%)
- [ ] Latency (p50, p95, p99)
- [ ] Active users
- [ ] CPU/Memory usage
- [ ] Database connections
- [ ] Queue depth
- [ ] Cache hit rate
```

### Incident Response Skill

Handle production incidents effectively.

```markdown title=".claude/skills/incident-response/SKILL.md"
---
name: incident-response
description: Handle production incidents effectively
version: 1.0.0
triggers:
  - incident
  - outage
  - down
  - emergency
  - pagerduty
---

# Incident Response Skill

Structured approach to handling production incidents.

## Incident Severity Levels

| Level | Definition | Response Time | Examples |
|-------|------------|---------------|----------|
| SEV1 | Service down | Immediate | Complete outage, data loss |
| SEV2 | Major degradation | 15 min | Core feature broken |
| SEV3 | Minor impact | 1 hour | Non-critical bug |
| SEV4 | Low impact | 24 hours | UI glitch |

## Incident Response Flow

### 1. Detection & Triage (0-5 min)

```markdown
## Incident Triage

**Time detected:** [timestamp]
**Detected by:** [alert/user report/monitoring]
**Initial severity:** [SEV1-4]

### Impact Assessment
- [ ] Who is affected?
- [ ] What functionality is broken?
- [ ] Is data at risk?
- [ ] Is this spreading?
```

### 2. Communication (5-10 min)

```markdown
## Status Update Template

**Status:** Investigating | Identified | Monitoring | Resolved
**Impact:** [Description of user impact]
**Current Action:** [What we're doing now]
**ETA:** [If known]

---

Example:

**[INVESTIGATING] Payment Processing Issue**

We are investigating reports of failed payments.
Some users may experience errors when completing checkout.
Our team is actively working on the issue.
Next update in 30 minutes.
```

### 3. Investigation

```bash
# Quick diagnostic commands

# Check application logs
kubectl logs -f deployment/app --tail=100 | grep -i error

# Check system resources
kubectl top pods
kubectl top nodes

# Check recent deployments
kubectl rollout history deployment/app

# Database connections
psql -c "SELECT count(*) FROM pg_stat_activity;"

# Network issues
curl -I https://api.example.com/health
```

### 4. Mitigation

Common quick fixes:

```bash
# Rollback deployment
kubectl rollout undo deployment/app

# Scale up
kubectl scale deployment/app --replicas=10

# Restart pods
kubectl rollout restart deployment/app

# Toggle feature flag
./scripts/disable-feature.sh problematic-feature

# Failover to backup
./scripts/failover.sh
```

### 5. Resolution & Post-Mortem

```markdown
## Post-Mortem Template

**Incident:** [Title]
**Date:** [Date]
**Duration:** [Time to resolution]
**Severity:** [SEV level]
**Author:** [Name]

### Summary
[2-3 sentence summary]

### Timeline
| Time | Event |
|------|-------|
| 14:00 | Alert triggered |
| 14:05 | On-call acknowledged |
| 14:15 | Root cause identified |
| 14:30 | Fix deployed |
| 14:45 | Monitoring confirmed stable |

### Root Cause
[Detailed technical explanation]

### Impact
- Users affected: ~5,000
- Revenue impact: ~$10,000
- Duration: 45 minutes

### What Went Well
- Quick detection via monitoring
- Clear runbook available

### What Went Wrong
- Delayed notification to customers
- Missing test coverage for edge case

### Action Items
| Action | Owner | Due Date |
|--------|-------|----------|
| Add regression test | @dev | 2024-01-20 |
| Improve alert threshold | @sre | 2024-01-22 |
```
```

## Feature Management Skills

### Feature Flag Skill

Implement feature flags for safe releases.

```markdown title=".claude/skills/feature-flags/SKILL.md"
---
name: feature-flags
description: Implement feature flags for safe releases
version: 1.0.0
triggers:
  - feature flag
  - toggle
  - gradual rollout
  - dark launch
---

# Feature Flag Skill

Implement feature flags for controlled releases.

## Feature Flag Types

| Type | Use Case | Example |
|------|----------|---------|
| Release | Hide incomplete features | `new-checkout-flow` |
| Experiment | A/B testing | `pricing-test-v2` |
| Ops | Kill switches | `disable-notifications` |
| Permission | User access | `beta-features` |

## Implementation

### Basic Flag System

```typescript
// src/flags/FeatureFlags.ts
interface FeatureFlagConfig {
  enabled: boolean;
  rolloutPercentage?: number;
  allowedUsers?: string[];
  allowedGroups?: string[];
}

class FeatureFlags {
  private flags: Map<string, FeatureFlagConfig>;

  constructor() {
    this.flags = new Map();
    this.loadFlags();
  }

  async loadFlags() {
    // Load from config/database
    const config = await fetch('/api/flags').then(r => r.json());
    Object.entries(config).forEach(([key, value]) => {
      this.flags.set(key, value as FeatureFlagConfig);
    });
  }

  isEnabled(flagName: string, context?: { userId?: string; userGroup?: string }): boolean {
    const flag = this.flags.get(flagName);
    if (!flag) return false;
    if (!flag.enabled) return false;

    // Check user allowlist
    if (flag.allowedUsers?.includes(context?.userId || '')) {
      return true;
    }

    // Check group allowlist
    if (flag.allowedGroups?.includes(context?.userGroup || '')) {
      return true;
    }

    // Check percentage rollout
    if (flag.rolloutPercentage !== undefined) {
      const hash = this.hashUserId(context?.userId || 'anonymous');
      return hash < flag.rolloutPercentage;
    }

    return flag.enabled;
  }

  private hashUserId(userId: string): number {
    // Simple hash for consistent bucketing
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash % 100);
  }
}

export const flags = new FeatureFlags();
```

### Usage Patterns

```typescript
// Simple check
if (flags.isEnabled('new-checkout')) {
  return <NewCheckout />;
}
return <LegacyCheckout />;

// With context
if (flags.isEnabled('beta-features', { userId: user.id, userGroup: user.plan })) {
  showBetaFeatures();
}

// React component
function FeatureGate({ flag, children, fallback = null }) {
  const { user } = useAuth();
  const enabled = flags.isEnabled(flag, { userId: user?.id });

  return enabled ? children : fallback;
}

// Usage
<FeatureGate flag="new-dashboard" fallback={<OldDashboard />}>
  <NewDashboard />
</FeatureGate>
```

### Flag Configuration

```yaml
# config/flags.yaml
features:
  new-checkout:
    enabled: true
    rolloutPercentage: 25
    description: "New checkout flow"

  beta-features:
    enabled: true
    allowedGroups:
      - enterprise
      - beta-testers

  disable-emails:
    enabled: false
    description: "Emergency email kill switch"
```

## Flag Lifecycle

1. **Create**: Define flag with default OFF
2. **Develop**: Build feature behind flag
3. **Test**: Enable for internal users
4. **Rollout**: Gradual percentage increase
5. **GA**: Enable for all users
6. **Cleanup**: Remove flag and dead code
```

### A/B Testing Skill

Implement A/B testing for data-driven decisions.

```markdown title=".claude/skills/ab-testing/SKILL.md"
---
name: ab-testing
description: Implement A/B testing for data-driven decisions
version: 1.0.0
triggers:
  - a/b test
  - experiment
  - split test
  - variant
---

# A/B Testing Skill

Implement statistically valid A/B tests.

## Experiment Design

### 1. Define Hypothesis

```markdown
## Experiment: New CTA Button

**Hypothesis:** Changing the CTA from "Sign Up" to "Get Started Free"
will increase signup conversion rate.

**Primary Metric:** Signup conversion rate
**Secondary Metrics:**
- Time to signup
- 7-day retention

**Minimum Detectable Effect:** 5% relative improvement
**Statistical Significance:** 95%
**Required Sample Size:** 10,000 users per variant
**Duration:** 2 weeks
```

### 2. Implementation

```typescript
// src/experiments/ExperimentService.ts
interface Experiment {
  id: string;
  name: string;
  variants: Variant[];
  trafficPercentage: number;
  status: 'draft' | 'running' | 'completed';
}

interface Variant {
  id: string;
  name: string;
  weight: number;
}

class ExperimentService {
  async assignVariant(
    experimentId: string,
    userId: string
  ): Promise<string | null> {
    const experiment = await this.getExperiment(experimentId);

    if (experiment.status !== 'running') {
      return null;
    }

    // Check if user already assigned
    const existing = await this.getAssignment(experimentId, userId);
    if (existing) {
      return existing.variantId;
    }

    // Determine if user is in experiment
    const hash = this.hashUser(experimentId, userId);
    if (hash > experiment.trafficPercentage) {
      return null; // Not in experiment
    }

    // Assign to variant based on weights
    const variant = this.selectVariant(experiment.variants, hash);

    await this.saveAssignment(experimentId, userId, variant.id);
    await this.trackExposure(experimentId, userId, variant.id);

    return variant.id;
  }

  private selectVariant(variants: Variant[], hash: number): Variant {
    let cumulative = 0;
    const normalized = hash % 100;

    for (const variant of variants) {
      cumulative += variant.weight;
      if (normalized < cumulative) {
        return variant;
      }
    }

    return variants[variants.length - 1];
  }
}
```

### 3. Tracking

```typescript
// Track experiment exposure
analytics.track('Experiment Viewed', {
  experimentId: 'cta-button-v2',
  variantId: 'treatment',
  userId: user.id
});

// Track conversion
analytics.track('Signed Up', {
  experimentId: 'cta-button-v2',
  variantId: 'treatment',
  userId: user.id,
  signupTime: Date.now() - sessionStart
});
```

### 4. Analysis

```sql
-- Calculate conversion rate by variant
WITH exposures AS (
  SELECT
    variant_id,
    user_id,
    MIN(timestamp) as exposure_time
  FROM experiment_exposures
  WHERE experiment_id = 'cta-button-v2'
  GROUP BY variant_id, user_id
),
conversions AS (
  SELECT user_id, MIN(timestamp) as conversion_time
  FROM signups
  GROUP BY user_id
)
SELECT
  e.variant_id,
  COUNT(DISTINCT e.user_id) as exposed,
  COUNT(DISTINCT c.user_id) as converted,
  COUNT(DISTINCT c.user_id)::float / COUNT(DISTINCT e.user_id) as conversion_rate
FROM exposures e
LEFT JOIN conversions c ON e.user_id = c.user_id
  AND c.conversion_time > e.exposure_time
GROUP BY e.variant_id;
```

## Best Practices

1. **One change at a time** - Isolate variables
2. **Sufficient sample size** - Use power analysis
3. **Run to completion** - Don't peek and stop early
4. **Segment analysis** - Check for different effects across segments
5. **Document everything** - Record hypothesis and learnings
```

## Quality Skills

### Accessibility Audit Skill

Ensure WCAG compliance.

```markdown title=".claude/skills/accessibility/SKILL.md"
---
name: accessibility
description: Audit and fix accessibility issues
version: 1.0.0
triggers:
  - accessibility
  - a11y
  - wcag
  - screen reader
---

# Accessibility Audit Skill

Ensure WCAG 2.1 AA compliance.

## Audit Checklist

### Perceivable

#### 1.1 Text Alternatives

- [ ] All images have alt text
- [ ] Decorative images use `alt=""`
- [ ] Complex images have long descriptions
- [ ] Icons have accessible names

```tsx
// Good
<img src="profile.jpg" alt="Jane Smith, CEO" />
<button aria-label="Close dialog"><CloseIcon /></button>

// Bad
<img src="profile.jpg" />
<button><CloseIcon /></button>
```

#### 1.3 Adaptable

- [ ] Semantic HTML used
- [ ] Heading hierarchy correct (h1 > h2 > h3)
- [ ] Lists use proper markup
- [ ] Tables have headers

```tsx
// Good
<nav>
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>

// Bad
<div class="nav">
  <div><a href="/home">Home</a></div>
</div>
```

#### 1.4 Distinguishable

- [ ] Color contrast ratio ≥ 4.5:1 (text)
- [ ] Color contrast ratio ≥ 3:1 (large text)
- [ ] Information not conveyed by color alone
- [ ] Text can be resized to 200%

### Operable

#### 2.1 Keyboard Accessible

- [ ] All functionality via keyboard
- [ ] No keyboard traps
- [ ] Focus visible
- [ ] Logical focus order

```tsx
// Custom button must be keyboard accessible
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</div>
```

#### 2.4 Navigable

- [ ] Skip links present
- [ ] Page titles descriptive
- [ ] Focus order meaningful
- [ ] Link purpose clear

```tsx
// Skip link
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

// Descriptive link
<a href="/report.pdf">Download Annual Report (PDF, 2MB)</a>
```

### Understandable

#### 3.1 Readable

- [ ] Language of page identified
- [ ] Language of parts identified

```html
<html lang="en">
  <p>The French word <span lang="fr">bonjour</span> means hello.</p>
</html>
```

#### 3.2 Predictable

- [ ] No unexpected context changes
- [ ] Consistent navigation
- [ ] Consistent identification

#### 3.3 Input Assistance

- [ ] Errors identified
- [ ] Labels provided
- [ ] Error suggestions offered

```tsx
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid={hasError}
/>
{hasError && (
  <span id="email-error" role="alert">
    Please enter a valid email address
  </span>
)}
```

### Robust

#### 4.1 Compatible

- [ ] Valid HTML
- [ ] ARIA used correctly
- [ ] Status messages announced

## Testing Tools

```bash
# Automated testing
npm install -D axe-core @axe-core/react

# In tests
import { axe } from 'jest-axe';

it('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```
```

### SEO Optimization Skill

Improve search engine visibility.

```markdown title=".claude/skills/seo/SKILL.md"
---
name: seo
description: Optimize for search engines
version: 1.0.0
triggers:
  - seo
  - search engine
  - meta tags
  - sitemap
---

# SEO Optimization Skill

Improve search engine visibility and ranking.

## Technical SEO Checklist

### Meta Tags

```tsx
// pages/_app.tsx or layout
import Head from 'next/head';

function SEO({ title, description, image, url }) {
  const siteName = 'My Website';
  const fullTitle = `${title} | ${siteName}`;

  return (
    <Head>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
}
```

### Structured Data

```tsx
// Product page structured data
const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.images,
  sku: product.sku,
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: product.rating,
    reviewCount: product.reviewCount
  }
};

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
/>
```

### Sitemap

```typescript
// scripts/generate-sitemap.ts
import { globby } from 'globby';
import { writeFileSync } from 'fs';

async function generateSitemap() {
  const pages = await globby([
    'pages/**/*.tsx',
    '!pages/_*.tsx',
    '!pages/api/**'
  ]);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => {
    const path = page
      .replace('pages', '')
      .replace('.tsx', '')
      .replace('/index', '');
    return `
  <url>
    <loc>https://example.com${path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('')}
</urlset>`;

  writeFileSync('public/sitemap.xml', sitemap);
}

generateSitemap();
```

### robots.txt

```txt
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml

# Block admin pages
Disallow: /admin/
Disallow: /api/
```

## Performance for SEO

- [ ] Core Web Vitals optimized
- [ ] Images optimized and lazy loaded
- [ ] JavaScript deferred
- [ ] Critical CSS inlined
- [ ] Server-side rendering or static generation
```

### Internationalization Skill

Implement multi-language support.

```markdown title=".claude/skills/i18n/SKILL.md"
---
name: i18n
description: Implement internationalization and localization
version: 1.0.0
triggers:
  - i18n
  - internationalization
  - localization
  - translation
  - multi-language
---

# Internationalization Skill

Implement robust multi-language support.

## Setup

### Directory Structure

```
src/
├── i18n/
│   ├── index.ts
│   ├── locales/
│   │   ├── en.json
│   │   ├── es.json
│   │   ├── fr.json
│   │   └── ja.json
│   └── config.ts
```

### Configuration

```typescript
// src/i18n/config.ts
export const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr', 'ja'],
  fallbackLocale: 'en',
  loadPath: '/locales/{{lng}}.json'
};

// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { i18nConfig } from './config';

i18n
  .use(initReactI18next)
  .init({
    ...i18nConfig,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

### Translation Files

```json
// locales/en.json
{
  "common": {
    "welcome": "Welcome, {{name}}!",
    "items": "{{count}} item",
    "items_plural": "{{count}} items"
  },
  "nav": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  },
  "errors": {
    "required": "This field is required",
    "email": "Please enter a valid email"
  }
}
```

```json
// locales/es.json
{
  "common": {
    "welcome": "¡Bienvenido, {{name}}!",
    "items": "{{count}} artículo",
    "items_plural": "{{count}} artículos"
  },
  "nav": {
    "home": "Inicio",
    "about": "Acerca de",
    "contact": "Contacto"
  }
}
```

## Usage

### React Components

```tsx
import { useTranslation, Trans } from 'react-i18next';

function Welcome({ user }) {
  const { t } = useTranslation();

  return (
    <div>
      {/* Simple translation */}
      <h1>{t('common.welcome', { name: user.name })}</h1>

      {/* Pluralization */}
      <p>{t('common.items', { count: user.cartItems })}</p>

      {/* With components */}
      <Trans i18nKey="terms">
        I agree to the <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>
      </Trans>
    </div>
  );
}
```

### Formatting

```typescript
// Date formatting
const formattedDate = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}).format(date);

// Number formatting
const formattedNumber = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: 'USD'
}).format(price);

// Relative time
const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
rtf.format(-1, 'day'); // "yesterday"
```

## Best Practices

1. **Use keys, not text** - `t('nav.home')` not `t('Home')`
2. **No string concatenation** - Use interpolation
3. **Handle plurals** - Use count parameter
4. **RTL support** - Test with Arabic/Hebrew
5. **Extract strings** - Use tooling to find hardcoded text
```

### Analytics Integration Skill

Implement analytics tracking.

```markdown title=".claude/skills/analytics/SKILL.md"
---
name: analytics
description: Implement analytics tracking
version: 1.0.0
triggers:
  - analytics
  - tracking
  - metrics
  - events
---

# Analytics Integration Skill

Implement comprehensive analytics tracking.

## Setup

### Analytics Abstraction

```typescript
// src/analytics/index.ts
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
  identify(userId: string, traits?: Record<string, any>): void;
  page(name: string, properties?: Record<string, any>): void;
}

class Analytics {
  private providers: AnalyticsProvider[] = [];

  addProvider(provider: AnalyticsProvider) {
    this.providers.push(provider);
  }

  track(event: AnalyticsEvent) {
    this.providers.forEach(p => p.track(event));
  }

  identify(userId: string, traits?: Record<string, any>) {
    this.providers.forEach(p => p.identify(userId, traits));
  }

  page(name: string, properties?: Record<string, any>) {
    this.providers.forEach(p => p.page(name, properties));
  }
}

export const analytics = new Analytics();
```

### Provider Implementation

```typescript
// Google Analytics 4
class GA4Provider implements AnalyticsProvider {
  track({ name, properties }: AnalyticsEvent) {
    window.gtag('event', name, properties);
  }

  identify(userId: string) {
    window.gtag('set', { user_id: userId });
  }

  page(name: string, properties?: Record<string, any>) {
    window.gtag('event', 'page_view', {
      page_title: name,
      ...properties
    });
  }
}

// Mixpanel
class MixpanelProvider implements AnalyticsProvider {
  track({ name, properties }: AnalyticsEvent) {
    mixpanel.track(name, properties);
  }

  identify(userId: string, traits?: Record<string, any>) {
    mixpanel.identify(userId);
    if (traits) mixpanel.people.set(traits);
  }

  page(name: string, properties?: Record<string, any>) {
    mixpanel.track('Page View', { page: name, ...properties });
  }
}
```

## Tracking Plan

### Standard Events

```typescript
// User events
analytics.track({ name: 'User Signed Up', properties: { method: 'email' }});
analytics.track({ name: 'User Logged In', properties: { method: 'google' }});
analytics.track({ name: 'User Logged Out' });

// Product events
analytics.track({ name: 'Product Viewed', properties: {
  productId: '123',
  productName: 'Widget',
  category: 'Electronics',
  price: 29.99
}});

analytics.track({ name: 'Product Added to Cart', properties: {
  productId: '123',
  quantity: 2,
  price: 29.99
}});

// Checkout events
analytics.track({ name: 'Checkout Started', properties: {
  cartValue: 59.98,
  itemCount: 2
}});

analytics.track({ name: 'Order Completed', properties: {
  orderId: 'ORD-123',
  total: 64.98,
  tax: 5.00,
  shipping: 0
}});
```

### React Hooks

```typescript
// useAnalytics hook
function useAnalytics() {
  const track = useCallback((name: string, properties?: Record<string, any>) => {
    analytics.track({ name, properties });
  }, []);

  const trackPageView = useCallback(() => {
    analytics.page(window.location.pathname);
  }, []);

  return { track, trackPageView };
}

// usePageTracking hook
function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    analytics.page(location.pathname, {
      search: location.search,
      referrer: document.referrer
    });
  }, [location]);
}
```

## Privacy Compliance

```typescript
// Consent management
class ConsentManager {
  hasConsent(category: 'analytics' | 'marketing'): boolean {
    const consent = localStorage.getItem('consent');
    if (!consent) return false;
    return JSON.parse(consent)[category] === true;
  }

  grantConsent(categories: string[]) {
    const consent = categories.reduce((acc, cat) => {
      acc[cat] = true;
      return acc;
    }, {});
    localStorage.setItem('consent', JSON.stringify(consent));
  }
}

// Only track with consent
if (consentManager.hasConsent('analytics')) {
  analytics.track(event);
}
```
```

### Error Tracking Skill

Implement error monitoring.

```markdown title=".claude/skills/error-tracking/SKILL.md"
---
name: error-tracking
description: Implement error monitoring and alerting
version: 1.0.0
triggers:
  - error tracking
  - sentry
  - error monitoring
  - crash reporting
---

# Error Tracking Skill

Implement comprehensive error monitoring.

## Setup

### Sentry Integration

```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_VERSION,

  // Sample rate for performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Capture unhandled promise rejections
  integrations: [
    new Sentry.Integrations.BrowserTracing(),
  ],

  // Filter out noisy errors
  beforeSend(event) {
    // Ignore specific errors
    if (event.exception?.values?.[0]?.type === 'ChunkLoadError') {
      return null;
    }
    return event;
  }
});
```

### Error Boundary

```tsx
// src/components/ErrorBoundary.tsx
import * as Sentry from '@sentry/nextjs';

interface State {
  hasError: boolean;
  eventId?: string;
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => Sentry.showReportDialog({
            eventId: this.state.eventId
          })}>
            Report feedback
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Error Capture Patterns

### API Errors

```typescript
// Capture API errors with context
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = new Error(`API Error: ${response.status}`);
      Sentry.captureException(error, {
        extra: {
          url,
          status: response.status,
          statusText: response.statusText
        }
      });
      throw error;
    }

    return response.json();
  } catch (error) {
    Sentry.captureException(error, {
      tags: { type: 'api_error' },
      extra: { url }
    });
    throw error;
  }
}
```

### User Context

```typescript
// Set user context when authenticated
function setUserContext(user: User) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name
  });
}

// Clear on logout
function clearUserContext() {
  Sentry.setUser(null);
}
```

### Custom Breadcrumbs

```typescript
// Add navigation breadcrumbs
Sentry.addBreadcrumb({
  category: 'navigation',
  message: `Navigated to ${path}`,
  level: 'info'
});

// Add user action breadcrumbs
Sentry.addBreadcrumb({
  category: 'user',
  message: 'Clicked checkout button',
  level: 'info',
  data: { cartValue: 99.99 }
});
```

## Alert Configuration

```yaml
# sentry.yaml
alertRules:
  - name: High Error Rate
    conditions:
      - type: event_frequency
        value: 100
        interval: 1h
    actions:
      - type: slack
        channel: '#alerts'

  - name: New Error Type
    conditions:
      - type: first_seen_event
    actions:
      - type: email
        targetType: team
```

## Best Practices

1. **Set release version** - Track errors per release
2. **Add user context** - Know who is affected
3. **Use breadcrumbs** - Understand error context
4. **Filter noise** - Ignore expected errors
5. **Set up alerts** - Get notified of issues
6. **Review regularly** - Triage and fix errors
```

## Next Steps

- [Advanced Skills](/skills/advanced) - Deep dive into skill architecture
- [Creating Skills](/skills/creating-skills) - Build your own skills
- [Custom Commands](/skills/custom-commands) - Quick shortcuts
