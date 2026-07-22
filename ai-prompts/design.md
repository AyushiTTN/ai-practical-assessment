# Design Prompts

## Prompt 1: API Contract

**Prompt:** Design REST API endpoints for ticket CRUD, status transitions, comments, and user listing.

**AI Response Summary:** 7 endpoints with request/response shapes, validation rules, error codes.

**Accepted:** Full API contract structure.
**Changed:** Used 409 for invalid transitions instead of 400.
**Rejected:** None.

## Prompt 2: State Machine Design

**Prompt:** How should the ticket status state machine be implemented?

**AI Response Summary:** Pure TypeScript transition map on backend, mirrored on frontend for UX.

**Accepted:** `canTransition(from, to)` pure function pattern.
**Changed:** None.
**Rejected:** xstate library (over-engineering for Core).
