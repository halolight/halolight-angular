import { Injectable, computed, signal } from '@angular/core';

export interface RealtimeNotification {
  id: string;
  title: string;
  body?: string;
  type: 'info' | 'warning' | 'success';
  createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private readonly connectedSignal = signal(false);
  private readonly messagesSignal = signal<RealtimeNotification[]>([]);
  private timer?: number;

  readonly connected = this.connectedSignal.asReadonly();
  readonly notifications = computed(() => this.messagesSignal());

  constructor() {
    // Auto-connect on creation
    this.connect();
  }

  connect(): void {
    if (this.connectedSignal()) return;
    this.connectedSignal.set(true);
    // Mock stream similar to Next.js MockWebSocket
    this.timer = window.setInterval(() => {
      const now = Date.now();
      const types: RealtimeNotification['type'][] = ['info', 'warning', 'success'];
      const titles = [
        '新用户注册',
        '系统通知',
        '任务更新',
        '安全提醒',
        '数据备份完成',
        '服务器资源警告',
      ];
      const next: RealtimeNotification = {
        id: `${now}`,
        title: titles[now % titles.length],
        body: '这是通过 WebSocket 服务推送的模拟通知。',
        type: types[now % types.length],
        createdAt: now,
      };
      this.messagesSignal.update((list) => [next, ...list].slice(0, 20));
    }, 8000);
  }

  disconnect(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    this.connectedSignal.set(false);
  }

  // Allow components to mark messages as read
  clear(): void {
    this.messagesSignal.set([]);
  }
}
