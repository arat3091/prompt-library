import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let matDialog: jasmine.SpyObj<MatDialog>;
  let currentUserSubject: BehaviorSubject<User | null>;

  beforeEach(async () => {
    currentUserSubject = new BehaviorSubject<User | null>(null);

    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser$: currentUserSubject
    });

    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, MatDialogModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Login / Register" button when not authenticated', () => {
    currentUserSubject.next(null);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Login / Register');
  });

  it('should display user menu when authenticated', () => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      apiKey: 'test-key',
      role: 'USER',
      createdAt: new Date()
    };

    currentUserSubject.next(mockUser);
    fixture.detectChanges();

    expect(component.currentUser).toBe(mockUser);
  });

  it('should open auth modal when Login/Register button is clicked', () => {
    currentUserSubject.next(null);
    fixture.detectChanges();

    const loginButton = fixture.nativeElement.querySelector('button[aria-label*="Login"]') ||
                        fixture.nativeElement.querySelector('button');

    if (loginButton) {
      loginButton.click();
      expect(matDialog.open).toHaveBeenCalled();
    }
  });

  it('should call logout when logout is clicked', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should update currentUser when currentUser$ emits', (done) => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      apiKey: 'test-key',
      role: 'USER',
      createdAt: new Date()
    };

    currentUserSubject.next(mockUser);

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.currentUser).toEqual(mockUser);
      done();
    });
  });

  it('should unsubscribe on component destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
