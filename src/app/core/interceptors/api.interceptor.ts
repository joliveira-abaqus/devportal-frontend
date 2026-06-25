import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/** Interceptor que adiciona withCredentials e Content-Type JSON, e redireciona em 401 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const cloned = req.clone({
    withCredentials: true,
    setHeaders: req.body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
  });

  return next(cloned).pipe(
    catchError((error) => {
      if (error.status === 401) {
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
