import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};

/**
 * 权限路由守卫
 * 使用方式：
 * {
 *   path: 'users',
 *   canActivate: [permissionGuard],
 *   data: { permission: 'users:list' }
 * }
 */
export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 首先检查是否已认证
  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  // 获取路由配置的权限要求
  const permission = route.data?.['permission'] as string | undefined;
  const anyPermissions = route.data?.['anyPermissions'] as string[] | undefined;
  const allPermissions = route.data?.['allPermissions'] as string[] | undefined;

  // 单个权限检查
  if (permission && !auth.hasPermission(permission)) {
    return router.createUrlTree(['/403']);
  }

  // 任意权限检查
  if (anyPermissions && !auth.hasAnyPermission(anyPermissions)) {
    return router.createUrlTree(['/403']);
  }

  // 所有权限检查
  if (allPermissions && !auth.hasAllPermissions(allPermissions)) {
    return router.createUrlTree(['/403']);
  }

  return true;
};
