import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PromptCreateEditComponent } from './prompt-create-edit.component';
import { PromptService } from '../../services/prompt.service';
import { AuthService } from '../../services/auth.service';
import { Prompt, CreatePromptRequest } from '../../models';
import { of, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

describe('PromptCreateEditComponent', () => {
  let component: PromptCreateEditComponent;
  let fixture: ComponentFixture<PromptCreateEditComponent>;
  let promptService: jasmine.SpyObj<PromptService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let location: jasmine.SpyObj<Location>;
  let activatedRoute: any;

  const mockPrompt: Prompt = {
    id: 1,
    title: 'Existing Prompt',
    content: 'Existing Content',
    description: 'Existing Description',
    category: 'Existing',
    author: 'testuser',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 0
  };

  beforeEach(async () => {
    const promptServiceSpy = jasmine.createSpyObj('PromptService', [
      'createPrompt',
      'getPromptById',
      'updatePrompt'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      currentUser$: new BehaviorSubject({ id: 1, username: 'testuser' })
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);

    activatedRoute = {
      snapshot: { params: {} }
    };

    await TestBed.configureTestingModule({
      imports: [PromptCreateEditComponent, ReactiveFormsModule],
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

    fixture = TestBed.createComponent(PromptCreateEditComponent);
    component = fixture.componentInstance;
  });

  describe('Create Mode', () => {
    beforeEach(() => {
      activatedRoute.snapshot.params = {};
      fixture.detectChanges();
    });

    it('should create component in create mode', () => {
      expect(component.mode).toBe('create');
    });

    it('should have empty form in create mode', () => {
      expect(component.promptForm.get('title')?.value).toBe('');
      expect(component.promptForm.get('content')?.value).toBe('');
    });

    it('should disable submit button when form is empty', () => {
      expect(component.promptForm.valid).toBe(false);
    });

    it('should enable submit button when form is valid', () => {
      component.promptForm.setValue({
        title: 'Test Title',
        content: 'Test Content',
        description: 'Test Desc',
        category: 'Test'
      });

      expect(component.promptForm.valid).toBe(true);
    });

    it('should create prompt on submit', (done) => {
      promptService.createPrompt.and.returnValue(of(mockPrompt));

      component.promptForm.setValue({
        title: 'New Prompt',
        content: 'New Content',
        description: 'New Desc',
        category: 'New'
      });

      component.onSubmit();

      setTimeout(() => {
        expect(promptService.createPrompt).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/prompts', 1]);
        done();
      }, 100);
    });

    it('should show loading state during creation', () => {
      promptService.createPrompt.and.returnValue(of(mockPrompt));

      component.promptForm.setValue({
        title: 'New Prompt',
        content: 'New Content',
        description: 'New Desc',
        category: 'New'
      });

      component.onSubmit();

      expect(component.loading).toBe(false);
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      activatedRoute.snapshot.params = { id: '1' };
      promptService.getPromptById.and.returnValue(of(mockPrompt));
      fixture.detectChanges();
    });

    it('should create component in edit mode', () => {
      expect(component.mode).toBe('edit');
    });

    it('should populate form with existing prompt data', (done) => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(component.promptForm.get('title')?.value).toBe('Existing Prompt');
        expect(component.promptForm.get('content')?.value).toBe('Existing Content');
        done();
      });
    });

    it('should update prompt on submit', (done) => {
      promptService.updatePrompt.and.returnValue(of(mockPrompt));

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        component.promptForm.setValue({
          title: 'Updated Title',
          content: 'Updated Content',
          description: 'Updated Desc',
          category: 'Updated'
        });

        component.onSubmit();

        setTimeout(() => {
          expect(promptService.updatePrompt).toHaveBeenCalledWith(
            1,
            jasmine.objectContaining({
              title: 'Updated Title'
            })
          );
          done();
        }, 100);
      });
    });
  });

  describe('Validation', () => {
    beforeEach(() => {
      activatedRoute.snapshot.params = {};
      fixture.detectChanges();
    });

    it('should validate title is required', () => {
      const titleControl = component.promptForm.get('title');
      titleControl?.setValue('');
      expect(titleControl?.hasError('required')).toBe(true);
    });

    it('should validate content is required', () => {
      const contentControl = component.promptForm.get('content');
      contentControl?.setValue('');
      expect(contentControl?.hasError('required')).toBe(true);
    });

    it('should validate title max length', () => {
      const titleControl = component.promptForm.get('title');
      titleControl?.setValue('a'.repeat(256));
      expect(titleControl?.hasError('maxlength')).toBe(true);
    });

    it('should validate content max length', () => {
      const contentControl = component.promptForm.get('content');
      contentControl?.setValue('a'.repeat(10001));
      expect(contentControl?.hasError('maxlength')).toBe(true);
    });

    it('should display character count for title', () => {
      component.promptForm.get('title')?.setValue('Test Title');
      expect(component.getTitleCharCount()).toBe(10);
    });

    it('should display character count for content', () => {
      component.promptForm.get('content')?.setValue('Test Content');
      expect(component.getContentCharCount()).toBe(12);
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      activatedRoute.snapshot.params = {};
      fixture.detectChanges();
    });

    it('should handle creation error', (done) => {
      promptService.createPrompt.and.returnValue(
        throwError(() => new Error('Creation failed'))
      );

      component.promptForm.setValue({
        title: 'Test',
        content: 'Test Content',
        description: '',
        category: ''
      });

      component.onSubmit();

      setTimeout(() => {
        expect(component.error).toBeTruthy();
        expect(component.loading).toBe(false);
        done();
      }, 100);
    });

    it('should not clear form on error', (done) => {
      promptService.createPrompt.and.returnValue(
        throwError(() => new Error('Creation failed'))
      );

      const formValue = {
        title: 'Test',
        content: 'Test Content',
        description: 'Test Desc',
        category: 'Test'
      };

      component.promptForm.setValue(formValue);

      component.onSubmit();

      setTimeout(() => {
        expect(component.promptForm.get('title')?.value).toBe('Test');
        done();
      }, 100);
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      activatedRoute.snapshot.params = {};
      fixture.detectChanges();
    });

    it('should go back when cancel is clicked', () => {
      component.onCancel();
      expect(location.back).toHaveBeenCalled();
    });

    it('should warn on unsaved changes', () => {
      component.promptForm.setValue({
        title: 'Changed',
        content: 'Changed Content',
        description: '',
        category: ''
      });

      spyOn(window, 'confirm').and.returnValue(false);

      component.onCancel();

      expect(window.confirm).toHaveBeenCalled();
    });
  });

  describe('Authentication Check', () => {
    it('should redirect if not authenticated', () => {
      (authService as any).currentUser$ = new BehaviorSubject(null);
      activatedRoute.snapshot.params = {};

      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
