import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated) {
    return true;
  }

  authService.checkSession();
  if (authService.isAuthenticated) {
    return true;
  }

  return authService.validateSession().pipe(
    map((valid) => {
      if (valid) {
        return true;
      }
      const loginUrl = router.createUrlTree(['/login'], {
        queryParams: { callbackUrl: state.url },
      });
      return loginUrl;
    }),
  );
};
