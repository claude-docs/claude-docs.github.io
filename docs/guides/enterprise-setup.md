---
sidebar_position: 12
title: Enterprise Setup
description: Enterprise deployment guide for Claude Code
---

# Enterprise Setup

Deploy Claude Code at scale with centralized management, compliance controls, and enterprise integrations.

## Enterprise CLAUDE.md Configuration

### Organization-Wide CLAUDE.md

Create a standardized CLAUDE.md template for all projects:

```markdown title="~/.claude/CLAUDE.md (Organization Template)"
# Enterprise Claude Code Configuration

## Organization Standards

### Security Requirements
- Never read or write .env files or secrets
- Never execute network commands (curl, wget, ssh)
- Always use approved MCP servers only
- Log all tool usage for audit compliance

### Code Standards
- Follow company style guide (see: wiki.company.com/style)
- Use TypeScript for all new projects
- Require unit tests for all new code
- Use conventional commit messages

### Approved Dependencies
- Check approved list before adding: wiki.company.com/deps
- Security-scanned packages only
- No deprecated packages

### Compliance
- HIPAA/SOC2/GDPR requirements apply
- No PII in code or comments
- No hardcoded credentials

## Development Workflow

### Branch Strategy
- main: protected, requires PR review
- develop: integration branch
- feature/*: feature development
- hotfix/*: urgent fixes

### Required Checks
- npm test (all tests must pass)
- npm run lint (no errors)
- npm run type-check (no type errors)
- Security scan (no high/critical)

## Commands Reference
- `npm run dev` - Development server
- `npm test` - Run test suite
- `npm run build` - Production build
- `npm run lint` - Lint check
- `npm run lint:fix` - Auto-fix lint issues
```

### Project-Level CLAUDE.md Extension

```markdown title="./CLAUDE.md (Project-Specific)"
# Project: Customer Portal

## Extends
@include ~/.claude/CLAUDE.md

## Project-Specific Guidelines

### Architecture
- React 18 frontend (./src/client)
- Express API (./src/server)
- PostgreSQL database

### Environment
- Node 20.x required
- PostgreSQL 15+ required
- Redis for sessions

### Sensitive Areas
- ./src/server/auth/* - Authentication logic (review carefully)
- ./src/server/payments/* - Payment processing (requires approval)
- ./migrations/* - Database migrations (test thoroughly)

### API Contracts
- OpenAPI spec: ./docs/api.yaml
- Breaking changes require version bump

### Testing Requirements
- Minimum 80% coverage for new code
- Integration tests for all API endpoints
- E2E tests for critical user flows
```

## Centralized Permission Policies

### Enterprise Permission Configuration

```json title="/etc/claude/enterprise-settings.json"
{
  "enterprise": {
    "id": "company-name",
    "policyVersion": "2024.1",
    "enforced": true
  },
  "permissions": {
    "allow": [
      "Read(./src/**)",
      "Read(./tests/**)",
      "Read(./docs/**)",
      "Write(./src/**)",
      "Write(./tests/**)",
      "Bash(npm test)",
      "Bash(npm run *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git add *)",
      "Bash(git commit *)"
    ],
    "deny": [
      "Read(./.env*)",
      "Read(**/*secret*)",
      "Read(**/*credential*)",
      "Read(**/*.pem)",
      "Read(**/*.key)",
      "Read(**/.aws/**)",
      "Read(**/.ssh/**)",
      "Write(./.env*)",
      "Write(**/*secret*)",
      "Write(**/*.key)",
      "Bash(curl *)",
      "Bash(wget *)",
      "Bash(ssh *)",
      "Bash(scp *)",
      "Bash(nc *)",
      "Bash(sudo *)",
      "Bash(rm -rf *)",
      "Bash(npm publish)",
      "Bash(git push --force *)",
      "WebFetch"
    ],
    "enforced": true,
    "override": false
  },
  "sandbox": {
    "enabled": true,
    "required": true,
    "networkAccess": false
  }
}
```

### Policy Distribution

