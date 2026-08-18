import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Request, RequestStatus, RequestType, CreateRequestPayload } from '../models';

export interface RequestFilters {
  status?: RequestStatus;
  type?: RequestType;
}

@Injectable({ providedIn: 'root' })
export class RequestsService {
  constructor(private readonly api: ApiService) {}

  getRequests(filters: RequestFilters = {}): Observable<Request[]> {
    const params: Record<string, string> = {};
    if (filters.status) params['status'] = filters.status;
    if (filters.type) params['type'] = filters.type;

    return this.api.get<Request[] | { data: Request[] }>('/requests', params).pipe(
      map((body) => (Array.isArray(body) ? body : (body as { data: Request[] }).data ?? [])),
    );
  }

  getRequest(id: string): Observable<Request> {
    return this.api.get<Request | { data: Request }>(`/requests/${id}`).pipe(
      map((body) => ((body as { data: Request }).data ?? body) as Request),
    );
  }

  createRequest(payload: CreateRequestPayload): Observable<Request> {
    return this.api.post<Request | { data: Request }>('/requests', payload).pipe(
      map((body) => ((body as { data: Request }).data ?? body) as Request),
    );
  }
}
