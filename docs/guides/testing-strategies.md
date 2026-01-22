---
sidebar_position: 12
title: Testing Strategies
description: Comprehensive testing strategies with Claude Code for unit, integration, E2E, and specialized testing
---

# Testing Strategies

Master testing with Claude Code, from generating unit tests to full E2E automation.

## Test Generation Overview

Claude Code can generate comprehensive tests by analyzing your code structure, dependencies, and edge cases.

### Basic Test Generation

```text title="Generate Tests for a Function"
> Generate unit tests for the validateEmail function in src/utils/validation.ts
```

```text title="Generate Tests for a Class"
> Create comprehensive tests for the UserService class including happy paths and edge cases
```

```text title="Generate Tests for an API Endpoint"
> Write integration tests for the POST /api/users endpoint
```

## Unit Test Patterns

### Function Testing

```text title="Pure Function Tests"
> Generate tests for this function covering:
> - Normal inputs
> - Boundary values
> - Invalid inputs
> - Type coercion edge cases
```

Claude generates comprehensive unit tests:

```typescript title="src/utils/__tests__/validation.test.ts"
import { validateEmail, validatePassword, validateUsername } from '../validation';

describe('validateEmail', () => {
  describe('valid emails', () => {
    it('should accept standard email format', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    it('should accept email with subdomain', () => {
      expect(validateEmail('user@mail.example.com')).toBe(true);
    });

    it('should accept email with plus sign', () => {
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should accept email with dots in local part', () => {
      expect(validateEmail('first.last@example.com')).toBe(true);
    });
  });

  describe('invalid emails', () => {
    it('should reject email without @', () => {
      expect(validateEmail('userexample.com')).toBe(false);
    });

    it('should reject email without domain', () => {
      expect(validateEmail('user@')).toBe(false);
    });

    it('should reject email without local part', () => {
      expect(validateEmail('@example.com')).toBe(false);
    });

    it('should reject email with spaces', () => {
      expect(validateEmail('user @example.com')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle null input', () => {
      expect(validateEmail(null as any)).toBe(false);
    });

    it('should handle undefined input', () => {
      expect(validateEmail(undefined as any)).toBe(false);
    });

    it('should handle numeric input', () => {
      expect(validateEmail(12345 as any)).toBe(false);
    });
  });
});
```

### Class Testing

```text title="Class with Dependencies"
> Generate tests for UserService that:
> - Mock the database repository
> - Mock the email service
> - Test all public methods
> - Verify mock calls
```

```typescript title="src/services/__tests__/UserService.test.ts"
import { UserService } from '../UserService';
import { UserRepository } from '../../repositories/UserRepository';
import { EmailService } from '../EmailService';
import { User } from '../../models/User';

jest.mock('../../repositories/UserRepository');
jest.mock('../EmailService');

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepo: jest.Mocked<UserRepository>;
  let mockEmailService: jest.Mocked<EmailService>;

  beforeEach(() => {
    mockUserRepo = new UserRepository() as jest.Mocked<UserRepository>;
    mockEmailService = new EmailService() as jest.Mocked<EmailService>;
    userService = new UserService(mockUserRepo, mockEmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const validUserData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      name: 'Test User',
    };

    it('should create user and send welcome email', async () => {
      const mockUser = { id: '1', ...validUserData } as User;
      mockUserRepo.create.mockResolvedValue(mockUser);
      mockEmailService.sendWelcomeEmail.mockResolvedValue(undefined);

      const result = await userService.createUser(validUserData);

      expect(result).toEqual(mockUser);
      expect(mockUserRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: validUserData.email,
          name: validUserData.name,
        })
      );
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(mockUser);
    });

    it('should hash password before storing', async () => {
      const mockUser = { id: '1', ...validUserData } as User;
      mockUserRepo.create.mockResolvedValue(mockUser);

      await userService.createUser(validUserData);

      expect(mockUserRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          password: expect.not.stringMatching(validUserData.password),
        })
      );
    });

    it('should throw if email already exists', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({ id: '1' } as User);

      await expect(userService.createUser(validUserData)).rejects.toThrow(
        'Email already registered'
      );
    });

    it('should not send email if user creation fails', async () => {
      mockUserRepo.create.mockRejectedValue(new Error('Database error'));

      await expect(userService.createUser(validUserData)).rejects.toThrow();
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
    });
  });

  describe('findUserById', () => {
    it('should return user when found', async () => {
      const mockUser = { id: '1', email: 'test@example.com' } as User;
      mockUserRepo.findById.mockResolvedValue(mockUser);

      const result = await userService.findUserById('1');

      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      const result = await userService.findUserById('nonexistent');

      expect(result).toBeNull();
    });
  });
});
```

