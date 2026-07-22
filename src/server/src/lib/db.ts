import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(__dirname, '../..');
const projectRoot = path.resolve(serverDir, '../..');

function resolveDbPath(): string {
  const url = process.env.DATABASE_URL || 'file:./dev.db';
  const dbFile = url.replace('file:', '');
  return path.isAbsolute(dbFile) ? dbFile : path.join(serverDir, dbFile);
}

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(resolveDbPath());
    db.pragma('foreign_keys = ON');
    migrate();
  }
  return db;
}

export function migrate(): void {
  const database = db ?? new Database(resolveDbPath());
  const migrationPath = path.join(projectRoot, 'database/schema-or-migrations/001_init.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');
  database.exec(sql);
  if (!db) database.close();
}

export function resetDb(): void {
  const dbPath = resolveDbPath();
  if (db) {
    db.close();
    db = null;
  }
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
  getDb();
}

export function generateId(): string {
  return randomUUID();
}

export type Role = 'AGENT' | 'ADMIN';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Status = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface TicketRow {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignedToId: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentRow {
  id: string;
  ticketId: string;
  message: string;
  createdById: string;
  createdAt: string;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface TicketWithRelations extends TicketRow {
  createdBy: UserSummary;
  assignedTo: UserSummary | null;
  comments?: (CommentRow & { createdBy: UserSummary })[];
}
