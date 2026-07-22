# Cursor Rules / Instructions

## Code Style

- TypeScript strict mode
- ESM imports with `.js` extensions in server code
- Repository pattern for database access
- Zod for all request validation

## Architecture Rules

1. State machine logic lives in `services/stateMachine.ts` — single source of truth
2. Routes are thin: validate → call repository → respond
3. Frontend status buttons use `getAllowedTransitions()` — must match backend rules
4. No business logic in React components beyond UI state

## Do Not

- Add authentication (Stretch only)
- Put state machine rules only in frontend
- Commit `.env`, `*.db`, or secrets
- Expand scope beyond Core features

## Testing Rules

- Integration tests run against isolated test.db
- Every valid and invalid state transition must have a test
- Run `npm test` before marking backend phase complete

## AI Usage Rules

- Log significant prompts in `ai-prompts/` by lifecycle phase
- Review AI-generated code before accepting — especially SQL and state machine
- Update api-contract.md if endpoints change
