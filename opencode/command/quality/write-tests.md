---
description: Write comprehensive tests for existing code and functionality
agent: test-automation-engineer
model: anthropic/claude-3-5-sonnet-20241022
---

Write comprehensive tests for the specified code, component, or functionality.

Test Writing Process:

## Code Analysis
- Examine the target code structure and functionality
- Identify public interfaces, methods, and edge cases
- Analyze dependencies and integration points
- Review existing test coverage and patterns

## Test Strategy
- Determine appropriate test types (unit, integration, E2E)
- Select testing framework based on project conventions
- Plan test structure and organization
- Identify mocking and stubbing requirements

## Test Implementation

### Unit Tests
- Test individual functions and methods in isolation
- Cover happy paths, edge cases, and error conditions
- Test boundary values and invalid inputs
- Verify state changes and return values
- Use descriptive test names and clear assertions

### Integration Tests
- Test component interactions and data flow
- Verify API endpoints and database operations
- Test external service integrations
- Validate configuration and environment handling

### E2E Tests
- Test complete user workflows and scenarios
- Verify UI interactions and user experience
- Test cross-browser and cross-platform compatibility
- Validate performance under realistic conditions

## Test Quality Standards
- Achieve high code coverage (target: 80%+)
- Write maintainable and readable test code
- Use appropriate test doubles (mocks, stubs, fakes)
- Include setup and teardown procedures
- Add clear documentation and comments

## Test Data Management
- Create realistic and varied test data
- Handle sensitive data appropriately
- Use factories or builders for complex objects
- Manage test database state and cleanup

## Error Handling Tests
- Test exception handling and error scenarios
- Validate error messages and status codes
- Test recovery mechanisms and fallbacks
- Verify logging and monitoring integration

## Performance Tests
- Identify performance-critical paths
- Write benchmarks and load tests
- Test memory usage and resource management
- Validate scalability and concurrency

## Accessibility Tests
- Test screen reader compatibility
- Verify keyboard navigation
- Test color contrast and visual accessibility
- Validate ARIA labels and semantic HTML

## Deliverables
- Complete test suite with comprehensive coverage
- Test configuration and setup files
- Mock and fixture definitions
- Test documentation and usage examples
- CI/CD integration for automated test execution

## Best Practices
- Follow existing project testing conventions
- Write tests before or alongside implementation (TDD)
- Keep tests independent and deterministic
- Regularly refactor and maintain test code
- Use continuous integration for test validation

The resulting test suite ensures code quality, prevents regressions, and provides confidence in system reliability and maintainability.