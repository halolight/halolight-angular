import { Component, input } from '@angular/core';
import { cn } from '../../../lib/utils';

@Component({
  selector: 'ui-card',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content />
    </div>
  `,
})
export class CardComponent {
  readonly class = input('');

  computedClass(): string {
    return cn('rounded-xl border bg-card text-card-foreground shadow', this.class());
  }
}

@Component({
  selector: 'ui-card-header',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content />
    </div>
  `,
})
export class CardHeaderComponent {
  readonly class = input('');

  computedClass(): string {
    return cn('flex flex-col space-y-1.5 p-6', this.class());
  }
}

@Component({
  selector: 'ui-card-title',
  standalone: true,
  template: `
    <h3 [class]="computedClass()">
      <ng-content />
    </h3>
  `,
})
export class CardTitleComponent {
  readonly class = input('');

  computedClass(): string {
    return cn('font-semibold leading-none tracking-tight', this.class());
  }
}

@Component({
  selector: 'ui-card-description',
  standalone: true,
  template: `
    <p [class]="computedClass()">
      <ng-content />
    </p>
  `,
})
export class CardDescriptionComponent {
  readonly class = input('');

  computedClass(): string {
    return cn('text-sm text-muted-foreground', this.class());
  }
}

@Component({
  selector: 'ui-card-content',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content />
    </div>
  `,
})
export class CardContentComponent {
  readonly class = input('');

  computedClass(): string {
    return cn('p-6 pt-0', this.class());
  }
}

@Component({
  selector: 'ui-card-footer',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content />
    </div>
  `,
})
export class CardFooterComponent {
  readonly class = input('');

  computedClass(): string {
    return cn('flex items-center p-6 pt-0', this.class());
  }
}
