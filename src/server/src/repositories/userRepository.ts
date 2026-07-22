import { getDb, generateId, type UserRow, type UserSummary } from '../lib/db.js';

export function getAllUsers(): UserSummary[] {
  const db = getDb();
  return db.prepare('SELECT id, name, email, role FROM User ORDER BY name ASC').all() as UserSummary[];
}

export function findUserById(id: string): UserRow | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM User WHERE id = ?').get(id) as UserRow | undefined;
}

export function createUser(data: { name: string; email: string; role: 'AGENT' | 'ADMIN' }): UserRow {
  const db = getDb();
  const id = generateId();
  db.prepare('INSERT INTO User (id, name, email, role) VALUES (?, ?, ?, ?)').run(
    id, data.name, data.email, data.role
  );
  return findUserById(id)!;
}

export function deleteAllUsers(): void {
  const db = getDb();
  db.prepare('DELETE FROM Comment').run();
  db.prepare('DELETE FROM Ticket').run();
  db.prepare('DELETE FROM User').run();
}
