import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LucideAngularModule, ChevronRight, Home } from 'lucide-angular';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: any;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [LucideAngularModule, RouterLink],
  template: `
    <nav class="flex items-center space-x-1 text-sm text-muted-foreground">
      @for (item of breadcrumbs(); track item.path; let last = $last) {
        @if (!last) {
          <a
            [routerLink]="item.path"
            class="flex items-center hover:text-foreground transition-colors"
          >
            @if (item.icon) {
              <lucide-angular [img]="item.icon" class="h-4 w-4" />
            } @else {
              <span>{{ item.label }}</span>
            }
          </a>
          <lucide-angular [img]="ChevronRightIcon" class="h-4 w-4 text-muted-foreground/50" />
        } @else {
          <span class="font-medium text-foreground">{{ item.label }}</span>
        }
      }
    </nav>
  `,
})
export class BreadcrumbComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly ChevronRightIcon = ChevronRight;
  protected readonly HomeIcon = Home;

  /**
   * 路由路径与中文标签的映射
   */
  private readonly routeLabels: Record<string, string> = {
    dashboard: '仪表盘',
    analytics: '数据分析',
    users: '用户管理',
    settings: '系统设置',
    profile: '个人中心',
    roles: '角色管理',
    auth: '认证',
    login: '登录',
    register: '注册',
    'forgot-password': '忘记密码',
    'reset-password': '重置密码',
  };

  /**
   * 根据当前路由生成面包屑
   */
  readonly breadcrumbs = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.buildBreadcrumbs())
    ),
    { initialValue: [] as BreadcrumbItem[] }
  );

  private buildBreadcrumbs(): BreadcrumbItem[] {
    const url = this.router.url.split('?')[0]; // 移除查询参数
    const segments = url.split('/').filter((s) => s);

    // 首页始终存在
    const breadcrumbs: BreadcrumbItem[] = [
      { label: '首页', path: '/dashboard', icon: Home },
    ];

    // 如果只在首页，直接返回
    if (segments.length === 0 || (segments.length === 1 && segments[0] === 'dashboard')) {
      return breadcrumbs;
    }

    // 构建面包屑路径
    let currentPath = '';
    for (const segment of segments) {
      currentPath += `/${segment}`;

      // 跳过首页（已添加）
      if (segment === 'dashboard') {
        continue;
      }

      // 获取标签
      const label = this.routeLabels[segment] || segment;

      breadcrumbs.push({
        label,
        path: currentPath,
      });
    }

    return breadcrumbs;
  }
}
