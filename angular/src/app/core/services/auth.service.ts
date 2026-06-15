import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, LoginPayload, RegisterPayload } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);

  currentUser$: Observable<User | null> = this.userSubject.asObservable();
  isAuthenticated$: Observable<boolean> = this.currentUser$.pipe(map((u) => u !== null));

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(email: string, password: string): Observable<User> {
    return new Observable<User>((subscriber) => {
      this.http
        .post<{ data: User }>(
          `${environment.apiUrl}/auth/login`,
          { email, password } satisfies LoginPayload,
          { withCredentials: true },
        )
        .subscribe({
          next: (res) => {
            const user = res.data ?? (res as unknown as User);
            this.userSubject.next(user);
            subscriber.next(user);
            subscriber.complete();
          },
          error: (err) => subscriber.error(err),
        });
    });
  }

  register(name: string, email: string, password: string): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/auth/register`,
      { name, email, password } satisfies RegisterPayload,
      { withCredentials: true },
    );
  }

  logout(): void {
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }
}
