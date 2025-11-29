import { Component, input, output, computed } from '@angular/core';
import { LucideAngularModule, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-angular';
import { cn } from '../../../lib/utils';

@Component({
  selector: 'ui-pagination',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <nav
      role="navigation"
      aria-label="pagination"
      [class]="computedClass()"
    >
      <ul class="flex flex-row items-center gap-1">
        <!-- Previous -->
        <li>
          <button
            type="button"
            [disabled]="currentPage() <= 1"
            [class]="navButtonClass(currentPage() <= 1)"
            (click)="onPageChange(currentPage() - 1)"
            aria-label="Go to previous page"
          >
            <lucide-angular [img]="ChevronLeftIcon" class="h-4 w-4" />
            @if (showLabels()) {
              <span>Previous</span>
            }
          </button>
        </li>

        <!-- Page Numbers -->
        @for (page of visiblePages(); track page) {
          @if (page === -1) {
            <li>
              <span class="flex h-9 w-9 items-center justify-center">
                <lucide-angular [img]="MoreHorizontalIcon" class="h-4 w-4" />
              </span>
            </li>
          } @else {
            <li>
              <button
                type="button"
                [class]="pageButtonClass(page === currentPage())"
                [attr.aria-current]="page === currentPage() ? 'page' : null"
                (click)="onPageChange(page)"
              >
                {{ page }}
              </button>
            </li>
          }
        }

        <!-- Next -->
        <li>
          <button
            type="button"
            [disabled]="currentPage() >= totalPages()"
            [class]="navButtonClass(currentPage() >= totalPages())"
            (click)="onPageChange(currentPage() + 1)"
            aria-label="Go to next page"
          >
            @if (showLabels()) {
              <span>Next</span>
            }
            <lucide-angular [img]="ChevronRightIcon" class="h-4 w-4" />
          </button>
        </li>
      </ul>
    </nav>
  `,
})
export class PaginationComponent {
  readonly currentPage = input<number>(1);
  readonly totalPages = input<number>(1);
  readonly siblingCount = input<number>(1);
  readonly showLabels = input<boolean>(false);
  readonly class = input<string>('');

  readonly pageChange = output<number>();

  protected readonly ChevronLeftIcon = ChevronLeft;
  protected readonly ChevronRightIcon = ChevronRight;
  protected readonly MoreHorizontalIcon = MoreHorizontal;

  protected readonly computedClass = computed(() =>
    cn('mx-auto flex w-full justify-center', this.class())
  );

  protected readonly visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const siblings = this.siblingCount();

    const range = (start: number, end: number) =>
      Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const totalPageNumbers = siblings * 2 + 5; // siblings + first + last + current + 2 dots

    if (total <= totalPageNumbers) {
      return range(1, total);
    }

    const leftSiblingIndex = Math.max(current - siblings, 1);
    const rightSiblingIndex = Math.min(current + siblings, total);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < total - 1;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblings;
      return [...range(1, leftItemCount), -1, total];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblings;
      return [1, -1, ...range(total - rightItemCount + 1, total)];
    }

    return [1, -1, ...range(leftSiblingIndex, rightSiblingIndex), -1, total];
  });

  protected navButtonClass(disabled: boolean): string {
    return cn(
      'inline-flex items-center justify-center gap-1 pl-2.5 pr-2.5 h-9 rounded-md text-sm font-medium',
      'hover:bg-accent hover:text-accent-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      disabled && 'pointer-events-none opacity-50'
    );
  }

  protected pageButtonClass(isActive: boolean): string {
    return cn(
      'inline-flex items-center justify-center h-9 w-9 rounded-md text-sm font-medium',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      isActive
        ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
        : 'hover:bg-accent hover:text-accent-foreground'
    );
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }
}
