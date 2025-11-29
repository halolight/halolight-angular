import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LucideAngularModule, Home, BarChart3, Users, Settings, Menu, Bell, Search, Shield, User, HelpCircle, LogOut } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { TabBarComponent } from '../../shared/components/tab-bar/tab-bar.component';
import { TabBarService } from '../../shared/components/tab-bar/tab-bar.service';
import { CommandPaletteService } from '../../shared/components/command-palette/command-palette.service';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { AvatarComponent, AvatarFallbackComponent } from '../../shared/components/ui/avatar/avatar.component';
import { DropdownComponent, DropdownMenuItem } from '../../shared/components/ui/dropdown/dropdown.component';
import { cn } from '../../shared/lib/utils';

interface MenuItem {
  path: string;
  label: string;
  icon: any;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule, TabBarComponent, ThemeToggleComponent, BreadcrumbComponent, FooterComponent, AvatarComponent, AvatarFallbackComponent, DropdownComponent],
  template: `
    <div class="min-h-screen bg-background">
      <!-- Mobile Sidebar Overlay -->
      @if (mobileMenuOpen()) {
        <div
          class="fixed inset-0 z-40 bg-black/50 lg:hidden"
          (click)="mobileMenuOpen.set(false)"
        ></div>
      }

      <!-- Sidebar -->
      <aside
        [class]="cn(
          'fixed left-0 top-0 z-50 h-screen border-r border-border bg-card transition-all duration-300',
          'lg:z-40',
          sidebarCollapsed() && !mobileMenuOpen() ? 'w-16' : 'w-64',
          mobileMenuOpen() ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )"
      >
        <!-- Logo -->
        <div class="flex h-16 items-center justify-between border-b border-border px-4">
          @if (!sidebarCollapsed() || mobileMenuOpen()) {
            <span class="text-xl font-bold text-foreground">Halolight</span>
            <!-- Mobile close button -->
            <button
              type="button"
              class="rounded-md p-2 hover:bg-accent transition-colors lg:hidden"
              (click)="mobileMenuOpen.set(false)"
            >
              <lucide-angular [img]="MenuIcon" class="h-5 w-5" />
            </button>
          } @else {
            <span class="text-xl font-bold text-foreground">H</span>
          }
        </div>

        <!-- Navigation -->
        <nav class="space-y-1 p-2">
          @for (item of menuItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-primary text-primary-foreground"
              [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
              [class]="cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                sidebarCollapsed() && !mobileMenuOpen() ? 'justify-center' : ''
              )"
              (click)="onMenuItemClick(item)"
            >
              <lucide-angular [img]="item.icon" class="h-5 w-5" />
              @if (!sidebarCollapsed() || mobileMenuOpen()) {
                <span>{{ item.label }}</span>
              }
            </a>
          }
        </nav>
      </aside>

      <!-- Main content -->
      <div [class]="cn('flex flex-col min-h-screen transition-all duration-300', 'lg:ml-64', sidebarCollapsed() ? 'lg:ml-16' : '')">
        <!-- Header -->
        <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div class="flex items-center gap-4">
            <!-- Mobile menu button -->
            <button
              type="button"
              class="rounded-md p-2 hover:bg-accent transition-colors lg:hidden"
              (click)="mobileMenuOpen.set(true)"
            >
              <lucide-angular [img]="MenuIcon" class="h-5 w-5" />
            </button>

            <!-- Desktop sidebar toggle -->
            <button
              type="button"
              class="hidden lg:block rounded-md p-2 hover:bg-accent transition-colors"
              (click)="toggleSidebar()"
            >
              <lucide-angular [img]="MenuIcon" class="h-5 w-5" />
            </button>

            <!-- Search -->
            <div
              class="hidden md:flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 cursor-pointer hover:border-primary transition-colors"
              (click)="openCommandPalette()"
            >
              <lucide-angular [img]="SearchIcon" class="h-4 w-4 text-muted-foreground" />
              <span class="w-40 lg:w-64 text-sm text-muted-foreground">搜索... (⌘K)</span>
            </div>
          </div>

          <!-- Right side -->
          <div class="flex items-center gap-2">
            <!-- Theme Toggle -->
            <app-theme-toggle />

            <!-- Notifications -->
            <button type="button" class="relative rounded-md p-2 hover:bg-accent transition-colors">
              <lucide-angular [img]="BellIcon" class="h-5 w-5" />
              <span class="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <!-- User menu -->
            <ui-dropdown [items]="userMenuItems" (onSelect)="onUserMenuSelect($event)">
              <button trigger type="button" class="relative h-9 w-9 rounded-full hover:ring-2 hover:ring-ring transition-all">
                <lucide-angular [img]="UserIcon" class="h-5 w-5" />
              </button>
            </ui-dropdown>
          </div>
        </header>

        <!-- Tab Bar -->
        <app-tab-bar />

        <!-- Page content -->
        <main class="flex-1 p-4 lg:p-6">
          <!-- Breadcrumb -->
          <app-breadcrumb class="mb-4 block" />

          <router-outlet />
        </main>

        <!-- Footer -->
        <app-footer />
      </div>
    </div>
  `,
})
export class AdminLayout {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly tabBarService = inject(TabBarService);
  private readonly commandPaletteService = inject(CommandPaletteService);
  protected readonly cn = cn;

  // Icons
  protected readonly MenuIcon = Menu;
  protected readonly SearchIcon = Search;
  protected readonly BellIcon = Bell;
  protected readonly UserIcon = User;
  protected readonly SettingsIcon = Settings;
  protected readonly HelpIcon = HelpCircle;
  protected readonly LogOutIcon = LogOut;

  readonly sidebarCollapsed = signal(false);
  readonly mobileMenuOpen = signal(false);

  readonly menuItems: MenuItem[] = [
    { path: '/dashboard', label: '仪表盘', icon: Home },
    { path: '/analytics', label: '数据分析', icon: BarChart3 },
    { path: '/users', label: '用户管理', icon: Users },
    { path: '/roles', label: '角色管理', icon: Shield },
    { path: '/settings', label: '系统设置', icon: Settings },
  ];

  readonly userMenuItems: DropdownMenuItem[] = [
    { label: '个人资料', value: 'profile' },
    { label: '账户设置', value: 'settings' },
    { label: '帮助文档', value: 'docs' },
    { separator: true },
    { label: '退出登录', value: 'logout' },
  ];

  protected userInitials(): string {
    const name = this.auth.user()?.name || '用户';
    return name.charAt(0).toUpperCase();
  }

  onMenuItemClick(item: MenuItem): void {
    this.tabBarService.addTab({
      path: item.path,
      title: item.label,
      closable: item.path !== '/dashboard',
    });
    // 在移动端点击菜单项后关闭侧边栏
    this.mobileMenuOpen.set(false);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  openCommandPalette(): void {
    this.commandPaletteService.open();
  }

  onUserMenuSelect(item: DropdownMenuItem): void {
    switch (item.value) {
      case 'profile':
        this.router.navigate(['/profile']);
        break;
      case 'settings':
        this.router.navigate(['/settings']);
        break;
      case 'docs':
        window.open('https://halolight.docs.h7ml.cn/', '_blank');
        break;
      case 'logout':
        this.logout();
        break;
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
