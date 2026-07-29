import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PromptListComponent } from './prompt-list.component';
import { PromptService } from '../../services/prompt.service';
import { Prompt, PageResponse } from '../../models';
import { of, throwError } from 'rxjs';

describe('PromptListComponent', () => {
  let component: PromptListComponent;
  let fixture: ComponentFixture<PromptListComponent>;
  let promptService: jasmine.SpyObj<PromptService>;
  let router: jasmine.SpyObj<Router>;

  const mockPrompts: Prompt[] = [
    {
      id: 1,
      title: 'Prompt 1',
      content: 'Content 1',
      description: 'Description 1',
      category: 'Category 1',
      author: 'user1',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 0
    },
    {
      id: 2,
      title: 'Prompt 2',
      content: 'Content 2',
      description: 'Description 2',
      category: 'Category 2',
      author: 'user2',
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 0
    }
  ];

  const mockPageResponse: PageResponse<Prompt> = {
    content: mockPrompts,
    totalElements: 2,
    totalPages: 1,
    size: 20,
    number: 0,
    empty: false
  };

  beforeEach(async () => {
    const promptServiceSpy = jasmine.createSpyObj('PromptService', ['getPrompts']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PromptListComponent],
      providers: [
        { provide: PromptService, useValue: promptServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    promptService = TestBed.inject(PromptService) as jasmine.SpyObj<PromptService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(PromptListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load prompts on init', () => {
    promptService.getPrompts.and.returnValue(of(mockPageResponse));

    fixture.detectChanges();

    expect(promptService.getPrompts).toHaveBeenCalledWith(0, 20, 'createdAt', 'desc');
  });

  it('should display prompts in table', (done) => {
    promptService.getPrompts.and.returnValue(of(mockPageResponse));

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.prompts.length).toBe(2);
      expect(component.prompts[0].title).toBe('Prompt 1');
      done();
    });
  });

  it('should handle load error', (done) => {
    promptService.getPrompts.and.returnValue(throwError(() => new Error('Load failed')));

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.error).toBeTruthy();
      expect(component.loading).toBe(false);
      done();
    });
  });

  it('should show loading spinner while fetching', () => {
    promptService.getPrompts.and.returnValue(of(mockPageResponse));

    fixture.detectChanges();

    expect(component.loading).toBe(false);
  });

  it('should navigate to detail view when prompt is clicked', () => {
    promptService.getPrompts.and.returnValue(of(mockPageResponse));

    fixture.detectChanges();

    component.goToDetail(1);

    expect(router.navigate).toHaveBeenCalledWith(['/prompts', 1]);
  });

  it('should handle pagination', () => {
    promptService.getPrompts.and.returnValue(of(mockPageResponse));

    fixture.detectChanges();

    component.onPageChange({ pageIndex: 1, pageSize: 20, length: 40, previousPageIndex: 0 });

    expect(promptService.getPrompts).toHaveBeenCalledWith(1, 20, 'createdAt', 'desc');
  });

  it('should retry loading prompts', () => {
    promptService.getPrompts.and.returnValue(throwError(() => new Error('Load failed')));

    fixture.detectChanges();

    promptService.getPrompts.and.returnValue(of(mockPageResponse));

    component.retryLoad();

    expect(promptService.getPrompts).toHaveBeenCalled();
  });

  it('should show empty state when no prompts', (done) => {
    const emptyResponse: PageResponse<Prompt> = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 20,
      number: 0,
      empty: true
    };

    promptService.getPrompts.and.returnValue(of(emptyResponse));

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.prompts.length).toBe(0);
      done();
    });
  });
});
