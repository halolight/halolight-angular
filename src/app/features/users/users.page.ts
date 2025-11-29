import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  ButtonComponent,
  InputComponent,
  BadgeComponent,
  AvatarComponent,
  AvatarImageComponent,
  AvatarFallbackComponent,
  SelectComponent,
  type SelectOption,
  DialogComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
  DialogDescriptionComponent,
  DialogContentComponent,
  DialogFooterComponent,
  DropdownComponent,
  type DropdownMenuItem,
  PaginationComponent,
  LabelComponent,
  ToastService,
} from '../../shared/components/ui';
import { LucideAngularModule, Search, Plus, MoreHorizontal, Pencil, Trash2, UserPlus, Filter, Download, Upload } from 'lucide-angular';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  department: string;
  createdAt: string;
  lastLogin?: string;
}

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    FormsModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    ButtonComponent,
    InputComponent,
    BadgeComponent,
    AvatarComponent,
    AvatarImageComponent,
    AvatarFallbackComponent,
    SelectComponent,
    DialogComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    DialogContentComponent,
    DialogFooterComponent,
    DropdownComponent,
    PaginationComponent,
    LabelComponent,
    LucideAngularModule,
  ],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-foreground">用户管理</h1>
          <p class="text-muted-foreground mt-1">管理系统用户、角色和权限</p>
        </div>
        <div class="flex items-center gap-2">
          <ui-button variant="outline" size="sm">
            <lucide-icon [img]="DownloadIcon" class="h-4 w-4 mr-2" />
            导出
          </ui-button>
          <ui-button variant="outline" size="sm">
            <lucide-icon [img]="UploadIcon" class="h-4 w-4 mr-2" />
            导入
          </ui-button>
          <ui-button (click)="openAddDialog()">
            <lucide-icon [img]="PlusIcon" class="h-4 w-4 mr-2" />
            添加用户
          </ui-button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid gap-4 md:grid-cols-4">
        <ui-card>
          <ui-card-content class="pt-6">
            <div class="text-2xl font-bold">{{ totalUsers() }}</div>
            <p class="text-xs text-muted-foreground">总用户数</p>
          </ui-card-content>
        </ui-card>
        <ui-card>
          <ui-card-content class="pt-6">
            <div class="text-2xl font-bold text-green-500">{{ activeUsers() }}</div>
            <p class="text-xs text-muted-foreground">活跃用户</p>
          </ui-card-content>
        </ui-card>
        <ui-card>
          <ui-card-content class="pt-6">
            <div class="text-2xl font-bold text-yellow-500">{{ pendingUsers() }}</div>
            <p class="text-xs text-muted-foreground">待审核</p>
          </ui-card-content>
        </ui-card>
        <ui-card>
          <ui-card-content class="pt-6">
            <div class="text-2xl font-bold text-red-500">{{ inactiveUsers() }}</div>
            <p class="text-xs text-muted-foreground">已禁用</p>
          </ui-card-content>
        </ui-card>
      </div>

      <!-- Filters and Search -->
      <ui-card>
        <ui-card-content class="pt-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1 relative">
              <lucide-icon [img]="SearchIcon" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <ui-input
                placeholder="搜索用户名或邮箱..."
                class="pl-10"
                [(ngModel)]="searchQuery"
              />
            </div>
            <ui-select
              [options]="roleOptions"
              [(ngModel)]="selectedRole"
              placeholder="角色筛选"
              class="w-full md:w-40"
            />
            <ui-select
              [options]="statusOptions"
              [(ngModel)]="selectedStatus"
              placeholder="状态筛选"
              class="w-full md:w-40"
            />
            <ui-button variant="outline" (click)="resetFilters()">
              <lucide-icon [img]="FilterIcon" class="h-4 w-4 mr-2" />
              重置
            </ui-button>
          </div>
        </ui-card-content>
      </ui-card>

      <!-- Users Table -->
      <ui-card>
        <ui-card-header>
          <ui-card-title>用户列表</ui-card-title>
          <ui-card-description>共 {{ filteredUsers().length }} 个用户</ui-card-description>
        </ui-card-header>
        <ui-card-content>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border">
                  <th class="text-left py-3 px-4 font-medium text-muted-foreground">用户</th>
                  <th class="text-left py-3 px-4 font-medium text-muted-foreground">角色</th>
                  <th class="text-left py-3 px-4 font-medium text-muted-foreground">部门</th>
                  <th class="text-left py-3 px-4 font-medium text-muted-foreground">状态</th>
                  <th class="text-left py-3 px-4 font-medium text-muted-foreground">最后登录</th>
                  <th class="text-right py-3 px-4 font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                @for (user of paginatedUsers(); track user.id) {
                  <tr class="border-b border-border hover:bg-accent/50 transition-colors">
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-3">
                        <ui-avatar size="sm">
                          @if (user.avatar) {
                            <ui-avatar-image [src]="user.avatar" [alt]="user.name" />
                          }
                          <ui-avatar-fallback>{{ getInitials(user.name) }}</ui-avatar-fallback>
                        </ui-avatar>
                        <div>
                          <div class="font-medium text-foreground">{{ user.name }}</div>
                          <div class="text-sm text-muted-foreground">{{ user.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-4">
                      <ui-badge [variant]="getRoleBadgeVariant(user.role)">
                        {{ getRoleLabel(user.role) }}
                      </ui-badge>
                    </td>
                    <td class="py-3 px-4 text-muted-foreground">{{ user.department }}</td>
                    <td class="py-3 px-4">
                      <ui-badge [variant]="getStatusBadgeVariant(user.status)">
                        {{ getStatusLabel(user.status) }}
                      </ui-badge>
                    </td>
                    <td class="py-3 px-4 text-muted-foreground">
                      {{ user.lastLogin || '从未登录' }}
                    </td>
                    <td class="py-3 px-4 text-right">
                      <ui-dropdown [items]="getActionMenuItems(user)" align="end">
                        <ui-button variant="ghost" size="icon">
                          <lucide-icon [img]="MoreIcon" class="h-4 w-4" />
                        </ui-button>
                      </ui-dropdown>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="py-12 text-center text-muted-foreground">
                      <lucide-icon [img]="UserPlusIcon" class="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>暂无用户数据</p>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          @if (totalPages() > 1) {
            <div class="mt-4 flex justify-center">
              <ui-pagination
                [currentPage]="currentPage()"
                [totalPages]="totalPages()"
                (pageChange)="onPageChange($event)"
              />
            </div>
          }
        </ui-card-content>
      </ui-card>

      <!-- Add/Edit User Dialog -->
      <ui-dialog [(open)]="dialogOpen">
        <ui-dialog-header>
          <ui-dialog-title>{{ editingUser() ? '编辑用户' : '添加用户' }}</ui-dialog-title>
          <ui-dialog-description>
            {{ editingUser() ? '修改用户信息' : '创建新的系统用户' }}
          </ui-dialog-description>
        </ui-dialog-header>
        <ui-dialog-content>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <ui-label for="userName">用户名</ui-label>
                <ui-input
                  id="userName"
                  [(ngModel)]="formData.name"
                  placeholder="请输入用户名"
                />
              </div>
              <div class="space-y-2">
                <ui-label for="userEmail">邮箱</ui-label>
                <ui-input
                  id="userEmail"
                  type="email"
                  [(ngModel)]="formData.email"
                  placeholder="请输入邮箱"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <ui-label for="userRole">角色</ui-label>
                <ui-select
                  id="userRole"
                  [options]="roleOptions.slice(1)"
                  [(ngModel)]="formData.role"
                  placeholder="请选择角色"
                />
              </div>
              <div class="space-y-2">
                <ui-label for="userDepartment">部门</ui-label>
                <ui-select
                  id="userDepartment"
                  [options]="departmentOptions"
                  [(ngModel)]="formData.department"
                  placeholder="请选择部门"
                />
              </div>
            </div>
            <div class="space-y-2">
              <ui-label for="userStatus">状态</ui-label>
              <ui-select
                id="userStatus"
                [options]="statusOptions.slice(1)"
                [(ngModel)]="formData.status"
                placeholder="请选择状态"
              />
            </div>
          </div>
        </ui-dialog-content>
        <ui-dialog-footer>
          <ui-button variant="outline" (click)="closeDialog()">取消</ui-button>
          <ui-button (click)="saveUser()">
            {{ editingUser() ? '保存' : '创建' }}
          </ui-button>
        </ui-dialog-footer>
      </ui-dialog>

      <!-- Delete Confirmation Dialog -->
      <ui-dialog [(open)]="deleteDialogOpen">
        <ui-dialog-header>
          <ui-dialog-title>确认删除</ui-dialog-title>
          <ui-dialog-description>
            确定要删除用户 "{{ deletingUser()?.name }}" 吗？此操作无法撤销。
          </ui-dialog-description>
        </ui-dialog-header>
        <ui-dialog-footer>
          <ui-button variant="outline" (click)="deleteDialogOpen.set(false)">取消</ui-button>
          <ui-button variant="destructive" (click)="confirmDelete()">删除</ui-button>
        </ui-dialog-footer>
      </ui-dialog>
    </div>
  `,
})
export class UsersPage {
  // Icons
  readonly SearchIcon = Search;
  readonly PlusIcon = Plus;
  readonly MoreIcon = MoreHorizontal;
  readonly PencilIcon = Pencil;
  readonly TrashIcon = Trash2;
  readonly UserPlusIcon = UserPlus;
  readonly FilterIcon = Filter;
  readonly DownloadIcon = Download;
  readonly UploadIcon = Upload;

  private readonly toast = inject(ToastService);

  // Mock data
  readonly users = signal<User[]>([
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin', status: 'active', department: '技术部', createdAt: '2024-01-15', lastLogin: '2024-11-28 14:30' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: 'editor', status: 'active', department: '产品部', createdAt: '2024-02-20', lastLogin: '2024-11-27 09:15' },
    { id: 3, name: '王五', email: 'wangwu@example.com', role: 'viewer', status: 'pending', department: '市场部', createdAt: '2024-03-10' },
    { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: 'editor', status: 'inactive', department: '运营部', createdAt: '2024-04-05', lastLogin: '2024-10-15 16:45' },
    { id: 5, name: '钱七', email: 'qianqi@example.com', role: 'viewer', status: 'active', department: '技术部', createdAt: '2024-05-22', lastLogin: '2024-11-28 10:00' },
    { id: 6, name: '孙八', email: 'sunba@example.com', role: 'admin', status: 'active', department: '管理层', createdAt: '2024-01-01', lastLogin: '2024-11-28 08:30' },
    { id: 7, name: '周九', email: 'zhoujiu@example.com', role: 'editor', status: 'active', department: '设计部', createdAt: '2024-06-15', lastLogin: '2024-11-26 17:20' },
    { id: 8, name: '吴十', email: 'wushi@example.com', role: 'viewer', status: 'pending', department: '人事部', createdAt: '2024-07-08' },
    { id: 9, name: '郑十一', email: 'zheng11@example.com', role: 'editor', status: 'active', department: '财务部', createdAt: '2024-08-12', lastLogin: '2024-11-25 11:00' },
    { id: 10, name: '冯十二', email: 'feng12@example.com', role: 'viewer', status: 'inactive', department: '技术部', createdAt: '2024-09-01', lastLogin: '2024-09-30 14:00' },
    { id: 11, name: '陈十三', email: 'chen13@example.com', role: 'editor', status: 'active', department: '产品部', createdAt: '2024-10-05', lastLogin: '2024-11-28 09:45' },
    { id: 12, name: '褚十四', email: 'chu14@example.com', role: 'viewer', status: 'active', department: '市场部', createdAt: '2024-11-01', lastLogin: '2024-11-27 15:30' },
  ]);

  // Filters
  searchQuery = '';
  selectedRole = '';
  selectedStatus = '';

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);

  // Dialogs
  readonly dialogOpen = signal(false);
  readonly deleteDialogOpen = signal(false);
  readonly editingUser = signal<User | null>(null);
  readonly deletingUser = signal<User | null>(null);

  // Form data
  formData = {
    name: '',
    email: '',
    role: '',
    department: '',
    status: 'active',
  };

  // Options
  readonly roleOptions: SelectOption[] = [
    { value: '', label: '全部角色' },
    { value: 'admin', label: '管理员' },
    { value: 'editor', label: '编辑者' },
    { value: 'viewer', label: '访客' },
  ];

  readonly statusOptions: SelectOption[] = [
    { value: '', label: '全部状态' },
    { value: 'active', label: '活跃' },
    { value: 'inactive', label: '已禁用' },
    { value: 'pending', label: '待审核' },
  ];

  readonly departmentOptions: SelectOption[] = [
    { value: '技术部', label: '技术部' },
    { value: '产品部', label: '产品部' },
    { value: '设计部', label: '设计部' },
    { value: '市场部', label: '市场部' },
    { value: '运营部', label: '运营部' },
    { value: '人事部', label: '人事部' },
    { value: '财务部', label: '财务部' },
    { value: '管理层', label: '管理层' },
  ];

  // Computed stats
  readonly totalUsers = computed(() => this.users().length);
  readonly activeUsers = computed(() => this.users().filter(u => u.status === 'active').length);
  readonly pendingUsers = computed(() => this.users().filter(u => u.status === 'pending').length);
  readonly inactiveUsers = computed(() => this.users().filter(u => u.status === 'inactive').length);
  readonly totalPages = computed(() => Math.ceil(this.filteredUsers().length / this.pageSize()));

  // Filtered users
  readonly filteredUsers = computed(() => {
    let result = this.users();

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(
        u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
      );
    }

    if (this.selectedRole) {
      result = result.filter(u => u.role === this.selectedRole);
    }

    if (this.selectedStatus) {
      result = result.filter(u => u.status === this.selectedStatus);
    }

    return result;
  });

  // Paginated users
  readonly paginatedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredUsers().slice(start, end);
  });

  getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  getRoleBadgeVariant(role: User['role']): 'default' | 'secondary' | 'outline' {
    const variants: Record<User['role'], 'default' | 'secondary' | 'outline'> = {
      admin: 'default',
      editor: 'secondary',
      viewer: 'outline',
    };
    return variants[role];
  }

  getRoleLabel(role: User['role']): string {
    const labels: Record<User['role'], string> = {
      admin: '管理员',
      editor: '编辑者',
      viewer: '访客',
    };
    return labels[role];
  }

  getStatusBadgeVariant(status: User['status']): 'default' | 'secondary' | 'destructive' | 'outline' {
    const variants: Record<User['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      pending: 'secondary',
      inactive: 'destructive',
    };
    return variants[status];
  }

  getStatusLabel(status: User['status']): string {
    const labels: Record<User['status'], string> = {
      active: '活跃',
      pending: '待审核',
      inactive: '已禁用',
    };
    return labels[status];
  }

  getActionMenuItems(user: User): DropdownMenuItem[] {
    return [
      { label: '编辑', onClick: () => this.openEditDialog(user) },
      { separator: true },
      { label: '删除', onClick: () => this.openDeleteDialog(user) },
    ];
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  openAddDialog(): void {
    this.editingUser.set(null);
    this.formData = {
      name: '',
      email: '',
      role: '',
      department: '',
      status: 'active',
    };
    this.dialogOpen.set(true);
  }

  openEditDialog(user: User): void {
    this.editingUser.set(user);
    this.formData = {
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
    };
    this.dialogOpen.set(true);
  }

  closeDialog(): void {
    this.dialogOpen.set(false);
    this.editingUser.set(null);
  }

  saveUser(): void {
    if (!this.formData.name || !this.formData.email) {
      this.toast.error('请填写必填字段');
      return;
    }

    if (this.editingUser()) {
      // Update existing user
      const updated = this.users().map(u =>
        u.id === this.editingUser()!.id
          ? {
              ...u,
              name: this.formData.name,
              email: this.formData.email,
              role: this.formData.role as User['role'],
              department: this.formData.department,
              status: this.formData.status as User['status'],
            }
          : u
      );
      this.users.set(updated);
      this.toast.success('用户信息已更新');
    } else {
      // Add new user
      const newUser: User = {
        id: Math.max(...this.users().map(u => u.id)) + 1,
        name: this.formData.name,
        email: this.formData.email,
        role: (this.formData.role || 'viewer') as User['role'],
        department: this.formData.department || '技术部',
        status: (this.formData.status || 'active') as User['status'],
        createdAt: new Date().toISOString().split('T')[0],
      };
      this.users.update(users => [...users, newUser]);
      this.toast.success('用户创建成功');
    }

    this.closeDialog();
  }

  openDeleteDialog(user: User): void {
    this.deletingUser.set(user);
    this.deleteDialogOpen.set(true);
  }

  confirmDelete(): void {
    if (this.deletingUser()) {
      this.users.update(users => users.filter(u => u.id !== this.deletingUser()!.id));
      this.toast.success('用户已删除');
      this.deleteDialogOpen.set(false);
      this.deletingUser.set(null);
    }
  }
}
