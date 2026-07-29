import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, AuthInterceptor]
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should add X-API-Key header when API key is present', (done) => {
    localStorage.setItem('apiKey', 'test-api-key-123');

    httpClient.get('http://localhost:8080/api/test').subscribe(() => {
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/test');
    expect(req.request.headers.has('X-API-Key')).toBe(true);
    expect(req.request.headers.get('X-API-Key')).toBe('test-api-key-123');
    req.flush({});
  });

  it('should not add X-API-Key header when no API key is present', (done) => {
    localStorage.clear();

    httpClient.get('http://localhost:8080/api/test').subscribe(() => {
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/test');
    expect(req.request.headers.has('X-API-Key')).toBe(false);
    req.flush({});
  });

  it('should preserve existing headers when adding API key', (done) => {
    localStorage.setItem('apiKey', 'test-key');

    httpClient
      .get('http://localhost:8080/api/test', {
        headers: { 'Custom-Header': 'custom-value' }
      })
      .subscribe(() => {
        done();
      });

    const req = httpMock.expectOne('http://localhost:8080/api/test');
    expect(req.request.headers.has('X-API-Key')).toBe(true);
    expect(req.request.headers.has('Custom-Header')).toBe(true);
    expect(req.request.headers.get('Custom-Header')).toBe('custom-value');
    req.flush({});
  });

  it('should work with POST requests', (done) => {
    localStorage.setItem('apiKey', 'test-key');

    httpClient.post('http://localhost:8080/api/test', { data: 'test' }).subscribe(() => {
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/test');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('X-API-Key')).toBe('test-key');
    req.flush({});
  });

  it('should work with PUT requests', (done) => {
    localStorage.setItem('apiKey', 'test-key');

    httpClient.put('http://localhost:8080/api/test/1', { data: 'updated' }).subscribe(() => {
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/test/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('X-API-Key')).toBe('test-key');
    req.flush({});
  });

  it('should work with DELETE requests', (done) => {
    localStorage.setItem('apiKey', 'test-key');

    httpClient.delete('http://localhost:8080/api/test/1').subscribe(() => {
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/test/1');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('X-API-Key')).toBe('test-key');
    req.flush({});
  });

  it('should update header when API key changes', (done) => {
    localStorage.setItem('apiKey', 'key-1');

    httpClient.get('http://localhost:8080/api/test1').subscribe(() => {
      localStorage.setItem('apiKey', 'key-2');

      httpClient.get('http://localhost:8080/api/test2').subscribe(() => {
        done();
      });

      const req2 = httpMock.expectOne('http://localhost:8080/api/test2');
      expect(req2.request.headers.get('X-API-Key')).toBe('key-2');
      req2.flush({});
    });

    const req1 = httpMock.expectOne('http://localhost:8080/api/test1');
    expect(req1.request.headers.get('X-API-Key')).toBe('key-1');
    req1.flush({});
  });
});
