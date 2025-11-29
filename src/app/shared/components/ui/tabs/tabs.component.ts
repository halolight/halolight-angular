import { Component, input, model, computed, inject, forwardRef, OnInit } from '@angular/core';
import { cn } from '../../../lib/utils';

@Component({
  selector: 'ui-tabs',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content />
    </div>
  `,
  providers: [
    {
      provide: 'TABS_CONTEXT',
      useExisting: forwardRef(() => TabsComponent),
    },
  ],
})
export class TabsComponent implements OnInit {
  readonly value = model<string>('');
  readonly defaultValue = input<string>('');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn('w-full', this.class()));

  ngOnInit(): void {
    if (this.defaultValue() && !this.value()) {
      this.value.set(this.defaultValue());
    }
  }

  selectTab(tabValue: string): void {
    this.value.set(tabValue);
  }
}

@Component({
  selector: 'ui-tabs-list',
  standalone: true,
  template: `
    <div role="tablist" [class]="computedClass()">
      <ng-content />
    </div>
  `,
})
export class TabsListComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      this.class()
    )
  );
}

@Component({
  selector: 'ui-tabs-trigger',
  standalone: true,
  template: `
    <button
      type="button"
      role="tab"
      [attr.aria-selected]="isActive()"
      [attr.data-state]="isActive() ? 'active' : 'inactive'"
      [class]="computedClass()"
      (click)="onClick()"
    >
      <ng-content />
    </button>
  `,
})
export class TabsTriggerComponent {
  private readonly tabs = inject<TabsComponent>('TABS_CONTEXT' as any, { optional: true });

  readonly value = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly isActive = computed(() => this.tabs?.value() === this.value());

  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      this.isActive()
        ? 'bg-background text-foreground shadow-sm'
        : 'hover:bg-background/50',
      this.class()
    )
  );

  protected onClick(): void {
    if (this.disabled()) return;
    this.tabs?.selectTab(this.value());
  }
}

@Component({
  selector: 'ui-tabs-content',
  standalone: true,
  template: `
    @if (isActive()) {
      <div
        role="tabpanel"
        [attr.data-state]="isActive() ? 'active' : 'inactive'"
        [class]="computedClass()"
      >
        <ng-content />
      </div>
    }
  `,
})
export class TabsContentComponent {
  private readonly tabs = inject<TabsComponent>('TABS_CONTEXT' as any, { optional: true });

  readonly value = input.required<string>();
  readonly class = input<string>('');

  protected readonly isActive = computed(() => this.tabs?.value() === this.value());

  protected readonly computedClass = computed(() =>
    cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      this.class()
    )
  );
}
