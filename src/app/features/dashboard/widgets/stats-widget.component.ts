import { Component, input, computed } from '@angular/core';
import { LucideAngularModule, Users, Activity, DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-angular';

@Component({
  selector: 'app-stats-widget',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="h-full flex items-center justify-between">
      <div class="space-y-1">
        <p class="text-2xl font-bold text-foreground">{{ value() }}</p>
        <p [class]="changeClass()" class="text-xs flex items-center gap-1">
          <lucide-angular [img]="changeIcon()" class="h-3 w-3" />
          {{ change() }}
        </p>
      </div>
      <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
        <lucide-angular [img]="icon()" class="h-6 w-6 text-primary" />
      </div>
    </div>
  `,
})
export class StatsWidgetComponent {
  readonly value = input<string>('0');
  readonly change = input<string>('');
  readonly changeType = input<'positive' | 'negative' | 'neutral'>('neutral');
  readonly iconType = input<'users' | 'activity' | 'dollar' | 'trending'>('users');

  readonly UsersIcon = Users;
  readonly ActivityIcon = Activity;
  readonly DollarIcon = DollarSign;
  readonly TrendingUpIcon = TrendingUp;
  readonly TrendingDownIcon = TrendingDown;
  readonly MinusIcon = Minus;

  readonly icon = computed(() => {
    switch (this.iconType()) {
      case 'users': return this.UsersIcon;
      case 'activity': return this.ActivityIcon;
      case 'dollar': return this.DollarIcon;
      default: return this.TrendingUpIcon;
    }
  });

  readonly changeIcon = computed(() => {
    switch (this.changeType()) {
      case 'positive': return this.TrendingUpIcon;
      case 'negative': return this.TrendingDownIcon;
      default: return this.MinusIcon;
    }
  });

  readonly changeClass = computed(() => {
    switch (this.changeType()) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  });
}
