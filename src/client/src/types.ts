export type Role = 'AGENT' | 'ADMIN';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Status = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Comment {
  id: string;
  ticketId: string;
  message: string;
  createdById: string;
  createdBy: User;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignedToId: string | null;
  assignedTo: User | null;
  createdById: string;
  createdBy: User;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  error: string;
  details?: { field: string; message: string }[];
}
