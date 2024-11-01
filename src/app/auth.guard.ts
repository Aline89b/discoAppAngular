import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Expected roles from the route's `data` property
  const expectedRoles: string[] = route.data?.['roles'] || [];

  // Check user role and determine access
  return authService.getUserRole().pipe(
    map((userRole: string ) => {
      if (expectedRoles.includes(userRole)) {
        return true;
      } else {
        router.navigate(['/unauthorized']);
        return false;
      }
    })
  );
};