### Testing Async Code

```text title="Async Testing Patterns"
> Generate tests for async functions including:
> - Promise resolution
> - Promise rejection
> - Timeout handling
> - Retry logic
```

```typescript title="src/services/__tests__/ApiClient.test.ts"
import { ApiClient } from '../ApiClient';

describe('ApiClient', () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient({ baseUrl: 'https://api.example.com' });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('fetch with retry', () => {
    it('should succeed on first try', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      });

      const result = await client.get('/endpoint');

      expect(result).toEqual({ data: 'test' });
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure', async () => {
      global.fetch = jest
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ data: 'test' }),
        });

      const promise = client.get('/endpoint', { retries: 3 });

      // Fast-forward through retries
      await jest.runAllTimersAsync();

      const result = await promise;
      expect(result).toEqual({ data: 'test' });
      expect(fetch).toHaveBeenCalledTimes(3);
    });

    it('should throw after max retries', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const promise = client.get('/endpoint', { retries: 3 });

      await jest.runAllTimersAsync();

      await expect(promise).rejects.toThrow('Network error');
      expect(fetch).toHaveBeenCalledTimes(4); // Initial + 3 retries
    });

    it('should respect timeout', async () => {
      global.fetch = jest.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 10000))
      );

      const promise = client.get('/endpoint', { timeout: 5000 });

      jest.advanceTimersByTime(5000);

      await expect(promise).rejects.toThrow('Request timeout');
    });
  });
});
```

## Integration Test Patterns

### API Integration Tests

```text title="Generate API Tests"
> Create integration tests for the authentication API including:
> - Registration flow
> - Login flow
> - Token refresh
> - Error responses
```

```typescript title="src/api/__tests__/auth.integration.test.ts"
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../db';
import { createTestUser, generateAuthToken } from '../testHelpers';

describe('Auth API Integration', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'new@example.com',
          password: 'SecurePass123!',
          name: 'New User',
        })
        .expect(201);

      expect(response.body).toMatchObject({
        user: {
          email: 'new@example.com',
          name: 'New User',
        },
        token: expect.any(String),
      });

      // Verify user was created in database
      const user = await prisma.user.findUnique({
        where: { email: 'new@example.com' },
      });
      expect(user).toBeTruthy();
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'SecurePass123!',
          name: 'New User',
        })
        .expect(400);

      expect(response.body.error).toContain('email');
    });

    it('should return 409 for duplicate email', async () => {
      await createTestUser({ email: 'existing@example.com' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'SecurePass123!',
          name: 'New User',
        })
        .expect(409);

      expect(response.body.error).toContain('already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await createTestUser({
        email: 'user@example.com',
        password: 'TestPass123!',
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'TestPass123!',
        })
        .expect(200);

      expect(response.body).toMatchObject({
        token: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it('should return 401 for wrong password', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'WrongPass',
        })
        .expect(401);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'TestPass123!',
        })
        .expect(404);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh access token', async () => {
      const user = await createTestUser();
      const { refreshToken } = generateAuthToken(user);

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toMatchObject({
        token: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it('should reject expired refresh token', async () => {
      const expiredToken = generateAuthToken(
        { id: '1' },
        { expiresIn: '-1h' }
      ).refreshToken;

      await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: expiredToken })
        .expect(401);
    });
  });
});
```

### Database Integration Tests

```text title="Database Tests"
> Generate integration tests for UserRepository that:
> - Use a test database
> - Test CRUD operations
> - Test complex queries
> - Handle transactions
```

