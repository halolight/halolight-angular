import { Component, input, OnInit, effect, signal } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';

// Register required components
echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer]);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  template: `
    <div
      echarts
      [options]="chartOptions()"
      [merge]="mergeOptions()"
      class="w-full"
      [style.height]="height()"
    ></div>
  `,
})
export class LineChartComponent implements OnInit {
  readonly title = input<string>('');
  readonly data = input<{ name: string; value: number }[]>([]);
  readonly xAxisData = input<string[]>([]);
  readonly seriesData = input<{ name: string; data: number[] }[]>([]);
  readonly height = input<string>('300px');
  readonly showLegend = input<boolean>(true);
  readonly smooth = input<boolean>(true);
  readonly areaStyle = input<boolean>(false);

  readonly chartOptions = signal<EChartsOption>({});
  readonly mergeOptions = signal<EChartsOption>({});

  constructor() {
    effect(() => {
      this.updateChartOptions();
    });
  }

  ngOnInit(): void {
    this.updateChartOptions();
  }

  private updateChartOptions(): void {
    const colors = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
    ];

    const options: EChartsOption = {
      title: this.title() ? {
        text: this.title(),
        left: 'center',
        textStyle: {
          color: 'hsl(var(--foreground))',
          fontSize: 14,
        },
      } : undefined,
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'hsl(var(--popover))',
        borderColor: 'hsl(var(--border))',
        textStyle: {
          color: 'hsl(var(--popover-foreground))',
        },
      },
      legend: this.showLegend() ? {
        bottom: 0,
        textStyle: {
          color: 'hsl(var(--muted-foreground))',
        },
      } : undefined,
      grid: {
        left: '3%',
        right: '4%',
        bottom: this.showLegend() ? '15%' : '3%',
        top: this.title() ? '15%' : '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: this.xAxisData(),
        axisLine: {
          lineStyle: {
            color: 'hsl(var(--border))',
          },
        },
        axisLabel: {
          color: 'hsl(var(--muted-foreground))',
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: 'hsl(var(--border))',
          },
        },
        axisLabel: {
          color: 'hsl(var(--muted-foreground))',
        },
        splitLine: {
          lineStyle: {
            color: 'hsl(var(--border))',
            opacity: 0.5,
          },
        },
      },
      series: this.seriesData().map((series, index) => ({
        name: series.name,
        type: 'line' as const,
        data: series.data,
        smooth: this.smooth(),
        areaStyle: this.areaStyle() ? {
          opacity: 0.3,
        } : undefined,
        lineStyle: {
          color: colors[index % colors.length],
        },
        itemStyle: {
          color: colors[index % colors.length],
        },
      })),
    };

    this.chartOptions.set(options);
  }
}
