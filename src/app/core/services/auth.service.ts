import { Injectable, signal, computed, effect } from '@angular/core';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: 'admin' | 'manager' | 'user';
  permissions?: string[];
}

export interface Account {
  id: string;
  label: string;
  token: string;
  user: User;
}

// 标准权限列表
export const PERMISSIONS = {
  // 仪表盘
  'dashboard:view': '查看仪表盘',
  'dashboard:edit': '编辑仪表盘',

  // 用户管理
  'users:list': '查看用户列表',
  'users:view': '查看用户详情',
  'users:create': '创建用户',
  'users:update': '更新用户',
  'users:delete': '删除用户',

  // 角色管理
  'roles:list': '查看角色列表',
  'roles:create': '创建角色',
  'roles:update': '更新角色',
  'roles:delete': '删除角色',

  // 权限管理
  'permissions:list': '查看权限列表',
  'permissions:assign': '分配权限',

  // 系统设置
  'settings:view': '查看设置',
  'settings:update': '更新设置',
} as const;

// 角色预设
export const ROLES = {
  admin: {
    name: '管理员',
    permissions: ['*'],
  },
  manager: {
    name: '经理',
    permissions: ['dashboard:*', 'users:list', 'users:view'],
  },
  user: {
    name: '普通用户',
    permissions: ['dashboard:view'],
  },
} as const;

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';
const AUTH_ACCOUNTS_KEY = 'auth_accounts';
const AUTH_ACTIVE_ACCOUNT_KEY = 'auth_active_account';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSignal = signal<string | null>(this.getStoredToken());
  private readonly userSignal = signal<User | null>(this.getStoredUser());
  private readonly loadingSignal = signal(false);
  private readonly accountsSignal = signal<Account[]>(this.getStoredAccounts());
  private readonly activeAccountIdSignal = signal<string | null>(this.getStoredActiveAccountId());

  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly user = computed(() => this.userSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly accounts = this.accountsSignal.asReadonly();
  readonly activeAccount = computed(() =>
    this.accountsSignal().find((acc) => acc.id === this.activeAccountIdSignal()) || null
  );

  constructor() {
    // Sync token changes to localStorage
    effect(() => {
      const token = this.tokenSignal();
      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    });

    effect(() => {
      const user = this.userSignal();
      if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    });

    effect(() => {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(this.accountsSignal()));
    });

    effect(() => {
      if (typeof localStorage === 'undefined') return;
      const activeId = this.activeAccountIdSignal();
      if (activeId) {
        localStorage.setItem(AUTH_ACTIVE_ACCOUNT_KEY, activeId);
      } else {
        localStorage.removeItem(AUTH_ACTIVE_ACCOUNT_KEY);
      }
    });

    // Keep token/user in sync with active account
    effect(() => {
      const active = this.activeAccount();
      if (active) {
        this.tokenSignal.set(active.token);
        this.userSignal.set(active.user);
      }
    });
  }

  get token(): string | null {
    return this.tokenSignal();
  }

  setAuth(token: string, user: User): void {
    this.tokenSignal.set(token);
    this.userSignal.set(user);

    const existing = this.accountsSignal();
    const account: Account = {
      id: user.id,
      label: user.name || user.email,
      token,
      user,
    };
    const next = existing.some((a) => a.id === account.id)
      ? existing.map((a) => (a.id === account.id ? account : a))
      : [...existing, account];
    this.accountsSignal.set(next);
    this.activeAccountIdSignal.set(account.id);
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  logout(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.activeAccountIdSignal.set(null);
  }

  /**
   * 检查用户是否拥有指定权限
   * @param permission 权限标识，格式为 resource:action
   * @returns 是否拥有权限
   */
  hasPermission(permission: string): boolean {
    const user = this.userSignal();
    if (!user) return false;

    // 获取用户权限列表
    let permissions = user.permissions || [];

    // 如果用户有角色，合并角色权限
    if (user.role && user.role in ROLES) {
      const rolePerms = ROLES[user.role].permissions;
      permissions = [...permissions, ...rolePerms];
    }

    return this.checkPermission(permissions, permission);
  }

  /**
   * 检查用户是否拥有任意一个指定权限
   */
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((p) => this.hasPermission(p));
  }

  /**
   * 检查用户是否拥有所有指定权限
   */
  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((p) => this.hasPermission(p));
  }

  private checkPermission(userPerms: readonly string[], required: string): boolean {
    return userPerms.some((p) =>
      p === '*' ||
      p === required ||
      (p.endsWith(':*') && required.startsWith(p.slice(0, -1)))
    );
  }

  private getStoredToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    if (typeof localStorage === 'undefined') return null;
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  }

  private getStoredAccounts(): Account[] {
    if (typeof localStorage === 'undefined') return [];
    const stored = localStorage.getItem(AUTH_ACCOUNTS_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored) as Account[];
    } catch {
      return [];
    }
  }

  private getStoredActiveAccountId(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(AUTH_ACTIVE_ACCOUNT_KEY);
  }

  switchAccount(accountId: string): void {
    const target = this.accountsSignal().find((acc) => acc.id === accountId);
    if (!target) return;
    this.activeAccountIdSignal.set(accountId);
    this.tokenSignal.set(target.token);
    this.userSignal.set(target.user);
  }

  removeAccount(accountId: string): void {
    this.accountsSignal.update((accounts) => accounts.filter((a) => a.id !== accountId));
    if (this.activeAccountIdSignal() === accountId) {
      this.activeAccountIdSignal.set(this.accountsSignal()[0]?.id ?? null);
    }
  }
}
