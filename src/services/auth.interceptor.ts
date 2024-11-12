import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

// Interceptor function to add Authorization header with token
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
  const cookie = inject(CookieService);
  const token = cookie.get('token');
  if (token) {
    // Clone the request to add the Authorization header
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest); // Forward the cloned request
  }
  return next(req); // No token, pass original request
};
