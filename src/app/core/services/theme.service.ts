import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly STORAGE_KEY = 'halolight-theme';

  /**
   * 当前主题设置（用户选择）
   */
  readonly theme = signal<Theme>(this.loadTheme());

  /**
   * 实际应用的主题（解析 system 后的结果）
   */
  readonly resolvedTheme = signal<'light' | 'dark'>(this.getSystemTheme());

  /**
   * 是否为暗色模式
   */
  readonly isDark = signal(this.resolvedTheme() === 'dark');

  constructor() {
    // 监听主题变化并应用
    effect(() => {
      const theme = this.theme();
      this.saveTheme(theme);
      this.applyTheme(theme);
    });

    // 监听系统主题变化
    if (this.isBrowser) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        if (this.theme() === 'system') {
          this.applyTheme('system');
        }
      });
    }
  }

  /**
   * 设置主题
   */
  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  /**
   * 切换暗色/亮色模式
   */
  toggle(): void {
    const current = this.resolvedTheme();
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }

  /**
   * 从存储加载主题
   */
  private loadTheme(): Theme {
    if (!this.isBrowser) {
      return 'dark';
    }
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'dark'; // 默认暗色主题
  }

  /**
   * 保存主题到存储
   */
  private saveTheme(theme: Theme): void {
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, theme);
    }
  }

  /**
   * 获取系统主题偏好
   */
  private getSystemTheme(): 'light' | 'dark' {
    if (!this.isBrowser) {
      return 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * 应用主题到 DOM
   */
  private applyTheme(theme: Theme): void {
    if (!this.isBrowser) {
      return;
    }

    const resolved = theme === 'system' ? this.getSystemTheme() : theme;
    this.resolvedTheme.set(resolved);
    this.isDark.set(resolved === 'dark');

    const root = document.documentElement;
    if (resolved === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }
}