```typescript title="src/repositories/__tests__/UserRepository.integration.test.ts"
import { UserRepository } from '../UserRepository';
import { prisma } from '../../db';
import { User } from '../../models/User';

describe('UserRepository Integration', () => {
  let repository: UserRepository;

  beforeAll(() => {
    repository = new UserRepository(prisma);
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('should create user with all fields', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        role: 'user' as const,
      };

      const user = await repository.create(userData);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should enforce unique email constraint', async () => {
      await repository.create({
        email: 'duplicate@example.com',
        password: 'hash1',
        name: 'User 1',
      });

      await expect(
        repository.create({
          email: 'duplicate@example.com',
          password: 'hash2',
          name: 'User 2',
        })
      ).rejects.toThrow();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email case-insensitively', async () => {
      await repository.create({
        email: 'Test@Example.com',
        password: 'hash',
        name: 'Test',
      });

      const user = await repository.findByEmail('test@example.com');

      expect(user).toBeTruthy();
      expect(user?.email).toBe('Test@Example.com');
    });
  });

  describe('updateWithTransaction', () => {
    it('should rollback on failure', async () => {
      const user = await repository.create({
        email: 'transaction@example.com',
        password: 'hash',
        name: 'Original',
      });

      await expect(
        repository.updateWithTransaction(user.id, {
          name: 'Updated',
          // This will fail due to foreign key constraint
          organizationId: 'nonexistent',
        })
      ).rejects.toThrow();

      // Verify rollback
      const unchanged = await repository.findById(user.id);
      expect(unchanged?.name).toBe('Original');
    });
  });
});
```

## E2E Test Automation

### Playwright E2E Tests

```text title="Generate E2E Tests"
> Create Playwright E2E tests for the user registration and login flow
```

```typescript title="e2e/auth.spec.ts"
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing session
    await page.context().clearCookies();
  });

  test('complete registration flow', async ({ page }) => {
    await page.goto('/register');

    // Fill registration form
    await page.fill('[data-testid="email-input"]', 'newuser@example.com');
    await page.fill('[data-testid="password-input"]', 'SecurePass123!');
    await page.fill('[data-testid="confirm-password-input"]', 'SecurePass123!');
    await page.fill('[data-testid="name-input"]', 'New User');

    // Submit form
    await page.click('[data-testid="register-button"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Should show welcome message
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText(
      'Welcome, New User'
    );
  });

  test('login with valid credentials', async ({ page }) => {
    // Seed test user via API
    await page.request.post('/api/test/seed-user', {
      data: {
        email: 'existing@example.com',
        password: 'TestPass123!',
      },
    });

    await page.goto('/login');

    await page.fill('[data-testid="email-input"]', 'existing@example.com');
    await page.fill('[data-testid="password-input"]', 'TestPass123!');
    await page.click('[data-testid="login-button"]');

    await expect(page).toHaveURL('/dashboard');
  });

  test('show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[data-testid="email-input"]', 'wrong@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpass');
    await page.click('[data-testid="login-button"]');

    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      'Invalid credentials'
    );
  });

  test('password visibility toggle', async ({ page }) => {
    await page.goto('/login');

    const passwordInput = page.locator('[data-testid="password-input"]');
    const toggleButton = page.locator('[data-testid="toggle-password"]');

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle to show password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('remember me functionality', async ({ page, context }) => {
    await page.request.post('/api/test/seed-user', {
      data: {
        email: 'remember@example.com',
        password: 'TestPass123!',
      },
    });

    await page.goto('/login');

    await page.fill('[data-testid="email-input"]', 'remember@example.com');
    await page.fill('[data-testid="password-input"]', 'TestPass123!');
    await page.check('[data-testid="remember-me"]');
    await page.click('[data-testid="login-button"]');

    await expect(page).toHaveURL('/dashboard');

    // Close and reopen browser
    const cookies = await context.cookies();
    const authCookie = cookies.find((c) => c.name === 'auth_token');

    // With remember me, cookie should have long expiry
    expect(authCookie?.expires).toBeGreaterThan(Date.now() / 1000 + 86400 * 7);
  });
});
```

