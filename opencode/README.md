# OpenCode

OpenCode is a comprehensive AI-powered development toolkit that provides specialized agents and commands for software engineering tasks.

## Overview

OpenCode consists of two main components:

### Agents
Specialized AI agents designed for specific domains:
- **Architecture**: Backend, Database, and System Architects
- **Content**: Content Editors and Documentation Specialists  
- **Engineering**: Frontend and Mobile Engineers
- **Ops**: Deployment Engineers, Performance Analysts, Security Auditors
- **Orchestration**: Workflow Orchestrators
- **Quality**: Accessibility Engineers, Code Reviewers, Test Automation Engineers

### Commands
Task-specific commands that route to appropriate agents:
- **Architecture**: System design and architectural planning
- **Content**: Content creation, editing, and documentation
- **Engineering**: Frontend, backend, and mobile development tasks
- **Ops**: Performance audits, security reviews, deployment optimization
- **Orchestration**: Build management, feature planning, hotfixes
- **Quality**: Code analysis, testing, accessibility audits

## Getting Started

1. **Installation**: Run `./install.sh` to set up OpenCode
2. **Usage**: Commands are available through your CLI tool
3. **Agent Selection**: Commands automatically route to the most appropriate agent based on task type and context

## Structure

```
opencode/
├── agent/          # Agent definitions and specializations
├── command/        # Command definitions that invoke agents
├── README.md       # This file
├── AGENT_GUIDE.md  # Detailed agent usage guide
└── install.sh      # Installation script
```

## Command Examples

- `/analyze` - Context-aware code analysis
- `/review` - Comprehensive code review
- `/plan` - Feature planning and architecture
- `/build` - Build and deployment orchestration
- `/security-audit` - Security vulnerability assessment

Each command includes metadata about which agent to use and what model to invoke, ensuring optimal results for every task.

## Agent Specialization

Agents are highly specialized with deep domain knowledge:
- Frontend engineers focus on React, TypeScript, and modern web technologies
- Backend architects handle API design, database architecture, and system scalability
- Security auditors perform comprehensive security analysis and vulnerability detection
- Performance analysts optimize for speed, efficiency, and resource usage

This specialization ensures that every task is handled by an expert with the right context and expertise.

## Inspiration

- [Contains Studio AI Agents](https://github.com/contains-studio/agents)
- [Seth Hobsons agents](https://github.com/wshobson/agents)
- [Richard Hightower's subagents](https://github.com/RichardHightower/subagents)
