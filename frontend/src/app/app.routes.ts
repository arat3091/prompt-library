import { Routes } from '@angular/router';
import { PromptListComponent } from './components/prompt-list/prompt-list.component';
import { PromptDetailComponent } from './components/prompt-detail/prompt-detail.component';
import { PromptCreateEditComponent } from './components/prompt-create-edit/prompt-create-edit.component';

export const routes: Routes = [
  { path: '', component: PromptListComponent },
  { path: 'prompts/:id', component: PromptDetailComponent },
  { path: 'prompts/:id/edit', component: PromptCreateEditComponent },
  { path: 'prompts/create', component: PromptCreateEditComponent },
  { path: '**', redirectTo: '' }
];
