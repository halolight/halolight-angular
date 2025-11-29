import { Component, input, inject, computed } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-permission-guard',
  standalone: true,
  template: `
    @if (hasAccess()) {
      <ng-content />
    } @else {
      <ng-content select="[fallback]" />
    }
  `,
})
export class PermissionGuardComponent {
  private readonly auth = inject(AuthService);

  /**
   * 单个权限检查
   */
  readonly permission = input<string>('');

  /**
   * 多个权限检查（需要拥有任意一个）
   */
  readonly anyPermissions = input<string[]>([]);

  /**
   * 多个权限检查（需要拥有所有）
   */
  readonly allPermissions = input<string[]>([]);

  readonly hasAccess = computed(() => {
    const perm = this.permission();
    const anyPerms = this.anyPermissions();
    const allPerms = this.allPermissions();

    // 单个权限检查
    if (perm) {
      return this.auth.hasPermission(perm);
    }

    // 任意权限检查
    if (anyPerms.length > 0) {
      return this.auth.hasAnyPermission(anyPerms);
    }

    // 所有权限检查
    if (allPerms.length > 0) {
      return this.auth.hasAllPermissions(allPerms);
    }

    // 没有配置权限要求，默认允许
    return true;
  });
}
