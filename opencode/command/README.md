# Commands Directory

This directory contains task-specific commands that automatically route to the most appropriate AI agents based on the task type and context.

## Command Structure

Each command is defined as a markdown file with YAML frontmatter:

```yaml
---
description: Brief description of what the command does
agent: primary-agent-type
model: model-to-use
---
```

## Command Categories

### 🏗️ Architecture Commands
System design and architectural planning tasks.

- **[arch](architecture/arch.md)** - System architecture analysis and design
- **[plan](orchestration/plan.md)** - Feature planning and architectural roadmapping

### ✍️ Content Commands
Content creation, editing, and documentation tasks.

- **[critique](content/critique.md)** - Content review and improvement suggestions
- **[document](content/document.md)** - Technical documentation creation
- **[edit](content/edit.md)** - Content editing and refinement
- **[polish](content/polish.md)** - Content polishing and finalization

### 💻 Engineering Commands
Implementation tasks for different platforms and technologies.

- **[be](engineering/be.md)** - Backend development tasks
- **[fe](engineering/fe.md)** - Frontend development tasks
- **[mobile](engineering/mobile.md)** - Mobile development tasks

### ⚙️ Operations Commands
Deployment, performance, security, and infrastructure tasks.

- **[optimize](ops/optimize.md)** - Performance optimization and efficiency improvements
- **[performance-audit](ops/performance-audit.md)** - Comprehensive performance analysis
- **[security-audit](ops/security-audit.md)** - Security vulnerability assessment

### 🎯 Orchestration Commands
Workflow management, coordination, and process tasks.

- **[build](orchestration/build.md)** - Build process management and optimization
- **[hotfix](orchestration/hotfix.md)** - Emergency fixes and rapid deployment
- **[invoke](orchestration/invoke.md)** - Command invocation and execution
- **[new-feature](orchestration/new-feature.md)** - New feature development coordination
- **[plan](orchestration/plan.md)** - Project planning and task organization

### 🔍 Quality Commands
Code analysis, testing, accessibility, and standards compliance.

- **[a11y-audit](quality/a11y-audit.md)** - Accessibility compliance audit
- **[analyze](quality/analyze.md)** - Context-aware code analysis and routing
- **[bug-fix](quality/bug-fix.md)** - Bug identification and resolution
- **[explain](quality/explain.md)** - Code explanation and documentation
- **[improve](quality/improve.md)** - Code improvement and enhancement
- **[refactor](quality/refactor.md)** - Code refactoring and restructuring
- **[review](quality/review.md)** - Comprehensive code review
- **[tech-debt](quality/tech-debt.md)** - Technical debt identification and management
- **[test-plan](quality/test-plan.md)** - Comprehensive test planning
- **[write-tests](quality/write-tests.md)** - Test implementation and automation

### 📊 Meta Commands
Meta-level tasks and session management.

- **[session-summary](meta/session-summary.md)** - Session summary and documentation

## Command Usage

Commands are invoked through your CLI tool using the `/` prefix:
```
/command-name [arguments]
```

### Automatic Agent Routing

Commands automatically route to the most appropriate agent based on:
- **Explicit specification** in command frontmatter
- **File type and context** (for analysis commands)
- **Task type and domain** (for specialized tasks)

### Command Execution Flow

1. **Command Selection** - User invokes a command
2. **Agent Routing** - System selects appropriate agent
3. **Context Analysis** - Agent examines codebase and context
4. **Task Execution** - Agent performs the specified task
5. **Result Delivery** - Agent provides comprehensive output

## Command Development

When creating new commands:

1. **Choose appropriate category** based on task domain
2. **Define clear scope** and deliverables
3. **Specify primary agent** for the task type
4. **Include comprehensive description** of what the command does
5. **Follow existing patterns** for structure and formatting

## Best Practices

- **Specific descriptions** - Clearly define what each command does
- **Appropriate agent selection** - Match commands to domain experts
- **Consistent structure** - Follow established patterns
- **Comprehensive coverage** - Ensure all common development tasks are covered
- **Cross-references** - Link related commands for better discoverability

Commands are designed to be the primary interface for interacting with the OpenCode system, providing task-specific access to specialized AI expertise.