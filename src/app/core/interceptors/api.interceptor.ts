import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '@env/environment';

/** Interceptor que adiciona withCredentials e Content-Type JSON, e redireciona em 401 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const cloned = req.clone({
    withCredentials: true,
    setHeaders: req.body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
  });

  const isSessionCheck = req.url === `${environment.apiUrl}/auth/me`;

  return next(cloned).pipe(
    catchError((error) => {
      if (error.status === 401 && !isSessionCheck) {
        const currentUrl = router.url;
        router.navigate(['/login'], {
          queryParams: currentUrl && currentUrl !== '/' ? { callbackUrl: currentUrl } : {},
        });
      }
      return throwError(() => error);
    }),
  );
};
