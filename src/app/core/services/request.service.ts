import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Request, RequestStatus, RequestType, CreateRequestPayload } from '../models';

interface RequestListResponse {
  data?: Request[];
}

interface RequestDetailResponse {
  data?: Request;
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private api: ApiService) {}

  getRequests(filters?: { status?: RequestStatus; type?: RequestType }): Observable<Request[]> {
    const params: Record<string, string> = {};
    if (filters?.status) params['status'] = filters.status;
    if (filters?.type) params['type'] = filters.type;

    return this.api.get<RequestListResponse | Request[]>('/requests', params).pipe(
      map((response) => {
        if (Array.isArray(response)) return response;
        return response.data ?? [];
      })
    );
  }

  getRequest(id: string): Observable<Request> {
    return this.api.get<RequestDetailResponse | Request>(`/requests/${id}`).pipe(
      map((response) => {
        if ('data' in response && response.data) return response.data;
        return response as Request;
      })
    );
  }

  createRequest(payload: CreateRequestPayload): Observable<Request> {
    if (payload.file) {
      const formData = new FormData();
      formData.append('title', payload.title);
      formData.append('description', payload.description);
      formData.append('type', payload.type);
      formData.append('file', payload.file);
      return this.api.postFormData<RequestDetailResponse | Request>('/requests', formData).pipe(
        map((response) => {
          if ('data' in response && response.data) return response.data;
          return response as Request;
        })
      );
    }

    return this.api
      .post<RequestDetailResponse | Request>('/requests', {
        title: payload.title,
        description: payload.description,
        type: payload.type,
      })
      .pipe(
        map((response) => {
          if ('data' in response && response.data) return response.data;
          return response as Request;
        })
      );
  }
}
