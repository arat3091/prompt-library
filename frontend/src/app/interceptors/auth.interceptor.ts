import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get API key from auth service
    const apiKey = this.authService.getApiKey();

    // If API key exists, add it to request headers
    if (apiKey) {
      req = req.clone({
        setHeaders: {
          'X-API-Key': apiKey
        }
      });
    }

    return next.handle(req);
  }
}
