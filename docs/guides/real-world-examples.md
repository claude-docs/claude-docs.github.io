---
sidebar_position: 10
title: Real-World Examples
description: Complete, step-by-step examples of using Claude Code for common development scenarios
---

# Real-World Examples

Complete, practical examples showing how to use Claude Code for everyday development tasks.

## Building a REST API from Scratch

### Scenario

You need to build a REST API for a task management application with CRUD operations.

### Step-by-Step Process

```bash title="1. Initialize the Project"
mkdir task-api && cd task-api
npm init -y
claude
```

```text title="2. Project Setup"
> Set up an Express.js REST API with TypeScript. Include:
> - Express with TypeScript configuration
> - ESLint and Prettier
> - Jest for testing
> - A basic folder structure (src/routes, src/controllers, src/models, src/middleware)
```

```text title="3. Create the Data Model"
> Create a Task model with these fields:
> - id (UUID)
> - title (string, required)
> - description (string, optional)
> - status (enum: pending, in_progress, completed)
> - priority (enum: low, medium, high)
> - dueDate (Date, optional)
> - createdAt, updatedAt timestamps
>
> Use TypeScript interfaces and add validation with Zod
```

```text title="4. Implement CRUD Endpoints"
> Create REST endpoints for tasks:
> - GET /tasks - List all tasks with filtering by status and priority
> - GET /tasks/:id - Get a single task
> - POST /tasks - Create a new task
> - PUT /tasks/:id - Update a task
> - DELETE /tasks/:id - Delete a task
>
> Include proper error handling and input validation
```

```text title="5. Add Middleware"
> Add middleware for:
> - Request logging with timestamps
> - Error handling that returns consistent JSON errors
> - Request ID generation for tracing
> - Rate limiting (100 requests per minute per IP)
```

```text title="6. Write Tests"
> Write comprehensive tests for:
> - All CRUD endpoints
> - Input validation (valid and invalid inputs)
> - Error scenarios (not found, validation errors)
> - Rate limiting behavior
```

```text title="7. Add Documentation"
> Generate OpenAPI/Swagger documentation for the API
> Include example requests and responses for each endpoint
```

### Final Directory Structure

```
task-api/
├── src/
│   ├── controllers/
│   │   └── taskController.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   ├── logger.ts
│   │   ├── rateLimiter.ts
│   │   └── requestId.ts
│   ├── models/
│   │   └── task.ts
│   ├── routes/
│   │   └── taskRoutes.ts
│   ├── schemas/
│   │   └── taskSchema.ts
│   ├── app.ts
│   └── index.ts
├── tests/
│   └── tasks.test.ts
├── package.json
├── tsconfig.json
└── swagger.yaml
```

---

## Adding Authentication to an Existing App

### Scenario

You have an existing Express application and need to add JWT-based authentication.

### Step-by-Step Process

```text title="1. Assess the Current State"
> Analyze the current codebase and identify:
> - Existing routes that need protection
> - Current user model (if any)
> - Database setup being used
> - Any existing auth patterns
```

```text title="2. Plan the Implementation"
> Plan JWT authentication implementation:
> - Registration with email/password
> - Login returning access and refresh tokens
> - Token refresh endpoint
> - Password reset flow
> - Protected route middleware
> Don't code yet, just outline the approach
```

```text title="3. Install Dependencies"
> Add the necessary dependencies for JWT auth:
> - jsonwebtoken for token handling
> - bcrypt for password hashing
> - Add TypeScript types for these packages
```

```text title="4. Create/Update User Model"
> Update the User model to include:
> - email (unique, required)
> - passwordHash (string)
> - refreshTokenHash (for secure refresh token storage)
> - emailVerified (boolean)
> - lastLogin (Date)
> Add proper indexes for email lookup
```

```text title="5. Create Auth Service"
> Create an authentication service with these methods:
> - register(email, password) - Create new user with hashed password
> - login(email, password) - Verify credentials, return tokens
> - refreshToken(token) - Issue new access token
> - logout(userId) - Invalidate refresh token
> - changePassword(userId, oldPassword, newPassword)
>
> Use environment variables for JWT secrets and expiry times
```

