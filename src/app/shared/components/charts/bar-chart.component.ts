import { Component, input, signal, OnInit, effect } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';

// Register required components
echarts.use([BarChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer]);

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  template: `
    <div
      echarts
      [options]="chartOptions()"
      class="w-full"
      [style.height]="height()"
    ></div>
  `,
})
export class BarChartComponent implements OnInit {
  readonly title = input<string>('');
  readonly xAxisData = input<string[]>([]);
  readonly seriesData = input<{ name: string; data: number[] }[]>([]);
  readonly height = input<string>('300px');
  readonly showLegend = input<boolean>(true);
  readonly horizontal = input<boolean>(false);
  readonly stack = input<boolean>(false);

  readonly chartOptions = signal<EChartsOption>({});

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

    const isHorizontal = this.horizontal();

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
        axisPointer: {
          type: 'shadow',
        },
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
        type: isHorizontal ? 'value' : 'category',
        data: isHorizontal ? undefined : this.xAxisData(),
        axisLine: {
          lineStyle: {
            color: 'hsl(var(--border))',
          },
        },
        axisLabel: {
          color: 'hsl(var(--muted-foreground))',
        },
        splitLine: isHorizontal ? {
          lineStyle: {
            color: 'hsl(var(--border))',
            opacity: 0.5,
          },
        } : undefined,
      },
      yAxis: {
        type: isHorizontal ? 'category' : 'value',
        data: isHorizontal ? this.xAxisData() : undefined,
        axisLine: {
          lineStyle: {
            color: 'hsl(var(--border))',
          },
        },
        axisLabel: {
          color: 'hsl(var(--muted-foreground))',
        },
        splitLine: !isHorizontal ? {
          lineStyle: {
            color: 'hsl(var(--border))',
            opacity: 0.5,
          },
        } : undefined,
      },
      series: this.seriesData().map((series, index) => ({
        name: series.name,
        type: 'bar' as const,
        data: series.data,
        stack: this.stack() ? 'total' : undefined,
        itemStyle: {
          color: colors[index % colors.length],
          borderRadius: [4, 4, 0, 0],
        },
      })),
    };

    this.chartOptions.set(options);
  }
}
