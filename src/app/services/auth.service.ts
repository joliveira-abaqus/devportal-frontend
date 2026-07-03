import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User, LoginPayload, RegisterPayload } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authenticatedSubject = new BehaviorSubject<boolean>(false);
  private readonly userSubject = new BehaviorSubject<User | null>(null);

  readonly isAuthenticated$ = this.authenticatedSubject.asObservable();
  readonly user$ = this.userSubject.asObservable();

  constructor(private readonly api: ApiService) {}

  get isAuthenticated(): boolean {
    return this.authenticatedSubject.value;
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  login(payload: LoginPayload): Observable<User> {
    return this.api.post<{ data: User }>('/auth/login', payload).pipe(
      map((response) => {
        const user = (response as Record<string, unknown>)['data'] ?? response;
        return user as User;
      }),
      tap((user) => {
        this.authenticatedSubject.next(true);
        this.userSubject.next(user);
      }),
    );
  }

  register(payload: RegisterPayload): Observable<unknown> {
    return this.api.post('/auth/register', payload);
  }

  checkSession(): Observable<boolean> {
    return this.api.get<{ data: User }>('/auth/me').pipe(
      map((response) => {
        const user = (response as Record<string, unknown>)['data'] ?? response;
        this.userSubject.next(user as User);
        this.authenticatedSubject.next(true);
        return true;
      }),
      catchError(() => {
        this.authenticatedSubject.next(false);
        this.userSubject.next(null);
        return of(false);
      }),
    );
  }

  logout(): void {
    this.api.post('/auth/logout', {}).subscribe({
      complete: () => {
        this.authenticatedSubject.next(false);
        this.userSubject.next(null);
      },
      error: () => {
        this.authenticatedSubject.next(false);
        this.userSubject.next(null);
      },
    });
  }
}
