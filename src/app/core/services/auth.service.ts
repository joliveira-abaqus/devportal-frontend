import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { User, LoginPayload, RegisterPayload } from '../models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);

  readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  readonly isAuthenticated$: Observable<boolean> = this.currentUser$.pipe(map((user) => !!user));

  constructor(
    private readonly api: ApiService,
    private readonly router: Router,
  ) {}

  login(email: string, password: string): Observable<User> {
    const payload: LoginPayload = { email, password };
    return this.api.post<User>('/auth/login', payload as unknown as Record<string, unknown>).pipe(
      tap((user) => this.currentUserSubject.next(user)),
    );
  }

  register(name: string, email: string, password: string): Observable<User> {
    const payload: RegisterPayload = { name, email, password };
    return this.api.post<User>('/auth/register', payload as unknown as Record<string, unknown>).pipe(
      tap((user) => this.currentUserSubject.next(user)),
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
