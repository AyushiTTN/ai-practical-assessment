# Test Results

## Automated Tests

```
 RUN  v3.2.7

 ✓ ../../tests/integration/stateMachine.test.ts (12 tests) 204ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
```

### Test Breakdown

| # | Test | Result |
|---|------|--------|
| 1 | OPEN → IN_PROGRESS succeeds | PASS |
| 2 | IN_PROGRESS → RESOLVED succeeds | PASS |
| 3 | RESOLVED → CLOSED succeeds | PASS |
| 4 | OPEN → CANCELLED succeeds | PASS |
| 5 | IN_PROGRESS → CANCELLED succeeds | PASS |
| 6 | OPEN → CLOSED is rejected | PASS |
| 7 | OPEN → RESOLVED is rejected | PASS |
| 8 | RESOLVED → IN_PROGRESS is rejected | PASS |
| 9 | CLOSED → IN_PROGRESS is rejected | PASS |
| 10 | CANCELLED → OPEN is rejected | PASS |
| 11 | Create ticket missing title → 400 | PASS |
| 12 | Comment on missing ticket → 404 | PASS |

## Manual Smoke Tests

- [x] Create ticket via UI — works, redirects to detail
- [x] List tickets from database — 5 seeded + new tickets visible
- [x] Ticket detail view — shows fields, comments, status buttons
- [x] Update fields and reassign — saves successfully
- [x] Add comments — appears in list after submit
- [x] Invalid status transition — 409 error shown in UI
- [x] Keyword search — filters by title/description
- [x] Status filter — filters by selected status
- [x] Data survives restart — SQLite file persists
- [x] Backend validation — empty title rejected with 400
