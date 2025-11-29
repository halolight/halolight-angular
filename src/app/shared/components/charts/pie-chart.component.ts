import { Component, input, signal, OnInit, effect } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';

// Register required components
echarts.use([PieChart, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer]);

@Component({
  selector: 'app-pie-chart',
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
export class PieChartComponent implements OnInit {
  readonly title = input<string>('');
  readonly data = input<{ name: string; value: number }[]>([]);
  readonly height = input<string>('300px');
  readonly showLegend = input<boolean>(true);
  readonly doughnut = input<boolean>(false);
  readonly roseType = input<'radius' | 'area' | false>(false);

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
        trigger: 'item',
        backgroundColor: 'hsl(var(--popover))',
        borderColor: 'hsl(var(--border))',
        textStyle: {
          color: 'hsl(var(--popover-foreground))',
        },
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: this.showLegend() ? {
        bottom: 0,
        left: 'center',
        textStyle: {
          color: 'hsl(var(--muted-foreground))',
        },
      } : undefined,
      color: colors,
      series: [
        {
          name: this.title() || '数据',
          type: 'pie',
          radius: this.doughnut() ? ['40%', '70%'] : '70%',
          center: ['50%', this.showLegend() ? '45%' : '50%'],
          roseType: this.roseType() || undefined,
          data: this.data(),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            color: 'hsl(var(--foreground))',
          },
          labelLine: {
            lineStyle: {
              color: 'hsl(var(--muted-foreground))',
            },
          },
        },
      ],
    };

    this.chartOptions.set(options);
  }
}
