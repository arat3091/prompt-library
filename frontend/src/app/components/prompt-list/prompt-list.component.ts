import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PromptService } from '../../services/prompt.service';
import { Prompt, PageResponse } from '../../models';

@Component({
  selector: 'app-prompt-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './prompt-list.component.html',
  styleUrls: ['./prompt-list.component.scss']
})
export class PromptListComponent implements OnInit, OnDestroy {
  prompts: Prompt[] = [];
  loading = false;
  error = '';
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;
  displayedColumns: string[] = ['title', 'author', 'category', 'createdAt', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(
    private promptService: PromptService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPrompts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPrompts(page: number = 0, size: number = 20): void {
    this.loading = true;
    this.error = '';

    this.promptService.getPrompts(page, size, 'createdAt', 'desc')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PageResponse<Prompt>) => {
          this.prompts = response.content;
          this.currentPage = response.currentPage;
          this.pageSize = response.pageSize;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Failed to load prompts. Please try again.';
          console.error('Error loading prompts:', error);
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.loadPrompts(event.pageIndex, event.pageSize);
  }

  viewPrompt(id: number): void {
    this.router.navigate(['/prompts', id]);
  }

  retryLoad(): void {
    this.loadPrompts();
  }
}