### Visual Regression Testing

```typescript title="e2e/visual.spec.ts"
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('login page visual', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('dashboard visual', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'TestPass123!');
    await page.click('[data-testid="login-button"]');

    await page.waitForURL('/dashboard');
    await expect(page).toHaveScreenshot('dashboard.png', {
      mask: [page.locator('[data-testid="dynamic-content"]')],
    });
  });

  test('responsive layouts', async ({ page }) => {
    await page.goto('/');

    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page).toHaveScreenshot('home-desktop.png');

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page).toHaveScreenshot('home-tablet.png');

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('home-mobile.png');
  });
});
```

## Test Coverage Improvement

### Coverage Analysis Script

```bash title="scripts/coverage-analysis.sh"
#!/bin/bash
# Analyze test coverage and suggest improvements

# Run coverage
npm run test:coverage -- --json --outputFile=coverage-report.json

# Get coverage summary
COVERAGE=$(cat coverage/coverage-summary.json)

# Find uncovered files
UNCOVERED=$(find src -name "*.ts" -not -name "*.test.ts" -not -name "*.spec.ts" | while read FILE; do
  COVERAGE_FILE="coverage/lcov-report/${FILE%.ts}.ts.html"
  if [ -f "$COVERAGE_FILE" ]; then
    LINES=$(grep -o 'class="cline-no"' "$COVERAGE_FILE" | wc -l)
    if [ "$LINES" -gt 0 ]; then
      echo "$FILE: $LINES uncovered lines"
    fi
  else
    echo "$FILE: No coverage data"
  fi
done)

claude -p "Analyze this test coverage report:

$COVERAGE

Uncovered areas:
$UNCOVERED

Provide:
1. Overall coverage assessment
2. Critical areas needing tests (business logic, security)
3. Files to prioritize for testing
4. Suggested test cases for top 5 uncovered files
5. Quick wins (easy tests to boost coverage)"
```

### Coverage Improvement Prompts

```text title="Improve Coverage for File"
> Analyze the coverage report for src/services/PaymentService.ts and generate
> tests for all uncovered branches and statements
```

```text title="Test Edge Cases"
> Look at the existing tests for UserService and add tests for:
> - Error handling paths
> - Edge cases
> - Boundary conditions
> - Null/undefined inputs
```

### Automated Coverage Gap Detection

```bash title="scripts/find-coverage-gaps.sh"
#!/bin/bash
# Find specific untested code paths

FILE="${1:?File path required}"

# Get coverage for specific file
COVERAGE_HTML="coverage/lcov-report/${FILE%.ts}.ts.html"

if [ ! -f "$COVERAGE_HTML" ]; then
  echo "No coverage data for $FILE"
  exit 1
fi

# Extract uncovered lines
UNCOVERED_LINES=$(grep -n 'class="cline-no"' "$COVERAGE_HTML" | cut -d':' -f1)

# Get the source code
SOURCE=$(cat "$FILE")

claude -p "Analyze this file and its uncovered lines:

**File:** $FILE

**Source:**
$SOURCE

**Uncovered line numbers:**
$UNCOVERED_LINES

Generate test cases that will cover these specific lines.
Explain what each test is verifying."
```

## TDD Workflow with Claude

### Red-Green-Refactor Cycle

```text title="TDD Step 1: Red"
> I'm implementing a new calculateDiscount function using TDD.
> First, write failing tests for these requirements:
> - 10% discount for orders over $100
> - 20% discount for orders over $500
> - 5% extra discount for premium members
> - No discount below $50 minimum
```

```text title="TDD Step 2: Green"
> Now implement the minimum code to make these tests pass
```

```text title="TDD Step 3: Refactor"
> Refactor the implementation to be cleaner while keeping tests green
```

### TDD Session Script

