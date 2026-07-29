import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AuthModalComponent } from './auth-modal.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

describe('AuthModalComponent', () => {
  let component: AuthModalComponent;
  let fixture: ComponentFixture<AuthModalComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AuthModalComponent>>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register', 'login'], {
      currentUser$: new BehaviorSubject(null)
    });

    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [AuthModalComponent, ReactiveFormsModule, MatDialogModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AuthModalComponent>>;

    fixture = TestBed.createComponent(AuthModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Login Tab', () => {
    beforeEach(() => {
      component.currentTab = 'login';
      fixture.detectChanges();
    });

    it('should show login form on login tab', () => {
      expect(component.currentTab).toBe('login');
    });

    it('should disable login button when form is empty', () => {
      component.loginForm.reset();
      expect(component.loginForm.valid).toBe(false);
    });

    it('should enable login button when form is filled', () => {
      component.loginForm.setValue({
        username: 'testuser',
        password: 'password123'
      });
      expect(component.loginForm.valid).toBe(true);
    });

    it('should call authService.login on login submit', (done) => {
      authService.login.and.returnValue(of({ id: 1, username: 'testuser', apiKey: 'key' }));

      component.loginForm.setValue({
        username: 'testuser',
        password: 'password123'
      });

      component.onLoginSubmit();

      setTimeout(() => {
        expect(authService.login).toHaveBeenCalledWith('testuser', 'password123');
        done();
      }, 100);
    });

    it('should close dialog on successful login', (done) => {
      authService.login.and.returnValue(of({ id: 1, username: 'testuser', apiKey: 'key' }));

      component.loginForm.setValue({
        username: 'testuser',
        password: 'password123'
      });

      component.onLoginSubmit();

      setTimeout(() => {
        expect(dialogRef.close).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should display error message on login failure', (done) => {
      authService.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

      component.loginForm.setValue({
        username: 'testuser',
        password: 'wrongpassword'
      });

      component.onLoginSubmit();

      setTimeout(() => {
        expect(component.loginError).toBeTruthy();
        done();
      }, 100);
    });
  });

  describe('Register Tab', () => {
    beforeEach(() => {
      component.currentTab = 'register';
      fixture.detectChanges();
    });

    it('should show register form on register tab', () => {
      expect(component.currentTab).toBe('register');
    });

    it('should validate username minimum length', () => {
      component.registerForm.setValue({
        username: 'ab',
        password: 'password123',
        email: 'test@example.com'
      });
      expect(component.registerForm.valid).toBe(false);
    });

    it('should validate password minimum length', () => {
      component.registerForm.setValue({
        username: 'testuser',
        password: 'short',
        email: 'test@example.com'
      });
      expect(component.registerForm.valid).toBe(false);
    });

    it('should validate email format', () => {
      component.registerForm.setValue({
        username: 'testuser',
        password: 'password123',
        email: 'invalid-email'
      });
      expect(component.registerForm.valid).toBe(false);
    });

    it('should enable register button when form is valid', () => {
      component.registerForm.setValue({
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com'
      });
      expect(component.registerForm.valid).toBe(true);
    });

    it('should call authService.register on register submit', (done) => {
      authService.register.and.returnValue(
        of({
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          apiKey: 'key',
          role: 'USER',
          createdAt: new Date()
        })
      );

      component.registerForm.setValue({
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com'
      });

      component.onRegisterSubmit();

      setTimeout(() => {
        expect(authService.register).toHaveBeenCalledWith('testuser', 'password123', 'test@example.com');
        done();
      }, 100);
    });

    it('should display error message on register failure', (done) => {
      authService.register.and.returnValue(throwError(() => new Error('Username already exists')));

      component.registerForm.setValue({
        username: 'existinguser',
        password: 'password123',
        email: 'test@example.com'
      });

      component.onRegisterSubmit();

      setTimeout(() => {
        expect(component.registerError).toBeTruthy();
        done();
      }, 100);
    });
  });

  it('should close dialog when cancel is clicked', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
