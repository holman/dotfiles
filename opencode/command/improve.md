---
description: Context-aware improvement suggestions with specialist input
agent: code-reviewer
model: anthropic/claude-3-5-sonnet-20241022
---

Analyze current code and provide comprehensive improvement recommendations.

Analysis Process:
1. Code Reviewer performs initial assessment
2. Routes to appropriate specialist based on context
3. Aggregates improvement recommendations
4. Prioritizes by impact and effort

Improvement Categories:
- **Code Quality**: SOLID principles, design patterns, readability
- **Performance**: Optimization opportunities, efficiency gains
- **Security**: Vulnerability fixes, security hardening
- **Accessibility**: WCAG compliance, inclusive design
- **Testing**: Coverage gaps, test quality improvements
- **Architecture**: Structural improvements, better patterns
- **Documentation**: Missing or unclear documentation
- **Maintainability**: Complexity reduction, refactoring needs

Specialist Consultation:
- Frontend Engineer: Component design, React patterns
- Backend Architect: API design, service architecture
- Database Architect: Query optimization, schema improvements
- Security Auditor: Security vulnerabilities and hardening
- Performance Analyst: Performance bottlenecks and optimization
- Accessibility Engineer: A11y compliance and improvements
- Test Automation Engineer: Test strategy and coverage

Deliverables:
- Current state assessment
- Prioritized improvement recommendations
- Before/after code examples
- Implementation guidance
- Estimated effort and impact
- Risk assessment for changes
- Testing requirements
- Migration strategy if needed

Output Format:
- Quick wins (low effort, high impact)
- Important improvements (medium effort, high impact)
- Long-term enhancements (high effort, high impact)
- Nice-to-have polish (low impact improvements)

Focus on actionable, practical improvements that balance quality with pragmatism.