```bash title="scripts/tdd-session.sh"
#!/bin/bash
# Interactive TDD session helper

FEATURE="${1:?Feature description required}"

echo "=== TDD Session: $FEATURE ==="
echo ""

# Step 1: Generate tests
echo "Step 1: Writing tests..."
TESTS=$(claude -p "Write comprehensive tests for this feature (TDD style):

Feature: $FEATURE

Requirements:
- Write tests BEFORE implementation
- Cover happy paths and edge cases
- Use descriptive test names
- Include setup and teardown

Generate the test file content.")

echo "$TESTS" > "src/__tests__/${FEATURE// /_}.test.ts"
echo "Tests written to src/__tests__/${FEATURE// /_}.test.ts"

# Run tests (should fail)
echo ""
echo "Step 2: Running tests (should fail)..."
npm test -- --testPathPattern="${FEATURE// /_}" 2>&1 | head -20

echo ""
echo "Step 3: Ready for implementation"
echo "Run 'claude' and ask it to implement the feature to make tests pass"
```

### Test-First Development

```markdown title="CLAUDE.md"
## TDD Workflow

When implementing new features:

1. **Write tests first** - Ask Claude to generate tests based on requirements
2. **Run tests** - Verify they fail (red phase)
3. **Implement** - Write minimum code to pass (green phase)
4. **Refactor** - Clean up while keeping tests green
5. **Repeat** - Add more tests for edge cases

Commands:
- `npm test -- --watch` - Run tests in watch mode
- `npm test -- --coverage` - Check coverage
- `npm test -- -t "pattern"` - Run specific tests
```

## Mocking Strategies

### Module Mocking

```typescript title="src/__tests__/mockExamples.test.ts"
// Mock entire module
jest.mock('../services/EmailService');

// Mock with implementation
jest.mock('../services/EmailService', () => ({
  sendEmail: jest.fn().mockResolvedValue({ messageId: '123' }),
  validateEmail: jest.fn().mockReturnValue(true),
}));

// Mock with factory
jest.mock('../services/EmailService', () => {
  return {
    EmailService: jest.fn().mockImplementation(() => ({
      sendEmail: jest.fn().mockResolvedValue({ messageId: '123' }),
    })),
  };
});
```

### Dependency Injection Mocking

```text title="Generate DI Mocks"
> Generate a mock factory for UserService that allows:
> - Customizing mock responses per test
> - Tracking method calls
> - Simulating errors
```

```typescript title="src/__tests__/mocks/userServiceMock.ts"
import { UserService } from '../../services/UserService';
import { User } from '../../models/User';

export interface MockUserServiceOptions {
  users?: User[];
  shouldFail?: boolean;
  failureMessage?: string;
}

export function createMockUserService(
  options: MockUserServiceOptions = {}
): jest.Mocked<UserService> {
  const { users = [], shouldFail = false, failureMessage = 'Mock error' } = options;

  return {
    findById: jest.fn().mockImplementation(async (id: string) => {
      if (shouldFail) throw new Error(failureMessage);
      return users.find((u) => u.id === id) || null;
    }),

    findByEmail: jest.fn().mockImplementation(async (email: string) => {
      if (shouldFail) throw new Error(failureMessage);
      return users.find((u) => u.email === email) || null;
    }),

    create: jest.fn().mockImplementation(async (data) => {
      if (shouldFail) throw new Error(failureMessage);
      return { id: 'new-id', ...data, createdAt: new Date() } as User;
    }),

    update: jest.fn().mockImplementation(async (id, data) => {
      if (shouldFail) throw new Error(failureMessage);
      const user = users.find((u) => u.id === id);
      return user ? { ...user, ...data } : null;
    }),

    delete: jest.fn().mockImplementation(async (id) => {
      if (shouldFail) throw new Error(failureMessage);
      return users.some((u) => u.id === id);
    }),
  } as jest.Mocked<UserService>;
}
```

### API Mocking with MSW

```typescript title="src/__tests__/mocks/handlers.ts"
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.json({
        id,
        email: 'user@example.com',
        name: 'Test User',
      })
    );
  }),

  rest.post('/api/auth/login', async (req, res, ctx) => {
    const { email, password } = await req.json();

    if (email === 'valid@example.com' && password === 'correct') {
      return res(
        ctx.json({
          token: 'mock-jwt-token',
          user: { id: '1', email },
        })
      );
    }

    return res(ctx.status(401), ctx.json({ error: 'Invalid credentials' }));
  }),

  rest.get('/api/external-service', (req, res, ctx) => {
    // Simulate external service
    return res(ctx.json({ data: 'mocked external data' }));
  }),
];
```

