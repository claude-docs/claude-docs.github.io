---
sidebar_position: 3
title: Contributing
description: How to contribute to Claude Code documentation
---

# Contributing

Help improve Claude Code documentation and the ecosystem.

## Contributing to This Site

### Quick Edits

Every page has an "Edit this page" link. Click it to:

1. Fork the repository
2. Make your changes
3. Submit a pull request

### Local Development

```bash
# Clone the repository
git clone https://github.com/claude-docs/claude-docs.github.io.git
cd claude-docs.github.io

# Install dependencies
npm install

# Start development server
npm start
```

The site will be available at `http://localhost:3000`.

### Adding Documentation

#### New Page

1. Create a markdown file in the appropriate folder:
   ```
   docs/
   ├── getting-started/
   ├── cli/
   ├── mcp/
   └── your-section/
       └── new-page.md
   ```

2. Add frontmatter:
   ```markdown
   ---
   sidebar_position: 1
   title: Page Title
   description: Brief description for SEO
   ---

   # Page Title

   Content here...
   ```

3. Update `sidebars.ts` if needed.

#### Page Structure

```markdown
---
sidebar_position: 1
title: Feature Name
description: What this page covers
---

# Feature Name

Brief introduction to the topic.

## Overview

What it is and why it matters.

## Getting Started

Quick start instructions.

## Configuration

How to configure the feature.

## Examples

Practical examples.

## Best Practices

Tips for effective use.

## Next Steps

- [Related Page](/path)
- [Another Page](/path)
```

### Style Guide

#### Writing

- Use clear, concise language
- Write in second person ("you")
- Keep paragraphs short
- Use active voice

#### Code Examples

- Include language identifiers
- Add file paths when relevant
- Keep examples focused

```typescript title="src/example.ts"
const example = "code";
```

#### Admonitions

```markdown
:::tip
Helpful tip here
:::

:::warning
Important warning
:::

:::info
Additional information
:::
```

## Contributing to Claude Code

### Reporting Issues

1. Search existing issues
2. Use the issue template
3. Include reproduction steps
4. Add system information (`claude doctor`)

[GitHub Issues](https://github.com/anthropics/claude-code/issues)

### Feature Requests

1. Check existing requests
2. Describe the use case
3. Explain expected behavior
4. Consider alternatives

### Code Contributions

Claude Code is open source. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Contributing Skills

### Share Your Skills

1. Create your skill in `.claude/skills/`
2. Test thoroughly
3. Document usage
4. Submit to [awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)

### Skill Template

```markdown
---
name: skill-name
description: What it does
version: 1.0.0
author: your-name
---

# Skill Name

Description of the skill.

## Usage

How to use it.

## Examples

Example invocations.
```

## Contributing MCP Servers

### Building a Server

1. Choose an SDK (TypeScript, Python, etc.)
2. Implement the MCP protocol
3. Test with Claude Code
4. Document usage

### Publishing

1. Publish to npm/PyPI
2. Add to [MCP Registry](https://github.com/modelcontextprotocol/registry)
3. Submit PR with documentation

## Community Guidelines

### Be Respectful

- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community

### Be Constructive

- Provide actionable feedback
- Share knowledge freely
- Help others learn

### Be Collaborative

- Work together on solutions
- Credit others' contributions
- Celebrate successes

## Getting Help

### Questions

- [GitHub Discussions](https://github.com/anthropics/claude-code/discussions)
- [Discord](https://discord.gg/anthropic)

### Bugs

- [GitHub Issues](https://github.com/anthropics/claude-code/issues)

## Recognition

Contributors are recognized in:
- Repository contributors list
- Release notes for significant contributions
- Community spotlights

## Next Steps

- [Community Tools](/community/tools)
- [Resources](/community/resources)
- [Getting Started](/getting-started/introduction)