```text title="6. Add Auth Middleware"
> Create middleware that:
> - Extracts JWT from Authorization header (Bearer token)
> - Verifies token signature and expiry
> - Attaches user info to request object
> - Returns 401 for invalid/expired tokens
```

```text title="7. Create Auth Routes"
> Create these authentication endpoints:
> - POST /auth/register
> - POST /auth/login
> - POST /auth/refresh
> - POST /auth/logout
> - POST /auth/change-password
>
> Include rate limiting on auth endpoints
```

```text title="8. Protect Existing Routes"
> Apply the auth middleware to all existing routes that need protection.
> Keep public routes accessible without authentication.
```

```text title="9. Add Auth Tests"
> Write tests covering:
> - Registration (success and duplicate email)
> - Login (success, wrong password, unknown email)
> - Token refresh (valid and invalid tokens)
> - Protected routes (with and without valid token)
> - Token expiry handling
```

### Key Files Created

```typescript title="src/middleware/auth.ts"
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as { id: string; email: string };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

## Database Schema Migration

### Scenario

Your application needs to add new features requiring database schema changes, and you need to do this safely in production.

### Step-by-Step Process

```text title="1. Analyze Current Schema"
> Analyze the current database schema and show me:
> - All existing tables and their relationships
> - Current indexes
> - Any constraints or triggers
```

```text title="2. Plan the Migration"
> I need to add these features:
> - User profiles with avatar, bio, and social links
> - Activity logging for audit trail
> - Soft delete for users and tasks
>
> Plan the schema changes needed, considering:
> - Backward compatibility
> - Data preservation
> - Performance implications
> Don't create migrations yet
```

```text title="3. Create Migration Files"
> Create database migrations using our migration tool for:
>
> Migration 1: Add user profiles table
> - user_id (foreign key to users)
> - avatar_url, bio, website, twitter, github
> - created_at, updated_at
>
> Migration 2: Add activity logs table
> - id, user_id, action, entity_type, entity_id
> - metadata (JSON), ip_address, user_agent
> - created_at
>
> Migration 3: Add soft delete columns
> - Add deleted_at to users and tasks tables
> - Update existing queries to exclude soft-deleted records
>
> Include both up and down migrations
```

```text title="4. Add Indexes"
> Add appropriate indexes for:
> - Activity log queries by user_id and created_at
> - Soft delete queries (partial indexes on deleted_at IS NULL)
> - Any foreign key columns
```

```text title="5. Update Models"
> Update the ORM models to:
> - Include new profile relation on User
> - Add ActivityLog model
> - Implement soft delete behavior
> - Add default scopes to exclude soft-deleted records
```

```text title="6. Create Rollback Plan"
> Create a rollback plan with:
> - Commands to reverse each migration
> - Data backup procedures
> - Verification queries to confirm rollback success
```

```text title="7. Test Migrations"
> Write migration tests that:
> - Apply migrations to a test database
> - Verify schema changes are correct
> - Test rollback works properly
> - Confirm existing data is preserved
```

### Example Migration Output

```typescript title="migrations/20240115_add_user_profiles.ts"
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_profiles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().unique()
      .references('id').inTable('users').onDelete('CASCADE');
    table.string('avatar_url', 500);
    table.text('bio');
    table.string('website', 255);
    table.string('twitter', 50);
    table.string('github', 50);
    table.timestamps(true, true);

    table.index('user_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_profiles');
}
```

---

## Frontend Component Library Creation

### Scenario

You need to create a reusable component library for your React application with consistent styling.

### Step-by-Step Process

```text title="1. Set Up the Library"
> Set up a React component library with:
> - TypeScript
> - Storybook for documentation
> - CSS Modules or styled-components (your preference: CSS Modules)
> - Rollup for bundling
> - Jest and React Testing Library
```

```text title="2. Create Design Tokens"
> Create a design token system with:
> - Color palette (primary, secondary, neutral, semantic colors)
> - Typography scale (font sizes, line heights, font weights)
> - Spacing scale (4px base unit)
> - Border radius values
> - Shadow definitions
> - Breakpoints for responsive design
>
> Export as CSS custom properties and TypeScript constants
```

```text title="3. Build Core Components"
> Create these foundational components:
>
> Button:
> - Variants: primary, secondary, outline, ghost, danger
> - Sizes: sm, md, lg
> - States: loading, disabled
> - Support icons (left/right)
>
> Include full TypeScript props interface and Storybook stories
```

```text title="4. Build Form Components"
> Create form components:
>
> Input:
> - Types: text, email, password, number
> - States: error, disabled, readonly
> - Support labels, helper text, error messages
> - Prefix/suffix support
>
> Select:
> - Single and multi-select
> - Searchable option
> - Custom option rendering
>
> Checkbox and Radio:
> - With labels
> - Indeterminate state for checkbox
> - Radio groups
```

```text title="5. Build Layout Components"
> Create layout components:
>
> Stack - Vertical or horizontal flex layout with gap
> Grid - CSS Grid wrapper with responsive columns
> Container - Max-width container with padding
> Card - Content container with header, body, footer sections
> Divider - Horizontal or vertical line separator
```

```text title="6. Build Feedback Components"
> Create feedback components:
>
> Alert - Info, success, warning, error variants with dismiss
> Toast - Notification system with auto-dismiss
> Modal - Accessible modal dialog with portal
> Tooltip - Hover tooltips with positioning
> Skeleton - Loading placeholder with animation
```

```text title="7. Add Accessibility"
> Review all components for accessibility:
> - ARIA attributes where needed
> - Keyboard navigation
> - Focus management
> - Screen reader support
> - Color contrast compliance
>
> Add accessibility tests
```

```text title="8. Create Documentation"
> For each component, create:
> - Storybook stories showing all variants
> - Props documentation
> - Usage examples
> - Do's and don'ts
```

### Component Example

```tsx title="src/components/Button/Button.tsx"
import React from 'react';
import styles from './Button.module.css';
import { Loader } from '../Loader';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className || ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader size="sm" className={styles.loader} />}
      {!loading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}
      <span className={styles.content}>{children}</span>
      {!loading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
    </button>
  );
};
```

---

## CLI Tool Development

### Scenario

You need to build a command-line tool for managing project configurations across multiple repositories.

### Step-by-Step Process

```text title="1. Initialize CLI Project"
> Create a Node.js CLI tool with:
> - TypeScript
> - Commander.js for argument parsing
> - Inquirer for interactive prompts
> - Chalk for colored output
> - Ora for spinners
> - Proper bin configuration in package.json
```

```text title="2. Design Command Structure"
> Design commands for a project config manager:
>
> config-manager init - Initialize config in current project
> config-manager sync - Sync config from remote template
> config-manager diff - Show differences from template
> config-manager update <file> - Update specific config file
> config-manager list - List managed config files
>
> Support global flags: --verbose, --dry-run, --config <path>
```

```text title="3. Implement Init Command"
> Implement the init command that:
> - Detects project type (Node, Python, Go, etc.)
> - Prompts for template selection
> - Creates .configmanager.json with settings
> - Downloads and applies initial configs
> - Shows summary of changes made
```

```text title="4. Implement Sync Command"
> Implement sync command that:
> - Reads current config manager settings
> - Fetches latest template from remote
> - Shows diff of changes to be applied
> - Prompts for confirmation (unless --yes flag)
> - Applies changes with backup of originals
> - Handles conflicts with merge strategy options
```

```text title="5. Add Config File Handlers"
> Create handlers for different config files:
>
> ESLint - Merge rules, extend plugins
> Prettier - Override specific settings
> TypeScript - Merge compiler options
> Package.json scripts - Add/update scripts
> GitHub Actions - Update workflow files
>
> Each handler should understand the file format and merge intelligently
```

```text title="6. Add Remote Template Support"
> Add support for remote templates:
> - GitHub repository templates
> - NPM package templates
> - Local file templates
> - Template versioning
> - Caching for offline use
```

```text title="7. Error Handling and Logging"
> Add robust error handling:
> - Friendly error messages
> - Debug mode with stack traces
> - Log file for troubleshooting
> - Rollback on failure
```

```text title="8. Write Tests and Documentation"
> Create:
> - Unit tests for each command
> - Integration tests with mock filesystem
> - README with installation and usage
> - Man page or help documentation
```

### CLI Example Output

```bash
$ config-manager init

  Config Manager v1.0.0