## Snapshot Testing

### Component Snapshots

```typescript title="src/components/__tests__/Button.test.tsx"
import { render } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders primary button correctly', () => {
    const { container } = render(<Button variant="primary">Click me</Button>);
    expect(container).toMatchSnapshot();
  });

  it('renders disabled state correctly', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    expect(container).toMatchSnapshot();
  });

  it('renders with icon correctly', () => {
    const { container } = render(
      <Button icon={<span>Icon</span>}>With Icon</Button>
    );
    expect(container).toMatchSnapshot();
  });
});
```

### Inline Snapshots

```text title="Generate Inline Snapshot Tests"
> Convert these snapshot tests to inline snapshots for better readability
```

```typescript title="src/utils/__tests__/formatters.test.ts"
import { formatCurrency, formatDate, formatPhoneNumber } from '../formatters';

describe('formatters', () => {
  it('formats currency', () => {
    expect(formatCurrency(1234.56)).toMatchInlineSnapshot(`"$1,234.56"`);
    expect(formatCurrency(0)).toMatchInlineSnapshot(`"$0.00"`);
    expect(formatCurrency(-50)).toMatchInlineSnapshot(`"-$50.00"`);
  });

  it('formats date', () => {
    expect(formatDate(new Date('2024-01-15'))).toMatchInlineSnapshot(
      `"January 15, 2024"`
    );
  });

  it('formats phone number', () => {
    expect(formatPhoneNumber('1234567890')).toMatchInlineSnapshot(
      `"(123) 456-7890"`
    );
  });
});
```

### Snapshot Update Strategy

```bash title="scripts/update-snapshots.sh"
#!/bin/bash
# Intelligently update snapshots

# Get list of failing snapshot tests
FAILING=$(npm test -- --listTests --json 2>/dev/null | jq -r '.testResults[] | select(.numFailingTests > 0) | .name')

if [ -z "$FAILING" ]; then
  echo "No failing snapshot tests"
  exit 0
fi

echo "Failing tests:"
echo "$FAILING"
echo ""

claude -p "Review these failing snapshot tests:

$FAILING

For each failure, determine:
1. Is this an intentional change? (UI update, new feature)
2. Is this a bug? (unintended change)
3. Should the snapshot be updated or the code fixed?

Provide recommendations."
```

## Performance Testing

### Performance Test Generation

```text title="Generate Performance Tests"
> Create performance tests for the search API that:
> - Measure response time
> - Test under load
> - Identify bottlenecks
```

```typescript title="src/api/__tests__/search.perf.test.ts"
import { performance } from 'perf_hooks';
import { searchService } from '../services/SearchService';

describe('Search Performance', () => {
  const PERFORMANCE_THRESHOLD_MS = 100;

  it('should complete simple search within threshold', async () => {
    const start = performance.now();

    await searchService.search({ query: 'test' });

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(PERFORMANCE_THRESHOLD_MS);
  });

  it('should handle complex queries efficiently', async () => {
    const start = performance.now();

    await searchService.search({
      query: 'test',
      filters: { category: 'books', priceRange: [10, 50] },
      sort: 'relevance',
      limit: 100,
    });

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(PERFORMANCE_THRESHOLD_MS * 2);
  });

  it('should maintain performance with pagination', async () => {
    const durations: number[] = [];

    for (let page = 0; page < 10; page++) {
      const start = performance.now();

      await searchService.search({
        query: 'test',
        offset: page * 20,
        limit: 20,
      });

      durations.push(performance.now() - start);
    }

    // All pages should be similarly fast
    const avgDuration = durations.reduce((a, b) => a + b) / durations.length;
    const maxDeviation = Math.max(...durations) - avgDuration;

    expect(maxDeviation).toBeLessThan(avgDuration * 0.5); // Max 50% deviation
  });

  it('should handle concurrent requests', async () => {
    const start = performance.now();

    await Promise.all(
      Array(10)
        .fill(null)
        .map(() => searchService.search({ query: 'concurrent' }))
    );

    const duration = performance.now() - start;

    // 10 concurrent requests should not take 10x longer
    expect(duration).toBeLessThan(PERFORMANCE_THRESHOLD_MS * 3);
  });
});
```

