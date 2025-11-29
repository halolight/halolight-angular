import { Component, input, model, computed, forwardRef, signal, ElementRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule, ChevronDown, Check } from 'lucide-angular';
import { cn } from '../../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [LucideAngularModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative" [class]="class()">
      <!-- Trigger -->
      <button
        type="button"
        role="combobox"
        [attr.aria-expanded]="isOpen()"
        [disabled]="disabled()"
        [class]="triggerClass()"
        (click)="toggleOpen()"
      >
        <span [class]="value() ? '' : 'text-muted-foreground'">
          {{ displayLabel() }}
        </span>
        <lucide-angular
          [img]="ChevronDownIcon"
          class="h-4 w-4 opacity-50 shrink-0"
        />
      </button>

      <!-- Dropdown -->
      @if (isOpen()) {
        <div [class]="contentClass()">
          @for (option of options(); track option.value) {
            <button
              type="button"
              role="option"
              [attr.aria-selected]="option.value === value()"
              [disabled]="option.disabled"
              [class]="optionClass(option)"
              (click)="selectOption(option)"
            >
              <lucide-angular
                [img]="CheckIcon"
                [class]="cn('h-4 w-4 mr-2', option.value === value() ? 'opacity-100' : 'opacity-0')"
              />
              {{ option.label }}
            </button>
          }
        </div>
      }
    </div>
  `,
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class SelectComponent implements ControlValueAccessor {
  readonly options = input<SelectOption[]>([]);
  readonly placeholder = input<string>('Select an option');
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  readonly value = model<string>('');
  readonly isOpen = signal(false);

  protected readonly ChevronDownIcon = ChevronDown;
  protected readonly CheckIcon = Check;
  protected readonly cn = cn;

  private readonly elementRef = inject(ElementRef);
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly displayLabel = computed(() => {
    const selected = this.options().find(opt => opt.value === this.value());
    return selected?.label || this.placeholder();
  });

  protected readonly triggerClass = computed(() =>
    cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
      'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50'
    )
  );

  protected readonly contentClass = computed(() =>
    cn(
      'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
      'animate-in fade-in-0 zoom-in-95'
    )
  );

  protected optionClass(option: SelectOption): string {
    return cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
      'hover:bg-accent hover:text-accent-foreground',
      'focus:bg-accent focus:text-accent-foreground',
      option.disabled && 'pointer-events-none opacity-50',
      option.value === this.value() && 'bg-accent'
    );
  }

  toggleOpen(): void {
    if (this.disabled()) return;
    this.isOpen.update(v => !v);
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;
    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouched();
    this.isOpen.set(false);
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(_isDisabled: boolean): void {
    // Handled by input signal
  }
}