```bash title="scripts/deploy-policy.sh"
#!/bin/bash

POLICY_URL="https://config.company.com/claude/enterprise-settings.json"
POLICY_DIR="/etc/claude"
USER_DIR="${HOME}/.claude"

# Download enterprise policy
sudo mkdir -p "$POLICY_DIR"
sudo curl -s "$POLICY_URL" -o "$POLICY_DIR/enterprise-settings.json"
sudo chmod 644 "$POLICY_DIR/enterprise-settings.json"

# Create symlink in user directory
mkdir -p "$USER_DIR"
ln -sf "$POLICY_DIR/enterprise-settings.json" "$USER_DIR/enterprise-settings.json"

echo "Enterprise policy deployed successfully"
```

### Policy Enforcement via Hooks

```json title=".claude/settings.json"
{
  "hooks": {
    "PreToolUse": [
      {
        "command": "scripts/enforce-policy.sh \"$TOOL_NAME\" \"$TOOL_INPUT\""
      }
    ]
  }
}
```

```bash title="scripts/enforce-policy.sh"
#!/bin/bash

TOOL=$1
INPUT=$2
POLICY_FILE="/etc/claude/enterprise-settings.json"

# Check if enterprise policy exists
if [ ! -f "$POLICY_FILE" ]; then
  echo "WARNING: Enterprise policy not found"
  exit 0
fi

# Extract denied patterns
DENIED=$(jq -r '.permissions.deny[]' "$POLICY_FILE")

# Check if tool matches any denied pattern
for pattern in $DENIED; do
  if [[ "$TOOL($INPUT)" == $pattern ]]; then
    echo "BLOCKED: Enterprise policy denies $TOOL on $INPUT"
    exit 1
  fi
done

exit 0
```

## SSO Integration

### SAML Configuration

```json title="enterprise-auth.json"
{
  "authentication": {
    "type": "saml",
    "provider": "okta",
    "config": {
      "entryPoint": "https://company.okta.com/app/sso/saml",
      "issuer": "claude-code-enterprise",
      "cert": "${SAML_CERTIFICATE}",
      "callbackUrl": "https://claude.company.com/auth/callback"
    },
    "attributeMapping": {
      "email": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
      "groups": "http://schemas.xmlsoap.org/claims/Group",
      "name": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
    }
  }
}
```

### OIDC Configuration

```json title="enterprise-auth.json"
{
  "authentication": {
    "type": "oidc",
    "provider": "azure-ad",
    "config": {
      "clientId": "${AZURE_CLIENT_ID}",
      "clientSecret": "${AZURE_CLIENT_SECRET}",
      "tenantId": "${AZURE_TENANT_ID}",
      "redirectUri": "https://claude.company.com/auth/callback",
      "scope": ["openid", "profile", "email", "groups"]
    }
  }
}
```

### SSO-Based Permission Mapping

```json title="role-mappings.json"
{
  "roleMappings": {
    "engineering-admins": {
      "permissions": {
        "allow": ["Read(**)", "Write(**)", "Bash(*)"],
        "deny": ["Read(./.env*)"]
      },
      "models": ["claude-opus-4-5-20251101", "claude-sonnet-4-5-20250929"],
      "quotas": {
        "daily": 1000000,
        "monthly": 20000000
      }
    },
    "developers": {
      "permissions": {
        "allow": ["Read(./src/**)", "Write(./src/**)", "Bash(npm *)"],
        "deny": ["Read(./.env*)", "Bash(npm publish)"]
      },
      "models": ["claude-sonnet-4-5-20250929", "claude-haiku-3-5-20241022"],
      "quotas": {
        "daily": 500000,
        "monthly": 10000000
      }
    },
    "contractors": {
      "permissions": {
        "allow": ["Read(./src/**)", "Read(./docs/**)"],
        "deny": ["Write", "Bash"]
      },
      "models": ["claude-haiku-3-5-20241022"],
      "quotas": {
        "daily": 100000,
        "monthly": 2000000
      }
    }
  }
}
```

