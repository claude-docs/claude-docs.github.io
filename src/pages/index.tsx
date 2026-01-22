import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/getting-started/introduction">
            Get Started
          </Link>
          <Link
            className="button button--outline button--lg"
            style={{marginLeft: '1rem', borderColor: '#1C1917', color: '#1C1917'}}
            to="/cli/overview">
            CLI Reference
          </Link>
        </div>
      </div>
    </header>
  );
}

type FeatureItem = {
  title: string;
  description: string;
  link: string;
  icon: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Claude Code CLI',
    description: 'An agentic coding tool that lives in your terminal. Understands your codebase and helps you code faster through natural language.',
    link: '/cli/overview',
    icon: '⌨️',
  },
  {
    title: 'Model Context Protocol',
    description: 'Open standard for AI-tool integration. Connect Claude to databases, APIs, file systems, and more through MCP servers.',
    link: '/mcp/overview',
    icon: '🔌',
  },
  {
    title: 'Agent SDK',
    description: 'Build autonomous agents with the Claude Agent SDK. Available for Python and TypeScript with full tool orchestration.',
    link: '/sdk/overview',
    icon: '🤖',
  },
  {
    title: 'IDE Integrations',
    description: 'Native extensions for VS Code, JetBrains, and Neovim. Seamless diff viewing, code review, and conversation history.',
    link: '/ide/overview',
    icon: '🖥️',
  },
  {
    title: 'Hooks System',
    description: 'User-defined shell commands that execute at lifecycle points. Automate formatting, notifications, and compliance.',
    link: '/hooks/overview',
    icon: '🪝',
  },
  {
    title: 'Skills & Commands',
    description: 'Extend Claude with custom skills and slash commands. Create project-specific workflows and reusable automation.',
    link: '/skills/overview',
    icon: '✨',
  },
];

function Feature({title, description, link, icon}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="feature-card" style={{height: '100%'}}>
        <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>{icon}</div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        <Link to={link}>Learn more →</Link>
      </div>
    </div>
  );
}

function HomepageFeatures() {
  return (
    <section className="homepage-section">
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2">The Claude Code Ecosystem</Heading>
          <p>Everything you need to build with Claude Code</p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickLinks() {
  return (
    <section className="homepage-section" style={{background: 'var(--ifm-background-surface-color)'}}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <Heading as="h2">Quick Links</Heading>
          <p>Jump straight to what you need</p>
        </div>
        <div className="row" style={{justifyContent: 'center', gap: '1rem', flexWrap: 'wrap'}}>
          <Link className="quick-link" to="/getting-started/installation">
            📦 Installation
          </Link>
          <Link className="quick-link" to="/cli/commands">
            📋 Commands
          </Link>
          <Link className="quick-link" to="/mcp/servers">
            🔌 MCP Servers
          </Link>
          <Link className="quick-link" to="/guides/best-practices">
            📚 Best Practices
          </Link>
          <Link className="quick-link" to="/reference/troubleshooting">
            🔧 Troubleshooting
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="homepage-section">
      <div className="container">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">97M+</div>
            <div className="stat-label">MCP SDK Downloads</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10K+</div>
            <div className="stat-label">MCP Servers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">3</div>
            <div className="stat-label">Claude Models</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5+</div>
            <div className="stat-label">IDE Integrations</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section className="homepage-section" style={{background: 'var(--ifm-background-surface-color)'}}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <Heading as="h2">Official Resources</Heading>
            <ul>
              <li><a href="https://code.claude.com/docs">Claude Code Documentation</a></li>
              <li><a href="https://github.com/anthropics/claude-code">GitHub Repository</a></li>
              <li><a href="https://modelcontextprotocol.io">MCP Specification</a></li>
              <li><a href="https://anthropic.com">Anthropic</a></li>
            </ul>
          </div>
          <div className="col col--6">
            <Heading as="h2">Community</Heading>
            <ul>
              <li><a href="https://github.com/hesreallyhim/awesome-claude-code">Awesome Claude Code</a></li>
              <li><a href="https://github.com/travisvn/awesome-claude-skills">Awesome Claude Skills</a></li>
              <li><a href="https://discord.gg/anthropic">Discord Community</a></li>
              <li><a href="https://github.com/claude-docs/claude-docs.github.io">Contribute to These Docs</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="Documentation for the Claude Code ecosystem - CLI, MCP, Agent SDK, and more">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <QuickLinks />
        <Stats />
        <CommunitySection />
      </main>
    </Layout>
  );
}
