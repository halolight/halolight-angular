import { Component, input, model, computed, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../../lib/utils';

@Component({
  selector: 'ui-radio-group',
  standalone: true,
  template: `
    <div role="radiogroup" [class]="computedClass()">
      <ng-content />
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
})
export class RadioGroupComponent implements ControlValueAccessor {
  readonly value = model<string>('');
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly computedClass = computed(() =>
    cn('grid gap-2', this.class())
  );

  selectValue(value: string): void {
    if (this.disabled()) return;
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
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

@Component({
  selector: 'ui-radio-item',
  standalone: true,
  template: `
    <button
      type="button"
      role="radio"
      [attr.aria-checked]="isSelected()"
      [disabled]="disabled()"
      [class]="computedClass()"
      (click)="onSelect()"
    >
      @if (isSelected()) {
        <span class="flex items-center justify-center">
          <span class="h-2.5 w-2.5 rounded-full bg-current"></span>
        </span>
      }
    </button>
  `,
})
export class RadioItemComponent {
  readonly value = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly groupValue = input<string>('');
  readonly onValueChange = input<(value: string) => void>();
  readonly class = input<string>('');

  protected readonly isSelected = computed(() => this.groupValue() === this.value());

  protected readonly computedClass = computed(() =>
    cn(
      'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.class()
    )
  );

  onSelect(): void {
    if (this.disabled()) return;
    const onValueChangeFn = this.onValueChange();
    if (onValueChangeFn) {
      onValueChangeFn(this.value());
    }
  }
}
