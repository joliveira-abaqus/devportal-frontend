import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models';

interface AuthResponse {
  data: {
    user: User;
    token: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  private loadUserFromStorage(): User | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('devportal_user');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('devportal_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<AuthResponse>(
        `${environment.apiUrl}/auth/login`,
        { email, password },
        { withCredentials: true },
      )
      .pipe(
        map((response) => {
          const data = response.data ?? (response as unknown as { user: User; token: string });
          const user = data.user;
          const token = data.token;
          localStorage.setItem('devportal_token', token);
          localStorage.setItem('devportal_user', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        }),
      );
  }

  register(name: string, email: string, password: string): Observable<unknown> {
    return this.http.post(
      `${environment.apiUrl}/auth/register`,
      { name, email, password },
      { withCredentials: true },
    );
  }

  logout(): void {
    localStorage.removeItem('devportal_token');
    localStorage.removeItem('devportal_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
