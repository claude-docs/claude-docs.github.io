---
sidebar_position: 6
title: CLAUDE.md Mastery
description: Complete guide to creating and managing CLAUDE.md files for optimal Claude Code performance
---

# CLAUDE.md Mastery

CLAUDE.md is your project's instruction manual for Claude Code. It provides persistent context that survives across sessions, guiding Claude's understanding of your codebase, conventions, and workflows.

## File Hierarchy

Claude Code reads CLAUDE.md files from multiple locations, merged in order of specificity:

### Load Order (Lowest to Highest Priority)

```
1. Enterprise    ~/.claude/enterprise/CLAUDE.md    (Admin-managed)
2. User          ~/.claude/CLAUDE.md               (Personal defaults)
3. Project       ./CLAUDE.md                       (Repository root)
4. Nested        ./src/CLAUDE.md                   (Directory-specific)
```

Later files override earlier ones for conflicting instructions.

### Enterprise Level

Managed by organization admins for company-wide standards:

```markdown
# Enterprise Standards

## Security
- Never commit secrets or credentials
- All API keys must use environment variables
- PII must be encrypted at rest

## Compliance
- Include license headers in all source files
- Log all data access operations
- Follow GDPR data handling requirements

## Code Standards
- Maximum function length: 50 lines
- Required test coverage: 80%
- All public APIs must be documented
```

Location: `~/.claude/enterprise/CLAUDE.md`

### User Level

Your personal defaults across all projects:

```markdown
# Personal Preferences

## Style
- Use tabs for indentation
- Prefer functional programming patterns
- Write comprehensive commit messages

## Workflow
- Always run tests before committing
- Create feature branches for all changes
- Keep commits atomic and focused

## Tools
- Prefer npm over yarn
- Use prettier for formatting
- Lint with ESLint
```

Location: `~/.claude/CLAUDE.md`

### Project Level

Project-specific context committed with the repository:

```markdown
# Project: MyApp

## Overview
E-commerce platform built with Next.js and PostgreSQL.

## Architecture
- Frontend: Next.js 14 with App Router
- Backend: tRPC API routes
- Database: PostgreSQL with Prisma ORM
- Auth: NextAuth.js with JWT

## Commands
- `npm run dev` - Start development server
- `npm run test` - Run Jest tests
- `npm run db:migrate` - Run Prisma migrations
```

Location: `./CLAUDE.md` (repository root)

### Directory Level

Subdirectory-specific overrides:

```markdown
# src/components/CLAUDE.md

## Component Guidelines
- Use React Server Components by default
- Client components must have 'use client' directive
- Export types alongside components
- Include Storybook stories for all components
```

Location: `./src/components/CLAUDE.md`

## Structure and Organization

### Recommended Sections

```markdown
# Project Name

## Overview
Brief description of what this project does.

## Tech Stack
- Framework: Next.js 14
- Language: TypeScript
- Database: PostgreSQL
- Testing: Jest + React Testing Library

## Architecture
High-level architecture decisions and patterns.

## Directory Structure
Key directories and their purposes.

## Development Commands
Essential commands for development workflow.

## Code Conventions
Coding standards specific to this project.

## Testing Requirements
How tests should be written and organized.

## Common Patterns
Reusable patterns used throughout the codebase.

## Known Issues
Current limitations or technical debt to be aware of.
```

### Section Best Practices

**Keep It Scannable**
```markdown
## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run test` | Run all tests |
| `npm run build` | Production build |
```

**Use Bullet Points for Lists**
```markdown
## Tech Stack
- **Frontend**: React 18 with TypeScript
- **State**: Zustand for client state
- **API**: tRPC with React Query
- **Styling**: Tailwind CSS
```

**Code Examples for Patterns**
```markdown
## Component Pattern

Always use this structure for components:

\`\`\`typescript
interface Props {
  // Props here
}

export function ComponentName({ prop1, prop2 }: Props) {
  // Component logic
}
\`\`\`
```

## Dynamic Content with `#`

The `#` prefix adds content to CLAUDE.md dynamically during a session:

### Basic Usage

```
# We use PostgreSQL 15 with the uuid-ossp extension
```

