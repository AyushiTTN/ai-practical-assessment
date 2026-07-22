# Spec: Support Ticket Management (Core)

## Entities

- **User** (seeded): id, name, email, role (AGENT|ADMIN)
- **Ticket**: id, title, description, priority, status, assignedTo, createdBy, timestamps
- **Comment**: id, ticketId, message, createdBy, createdAt

## Features

1. Create ticket
2. List tickets with search and status filter
3. View ticket detail with comments
4. Update ticket fields and reassign
5. Change status via state machine
6. Add comments

## API Endpoints

See [api-contract.md](../../api-contract.md)

## Acceptance Criteria

See [acceptance-criteria.md](../../acceptance-criteria.md)

## Out of Scope (Stretch)

- Authentication / JWT
- User CRUD
- Pagination, sorting by priority/assignee
- Docker, CI, Swagger
- Unit tests for individual components
