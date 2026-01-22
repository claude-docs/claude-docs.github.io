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
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: true,
      items: [
        'guides/best-practices',
        'guides/context-management',
        'guides/cost-optimization',
        'guides/multi-agent',
        'guides/ci-cd',
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
