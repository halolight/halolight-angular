import { Component, inject, OnInit } from '@angular/core';
import { GridsterModule, GridsterConfig, GridsterItem, DisplayGrid, GridType, CompactType } from 'angular-gridster2';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/ui';
import { LineChartComponent, BarChartComponent, PieChartComponent } from '../../shared/components/charts';
import { LucideAngularModule, Edit, Check, RotateCcw, Plus } from 'lucide-angular';
import { DashboardStore, DashboardWidget } from './dashboard.store';
import { WidgetWrapperComponent, StatsWidgetComponent, RecentActivityWidgetComponent, QuickActionsWidgetComponent, NotificationsWidgetComponent, TasksWidgetComponent, CalendarWidgetComponent } from './widgets';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    GridsterModule,
    ButtonComponent,
    LineChartComponent,
    BarChartComponent,
    PieChartComponent,
    LucideAngularModule,
    WidgetWrapperComponent,
    StatsWidgetComponent,
    RecentActivityWidgetComponent,
    QuickActionsWidgetComponent,
    NotificationsWidgetComponent,
    TasksWidgetComponent,
    CalendarWidgetComponent,
  ],
  template: `
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-foreground">
            欢迎回来，{{ auth.user()?.name || '用户' }}
          </h1>
          <p class="text-muted-foreground mt-1">这是您的仪表盘概览</p>
        </div>
        <div class="flex items-center gap-2">
          <ui-button variant="outline" size="sm" (click)="store.toggleEditing()">
            @if (store.isEditing()) {
              <lucide-angular [img]="CheckIcon" class="h-4 w-4 mr-2" />
              完成
            } @else {
              <lucide-angular [img]="EditIcon" class="h-4 w-4 mr-2" />
              编辑布局
            }
          </ui-button>
          @if (store.isEditing()) {
            <ui-button variant="outline" size="sm" (click)="store.resetLayout()">
              <lucide-angular [img]="RotateCcwIcon" class="h-4 w-4 mr-2" />
              重置
            </ui-button>
          }
        </div>
      </div>

      <!-- Gridster Dashboard -->
      <gridster [options]="options" class="dashboard-grid">
        @for (item of store.widgets(); track item.id) {
          <gridster-item [item]="item" class="dashboard-item">
            <app-widget-wrapper
              [widget]="item.widget"
              (onRemove)="store.removeWidget(item.id)"
            >
              @switch (item.widget.type) {
                @case ('stats') {
                  <app-stats-widget
                    [value]="getSettingValue(item.widget.settings, 'value', '0')"
                    [change]="getSettingValue(item.widget.settings, 'change', '')"
                    [changeType]="getSettingChangeType(item.widget.settings)"
                  />
                }
                @case ('chart-line') {
                  <app-line-chart
                    [xAxisData]="visitTrendXAxis"
                    [seriesData]="visitTrendSeries"
                    [smooth]="true"
                    [areaStyle]="true"
                    height="100%"
                  />
                }
                @case ('chart-pie') {
                  <app-pie-chart
                    [data]="userDistributionData"
                    [doughnut]="true"
                    height="100%"
                  />
                }
                @case ('chart-bar') {
                  <app-bar-chart
                    [xAxisData]="revenueXAxis"
                    [seriesData]="revenueSeries"
                    height="100%"
                  />
                }
                @case ('recent-activity') {
                  <app-recent-activity-widget />
                }
                @case ('quick-actions') {
                  <app-quick-actions-widget />
                }
                @case ('notifications') {
                  <app-notifications-widget />
                }
                @case ('tasks') {
                  <app-tasks-widget />
                }
                @case ('calendar') {
                  <app-calendar-widget />
                }
              }
            </app-widget-wrapper>
          </gridster-item>
        }
      </gridster>
    </div>
  `,
  styles: [`
    :host ::ng-deep .dashboard-grid {
      min-height: calc(100vh - 250px);
      background: transparent !important;
    }
    :host ::ng-deep .dashboard-item {
      border-radius: 0.5rem;
      overflow: hidden;
    }
    :host ::ng-deep .gridster-item-resizable-handler {
      display: none;
    }
    :host ::ng-deep .dashboard-grid.editing .gridster-item-resizable-handler {
      display: block;
    }
  `],
})
export class DashboardPage implements OnInit {
  protected readonly auth = inject(AuthService);
  protected readonly store = inject(DashboardStore);

  readonly EditIcon = Edit;
  readonly CheckIcon = Check;
  readonly RotateCcwIcon = RotateCcw;
  readonly PlusIcon = Plus;

  options: GridsterConfig = {};

  // Chart data
  readonly visitTrendXAxis = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  readonly visitTrendSeries = [
    { name: '访问量', data: [820, 932, 901, 934, 1290, 1330, 1320] },
    { name: '独立访客', data: [620, 732, 701, 734, 1090, 1130, 1120] },
  ];

  readonly userDistributionData = [
    { name: '直接访问', value: 335 },
    { name: '邮件营销', value: 310 },
    { name: '联盟广告', value: 234 },
    { name: '视频广告', value: 135 },
    { name: '搜索引擎', value: 548 },
  ];

  readonly revenueXAxis = ['1月', '2月', '3月', '4月', '5月', '6月'];
  readonly revenueSeries = [
    { name: '收入', data: [12000, 15000, 18000, 14000, 22000, 25000] },
  ];

  ngOnInit(): void {
    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.None,
      displayGrid: DisplayGrid.None,
      pushItems: true,
      draggable: {
        enabled: true,
        dragHandleClass: 'drag-handle',
      },
      resizable: {
        enabled: true,
      },
      minCols: 12,
      maxCols: 12,
      minRows: 10,
      maxRows: 100,
      margin: 16,
      outerMargin: true,
      outerMarginTop: 0,
      outerMarginRight: 0,
      outerMarginBottom: 0,
      outerMarginLeft: 0,
      mobileBreakpoint: 768,
      itemChangeCallback: (item: GridsterItem) => {
        this.store.updateWidgetPosition(item as DashboardWidget);
      },
    };
  }

  getSettingValue(settings: Record<string, unknown> | undefined, key: string, defaultValue: string): string {
    if (!settings || !(key in settings)) return defaultValue;
    return String(settings[key] ?? defaultValue);
  }

  getSettingChangeType(settings: Record<string, unknown> | undefined): 'positive' | 'negative' | 'neutral' {
    if (!settings || !('changeType' in settings)) return 'neutral';
    const value = settings['changeType'];
    if (value === 'positive' || value === 'negative' || value === 'neutral') {
      return value;
    }
    return 'neutral';
  }
}