### Enterprise Identity Provider Setup

```bash
# Configure with Okta
claude enterprise auth configure \
  --provider okta \
  --domain company.okta.com \
  --client-id $OKTA_CLIENT_ID

# Configure with Azure AD
claude enterprise auth configure \
  --provider azure-ad \
  --tenant-id $AZURE_TENANT_ID \
  --client-id $AZURE_CLIENT_ID

# Configure with Google Workspace
claude enterprise auth configure \
  --provider google \
  --domain company.com \
  --client-id $GOOGLE_CLIENT_ID
```

## API Key Management

### Centralized Key Management

```json title="api-key-policy.json"
{
  "apiKeys": {
    "rotation": {
      "enabled": true,
      "interval": "30d",
      "notifyBefore": "7d"
    },
    "restrictions": {
      "ipAllowlist": [
        "10.0.0.0/8",
        "192.168.0.0/16",
        "office-vpn.company.com"
      ],
      "allowedModels": [
        "claude-opus-4-5-20251101",
        "claude-sonnet-4-5-20250929",
        "claude-haiku-3-5-20241022"
      ],
      "maxTokensPerRequest": 100000,
      "rateLimit": {
        "requests": 1000,
        "period": "1m"
      }
    },
    "audit": {
      "logAllRequests": true,
      "retentionDays": 90
    }
  }
}
```

### Key Distribution via Secret Manager

#### AWS Secrets Manager

```bash title="scripts/get-api-key.sh"
#!/bin/bash

# Fetch API key from AWS Secrets Manager
export ANTHROPIC_API_KEY=$(aws secretsmanager get-secret-value \
  --secret-id "claude-code/api-key" \
  --query SecretString \
  --output text)
```

#### HashiCorp Vault

```bash title="scripts/get-api-key-vault.sh"
#!/bin/bash

# Fetch API key from Vault
export ANTHROPIC_API_KEY=$(vault kv get \
  -field=api_key \
  secret/claude-code/anthropic)
```

#### Azure Key Vault

```bash title="scripts/get-api-key-azure.sh"
#!/bin/bash

# Fetch API key from Azure Key Vault
export ANTHROPIC_API_KEY=$(az keyvault secret show \
  --vault-name company-vault \
  --name anthropic-api-key \
  --query value \
  --output tsv)
```

### Key Rotation Automation

```yaml title=".github/workflows/rotate-keys.yml"
name: Rotate API Keys

on:
  schedule:
    - cron: '0 0 1 * *'  # Monthly
  workflow_dispatch:

jobs:
  rotate:
    runs-on: ubuntu-latest
    steps:
      - name: Generate New Key
        run: |
          # Call Anthropic API to generate new key
          NEW_KEY=$(curl -X POST "https://api.anthropic.com/v1/organizations/keys" \
            -H "Authorization: Bearer ${{ secrets.ANTHROPIC_ADMIN_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"name": "claude-code-prod-'$(date +%Y%m%d)'"}' \
            | jq -r '.key')

          # Store in secret manager
          aws secretsmanager update-secret \
            --secret-id "claude-code/api-key" \
            --secret-string "$NEW_KEY"

      - name: Notify Team
        run: |
          curl -X POST "${{ secrets.SLACK_WEBHOOK }}" \
            -H "Content-Type: application/json" \
            -d '{"text": "Claude Code API key rotated successfully"}'
```

## Usage Monitoring and Quotas

### Token Usage Tracking

```json title=".claude/settings.json"
{
  "monitoring": {
    "enabled": true,
    "trackUsage": true,
    "quotas": {
      "daily": {
        "tokens": 1000000,
        "requests": 5000
      },
      "monthly": {
        "tokens": 20000000,
        "requests": 100000
      }
    },
    "alerts": {
      "threshold": 80,
      "channels": ["slack", "email"]
    }
  },
  "hooks": {
    "PostToolUse": [
      {
        "command": "scripts/track-usage.sh \"$TOOL_NAME\" \"$TOKEN_COUNT\""
      }
    ]
  }
}
```

