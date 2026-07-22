# Requirement Analysis

## Selected Project Option

Support Ticket Management System — Core (mandatory features only).

## My Understanding (in your own words)

This is an internal support ticket tool where seeded users create and manage tickets through a defined lifecycle. The hardest Core requirement is the status state machine: tickets move only through valid transitions (Open → In Progress → Resolved → Closed, with Cancelled as a branch). The backend must reject invalid transitions, and the UI must show clear errors. Users are pre-seeded — no login UI is required.

## Functional Requirements

1. Create tickets with title, description, priority, creator, and optional assignee
2. List all tickets from the database
3. View ticket detail including comments
4. Update ticket fields (title, description, priority, assignee)
5. Change status only through valid state machine transitions
6. Add comments to tickets
7. Keyword search across title and description
8. Filter tickets by status
9. Backend validation for required fields and invalid input
10. Meaningful error states in the UI

## Non-Functional Requirements

- Data persists across server restarts (SQLite file storage)
- Setup reproducible from README in under 10 minutes
- No secrets committed to the repository
- Integration tests proving state machine rules

## Assumptions

- Users are selected from a seeded list (no authentication in Core)
- Search is case-insensitive substring match on title and description
- `createdBy` is required on ticket creation; assignee is optional
- Timestamps are stored as ISO strings in SQLite

## Clarifications (questions for a product owner)

- Should cancelled tickets be reopenable? **Assumed no** — terminal state per spec.
- Should search include comment text? **Assumed no** — spec says keyword search on tickets.
- Who can change status? **Assumed any user** — no auth in Core.

## Edge Cases

- Attempting to transition Closed or Cancelled tickets (must be rejected)
- Skipping states (e.g., Open → Resolved directly)
- Creating ticket with non-existent user ID
- Adding comment to deleted/non-existent ticket
- Empty search string returns all tickets
- Unassigned tickets (null assignee)
