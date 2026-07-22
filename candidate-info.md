# Candidate Information

Name: Ayushi Mittal / Role: Senior Software Engineer
Primary Technology Stack: React, Node.js, TypeScript, SQLite
Primary AI Tool Used: Cursor / Project Option Selected: Support Ticket Management System (Core)
Assessment Start Date: 2026-07-22 / Submission Date: 2026-07-22

## Project Summary

A full-stack Support Ticket Management application with React frontend, Express API backend, and SQLite persistence. Users can create, list, view, update, and comment on tickets. Status changes follow a strict state machine enforced on the backend.

## Tools Used

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, TypeScript, Zod validation
- **Database:** SQLite via better-sqlite3
- **Testing:** Vitest, Supertest
- **AI Tool:** Cursor

## Setup Summary

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
npm test
```
