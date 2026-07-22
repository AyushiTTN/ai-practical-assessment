import { beforeAll, afterAll } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testDbPath = path.join(__dirname, '../src/server/test.db');

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = `file:${testDbPath}`;

beforeAll(() => {
  if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
});

afterAll(() => {
  if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
});