? Detected Node.js project. Is this correct? Yes
? Select a template:
  > Standard (ESLint, Prettier, TypeScript)
    Minimal (ESLint only)
    Full (Standard + GitHub Actions + Husky)

  Initializing with Standard template...

  Created .eslintrc.json
  Created .prettierrc
  Updated tsconfig.json (merged 3 options)
  Created .configmanager.json

  Initialization complete!
  Run 'config-manager sync' to keep configs updated.
```

---

## Test Suite Improvement

### Scenario

Your project has minimal test coverage, and you need to improve it systematically.

### Step-by-Step Process

```text title="1. Assess Current Coverage"
> Analyze the current test situation:
> - Run coverage report and summarize results
> - Identify files with no tests
> - Find files with low coverage
> - List critical paths that need testing
```

```text title="2. Identify Testing Priorities"
> Based on the codebase analysis, prioritize testing:
> 1. Critical business logic
> 2. Error-prone areas (complex functions)
> 3. Frequently changed files
> 4. Public API surfaces
>
> Create a testing roadmap with priorities
```

```text title="3. Set Up Test Infrastructure"
> Improve the test setup:
> - Add test utilities and helpers
> - Create mock factories for common objects
> - Set up test database handling
> - Add snapshot testing where appropriate
> - Configure coverage thresholds
```

```text title="4. Add Unit Tests for Core Logic"
> Starting with the highest priority, add unit tests for:
> - [specific file/module]
>
> Cover:
> - Happy path scenarios
> - Edge cases
> - Error conditions
> - Boundary values
```

```text title="5. Add Integration Tests"
> Add integration tests for:
> - API endpoints (request/response cycle)
> - Database operations
> - External service interactions (with mocks)
> - Authentication flows
```

```text title="6. Add E2E Tests for Critical Flows"
> Create end-to-end tests for:
> - User registration and login
> - Main feature workflows
> - Payment flows (if applicable)
> Use Playwright or Cypress
```

```text title="7. Improve Test Quality"
> Review existing tests and improve:
> - Remove flaky tests or fix their root cause
> - Add meaningful assertions (not just checking existence)
> - Improve test descriptions for clarity
> - Remove duplicate test code
> - Add missing arrange-act-assert structure
```

```text title="8. Set Up CI Integration"
> Configure CI to:
> - Run tests on all PRs
> - Enforce coverage thresholds
> - Report coverage changes
> - Block merges on test failures
```

### Test Factory Example

```typescript title="tests/factories/userFactory.ts"
import { faker } from '@faker-js/faker';
import { User, UserRole } from '../../src/models/user';

