import type { Status } from '../lib/db.js';
import type { ChatRequest } from '../validators/chatSchemas.js';
import {
  COMMENT_HELP,
  CREATE_TICKET_HELP,
  DETAIL_PAGE_HELP,
  FALLBACK_HELP,
  SEARCH_FILTER_HELP,
  STATE_MACHINE_OVERVIEW,
  formatAllowedTransitions,
  formatStatus,
  getDefaultSuggestions,
} from './helpKnowledge.js';

export interface ChatResponse {
  reply: string;
  suggestions: string[];
}

type ChatContext = NonNullable<ChatRequest['context']>;

function matchesIntent(message: string, keywords: string[]): boolean {
  const normalized = message.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
}

function isStatusIntent(message: string): boolean {
  return matchesIntent(message, [
    'status',
    'transition',
    'next step',
    'what can i do',
    'what can i change',
    'move to',
    'change to',
  ]);
}

function isCreateIntent(message: string): boolean {
  return matchesIntent(message, ['create', 'new ticket', 'submit ticket', 'required field']);
}

function isSearchIntent(message: string): boolean {
  return matchesIntent(message, ['search', 'filter', 'find ticket', 'keyword']);
}

function isCommentIntent(message: string): boolean {
  return matchesIntent(message, ['comment', 'reply', 'message on ticket']);
}

function isFlowIntent(message: string): boolean {
  return matchesIntent(message, [
    'status flow',
    'lifecycle',
    'state machine',
    'workflow',
    'how does status work',
  ]);
}

function isErrorIntent(message: string, context?: ChatContext): boolean {
  if (context?.lastError) {
    return true;
  }

  return matchesIntent(message, [
    'error',
    'failed',
    'why did',
    'invalid transition',
    "can't change",
    'cannot change',
    'not allowed',
  ]);
}

function buildErrorReply(context?: ChatContext): ChatResponse {
  const lastError = context?.lastError ?? '';
  const status = context?.ticketStatus;

  if (lastError.includes('Invalid status transition') && status) {
    return {
      reply: `${lastError}\n\n${formatAllowedTransitions(status)}\n\n${STATE_MACHINE_OVERVIEW}`,
      suggestions: ['What can I do next?', 'Explain the status flow'],
    };
  }

  if (lastError) {
    return {
      reply: `The app reported: "${lastError}".\n\nIf this was a status change, only valid next states are allowed. Terminal statuses (Closed, Cancelled) cannot be changed.`,
      suggestions: ['Explain the status flow', 'What can I do next?'],
    };
  }

  return {
    reply:
      'Status changes can fail when you try to skip a step or change a ticket that is already Closed or Cancelled. Use the transition buttons — they only show valid options.',
    suggestions: ['Explain the status flow', 'What can I do next?'],
  };
}

function buildStatusReply(context?: ChatContext): ChatResponse {
  const status = context?.ticketStatus;

  if (status) {
    return {
      reply: `${formatAllowedTransitions(status)}\n\n${STATE_MACHINE_OVERVIEW}`,
      suggestions: getDefaultSuggestions(context?.route, status),
    };
  }

  return {
    reply: STATE_MACHINE_OVERVIEW,
    suggestions: ['How do I create a ticket?', 'How do I search tickets?'],
  };
}

function buildRouteAwareReply(context?: ChatContext): ChatResponse | null {
  const route = context?.route;

  if (route?.includes('/tickets/new')) {
    return {
      reply: CREATE_TICKET_HELP,
      suggestions: ['What fields are required?', 'Explain the status flow'],
    };
  }

  if (route?.match(/\/tickets\/[^/]+$/)) {
    const statusLine = context?.ticketStatus
      ? `Current ticket status: ${formatStatus(context.ticketStatus)}.\n\n`
      : '';

    return {
      reply: `${statusLine}${DETAIL_PAGE_HELP}`,
      suggestions: getDefaultSuggestions(route, context?.ticketStatus),
    };
  }

  return null;
}

export function generateChatReply(message: string, context?: ChatContext): ChatResponse {
  const trimmed = message.trim();

  if (isErrorIntent(trimmed, context)) {
    return buildErrorReply(context);
  }

  if (isStatusIntent(trimmed)) {
    return buildStatusReply(context);
  }

  if (isCreateIntent(trimmed)) {
    return {
      reply: CREATE_TICKET_HELP,
      suggestions: ['What fields are required?', 'Explain the status flow'],
    };
  }

  if (isSearchIntent(trimmed)) {
    return {
      reply: SEARCH_FILTER_HELP,
      suggestions: ['How do I create a ticket?', 'Explain the status flow'],
    };
  }

  if (isCommentIntent(trimmed)) {
    return {
      reply: COMMENT_HELP,
      suggestions: ['How do I change status?', 'Explain the status flow'],
    };
  }

  if (isFlowIntent(trimmed)) {
    return buildStatusReply(context);
  }

  if (matchesIntent(trimmed, ['help', 'guide', 'how do i', 'how to', 'what is this page'])) {
    const routeReply = buildRouteAwareReply(context);
    if (routeReply) {
      return routeReply;
    }
  }

  const routeReply = buildRouteAwareReply(context);
  if (routeReply && matchesIntent(trimmed, ['this page', 'here', 'current page'])) {
    return routeReply;
  }

  return {
    reply: FALLBACK_HELP,
    suggestions: getDefaultSuggestions(context?.route, context?.ticketStatus),
  };
}
