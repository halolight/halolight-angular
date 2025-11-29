import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Shield, Plus, Pencil, Trash2, Check, X, Users } from 'lucide-angular';
import { PERMISSIONS } from '../../core/services/auth.service';
import {
  ButtonComponent,
  InputComponent,
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
} from '../../shared/components/ui';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
}

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [
    FormsModule,
    LucideAngularModule,
    ButtonComponent,
    InputComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-foreground">角色管理</h1>
          <p class="text-muted-foreground">管理系统角色和权限分配</p>
        </div>
        <ui-button (click)="openCreateDialog()">
          <lucide-angular [img]="PlusIcon" class="h-4 w-4 mr-2" />
          新建角色
        </ui-button>
      </div>

      <!-- 角色列表 -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        @for (role of roles(); track role.id) {
          <ui-card class="relative">
            <ui-card-header>
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <lucide-angular [img]="ShieldIcon" class="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <ui-card-title>{{ role.name }}</ui-card-title>
                    <ui-card-description>{{ role.description }}</ui-card-description>
                  </div>
                </div>
                <div class="flex gap-1">
                  <button
                    type="button"
                    class="p-1.5 rounded-md hover:bg-accent transition-colors"
                    (click)="editRole(role)"
                  >
                    <lucide-angular [img]="PencilIcon" class="h-4 w-4" />
                  </button>
                  @if (role.id !== 'admin') {
                    <button
                      type="button"
                      class="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                      (click)="deleteRole(role)"
                    >
                      <lucide-angular [img]="Trash2Icon" class="h-4 w-4" />
                    </button>
                  }
                </div>
              </div>
            </ui-card-header>
            <ui-card-content>
              <div class="space-y-3">
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <lucide-angular [img]="UsersIcon" class="h-4 w-4" />
                  <span>{{ role.userCount }} 个用户</span>
                </div>
                <div class="space-y-1">
                  <p class="text-xs font-medium text-muted-foreground">权限</p>
                  <div class="flex flex-wrap gap-1">
                    @if (role.permissions.includes('*')) {
                      <span class="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        全部权限
                      </span>
                    } @else {
                      @for (perm of role.permissions.slice(0, 3); track perm) {
                        <span class="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {{ getPermissionLabel(perm) }}
                        </span>
                      }
                      @if (role.permissions.length > 3) {
                        <span class="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          +{{ role.permissions.length - 3 }}
                        </span>
                      }
                    }
                  </div>
                </div>
              </div>
            </ui-card-content>
          </ui-card>
        }
      </div>

      <!-- 创建/编辑对话框 -->
      @if (dialogOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="fixed inset-0 bg-black/50" (click)="closeDialog()"></div>
          <div class="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-auto rounded-lg border border-border bg-card p-6 shadow-lg">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-foreground">
                {{ editingRole() ? '编辑角色' : '新建角色' }}
              </h2>
              <button
                type="button"
                class="rounded-md p-1 hover:bg-accent transition-colors"
                (click)="closeDialog()"
              >
                <lucide-angular [img]="XIcon" class="h-5 w-5" />
              </button>
            </div>

            <form (ngSubmit)="saveRole()" class="space-y-6">
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">角色名称</label>
                  <ui-input
                    type="text"
                    placeholder="请输入角色名称"
                    [(value)]="formData.name"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">角色标识</label>
                  <ui-input
                    type="text"
                    placeholder="请输入角色标识（英文）"
                    [(value)]="formData.id"
                    [disabled]="!!editingRole()"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">角色描述</label>
                <textarea
                  class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="请输入角色描述"
                  rows="2"
                  [(ngModel)]="formData.description"
                ></textarea>
              </div>

              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-foreground">权限配置</label>
                  <label class="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      class="h-4 w-4 rounded border-input"
                      [checked]="formData.permissions.includes('*')"
                      (change)="toggleAllPermissions($event)"
                    />
                    <span class="text-muted-foreground">全部权限</span>
                  </label>
                </div>

                @if (!formData.permissions.includes('*')) {
                  <div class="grid gap-4 sm:grid-cols-2">
                    @for (group of permissionGroups; track group.name) {
                      <div class="rounded-lg border border-border p-3">
                        <p class="text-sm font-medium text-foreground mb-2">{{ group.name }}</p>
                        <div class="space-y-2">
                          @for (perm of group.permissions; track perm.key) {
                            <label class="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                class="h-4 w-4 rounded border-input"
                                [checked]="formData.permissions.includes(perm.key)"
                                (change)="togglePermission(perm.key, $event)"
                              />
                              <span class="text-muted-foreground">{{ perm.label }}</span>
                            </label>
                          }
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>

              @if (formError()) {
                <p class="text-sm text-destructive">{{ formError() }}</p>
              }

              <div class="flex justify-end gap-3">
                <ui-button type="button" variant="outline" (click)="closeDialog()">
                  取消
                </ui-button>
                <ui-button type="submit" [disabled]="formLoading()">
                  @if (formLoading()) {
                    保存中...
                  } @else {
                    保存
                  }
                </ui-button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- 删除确认对话框 -->
      @if (deleteDialogOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="fixed inset-0 bg-black/50" (click)="closeDeleteDialog()"></div>
          <div class="relative z-50 w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
            <h2 class="text-xl font-semibold text-foreground mb-2">确认删除</h2>
            <p class="text-muted-foreground mb-6">
              确定要删除角色「{{ deletingRole()?.name }}」吗？此操作不可撤销。
            </p>
            <div class="flex justify-end gap-3">
              <ui-button type="button" variant="outline" (click)="closeDeleteDialog()">
                取消
              </ui-button>
              <ui-button
                type="button"
                variant="destructive"
                (click)="confirmDelete()"
                [disabled]="deleteLoading()"
              >
                @if (deleteLoading()) {
                  删除中...
                } @else {
                  确认删除
                }
              </ui-button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class RolesPage {
  // Icons
  protected readonly ShieldIcon = Shield;
  protected readonly PlusIcon = Plus;
  protected readonly PencilIcon = Pencil;
  protected readonly Trash2Icon = Trash2;
  protected readonly CheckIcon = Check;
  protected readonly XIcon = X;
  protected readonly UsersIcon = Users;

  // 权限映射
  protected readonly permissionsMap = PERMISSIONS;

  // 权限分组
  protected readonly permissionGroups = [
    {
      name: '仪表盘',
      permissions: [
        { key: 'dashboard:view', label: '查看仪表盘' },
        { key: 'dashboard:edit', label: '编辑仪表盘' },
      ],
    },
    {
      name: '用户管理',
      permissions: [
        { key: 'users:list', label: '查看用户列表' },
        { key: 'users:view', label: '查看用户详情' },
        { key: 'users:create', label: '创建用户' },
        { key: 'users:update', label: '更新用户' },
        { key: 'users:delete', label: '删除用户' },
      ],
    },
    {
      name: '角色管理',
      permissions: [
        { key: 'roles:list', label: '查看角色列表' },
        { key: 'roles:create', label: '创建角色' },
        { key: 'roles:update', label: '更新角色' },
        { key: 'roles:delete', label: '删除角色' },
      ],
    },
    {
      name: '系统设置',
      permissions: [
        { key: 'settings:view', label: '查看设置' },
        { key: 'settings:update', label: '更新设置' },
      ],
    },
  ];

  // Mock 数据
  readonly roles = signal<Role[]>([
    {
      id: 'admin',
      name: '超级管理员',
      description: '拥有系统全部权限',
      permissions: ['*'],
      userCount: 2,
      createdAt: '2024-01-01',
    },
    {
      id: 'manager',
      name: '经理',
      description: '可管理用户和查看数据',
      permissions: ['dashboard:view', 'dashboard:edit', 'users:list', 'users:view'],
      userCount: 5,
      createdAt: '2024-01-15',
    },
    {
      id: 'editor',
      name: '编辑',
      description: '可编辑内容',
      permissions: ['dashboard:view', 'users:list'],
      userCount: 12,
      createdAt: '2024-02-01',
    },
    {
      id: 'viewer',
      name: '访客',
      description: '只读权限',
      permissions: ['dashboard:view'],
      userCount: 28,
      createdAt: '2024-03-01',
    },
  ]);

  // Dialog state
  readonly dialogOpen = signal(false);
  readonly editingRole = signal<Role | null>(null);
  readonly formLoading = signal(false);
  readonly formError = signal('');

  // Form data
  readonly formData = {
    id: signal(''),
    name: signal(''),
    description: '',
    permissions: [] as string[],
  };

  // Delete dialog
  readonly deleteDialogOpen = signal(false);
  readonly deletingRole = signal<Role | null>(null);
  readonly deleteLoading = signal(false);

  protected getPermissionLabel(key: string): string {
    return this.permissionsMap[key as keyof typeof PERMISSIONS] || key;
  }

  openCreateDialog(): void {
    this.editingRole.set(null);
    this.formData.id.set('');
    this.formData.name.set('');
    this.formData.description = '';
    this.formData.permissions = [];
    this.formError.set('');
    this.dialogOpen.set(true);
  }

  editRole(role: Role): void {
    this.editingRole.set(role);
    this.formData.id.set(role.id);
    this.formData.name.set(role.name);
    this.formData.description = role.description;
    this.formData.permissions = [...role.permissions];
    this.formError.set('');
    this.dialogOpen.set(true);
  }

  closeDialog(): void {
    this.dialogOpen.set(false);
  }

  toggleAllPermissions(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.formData.permissions = ['*'];
    } else {
      this.formData.permissions = [];
    }
  }

  togglePermission(key: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.formData.permissions.includes(key)) {
        this.formData.permissions.push(key);
      }
    } else {
      this.formData.permissions = this.formData.permissions.filter((p) => p !== key);
    }
  }

  async saveRole(): Promise<void> {
    // Validation
    if (!this.formData.name()) {
      this.formError.set('请输入角色名称');
      return;
    }
    if (!this.formData.id()) {
      this.formError.set('请输入角色标识');
      return;
    }
    if (this.formData.permissions.length === 0) {
      this.formError.set('请至少选择一个权限');
      return;
    }

    this.formLoading.set(true);
    this.formError.set('');

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const existingRole = this.editingRole();
      if (existingRole) {
        // Update
        this.roles.update((roles) =>
          roles.map((r) =>
            r.id === existingRole.id
              ? {
                  ...r,
                  name: this.formData.name(),
                  description: this.formData.description,
                  permissions: [...this.formData.permissions],
                }
              : r
          )
        );
      } else {
        // Create
        const newRole: Role = {
          id: this.formData.id(),
          name: this.formData.name(),
          description: this.formData.description,
          permissions: [...this.formData.permissions],
          userCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };
        this.roles.update((roles) => [...roles, newRole]);
      }

      this.closeDialog();
    } catch {
      this.formError.set('保存失败，请重试');
    } finally {
      this.formLoading.set(false);
    }
  }

  deleteRole(role: Role): void {
    this.deletingRole.set(role);
    this.deleteDialogOpen.set(true);
  }

  closeDeleteDialog(): void {
    this.deleteDialogOpen.set(false);
    this.deletingRole.set(null);
  }

  async confirmDelete(): Promise<void> {
    const role = this.deletingRole();
    if (!role) return;

    this.deleteLoading.set(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.roles.update((roles) => roles.filter((r) => r.id !== role.id));
      this.closeDeleteDialog();
    } catch {
      // Handle error
    } finally {
      this.deleteLoading.set(false);
    }
  }
}
