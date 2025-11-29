import { Component, input, computed } from '@angular/core';
import { cn } from '../../../lib/utils';

@Component({
  selector: 'ui-separator',
  standalone: true,
  template: `
    <div
      role="separator"
      [attr.aria-orientation]="orientation()"
      [class]="computedClass()"
    ></div>
  `,
})
export class SeparatorComponent {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly decorative = input<boolean>(true);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'shrink-0 bg-border',
      this.orientation() === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      this.class()
    )
  );
}
