import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateRequestPayload, Request, RequestStatus, RequestType } from '../models';

interface GetRequestsOptions {
  status?: RequestStatus;
  type?: RequestType;
}

@Injectable({ providedIn: 'root' })
export class RequestsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/requests`;

  getRequests(options?: GetRequestsOptions): Observable<Request[]> {
    let params = new HttpParams();
    if (options?.status) {
      params = params.set('status', options.status);
    }
    if (options?.type) {
      params = params.set('type', options.type);
    }

    return this.http
      .get<Request[] | { data: Request[] }>(this.baseUrl, { params, withCredentials: true })
      .pipe(map((body) => (Array.isArray(body) ? body : body.data ?? [])));
  }

  getRequestById(id: string): Observable<Request> {
    return this.http
      .get<Request | { data: Request }>(`${this.baseUrl}/${id}`, { withCredentials: true })
      .pipe(map((body) => ('data' in body && body.data ? body.data : (body as Request))));
  }

  createRequest(payload: CreateRequestPayload): Observable<Request> {
    if (payload.file) {
      const formData = new FormData();
      formData.append('title', payload.title);
      formData.append('description', payload.description);
      formData.append('type', payload.type);
      formData.append('file', payload.file);
      return this.http
        .post<Request | { data: Request }>(this.baseUrl, formData, { withCredentials: true })
        .pipe(map((body) => ('data' in body && body.data ? body.data : (body as Request))));
    }

    return this.http
      .post<Request | { data: Request }>(
        this.baseUrl,
        { title: payload.title, description: payload.description, type: payload.type },
        { withCredentials: true },
      )
      .pipe(map((body) => ('data' in body && body.data ? body.data : (body as Request))));
  }
}
