import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user.model';

interface AuthResponse {
  data?: {
    id: string;
    email: string;
    name: string;
    token?: string;
  };
  id?: string;
  email?: string;
  name?: string;
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/auth/login`,
        { email, password },
        { withCredentials: true },
      )
      .pipe(
        tap((response) => {
          const user = response.data ?? response;
          const token = response.data?.token ?? response.token;
          if (token) {
            localStorage.setItem('token', token);
          }
          const currentUser: User = {
            id: user.id!,
            email: user.email!,
            name: user.name!,
            createdAt: new Date().toISOString(),
          };
          localStorage.setItem('user', JSON.stringify(currentUser));
          this.currentUserSubject.next(currentUser);
        }),
        catchError((error) => {
          return throwError(() => error);
        }),
      );
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, {
      name,
      email,
      password,
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null || localStorage.getItem('user') !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private loadUserFromStorage(): User | null {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        return JSON.parse(userJson) as User;
      } catch {
        return null;
      }
    }
    return null;
  }
}
