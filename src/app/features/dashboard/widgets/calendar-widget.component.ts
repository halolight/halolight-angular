import { Component, computed, signal } from '@angular/core';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';

interface CalendarDay {
  date: number;
  label: string;
  highlight?: boolean;
}

@Component({
  selector: 'app-calendar-widget',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <button type="button" class="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent" (click)="prevMonth()">
          <lucide-angular [img]="ChevronLeftIcon" class="h-4 w-4" />
        </button>
        <div class="text-sm font-semibold text-foreground">{{ currentLabel() }}</div>
        <button type="button" class="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent" (click)="nextMonth()">
          <lucide-angular [img]="ChevronRightIcon" class="h-4 w-4" />
        </button>
      </div>
      <div class="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
        <span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span class="font-medium text-foreground">六</span><span class="font-medium text-foreground">日</span>
      </div>
      <div class="grid grid-cols-7 gap-2">
        @for (day of days(); track day.date) {
          <div class="h-10 rounded-md border border-border/60 flex items-center justify-center text-sm"
            [class.bg-primary/10]="day.highlight"
            [class.text-primary]="day.highlight">
            <span>{{ day.label }}</span>
          </div>
        }
      </div>
    </div>
  `,
})
export class CalendarWidgetComponent {
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;

  private readonly month = signal(0); // month offset from current

  readonly currentLabel = computed(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + this.month());
    return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;
  });

  readonly days = computed<CalendarDay[]>(() => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() + this.month());
    const totalDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    return Array.from({ length: totalDays }).map((_, idx) => ({
      date: idx + 1,
      label: `${idx + 1}`,
      highlight: (idx + 1) % 5 === 0, // placeholder highlight days
    }));
  });

  prevMonth(): void {
    this.month.update((m) => m - 1);
  }

  nextMonth(): void {
    this.month.update((m) => m + 1);
  }
}