```bash title="scripts/track-usage.sh"
#!/bin/bash

TOOL=$1
TOKENS=$2
USER=$(whoami)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DATE=$(date +%Y%m%d)

# Track in local file
USAGE_FILE="${HOME}/.claude/usage/${DATE}.json"
mkdir -p "$(dirname "$USAGE_FILE")"

# Append usage record
echo "{\"timestamp\":\"$TIMESTAMP\",\"user\":\"$USER\",\"tool\":\"$TOOL\",\"tokens\":$TOKENS}" >> "$USAGE_FILE"

# Calculate daily total
DAILY_TOTAL=$(jq -s '[.[].tokens] | add' "$USAGE_FILE")

# Check quota
DAILY_QUOTA=1000000
if [ "$DAILY_TOTAL" -gt "$DAILY_QUOTA" ]; then
  echo "WARNING: Daily quota exceeded ($DAILY_TOTAL/$DAILY_QUOTA tokens)"
  # Send alert
  scripts/send-alert.sh "quota_exceeded" "$USER" "$DAILY_TOTAL"
fi
```

### Usage Dashboard

```json title="usage-dashboard-config.json"
{
  "dashboard": {
    "metrics": [
      {
        "name": "daily_tokens",
        "query": "sum(tokens) by (user, date)",
        "visualization": "timeseries"
      },
      {
        "name": "model_usage",
        "query": "count(*) by (model)",
        "visualization": "pie"
      },
      {
        "name": "tool_frequency",
        "query": "count(*) by (tool)",
        "visualization": "bar"
      },
      {
        "name": "cost_estimate",
        "query": "sum(tokens * cost_per_token) by (date)",
        "visualization": "timeseries"
      }
    ],
    "alerts": [
      {
        "name": "high_usage",
        "condition": "daily_tokens > 800000",
        "severity": "warning"
      },
      {
        "name": "quota_exceeded",
        "condition": "daily_tokens > 1000000",
        "severity": "critical"
      }
    ]
  }
}
```

### Cost Allocation

```bash title="scripts/generate-cost-report.sh"
#!/bin/bash

MONTH=${1:-$(date +%Y%m)}
REPORT_FILE="cost-report-${MONTH}.json"

# Aggregate usage by team
jq -s '
  group_by(.user) |
  map({
    user: .[0].user,
    total_tokens: [.[].tokens] | add,
    request_count: length,
    estimated_cost: ([.[].tokens] | add) * 0.000003
  })
' ~/.claude/usage/${MONTH}*.json > "$REPORT_FILE"

echo "Cost report generated: $REPORT_FILE"
```

## Team Onboarding

### Onboarding Checklist

#### Administrator Setup

1. **Configure Enterprise Policy**
   ```bash
   # Deploy enterprise settings
   scripts/deploy-policy.sh

   # Verify policy
   claude config --show | grep enterprise
   ```

2. **Set Up SSO**
   ```bash
   claude enterprise auth configure --provider okta
   ```

3. **Create Role Mappings**
   ```bash
   claude enterprise roles import role-mappings.json
   ```

4. **Configure Quotas**
   ```bash
   claude enterprise quotas set --role developers --daily 500000
   ```

#### Developer Setup

```bash title="scripts/onboard-developer.sh"
#!/bin/bash

echo "Claude Code Enterprise Setup"
echo "============================"

# 1. Install Claude Code
echo "Installing Claude Code..."
npm install -g @anthropic-ai/claude-code

# 2. Authenticate via SSO
echo "Authenticating via SSO..."
claude auth login --sso

# 3. Sync enterprise settings
echo "Syncing enterprise settings..."
claude enterprise sync

# 4. Verify setup
echo "Verifying setup..."
claude doctor

# 5. Show permissions
echo "Your permissions:"
claude /permissions

echo ""
echo "Setup complete! Run 'claude' to start."
```

### Team Configuration Template

