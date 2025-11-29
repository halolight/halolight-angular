import { Component, input, output, inject } from '@angular/core';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../../shared/components/ui';
import { LucideAngularModule, X, GripVertical } from 'lucide-angular';
import { DashboardStore, WidgetConfig } from '../dashboard.store';

@Component({
  selector: 'app-widget-wrapper',
  standalone: true,
  imports: [
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    LucideAngularModule,
  ],
  template: `
    <ui-card class="h-full flex flex-col overflow-hidden">
      <ui-card-header class="flex-row items-center justify-between py-2 px-4 space-y-0">
        <div class="flex items-center gap-2">
          @if (store.isEditing()) {
            <lucide-angular [img]="GripIcon" class="h-4 w-4 text-muted-foreground cursor-move drag-handle" />
          }
          <ui-card-title class="text-sm font-medium">{{ widget().title }}</ui-card-title>
        </div>
        @if (store.isEditing()) {
          <button
            type="button"
            class="h-6 w-6 rounded-sm hover:bg-destructive/10 flex items-center justify-center transition-colors"
            (click)="onRemove.emit()"
          >
            <lucide-angular [img]="XIcon" class="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </button>
        }
      </ui-card-header>
      <ui-card-content class="flex-1 overflow-hidden p-4">
        <ng-content />
      </ui-card-content>
    </ui-card>
  `,
})
export class WidgetWrapperComponent {
  readonly store = inject(DashboardStore);

  readonly widget = input.required<WidgetConfig>();
  readonly onRemove = output<void>();

  readonly XIcon = X;
  readonly GripIcon = GripVertical;
}
