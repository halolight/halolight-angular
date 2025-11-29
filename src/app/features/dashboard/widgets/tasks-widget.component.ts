import { Component } from '@angular/core';
import { LucideAngularModule, CheckSquare, Circle } from 'lucide-angular';

interface TaskItem {
  id: number;
  title: string;
  assignee: string;
  done: boolean;
}

@Component({
  selector: 'app-tasks-widget',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="space-y-2">
      @for (task of tasks; track task.id) {
        <label class="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/60 transition-colors cursor-pointer">
          <input type="checkbox" class="sr-only" [checked]="task.done" />
          <lucide-angular [img]="task.done ? CheckSquareIcon : CircleIcon" class="h-4 w-4 text-primary mt-0.5" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-foreground truncate" [class.line-through]="task.done" [class.text-muted-foreground]="task.done">
              {{ task.title }}
            </p>
            <p class="text-xs text-muted-foreground">责任人：{{ task.assignee }}</p>
          </div>
        </label>
      }
    </div>
  `,
})
export class TasksWidgetComponent {
  readonly CheckSquareIcon = CheckSquare;
  readonly CircleIcon = Circle;

  readonly tasks: TaskItem[] = [
    { id: 1, title: '完成月度报告', assignee: '张三', done: false },
    { id: 2, title: '更新产品需求文档', assignee: '李四', done: true },
    { id: 3, title: '客户回访（A101）', assignee: '王五', done: false },
  ];
}