```json title=".claude/team-settings.json"
{
  "team": {
    "name": "Platform Engineering",
    "id": "platform-eng",
    "lead": "alice@company.com"
  },
  "defaults": {
    "model": "claude-sonnet-4-5-20250929",
    "autoCompact": true,
    "theme": "dark"
  },
  "sharedSkills": [
    "code-review",
    "test-generation",
    "documentation"
  ],
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "jira": {
      "command": "npx",
      "args": ["-y", "mcp-server-jira"],
      "env": {
        "JIRA_URL": "https://company.atlassian.net",
        "JIRA_TOKEN": "${JIRA_TOKEN}"
      }
    }
  }
}
```

### Training Materials

Create training documentation for teams:

```markdown title="docs/claude-code-training.md"
# Claude Code Training Guide

## Getting Started

### 1. Installation
npm install -g @anthropic-ai/claude-code

### 2. Authentication
claude auth login --sso

### 3. First Run
cd your-project
claude

## Best Practices

### Security
- Never share API keys
- Don't ask Claude to read .env files
- Review all code changes before accepting

### Efficiency
- Use /compact regularly
- Match model to task complexity
- Break large tasks into steps

### Collaboration
- Commit CLAUDE.md with team conventions
- Share custom skills
- Document project-specific guidelines

## Getting Help
- Slack: #claude-code-help
- Wiki: wiki.company.com/claude-code
- Training: training@company.com
```

## Compliance and Governance

### Compliance Configuration Matrix

| Requirement | Configuration | Verification |
|-------------|---------------|--------------|
| Data residency | Custom model routing | Audit logs |
| Access control | SSO + RBAC | Permission logs |
| Audit trail | Hook-based logging | SIEM integration |
| Data protection | Sandbox + deny rules | Security scans |
| Retention | Log rotation policy | Compliance reports |

### Governance Dashboard

```json title="governance-config.json"
{
  "governance": {
    "policies": {
      "dataHandling": {
        "piiAllowed": false,
        "encryptionRequired": true,
        "retentionDays": 90
      },
      "accessControl": {
        "mfaRequired": true,
        "sessionTimeout": "8h",
        "ipRestrictions": true
      },
      "auditRequirements": {
        "logAllAccess": true,
        "logToolUsage": true,
        "logModelResponses": false
      }
    },
    "reports": {
      "frequency": "weekly",
      "recipients": ["compliance@company.com", "security@company.com"],
      "includeMetrics": [
        "total_users",
        "active_users",
        "token_usage",
        "policy_violations",
        "access_denials"
      ]
    }
  }
}
```

### Compliance Reporting

```bash title="scripts/compliance-report.sh"
#!/bin/bash

REPORT_DATE=$(date +%Y%m%d)
REPORT_FILE="compliance-report-${REPORT_DATE}.json"

# Gather metrics
TOTAL_USERS=$(claude enterprise users list | wc -l)
ACTIVE_USERS=$(claude enterprise users list --active | wc -l)
POLICY_VIOLATIONS=$(grep -c "BLOCKED\|DENIED" ~/.claude/audit-logs/*.jsonl)
TOKEN_USAGE=$(jq -s '[.[].tokens] | add' ~/.claude/usage/*.json)

# Generate report
cat > "$REPORT_FILE" << EOF
{
  "report_date": "$REPORT_DATE",
  "metrics": {
    "total_users": $TOTAL_USERS,
    "active_users": $ACTIVE_USERS,
    "policy_violations": $POLICY_VIOLATIONS,
    "total_tokens": $TOKEN_USAGE
  },
  "compliance_status": {
    "sso_enabled": true,
    "audit_logging": true,
    "sandbox_enforced": true,
    "secrets_protected": true
  }
}
EOF

# Send to compliance team
curl -X POST "https://compliance.company.com/api/reports" \
  -H "Content-Type: application/json" \
  -d @"$REPORT_FILE"
```

## Custom Model Routing

### AWS Bedrock Configuration

