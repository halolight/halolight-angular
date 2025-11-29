import { Component, input, model, computed, output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';
import { cn } from '../../../lib/utils';

@Component({
  selector: 'ui-sheet',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    @if (open()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0"
        (click)="onBackdropClick()"
      ></div>

      <!-- Sheet -->
      <div [class]="sheetClass()" role="dialog" aria-modal="true">
        <ng-content />

        @if (showCloseButton()) {
          <button
            type="button"
            class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            (click)="close()"
          >
            <lucide-angular [img]="XIcon" class="h-4 w-4" />
            <span class="sr-only">Close</span>
          </button>
        }
      </div>
    }
  `,
})
export class SheetComponent {
  readonly open = model<boolean>(false);
  readonly side = input<'top' | 'right' | 'bottom' | 'left'>('right');
  readonly showCloseButton = input<boolean>(true);
  readonly closeOnBackdrop = input<boolean>(true);
  readonly class = input<string>('');
  readonly onClose = output<void>();

  protected readonly XIcon = X;

  protected readonly sheetClass = computed(() => {
    const sideClasses = {
      top: 'inset-x-0 top-0 border-b animate-in slide-in-from-top',
      right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm animate-in slide-in-from-right',
      bottom: 'inset-x-0 bottom-0 border-t animate-in slide-in-from-bottom',
      left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm animate-in slide-in-from-left',
    };

    return cn(
      'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out',
      sideClasses[this.side()],
      this.class()
    );
  });

  close(): void {
    this.open.set(false);
    this.onClose.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.close();
    }
  }
}

@Component({
  selector: 'ui-sheet-header',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content />
    </div>
  `,
})
export class SheetHeaderComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('flex flex-col space-y-2 text-center sm:text-left', this.class())
  );
}

@Component({
  selector: 'ui-sheet-title',
  standalone: true,
  template: `
    <h2 [class]="computedClass()">
      <ng-content />
    </h2>
  `,
})
export class SheetTitleComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('text-lg font-semibold text-foreground', this.class())
  );
}

@Component({
  selector: 'ui-sheet-description',
  standalone: true,
  template: `
    <p [class]="computedClass()">
      <ng-content />
    </p>
  `,
})
export class SheetDescriptionComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('text-sm text-muted-foreground', this.class())
  );
}

@Component({
  selector: 'ui-sheet-content',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content />
    </div>
  `,
})
export class SheetContentComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn('py-4', this.class()));
}

@Component({
  selector: 'ui-sheet-footer',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content />
    </div>
  `,
})
export class SheetFooterComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', this.class())
  );
}
