import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PromptService } from '../../services/prompt.service';
import { AuthService } from '../../services/auth.service';
import { Prompt, User } from '../../models';

@Component({
  selector: 'app-prompt-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './prompt-detail.component.html',
  styleUrls: ['./prompt-detail.component.scss']
})
export class PromptDetailComponent implements OnInit, OnDestroy {
  prompt: Prompt | null = null;
  currentUser: User | null = null;
  loading = false;
  error = '';
  isAuthor = false;
  private destroy$ = new Subject<void>();
  private promptId: number | null = null;

  constructor(
    private promptService: PromptService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Get current user
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        this.checkIfAuthor();
      });

    // Get prompt ID from route and load prompt
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params['id'];
        if (id) {
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
        next: (prompt: Prompt) => {
          this.prompt = prompt;
          this.loading = false;
          this.checkIfAuthor();
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 404) {
            this.error = 'Prompt not found';
          } else {
            this.error = 'Failed to load prompt. Please try again.';
          }
          console.error('Error loading prompt:', error);
        }
      });
  }

  private checkIfAuthor(): void {
    if (this.prompt && this.currentUser) {
      this.isAuthor = this.prompt.userId === this.currentUser.id;
    } else {
      this.isAuthor = false;
    }
  }

  goBack(): void {
    this.location.back();
  }

  editPrompt(): void {
    if (this.promptId) {
      this.router.navigate(['/prompts', this.promptId, 'edit']);
    }
  }

  retryLoad(): void {
    if (this.promptId) {
      this.loadPrompt(this.promptId);
    }
  }
}