```json title=".claude/settings.json"
{
  "modelRouting": {
    "provider": "bedrock",
    "region": "us-east-1",
    "credentials": {
      "type": "iam-role",
      "roleArn": "arn:aws:iam::123456789012:role/ClaudeCodeRole"
    },
    "models": {
      "opus": "anthropic.claude-3-opus-20240229-v1:0",
      "sonnet": "anthropic.claude-3-sonnet-20240229-v1:0",
      "haiku": "anthropic.claude-3-haiku-20240307-v1:0"
    }
  }
}
```

```bash
# Enable Bedrock
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1
export AWS_PROFILE=claude-code

# Run with Bedrock
claude
```

### Google Vertex AI Configuration

```json title=".claude/settings.json"
{
  "modelRouting": {
    "provider": "vertex",
    "project": "company-ai-project",
    "location": "us-central1",
    "credentials": {
      "type": "service-account",
      "keyFile": "${GOOGLE_APPLICATION_CREDENTIALS}"
    },
    "models": {
      "opus": "claude-3-opus@20240229",
      "sonnet": "claude-3-sonnet@20240229",
      "haiku": "claude-3-haiku@20240307"
    }
  }
}
```

```bash
# Enable Vertex
export CLAUDE_CODE_USE_VERTEX=1
export GOOGLE_CLOUD_PROJECT=company-ai-project
export GOOGLE_CLOUD_REGION=us-central1
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Run with Vertex
claude
```

### Multi-Region Routing

```json title=".claude/settings.json"
{
  "modelRouting": {
    "strategy": "geo-aware",
    "regions": {
      "us": {
        "provider": "bedrock",
        "region": "us-east-1"
      },
      "eu": {
        "provider": "vertex",
        "location": "europe-west1"
      },
      "apac": {
        "provider": "bedrock",
        "region": "ap-southeast-1"
      }
    },
    "fallback": {
      "provider": "anthropic",
      "direct": true
    }
  }
}
```

### Model Selection Policy

```json title="model-policy.json"
{
  "modelPolicy": {
    "default": "claude-sonnet-4-5-20250929",
    "rules": [
      {
        "condition": "security-review",
        "model": "claude-opus-4-5-20251101",
        "reason": "Security reviews require highest accuracy"
      },
      {
        "condition": "documentation",
        "model": "claude-haiku-3-5-20241022",
        "reason": "Documentation is cost-efficient with Haiku"
      },
      {
        "condition": "code-generation",
        "model": "claude-sonnet-4-5-20250929",
        "reason": "Balanced speed and quality for coding"
      }
    ],
    "restrictions": {
      "opus": {
        "roles": ["senior-engineer", "architect", "security"],
        "requireApproval": false
      },
      "sonnet": {
        "roles": ["*"],
        "requireApproval": false
      },
      "haiku": {
        "roles": ["*"],
        "requireApproval": false
      }
    }
  }
}
```

## Enterprise Support

### Support Channels

| Priority | Channel | SLA |
|----------|---------|-----|
| P1 - Critical | Phone + Slack | 1 hour |
| P2 - High | Email + Slack | 4 hours |
| P3 - Medium | Email | 24 hours |
| P4 - Low | Portal | 72 hours |

### Enterprise Contact Configuration

```json title=".claude/enterprise-support.json"
{
  "support": {
    "organization": "Company Name",
    "contract": "ENT-12345",
    "contacts": {
      "primary": {
        "name": "IT Admin",
        "email": "it-admin@company.com",
        "phone": "+1-555-0100"
      },
      "billing": {
        "name": "Finance",
        "email": "finance@company.com"
      },
      "security": {
        "name": "Security Team",
        "email": "security@company.com"
      }
    },
    "escalation": {
      "anthropic": {
        "tam": "enterprise-support@anthropic.com",
        "emergency": "+1-555-CLAUDE"
      }
    }
  }
}
```

## Next Steps

- [Security Hardening](/guides/security-hardening)
- [CI/CD Integration](/guides/ci-cd)
- [Multi-Agent Workflows](/guides/multi-agent)
- [MCP Configuration](/mcp/configuration)
