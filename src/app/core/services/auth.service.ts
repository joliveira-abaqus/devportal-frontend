import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, catchError, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { User, LoginPayload, RegisterPayload } from '../models';

interface AuthResponse {
  data?: User;
  id?: string;
  email?: string;
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  readonly currentUser$ = this.currentUserSubject.asObservable();
  readonly isAuthenticated$: Observable<boolean> = this.currentUser$.pipe(
    map((user) => user !== null)
  );

  constructor(
    private api: ApiService,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  login(payload: LoginPayload): Observable<User> {
    return this.api.post<AuthResponse>('/auth/login', payload).pipe(
      map((response) => {
        const user = response.data ?? (response as unknown as User);
        this.setUser(user);
        return user;
      })
    );
  }

  register(payload: RegisterPayload): Observable<User> {
    return this.api.post<AuthResponse>('/auth/register', payload).pipe(
      map((response) => response.data ?? (response as unknown as User))
    );
  }

  logout(): void {
    this.clearUser();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  checkSession(): Observable<boolean> {
    return this.api.get<AuthResponse>('/auth/me').pipe(
      tap((response) => {
        const user = response.data ?? (response as unknown as User);
        this.setUser(user);
      }),
      map(() => true),
      catchError(() => {
        this.clearUser();
        return of(false);
      })
    );
  }

  private setUser(user: User): void {
    this.currentUserSubject.next(user);
    try {
      localStorage.setItem('devportal_user', JSON.stringify(user));
    } catch {
      // localStorage indisponível
    }
  }

  private clearUser(): void {
    this.currentUserSubject.next(null);
    try {
      localStorage.removeItem('devportal_user');
    } catch {
      // localStorage indisponível
    }
  }

  private loadUserFromStorage(): void {
    try {
      const stored = localStorage.getItem('devportal_user');
      if (stored) {
        this.currentUserSubject.next(JSON.parse(stored) as User);
      }
    } catch {
      // localStorage indisponível
    }
  }
}
