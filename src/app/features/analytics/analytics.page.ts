import { Component } from '@angular/core';
import {
  CardComponent,
  CardContentComponent,
  CardDescriptionComponent,
  CardHeaderComponent,
  CardTitleComponent,
} from '../../shared/components/ui';

@Component({
  standalone: true,
  selector: 'app-analytics',
  imports: [
    CardComponent,
    CardContentComponent,
    CardDescriptionComponent,
    CardHeaderComponent,
    CardTitleComponent,
  ],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-semibold text-foreground">数据分析</h1>
        <p class="text-sm text-muted-foreground">查看关键指标和近期趋势。</p>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ui-card>
          <ui-card-header>
            <ui-card-title>活跃用户</ui-card-title>
            <ui-card-description>占位数据，待对接 API</ui-card-description>
          </ui-card-header>
          <ui-card-content class="text-3xl font-bold text-foreground">1,248</ui-card-content>
        </ui-card>

        <ui-card>
          <ui-card-header>
            <ui-card-title>收入</ui-card-title>
            <ui-card-description>本月累计</ui-card-description>
          </ui-card-header>
          <ui-card-content class="text-3xl font-bold text-foreground">¥ 98,300</ui-card-content>
        </ui-card>

        <ui-card>
          <ui-card-header>
            <ui-card-title>转化率</ui-card-title>
            <ui-card-description>对比上周 +2.4%</ui-card-description>
          </ui-card-header>
          <ui-card-content class="text-3xl font-bold text-foreground">12.4%</ui-card-content>
        </ui-card>
      </div>

      <ui-card>
        <ui-card-header>
          <ui-card-title>趋势图</ui-card-title>
          <ui-card-description>占位图表，待接入 ECharts</ui-card-description>
        </ui-card-header>
        <ui-card-content class="h-64 rounded-md border border-dashed border-border bg-muted/40 flex items-center justify-center text-sm text-muted-foreground">
          Chart placeholder
        </ui-card-content>
      </ui-card>
    </div>
  `,
})
export class AnalyticsPage {}
