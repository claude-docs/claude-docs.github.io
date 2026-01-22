---
sidebar_position: 4
title: Advanced Skills
description: Advanced skill architecture and techniques for Claude Code
---

# Advanced Skills

Master advanced skill patterns for complex workflows and team-wide solutions.

## Skill Architecture Deep Dive

### File System Structure

A comprehensive skill can span multiple files:

```
.claude/
└── skills/
    └── deployment/
        ├── SKILL.md           # Main skill definition
        ├── config.yaml        # Skill configuration
        ├── templates/         # Code templates
        │   ├── dockerfile
        │   └── k8s-manifest.yaml
        ├── scripts/           # Helper scripts
        │   └── health-check.sh
        ├── examples/          # Usage examples
        │   ├── basic.md
        │   └── advanced.md
        └── tests/             # Skill tests
            └── test-cases.md
```

### Skill Loading Order

Claude processes skills in this order:

1. **Metadata parsing** - Frontmatter extracted
2. **Dependency resolution** - Required skills loaded first
3. **Content loading** - Instructions parsed
4. **Template inclusion** - External files imported
5. **Context activation** - Skill becomes available

### Memory and Context

Skills consume context window space:

```yaml
---
name: lightweight
description: Minimal context usage
context_priority: low      # Loaded only when explicitly needed
max_tokens: 500           # Limit skill size in context
---
```

## Multi-File Skills

### Splitting Large Skills

For complex workflows, split into focused files:

```markdown title=".claude/skills/fullstack/SKILL.md"
---
name: fullstack
description: Full-stack development workflow
includes:
  - ./frontend.md
  - ./backend.md
  - ./database.md
  - ./deployment.md
---

# Full-Stack Development Skill

This skill guides full-stack development. See included files for specific areas.

## Quick Reference

- Frontend: React/TypeScript patterns
- Backend: Node.js/Express API
- Database: PostgreSQL with Prisma
- Deployment: Docker + Kubernetes
```

```markdown title=".claude/skills/fullstack/frontend.md"
# Frontend Development

## Component Structure

All components follow this pattern:

```typescript
// src/components/ComponentName/index.tsx
export { ComponentName } from './ComponentName';

// src/components/ComponentName/ComponentName.tsx
import { FC } from 'react';
import { ComponentNameProps } from './types';
import styles from './styles.module.css';

export const ComponentName: FC<ComponentNameProps> = ({ prop1, prop2 }) => {
  return <div className={styles.container}>...</div>;
};

// src/components/ComponentName/types.ts
export interface ComponentNameProps {
  prop1: string;
  prop2?: number;
}
```

## State Management

Use Zustand for global state:

```typescript
// src/stores/useAppStore.ts
import { create } from 'zustand';

interface AppState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```
```

### Include Syntax

Reference external content:

```markdown
---
name: api-design
includes:
  - ./schemas/*.md           # Glob patterns
  - ./examples/rest.md       # Specific files
  - ../shared/auth.md        # Relative paths
---
```

### Conditional Includes

Include files based on project context:

```markdown
---
name: testing
conditional_includes:
  - condition: file_exists("jest.config.js")
    include: ./jest-patterns.md
  - condition: file_exists("vitest.config.ts")
    include: ./vitest-patterns.md
  - condition: file_exists("cypress.config.js")
    include: ./e2e-patterns.md
---
```

## Skill Dependencies

### Declaring Dependencies

Skills can require other skills:

```yaml
---
name: deploy-production
description: Production deployment workflow
requires:
  - deploy-base          # Must be loaded first
  - security-check       # Security validation
  - monitoring           # Monitoring setup
---
```

### Dependency Chain

```
deploy-production
├── deploy-base
│   └── infrastructure
├── security-check
│   ├── secrets-scan
│   └── vulnerability-check
└── monitoring
    └── alerting
```

### Optional Dependencies

```yaml
---
name: test-generator
requires:
  - base-testing                    # Required
optional:
  - coverage-reporter               # Nice to have
  - mutation-testing               # Advanced feature
---
```

### Conflict Resolution

Handle conflicting skills:

```yaml
---
name: eslint-config
conflicts:
  - prettier-only          # Can't use both
replaces:
  - legacy-linting         # Supersedes old skill
---
```

## Conditional Instructions

### Environment Detection

