import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, of, map, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { User } from '@app/types';

interface LoginResponse {
  data?: User;
  id?: string;
  email?: string;
  name?: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUser = signal<User | null>(null);
  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  /** Faz login chamando POST /auth/login no backend, que retorna cookie httpOnly */
  login(email: string, password: string): Observable<User | null> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        map((body) => {
          const user: User = {
            id: body.data?.id ?? body.id ?? '',
            email: body.data?.email ?? body.email ?? '',
            name: body.data?.name ?? body.name ?? '',
            createdAt: body.data?.createdAt ?? '',
          };
          this.currentUser.set(user);
          return user;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 400) {
            return of(null);
          }
          return throwError(() => error);
        }),
      );
  }

  /** Registra novo usuário */
  register(name: string, email: string, password: string): Observable<boolean> {
    return this.http
      .post(`${environment.apiUrl}/auth/register`, { name, email, password })
      .pipe(
        map(() => true),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 409 || error.status === 400) {
            return of(false);
          }
          return throwError(() => error);
        }),
      );
  }

  /** Faz logout removendo o cookie via backend e limpa estado */
  logout(): void {
    this.http
      .post(`${environment.apiUrl}/auth/logout`, {})
      .pipe(catchError(() => of(null)))
      .subscribe(() => {
        this.currentUser.set(null);
        this.router.navigate(['/login']);
      });
  }

  /** Verifica sessão atual consultando o backend */
  checkSession(): Observable<boolean> {
    return this.http.get<LoginResponse>(`${environment.apiUrl}/auth/me`).pipe(
      map((body) => {
        const data = body.data ?? body;
        if (data?.id) {
          this.currentUser.set({
            id: data.id,
            email: data.email ?? '',
            name: data.name ?? '',
            createdAt: data.createdAt ?? '',
          });
          return true;
        }
        return false;
      }),
      catchError(() => {
        this.currentUser.set(null);
        return of(false);
      }),
    );
  }

  /** Limpa estado local sem chamar backend */
  clearSession(): void {
    this.currentUser.set(null);
  }
}
