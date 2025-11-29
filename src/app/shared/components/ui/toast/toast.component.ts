import { Component, inject, computed } from '@angular/core';
import { LucideAngularModule, X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-angular';
import { ToastService, Toast, ToastPosition } from './toast.service';
import { cn } from '../../../lib/utils';

@Component({
  selector: 'ui-toaster',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div [class]="containerClass()">
      @for (toast of toasts(); track toast.id) {
        <div
          [class]="toastClass(toast.variant)"
          role="alert"
        >
          <!-- Icon -->
          <div class="shrink-0">
            @switch (toast.variant) {
              @case ('success') {
                <lucide-angular [img]="CheckCircleIcon" class="h-5 w-5 text-green-500" />
              }
              @case ('error') {
                <lucide-angular [img]="AlertCircleIcon" class="h-5 w-5 text-red-500" />
              }
              @case ('warning') {
                <lucide-angular [img]="AlertTriangleIcon" class="h-5 w-5 text-yellow-500" />
              }
              @case ('info') {
                <lucide-angular [img]="InfoIcon" class="h-5 w-5 text-blue-500" />
              }
            }
          </div>

          <!-- Content -->
          <div class="flex-1 space-y-1">
            @if (toast.title) {
              <p class="text-sm font-semibold">{{ toast.title }}</p>
            }
            @if (toast.description) {
              <p class="text-sm opacity-90">{{ toast.description }}</p>
            }
          </div>

          <!-- Action -->
          @if (toast.action) {
            <button
              type="button"
              class="shrink-0 text-sm font-medium hover:opacity-80"
              (click)="toast.action.onClick(); dismiss(toast.id)"
            >
              {{ toast.action.label }}
            </button>
          }

          <!-- Close button -->
          <button
            type="button"
            class="shrink-0 rounded-md p-1 hover:bg-secondary/20 transition-colors"
            (click)="dismiss(toast.id)"
          >
            <lucide-angular [img]="XIcon" class="h-4 w-4" />
          </button>
        </div>
      }
    </div>
  `,
})
export class ToasterComponent {
  private readonly toastService = inject(ToastService);

  protected readonly XIcon = X;
  protected readonly CheckCircleIcon = CheckCircle;
  protected readonly AlertCircleIcon = AlertCircle;
  protected readonly AlertTriangleIcon = AlertTriangle;
  protected readonly InfoIcon = Info;

  readonly toasts = this.toastService.toasts;
  readonly position = this.toastService.position;

  protected readonly containerClass = computed(() => {
    const positionClasses: Record<ToastPosition, string> = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
    };

    return cn(
      'fixed z-[100] flex flex-col gap-2 w-full max-w-sm',
      positionClasses[this.position()]
    );
  });

  protected toastClass(variant: Toast['variant']): string {
    const variantClasses: Record<Toast['variant'], string> = {
      default: 'bg-background text-foreground border',
      success: 'bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-100 dark:border-green-800',
      error: 'bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-100 dark:border-red-800',
      warning: 'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-100 dark:border-yellow-800',
      info: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800',
    };

    return cn(
      'flex items-start gap-3 rounded-lg border p-4 shadow-lg',
      'animate-in slide-in-from-right-full fade-in-0 duration-300',
      variantClasses[variant]
    );
  }

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}

// Re-export service for convenience
export { ToastService, type Toast, type ToastOptions, type ToastVariant, type ToastPosition } from './toast.service';
