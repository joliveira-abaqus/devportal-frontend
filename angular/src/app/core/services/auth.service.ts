import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, LoginPayload, RegisterPayload } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private sessionChecked = false;

  currentUser$: Observable<User | null> = this.userSubject.asObservable();
  isAuthenticated$: Observable<boolean> = this.currentUser$.pipe(map((u) => u !== null));

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<{ data: User }>(
        `${environment.apiUrl}/auth/login`,
        { email, password } satisfies LoginPayload,
        { withCredentials: true },
      )
      .pipe(
        map((res) => res.data ?? (res as unknown as User)),
        tap((user) => this.userSubject.next(user)),
      );
  }

  register(name: string, email: string, password: string): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/auth/register`,
      { name, email, password } satisfies RegisterPayload,
      { withCredentials: true },
    );
  }

  logout(): void {
    this.http
      .post<void>(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(catchError(() => of(undefined)))
      .subscribe(() => {
        this.userSubject.next(null);
        this.router.navigate(['/login']);
      });
  }

  checkSession(): Observable<User | null> {
    if (this.sessionChecked) {
      return this.currentUser$;
    }

    return this.http
      .get<{ data: User } | User>(`${environment.apiUrl}/auth/me`, { withCredentials: true })
      .pipe(
        map((res) => ('data' in res && res.data ? res.data : (res as User))),
        tap((user) => {
          this.userSubject.next(user);
          this.sessionChecked = true;
        }),
        catchError(() => {
          this.sessionChecked = true;
          return of(null);
        }),
      );
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }
}
