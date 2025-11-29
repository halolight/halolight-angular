import { Injectable, signal, computed, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface TabItem {
  path: string;
  title: string;
  icon?: string;
  closable: boolean;
  cached: boolean;
}

const STORAGE_KEY = 'halolight-tabs';

@Injectable({ providedIn: 'root' })
export class TabBarService {
  private readonly router = inject(Router);

  private readonly tabsSignal = signal<TabItem[]>(this.loadTabs());
  private readonly activePathSignal = signal<string>('');

  readonly tabs = this.tabsSignal.asReadonly();
  readonly activePath = this.activePathSignal.asReadonly();

  readonly activeTab = computed(() => {
    const path = this.activePathSignal();
    return this.tabsSignal().find(tab => tab.path === path);
  });

  constructor() {
    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEvent = event as NavigationEnd;
        this.activePathSignal.set(navEvent.urlAfterRedirects);
      });

    // Set initial active path
    this.activePathSignal.set(this.router.url);
  }

  private loadTabs(): TabItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore errors
    }
    // Default tab
    return [
      { path: '/dashboard', title: '仪表盘', closable: false, cached: true },
    ];
  }

  private saveTabs(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tabsSignal()));
    } catch {
      // Ignore errors
    }
  }

  addTab(tab: Omit<TabItem, 'cached'>): void {
    const tabs = this.tabsSignal();
    const exists = tabs.find(t => t.path === tab.path);

    if (!exists) {
      this.tabsSignal.update(tabs => [
        ...tabs,
        { ...tab, cached: true },
      ]);
      this.saveTabs();
    }

    this.router.navigate([tab.path]);
  }

  closeTab(path: string): void {
    const tabs = this.tabsSignal();
    const tabIndex = tabs.findIndex(t => t.path === path);

    if (tabIndex === -1) return;

    const tab = tabs[tabIndex];
    if (!tab.closable) return;

    // Remove the tab
    this.tabsSignal.update(tabs => tabs.filter(t => t.path !== path));
    this.saveTabs();

    // If closing the active tab, navigate to another tab
    if (this.activePathSignal() === path) {
      const newTabs = this.tabsSignal();
      if (newTabs.length > 0) {
        // Navigate to the previous tab or the first tab
        const newIndex = Math.min(tabIndex, newTabs.length - 1);
        this.router.navigate([newTabs[newIndex].path]);
      }
    }
  }

  closeOtherTabs(path: string): void {
    this.tabsSignal.update(tabs =>
      tabs.filter(t => t.path === path || !t.closable)
    );
    this.saveTabs();

    if (!this.tabsSignal().find(t => t.path === this.activePathSignal())) {
      this.router.navigate([path]);
    }
  }

  closeAllTabs(): void {
    this.tabsSignal.update(tabs => tabs.filter(t => !t.closable));
    this.saveTabs();

    const remainingTabs = this.tabsSignal();
    if (remainingTabs.length > 0 && !remainingTabs.find(t => t.path === this.activePathSignal())) {
      this.router.navigate([remainingTabs[0].path]);
    }
  }

  closeRightTabs(path: string): void {
    const tabs = this.tabsSignal();
    const index = tabs.findIndex(t => t.path === path);

    if (index === -1) return;

    this.tabsSignal.update(tabs => {
      const leftTabs = tabs.slice(0, index + 1);
      const rightTabs = tabs.slice(index + 1).filter(t => !t.closable);
      return [...leftTabs, ...rightTabs];
    });
    this.saveTabs();

    if (!this.tabsSignal().find(t => t.path === this.activePathSignal())) {
      this.router.navigate([path]);
    }
  }

  refreshTab(path: string): void {
    // Trigger a refresh by setting cached to false and back
    this.tabsSignal.update(tabs =>
      tabs.map(t => t.path === path ? { ...t, cached: false } : t)
    );

    setTimeout(() => {
      this.tabsSignal.update(tabs =>
        tabs.map(t => t.path === path ? { ...t, cached: true } : t)
      );
    }, 100);
  }

  setTabTitle(path: string, title: string): void {
    this.tabsSignal.update(tabs =>
      tabs.map(t => t.path === path ? { ...t, title } : t)
    );
    this.saveTabs();
  }

  navigateToTab(path: string): void {
    this.router.navigate([path]);
  }
}
