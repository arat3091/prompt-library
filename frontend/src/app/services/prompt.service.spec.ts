import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PromptService } from './prompt.service';
import { Prompt, CreatePromptRequest, PageResponse } from '../models';

describe('PromptService', () => {
  let service: PromptService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PromptService]
    });
    service = TestBed.inject(PromptService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getPrompts', () => {
    it('should fetch prompts with pagination', (done) => {
      const mockResponse: PageResponse<Prompt> = {
        content: [
          {
            id: 1,
            title: 'Test Prompt 1',
            content: 'Content 1',
            description: 'Description 1',
            category: 'Test',
            author: 'testuser',
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 0
          }
        ],
        totalElements: 1,
        totalPages: 1,
        size: 20,
        number: 0,
        empty: false
      };

      service.getPrompts(0, 20, 'createdAt', 'desc').subscribe((response) => {
        expect(response.content.length).toBe(1);
        expect(response.content[0].title).toBe('Test Prompt 1');
        done();
      });

      const req = httpMock.expectOne(
        'http://localhost:8080/api/prompts?page=0&size=20&sort=createdAt&direction=desc'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should use default pagination parameters', (done) => {
      service.getPrompts().subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(
        'http://localhost:8080/api/prompts?page=0&size=20&sort=createdAt&direction=desc'
      );
      expect(req.request.method).toBe('GET');
      req.flush({ content: [], totalElements: 0, totalPages: 0, size: 20, number: 0, empty: true });
    });
  });

  describe('getPromptById', () => {
    it('should fetch a single prompt by ID', (done) => {
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

      service.getPromptById(1).subscribe((prompt) => {
        expect(prompt.id).toBe(1);
        expect(prompt.title).toBe('Test Prompt');
        done();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/prompts/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockPrompt);
    });

    it('should handle 404 error for non-existent prompt', (done) => {
      service.getPromptById(999).subscribe(
        () => {
          fail('Should have failed');
        },
        (error) => {
          expect(error.status).toBe(404);
          done();
        }
      );

      const req = httpMock.expectOne('http://localhost:8080/api/prompts/999');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createPrompt', () => {
    it('should create a new prompt', (done) => {
      const createRequest: CreatePromptRequest = {
        title: 'New Prompt',
        content: 'New Content',
        description: 'New Description',
        category: 'New'
      };

      const mockResponse: Prompt = {
        id: 2,
        ...createRequest,
        author: 'testuser',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 0
      };

      service.createPrompt(createRequest).subscribe((prompt) => {
        expect(prompt.id).toBe(2);
        expect(prompt.title).toBe('New Prompt');
        done();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/prompts');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createRequest);
      req.flush(mockResponse);
    });

    it('should send correct create payload', (done) => {
      const createRequest: CreatePromptRequest = {
        title: 'Title',
        content: 'Content',
        description: 'Description',
        category: 'Category'
      };

      service.createPrompt(createRequest).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/prompts');
      expect(req.request.body).toEqual(createRequest);
      req.flush({});
    });
  });

  describe('updatePrompt', () => {
    it('should update an existing prompt', (done) => {
      const promptId = 1;
      const updateRequest: CreatePromptRequest = {
        title: 'Updated Title',
        content: 'Updated Content',
        description: 'Updated Description',
        category: 'Updated'
      };

      const mockResponse: Prompt = {
        id: promptId,
        ...updateRequest,
        author: 'testuser',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      };

      service.updatePrompt(promptId, updateRequest).subscribe((prompt) => {
        expect(prompt.title).toBe('Updated Title');
        expect(prompt.version).toBe(1);
        done();
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/prompts/${promptId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateRequest);
      req.flush(mockResponse);
    });
  });

  describe('deletePrompt', () => {
    it('should delete a prompt', (done) => {
      const promptId = 1;

      service.deletePrompt(promptId).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/prompts/${promptId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle delete error', (done) => {
      const promptId = 999;

      service.deletePrompt(promptId).subscribe(
        () => {
          fail('Should have failed');
        },
        (error) => {
          expect(error.status).toBe(403);
          done();
        }
      );

      const req = httpMock.expectOne(`http://localhost:8080/api/prompts/${promptId}`);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });
  });

  describe('API URL construction', () => {
    it('should construct correct API base URL', (done) => {
      service.getPrompts().subscribe(() => {
        done();
      });

      const req = httpMock.expectOne((request) => {
        return request.url.includes('http://localhost:8080/api/prompts');
      });
      req.flush({ content: [], totalElements: 0, totalPages: 0, size: 20, number: 0, empty: true });
    });
  });
});
