# Acceptance Criteria

## Core

- [x] A user can create a ticket via the UI
- [x] A user can view all tickets from the database
- [x] A user can open a ticket detail view
- [x] A user can update ticket fields and reassign
- [x] A user can add comments
- [x] Status changes only through valid transitions; invalid ones are rejected
- [x] Keyword search and status filter work
- [x] Data remains available after restart
- [x] Backend validation prevents invalid records
- [x] No secrets committed to the repo
- [x] State-machine integration tests pass

## Validation

- [x] Required fields (title, description, priority, createdBy) enforced on create
- [x] Invalid enum values rejected with 400
- [x] Non-existent user IDs rejected with 400

## Error Handling

- [x] Invalid status transitions return 409 with clear message
- [x] Not found resources return 404
- [x] UI displays API error messages to the user
- [x] Validation errors show field-level details

## Testing

- [x] 10 state machine transition tests (5 valid, 5 invalid)
- [x] Create ticket validation test
- [x] Comment on missing ticket test

## Documentation

- [x] README with setup instructions
- [x] Database migration and seed scripts
- [x] API contract documented
- [x] Full prompt history in ai-prompts/
- [x] Reflection and PR description
