import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prompt, CreatePromptRequest, UpdatePromptRequest, PromptResponse, PageResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  /**
   * Get all prompts with pagination and sorting
   */
  getPrompts(page: number, size: number, sortBy: string, sortDirection: string): Observable<PageResponse<Prompt>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sortBy)
      .set('direction', sortDirection);

    return this.http.get<PageResponse<Prompt>>(`${this.apiUrl}/prompts`, { params });
  }

  /**
   * Get a single prompt by ID
   */
  getPromptById(id: number): Observable<Prompt> {
    return this.http.get<Prompt>(`${this.apiUrl}/prompts/${id}`);
  }

  /**
   * Create a new prompt (requires authentication)
   */
  createPrompt(request: CreatePromptRequest): Observable<PromptResponse> {
    return this.http.post<PromptResponse>(`${this.apiUrl}/prompts`, request);
  }

  /**
   * Update an existing prompt (requires authentication and ownership)
   */
  updatePrompt(id: number, request: UpdatePromptRequest): Observable<PromptResponse> {
    return this.http.put<PromptResponse>(`${this.apiUrl}/prompts/${id}`, request);
  }

  /**
   * Delete a prompt (requires authentication and ownership)
   */
  deletePrompt(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/prompts/${id}`);
  }
}
