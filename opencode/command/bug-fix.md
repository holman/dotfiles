---
description: Bug investigation, fix, and validation workflow
agent: code-reviewer
model: anthropic/claude-3-5-sonnet-20241022
---

Investigate, fix, and validate the reported bug with comprehensive testing.

Bug Investigation:
- Reproduce the issue with specific steps
- Analyze root cause through code inspection
- Identify related components and dependencies
- Assess impact and affected users
- Review error logs and stack traces
- Check for similar issues in codebase

Fix Development:
- Design minimal, targeted fix
- Implement solution with proper error handling
- Add defensive programming where needed
- Ensure backward compatibility
- Consider edge cases and boundary conditions
- Document the fix and rationale

Validation:
- Create regression test for the bug
- Verify fix resolves issue without side effects
- Test edge cases and related functionality
- Perform code review of fix
- Check performance impact
- Validate across browsers/platforms if applicable

Deliverables:
- Root cause analysis
- Fix implementation with explanation
- Regression test(s) preventing recurrence
- Impact assessment and risk evaluation
- Deployment recommendations
- Documentation updates if needed

Consult with Test Automation Engineer for comprehensive test coverage.
Escalate to appropriate specialist if fix requires architectural changes.
