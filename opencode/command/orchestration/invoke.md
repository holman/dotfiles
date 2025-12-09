---
description: Custom multi-agent workflow with explicit agent chain
agent: workflow-orchestrator
model: anthropic/claude-3-5-sonnet-20241022
---

Execute a custom workflow by explicitly chaining multiple agents.

Usage Format:
```
/invoke [agent1] -> [agent2] -> [agent3] : [task description]
```

Available Agents:
- master-architect: System architecture and design
- frontend-engineer: React/Next.js frontend development
- backend-architect: API and backend services
- mobile-engineer: iOS/Android mobile development
- database-architect: Database design and optimization
- security-auditor: Security assessment and compliance
- performance-analyst: Performance optimization
- accessibility-engineer: WCAG compliance and a11y
- test-automation-engineer: Testing strategy and automation
- code-reviewer: Code quality and best practices
- deployment-engineer: CI/CD and infrastructure

Workflow Execution:
1. Each agent receives output from previous agent as context
2. Agents automatically consult their collaboration protocols
3. Output is passed sequentially through the chain
4. Final deliverable incorporates all agent recommendations

Example Workflows:
```
# Security-focused API development
/invoke backend-architect -> security-auditor -> code-reviewer : Design payment processing API

# Performance-optimized feature
/invoke frontend-engineer -> performance-analyst -> accessibility-engineer : Build dashboard with real-time charts

# Full-stack with quality gates
/invoke backend-architect -> database-architect -> frontend-engineer -> security-auditor -> test-automation-engineer : User authentication system

# Mobile feature with all checks
/invoke mobile-engineer -> accessibility-engineer -> performance-analyst -> security-auditor : Offline-capable shopping cart
```

The workflow coordinator (Master Architect) will:
- Parse the agent chain
- Execute in specified order
- Pass context between agents
- Aggregate final deliverables
- Ensure collaboration protocols are followed
