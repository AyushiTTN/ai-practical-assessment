# Code Review Prompts

## Prompt 1: Self-Review Checklist

**Prompt:** Review the Support Ticket codebase for common issues — state machine duplication, secrets, hardcoded IDs.

**AI Response Summary:** Found frontend/backend transition maps must stay in sync; no secrets found; no hardcoded user IDs.

**Accepted:** Added note to cursor-rules about keeping transition maps aligned.
**Changed:** None in code.
**Rejected:** Suggestion to add runtime assertion comparing frontend/backend maps (over-engineering for Core).

## Prompt 2: Error Handling Review

**Prompt:** Is error handling consistent across all API endpoints?

**AI Response Summary:** Central error middleware handles ZodError, AppError, and generic 500. All routes use try/catch with next(err).

**Accepted:** Confirmed pattern is consistent.
**Changed:** None.
**Rejected:** None.
