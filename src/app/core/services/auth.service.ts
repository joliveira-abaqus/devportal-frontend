import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, of, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, LoginPayload, RegisterPayload } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  readonly isAuthenticated = signal(false);
  readonly user = signal<User | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {
    this.checkAuth();
  }

  login(payload: LoginPayload): Observable<User> {
    return this.http
      .post<{ data: User }>(`${this.apiUrl}/auth/login`, payload, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response.data ?? (response as unknown as User)),
        tap((user) => {
          this.user.set(user);
          this.isAuthenticated.set(true);
        }),
        catchError((error) => {
          return throwError(() => error);
        }),
      );
  }

  register(payload: RegisterPayload): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/auth/register`, payload, {
      withCredentials: true,
    });
  }

  logout(): void {
    this.http
      .post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(catchError(() => of(null)))
      .subscribe(() => {
        this.user.set(null);
        this.isAuthenticated.set(false);
        this.router.navigate(['/login']);
      });
  }

  checkAuth(): void {
    this.http
      .get<{ data: User }>(`${this.apiUrl}/auth/me`, { withCredentials: true })
      .pipe(catchError(() => of(null)))
      .subscribe((response) => {
        if (response) {
          const user = response.data ?? (response as unknown as User);
          this.user.set(user);
          this.isAuthenticated.set(true);
        } else {
          this.user.set(null);
          this.isAuthenticated.set(false);
        }
      });
  }
}
