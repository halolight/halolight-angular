import { Component, input, model, computed, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule, Check, Minus } from 'lucide-angular';
import { cn } from '../../../lib/utils';

@Component({
  selector: 'ui-checkbox',
  standalone: true,
  imports: [LucideAngularModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <button
      type="button"
      role="checkbox"
      [attr.aria-checked]="indeterminate() ? 'mixed' : checked()"
      [disabled]="disabled()"
      [class]="computedClass()"
      (click)="toggle()"
    >
      @if (checked() || indeterminate()) {
        <lucide-angular
          [img]="indeterminate() ? MinusIcon : CheckIcon"
          class="h-4 w-4"
        />
      }
    </button>
  `,
})
export class CheckboxComponent implements ControlValueAccessor {
  readonly checked = model<boolean>(false);
  readonly indeterminate = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly CheckIcon = Check;
  protected readonly MinusIcon = Minus;

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly computedClass = computed(() =>
    cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'flex items-center justify-center text-primary-foreground',
      this.checked() || this.indeterminate() ? 'bg-primary' : 'bg-background',
      this.class()
    )
  );

  toggle(): void {
    if (this.disabled()) return;
    const newValue = !this.checked();
    this.checked.set(newValue);
    this.onChange(newValue);
    this.onTouched();
  }

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(_isDisabled: boolean): void {
    // Handled by input signal
  }
}
