import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

export type CommandType = 'navigation' | 'action' | 'theme' | 'search';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: any;
  type: CommandType;
  keywords?: string[];
  shortcut?: string;
  action?: () => void;
  path?: string;
  group?: string;
}

@Injectable({ providedIn: 'root' })
export class CommandPaletteService {
  private readonly router = inject(Router);

  private readonly isOpenSignal = signal(false);
  private readonly searchQuerySignal = signal('');
  private readonly commandsSignal = signal<CommandItem[]>([]);

  readonly isOpen = this.isOpenSignal.asReadonly();
  readonly searchQuery = this.searchQuerySignal.asReadonly();
  readonly commands = this.commandsSignal.asReadonly();

  readonly filteredCommands = computed(() => {
    const query = this.searchQuerySignal().toLowerCase().trim();
    const commands = this.commandsSignal();

    if (!query) {
      return commands;
    }

    return commands.filter(cmd => {
      const labelMatch = cmd.label.toLowerCase().includes(query);
      const descMatch = cmd.description?.toLowerCase().includes(query);
      const keywordMatch = cmd.keywords?.some(k => k.toLowerCase().includes(query));
      return labelMatch || descMatch || keywordMatch;
    });
  });

  readonly groupedCommands = computed(() => {
    const commands = this.filteredCommands();
    const groups = new Map<string, CommandItem[]>();

    commands.forEach(cmd => {
      const group = cmd.group || '其他';
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group)!.push(cmd);
    });

    return groups;
  });

  constructor() {
    // Listen for keyboard shortcut
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          this.toggle();
        }
        if (e.key === 'Escape' && this.isOpenSignal()) {
          this.close();
        }
      });
    }
  }

  registerCommands(commands: CommandItem[]): void {
    this.commandsSignal.update(existing => [...existing, ...commands]);
  }

  unregisterCommands(ids: string[]): void {
    this.commandsSignal.update(commands =>
      commands.filter(cmd => !ids.includes(cmd.id))
    );
  }

  clearCommands(): void {
    this.commandsSignal.set([]);
  }

  open(): void {
    this.isOpenSignal.set(true);
    this.searchQuerySignal.set('');
  }

  close(): void {
    this.isOpenSignal.set(false);
    this.searchQuerySignal.set('');
  }

  toggle(): void {
    if (this.isOpenSignal()) {
      this.close();
    } else {
      this.open();
    }
  }

  setSearchQuery(query: string): void {
    this.searchQuerySignal.set(query);
  }

  executeCommand(command: CommandItem): void {
    if (command.action) {
      command.action();
    } else if (command.path) {
      this.router.navigate([command.path]);
    }
    this.close();
  }
}
