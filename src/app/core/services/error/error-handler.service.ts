import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private errorMessageSubject = new Subject<string>();
  public errorMessage$ = this.errorMessageSubject.asObservable();

  constructor() {}

  showError(message: string): void {
    this.errorMessageSubject.next(message);
    console.error('Error:', message);
    // In a real app, you would typically use a toast/snackbar service here
    // For example: this.snackBar.open(message, 'Close', { duration: 5000 });
  }

  clearError(): void {
    this.errorMessageSubject.next('');
  }
}