This appends to the project CLAUDE.md:

```markdown
## User Notes
- We use PostgreSQL 15 with the uuid-ossp extension
```

### Advanced Usage

**Add Architectural Decisions**
```
# ADR: We chose tRPC over REST for type-safe API calls
```

**Record Debugging Context**
```
# Known issue: Redis connection fails if REDIS_URL lacks the protocol prefix
```

**Save Important Learnings**
```
# The auth middleware must run before the rate limiter
```

### When to Use `#`

| Scenario | Use `#` | Why |
|----------|---------|-----|
| Discovered a bug pattern | Yes | Future sessions need this |
| Temporary debugging info | No | Will clutter CLAUDE.md |
| Team conventions | Yes | Should persist |
| Session-specific context | No | Use regular prompts |
| Architecture decisions | Yes | Critical knowledge |

## Best Practices by Project Type

### For Solo Projects

```markdown
# Personal Project

## Context
Side project for learning Rust. Prioritize readability over performance.

## Goals
- Learn async Rust
- Build a working CLI tool
- Practice error handling

## Notes
- OK to be experimental
- Document learnings inline
```

### For Team Projects

```markdown
# Team Project

## Team Conventions
- All PRs require 2 reviews
- Squash merge to main
- Branch naming: feature/, bugfix/, hotfix/

## Communication
- Technical decisions in #architecture channel
- Bug reports include reproduction steps
- Update CHANGELOG.md for user-facing changes

## Access
- Staging: staging.example.com
- Production: app.example.com
- Docs: docs.example.com
```

### For Open Source Projects

```markdown
# Open Source Project

## Contributing
- Read CONTRIBUTING.md before PRs
- Sign CLA for first contribution
- Follow semantic versioning

## Compatibility
- Support Node.js 18+
- Support browsers: Chrome 90+, Firefox 88+, Safari 14+
- Maintain backward compatibility for 2 major versions

## Documentation
- Update README.md for API changes
- Include JSDoc for all public functions
- Add examples for new features
```

### For Client Projects

```markdown
# Client Project

## Client Requirements
- Accessibility: WCAG 2.1 AA compliance
- Browser support: IE11+ (progressive enhancement)
- Performance: LCP < 2.5s

## Deployment
- Staging deploys on PR merge
- Production deploys require client approval
- Hotfixes follow emergency protocol

## Sensitive Information
- Never log PII
- Use client's naming conventions in code
- Respect NDA: don't share code patterns externally
```

## Memory Management

### Keeping CLAUDE.md Lean

Aim for **under 500 lines** for optimal performance.

**What to Include**
- Tech stack and versions
- Critical architecture decisions
- Essential commands
- Non-obvious conventions
- Known gotchas

**What to Exclude**
- Standard language conventions
- Obvious patterns
- Temporary debugging notes
- Documentation that lives elsewhere

### Periodic Cleanup

Review CLAUDE.md monthly:

```markdown
## Cleanup Checklist
- [ ] Remove resolved issues
- [ ] Update outdated commands
- [ ] Consolidate duplicate sections
- [ ] Archive obsolete decisions
```

### Using Skills for Complex Context

Instead of bloating CLAUDE.md, create skills:

```
.claude/skills/
├── deployment.md      # Deployment procedures
├── database.md        # Database operations
└── testing.md         # Testing strategies
```

Then invoke with `/deployment` or `/testing` when needed.

## When to Update vs When to Use Skills

### Update CLAUDE.md When

- Information applies to every session
- Context is essential for understanding the codebase
- Team members need shared knowledge
- The information is relatively stable

### Use Skills When

- Procedures are complex and step-by-step
- Context is needed occasionally, not always
- Instructions would bloat CLAUDE.md
- Workflows can be invoked on-demand

### Decision Matrix

| Content Type | CLAUDE.md | Skill |
|-------------|-----------|-------|
| Tech stack | Yes | No |
| Deploy procedure | No | Yes |
| Code conventions | Yes | No |
| Release checklist | No | Yes |
| Architecture overview | Yes | No |
| Migration guide | No | Yes |
| Common commands | Yes | No |
| Incident response | No | Yes |

