import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { vi } from 'vitest';
import { authGuard, guestGuard, permissionGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('Auth Guards', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: {
            createUrlTree: vi.fn((commands: string[]) => ({ commands })),
          },
        },
      ],
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('authGuard', () => {
    it('应该允许已认证用户访问', () => {
      authService.setAuth('token', { id: '1', email: 'test@test.com', name: 'Test' });

      const result = TestBed.runInInjectionContext(() => authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

      expect(result).toBe(true);
    });

    it('应该将未认证用户重定向到登录页', () => {
      const result = TestBed.runInInjectionContext(() => authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

      expect(result).toEqual({ commands: ['/auth/login'] });
    });
  });

  describe('guestGuard', () => {
    it('应该允许未认证用户访问', () => {
      const result = TestBed.runInInjectionContext(() => guestGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

      expect(result).toBe(true);
    });

    it('应该将已认证用户重定向到仪表盘', () => {
      authService.setAuth('token', { id: '1', email: 'test@test.com', name: 'Test' });

      const result = TestBed.runInInjectionContext(() => guestGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

      expect(result).toEqual({ commands: ['/dashboard'] });
    });
  });

  describe('permissionGuard', () => {
    it('应该将未认证用户重定向到登录页', () => {
      const route = { data: { permission: 'users:list' } } as unknown as ActivatedRouteSnapshot;

      const result = TestBed.runInInjectionContext(() => permissionGuard(route, {} as RouterStateSnapshot));

      expect(result).toEqual({ commands: ['/auth/login'] });
    });

    it('应该允许有权限的用户访问', () => {
      authService.setAuth('token', {
        id: '1',
        email: 'test@test.com',
        name: 'Test',
        permissions: ['users:list'],
      });

      const route = { data: { permission: 'users:list' } } as unknown as ActivatedRouteSnapshot;

      const result = TestBed.runInInjectionContext(() => permissionGuard(route, {} as RouterStateSnapshot));

      expect(result).toBe(true);
    });

    it('应该将无权限用户重定向到 403 页', () => {
      authService.setAuth('token', {
        id: '1',
        email: 'test@test.com',
        name: 'Test',
        permissions: ['dashboard:view'],
      });

      const route = { data: { permission: 'users:delete' } } as unknown as ActivatedRouteSnapshot;

      const result = TestBed.runInInjectionContext(() => permissionGuard(route, {} as RouterStateSnapshot));

      expect(result).toEqual({ commands: ['/403'] });
    });

    it('应该检查 anyPermissions', () => {
      authService.setAuth('token', {
        id: '1',
        email: 'test@test.com',
        name: 'Test',
        permissions: ['users:list'],
      });

      const route = {
        data: { anyPermissions: ['users:list', 'users:delete'] },
      } as unknown as ActivatedRouteSnapshot;

      const result = TestBed.runInInjectionContext(() => permissionGuard(route, {} as RouterStateSnapshot));

      expect(result).toBe(true);
    });

    it('应该检查 allPermissions', () => {
      authService.setAuth('token', {
        id: '1',
        email: 'test@test.com',
        name: 'Test',
        permissions: ['users:list', 'users:view'],
      });

      const route = {
        data: { allPermissions: ['users:list', 'users:view'] },
      } as unknown as ActivatedRouteSnapshot;

      const result = TestBed.runInInjectionContext(() => permissionGuard(route, {} as RouterStateSnapshot));

      expect(result).toBe(true);
    });
  });
});
