import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly userSubject = new BehaviorSubject<User | null>(null);
  private readonly authenticatedSubject = new BehaviorSubject<boolean>(false);

  readonly user$ = this.userSubject.asObservable();
  readonly isAuthenticated$ = this.authenticatedSubject.asObservable();

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.authenticatedSubject.value;
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<{ data: User }>(
        `${environment.apiUrl}/auth/login`,
        { email, password },
        { withCredentials: true },
      )
      .pipe(
        map((response) => {
          const user = response.data ?? (response as unknown as User);
          this.userSubject.next(user);
          this.authenticatedSubject.next(true);
          if (isPlatformBrowser(this.platformId)) {
            sessionStorage.setItem('dp_user', JSON.stringify(user));
          }
          return true;
        }),
        catchError(() => of(false)),
      );
  }

  register(name: string, email: string, password: string): Observable<boolean> {
    return this.http
      .post(`${environment.apiUrl}/auth/register`, { name, email, password }, { withCredentials: true })
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      );
  }

  logout(): void {
    this.userSubject.next(null);
    this.authenticatedSubject.next(false);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('dp_user');
    }
    this.http
      .post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(catchError(() => of(null)))
      .subscribe(() => {
        this.router.navigate(['/login']);
      });
  }

  /** Verifica sessao restaurando usuario do sessionStorage */
  checkSession(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const stored = sessionStorage.getItem('dp_user');
    if (stored) {
      try {
        const user: User = JSON.parse(stored);
        this.userSubject.next(user);
        this.authenticatedSubject.next(true);
      } catch {
        sessionStorage.removeItem('dp_user');
      }
    }
  }

  /** Valida sessao com o backend */
  validateSession(): Observable<boolean> {
    return this.http
      .get<{ data: User }>(`${environment.apiUrl}/auth/me`, { withCredentials: true })
      .pipe(
        tap((response) => {
          const user = response.data ?? (response as unknown as User);
          this.userSubject.next(user);
          this.authenticatedSubject.next(true);
          if (isPlatformBrowser(this.platformId)) {
            sessionStorage.setItem('dp_user', JSON.stringify(user));
          }
        }),
        map(() => true),
        catchError(() => {
          this.userSubject.next(null);
          this.authenticatedSubject.next(false);
          if (isPlatformBrowser(this.platformId)) {
            sessionStorage.removeItem('dp_user');
          }
          return of(false);
        }),
      );
  }
}
