# AI Agent Guide

This guide provides detailed instructions for AI agents working with the OpenCode system.

## Agent Responsibilities

### Core Principles
1. **Specialization**: Each agent has deep domain expertise
2. **Context Awareness**: Understand the broader codebase and project context
3. **Best Practices**: Follow industry standards and project conventions
4. **Collaboration**: Coordinate with other agents when cross-domain expertise is needed

### Agent Categories

#### Architecture Agents
- **Backend Architect**: API design, system scalability, database integration
- **Database Architect**: Schema design, query optimization, data modeling
- **System Architect**: Overall system design, technology choices, integration patterns

#### Content Agents
- **Content Editor**: Technical writing clarity, documentation structure
- **Documentation Specialist**: API docs, user guides, technical specifications

#### Engineering Agents
- **Frontend Engineer**: React, TypeScript, CSS, state management, UI/UX
- **Mobile Engineer**: React Native, Swift, Kotlin, mobile-specific patterns

#### Operations Agents
- **Deployment Engineer**: CI/CD, Docker, cloud deployment, infrastructure
- **Performance Analyst**: Optimization, profiling, bottleneck identification
- **Security Auditor**: Vulnerability assessment, security best practices

#### Orchestration Agents
- **Workflow Orchestrator**: Build processes, release management, coordination

#### Quality Agents
- **Accessibility Engineer**: A11y compliance, screen readers, inclusive design
- **Code Reviewer**: Code quality, maintainability, best practices
- **Test Automation Engineer**: Test strategy, coverage, automation frameworks

## Command Execution Guidelines

### Before Starting
1. **Read the command file** to understand specific requirements
2. **Examine the codebase** to understand existing patterns and conventions
3. **Identify dependencies** and related files that may be affected
4. **Check for existing tests** and documentation

### During Execution
1. **Follow the command specification** exactly as defined
2. **Use appropriate tools** for file operations, searching, and analysis
3. **Provide context** for all changes and recommendations
4. **Consider edge cases** and error scenarios

### After Completion
1. **Verify changes** don't break existing functionality
2. **Update related files** as necessary (tests, docs, configs)
3. **Run linting/type checking** if available
4. **Document any assumptions** or limitations

## File Structure Conventions

### Command Files
Commands are defined in markdown files with YAML frontmatter:
```yaml
---
description: Brief description of the command
agent: primary-agent-type
model: model-to-use
---
```

### Agent Files
Agent definitions include:
- Role and responsibilities
- Key skills and expertise areas
- Common tasks and workflows
- Collaboration guidelines

## Best Practices

### Code Analysis
- Always consider the broader context and impact
- Look for patterns and consistency across the codebase
- Identify potential security or performance issues
- Suggest improvements that align with project goals

### Communication
- Be concise but thorough in explanations
- Use code examples to illustrate points
- Reference specific files and line numbers when relevant
- Ask clarifying questions when requirements are ambiguous

### Quality Standards
- Follow existing code style and conventions
- Ensure accessibility and security considerations
- Write maintainable, well-documented code
- Consider testing and validation requirements

## Cross-Domain Collaboration

When a task requires expertise from multiple domains:

1. **Primary Agent**: Takes lead responsibility for the task
2. **Secondary Agents**: Consulted for specific domain expertise
3. **Integration**: Combine insights from all relevant specialists
4. **Coordination**: Ensure recommendations are compatible and comprehensive

Example: A new feature might require:
- Frontend Engineer for UI implementation
- Backend Architect for API design
- Security Auditor for vulnerability assessment
- Test Automation Engineer for test strategy

## Tool Usage Guidelines

### File Operations
- Use `Read` before `Edit` to understand existing content
- Use `Glob` and `Grep` for searching and pattern matching
- Use `List` to explore directory structures

### Analysis
- Examine multiple related files in parallel when possible
- Look for configuration files, tests, and documentation
- Consider the build system and dependency management

### Documentation
- Update relevant documentation when making changes
- Add comments when code logic is complex
- Create or update tests for new functionality

## Error Handling

When encountering issues:
1. **Identify the root cause** of the problem
2. **Propose specific solutions** with code examples
3. **Consider alternative approaches** if the primary solution isn't feasible
4. **Document the issue** and resolution for future reference

## Continuous Improvement

Agents should:
- Learn from each interaction and codebase
- Adapt to project-specific conventions and patterns
- Provide feedback on improving the OpenCode system
- Stay updated on best practices and new technologies