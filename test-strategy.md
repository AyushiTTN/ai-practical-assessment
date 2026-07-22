# Test Strategy

## Test Scope

Core mandatory test tier: **integration tests proving state machine rules**. Additional validation and error handling tests included.

## Unit Tests

Not in Core scope. State machine logic is covered via integration tests against the HTTP API.

## Component Tests

Not in Core scope. UI verified via manual smoke tests.

## API / Integration Tests

**File:** `tests/integration/stateMachine.test.ts`
**Tooling:** Vitest + Supertest
**Database:** Isolated test.db, reset between tests

### State Machine Matrix

| From | To | Expected |
|------|-----|----------|
| OPEN | IN_PROGRESS | 200 |
| IN_PROGRESS | RESOLVED | 200 |
| RESOLVED | CLOSED | 200 |
| OPEN | CANCELLED | 200 |
| IN_PROGRESS | CANCELLED | 200 |
| OPEN | CLOSED | 409 |
| OPEN | RESOLVED | 409 |
| RESOLVED | IN_PROGRESS | 409 |
| CLOSED | IN_PROGRESS | 409 |
| CANCELLED | OPEN | 409 |

### Additional Tests

- Create ticket without title → 400
- Comment on non-existent ticket → 404

## Edge Case Tests

Covered in integration suite: terminal states (CLOSED, CANCELLED) reject all transitions.

## Tests Not Covered (and why)

- **Frontend component tests:** Out of Core scope; manual smoke tests used
- **E2E browser tests:** No Playwright/Cypress in Core; API integration tests provide confidence
- **Performance/load tests:** Not required for Core
- **Auth tests:** Authentication is Stretch, not implemented

## Manual Smoke Tests

Documented in test-results.md:
1. Create ticket via UI
2. Restart server — data persists
3. Search by keyword
4. Filter by status
5. Invalid status transition shows error in UI
