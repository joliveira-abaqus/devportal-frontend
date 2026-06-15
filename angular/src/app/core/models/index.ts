export type RequestType = 'bug_fix' | 'feature' | 'migration';

export type RequestStatus = 'pending' | 'in_progress' | 'review' | 'done' | 'failed';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface RequestEvent {
  id: string;
  requestId: string;
  type: 'status_change' | 'comment' | 'pr_linked' | 'file_attached';
  description: string;
  metadata?: Record<string, string>;
  createdAt: string;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  type: RequestType;
  status: RequestStatus;
  userId: string;
  attachmentUrl?: string;
  attachmentName?: string;
  prUrl?: string;
  events: RequestEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestPayload {
  title: string;
  description: string;
  type: RequestType;
  file?: File;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