interface UserOverrides {
  id?: string;
  email?: string;
  name?: string;
  role?: UserRole;
  createdAt?: Date;
}

export function createMockUser(overrides: UserOverrides = {}): User {
  return {
    id: overrides.id ?? faker.string.uuid(),
    email: overrides.email ?? faker.internet.email(),
    name: overrides.name ?? faker.person.fullName(),
    role: overrides.role ?? 'user',
    createdAt: overrides.createdAt ?? faker.date.past(),
    updatedAt: new Date(),
    emailVerified: true,
  };
}

export function createMockUsers(count: number, overrides: UserOverrides = {}): User[] {
  return Array.from({ length: count }, () => createMockUser(overrides));
}
```

---

## Legacy Code Modernization

### Scenario

You have a legacy JavaScript codebase that needs to be modernized to TypeScript with updated patterns.

### Step-by-Step Process

```text title="1. Assessment Phase"
> Analyze this legacy codebase:
> - What JS version/patterns are used?
> - What's the module system (CommonJS, AMD, globals)?
> - Are there any existing type hints (JSDoc)?
> - What dependencies need updating?
> - What's the test coverage situation?
>
> Provide a modernization assessment report
```

```text title="2. Create Migration Plan"
> Create a phased migration plan:
>
> Phase 1: Setup (non-breaking)
> - Add TypeScript config
> - Enable allowJs
> - Add build pipeline
>
> Phase 2: Foundation (gradual)
> - Convert utility files first
> - Add types for external dependencies
> - Create shared type definitions
>
> Phase 3: Core (systematic)
> - Convert core modules
> - Update patterns to modern standards
> - Add strict null checks
>
> Phase 4: Completion
> - Convert remaining files
> - Enable strict mode
> - Remove legacy patterns
```

```text title="3. Set Up TypeScript Infrastructure"
> Add TypeScript support without breaking existing code:
> - tsconfig.json with allowJs: true
> - Build script that compiles TS and copies JS
> - Update package.json scripts
> - Configure path aliases if needed
```

```text title="4. Create Type Definitions"
> Create type definitions for:
> - Internal modules without types
> - Custom types used across the codebase
> - API response shapes
> - Configuration objects
> Start with a types/ folder for shared definitions
```

```text title="5. Convert Files Incrementally"
> Convert this file to TypeScript: [filename.js]
>
> Requirements:
> - Keep the same public API
> - Add proper types for all functions
> - Replace var with const/let
> - Use modern array methods
> - Add null checks where needed
> - Keep the file working during migration
```

```text title="6. Update Legacy Patterns"
> Update these legacy patterns:
> - Callbacks to async/await
> - Prototypal inheritance to classes
> - var to const/let
> - String concatenation to template literals
> - Lodash functions to native equivalents where possible
> - Promise chains to async/await
```

```text title="7. Add Missing Tests"
> Add tests for converted modules to ensure:
> - Behavior is unchanged
> - Type safety is enforced
> - Edge cases are covered
```

```text title="8. Enable Strict Mode"
> After all files are converted, enable strict mode:
> - Fix any strict null check errors
> - Add explicit types where inference fails
> - Ensure no any types remain
> - Update tsconfig for production use
```

### Migration Example

```javascript title="Before: utils/format.js"
var moment = require('moment');