### Load Testing with k6

```javascript title="k6/load-test.js"
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 50 },  // Ramp up more
    { duration: '1m', target: 50 },   // Stay at 50 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% failure rate
  },
};

export default function () {
  // Login
  const loginRes = http.post(
    'http://localhost:3000/api/auth/login',
    JSON.stringify({
      email: 'loadtest@example.com',
      password: 'testpass',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(loginRes, {
    'login successful': (r) => r.status === 200,
  });

  const token = loginRes.json('token');

  // API requests with auth
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Search endpoint
  const searchRes = http.get(
    'http://localhost:3000/api/search?q=test',
    { headers }
  );

  check(searchRes, {
    'search successful': (r) => r.status === 200,
    'search fast': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
```

## Security Testing

### Security Test Generation

```text title="Generate Security Tests"
> Create security tests for the authentication system covering:
> - SQL injection
> - XSS prevention
> - CSRF protection
> - Rate limiting
> - Authentication bypass attempts
```

```typescript title="src/api/__tests__/security.test.ts"
import request from 'supertest';
import { app } from '../../app';

describe('Security Tests', () => {
  describe('SQL Injection Prevention', () => {
    const sqlInjectionPayloads = [
      "'; DROP TABLE users; --",
      "1' OR '1'='1",
      "1; SELECT * FROM users",
      "admin'--",
      "1' UNION SELECT * FROM users--",
    ];

    sqlInjectionPayloads.forEach((payload) => {
      it(`should safely handle SQL injection attempt: ${payload.slice(0, 20)}...`, async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({ email: payload, password: 'test' });

        // Should not cause server error
        expect(response.status).not.toBe(500);
        // Should not return unexpected data
        expect(response.body).not.toHaveProperty('users');
      });
    });
  });

  describe('XSS Prevention', () => {
    const xssPayloads = [
      '<script>alert("xss")</script>',
      '<img src="x" onerror="alert(1)">',
      'javascript:alert(1)',
      '<svg onload="alert(1)">',
      '"><script>alert(1)</script>',
    ];

    xssPayloads.forEach((payload) => {
      it(`should sanitize XSS payload: ${payload.slice(0, 20)}...`, async () => {
        const response = await request(app)
          .post('/api/users')
          .send({ name: payload, email: 'test@example.com' })
          .set('Authorization', 'Bearer valid-token');

        // Response should not contain raw script tags
        const responseText = JSON.stringify(response.body);
        expect(responseText).not.toContain('<script>');
        expect(responseText).not.toContain('javascript:');
      });
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits on login', async () => {
      const attempts = Array(20).fill(null).map(() =>
        request(app)
          .post('/api/auth/login')
          .send({ email: 'test@example.com', password: 'wrong' })
      );

      const responses = await Promise.all(attempts);
      const rateLimited = responses.filter((r) => r.status === 429);

      expect(rateLimited.length).toBeGreaterThan(0);
    });

    it('should include rate limit headers', async () => {
      const response = await request(app).get('/api/users');

      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(response.headers).toHaveProperty('x-ratelimit-remaining');
    });
  });

  describe('Authentication Security', () => {
    it('should reject expired tokens', async () => {
      const expiredToken = generateToken({ id: '1' }, { expiresIn: '-1h' });

      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
    });

    it('should reject tampered tokens', async () => {
      const validToken = generateToken({ id: '1' });
      const tamperedToken = validToken.slice(0, -10) + 'tampered!!';

      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${tamperedToken}`);

      expect(response.status).toBe(401);
    });

    it('should not leak user existence in login errors', async () => {
      const existingUserResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'existing@example.com', password: 'wrong' });

      const nonExistingUserResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexisting@example.com', password: 'wrong' });

      // Error messages should be identical
      expect(existingUserResponse.body.error).toBe(
        nonExistingUserResponse.body.error
      );
    });
  });

  describe('CSRF Protection', () => {
    it('should require CSRF token for state-changing operations', async () => {
      const response = await request(app)
        .post('/api/users/settings')
        .send({ theme: 'dark' })
        .set('Authorization', 'Bearer valid-token');
      // No CSRF token

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('CSRF');
    });
  });

  describe('Header Security', () => {
    it('should set security headers', async () => {
      const response = await request(app).get('/');

      expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(response.headers).toHaveProperty('x-frame-options', 'DENY');
      expect(response.headers).toHaveProperty('x-xss-protection', '1; mode=block');
      expect(response.headers).toHaveProperty('strict-transport-security');
    });
  });
});
```

### Automated Security Scanning

```bash title="scripts/security-scan.sh"
#!/bin/bash
# Run security tests and analysis

