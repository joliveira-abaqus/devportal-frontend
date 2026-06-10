import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../../models';

interface LoginResponse {
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
  private authenticatedSubject = new BehaviorSubject<boolean>(false);

  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.authenticatedSubject.asObservable();

  constructor(
    private api: ApiService,
    private router: Router,
  ) {}

  login(email: string, password: string): Observable<User> {
    return this.api.post<LoginResponse>('/auth/login', { email, password }).pipe(
      map((response) => {
        const user = (response as LoginResponse).data ?? (response as unknown as User);
        return user;
      }),
      tap((user) => {
        this.currentUserSubject.next(user);
        this.authenticatedSubject.next(true);
      }),
    );
  }

  register(name: string, email: string, password: string): Observable<unknown> {
    return this.api.post('/auth/register', { name, email, password });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.authenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authenticatedSubject.asObservable();
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  setUser(user: User): void {
    this.currentUserSubject.next(user);
    this.authenticatedSubject.next(true);
  }
}
