import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User, LoginResponse, UserResponse } from '../models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('register', () => {
    it('should register a new user', (done) => {
      const mockResponse: UserResponse = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        apiKey: 'test-api-key-123',
        role: 'USER',
        createdAt: new Date()
      };

      service.register('testuser', 'password123', 'test@example.com').subscribe((response) => {
        expect(response.username).toBe('testuser');
        expect(response.apiKey).toBe('test-api-key-123');
        done();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/users/register');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should send correct registration payload', (done) => {
      service.register('user123', 'pass456', 'user@test.com').subscribe(() => {
        done();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/users/register');
      expect(req.request.body).toEqual({
        username: 'user123',
        password: 'pass456',
        email: 'user@test.com'
      });
      req.flush({});
    });
  });

  describe('login', () => {
    it('should login user with correct credentials', (done) => {
      const mockResponse: LoginResponse = {
        id: 1,
        username: 'testuser',
        apiKey: 'test-api-key-456'
      };

      service.login('testuser', 'password123').subscribe((response) => {
        expect(response.username).toBe('testuser');
        expect(response.apiKey).toBe('test-api-key-456');
        done();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/users/login');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should store API key in localStorage on login', (done) => {
      const mockResponse: LoginResponse = {
        id: 1,
        username: 'testuser',
        apiKey: 'stored-api-key'
      };

      service.login('testuser', 'password123').subscribe(() => {
        expect(localStorage.getItem('apiKey')).toBe('stored-api-key');
        done();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/users/login');
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should clear API key from localStorage', () => {
      localStorage.setItem('apiKey', 'test-key');
      service.logout();
      expect(localStorage.getItem('apiKey')).toBeNull();
    });

    it('should clear currentUser$', (done) => {
      localStorage.setItem('apiKey', 'test-key');
      service.currentUser$.subscribe((user) => {
        if (user === null) {
          done();
        }
      });
      service.logout();
    });
  });

  describe('getCurrentUser', () => {
    it('should fetch current user from API', (done) => {
      const mockUser: UserResponse = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        apiKey: 'test-key',
        role: 'USER',
        createdAt: new Date()
      };

      service.getCurrentUser().subscribe((user) => {
        expect(user.username).toBe('testuser');
        done();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/users/me');
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when API key exists', () => {
      localStorage.setItem('apiKey', 'test-key');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when API key does not exist', () => {
      localStorage.clear();
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getApiKey', () => {
    it('should return API key from localStorage', () => {
      localStorage.setItem('apiKey', 'my-api-key');
      expect(service.getApiKey()).toBe('my-api-key');
    });

    it('should return null when no API key in localStorage', () => {
      localStorage.clear();
      expect(service.getApiKey()).toBeNull();
    });
  });

  describe('setApiKey', () => {
    it('should store API key in localStorage', () => {
      service.setApiKey('new-api-key');
      expect(localStorage.getItem('apiKey')).toBe('new-api-key');
    });
  });

  describe('currentUser$', () => {
    it('should emit null initially', (done) => {
      localStorage.clear();
      service.currentUser$.subscribe((user) => {
        expect(user).toBeNull();
        done();
      });
    });

    it('should emit user after login', (done) => {
      const mockResponse: LoginResponse = {
        id: 1,
        username: 'testuser',
        apiKey: 'test-key'
      };

      service.login('testuser', 'password123').subscribe(() => {
        service.currentUser$.subscribe((user) => {
          if (user) {
            expect(user.username).toBe('testuser');
            done();
          }
        });
      });

      const req = httpMock.expectOne('http://localhost:8080/api/users/login');
      req.flush(mockResponse);
    });
  });
});
