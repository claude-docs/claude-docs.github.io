---
sidebar_position: 4
title: Use Cases
description: Real-world examples of Claude Agent SDK usage
---

# Use Cases

Practical examples of how to use the Claude Agent SDK in real-world scenarios.

## Code Review Automation

### Pull Request Reviewer

```python
from claude_agent_sdk import Agent
import subprocess

def review_pull_request(pr_number: int) -> dict:
    # Get PR diff
    diff = subprocess.run(
        ["gh", "pr", "diff", str(pr_number)],
        capture_output=True, text=True
    ).stdout

    agent = Agent(model="claude-opus-4-5-20251101")

    result = agent.run(
        prompt=f"""Review this pull request thoroughly:

{diff}

Provide a structured review with:
1. **Summary**: Brief overview of changes
2. **Security**: Any security concerns
3. **Performance**: Potential performance issues
4. **Code Quality**: Maintainability and best practices
5. **Suggestions**: Specific improvements

Rate the PR: APPROVE, REQUEST_CHANGES, or COMMENT""",
        output_format="json"
    )

    return json.loads(result.output)
```

### Continuous Review in CI

```yaml
# .github/workflows/review.yml
name: AI Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Review PR
        run: |
          pip install claude-agent-sdk
          python scripts/review_pr.py ${{ github.event.pull_request.number }}
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## Test Generation

### Unit Test Generator

```typescript
import { Agent } from "@anthropic-ai/claude-agent-sdk";
import * as fs from "fs";
import * as path from "path";

async function generateTests(sourceFile: string): Promise<void> {
  const agent = new Agent();

  const result = await agent.run({
    prompt: `Generate comprehensive unit tests for ${sourceFile}.

Requirements:
- Use Jest as the testing framework
- Cover edge cases and error conditions
- Include setup/teardown if needed
- Add descriptive test names
- Mock external dependencies`,
    tools: ["read", "write"],
    workingDirectory: "./tests"
  });

  console.log(`Generated tests in: ${result.filesModified}`);
}
```

### Test Coverage Improvement

```python
def improve_coverage(threshold: float = 80.0):
    """Generate tests until coverage threshold is met."""
    agent = Agent()

    while True:
        # Run coverage
        coverage = run_coverage_report()

        if coverage >= threshold:
            print(f"Coverage {coverage}% meets threshold")
            break

        # Find uncovered code
        uncovered = find_uncovered_files()

        for file in uncovered[:3]:  # Batch of 3
            agent.run(
                prompt=f"Add tests to improve coverage for {file}",
                tools=["read", "write", "bash"]
            )
```

## Documentation Generation

### API Documentation

```python
def generate_api_docs(routes_dir: str) -> str:
    agent = Agent()

    result = agent.run(
        prompt=f"""Generate comprehensive API documentation for the routes in {routes_dir}.

Include for each endpoint:
- HTTP method and path
- Request parameters and body
- Response format with examples
- Error codes
- Authentication requirements

Output in OpenAPI 3.0 format.""",
        tools=["read", "grep"],
        output_format="yaml"
    )

    with open("openapi.yaml", "w") as f:
        f.write(result.output)

    return "openapi.yaml"
```

### README Generator

```typescript
async function generateReadme(projectDir: string): Promise<void> {
  const agent = new Agent();

  await agent.run({
    prompt: `Analyze this project and generate a comprehensive README.md:

Include:
- Project title and description
- Features list
- Installation instructions
- Usage examples
- Configuration options
- Contributing guidelines
- License information`,
    tools: ["read", "write"],
    workingDirectory: projectDir
  });
}
```

## Code Migration

### Framework Migration

```python
def migrate_to_typescript(source_dir: str):
    agent = Agent(timeout=600)  # 10 minutes

    result = agent.run(
        prompt=f"""Migrate JavaScript files in {source_dir} to TypeScript:

1. Rename .js files to .ts
2. Add type annotations
3. Create interfaces for data structures
4. Update imports
5. Fix any type errors

Maintain existing functionality.""",
        tools=["read", "write", "bash", "grep"]
    )

    print(f"Migrated {len(result.files_modified)} files")
```

### Database Migration

```python
def generate_migration(description: str):
    agent = Agent()

    result = agent.run(
        prompt=f"""Create a database migration for: {description}

Requirements:
- Use the existing migration format
- Include up and down migrations
- Add appropriate indexes
- Consider data integrity""",
        tools=["read", "write"],
        working_directory="./migrations"
    )

    return result.files_modified[0]
```

## Bug Fixing

### Automated Bug Fix

```python
def fix_bug(issue_description: str, error_log: str = None):
    agent = Agent()

    prompt = f"Fix this bug: {issue_description}"
    if error_log:
        prompt += f"\n\nError log:\n{error_log}"

    result = agent.run(
        prompt=prompt,
        tools=["read", "write", "grep", "bash"]
    )

    # Run tests to verify fix
    test_result = subprocess.run(
        ["npm", "test"],
        capture_output=True
    )

    return {
        "files_modified": result.files_modified,
        "tests_pass": test_result.returncode == 0
    }
```

## Refactoring

### Extract Component

```typescript
async function extractComponent(
  sourceFile: string,
  componentName: string
): Promise<void> {
  const agent = new Agent();

  await agent.run({
    prompt: `Extract the ${componentName} logic from ${sourceFile} into a separate component.

Requirements:
- Create a new file for the component
- Move related styles
- Update imports in the original file
- Maintain existing props interface
- Add appropriate TypeScript types`,
    tools: ["read", "write"]
  });
}
```

### Performance Optimization

```python
def optimize_performance(file_path: str):
    agent = Agent(model="claude-opus-4-5-20251101")

    result = agent.run(
        prompt=f"""Analyze and optimize {file_path} for performance:

Consider:
- Algorithm efficiency
- Memory usage
- Unnecessary re-renders (if React)
- Database query optimization
- Caching opportunities

Explain each optimization made.""",
        tools=["read", "write"]
    )

    return result.output
```

## Security Scanning

### Vulnerability Check

```python
def security_scan(directory: str) -> list:
    agent = Agent()

    result = agent.run(
        prompt=f"""Perform a security audit of {directory}:

Check for:
- SQL injection vulnerabilities
- XSS vulnerabilities
- Hardcoded secrets
- Insecure dependencies
- Authentication issues
- Authorization bypasses

Output as JSON with severity levels.""",
        tools=["read", "grep"],
        output_format="json"
    )

    return json.loads(result.output)
```

## Best Practices

1. **Set appropriate timeouts** for complex tasks
2. **Limit tool access** to what's needed
3. **Use sandboxing** for untrusted inputs
4. **Validate outputs** before applying changes
5. **Log all agent actions** for debugging
6. **Run tests** after automated changes
7. **Review changes** before committing

## Next Steps

- [Python SDK Reference](/sdk/python)
- [TypeScript SDK Reference](/sdk/typescript)
- [CI/CD Integration](/guides/ci-cd)
