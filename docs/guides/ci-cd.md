---
sidebar_position: 5
title: CI/CD Integration
description: Integrate Claude Code with CI/CD pipelines
---

# CI/CD Integration

Integrate Claude Code into your continuous integration and deployment pipelines.

## GitHub Actions

### Code Review on PR

```yaml title=".github/workflows/review.yml"
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Review PR
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          gh pr diff ${{ github.event.pull_request.number }} > diff.txt
          claude -p "Review this PR diff for issues: $(cat diff.txt)" --json > review.json

      - name: Post Review
        uses: actions/github-script@v7
        with:
          script: |
            const review = require('./review.json');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: review.output
            });
```

### Test Generation

```yaml title=".github/workflows/tests.yml"
name: Generate Missing Tests

on:
  workflow_dispatch:
    inputs:
      file:
        description: 'File to generate tests for'
        required: true

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Generate Tests
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Generate unit tests for ${{ github.event.inputs.file }}"

      - name: Create PR
        uses: peter-evans/create-pull-request@v5
        with:
          title: "Add tests for ${{ github.event.inputs.file }}"
          commit-message: "test: add tests for ${{ github.event.inputs.file }}"
```

### Documentation Generation

```yaml title=".github/workflows/docs.yml"
name: Update Docs

on:
  push:
    branches: [main]
    paths: ['src/**']

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Generate Docs
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Update API documentation in docs/ based on changes in src/"

      - name: Commit Docs
        run: |
          git config user.name 'github-actions[bot]'
          git config user.email 'github-actions[bot]@users.noreply.github.com'
          git add docs/
          git commit -m "docs: auto-update documentation" || exit 0
          git push
```

## GitLab CI

### Code Review

```yaml title=".gitlab-ci.yml"
review:
  stage: review
  image: node:20
  script:
    - npm install -g @anthropic-ai/claude-code
    - claude -p "Review changes in this MR" --json > review.json
    - cat review.json
  only:
    - merge_requests
  variables:
    ANTHROPIC_API_KEY: $ANTHROPIC_API_KEY
```

## Azure DevOps

```yaml title="azure-pipelines.yml"
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '20.x'

  - script: npm install -g @anthropic-ai/claude-code
    displayName: 'Install Claude Code'

  - script: claude -p "Review the codebase for issues" --json
    displayName: 'Code Review'
    env:
      ANTHROPIC_API_KEY: $(ANTHROPIC_API_KEY)
```

## Jenkins

```groovy title="Jenkinsfile"
pipeline {
    agent any

    environment {
        ANTHROPIC_API_KEY = credentials('anthropic-api-key')
    }

    stages {
        stage('Review') {
            steps {
                sh 'npm install -g @anthropic-ai/claude-code'
                sh 'claude -p "Review recent changes" --json'
            }
        }
    }
}
```

## Headless Mode

For CI/CD, use headless mode:

```bash
# Single query
claude -p "your prompt" --json

# With model selection
claude -p "your prompt" --model haiku --json

# Streaming output
claude -p "your prompt" --output-format stream-json
```

## Security

### API Key Management

Never commit API keys. Use secrets:

- GitHub: Repository Secrets
- GitLab: CI/CD Variables
- Azure: Pipeline Variables
- Jenkins: Credentials

### Permission Scoping

Limit what Claude can do in CI:

```bash
claude -p "review only" --allowedTools "Read" "Grep"
```

## Best Practices

### Cost Control

- Use Haiku for simple tasks
- Limit context size
- Cache where possible

### Error Handling

```yaml
- name: Review
  continue-on-error: true
  run: claude -p "review"

- name: Handle Failure
  if: failure()
  run: echo "Review failed, continuing..."
```

### Timeouts

```yaml
- name: Review
  timeout-minutes: 10
  run: claude -p "review" --timeout 540000
```

## Use Cases

| Use Case | Trigger | Model |
|----------|---------|-------|
| PR Review | pull_request | Sonnet |
| Test Generation | manual | Sonnet |
| Doc Updates | push to main | Haiku |
| Security Scan | scheduled | Opus |
| Changelog | release | Haiku |

## Next Steps

- [Agent SDK](/sdk/overview)
- [Best Practices](/guides/best-practices)
- [CLI Reference](/cli/commands)
