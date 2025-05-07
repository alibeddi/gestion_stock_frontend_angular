import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../services/error/error-handler.service';
import { TokenService } from '../services/token/token.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized - clear tokens and redirect to login
          this.tokenService.clear();
          this.router.navigate(['/auth/login']);
          this.errorHandlerService.showError(
            'Session expired. Please login again.'
          );
        } else if (error.status === 403) {
          // Forbidden
          this.errorHandlerService.showError(
            'You do not have permission to perform this action.'
          );
        } else if (error.status === 404) {
          // Not found
          this.errorHandlerService.showError('Resource not found.');
        } else if (error.status >= 500) {
          // Server error
          this.errorHandlerService.showError(
            'Server error. Please try again later.'
          );
        } else {
          // Other errors
          const errorMessage =
            error.error?.message || 'An unexpected error occurred.';
          this.errorHandlerService.showError(errorMessage);
        }

        return throwError(() => error);
      })
    );
  }
}
