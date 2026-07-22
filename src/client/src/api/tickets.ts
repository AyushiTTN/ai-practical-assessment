import type { ApiError, Comment, Priority, Status, Ticket, User } from '../types';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({ error: 'Request failed' }))) as ApiError;
    const err = new Error(body.error || 'Request failed') as Error & { details?: ApiError['details']; status: number };
    err.details = body.details;
    err.status = res.status;
    throw err;
  }

  return res.json() as Promise<T>;
}

export function getTickets(params?: { search?: string; status?: Status }): Promise<Ticket[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.status) query.set('status', params.status);
  const qs = query.toString();
  return request<Ticket[]>(`/api/tickets${qs ? `?${qs}` : ''}`);
}

export function getTicket(id: string): Promise<Ticket> {
  return request<Ticket>(`/api/tickets/${id}`);
}

export function createTicket(data: {
  title: string;
  description: string;
  priority: Priority;
  createdById: string;
  assignedToId?: string | null;
}): Promise<Ticket> {
  return request<Ticket>('/api/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTicket(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    priority: Priority;
    assignedToId: string | null;
  }>
): Promise<Ticket> {
  return request<Ticket>(`/api/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function updateTicketStatus(id: string, status: Status): Promise<Ticket> {
  return request<Ticket>(`/api/tickets/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function addComment(
  ticketId: string,
  data: { message: string; createdById: string }
): Promise<Comment> {
  return request<Comment>(`/api/tickets/${ticketId}/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getUsers(): Promise<User[]> {
  return request<User[]>('/api/users');
}
