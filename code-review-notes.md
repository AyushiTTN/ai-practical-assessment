# Code Review Notes

## AI-Assisted Review Summary

Cursor reviewed the codebase for:
- State machine consistency between frontend and backend
- Secret leakage
- Hardcoded user IDs
- Error handling patterns
- SQL injection risks (prepared statements used throughout)

## My Review Observations

1. **State machine:** Backend `services/stateMachine.ts` and frontend `utils/status.ts` have identical transition maps. Acceptable for Core — documented in cursor-rules to keep in sync.
2. **SQL safety:** All queries use better-sqlite3 prepared statements with parameterized values.
3. **Error handling:** Consistent pattern across all routes via central middleware.
4. **No secrets:** Only `.env.example` committed; `dev.db` and `.env` in `.gitignore`.
5. **Validation:** Zod schemas cover all request bodies and query params.

## Changes Made After Review

- Added `cursor-rules-or-instructions.md` noting frontend/backend transition map sync requirement
- Verified `.gitignore` includes `*.db` and `.env`

## Suggestions Rejected (and why)

- **Runtime sync check between frontend/backend transition maps:** Over-engineering for Core; documented rule is sufficient.
- **Add unit tests for stateMachine.ts in isolation:** Integration tests already cover this through the API; Core only requires one test tier.
