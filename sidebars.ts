import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/introduction',
        'getting-started/installation',
        'getting-started/quick-start',
        'getting-started/authentication',
      ],
    },
    {
      type: 'category',
      label: 'CLI Reference',
      collapsed: true,
      items: [
        'cli/overview',
        'cli/commands',
        'cli/slash-commands',
        'cli/configuration',
        'cli/advanced',
        'cli/prompting',
      ],
    },
    {
      type: 'category',
      label: 'Model Context Protocol',
      collapsed: true,
      items: [
        'mcp/overview',
        'mcp/architecture',
        'mcp/servers',
        'mcp/configuration',
        'mcp/building-servers',
        'mcp/advanced-patterns',
        'mcp/recipes',
      ],
    },
    {
      type: 'category',
      label: 'Agent SDK',
      collapsed: true,
      items: [
        'sdk/overview',
        'sdk/python',
        'sdk/typescript',
        'sdk/use-cases',
      ],
    },
    {
      type: 'category',
      label: 'IDE Integrations',
      collapsed: true,
      items: [
        'ide/overview',
        'ide/vscode',
        'ide/jetbrains',
        'ide/neovim',
      ],
    },
    {
      type: 'category',
      label: 'Hooks System',
      collapsed: true,
      items: [
        'hooks/overview',
        'hooks/events',
        'hooks/examples',
        'hooks/cookbook',
        'hooks/advanced',
      ],
    },
    {
      type: 'category',
      label: 'Skills & Commands',
      collapsed: true,
      items: [
        'skills/overview',
        'skills/creating-skills',
        'skills/custom-commands',
        'skills/advanced',
        'skills/library',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'Core Guides',
          collapsed: false,
          items: [
            'guides/best-practices',
            'guides/productivity-tips',
            'guides/context-management',
            'guides/cost-optimization',
            'guides/claude-md-mastery',
            'guides/project-templates',
          ],
        },
        {
          type: 'category',
          label: 'Workflows & Automation',
          collapsed: true,
          items: [
            'guides/workflow-patterns',
            'guides/automation-recipes',
            'guides/scripting',
            'guides/ci-cd',
          ],
        },
        {
          type: 'category',
          label: 'Multi-Agent & Parallel',
          collapsed: true,
          items: [
            'guides/multi-agent',
            'guides/multi-agent-patterns',
            'guides/parallel-development',
          ],
        },
        {
          type: 'category',
          label: 'Security & Enterprise',
          collapsed: true,
          items: [
            'guides/security-hardening',
            'guides/enterprise-setup',
          ],
        },
        {
          type: 'category',
          label: 'Development',
          collapsed: true,
          items: [
            'guides/git-integration',
            'guides/testing-strategies',
            'guides/documentation-generation',
            'guides/debugging',
            'guides/real-world-examples',
          ],
        },
        {
          type: 'category',
          label: 'Language Guides',
          collapsed: true,
          items: [
            'guides/typescript-guide',
            'guides/python-guide',
            'guides/react-guide',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      items: [
        'reference/models',
        'reference/permissions',
        'reference/troubleshooting',
        'guides/troubleshooting-advanced',
        'reference/faq',
      ],
    },
    {
      type: 'category',
      label: 'Community',
      collapsed: true,
      items: [
        'community/tools',
        'community/resources',
        'community/contributing',
      ],
    },
  ],
};

export default sidebars;