## Common Patterns

### Environment-Aware Context

```markdown
## Environments

### Development
- URL: http://localhost:3000
- Database: Local PostgreSQL
- Auth: Disabled for convenience

### Staging
- URL: https://staging.example.com
- Database: staging-db.example.com
- Auth: OAuth with test accounts

### Production
- URL: https://app.example.com
- Database: prod-db.example.com (read replica available)
- Auth: Full OAuth + MFA
```

### Conditional Instructions

```markdown
## Build Instructions

### For Mac
\`\`\`bash
brew install dependencies
./scripts/setup-mac.sh
\`\`\`

### For Linux
\`\`\`bash
apt-get install dependencies
./scripts/setup-linux.sh
\`\`\`

### For Windows (WSL)
\`\`\`bash
wsl --install
# Then follow Linux instructions
\`\`\`
```

### Migration Tracking

```markdown
## Recent Migrations

### v2.0 Migration (In Progress)
- [x] Update to React 18
- [x] Migrate to App Router
- [ ] Convert remaining class components
- [ ] Update test utilities

### Technical Debt
- Legacy API routes in /pages/api (migrate to app/api)
- jQuery dependency in admin panel (remove after redesign)
```

## Team Conventions

### Establishing Standards

```markdown
## Code Style

### Naming
- Components: PascalCase (UserProfile.tsx)
- Utilities: camelCase (formatDate.ts)
- Constants: SCREAMING_SNAKE_CASE
- Types: PascalCase with T prefix (TUser)

### File Organization
- One component per file
- Co-locate tests with source
- Group by feature, not type

### Commit Messages
- Use conventional commits: feat:, fix:, docs:, etc.
- Reference issue numbers: feat: add login (#123)
- Keep subject under 72 characters
```

### PR Guidelines

```markdown
## Pull Request Guidelines

### Before Opening
- [ ] All tests pass locally
- [ ] Code is formatted
- [ ] No console.log statements
- [ ] CHANGELOG updated if user-facing

### PR Description
- Summary of changes
- Related issue links
- Screenshots for UI changes
- Testing instructions

### Review Checklist
- [ ] Code is readable
- [ ] Edge cases handled
- [ ] No security issues
- [ ] Performance considered
```

## Troubleshooting

### CLAUDE.md Not Loading

1. Check file location is correct
2. Verify file permissions
3. Look for syntax errors
4. Check for encoding issues (use UTF-8)

### Context Conflicts

When user and project CLAUDE.md conflict:

```markdown
# In project CLAUDE.md, be explicit:
## Overrides
These settings override user defaults for this project:
- Use spaces (not tabs) for this codebase
- Use yarn (not npm) for this project
```

### Performance Issues

If CLAUDE.md is slowing down responses:

1. Check file size with `wc -l CLAUDE.md`
2. Remove unnecessary sections
3. Move complex procedures to skills
4. Split into directory-specific files

## Advanced Techniques

### Layered Configuration

```
./CLAUDE.md                    # Core project info
./src/CLAUDE.md               # Source conventions
./src/components/CLAUDE.md    # Component patterns
./tests/CLAUDE.md             # Testing standards
```

### Dynamic Sections

Use the `#` command to build up context:

```
# Session note: Working on the payment integration
# Session note: Stripe webhook endpoint is /api/webhooks/stripe
# Session note: Test card: 4242424242424242
```

### Integration with CI/CD

```markdown
## CI/CD Integration

Claude Code can help with CI/CD when you:

1. Document pipeline structure:
   - .github/workflows/ci.yml - Main CI pipeline
   - .github/workflows/deploy.yml - Deployment

2. Include environment variables:
   - CI=true for test environment
   - NODE_ENV=production for builds

3. Note required secrets:
   - DEPLOY_TOKEN for deployments
   - NPM_TOKEN for publishing
```

## Next Steps

- [Project Templates](/guides/project-templates) - Ready-to-use CLAUDE.md templates
- [Skills & Commands](/skills/overview) - Create reusable workflows
- [Best Practices](/guides/best-practices) - General Claude Code tips
- [Context Management](/guides/context-management) - Optimize context usage
