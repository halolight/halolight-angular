import { Component, inject, signal, ElementRef, ViewChild, AfterViewInit, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { LucideAngularModule, Search, Command, ArrowRight, Home, BarChart3, Users, Settings, Moon, Sun, FileText, Calendar, Bell, HelpCircle } from 'lucide-angular';
import { CommandPaletteService, CommandItem } from './command-palette.service';
import { cn } from '../../lib/utils';

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, KeyValuePipe],
  template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        (click)="close()"
      ></div>

      <!-- Dialog -->
      <div class="fixed left-1/2 top-1/4 z-50 w-full max-w-lg -translate-x-1/2 rounded-lg border bg-popover shadow-lg">
        <!-- Search input -->
        <div class="flex items-center border-b px-3">
          <lucide-angular [img]="SearchIcon" class="h-4 w-4 shrink-0 opacity-50" />
          <input
            #searchInput
            type="text"
            placeholder="搜索命令..."
            class="flex h-11 w-full rounded-md bg-transparent py-3 pl-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            [ngModel]="searchQuery()"
            (ngModelChange)="onSearchChange($event)"
            (keydown)="onKeyDown($event)"
          />
          <kbd class="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            <span class="text-xs">ESC</span>
          </kbd>
        </div>

        <!-- Commands list -->
        <div class="max-h-[300px] overflow-y-auto p-2">
          @if (filteredCommands().length === 0) {
            <div class="py-6 text-center text-sm text-muted-foreground">
              没有找到匹配的命令
            </div>
          } @else {
            @for (group of groupedCommands() | keyvalue; track group.key) {
              <div class="mb-2">
                <div class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  {{ group.key }}
                </div>
                @for (command of group.value; track command.id; let i = $index) {
                  <button
                    type="button"
                    [class]="commandClass(command, isSelected(command))"
                    (click)="executeCommand(command)"
                    (mouseenter)="setSelectedIndex(getCommandIndex(command))"
                  >
                    <div class="flex items-center gap-2">
                      @if (command.icon) {
                        <lucide-angular [img]="command.icon" class="h-4 w-4" />
                      }
                      <span>{{ command.label }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      @if (command.shortcut) {
                        <kbd class="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground flex">
                          {{ command.shortcut }}
                        </kbd>
                      }
                      <lucide-angular [img]="ArrowRightIcon" class="h-4 w-4 opacity-50" />
                    </div>
                  </button>
                }
              </div>
            }
          }
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
          <div class="flex items-center gap-2">
            <kbd class="rounded border bg-muted px-1.5 py-0.5 font-mono">↑↓</kbd>
            <span>选择</span>
          </div>
          <div class="flex items-center gap-2">
            <kbd class="rounded border bg-muted px-1.5 py-0.5 font-mono">↵</kbd>
            <span>执行</span>
          </div>
        </div>
      </div>
    }
  `,
})
export class CommandPaletteComponent implements AfterViewInit {
  private readonly commandPaletteService = inject(CommandPaletteService);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  protected readonly SearchIcon = Search;
  protected readonly CommandIcon = Command;
  protected readonly ArrowRightIcon = ArrowRight;

  readonly isOpen = this.commandPaletteService.isOpen;
  readonly searchQuery = this.commandPaletteService.searchQuery;
  readonly filteredCommands = this.commandPaletteService.filteredCommands;
  readonly groupedCommands = this.commandPaletteService.groupedCommands;

  readonly selectedIndex = signal(0);

  constructor() {
    // Register default commands
    this.registerDefaultCommands();

    // Reset selection when filtered commands change
    effect(() => {
      this.filteredCommands();
      this.selectedIndex.set(0);
    });

    // Focus input when opened
    effect(() => {
      if (this.isOpen() && this.searchInput) {
        setTimeout(() => {
          this.searchInput.nativeElement.focus();
        }, 50);
      }
    });
  }

  ngAfterViewInit(): void {
    // Focus input when dialog opens
    if (this.isOpen()) {
      this.searchInput?.nativeElement.focus();
    }
  }

  private registerDefaultCommands(): void {
    const defaultCommands: CommandItem[] = [
      // Navigation
      { id: 'nav-dashboard', label: '仪表盘', icon: Home, type: 'navigation', path: '/dashboard', group: '导航', keywords: ['home', '首页'] },
      { id: 'nav-analytics', label: '数据分析', icon: BarChart3, type: 'navigation', path: '/analytics', group: '导航', keywords: ['chart', '图表', '统计'] },
      { id: 'nav-users', label: '用户管理', icon: Users, type: 'navigation', path: '/users', group: '导航', keywords: ['user', '成员'] },
      { id: 'nav-settings', label: '系统设置', icon: Settings, type: 'navigation', path: '/settings', group: '导航', keywords: ['config', '配置'] },
      { id: 'nav-files', label: '文件管理', icon: FileText, type: 'navigation', path: '/files', group: '导航', keywords: ['file', '文档'] },
      { id: 'nav-calendar', label: '日历', icon: Calendar, type: 'navigation', path: '/calendar', group: '导航', keywords: ['schedule', '日程'] },
      { id: 'nav-notifications', label: '通知中心', icon: Bell, type: 'navigation', path: '/notifications', group: '导航', keywords: ['message', '消息'] },

      // Theme
      { id: 'theme-dark', label: '切换到暗色主题', icon: Moon, type: 'theme', group: '主题', action: () => this.setTheme('dark') },
      { id: 'theme-light', label: '切换到亮色主题', icon: Sun, type: 'theme', group: '主题', action: () => this.setTheme('light') },

      // Help
      { id: 'help', label: '帮助文档', icon: HelpCircle, type: 'action', group: '帮助', action: () => window.open('https://github.com/halolight/halolight-angular', '_blank') },
    ];

    this.commandPaletteService.registerCommands(defaultCommands);
  }

  private setTheme(theme: 'dark' | 'light'): void {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }

  protected commandClass(command: CommandItem, selected: boolean): string {
    return cn(
      'flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm cursor-pointer',
      'hover:bg-accent hover:text-accent-foreground',
      selected && 'bg-accent text-accent-foreground'
    );
  }

  protected isSelected(command: CommandItem): boolean {
    const commands = this.filteredCommands();
    const index = commands.findIndex(c => c.id === command.id);
    return index === this.selectedIndex();
  }

  protected getCommandIndex(command: CommandItem): number {
    return this.filteredCommands().findIndex(c => c.id === command.id);
  }

  protected setSelectedIndex(index: number): void {
    this.selectedIndex.set(index);
  }

  onSearchChange(query: string): void {
    this.commandPaletteService.setSearchQuery(query);
  }

  onKeyDown(event: KeyboardEvent): void {
    const commands = this.filteredCommands();
    const currentIndex = this.selectedIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex.set(Math.min(currentIndex + 1, commands.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex.set(Math.max(currentIndex - 1, 0));
        break;
      case 'Enter':
        event.preventDefault();
        if (commands[currentIndex]) {
          this.executeCommand(commands[currentIndex]);
        }
        break;
    }
  }

  executeCommand(command: CommandItem): void {
    this.commandPaletteService.executeCommand(command);
  }

  close(): void {
    this.commandPaletteService.close();
  }
}

// Re-export service
export { CommandPaletteService, type CommandItem, type CommandType } from './command-palette.service';
