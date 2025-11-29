import { Component, input, computed } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        default: 'h-10 w-10',
        sm: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

type AvatarVariants = VariantProps<typeof avatarVariants>;

@Component({
  selector: 'ui-avatar',
  standalone: true,
  template: `
    <span [class]="computedClass()">
      <ng-content />
    </span>
  `,
})
export class AvatarComponent {
  readonly size = input<AvatarVariants['size']>('default');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(avatarVariants({ size: this.size() }), this.class())
  );
}

@Component({
  selector: 'ui-avatar-image',
  standalone: true,
  template: `
    @if (!hasError()) {
      <img
        [src]="src()"
        [alt]="alt()"
        [class]="computedClass()"
        (error)="onError()"
      />
    }
  `,
})
export class AvatarImageComponent {
  readonly src = input.required<string>();
  readonly alt = input<string>('');
  readonly class = input<string>('');

  protected hasError = computed(() => this._hasError);
  private _hasError = false;

  protected readonly computedClass = computed(() =>
    cn('aspect-square h-full w-full object-cover', this.class())
  );

  protected onError(): void {
    this._hasError = true;
  }
}

@Component({
  selector: 'ui-avatar-fallback',
  standalone: true,
  template: `
    <span [class]="computedClass()">
      <ng-content />
    </span>
  `,
})
export class AvatarFallbackComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium',
      this.class()
    )
  );
}
