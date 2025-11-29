import { Directive, input, inject, effect, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

/**
 * 权限指令 - 根据权限显示/隐藏元素
 *
 * 使用方式:
 * <button *appPermission="'users:delete'">删除</button>
 * <button [appPermission]="'users:delete'">删除</button>
 */
@Directive({
  selector: '[appPermission]',
  standalone: true,
})
export class PermissionDirective {
  private readonly auth = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);

  private hasView = false;

  readonly appPermission = input.required<string>();

  constructor() {
    effect(() => {
      const permission = this.appPermission();
      const hasPermission = this.auth.hasPermission(permission);

      if (hasPermission && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!hasPermission && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
}

/**
 * 禁用权限指令 - 根据权限禁用元素
 *
 * 使用方式:
 * <button [appPermissionDisabled]="'users:delete'">删除</button>
 */
@Directive({
  selector: '[appPermissionDisabled]',
  standalone: true,
})
export class PermissionDisabledDirective {
  private readonly auth = inject(AuthService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly appPermissionDisabled = input.required<string>();

  constructor() {
    effect(() => {
      const permission = this.appPermissionDisabled();
      const hasPermission = this.auth.hasPermission(permission);
      const element = this.elementRef.nativeElement;

      if (!hasPermission) {
        element.setAttribute('disabled', 'true');
        element.classList.add('opacity-50', 'cursor-not-allowed');
      } else {
        element.removeAttribute('disabled');
        element.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    });
  }
}
