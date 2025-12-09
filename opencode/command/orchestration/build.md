---
description: Complete implementation workflow - analyze, design, build, test, and document
agent: workflow-orchestrator
model: anthropic/claude-3-5-sonnet-20241022
---

Build the requested feature or component with full implementation and quality assurance.

## Workflow Execution

The Workflow Orchestrator will coordinate the complete build process:

### Phase 1: Analysis & Design
- Analyze requirements and decompose into tasks
- Consult Master Architect for system design
- Determine technology approach and architecture
- Identify integration points and dependencies
- Establish acceptance criteria

### Phase 2: Implementation
Route to appropriate engineer(s) based on domain:
- **Frontend Engineer**: UI components, client-side logic
- **Backend Architect**: APIs, services, business logic
- **Mobile Engineer**: Mobile app features, native integrations
- **Database Architect**: Schema changes, data models

Implementation includes:
- Production-ready code with proper error handling
- TypeScript/type safety where applicable
- Logging and monitoring integration
- Configuration management
- Performance optimization

### Phase 3: Quality Assurance
Coordinate comprehensive quality checks:
- **Code Reviewer**: Code quality, best practices, refactoring
- **Security Auditor**: Security vulnerabilities, auth/authz review
- **Performance Analyst**: Performance impact, optimization opportunities
- **Accessibility Engineer**: WCAG compliance, inclusive design
- **Test Automation Engineer**: Test strategy and implementation

### Phase 4: Testing
- Unit tests for business logic
- Integration tests for API contracts
- E2E tests for critical user workflows
- Performance tests if applicable
- Accessibility tests for user-facing features

### Phase 5: Documentation
- **Documentation Specialist**: Create user-facing documentation
- API documentation (if applicable)
- Configuration guides
- Deployment instructions
- Usage examples and tutorials

### Phase 6: Deployment Readiness
- **Deployment Engineer**: Review deployment approach
- CI/CD pipeline updates if needed
- Environment configuration
- Rollback strategy
- Monitoring and alerting setup

## Deliverables

You will receive:
- ✅ Complete, tested implementation
- ✅ Comprehensive test suite
- ✅ Security and performance validated
- ✅ Accessibility compliant
- ✅ User documentation
- ✅ Deployment ready

## Quality Gates

All implementations must pass:
- Code review approval
- Security scan (no critical/high vulnerabilities)
- Test coverage targets met
- Performance benchmarks satisfied
- Accessibility compliance verified
- Documentation complete

## Optimization

The orchestrator will:
- Execute independent tasks in parallel
- Minimize redundant work
- Adapt depth based on complexity
- Balance speed with thoroughness
- Provide progress updates throughout

## Usage

```bash
# Simple feature
/build User profile edit form

# Complex feature with context
/build Real-time chat with offline message queueing and push notifications

# Backend service
/build Payment processing API with Stripe integration

# Mobile feature
/build Biometric authentication for iOS and Android

# Full-stack feature
/build Admin dashboard with analytics and user management
```

## When to Use /build vs /plan

**Use /build when:**
- You want immediate implementation
- Requirements are clear
- Ready to commit to the approach

**Use /plan when:**
- You want to explore options first
- Need to estimate effort
- Want to review approach before building
- Discussing architectural decisions

---

The Workflow Orchestrator ensures efficient coordination, appropriate quality gates, and complete delivery. All work is production-ready and follows best practices.
