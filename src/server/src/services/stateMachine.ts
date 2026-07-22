import type { Status } from '../lib/db.js';

const VALID_TRANSITIONS: Record<Status, Status[]> = {
  OPEN: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['RESOLVED', 'CANCELLED'],
  RESOLVED: ['CLOSED'],
  CLOSED: [],
  CANCELLED: [],
};

export function canTransition(from: Status, to: Status): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

export function getAllowedTransitions(from: Status): Status[] {
  return [...VALID_TRANSITIONS[from]];
}
