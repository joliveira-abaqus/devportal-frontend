import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Request, CreateRequestPayload } from '../../shared/models';

interface ApiResponse<T> {
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private api = inject(ApiService);

  getRequests(filters?: { status?: string; type?: string }): Observable<Request[]> {
    const params: Record<string, string> = {};
    if (filters?.status) params['status'] = filters.status;
    if (filters?.type) params['type'] = filters.type;

    return this.api.get<Request[] | ApiResponse<Request[]>>('/requests', params).pipe(
      map((response) => {
        if (Array.isArray(response)) return response;
        return response.data ?? [];
      }),
    );
  }

  getRequest(id: string): Observable<Request> {
    return this.api.get<Request | ApiResponse<Request>>(`/requests/${id}`).pipe(
      map((response) => {
        if ('data' in response && response.data) {
          return response.data as Request;
        }
        return response as Request;
      }),
    );
  }

  createRequest(payload: CreateRequestPayload): Observable<Request> {
    return this.api
      .post<Request | ApiResponse<Request>>('/requests', {
        title: payload.title,
        description: payload.description,
        type: payload.type,
      })
      .pipe(
        map((response) => {
          if ('data' in response && response.data) {
            return response.data as Request;
          }
          return response as Request;
        }),
      );
  }

  uploadAttachment(requestId: string, file: File): Observable<unknown> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.upload(`/requests/${requestId}/attachment`, formData);
  }
}
