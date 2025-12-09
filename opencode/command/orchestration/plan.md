---
description: Comprehensive planning and design without implementation - explore approaches, estimate effort, and create roadmap
agent: workflow-orchestrator
model: anthropic/claude-3-5-sonnet-20241022
---

Plan and design the requested feature or system without implementing - explore options, estimate effort, and create a detailed roadmap.

## Planning Workflow

The Workflow Orchestrator coordinates comprehensive planning:

### Phase 1: Requirement Analysis
- Clarify requirements and constraints
- Identify stakeholders and affected systems
- Define success criteria and acceptance criteria
- Determine scope boundaries
- Identify assumptions and risks

### Phase 2: Architectural Design
- **Master Architect**: System design and architecture
- Evaluate architectural patterns and approaches
- Identify integration points and dependencies
- Consider scalability and performance implications
- Document architectural decisions (ADRs)

### Phase 3: Technical Design
Consult relevant specialists:
- **Backend Architect**: API design, service boundaries, data flow
- **Frontend Engineer**: UI/UX approach, component architecture
- **Mobile Engineer**: Platform strategy, native integrations
- **Database Architect**: Data model, schema design, query patterns
- **Security Auditor**: Security architecture, threat model
- **Performance Analyst**: Performance requirements, bottlenecks
- **Accessibility Engineer**: Accessibility strategy, WCAG compliance

### Phase 4: Implementation Strategy
- Break down into phases and milestones
- Identify technical risks and mitigation strategies
- Define testing approach and quality gates
- Determine deployment strategy
- Plan for monitoring and observability

### Phase 5: Effort Estimation
- Estimate complexity for each component
- Identify dependencies and critical path
- Account for testing, documentation, and deployment
- Consider team capacity and expertise
- Provide timeline estimates

### Phase 6: Alternative Approaches
- Present multiple implementation options
- Compare trade-offs (cost, time, complexity, maintainability)
- Recommend preferred approach with rationale
- Document decisions not to pursue and why

## Deliverables

You will receive a comprehensive plan including:

### 📋 Executive Summary
- High-level overview of the plan
- Recommended approach and rationale
- Key risks and mitigation strategies
- Timeline and effort estimates

### 🏗️ Architecture Design
- System architecture diagrams (mermaid)
- Component descriptions and responsibilities
- Integration points and data flows
- Technology stack recommendations
- Scalability and performance considerations

### 🔧 Technical Specifications

**Backend Design:**
- API endpoints and contracts (OpenAPI spec)
- Service boundaries and responsibilities
- Data models and schemas
- Authentication and authorization approach
- Caching and performance strategies

**Frontend Design:**
- Component hierarchy and architecture
- State management approach
- Routing and navigation structure
- UI/UX patterns and design system usage
- Performance optimization strategy

**Mobile Design** (if applicable):
- Platform approach (React Native/Flutter/Native)
- Offline-first architecture
- Native integration requirements
- Platform-specific considerations

**Database Design:**
- Schema design with relationships
- Indexing strategy
- Query patterns and optimization
- Migration approach
- Scaling strategy

### 🔒 Security Architecture
- Threat model (STRIDE analysis)
- Security controls and mitigations
- Authentication/authorization flows
- Data protection approach
- Compliance requirements

### ⚡ Performance Design
- Performance requirements and SLAs
- Optimization strategies
- Caching architecture (multi-tier)
- Load testing approach
- Monitoring and alerting

### ♿ Accessibility Design
- WCAG compliance level (AA/AAA)
- Keyboard navigation approach
- Screen reader considerations
- Inclusive design patterns

### 🧪 Testing Strategy
- Test pyramid approach (unit/integration/E2E)
- Testing frameworks and tools
- Coverage targets
- Testing environment requirements
- Automated testing in CI/CD

### 📦 Deployment Plan
- Deployment strategy (blue-green/canary/rolling)
- Infrastructure requirements
- CI/CD pipeline design
- Rollback procedures
- Environment configuration

### 📚 Documentation Plan
- User documentation requirements
- API documentation approach
- Developer guides needed
- Onboarding materials

### 📊 Implementation Roadmap

