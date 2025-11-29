import { Component, inject } from '@angular/core';
import { LucideAngularModule, Sun, Moon, Monitor } from 'lucide-angular';
import { ThemeService, Theme } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="relative">
      <button
        type="button"
        class="rounded-md p-2 hover:bg-accent transition-colors"
        (click)="toggleMenu()"
        [attr.aria-label]="'切换主题'"
      >
        @if (themeService.isDark()) {
          <lucide-angular [img]="MoonIcon" class="h-5 w-5" />
        } @else {
          <lucide-angular [img]="SunIcon" class="h-5 w-5" />
        }
      </button>

      @if (menuOpen) {
        <div
          class="absolute right-0 top-full mt-2 w-36 rounded-md border border-border bg-card shadow-lg"
        >
          <div class="p-1">
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent transition-colors"
              [class.bg-accent]="themeService.theme() === 'light'"
              (click)="setTheme('light')"
            >
              <lucide-angular [img]="SunIcon" class="h-4 w-4" />
              <span>亮色</span>
            </button>
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent transition-colors"
              [class.bg-accent]="themeService.theme() === 'dark'"
              (click)="setTheme('dark')"
            >
              <lucide-angular [img]="MoonIcon" class="h-4 w-4" />
              <span>暗色</span>
            </button>
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent transition-colors"
              [class.bg-accent]="themeService.theme() === 'system'"
              (click)="setTheme('system')"
            >
              <lucide-angular [img]="MonitorIcon" class="h-4 w-4" />
              <span>跟随系统</span>
            </button>
          </div>
        </div>
      }
    </div>

    @if (menuOpen) {
      <div
        class="fixed inset-0 z-40"
        (click)="menuOpen = false"
      ></div>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
    .relative {
      z-index: 50;
    }
  `,
})
export class ThemeToggleComponent {
  protected readonly themeService = inject(ThemeService);

  protected readonly SunIcon = Sun;
  protected readonly MoonIcon = Moon;
  protected readonly MonitorIcon = Monitor;

  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
    this.menuOpen = false;
  }
}
