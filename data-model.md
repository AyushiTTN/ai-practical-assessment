# Data Model

## Entity Relationship

```mermaid
erDiagram
  User ||--o{ Ticket : creates
  User ||--o{ Ticket : assigned
  User ||--o{ Comment : writes
  Ticket ||--o{ Comment : has

  User {
    string id PK
    string name
    string email UK
    string role
    datetime createdAt
  }

  Ticket {
    string id PK
    string title
    string description
    string priority
    string status
    string assignedToId FK
    string createdById FK
    datetime createdAt
    datetime updatedAt
  }

  Comment {
    string id PK
    string ticketId FK
    string message
    string createdById FK
    datetime createdAt
  }
```

## User (seeded only)

| Field | Type | Constraints |
|-------|------|-------------|
| id | TEXT | PK, UUID |
| name | TEXT | NOT NULL |
| email | TEXT | NOT NULL, UNIQUE |
| role | TEXT | AGENT or ADMIN |
| createdAt | TEXT | ISO datetime |

## Ticket

| Field | Type | Constraints |
|-------|------|-------------|
| id | TEXT | PK, UUID |
| title | TEXT | NOT NULL |
| description | TEXT | NOT NULL |
| priority | TEXT | LOW, MEDIUM, HIGH |
| status | TEXT | OPEN (default), IN_PROGRESS, RESOLVED, CLOSED, CANCELLED |
| assignedToId | TEXT | FK → User, nullable |
| createdById | TEXT | FK → User, NOT NULL |
| createdAt | TEXT | ISO datetime |
| updatedAt | TEXT | ISO datetime |

## Comment

| Field | Type | Constraints |
|-------|------|-------------|
| id | TEXT | PK, UUID |
| ticketId | TEXT | FK → Ticket, CASCADE DELETE |
| message | TEXT | NOT NULL |
| createdById | TEXT | FK → User, NOT NULL |
| createdAt | TEXT | ISO datetime |

## Status State Machine

```
OPEN        → IN_PROGRESS, CANCELLED
IN_PROGRESS → RESOLVED, CANCELLED
RESOLVED    → CLOSED
CLOSED      → (terminal)
CANCELLED   → (terminal)
```
