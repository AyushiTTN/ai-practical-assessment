import { getDb, generateId, type CommentRow, type Priority, type Status, type TicketRow, type TicketWithRelations, type UserSummary } from '../lib/db.js';

const userSelect = 'id, name, email, role';

function mapTicket(row: TicketRow): TicketWithRelations {
  const db = getDb();
  const createdBy = db.prepare(`SELECT ${userSelect} FROM User WHERE id = ?`).get(row.createdById) as UserSummary;
  const assignedTo = row.assignedToId
    ? (db.prepare(`SELECT ${userSelect} FROM User WHERE id = ?`).get(row.assignedToId) as UserSummary)
    : null;
  return { ...row, createdBy, assignedTo };
}

function mapTicketWithComments(row: TicketRow): TicketWithRelations {
  const db = getDb();
  const ticket = mapTicket(row);
  const comments = db
    .prepare('SELECT * FROM Comment WHERE ticketId = ? ORDER BY createdAt ASC')
    .all(row.id) as CommentRow[];

  ticket.comments = comments.map((c) => ({
    ...c,
    createdBy: db.prepare(`SELECT ${userSelect} FROM User WHERE id = ?`).get(c.createdById) as UserSummary,
  }));
  return ticket;
}

export function findAllTickets(filters?: { search?: string; status?: Status }): TicketWithRelations[] {
  const db = getDb();
  let sql = 'SELECT * FROM Ticket WHERE 1=1';
  const params: string[] = [];

  if (filters?.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }
  if (filters?.search) {
    sql += ' AND (title LIKE ? OR description LIKE ?)';
    const term = `%${filters.search}%`;
    params.push(term, term);
  }
  sql += ' ORDER BY updatedAt DESC';

  const rows = db.prepare(sql).all(...params) as TicketRow[];
  return rows.map(mapTicket);
}

export function findTicketById(id: string): TicketWithRelations | undefined {
  const db = getDb();
  const row = db.prepare('SELECT * FROM Ticket WHERE id = ?').get(id) as TicketRow | undefined;
  return row ? mapTicketWithComments(row) : undefined;
}

export function createTicket(data: {
  title: string;
  description: string;
  priority: Priority;
  createdById: string;
  assignedToId?: string | null;
}): TicketWithRelations {
  const db = getDb();
  const id = generateId();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO Ticket (id, title, description, priority, status, assignedToId, createdById, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, 'OPEN', ?, ?, ?, ?)`
  ).run(id, data.title, data.description, data.priority, data.assignedToId ?? null, data.createdById, now, now);
  return findTicketById(id)!;
}

export function updateTicket(
  id: string,
  data: Partial<{ title: string; description: string; priority: Priority; assignedToId: string | null }>
): TicketWithRelations | undefined {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM Ticket WHERE id = ?').get(id) as TicketRow | undefined;
  if (!existing) return undefined;

  const updated = {
    title: data.title ?? existing.title,
    description: data.description ?? existing.description,
    priority: data.priority ?? existing.priority,
    assignedToId: data.assignedToId !== undefined ? data.assignedToId : existing.assignedToId,
    updatedAt: new Date().toISOString(),
  };

  db.prepare(
    'UPDATE Ticket SET title = ?, description = ?, priority = ?, assignedToId = ?, updatedAt = ? WHERE id = ?'
  ).run(updated.title, updated.description, updated.priority, updated.assignedToId, updated.updatedAt, id);

  return findTicketById(id);
}

export function updateTicketStatus(id: string, status: Status): TicketWithRelations | undefined {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM Ticket WHERE id = ?').get(id) as TicketRow | undefined;
  if (!existing) return undefined;

  const updatedAt = new Date().toISOString();
  db.prepare('UPDATE Ticket SET status = ?, updatedAt = ? WHERE id = ?').run(status, updatedAt, id);
  return findTicketById(id);
}

export function createComment(data: {
  ticketId: string;
  message: string;
  createdById: string;
}): CommentRow & { createdBy: UserSummary } {
  const db = getDb();
  const id = generateId();
  const now = new Date().toISOString();
  db.prepare('INSERT INTO Comment (id, ticketId, message, createdById, createdAt) VALUES (?, ?, ?, ?, ?)').run(
    id, data.ticketId, data.message, data.createdById, now
  );
  const comment = db.prepare('SELECT * FROM Comment WHERE id = ?').get(id) as CommentRow;
  const createdBy = db.prepare(`SELECT ${userSelect} FROM User WHERE id = ?`).get(data.createdById) as UserSummary;
  return { ...comment, createdBy };
}

export function deleteAllTickets(): void {
  const db = getDb();
  db.prepare('DELETE FROM Comment').run();
  db.prepare('DELETE FROM Ticket').run();
}
