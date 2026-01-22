import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HeroSection() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroBackground}>
        <div className={styles.heroGlow} />
        <div className={styles.heroGrid} />
      </div>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot} />
            Community Documentation
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            Master <span className={styles.gradientText}>Claude Code</span>
          </Heading>
          <p className={styles.heroSubtitle}>
            The complete guide to AI-assisted coding. From CLI basics to advanced
            multi-agent workflows, MCP servers, and enterprise deployments.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} to="/getting-started/introduction">
              <span>Get Started</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link className={styles.secondaryButton} to="/cli/overview">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 7L9 10L6 13M11 13H14M4 3H16C16.5523 3 17 3.44772 17 4V16C17 16.5523 16.5523 17 16 17H4C3.44772 17 3 16.5523 3 16V4C3 3.44772 3.44772 3 4 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>CLI Reference</span>
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.statValue}>60+</span>
              <span className={styles.statLabel}>Guides</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.heroStat}>
              <span className={styles.statValue}>10K+</span>
              <span className={styles.statLabel}>MCP Servers</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.heroStat}>
              <span className={styles.statValue}>100%</span>
              <span className={styles.statLabel}>Free & Open</span>
            </div>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.terminalWindow}>
            <div className={styles.terminalHeader}>
              <div className={styles.terminalDots}>
                <span className={styles.dotRed} />
                <span className={styles.dotYellow} />
                <span className={styles.dotGreen} />
              </div>
              <span className={styles.terminalTitle}>claude</span>
            </div>
            <div className={styles.terminalBody}>
              <div className={styles.terminalLine}>
                <span className={styles.prompt}>$</span>
                <span className={styles.command}>claude</span>
              </div>
              <div className={styles.terminalLine}>
                <span className={styles.output}>Welcome to Claude Code!</span>
              </div>
              <div className={styles.terminalLine}>
                <span className={styles.outputDim}>Type your request or use /help</span>
              </div>
              <div className={styles.terminalLine + ' ' + styles.typewriter}>
                <span className={styles.promptClaude}>{'>'}</span>
                <span className={styles.userInput}>Add authentication to my Express API</span>
                <span className={styles.cursor}>|</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

