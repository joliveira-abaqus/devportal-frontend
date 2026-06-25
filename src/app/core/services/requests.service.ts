import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@env/environment';
import { Request, RequestStatus, RequestType } from '@app/types';

interface ApiResponse<T> {
  data?: T;
}

@Injectable({ providedIn: 'root' })
export class RequestsService {
  constructor(private readonly http: HttpClient) {}

  /** Busca lista de solicitações com filtros opcionais */
  getRequests(filters?: {
    status?: RequestStatus;
    type?: RequestType;
  }): Observable<Request[]> {
    let params = new HttpParams();
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.type) {
      params = params.set('type', filters.type);
    }

    return this.http
      .get<Request[] | ApiResponse<Request[]>>(`${environment.apiUrl}/requests`, { params })
      .pipe(
        map((body) => {
          if (Array.isArray(body)) return body;
          return (body as ApiResponse<Request[]>).data ?? [];
        }),
      );
  }

  /** Busca uma solicitação por ID */
  getRequest(id: string): Observable<Request> {
    return this.http
      .get<Request | ApiResponse<Request>>(`${environment.apiUrl}/requests/${id}`)
      .pipe(
        map((body) => {
          if ('data' in body && body.data) return body.data as Request;
          return body as Request;
        }),
      );
  }

  /** Cria nova solicitação */
  createRequest(payload: {
    title: string;
    description: string;
    type: RequestType;
  }): Observable<Request> {
    return this.http
      .post<Request | ApiResponse<Request>>(`${environment.apiUrl}/requests`, payload)
      .pipe(
        map((body) => {
          if ('data' in body && body.data) return body.data as Request;
          return body as Request;
        }),
      );
  }
}
