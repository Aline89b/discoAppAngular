import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type SnackbarState = {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
};

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  public snackbarState = new BehaviorSubject<SnackbarState>({
    message: '',
    type: 'info',
  });

  snackbarState$ = this.snackbarState.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
    this.snackbarState.next({ message, type });
  }

  getAlertClass(): string {
    const type = this.snackbarState.getValue().type;
    return {
      success: 'alert-success',
      error: 'alert-error',
      warning: 'alert-warning',
      info: 'alert-info',
    }[type];
  }
}