```markdown
# Deployment Skill

## Environment-Specific Configuration

### Development Environment

If working in development (`NODE_ENV=development` or local machine):
- Use local database connection
- Enable hot reload
- Skip SSL verification
- Use mock external services

### Staging Environment

If deploying to staging:
- Use staging database
- Enable verbose logging
- Test with production-like data
- Verify integrations

### Production Environment

If deploying to production:
- Require manual approval
- Enable all security features
- Create backup before deployment
- Notify on-call team
- Monitor for 30 minutes post-deploy
```

### Project Type Detection

```markdown
## Framework-Specific Instructions

### React Projects

If `package.json` contains `react`:
1. Use functional components
2. Apply hooks patterns
3. Follow React 18+ conventions

### Vue Projects

If `package.json` contains `vue`:
1. Use Composition API
2. Apply Vue 3 patterns
3. Use TypeScript with Vue

### Angular Projects

If `angular.json` exists:
1. Use standalone components
2. Apply signal patterns
3. Follow Angular 17+ conventions
```

### Feature Flag Detection

```markdown
## Feature-Aware Instructions

### If Feature Flags Enabled

Check for feature flag system in project:

If using LaunchDarkly (`launchdarkly-node-server-sdk`):
```typescript
import { LDClient } from 'launchdarkly-node-server-sdk';

const isEnabled = await ldClient.variation('feature-key', user, false);
```

If using Unleash (`unleash-client`):
```typescript
import { isEnabled } from 'unleash-client';

if (isEnabled('feature-key')) {
  // Feature code
}
```
```

## Dynamic Content

### Template Variables

````markdown
---
name: scaffold
variables:
  project_name: $&#123;PROJECT_NAME&#125;
  author: $&#123;GIT_USER_NAME&#125;
  year: $&#123;CURRENT_YEAR&#125;
---

# Project Scaffold

Create new project structure for **$&#123;project_name&#125;**:

```
$&#123;project_name&#125;/
├── src/
├── tests/
├── package.json
└── README.md
```

Author: $&#123;author&#125;
Year: $&#123;year&#125;
````

### File Content Injection

```markdown
## Configuration Templates

### Package.json Template

Use this base configuration:

```json file="./templates/package.json"
{
  "name": "$&#123;project_name&#125;",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  }
}
```

### TypeScript Config

```json file="./templates/tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true
  }
}
```
```

### Runtime Context

```markdown
## Dynamic Analysis

### Current Project State

Before proceeding, analyze:
1. Current git branch: `git branch --show-current`
2. Uncommitted changes: `git status --porcelain`
3. Recent commits: `git log -5 --oneline`
4. Active dependencies: Check `package-lock.json` or `yarn.lock`

### Adaptive Instructions

Based on analysis:
- If on `main`/`master`: Require branch creation
- If changes present: Require commit or stash
- If outdated: Require pull from remote
```

## Skill Testing

### Test Case Format

```markdown title=".claude/skills/api-design/tests/test-cases.md"
# API Design Skill Tests

## Test 1: Basic CRUD Endpoint

**Input:**
```
Create a REST API endpoint for managing users
```

**Expected Behavior:**
- Creates route file in `src/routes/users.ts`
- Includes GET, POST, PUT, DELETE handlers
- Adds validation middleware
- Creates corresponding tests

**Verification:**
- [ ] Route file exists
- [ ] All CRUD operations present
- [ ] TypeScript types defined
- [ ] Tests written

---

## Test 2: Authenticated Endpoint

**Input:**
```
Create an admin-only endpoint for system settings
```

**Expected Behavior:**
- Adds auth middleware
- Includes role check for admin
- Returns 401/403 appropriately

**Verification:**
- [ ] Auth middleware applied
- [ ] Role validation present
- [ ] Error responses correct
```

### Automated Validation

```yaml title=".claude/skills/api-design/config.yaml"
validation:
  pre_checks:
    - command: "npm run lint"
      expect: exit_code_0
    - command: "npm run typecheck"
      expect: exit_code_0

  post_checks:
    - command: "npm test -- --coverage"
      expect: coverage_above_80
    - file_exists:
        - "src/routes/*.ts"
        - "tests/routes/*.test.ts"
```

### Regression Testing

```markdown
## Regression Test Suite

### Test: No Breaking Changes

After skill execution, verify:

1. **Existing tests pass**
   ```bash
   npm test
   ```

2. **Types compile**
   ```bash
   npm run typecheck
   ```

3. **No new linting errors**
   ```bash
   npm run lint
   ```

4. **Build succeeds**
   ```bash
   npm run build
   ```

### Test: Backward Compatibility

Ensure skill doesn't break:
- Existing API contracts
- Database schemas
- Configuration formats
```

## Skill Versioning

