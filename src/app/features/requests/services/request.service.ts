import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Request, CreateRequestPayload, RequestStatus, RequestType } from '../../../shared/models/request.model';

interface RequestListResponse {
  data?: Request[];
}

interface RequestDetailResponse {
  data?: Request;
}

@Injectable({ providedIn: 'root' })
export class RequestService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRequests(options?: { status?: RequestStatus; type?: RequestType }): Observable<Request[]> {
    let params = new HttpParams();
    if (options?.status) {
      params = params.set('status', options.status);
    }
    if (options?.type) {
      params = params.set('type', options.type);
    }

    return this.http
      .get<Request[] | RequestListResponse>(`${this.apiUrl}/requests`, {
        params,
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          if (Array.isArray(response)) return response;
          return response.data ?? [];
        }),
      );
  }

  getRequest(id: string): Observable<Request> {
    return this.http
      .get<Request | RequestDetailResponse>(`${this.apiUrl}/requests/${id}`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          if ('data' in response && response.data) return response.data as Request;
          return response as Request;
        }),
      );
  }

  createRequest(payload: CreateRequestPayload): Observable<Request> {
    if (payload.file) {
      const formData = new FormData();
      formData.append('title', payload.title);
      formData.append('description', payload.description);
      formData.append('type', payload.type);
      formData.append('file', payload.file);

      return this.http
        .post<Request | RequestDetailResponse>(`${this.apiUrl}/requests`, formData, {
          withCredentials: true,
        })
        .pipe(map((response) => ('data' in response && response.data ? (response.data as Request) : (response as Request))));
    }

    return this.http
      .post<Request | RequestDetailResponse>(
        `${this.apiUrl}/requests`,
        {
          title: payload.title,
          description: payload.description,
          type: payload.type,
        },
        { withCredentials: true },
      )
      .pipe(map((response) => ('data' in response && response.data ? (response.data as Request) : (response as Request))));
  }
}
