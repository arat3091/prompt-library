import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PromptDetailComponent } from './prompt-detail.component';
import { PromptService } from '../../services/prompt.service';
import { AuthService } from '../../services/auth.service';
import { Prompt, User } from '../../models';
import { of, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

describe('PromptDetailComponent', () => {
  let component: PromptDetailComponent;
  let fixture: ComponentFixture<PromptDetailComponent>;
  let promptService: jasmine.SpyObj<PromptService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let location: jasmine.SpyObj<Location>;
  let activatedRoute: any;

  const mockPrompt: Prompt = {
    id: 1,
    title: 'Test Prompt',
    content: 'Test Content',
    description: 'Test Description',
    category: 'Test',
    author: 'testuser',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 0
  };

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    apiKey: 'test-key',
    role: 'USER',
    createdAt: new Date()
  };

  beforeEach(async () => {
    const promptServiceSpy = jasmine.createSpyObj('PromptService', ['getPromptById']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      currentUser$: new BehaviorSubject(mockUser)
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);

    activatedRoute = {
      snapshot: { params: { id: '1' } }
    };

    await TestBed.configureTestingModule({
      imports: [PromptDetailComponent],
      providers: [
        { provide: PromptService, useValue: promptServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    promptService = TestBed.inject(PromptService) as jasmine.SpyObj<PromptService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;

    fixture = TestBed.createComponent(PromptDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load prompt on init', () => {
    promptService.getPromptById.and.returnValue(of(mockPrompt));

    fixture.detectChanges();

    expect(promptService.getPromptById).toHaveBeenCalledWith(1);
  });

  it('should display prompt details', (done) => {
    promptService.getPromptById.and.returnValue(of(mockPrompt));

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.prompt).toEqual(mockPrompt);
      done();
    });
  });

  it('should show edit button for author', (done) => {
    promptService.getPromptById.and.returnValue(of(mockPrompt));

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const isAuthor = component.checkIfAuthor();
      expect(isAuthor).toBe(true);
      done();
    });
  });

  it('should hide edit button for non-author', (done) => {
    const otherUserPrompt = { ...mockPrompt, userId: 2, author: 'otheruser' };
    promptService.getPromptById.and.returnValue(of(otherUserPrompt));

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const isAuthor = component.checkIfAuthor();
      expect(isAuthor).toBe(false);
      done();
    });
  });

  it('should navigate to edit page', () => {
    promptService.getPromptById.and.returnValue(of(mockPrompt));

    fixture.detectChanges();

    component.editPrompt();

    expect(router.navigate).toHaveBeenCalledWith(['/prompts', 1, 'edit']);
  });

  it('should handle 404 error', (done) => {
    promptService.getPromptById.and.returnValue(
      throwError(() => ({ status: 404 }))
    );

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.error).toBeTruthy();
      done();
    });
  });

  it('should handle network error', (done) => {
    promptService.getPromptById.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.error).toBeTruthy();
      done();
    });
  });

  it('should go back to previous page', () => {
    promptService.getPromptById.and.returnValue(of(mockPrompt));

    fixture.detectChanges();

    component.goBack();

    expect(location.back).toHaveBeenCalled();
  });

  it('should show loading state while fetching', () => {
    promptService.getPromptById.and.returnValue(of(mockPrompt));

    fixture.detectChanges();

    expect(component.loading).toBe(false);
  });
});
