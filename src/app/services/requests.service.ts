import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Request, RequestStatus, RequestType } from '../models';

@Injectable({ providedIn: 'root' })
export class RequestsService {
  private readonly http = inject(HttpClient);

  getRequests(filters?: { status?: RequestStatus; type?: RequestType }): Observable<Request[]> {
    let params = new HttpParams();
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.type) {
      params = params.set('type', filters.type);
    }

    return this.http
      .get<Request[] | { data: Request[] }>(`${environment.apiUrl}/requests`, {
        params,
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          if (Array.isArray(response)) {
            return response;
          }
          return response.data ?? [];
        }),
      );
  }

  getRequest(id: string): Observable<Request> {
    return this.http
      .get<Request | { data: Request }>(`${environment.apiUrl}/requests/${id}`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          if ('data' in response && response.data) {
            return response.data;
          }
          return response as Request;
        }),
      );
  }

  createRequest(payload: {
    title: string;
    description: string;
    type: RequestType;
  }): Observable<Request> {
    return this.http
      .post<Request | { data: Request }>(`${environment.apiUrl}/requests`, payload, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          if ('data' in response && response.data) {
            return response.data;
          }
          return response as Request;
        }),
      );
  }
}
