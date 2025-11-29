import { Component, inject, signal, computed } from '@angular/core';
import { LucideAngularModule, X, RefreshCw, ChevronDown } from 'lucide-angular';
import { TabBarService, TabItem } from './tab-bar.service';
import { DropdownComponent, DropdownMenuItem } from '../ui/dropdown/dropdown.component';
import { cn } from '../../lib/utils';

// 右键菜单项接口
interface ContextMenuItem {
  label?: string;
  action?: string;
  disabled?: boolean;
  separator?: boolean;
}

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  imports: [LucideAngularModule, DropdownComponent],
  template: `
    <div class="flex items-center h-10 bg-background border-b px-2 gap-1 overflow-x-auto">
      <!-- Tabs -->
      @for (tab of tabs(); track tab.path) {
        <div
          [class]="tabClass(tab)"
          (click)="navigateToTab(tab.path)"
          (contextmenu)="onContextMenu($event, tab)"
        >
          <span class="truncate max-w-[120px]">{{ tab.title }}</span>
          @if (tab.closable) {
            <button
              type="button"
              class="ml-1 p-0.5 rounded hover:bg-muted transition-colors"
              (click)="closeTab($event, tab.path)"
            >
              <lucide-angular [img]="XIcon" class="h-3 w-3" />
            </button>
          }
        </div>
      }

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Actions Dropdown -->
      <ui-dropdown [items]="dropdownItems()" (onSelect)="onDropdownSelect($event)">
        <button trigger type="button" class="p-1.5 rounded hover:bg-muted transition-colors">
          <lucide-angular [img]="ChevronDownIcon" class="h-4 w-4" />
        </button>
      </ui-dropdown>
    </div>

    <!-- Context Menu -->
    @if (contextMenuVisible()) {
      <div
        class="fixed z-50 min-w-[150px] rounded-md border bg-popover p-1 shadow-md"
        [style.left.px]="contextMenuPosition().x"
        [style.top.px]="contextMenuPosition().y"
      >
        @for (item of contextMenuItems(); track item.label) {
          @if (item.separator) {
            <div class="-mx-1 my-1 h-px bg-muted"></div>
          } @else {
            <button
              type="button"
              class="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              [disabled]="item.disabled"
              (click)="onContextMenuSelect(item)"
            >
              {{ item.label }}
            </button>
          }
        }
      </div>
      <div
        class="fixed inset-0 z-40"
        (click)="closeContextMenu()"
      ></div>
    }
  `,
})
export class TabBarComponent {
  private readonly tabBarService = inject(TabBarService);

  protected readonly XIcon = X;
  protected readonly RefreshCwIcon = RefreshCw;
  protected readonly ChevronDownIcon = ChevronDown;

  readonly tabs = this.tabBarService.tabs;
  readonly activePath = this.tabBarService.activePath;

  // Context menu state
  readonly contextMenuVisible = signal(false);
  readonly contextMenuPosition = signal({ x: 0, y: 0 });
  readonly contextMenuTab = signal<TabItem | null>(null);

  readonly contextMenuItems = computed((): ContextMenuItem[] => {
    const tab = this.contextMenuTab();
    if (!tab) return [];

    return [
      { label: '刷新', action: 'refresh' },
      { separator: true },
      { label: '关闭', action: 'close', disabled: !tab.closable },
      { label: '关闭其他', action: 'closeOther' },
      { label: '关闭右侧', action: 'closeRight' },
      { label: '关闭所有', action: 'closeAll' },
    ];
  });

  readonly dropdownItems = computed((): DropdownMenuItem[] => [
    { label: '刷新当前', value: 'refresh' },
    { separator: true },
    { label: '关闭当前', value: 'closeCurrent' },
    { label: '关闭其他', value: 'closeOther' },
    { label: '关闭所有', value: 'closeAll' },
  ]);

  protected tabClass(tab: TabItem): string {
    const isActive = this.activePath() === tab.path;
    return cn(
      'flex items-center gap-1 px-3 py-1.5 text-sm rounded-t-md cursor-pointer transition-colors',
      'border border-b-0 -mb-px',
      isActive
        ? 'bg-background text-foreground border-border'
        : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted'
    );
  }

  navigateToTab(path: string): void {
    this.tabBarService.navigateToTab(path);
  }

  closeTab(event: Event, path: string): void {
    event.stopPropagation();
    this.tabBarService.closeTab(path);
  }

  onContextMenu(event: MouseEvent, tab: TabItem): void {
    event.preventDefault();
    this.contextMenuTab.set(tab);
    this.contextMenuPosition.set({ x: event.clientX, y: event.clientY });
    this.contextMenuVisible.set(true);
  }

  closeContextMenu(): void {
    this.contextMenuVisible.set(false);
    this.contextMenuTab.set(null);
  }

  onContextMenuSelect(item: ContextMenuItem): void {
    const tab = this.contextMenuTab();
    if (!tab) return;

    switch (item.action) {
      case 'refresh':
        this.tabBarService.refreshTab(tab.path);
        break;
      case 'close':
        this.tabBarService.closeTab(tab.path);
        break;
      case 'closeOther':
        this.tabBarService.closeOtherTabs(tab.path);
        break;
      case 'closeRight':
        this.tabBarService.closeRightTabs(tab.path);
        break;
      case 'closeAll':
        this.tabBarService.closeAllTabs();
        break;
    }

    this.closeContextMenu();
  }

  onDropdownSelect(item: DropdownMenuItem): void {
    const activePath = this.activePath();

    switch (item.value) {
      case 'refresh':
        this.tabBarService.refreshTab(activePath);
        break;
      case 'closeCurrent':
        this.tabBarService.closeTab(activePath);
        break;
      case 'closeOther':
        this.tabBarService.closeOtherTabs(activePath);
        break;
      case 'closeAll':
        this.tabBarService.closeAllTabs();
        break;
    }
  }
}