const features = [
  {
    title: 'Claude Code CLI',
    description: 'An agentic coding tool that lives in your terminal. Understands your entire codebase and helps you code faster through natural language.',
    link: '/cli/overview',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 9L11 12L8 15M13 15H16M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Model Context Protocol',
    description: 'Open standard for AI-tool integration. Connect Claude to databases, APIs, browsers, and any external system through MCP servers.',
    link: '/mcp/overview',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 6V18M12 6L7 11M12 6L17 11M5 18H19" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="21" r="1" fill="currentColor"/>
        <circle cx="12" cy="3" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    title: 'Agent SDK',
    description: 'Build autonomous agents powered by Claude. Full TypeScript and Python SDKs with tool orchestration and multi-step reasoning.',
    link: '/sdk/overview',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'IDE Integrations',
    description: 'Native extensions for VS Code, JetBrains, and Neovim. Inline diffs, conversation history, and seamless workflow integration.',
    link: '/ide/overview',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 20L14 4M18 8L22 12L18 16M6 16L2 12L6 8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Hooks System',
    description: 'Execute custom scripts at lifecycle events. Automate linting, notifications, compliance checks, and deployment workflows.',
    link: '/hooks/overview',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15.5 5.5C15.5 7.433 13.933 9 12 9C10.067 9 8.5 7.433 8.5 5.5M15.5 5.5C15.5 3.567 13.933 2 12 2C10.067 2 8.5 3.567 8.5 5.5M15.5 5.5H19M8.5 5.5H5M12 9V22M12 22L8 18M12 22L16 18" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Skills & Commands',
    description: 'Extend Claude with custom slash commands and project-specific skills. Build reusable workflows your whole team can use.',
    link: '/skills/overview',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 10V3L4 14H11V21L20 10H13Z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Ecosystem</span>
          <Heading as="h2" className={styles.sectionTitle}>
            Everything you need to build with Claude
          </Heading>
          <p className={styles.sectionSubtitle}>
            Comprehensive documentation for every part of the Claude Code ecosystem
          </p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature, idx) => (
            <Link key={idx} to={feature.link} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <Heading as="h3" className={styles.featureTitle}>{feature.title}</Heading>
              <p className={styles.featureDescription}>{feature.description}</p>
              <span className={styles.featureLink}>
                Learn more
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const guides = [
  { title: 'CLAUDE.md Mastery', description: 'Project-level instructions', link: '/guides/claude-md-mastery', tag: 'Popular' },
  { title: 'Multi-Agent Patterns', description: 'Parallel development workflows', link: '/guides/multi-agent-patterns', tag: 'Advanced' },
  { title: 'Building MCP Servers', description: 'Create custom integrations', link: '/mcp/building-servers', tag: 'Tutorial' },
  { title: 'Security Hardening', description: 'Enterprise-grade security', link: '/guides/security-hardening', tag: 'Enterprise' },
  { title: 'Hooks Cookbook', description: '33 ready-to-use recipes', link: '/hooks/cookbook', tag: 'Recipes' },
  { title: 'Skills Library', description: '20+ production skills', link: '/skills/library', tag: 'Library' },
];

function GuidesSection() {
  return (
    <section className={styles.guides}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Guides</span>
          <Heading as="h2" className={styles.sectionTitle}>
            Level up your Claude Code skills
          </Heading>
          <p className={styles.sectionSubtitle}>
            From beginner tutorials to advanced patterns and enterprise deployments
          </p>
        </div>
        <div className={styles.guidesGrid}>
          {guides.map((guide, idx) => (
            <Link key={idx} to={guide.link} className={styles.guideCard}>
              <div className={styles.guideTag}>{guide.tag}</div>
              <Heading as="h4" className={styles.guideTitle}>{guide.title}</Heading>
              <p className={styles.guideDescription}>{guide.description}</p>
            </Link>
          ))}
        </div>
        <div className={styles.guidesMore}>
          <Link to="/guides/best-practices" className={styles.textLink}>
            View all guides
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function CodeExampleSection() {
  return (
    <section className={styles.codeExample}>
      <div className="container">
        <div className={styles.codeExampleGrid}>
          <div className={styles.codeExampleContent}>
            <span className={styles.sectionLabel}>Quick Start</span>
            <Heading as="h2" className={styles.sectionTitle}>
              Up and running in seconds
            </Heading>
            <p className={styles.sectionSubtitle}>
              Install Claude Code and start coding with AI assistance immediately.
              No complex setup or configuration required.
            </p>
            <ul className={styles.checkList}>
              <li>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Works with any codebase, any language
              </li>
              <li>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Understands your entire project context
              </li>
              <li>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Reads, writes, and refactors code safely
              </li>
              <li>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Runs commands and tests for you
              </li>
            </ul>
            <Link to="/getting-started/installation" className={styles.primaryButton}>
              <span>Installation Guide</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          <div className={styles.codeExampleVisual}>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>Terminal</span>
              </div>
              <pre className={styles.codeContent}>
                <code>
                  <span className={styles.comment}># Install Claude Code</span>{'\n'}
                  <span className={styles.prompt}>$</span> npm install -g @anthropic-ai/claude-code{'\n'}
                  {'\n'}
                  <span className={styles.comment}># Start coding with Claude</span>{'\n'}
                  <span className={styles.prompt}>$</span> cd your-project{'\n'}
                  <span className={styles.prompt}>$</span> claude{'\n'}
                  {'\n'}
                  <span className={styles.success}>Welcome to Claude Code v1.0.0</span>{'\n'}
                  <span className={styles.dim}>Ready to help with your codebase.</span>{'\n'}
                  {'\n'}
                  <span className={styles.promptClaude}>{'>'}</span> <span className={styles.typing}>_</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResourcesSection() {
  return (
    <section className={styles.resources}>
      <div className="container">
        <div className={styles.resourcesGrid}>
          <div className={styles.resourceCard}>
            <div className={styles.resourceIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <Heading as="h3">Official Documentation</Heading>
            <p>The authoritative source for Claude Code documentation from Anthropic.</p>
            <a href="https://docs.anthropic.com/en/docs/claude-code" className={styles.resourceLink}>
              docs.anthropic.com
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
          <div className={styles.resourceCard}>
            <div className={styles.resourceIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <Heading as="h3">GitHub Repository</Heading>
            <p>Explore the source code, report issues, and contribute to Claude Code.</p>
            <a href="https://github.com/anthropics/claude-code" className={styles.resourceLink}>
              anthropics/claude-code
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
          <div className={styles.resourceCard}>
            <div className={styles.resourceIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <Heading as="h3">MCP Specification</Heading>
            <p>The Model Context Protocol specification and reference implementation.</p>
            <a href="https://modelcontextprotocol.io" className={styles.resourceLink}>
              modelcontextprotocol.io
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
          <div className={styles.resourceCard}>
            <div className={styles.resourceIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <Heading as="h3">Community</Heading>
            <p>Join the Discord, explore awesome lists, and connect with other developers.</p>
            <a href="https://discord.gg/anthropic" className={styles.resourceLink}>
              Discord Community
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <div className={styles.ctaContent}>
          <Heading as="h2" className={styles.ctaTitle}>
            Ready to transform your development workflow?
          </Heading>
          <p className={styles.ctaSubtitle}>
            Start building with Claude Code today. It's free to get started.
          </p>
          <div className={styles.ctaActions}>
            <Link to="/getting-started/introduction" className={styles.primaryButton}>
              <span>Get Started Free</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <a href="https://github.com/claude-docs/claude-docs.github.io" className={styles.ghostButton}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Claude Code Documentation"
      description="The complete guide to AI-assisted coding with Claude. CLI reference, MCP servers, Agent SDK, IDE integrations, and more.">
      <HeroSection />
      <main>
        <FeaturesSection />
        <CodeExampleSection />
        <GuidesSection />
        <ResourcesSection />
        <CTASection />
      </main>
    </Layout>
  );
}
