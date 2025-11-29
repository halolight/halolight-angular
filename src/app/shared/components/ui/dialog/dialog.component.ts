import { Component, input, model, computed, output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';
import { cn } from '../../../lib/utils';

@Component({
  selector: 'ui-dialog',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    @if (open()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0"
        (click)="onBackdropClick()"
      ></div>

      <!-- Dialog -->
      <div
        class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-lg"
        role="dialog"
        aria-modal="true"
      >
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
export class DialogComponent {
  readonly open = model<boolean>(false);
  readonly showCloseButton = input<boolean>(true);
  readonly closeOnBackdrop = input<boolean>(true);
  readonly onClose = output<void>();

  protected readonly XIcon = X;

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
  selector: 'ui-dialog-header',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content />
    </div>
  `,
})
export class DialogHeaderComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('flex flex-col space-y-1.5 text-center sm:text-left', this.class())
  );
}

@Component({
  selector: 'ui-dialog-title',
  standalone: true,
  template: `
    <h2 [class]="computedClass()">
      <ng-content />
    </h2>
  `,
})
export class DialogTitleComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('text-lg font-semibold leading-none tracking-tight', this.class())
  );
}

@Component({
  selector: 'ui-dialog-description',
  standalone: true,
  template: `
    <p [class]="computedClass()">
      <ng-content />
    </p>
  `,
})
export class DialogDescriptionComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('text-sm text-muted-foreground', this.class())
  );
}

@Component({
  selector: 'ui-dialog-content',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content />
    </div>
  `,
})
export class DialogContentComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn('py-4', this.class()));
}

@Component({
  selector: 'ui-dialog-footer',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content />
    </div>
  `,
})
export class DialogFooterComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', this.class())
  );
}
