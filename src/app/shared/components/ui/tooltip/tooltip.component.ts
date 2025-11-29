import { Component, input, computed, signal } from '@angular/core';
import { cn } from '../../../lib/utils';

@Component({
  selector: 'ui-tooltip',
  standalone: true,
  template: `
    <div
      class="relative inline-block"
      (mouseenter)="show()"
      (mouseleave)="hide()"
      (focus)="show()"
      (blur)="hide()"
    >
      <ng-content />
      @if (isVisible()) {
        <div
          role="tooltip"
          [class]="tooltipClass()"
        >
          {{ content() }}
          <div [class]="arrowClass()"></div>
        </div>
      }
    </div>
  `,
})
export class TooltipComponent {
  readonly content = input.required<string>();
  readonly side = input<'top' | 'right' | 'bottom' | 'left'>('top');
  readonly class = input<string>('');
  readonly delayDuration = input<number>(200);

  protected readonly isVisible = signal(false);
  private showTimeout: ReturnType<typeof setTimeout> | null = null;

  protected readonly tooltipClass = computed(() => {
    const sideClasses = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    };

    return cn(
      'absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
      'animate-in fade-in-0 zoom-in-95',
      sideClasses[this.side()],
      this.class()
    );
  });

  protected readonly arrowClass = computed(() => {
    const arrowClasses = {
      top: 'absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-popover',
      right: 'absolute top-1/2 -translate-y-1/2 right-full border-4 border-transparent border-r-popover',
      bottom: 'absolute left-1/2 -translate-x-1/2 bottom-full border-4 border-transparent border-b-popover',
      left: 'absolute top-1/2 -translate-y-1/2 left-full border-4 border-transparent border-l-popover',
    };

    return arrowClasses[this.side()];
  });

  show(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
    this.showTimeout = setTimeout(() => {
      this.isVisible.set(true);
    }, this.delayDuration());
  }

  hide(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    this.isVisible.set(false);
  }
}
