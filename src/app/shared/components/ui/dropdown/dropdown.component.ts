import { Component, input, signal, computed, ElementRef, inject, output } from '@angular/core';
import { cn } from '../../../lib/utils';

export interface DropdownMenuItem {
  label?: string;
  value?: string;
  icon?: any;
  disabled?: boolean;
  separator?: boolean;
  shortcut?: string;
  onClick?: () => void;
}

@Component({
  selector: 'ui-dropdown',
  standalone: true,
  template: `
    <div class="relative inline-block" [class]="class()">
      <!-- Trigger -->
      <div (click)="toggle()">
        <ng-content select="[trigger]" />
      </div>

      <!-- Menu -->
      @if (isOpen()) {
        <div
          [class]="menuClass()"
          role="menu"
          aria-orientation="vertical"
        >
          @for (item of items(); track $index) {
            @if (item.separator) {
              <div class="-mx-1 my-1 h-px bg-muted"></div>
            } @else {
              <button
                type="button"
                role="menuitem"
                [disabled]="item.disabled"
                [class]="itemClass(item)"
                (click)="onItemClick(item)"
              >
                @if (item.icon) {
                  <span class="mr-2 h-4 w-4">{{ item.icon }}</span>
                }
                <span>{{ item.label }}</span>
                @if (item.shortcut) {
                  <span class="ml-auto text-xs tracking-widest opacity-60">
                    {{ item.shortcut }}
                  </span>
                }
              </button>
            }
          }
          <ng-content />
        </div>
      }
    </div>
  `,
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class DropdownComponent {
  readonly items = input<DropdownMenuItem[]>([]);
  readonly align = input<'start' | 'center' | 'end'>('end');
  readonly side = input<'top' | 'bottom'>('bottom');
  readonly class = input<string>('');

  readonly onSelect = output<DropdownMenuItem>();

  readonly isOpen = signal(false);

  private readonly elementRef = inject(ElementRef);

  protected readonly menuClass = computed(() => {
    const alignClasses = {
      start: 'left-0',
      center: 'left-1/2 -translate-x-1/2',
      end: 'right-0',
    };
    const sideClasses = {
      top: 'bottom-full mb-2',
      bottom: 'top-full mt-2',
    };

    return cn(
      'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
      'animate-in fade-in-0 zoom-in-95',
      alignClasses[this.align()],
      sideClasses[this.side()]
    );
  });

  protected itemClass(item: DropdownMenuItem): string {
    return cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'focus:bg-accent focus:text-accent-foreground',
      item.disabled && 'pointer-events-none opacity-50'
    );
  }

  toggle(): void {
    this.isOpen.update(v => !v);
  }

  onItemClick(item: DropdownMenuItem): void {
    if (item.disabled) return;
    if (item.onClick) {
      item.onClick();
    }
    this.onSelect.emit(item);
    this.isOpen.set(false);
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}

@Component({
  selector: 'ui-dropdown-item',
  standalone: true,
  template: `
    <button
      type="button"
      role="menuitem"
      [disabled]="disabled()"
      [class]="computedClass()"
      (click)="onClick.emit()"
    >
      <ng-content />
      @if (shortcut()) {
        <span class="ml-auto text-xs tracking-widest opacity-60">
          {{ shortcut() }}
        </span>
      }
    </button>
  `,
})
export class DropdownItemComponent {
  readonly disabled = input<boolean>(false);
  readonly shortcut = input<string>('');
  readonly class = input<string>('');
  readonly onClick = output<void>();

  protected readonly computedClass = computed(() =>
    cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'focus:bg-accent focus:text-accent-foreground',
      this.disabled() && 'pointer-events-none opacity-50',
      this.class()
    )
  );
}

@Component({
  selector: 'ui-dropdown-separator',
  standalone: true,
  template: `<div class="-mx-1 my-1 h-px bg-muted"></div>`,
})
export class DropdownSeparatorComponent {}
