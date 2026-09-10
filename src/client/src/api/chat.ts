import type { Status } from '../types';

export interface ChatContextPayload {
  route?: string;
  ticketId?: string;
  ticketStatus?: Status;
  lastError?: string | null;
}

export interface ChatResponse {
  reply: string;
  suggestions: string[];
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({ error: 'Request failed' }))) as { error?: string };
    throw new Error(body.error || 'Request failed');
  }

  return res.json() as Promise<T>;
}

export function sendChatMessage(
  message: string,
  context?: ChatContextPayload
): Promise<ChatResponse> {
  return request<ChatResponse>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  });
}

export function getChatWelcome(context?: ChatContextPayload): Promise<ChatResponse> {
  const query = new URLSearchParams();
  if (context?.route) query.set('route', context.route);
  if (context?.ticketStatus) query.set('ticketStatus', context.ticketStatus);
  const qs = query.toString();

  return request<ChatResponse>(`/api/chat/welcome${qs ? `?${qs}` : ''}`);
}
