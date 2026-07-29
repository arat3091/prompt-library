import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PromptService } from '../../services/prompt.service';
import { AuthService } from '../../services/auth.service';
import { CreatePromptRequest, UpdatePromptRequest } from '../../models';

@Component({
  selector: 'app-prompt-create-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './prompt-create-edit.component.html',
  styleUrls: ['./prompt-create-edit.component.scss']
})
export class PromptCreateEditComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isEditMode = false;
  loading = false;
  submitting = false;
  error = '';
  promptId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private promptService: PromptService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      content: ['', [Validators.required, Validators.maxLength(10000)]],
      description: ['', [Validators.maxLength(500)]],
      category: ['', [Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    // Check authentication
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
      return;
    }

    // Check if edit mode
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.isEditMode = true;
          this.promptId = id;
          this.loadPrompt(id);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPrompt(id: number): void {
    this.loading = true;
    this.error = '';

    this.promptService.getPromptById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (prompt) => {
          this.form.patchValue({
            title: prompt.title,
            content: prompt.content,
            description: prompt.description,
            category: prompt.category
          });
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Failed to load prompt. Please try again.';
          console.error('Error loading prompt:', error);
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    this.error = '';

    const formData = this.form.value;

    if (this.isEditMode && this.promptId) {
      // Update mode
      const updateRequest: UpdatePromptRequest = {
        title: formData.title,
        content: formData.content,
        description: formData.description,
        category: formData.category
      };

      this.promptService.updatePrompt(this.promptId, updateRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (prompt) => {
            this.submitting = false;
            this.router.navigate(['/prompts', prompt.id]);
          },
          error: (error) => {
            this.submitting = false;
            this.handleError(error);
          }
        });
    } else {
      // Create mode
      const createRequest: CreatePromptRequest = {
        title: formData.title,
        content: formData.content,
        description: formData.description,
        category: formData.category
      };

      this.promptService.createPrompt(createRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (prompt) => {
            this.submitting = false;
            this.router.navigate(['/prompts', prompt.id]);
          },
          error: (error) => {
            this.submitting = false;
            this.handleError(error);
          }
        });
    }
  }

  onCancel(): void {
    if (this.form.dirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) {
        return;
      }
    }
    this.location.back();
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.error = 'You are not authenticated. Please login.';
    } else if (error.status === 403) {
      this.error = 'You do not have permission to edit this prompt.';
    } else if (error.status === 404) {
      this.error = 'Prompt not found.';
    } else {
      this.error = error.error?.message || 'Failed to save prompt. Please try again.';
    }
    console.error('Error saving prompt:', error);
  }

  getCharCount(fieldName: string): number {
    const value = this.form.get(fieldName)?.value || '';
    return value.length;
  }

  getCharLimit(fieldName: string): number {
    const limits: { [key: string]: number } = {
      title: 255,
      content: 10000,
      description: 500,
      category: 100
    };
    return limits[fieldName] || 0;
  }
}
