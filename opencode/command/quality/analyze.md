---
description: Context-aware analysis routing to appropriate specialist
agent: code-reviewer
model: anthropic/claude-3-5-sonnet-20241022
---

Analyze the current file or code and automatically route to the most appropriate specialist.

Automatic Routing Logic:
- `.tsx/.jsx/.js/.ts` React components → Frontend Engineer
- `.tsx/.jsx/.js/.ts` API/server files → Backend Architect
- `.sql` files → Database Architect
- `.yml/.yaml` CI/CD files → Deployment Engineer
- `Dockerfile` or `docker-compose.yml` → Deployment Engineer
- `*.test.*` or `*.spec.*` files → Test Automation Engineer
- Mobile files (`*.swift`, `*.kt`, React Native) → Mobile Engineer
- Security configs or auth files → Security Auditor
- Performance-critical paths → Performance Analyst

Analysis Includes:
- Code quality and best practices
- Architectural patterns and compliance
- Performance implications
- Security vulnerabilities
- Testing coverage and quality
- Documentation completeness
- Potential improvements and refactoring
- Domain-specific recommendations

Deliverables:
- Comprehensive analysis from appropriate specialist
- Identified issues with severity ratings
- Specific improvement recommendations
- Code examples for fixes
- Best practices guidance
- Related files that may need updates

If multiple specialists are relevant, the analysis will include:
1. Primary specialist analysis
2. Secondary specialist consultations as needed
3. Integrated recommendations

This command intelligently determines which expert should analyze your code based on file type, content, and context.
