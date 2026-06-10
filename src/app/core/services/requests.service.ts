import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Request } from '../../models';

interface RequestListResponse {
  data?: Request[];
}

interface RequestResponse {
  data?: Request;
}

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  constructor(private api: ApiService) {}

  getRequests(options?: { status?: string; type?: string }): Observable<Request[]> {
    const params: Record<string, string> = {};
    if (options?.status) params['status'] = options.status;
    if (options?.type) params['type'] = options.type;

    return this.api.get<Request[] | RequestListResponse>('/requests', params).pipe(
      map((response) => {
        if (Array.isArray(response)) return response;
        return (response as RequestListResponse).data ?? [];
      }),
    );
  }

  getRequest(id: string): Observable<Request> {
    return this.api.get<Request | RequestResponse>(`/requests/${id}`).pipe(
      map((response) => {
        if ('data' in response && response.data) return response.data as Request;
        return response as Request;
      }),
    );
  }

  createRequest(data: { title: string; description: string; type: string }): Observable<Request> {
    return this.api.post<Request | RequestResponse>('/requests', data).pipe(
      map((response) => {
        if ('data' in response && response.data) return response.data as Request;
        return response as Request;
      }),
    );
  }
}