**Phase 1: Foundation** (Week 1-2)
- [ ] Task 1 with owner and dependencies
- [ ] Task 2 with owner and dependencies

**Phase 2: Core Features** (Week 3-4)
- [ ] Task 1 with owner and dependencies
- [ ] Task 2 with owner and dependencies

**Phase 3: Polish & Launch** (Week 5-6)
- [ ] Task 1 with owner and dependencies
- [ ] Task 2 with owner and dependencies

### 💰 Effort Estimation
| Component | Complexity | Estimate | Dependencies |
|-----------|-----------|----------|--------------|
| Backend API | High | 2 weeks | Database schema |
| Frontend UI | Medium | 1.5 weeks | API contracts |
| Testing | Medium | 1 week | Implementation |
| **Total** | | **4.5 weeks** | |

### ⚖️ Trade-off Analysis

**Option A: [Approach]**
- ✅ Pros: [Benefits]
- ❌ Cons: [Drawbacks]
- 💰 Cost: [Effort/resources]
- ⏱️ Timeline: [Duration]

**Option B: [Alternative]**
- ✅ Pros: [Benefits]
- ❌ Cons: [Drawbacks]
- 💰 Cost: [Effort/resources]
- ⏱️ Timeline: [Duration]

**Recommendation:** [Chosen approach with justification]

### 🚨 Risks & Mitigations
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | High | High | [Strategy] |
| [Risk 2] | Medium | High | [Strategy] |

### ✅ Success Criteria
- [ ] Functional requirement 1 met
- [ ] Performance target achieved
- [ ] Security requirements satisfied
- [ ] Accessibility compliance verified
- [ ] User acceptance criteria passed

### 📋 Decision Log (ADRs)
**ADR-001: [Decision Title]**
- Context: [Why this decision is needed]
- Decision: [What was decided]
- Consequences: [Implications of the decision]
- Alternatives Considered: [Other options]

## Planning Depth Options

### Quick Plan (--quick)
- High-level approach only
- Basic component breakdown
- Rough effort estimate
- Suitable for: Spike work, prototypes, simple features

### Standard Plan (default)
- Comprehensive architecture design
- Detailed technical specifications
- Accurate effort estimates
- Suitable for: Most features and projects

### Deep Plan (--deep)
- Extensive research and analysis
- Multiple alternative approaches
- Detailed risk analysis
- Proof-of-concept recommendations
- Suitable for: Complex projects, greenfield systems, critical features

## Usage

```bash
# Standard planning
/plan User authentication system with social login

# Quick planning for simple feature
/plan --quick Add email notifications

# Deep planning for complex system
/plan --deep Multi-tenant SaaS architecture with data isolation

# With specific constraints
/plan Real-time chat system (must handle 10k concurrent users, budget: $5k/month)

# With context
/plan Migrate from REST to GraphQL (we currently have 50+ REST endpoints)
```

## When to Use /plan vs /build

**Use /plan when:**
- Starting a new project or major feature
- Need to explore different approaches
- Want accurate effort estimates
- Making architectural decisions
- Need buy-in from stakeholders
- Unclear on best approach
- High complexity or risk

**Use /build when:**
- Plan is already approved
- Requirements are clear
- Approach is decided
- Ready for implementation
- Simple, straightforward features

## What Happens After Planning

After reviewing the plan, you can:

1. **Proceed to Build**: `/build [feature]` - Uses the plan as foundation
2. **Refine the Plan**: Request adjustments or explore alternatives
3. **Get Estimates**: Use for sprint planning and resource allocation
4. **Make Decisions**: Review trade-offs and choose approach
5. **Secure Buy-in**: Share with stakeholders for approval

## Planning Best Practices

The orchestrator ensures:
- ✅ All relevant specialists consulted
- ✅ Multiple perspectives considered
- ✅ Trade-offs explicitly documented
- ✅ Risks identified early
- ✅ Realistic estimates provided
- ✅ Clear next steps defined
- ✅ Decisions documented for future reference

---

Planning before building saves time, reduces risk, and ensures alignment. A good plan serves as a roadmap, decision log, and communication tool throughout the project lifecycle.