function formatDate(date, format) {
  if (!date) return '';
  return moment(date).format(format || 'YYYY-MM-DD');
}

function formatCurrency(amount, currency) {
  if (amount === null || amount === undefined) return '';
  return currency + amount.toFixed(2);
}

module.exports = { formatDate, formatCurrency };
```

```typescript title="After: utils/format.ts"
import { format as dateFnsFormat, parseISO } from 'date-fns';

type DateInput = Date | string | null | undefined;

export function formatDate(
  date: DateInput,
  formatString: string = 'yyyy-MM-dd'
): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateFnsFormat(dateObj, formatString);
}

export function formatCurrency(
  amount: number | null | undefined,
  currency: string = '$'
): string {
  if (amount === null || amount === undefined) return '';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === '$' ? 'USD' : currency,
  }).format(amount);
}
```

---

## Microservices Refactoring

### Scenario

You need to extract a feature from a monolith into a separate microservice.

### Step-by-Step Process

```text title="1. Identify Service Boundaries"
> Analyze the codebase to identify the notification feature:
> - What code handles notifications?
> - What database tables are involved?
> - What are the integration points with other features?
> - What external services does it use?
>
> Map all dependencies and data flows
```

```text title="2. Design the Service Interface"
> Design the notification service API:
> - What endpoints are needed?
> - What events should it consume?
> - What events should it publish?
> - What's the data contract?
>
> Create OpenAPI spec for the service interface
```

```text title="3. Create Service Scaffold"
> Create a new microservice project for notifications:
> - Same tech stack as main app (Node/TypeScript)
> - Include health checks and metrics endpoints
> - Set up configuration management
> - Add Docker configuration
> - Include CI/CD pipeline
```

```text title="4. Implement Core Service Logic"
> Move and adapt the notification logic:
> - Extract notification sending logic
> - Create notification queue handler
> - Implement retry logic with exponential backoff
> - Add rate limiting for external providers
> - Include template management
```

```text title="5. Set Up Event Communication"
> Implement event-based communication:
> - Set up message queue (RabbitMQ/Kafka)
> - Define event schemas
> - Create publishers in the monolith
> - Create consumers in the notification service
> - Add dead letter queue handling
```

```text title="6. Create Database Migration"
> Set up the notification service database:
> - Create new database/schema
> - Migrate notification-related tables
> - Set up data sync during transition
> - Plan for eventual consistency
```

```text title="7. Implement Client Library"
> Create a client library for the notification service:
> - Type-safe API client
> - Retry logic with circuit breaker
> - Fallback behavior
> - Caching where appropriate
```

```text title="8. Update Monolith"
> Update the monolith to use the new service:
> - Replace direct notification calls with client library
> - Keep old code behind feature flag
> - Implement dual-write during migration
> - Add monitoring for migration progress
```

```text title="9. Testing Strategy"
> Create comprehensive tests:
> - Unit tests for service logic
> - Integration tests with real message queue
> - Contract tests for API
> - End-to-end tests with monolith integration
```

### Service Architecture

```mermaid
flowchart TD
    subgraph Monolith
        NC[Notif. Client]
    end

    subgraph NS[Notification Service]
        EC[Event Consumer]
        NW[Notification Workers]
        PA[Provider Adapters]
    end

    Monolith -->|Events| NS
    NC -->|HTTP API| EC
    EC --> NW
    NW --> PA

    PA --> Email[Email Provider]
    PA --> SMS[SMS Provider]
    PA --> Push[Push Provider]

    style Monolith fill:#e0e7ff,stroke:#6366f1
    style NS fill:#dbeafe,stroke:#3b82f6
    style Email fill:#d1fae5,stroke:#10b981
    style SMS fill:#d1fae5,stroke:#10b981
    style Push fill:#d1fae5,stroke:#10b981
