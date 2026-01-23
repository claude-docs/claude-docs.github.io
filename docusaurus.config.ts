import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Claude Code Docs',
  tagline: 'The complete guide to AI-assisted coding with Claude',
  favicon: 'img/favicon.ico',

  url: 'https://claude-docs.github.io',
  baseUrl: '/',
  organizationName: 'claude-docs',
  projectName: 'claude-docs.github.io',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  future: {
    v4: true,
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    format: 'detect',
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/claude-docs/claude-docs.github.io/tree/main/',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',

    metadata: [
      // Basic SEO
      {name: 'keywords', content: 'claude code, claude cli, anthropic, ai coding, mcp, model context protocol, claude agent sdk, ai assistant, code generation'},
      {name: 'description', content: 'Documentation for the Claude Code ecosystem - CLI, MCP servers, Agent SDK, IDE integrations, and more. The complete guide to AI-assisted coding.'},
      {name: 'author', content: 'Claude Code Docs Community'},

      // Open Graph
      {property: 'og:type', content: 'website'},
      {property: 'og:site_name', content: 'Claude Code Docs'},
      {property: 'og:title', content: 'Claude Code Docs - AI-Assisted Coding Guide'},
      {property: 'og:description', content: 'The complete guide to AI-assisted coding with Claude. CLI reference, MCP servers, Agent SDK, IDE integrations, and more.'},
      {property: 'og:image', content: 'https://claude-docs.github.io/img/social-card.png'},
      {property: 'og:image:width', content: '1200'},
      {property: 'og:image:height', content: '630'},
      {property: 'og:image:alt', content: 'Claude Code Docs - The complete guide to AI-assisted coding with Claude'},
      {property: 'og:url', content: 'https://claude-docs.github.io'},
      {property: 'og:locale', content: 'en_US'},

      // Twitter Card
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'twitter:title', content: 'Claude Code Docs - AI-Assisted Coding Guide'},
      {name: 'twitter:description', content: 'The complete guide to AI-assisted coding with Claude. CLI, MCP, SDK, IDE integrations, and more.'},
      {name: 'twitter:image', content: 'https://claude-docs.github.io/img/social-card.png'},
      {name: 'twitter:image:alt', content: 'Claude Code Docs'},
    ],

    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },

    announcementBar: {
      id: 'contribute',
      content: 'Help improve these docs! <a href="https://github.com/claude-docs/claude-docs.github.io">Contribute on GitHub</a>',
      backgroundColor: '#D97706',
      textColor: '#fff',
      isCloseable: true,
    },

    navbar: {
      title: 'Claude Code Docs',
      logo: {
        alt: 'Claude Code Logo',
        src: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          to: '/getting-started/introduction',
          label: 'Getting Started',
          position: 'left',
        },
        {
          to: '/tutorials/overview',
          label: 'Tutorials',
          position: 'left',
        },
        {
          to: '/cli/overview',
          label: 'CLI',
          position: 'left',
        },
        {
          to: '/mcp/overview',
          label: 'MCP',
          position: 'left',
        },
        {
          type: 'dropdown',
          label: 'Ecosystem',
          position: 'left',
          items: [
            {label: 'Agent SDK', to: '/sdk/overview'},
            {label: 'IDE Integrations', to: '/ide/overview'},
            {label: 'Hooks', to: '/hooks/overview'},
            {type: 'html', value: '<hr style="margin: 0.5rem 0;">'},
            {label: 'Skills & Commands', to: '/skills/overview'},
            {label: 'Community Tools', to: '/community/tools'},
          ],
        },
        {
          type: 'dropdown',
          label: 'Resources',
          position: 'left',
          items: [
            {label: 'Best Practices', to: '/guides/best-practices'},
            {label: 'Troubleshooting', to: '/reference/troubleshooting'},
            {label: 'FAQ', to: '/reference/faq'},
            {type: 'html', value: '<hr style="margin: 0.5rem 0;">'},
            {label: 'Official Docs', href: 'https://code.claude.com/docs'},
            {label: 'Anthropic', href: 'https://anthropic.com'},
          ],
        },
        {
          href: 'https://github.com/claude-docs/claude-docs.github.io',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {label: 'Getting Started', to: '/getting-started/introduction'},
            {label: 'Tutorials', to: '/tutorials/overview'},
            {label: 'CLI Reference', to: '/cli/overview'},
            {label: 'MCP Guide', to: '/mcp/overview'},
          ],
        },
        {
          title: 'Ecosystem',
          items: [
            {label: 'Agent SDK', to: '/sdk/overview'},
            {label: 'IDE Integrations', to: '/ide/overview'},
            {label: 'Community Tools', to: '/community/tools'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'GitHub', href: 'https://github.com/anthropics/claude-code'},
            {label: 'Discord', href: 'https://discord.gg/anthropic'},
            {label: 'Awesome Claude Code', href: 'https://github.com/hesreallyhim/awesome-claude-code'},
          ],
        },
        {
          title: 'Official',
          items: [
            {label: 'Claude Code Docs', href: 'https://code.claude.com/docs'},
            {label: 'Anthropic', href: 'https://anthropic.com'},
            {label: 'MCP Spec', href: 'https://modelcontextprotocol.io'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Claude Code Docs Community. Built with Docusaurus.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript', 'python'],
    },

    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
