# API Contract

Base URL: `http://localhost:3001/api`

## GET /health

**Purpose:** Health check

**Response:** `{ "status": "ok" }`

---

## GET /tickets

**Purpose:** List tickets with optional search and status filter

**Query params:**
- `search` (optional): keyword for title/description
- `status` (optional): OPEN | IN_PROGRESS | RESOLVED | CLOSED | CANCELLED

**Response:** `Ticket[]`

---

## POST /tickets

**Purpose:** Create a new ticket

**Request:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "priority": "LOW | MEDIUM | HIGH (required)",
  "createdById": "string (required)",
  "assignedToId": "string | null (optional)"
}
```

**Response:** `201` — Ticket with relations

**Validation Rules:**
- title, description, priority, createdById required
- createdById and assignedToId must reference existing users

**Error Responses:**
- `400` — Validation failed or user not found

---

## GET /tickets/:id

**Purpose:** Get ticket detail with comments

**Response:** `Ticket` with comments array

**Error Responses:**
- `404` — Ticket not found

---

## PATCH /tickets/:id

**Purpose:** Update ticket fields

**Request:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "priority": "LOW | MEDIUM | HIGH (optional)",
  "assignedToId": "string | null (optional)"
}
```

**Response:** Updated Ticket

**Error Responses:**
- `400` — Validation failed or assignee not found
- `404` — Ticket not found

---

## PATCH /tickets/:id/status

**Purpose:** Change ticket status (state machine enforced)

**Request:**
```json
{
  "status": "OPEN | IN_PROGRESS | RESOLVED | CLOSED | CANCELLED"
}
```

**Response:** Updated Ticket

**Error Responses:**
- `404` — Ticket not found
- `409` — Invalid status transition

---

## POST /tickets/:id/comments

**Purpose:** Add comment to ticket

**Request:**
```json
{
  "message": "string (required)",
  "createdById": "string (required)"
}
```

**Response:** `201` — Comment with author

**Error Responses:**
- `400` — Validation failed or author not found
- `404` — Ticket not found

---

## GET /users

**Purpose:** List seeded users (for pickers)

**Response:** `User[]` (id, name, email, role)
