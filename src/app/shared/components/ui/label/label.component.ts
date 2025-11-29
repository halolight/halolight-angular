import { Component, input, computed } from '@angular/core';
import { cn } from '../../../lib/utils';

@Component({
  selector: 'ui-label',
  standalone: true,
  template: `
    <label [for]="for()" [class]="computedClass()">
      <ng-content />
    </label>
  `,
})
export class LabelComponent {
  readonly for = input<string>('');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      this.class()
    )
  );
}
