import type { Status } from '../lib/db.js';
import { getAllowedTransitions } from './stateMachine.js';

export const STATUS_LABELS: Record<Status, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  CANCELLED: 'Cancelled',
};

export const STATE_MACHINE_OVERVIEW = `Ticket status flow:
- Open → In Progress or Cancelled
- In Progress → Resolved or Cancelled
- Resolved → Closed
- Closed and Cancelled are terminal (no further changes)`;

export function formatStatus(status: Status): string {
  return STATUS_LABELS[status];
}

export function formatAllowedTransitions(status: Status): string {
  const allowed = getAllowedTransitions(status);

  if (allowed.length === 0) {
    return `${formatStatus(status)} is a terminal status. No further transitions are available.`;
  }

  const labels = allowed.map((s) => formatStatus(s)).join(' or ');
  return `From ${formatStatus(status)}, you can move to: ${labels}.`;
}

export const CREATE_TICKET_HELP = `To create a ticket:
1. Click "New Ticket" in the header
2. Fill in title and description (required)
3. Select priority (Low, Medium, or High)
4. Choose who created the ticket (required)
5. Optionally assign the ticket to a user
6. Click Create — you'll be taken to the ticket detail page`;

export const SEARCH_FILTER_HELP = `To find tickets on the list page:
- Use the search box to filter by keywords in title or description (updates after a short delay)
- Use the status dropdown to filter by Open, In Progress, Resolved, Closed, or Cancelled
- Clear search or set status to "All" to see every ticket`;

export const COMMENT_HELP = `To add a comment on a ticket detail page:
1. Scroll to the Comments section on the right
2. Select your name from the author dropdown
3. Type your message and click Add Comment
Comments appear in chronological order below the form`;

export const DETAIL_PAGE_HELP = `On the ticket detail page you can:
- Edit title, description, priority, and assignee in the left panel
- Change status using the transition buttons (only valid next states are shown)
- Add comments in the Comments section on the right`;

export const FALLBACK_HELP = `I can help you with:
- Creating tickets
- Searching and filtering the ticket list
- Understanding status transitions and the ticket lifecycle
- Adding comments
- Explaining errors when a status change fails

Try asking: "How do I create a ticket?" or "What status can I change to?"`;

export function getWelcomeMessage(route?: string): string {
  if (route?.includes('/tickets/new')) {
    return 'Need help creating a ticket? I can explain the required fields and how submission works.';
  }

  if (route?.match(/\/tickets\/[^/]+$/)) {
    return 'I can help with status transitions, editing this ticket, or adding comments.';
  }

  return 'Hi! I can guide you through creating tickets, search/filter, status changes, and comments.';
}

export function getDefaultSuggestions(route?: string, ticketStatus?: Status): string[] {
  if (route?.includes('/tickets/new')) {
    return ['What fields are required?', 'How do priorities work?', 'How do I assign a ticket?'];
  }

  if (route?.match(/\/tickets\/[^/]+$/)) {
    if (ticketStatus) {
      return [
        'What can I do next?',
        'How do I add a comment?',
        'Explain the status flow',
      ];
    }

    return ['How do I change status?', 'How do I add a comment?', 'Explain the status flow'];
  }

  return ['How do I create a ticket?', 'How do I search tickets?', 'Explain the status flow'];
}