echo "=== Security Scan ==="
echo ""

# 1. Run security-focused tests
echo "1. Running security tests..."
npm test -- --testPathPattern="security" --coverage

# 2. Dependency audit
echo ""
echo "2. Checking dependencies..."
npm audit --json > audit-report.json

# 3. Static analysis for security issues
echo ""
echo "3. Static analysis..."
npx eslint src/ --config .eslintrc.security.json --format json > eslint-security.json 2>/dev/null || true

# 4. Analyze results with Claude
AUDIT=$(cat audit-report.json)
ESLINT=$(cat eslint-security.json 2>/dev/null || echo "{}")

claude -p "Analyze these security scan results:

**Dependency Audit:**
$AUDIT

**Static Analysis:**
$ESLINT

Provide:
1. Critical issues requiring immediate attention
2. High-priority fixes
3. Recommended actions
4. Security best practices being followed
5. Areas needing improvement"
```

## Test Organization Best Practices

### Test Configuration

```javascript title="jest.config.js"
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

### Test Helpers

```typescript title="src/__tests__/testHelpers.ts"
import { prisma } from '../db';
import jwt from 'jsonwebtoken';

export async function createTestUser(overrides = {}) {
  return prisma.user.create({
    data: {
      email: `test-${Date.now()}@example.com`,
      password: 'hashedpassword',
      name: 'Test User',
      ...overrides,
    },
  });
}

export function generateAuthToken(user: { id: string }, options = {}) {
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
    ...options,
  });

  const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d',
    ...options,
  });

  return { token, refreshToken };
}

export async function cleanupTestData() {
  await prisma.user.deleteMany({
    where: { email: { contains: 'test-' } },
  });
}

export function expectToBeWithinRange(value: number, min: number, max: number) {
  expect(value).toBeGreaterThanOrEqual(min);
  expect(value).toBeLessThanOrEqual(max);
}
```

### Test Structure Guidelines

```markdown title="CLAUDE.md"
## Testing Guidelines

### File Organization
```
src/
  services/
    UserService.ts
    __tests__/
      UserService.test.ts       # Unit tests
      UserService.integration.test.ts  # Integration tests
e2e/
  auth.spec.ts                  # E2E tests
  user-flows.spec.ts
```

### Test Naming
- Describe what is being tested
- Use "should" for expected behavior
- Be specific about conditions

### Test Coverage Requirements
- Minimum 80% coverage for all metrics
- 100% coverage for critical paths (auth, payments)
- All public APIs must have tests

### Commands
- `npm test` - Run all tests
- `npm test -- --watch` - Watch mode
- `npm test -- -t "pattern"` - Run matching tests
- `npm run test:coverage` - With coverage
- `npm run test:e2e` - E2E tests only
```

## Next Steps

- [Git Integration](/guides/git-integration) - Version control workflows
- [CI/CD Integration](/guides/ci-cd) - Automated testing in pipelines
- [Best Practices](/guides/best-practices) - General development practices
- [Workflow Patterns](/guides/workflow-patterns) - Complete development workflows
