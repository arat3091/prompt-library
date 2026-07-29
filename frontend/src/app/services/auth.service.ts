import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, LoginRequest, RegisterUserRequest, LoginResponse, UserResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  public currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  /**
   * Register a new user
   */
  register(username: string, password: string, email?: string): Observable<UserResponse> {
    const request: RegisterUserRequest = { username, password, email };
    return this.http.post<UserResponse>(`${this.apiUrl}/users/register`, request).pipe(
      tap(response => {
        this.setApiKey(response.apiKey);
        this.currentUser$.next(response);
      })
    );
  }

  /**
   * Authenticate user and get API key
   */
  login(username: string, password: string): Observable<LoginResponse> {
    const request: LoginRequest = { username, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, request).pipe(
      tap(response => {
        this.setApiKey(response.apiKey);
        this.getCurrentUser().subscribe();
      })
    );
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/users/me`).pipe(
      tap(user => this.currentUser$.next(user))
    );
  }

  /**
   * Logout and clear authentication
   */
  logout(): void {
    this.setApiKey('');
    this.currentUser$.next(null);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getApiKey();
  }

  /**
   * Get API key from localStorage
   */
  getApiKey(): string {
    return localStorage.getItem('apiKey') || '';
  }

  /**
   * Store API key in localStorage
   */
  setApiKey(key: string): void {
    if (key) {
      localStorage.setItem('apiKey', key);
    } else {
      localStorage.removeItem('apiKey');
    }
  }

  /**
   * Load current user on app initialization
   */
  private loadCurrentUser(): void {
    if (this.isAuthenticated()) {
      this.getCurrentUser().subscribe({
        error: () => {
          // If API call fails, clear auth
          this.logout();
        }
      });
    }
  }
}
