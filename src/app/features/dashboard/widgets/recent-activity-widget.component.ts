import { Component } from '@angular/core';

interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
}

@Component({
  selector: 'app-recent-activity-widget',
  standalone: true,
  template: `
    <div class="h-full overflow-auto space-y-2">
      @for (activity of activities; track activity.id) {
        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
          <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span class="text-primary text-xs font-medium">
              {{ activity.user.charAt(0) }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-foreground truncate">{{ activity.user }}</p>
            <p class="text-xs text-muted-foreground truncate">{{ activity.action }}</p>
          </div>
          <span class="text-xs text-muted-foreground shrink-0">{{ activity.time }}</span>
        </div>
      }
    </div>
  `,
})
export class RecentActivityWidgetComponent {
  readonly activities: Activity[] = [
    { id: 1, user: '张三', action: '创建了新订单 #1234', time: '5分钟前' },
    { id: 2, user: '李四', action: '更新了个人资料', time: '15分钟前' },
    { id: 3, user: '王五', action: '完成了任务「系统优化」', time: '1小时前' },
    { id: 4, user: '赵六', action: '添加了新用户', time: '2小时前' },
    { id: 5, user: '钱七', action: '导出了数据报表', time: '3小时前' },
  ];
}
