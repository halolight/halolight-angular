import { Injectable, signal, computed } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';

export interface WidgetConfig {
  id: string;
  type:
    | 'stats'
    | 'chart-line'
    | 'chart-bar'
    | 'chart-pie'
    | 'recent-activity'
    | 'quick-actions'
    | 'notifications'
    | 'tasks'
    | 'calendar';
  title: string;
  settings?: Record<string, unknown>;
}

export interface DashboardWidget extends GridsterItem {
  id: string;
  widget: WidgetConfig;
}

const STORAGE_KEY = 'halolight-dashboard-layout';

const defaultWidgets: DashboardWidget[] = [
  { id: 'stats-1', x: 0, y: 0, cols: 3, rows: 2, widget: { id: 'stats-1', type: 'stats', title: '总用户数', settings: { value: '12,345', change: '+12%', changeType: 'positive' } } },
  { id: 'stats-2', x: 3, y: 0, cols: 3, rows: 2, widget: { id: 'stats-2', type: 'stats', title: '活跃用户', settings: { value: '8,901', change: '+5%', changeType: 'positive' } } },
  { id: 'stats-3', x: 6, y: 0, cols: 3, rows: 2, widget: { id: 'stats-3', type: 'stats', title: '总收入', settings: { value: '¥45,678', change: '-3%', changeType: 'negative' } } },
  { id: 'stats-4', x: 9, y: 0, cols: 3, rows: 2, widget: { id: 'stats-4', type: 'stats', title: '转化率', settings: { value: '3.2%', change: '无变化', changeType: 'neutral' } } },
  { id: 'chart-line', x: 0, y: 2, cols: 6, rows: 4, widget: { id: 'chart-line', type: 'chart-line', title: '访问趋势' } },
  { id: 'chart-pie', x: 6, y: 2, cols: 6, rows: 4, widget: { id: 'chart-pie', type: 'chart-pie', title: '用户分布' } },
  { id: 'chart-bar', x: 0, y: 6, cols: 6, rows: 4, widget: { id: 'chart-bar', type: 'chart-bar', title: '月度收入' } },
  { id: 'recent-activity', x: 6, y: 6, cols: 6, rows: 4, widget: { id: 'recent-activity', type: 'recent-activity', title: '最近活动' } },
  { id: 'quick-actions', x: 0, y: 10, cols: 4, rows: 3, widget: { id: 'quick-actions', type: 'quick-actions', title: '快捷操作' } },
  { id: 'notifications', x: 4, y: 10, cols: 4, rows: 3, widget: { id: 'notifications', type: 'notifications', title: '通知' } },
  { id: 'tasks', x: 8, y: 10, cols: 4, rows: 3, widget: { id: 'tasks', type: 'tasks', title: '任务' } },
  { id: 'calendar', x: 0, y: 13, cols: 12, rows: 4, widget: { id: 'calendar', type: 'calendar', title: '日历' } },
];

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly widgetsSignal = signal<DashboardWidget[]>(this.loadLayout());
  private readonly isEditingSignal = signal(false);

  readonly widgets = this.widgetsSignal.asReadonly();
  readonly isEditing = this.isEditingSignal.asReadonly();

  readonly widgetCount = computed(() => this.widgetsSignal().length);

  private loadLayout(): DashboardWidget[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore errors
    }
    return [...defaultWidgets];
  }

  private saveLayout(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.widgetsSignal()));
    } catch {
      // Ignore errors
    }
  }

  toggleEditing(): void {
    this.isEditingSignal.update((v) => !v);
    if (!this.isEditingSignal()) {
      this.saveLayout();
    }
  }

  updateWidgets(widgets: DashboardWidget[]): void {
    this.widgetsSignal.set(widgets);
  }

  updateWidgetPosition(widget: DashboardWidget): void {
    this.widgetsSignal.update((widgets) =>
      widgets.map((w) => (w.id === widget.id ? { ...widget } : w))
    );
  }

  removeWidget(id: string): void {
    this.widgetsSignal.update((widgets) => widgets.filter((w) => w.id !== id));
    this.saveLayout();
  }

  addWidget(widget: DashboardWidget): void {
    this.widgetsSignal.update((widgets) => [...widgets, widget]);
    this.saveLayout();
  }

  resetLayout(): void {
    this.widgetsSignal.set([...defaultWidgets]);
    this.saveLayout();
  }
}
