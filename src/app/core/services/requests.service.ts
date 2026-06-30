import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Request, RequestStatus, RequestType, CreateRequestPayload } from '../models';

@Injectable({ providedIn: 'root' })
export class RequestsService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getRequests(options?: {
    status?: RequestStatus;
    type?: RequestType;
  }): Observable<Request[]> {
    let params = new HttpParams();
    if (options?.status) {
      params = params.set('status', options.status);
    }
    if (options?.type) {
      params = params.set('type', options.type);
    }

    return this.http
      .get<Request[] | { data: Request[] }>(`${this.apiUrl}/requests`, {
        params,
        withCredentials: true,
      })
      .pipe(
        map((body) => {
          if (Array.isArray(body)) return body;
          return body.data ?? [];
        }),
      );
  }

  getRequest(id: string): Observable<Request> {
    return this.http
      .get<Request | { data: Request }>(`${this.apiUrl}/requests/${id}`, {
        withCredentials: true,
      })
      .pipe(
        map((body) => {
          if ('data' in body && body.data) return body.data;
          return body as Request;
        }),
      );
  }

  createRequest(payload: CreateRequestPayload): Observable<Request> {
    return this.http
      .post<Request | { data: Request }>(
        `${this.apiUrl}/requests`,
        {
          title: payload.title,
          description: payload.description,
          type: payload.type,
        },
        { withCredentials: true },
      )
      .pipe(
        map((body) => {
          if ('data' in body && body.data) return body.data;
          return body as Request;
        }),
      );
  }
}
