import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar token do localStorage', () => {
    localStorage.setItem('token', 'abc123');
    expect(service.getToken()).toBe('abc123');
  });

  it('deve retornar null se não houver token', () => {
    expect(service.getToken()).toBeNull();
  });

  it('deve definir token no localStorage', () => {
    service.setToken('xyz789');
    expect(localStorage.getItem('token')).toBe('xyz789');
  });

  it('deve retornar true se autenticado', () => {
    localStorage.setItem('token', 'token');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('deve retornar false se não autenticado', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('deve fazer login e salvar token/user', () => {
    const mockUser = { id: '1', email: 'test@test.com', name: 'Test', createdAt: '2024-01-01' };
    const mockResponse = { token: 'jwt-token', user: mockUser };

    service.login({ email: 'test@test.com', password: 'pass' }).subscribe((user) => {
      expect(user.email).toBe('test@test.com');
      expect(localStorage.getItem('token')).toBe('jwt-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('deve fazer register com POST', () => {
    service.register({ name: 'Test', email: 'test@test.com', password: 'pass123' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.name).toBe('Test');
    req.flush({});
  });

  it('deve limpar dados no logout', () => {
    spyOn(router, 'navigate');
    localStorage.setItem('token', 'tok');
    localStorage.setItem('user', '{}');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
