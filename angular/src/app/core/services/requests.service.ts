import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Request, RequestStatus, RequestType } from '../models';

@Injectable({ providedIn: 'root' })
export class RequestsService {
  private baseUrl = `${environment.apiUrl}/requests`;

  constructor(private http: HttpClient) {}

  getAll(status?: RequestStatus | '', type?: RequestType | ''): Observable<Request[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    if (type) {
      params = params.set('type', type);
    }

    return this.http.get<Request[] | { data: Request[] }>(this.baseUrl, { params }).pipe(
      map((body) => (Array.isArray(body) ? body : body.data ?? [])),
    );
  }

  getById(id: string): Observable<Request> {
    return this.http.get<Request | { data: Request }>(`${this.baseUrl}/${id}`).pipe(
      map((body) => ('data' in body && body.data ? body.data : (body as Request))),
    );
  }

  create(payload: { title: string; description: string; type: RequestType }): Observable<Request> {
    return this.http.post<Request | { data: Request }>(this.baseUrl, payload).pipe(
      map((body) => ('data' in body && body.data ? body.data : (body as Request))),
    );
  }
}