```

---

## Mobile App Feature Development

### Scenario

You need to add an offline-capable favorites feature to a React Native app.

### Step-by-Step Process

```text title="1. Feature Planning"
> Plan the offline favorites feature:
> - Users can favorite items while offline
> - Favorites sync when back online
> - Handle sync conflicts
> - Show sync status to users
>
> Create technical design document
```

```text title="2. Set Up Local Storage"
> Implement local storage for favorites:
> - Use AsyncStorage or WatermelonDB
> - Create schema for local favorites
> - Add sync status tracking (synced, pending, conflict)
> - Implement CRUD operations
```

```text title="3. Create Favorites Context"
> Create React context for favorites:
> - Provide favorites list
> - Add/remove favorites methods
> - Sync status and actions
> - Optimistic updates
> - Error handling
```

```text title="4. Implement Sync Logic"
> Create sync mechanism:
> - Detect online/offline status
> - Queue changes when offline
> - Sync pending changes when online
> - Handle conflicts (last-write-wins or user choice)
> - Retry failed syncs with backoff
```

```text title="5. Build UI Components"
> Create UI components:
>
> FavoriteButton:
> - Toggle state
> - Loading/syncing indicator
> - Offline badge when pending
>
> FavoritesList:
> - List of favorited items
> - Pull to refresh with sync
> - Sync status banner
> - Empty state
```

```text title="6. Add Network Status Handling"
> Implement network status features:
> - NetInfo listener for connectivity
> - Background sync when app returns to foreground
> - Notification when sync completes
> - Offline mode indicator in UI
```

```text title="7. Test Offline Scenarios"
> Test these scenarios:
> - Add favorite while offline, then go online
> - Edit favorite while offline on two devices
> - Delete favorite while offline
> - Network failure during sync
> - App killed during sync
```

### Component Example

```tsx title="src/components/FavoriteButton.tsx"
import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFavorites } from '../contexts/FavoritesContext';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface FavoriteButtonProps {
  itemId: string;
  size?: number;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  itemId,
  size = 24
}) => {
  const { favorites, toggleFavorite, syncStatus } = useFavorites();
  const { isOnline } = useNetworkStatus();

  const favorite = favorites.find(f => f.itemId === itemId);
  const isFavorited = !!favorite;
  const isPending = favorite?.syncStatus === 'pending';
  const isSyncing = syncStatus.syncing && isPending;

  const handlePress = async () => {
    await toggleFavorite(itemId);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.button}
      disabled={isSyncing}
    >
      {isSyncing ? (
        <ActivityIndicator size={size} color="#FF6B6B" />
      ) : (
        <>
          <Icon
            name={isFavorited ? 'favorite' : 'favorite-border'}
            size={size}
            color={isFavorited ? '#FF6B6B' : '#666'}
          />
          {isPending && !isOnline && (
            <Icon
              name="cloud-off"
              size={12}
              color="#999"
              style={styles.offlineIndicator}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    position: 'relative',
  },
  offlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
});
```

---

## DevOps Pipeline Setup

### Scenario

You need to set up a complete CI/CD pipeline for a new project using GitHub Actions.

### Step-by-Step Process

```text title="1. Define Pipeline Requirements"
> Design CI/CD pipeline for a Node.js API:
> - Run on all PRs and main branch
> - Lint, test, build stages
> - Security scanning
> - Deploy to staging on main
> - Deploy to production on release tags
> - Slack notifications
```

```text title="2. Create PR Workflow"
> Create a GitHub Actions workflow for PRs:
> - Trigger on pull_request
> - Run lint check
> - Run unit tests with coverage
> - Run integration tests
> - Build to verify compilation
> - Comment coverage report on PR
```

```text title="3. Create Main Branch Workflow"
> Create workflow for main branch:
> - All PR checks
> - Build Docker image
> - Push to container registry
> - Deploy to staging environment
> - Run smoke tests
> - Notify on Slack
```

```text title="4. Create Release Workflow"
> Create workflow for releases:
> - Trigger on version tags (v*)
> - Run full test suite
> - Build production Docker image
> - Deploy to production
> - Run smoke tests
> - Create GitHub release with changelog
> - Notify team
```

```text title="5. Add Security Scanning"
> Add security scanning steps:
> - npm audit for dependencies
> - Snyk or Dependabot for vulnerabilities
> - CodeQL for code scanning
> - Container image scanning
> - Secret scanning
```

```text title="6. Set Up Environments"
> Configure GitHub environments:
> - staging: auto-deploy from main
> - production: require approval, deploy from tags
> - Add environment secrets
> - Configure protection rules
```

```text title="7. Add Monitoring Integration"
> Integrate deployment monitoring:
> - Deployment markers in APM (Datadog/New Relic)
> - Health check verification after deploy
> - Auto-rollback on failure
> - Performance comparison
```

```text title="8. Document Pipeline"
> Create documentation:
> - Pipeline overview diagram
> - How to run locally
> - Environment configuration
> - Troubleshooting guide
> - Manual deployment procedures
```

### Workflow Example

```yaml title=".github/workflows/ci.yml"
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/
      - name: Deploy to staging
        run: |
          # Add deployment commands here
          echo "Deploying to staging..."
      - name: Run smoke tests
        run: |
          curl -f ${{ vars.STAGING_URL }}/health || exit 1
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Deployed to staging: ${{ github.sha }}"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Next Steps

- [Productivity Tips](/guides/productivity-tips) - Optimize your workflow
- [Workflow Patterns](/guides/workflow-patterns) - Structured development workflows
- [Automation Recipes](/guides/automation-recipes) - Ready-to-use automation scripts
- [Best Practices](/guides/best-practices) - General best practices
