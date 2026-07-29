import { Component, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent implements OnDestroy {
  loginForm: FormGroup;
  registerForm: FormGroup;
  loginLoading = false;
  registerLoading = false;
  loginError = '';
  registerError = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<AuthModalComponent>
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loginLoading = true;
    this.loginError = '';

    const { username, password } = this.loginForm.value;
    this.authService.login(username, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loginLoading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loginLoading = false;
          this.loginError = error.error?.message || 'Invalid username or password';
        }
      });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.registerLoading = true;
    this.registerError = '';

    const { username, password, email } = this.registerForm.value;
    this.authService.register(username, password, email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.registerLoading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.registerLoading = false;
          this.registerError = error.error?.message || 'Registration failed';
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
