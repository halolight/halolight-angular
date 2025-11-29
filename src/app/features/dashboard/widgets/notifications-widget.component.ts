import { Component, inject, computed } from '@angular/core';
import { LucideAngularModule, Bell, AlertCircle, CheckCircle2 } from 'lucide-angular';
import { WebsocketService } from '../../../core/services/websocket.service';

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: 'info' | 'warning' | 'success';
}

@Component({
  selector: 'app-notifications-widget',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="space-y-3">
      @for (item of displayNotifications(); track item.id) {
        <div class="flex items-start gap-3 p-2 rounded-lg border border-border/70">
          <lucide-angular [img]="iconMap[item.type]" class="h-4 w-4 mt-1"
            [class.text-blue-500]="item.type === 'info'"
            [class.text-amber-500]="item.type === 'warning'"
            [class.text-emerald-500]="item.type === 'success'" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-foreground truncate">{{ item.title }}</p>
            <p class="text-xs text-muted-foreground">{{ item.time }}</p>
          </div>
        </div>
      }
      <div class="flex items-center gap-2 text-xs text-muted-foreground">
        <lucide-angular [img]="BellIcon" class="h-4 w-4" />
        实时通知由 WebSocket 服务推送
        @if (websocket.connected()) {
          <span class="text-emerald-500">(已连接)</span>
        } @else {
          <span class="text-muted-foreground">(未连接)</span>
        }
      </div>
    </div>
  `,
})
export class NotificationsWidgetComponent {
  protected readonly websocket = inject(WebsocketService);

  readonly BellIcon = Bell;
  readonly iconMap = {
    info: Bell,
    warning: AlertCircle,
    success: CheckCircle2,
  } as const;

  // Transform WebSocket notifications to display format
  readonly displayNotifications = computed<NotificationItem[]>(() => {
    const notifications = this.websocket.notifications();
    return notifications.slice(0, 3).map((n) => {
      const elapsed = Date.now() - n.createdAt;
      const minutes = Math.floor(elapsed / 60000);
      const time = minutes < 1 ? '刚刚' : minutes < 60 ? `${minutes} 分钟前` : '1 小时前';

      return {
        id: n.id,
        title: n.title,
        time,
        type: n.type,
      };
    });
  });
}
