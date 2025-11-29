import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSignal = signal<Toast[]>([]);
  private readonly positionSignal = signal<ToastPosition>('bottom-right');
  private readonly maxToastsSignal = signal<number>(5);

  readonly toasts = this.toastsSignal.asReadonly();
  readonly position = this.positionSignal.asReadonly();

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  setPosition(position: ToastPosition): void {
    this.positionSignal.set(position);
  }

  setMaxToasts(max: number): void {
    this.maxToastsSignal.set(max);
  }

  show(options: ToastOptions): string {
    const id = this.generateId();
    const toast: Toast = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant || 'default',
      duration: options.duration ?? 5000,
      action: options.action,
    };

    this.toastsSignal.update(toasts => {
      const newToasts = [...toasts, toast];
      // Limit the number of toasts
      if (newToasts.length > this.maxToastsSignal()) {
        return newToasts.slice(-this.maxToastsSignal());
      }
      return newToasts;
    });

    // Auto dismiss
    if (toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }

    return id;
  }

  success(title: string, description?: string, duration?: number): string {
    return this.show({ title, description, variant: 'success', duration });
  }

  error(title: string, description?: string, duration?: number): string {
    return this.show({ title, description, variant: 'error', duration });
  }

  warning(title: string, description?: string, duration?: number): string {
    return this.show({ title, description, variant: 'warning', duration });
  }

  info(title: string, description?: string, duration?: number): string {
    return this.show({ title, description, variant: 'info', duration });
  }

  dismiss(id: string): void {
    this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
  }

  dismissAll(): void {
    this.toastsSignal.set([]);
  }
}