### Semantic Versioning

```yaml
---
name: migration
version: 2.1.0
min_claude_version: 1.0.0
changelog:
  2.1.0: Added rollback support
  2.0.0: Breaking - new migration format
  1.2.0: Added dry-run mode
  1.1.0: Support for multiple databases
  1.0.0: Initial release
---
```

### Version Constraints

```yaml
---
name: advanced-deploy
requires:
  - name: base-deploy
    version: ">=2.0.0"
  - name: monitoring
    version: "^1.5.0"
  - name: security
    version: "~1.2.0"
---
```

### Migration Between Versions

```markdown
## Version Migration Guide

### Upgrading from v1.x to v2.x

**Breaking Changes:**
1. Configuration format changed from JSON to YAML
2. Command renamed: `deploy` -> `release`
3. New required field: `environment`

**Migration Steps:**

1. Update configuration:
   ```bash
   # Old (v1.x)
   mv .deploy.json .deploy.yaml

   # Convert format
   ```

2. Update skill reference:
   ```yaml
   # Old
   requires:
     - deploy

   # New
   requires:
     - name: release
       version: ">=2.0.0"
   ```

3. Add required fields:
   ```yaml
   environment: production  # Now required
   ```
```

## Skill Distribution

### Package Structure

```
my-awesome-skill/
├── SKILL.md
├── README.md              # Installation instructions
├── LICENSE
├── package.json           # For npm distribution
├── install.sh             # Installation script
└── skills/
    ├── main/
    │   └── SKILL.md
    └── advanced/
        └── SKILL.md
```

### NPM Distribution

```json title="package.json"
{
  "name": "@myorg/claude-skill-deployment",
  "version": "1.0.0",
  "description": "Production deployment skill for Claude Code",
  "keywords": ["claude", "skill", "deployment"],
  "files": ["skills/**/*"],
  "scripts": {
    "postinstall": "cp -r skills/* $HOME/.claude/skills/"
  }
}
```

### GitHub Distribution

```markdown title="README.md"
# Deployment Skill for Claude Code

## Installation

### Quick Install

```bash
curl -sSL https://raw.githubusercontent.com/myorg/deploy-skill/main/install.sh | bash
```

### Manual Install

```bash
git clone https://github.com/myorg/deploy-skill.git
cp -r deploy-skill/skills/* ~/.claude/skills/
```

### Verify Installation

```bash
ls ~/.claude/skills/deploy/
```
```

### Installation Script

```bash title="install.sh"
#!/bin/bash

SKILL_NAME="deployment"
SKILL_DIR="${HOME}/.claude/skills/${SKILL_NAME}"

# Create directory
mkdir -p "${SKILL_DIR}"

# Download skill files
curl -sSL "https://raw.githubusercontent.com/myorg/deploy-skill/main/SKILL.md" \
  -o "${SKILL_DIR}/SKILL.md"

curl -sSL "https://raw.githubusercontent.com/myorg/deploy-skill/main/templates/Dockerfile" \
  -o "${SKILL_DIR}/templates/Dockerfile"

echo "Skill '${SKILL_NAME}' installed successfully!"
echo "Location: ${SKILL_DIR}"
```

### Skill Registry

Register skills for discovery:

```yaml title="skill-registry.yaml"
name: deployment-pro
version: 2.0.0
description: Enterprise deployment workflows
author: DevOps Team
repository: https://github.com/myorg/deploy-skill
tags:
  - deployment
  - devops
  - kubernetes
  - docker
compatibility:
  claude_code: ">=1.0.0"
  platforms:
    - linux
    - macos
    - windows
```

## Best Practices

### Architecture Guidelines

1. **Single Responsibility** - Each skill does one thing well
2. **Loose Coupling** - Minimize dependencies between skills
3. **Clear Interfaces** - Document inputs and outputs
4. **Fail Gracefully** - Handle errors informatively

### Performance Tips

1. **Minimize size** - Keep skills under 2000 tokens
2. **Lazy loading** - Use includes for optional content
3. **Cache templates** - Reuse common patterns
4. **Avoid duplication** - Share common skills

### Security Considerations

1. **No secrets in skills** - Use environment variables
2. **Validate inputs** - Check parameters before use
3. **Audit dependencies** - Review required skills
4. **Version lock** - Pin dependency versions

## Next Steps

- [Skill Library](/skills/library) - Ready-to-use skills
- [Creating Skills](/skills/creating-skills) - Basic skill creation
- [Custom Commands](/skills/custom-commands) - Quick shortcuts
