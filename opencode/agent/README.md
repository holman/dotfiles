# AI Agents Directory

This directory contains specialized AI agents designed for specific domains in software development and operations.

## Agent Categories

### 🏗️ Architecture Agents
Specialized in system design, scalability, and technical architecture.

- **[Backend Architect](architecture/backend-architect.md)** - API design, system scalability, microservices architecture
- **[Database Architect](architecture/database-architect.md)** - Schema design, query optimization, data modeling
- **[System Architect](architecture/system-architect.md)** - Overall system design, technology stack decisions

### ✍️ Content Agents
Focused on documentation, technical writing, and content creation.

- **[Content Editor](content/content-editor.md)** - Technical writing clarity, content structure and flow
- **[Documentation Specialist](content/documentation-specialist.md)** - API docs, user guides, technical specifications

### 💻 Engineering Agents
Domain-specific implementation experts for different platforms.

- **[Frontend Engineer](engineering/frontend-engineer.md)** - React, TypeScript, CSS, state management, UI/UX
- **[Mobile Engineer](engineering/mobile-engineer.md)** - React Native, Swift, Kotlin, mobile-specific patterns

### ⚙️ Operations Agents
Specialized in deployment, performance, security, and infrastructure.

- **[Deployment Engineer](ops/deployment-engineer.md)** - CI/CD, Docker, cloud deployment, infrastructure as code
- **[Performance Analyst](ops/performance-analyst.md)** - Optimization, profiling, bottleneck identification
- **[Security Auditor](ops/security-auditor.md)** - Vulnerability assessment, security best practices

### 🎯 Orchestration Agents
Focused on workflow management, coordination, and process optimization.

- **[Workflow Orchestrator](orchestration/workflow-orchestrator.md)** - Build processes, release management, coordination

### 🔍 Quality Agents
Dedicated to code quality, testing, accessibility, and standards compliance.

- **[Accessibility Engineer](quality/accessibility-engineer.md)** - A11y compliance, screen readers, inclusive design
- **[Code Reviewer](quality/code-reviewer.md)** - Code quality, maintainability, best practices
- **[Test Automation Engineer](quality/test-automation-engineer.md)** - Test strategy, coverage, automation frameworks

## Agent Selection

Agents are automatically selected based on:
- **File type and extension** (e.g., `.tsx` → Frontend Engineer)
- **Content and context** (e.g., security configs → Security Auditor)
- **Command type** (e.g., `/optimize` → Performance Analyst)
- **Explicit specification** in command frontmatter

## Agent Capabilities

Each agent provides:
- **Domain expertise** in their specialized area
- **Best practices knowledge** for their field
- **Tool and framework familiarity** relevant to their domain
- **Cross-functional awareness** for collaboration with other agents

## Collaboration Patterns

When tasks span multiple domains:
1. **Primary Agent** takes the lead based on the main task type
2. **Secondary Agents** are consulted for specific domain expertise
3. **Integration** ensures recommendations are compatible and comprehensive

Example: A new API endpoint might involve:
- **Backend Architect** (primary) for API design
- **Security Auditor** for authentication/authorization
- **Test Automation Engineer** for test strategy
- **Documentation Specialist** for API documentation

## Agent Evolution

Agents continuously improve through:
- Learning from codebase patterns and conventions
- Adapting to project-specific requirements
- Incorporating feedback from task outcomes
- Staying updated with industry best practices

## Usage Guidelines

- **Trust the agent selection** - commands route to appropriate specialists
- **Provide context** - help agents understand your specific needs
- **Follow recommendations** - agents provide expert guidance based on best practices
- **Give feedback** - helps improve agent performance over time

Each agent is designed to be a domain expert, providing deep knowledge and practical solutions for their area of specialization.