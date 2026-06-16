import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Request, CreateRequestPayload } from '../models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class RequestsService {
  constructor(private readonly api: ApiService) {}

  getRequests(filters?: Record<string, string>): Observable<Request[]> {
    const query = filters
      ? '?' + new URLSearchParams(filters).toString()
      : '';
    return this.api.get<Request[]>(`/requests${query}`);
  }

  getRequest(id: string): Observable<Request> {
    return this.api.get<Request>(`/requests/${id}`);
  }

  createRequest(payload: CreateRequestPayload): Observable<Request> {
    return this.api.post<Request>('/requests', payload as unknown as Record<string, unknown>);
  }
}
