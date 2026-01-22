---
sidebar_position: 2
title: Creating Skills
description: How to create custom Claude Code skills
---

# Creating Skills

Learn how to create effective skills for Claude Code.

## Basic Structure

### Directory Layout

```
.claude/
└── skills/
    └── my-skill/
        ├── SKILL.md      # Main skill definition
        └── examples/     # Optional examples
            └── sample.ts
```

### Minimal Skill

```markdown title=".claude/skills/format/SKILL.md"
---
name: format
description: Format code consistently
---

# Format Skill

When formatting code:
1. Use project's Prettier config
2. Sort imports alphabetically
3. Remove unused imports
```

## Skill Components

### Frontmatter

```yaml
---
name: skill-id              # Unique identifier (required)
description: Brief text     # One-line description (required)
version: 1.0.0             # Semantic version
author: your-name          # Creator
triggers:                   # Keywords for auto-discovery
  - trigger1
  - trigger2
tags:                       # Categorization
  - testing
  - automation
requires:                   # Skill dependencies
  - base-skill
tools:                      # Allowed tools
  - read
  - write
  - bash
---
```

### Instructions

Write clear, structured instructions:

```markdown
# Skill Name

Brief overview of what this skill accomplishes.

## Prerequisites

- Required tools installed
- Configuration complete
- Permissions granted

## Steps

### Step 1: Analysis

First, analyze the current state...

### Step 2: Implementation

Then implement changes...

### Step 3: Verification

Finally, verify the results...

## Examples

### Example 1: Basic Usage

```bash
command example
```

### Example 2: Advanced Usage

```bash
advanced command
```

## Troubleshooting

Common issues and solutions...
```

## Advanced Features

### Conditional Logic

Include conditions in your instructions:

```markdown
## Environment-Specific Steps

If this is a development environment:
- Use mock data
- Skip production checks

If this is production:
- Require approval
- Enable logging
- Create backup
```

### References

Reference files and patterns:

```markdown
## Key Files

- `src/config.ts` - Configuration settings
- `src/api/` - API endpoints
- `tests/` - Test files

## Patterns

Use existing patterns from:
- `src/components/Button.tsx` - Component structure
- `src/hooks/useAuth.ts` - Hook pattern
```

### Checklists

Provide verification checklists:

```markdown
## Pre-Flight Checklist

- [ ] Tests pass locally
- [ ] No linting errors
- [ ] Changelog updated
- [ ] Documentation current
- [ ] PR description complete
```

## Example Skills

### Testing Skill

```markdown title=".claude/skills/test/SKILL.md"
---
name: test
description: Generate comprehensive tests
triggers:
  - test
  - spec
  - coverage
---

# Testing Skill

When generating tests:

## Framework Detection

1. Check for Jest (`jest.config.js`)
2. Check for Vitest (`vitest.config.ts`)
3. Check for Mocha (`mocha.opts`)

## Test Structure

```typescript
describe('Component/Function Name', () => {
  beforeEach(() => {
    // Setup
  });

  it('should handle normal case', () => {
    // Test
  });

  it('should handle edge case', () => {
    // Test
  });

  it('should handle error case', () => {
    // Test
  });
});
```

## Coverage Goals

- Happy path: 100%
- Edge cases: Common scenarios
- Error handling: All thrown errors
```

### API Skill

```markdown title=".claude/skills/api/SKILL.md"
---
name: api
description: Create REST API endpoints
triggers:
  - endpoint
  - route
  - api
---

# API Skill

When creating API endpoints:

## Route Structure

Follow existing pattern in `src/routes/`:

```typescript
router.get('/resource', auth, validate, handler);
router.post('/resource', auth, validate, handler);
router.put('/resource/:id', auth, validate, handler);
router.delete('/resource/:id', auth, validate, handler);
```

## Response Format

```typescript
// Success
res.json({
  success: true,
  data: result
});

// Error
res.status(400).json({
  success: false,
  error: 'Error message'
});
```

## Required Components

1. Route handler in `src/routes/`
2. Validation schema in `src/validators/`
3. Tests in `tests/routes/`
```

## Skill Validation

### Test Your Skill

1. Create the skill file
2. Start Claude Code
3. Trigger the skill with a relevant request
4. Verify Claude uses the instructions

### Common Issues

| Issue | Solution |
|-------|----------|
| Skill not discovered | Check triggers and description |
| Instructions ignored | Make instructions clearer |
| Partial execution | Break into smaller steps |

## Publishing Skills

### Share with Team

Commit skills to your repository:

```bash
git add .claude/skills/
git commit -m "Add deployment skill"
```

### Community

Share useful skills:
1. Create a GitHub repo
2. Document installation
3. Submit to awesome-claude-skills

## Next Steps

- [Custom Commands](/skills/custom-commands)
- [Configure settings](/cli/configuration)
- [Browse community skills](https://github.com/travisvn/awesome-claude-skills)
