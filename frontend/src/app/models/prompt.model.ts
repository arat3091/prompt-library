/**
 * Prompt model interfaces for API communication
 */

export interface Prompt {
  id: number;
  title: string;
  content: string;
  author: string;
  userId: number;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface CreatePromptRequest {
  title: string;
  content: string;
  description?: string;
  category?: string;
}

export interface UpdatePromptRequest {
  title: string;
  content: string;
  description?: string;
  category?: string;
}

export interface PromptResponse extends Prompt {}

export interface PageResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
