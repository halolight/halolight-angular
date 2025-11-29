import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, User, Mail, Lock, Camera, Shield, Clock, Save } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import {
  ButtonComponent,
  InputComponent,
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
} from '../../shared/components/ui';

@Component({
  selector: 'app-profile-page',
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
      <div>
        <h1 class="text-3xl font-bold text-foreground">个人中心</h1>
        <p class="text-muted-foreground">管理您的账户信息和安全设置</p>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <!-- 左侧：头像和基本信息 -->
        <div class="lg:col-span-1">
          <ui-card>
            <ui-card-content class="pt-6">
              <div class="flex flex-col items-center text-center">
                <!-- 头像 -->
                <div class="relative">
                  <div class="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold">
                    {{ userInitials() }}
                  </div>
                  <button
                    type="button"
                    class="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-accent border border-border flex items-center justify-center hover:bg-accent/80 transition-colors"
                    (click)="triggerAvatarUpload()"
                  >
                    <lucide-angular [img]="CameraIcon" class="h-4 w-4" />
                  </button>
                  <input
                    #avatarInput
                    type="file"
                    accept="image/*"
                    class="hidden"
                    (change)="onAvatarChange($event)"
                  />
                </div>

                <h2 class="mt-4 text-xl font-semibold text-foreground">{{ auth.user()?.name || '用户' }}</h2>
                <p class="text-sm text-muted-foreground">{{ auth.user()?.email }}</p>

                <div class="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <lucide-angular [img]="ShieldIcon" class="h-4 w-4" />
                  <span>{{ getRoleName() }}</span>
                </div>
              </div>
            </ui-card-content>
          </ui-card>

          <!-- 账户活动 -->
          <ui-card class="mt-6">
            <ui-card-header>
              <ui-card-title class="flex items-center gap-2">
                <lucide-angular [img]="ClockIcon" class="h-5 w-5" />
                账户活动
              </ui-card-title>
            </ui-card-header>
            <ui-card-content>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">上次登录</span>
                  <span class="text-foreground">{{ lastLogin }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">登录 IP</span>
                  <span class="text-foreground">192.168.1.100</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">账户创建</span>
                  <span class="text-foreground">2024-01-15</span>
                </div>
              </div>
            </ui-card-content>
          </ui-card>
        </div>

        <!-- 右侧：编辑表单 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 基本信息 -->
          <ui-card>
            <ui-card-header>
              <ui-card-title class="flex items-center gap-2">
                <lucide-angular [img]="UserIcon" class="h-5 w-5" />
                基本信息
              </ui-card-title>
              <ui-card-description>更新您的个人资料信息</ui-card-description>
            </ui-card-header>
            <ui-card-content>
              <form (ngSubmit)="updateProfile()" class="space-y-4">
                <div class="grid gap-4 sm:grid-cols-2">
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-foreground">姓名</label>
                    <ui-input
                      type="text"
                      placeholder="请输入姓名"
                      [(value)]="profileForm.name"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-foreground">邮箱</label>
                    <ui-input
                      type="email"
                      placeholder="请输入邮箱"
                      [(value)]="profileForm.email"
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">手机号</label>
                  <ui-input
                    type="text"
                    placeholder="请输入手机号"
                    [(value)]="profileForm.phone"
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">个人简介</label>
                  <textarea
                    class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="介绍一下自己..."
                    rows="3"
                    [(ngModel)]="profileForm.bio"
                  ></textarea>
                </div>

                @if (profileMessage()) {
                  <p
                    [class]="profileSuccess() ? 'text-sm text-green-500' : 'text-sm text-destructive'"
                  >
                    {{ profileMessage() }}
                  </p>
                }

                <div class="flex justify-end">
                  <ui-button type="submit" [disabled]="profileLoading()">
                    @if (profileLoading()) {
                      保存中...
                    } @else {
                      <lucide-angular [img]="SaveIcon" class="h-4 w-4 mr-2" />
                      保存更改
                    }
                  </ui-button>
                </div>
              </form>
            </ui-card-content>
          </ui-card>

          <!-- 修改密码 -->
          <ui-card>
            <ui-card-header>
              <ui-card-title class="flex items-center gap-2">
                <lucide-angular [img]="LockIcon" class="h-5 w-5" />
                修改密码
              </ui-card-title>
              <ui-card-description>确保使用强密码以保护您的账户安全</ui-card-description>
            </ui-card-header>
            <ui-card-content>
              <form (ngSubmit)="updatePassword()" class="space-y-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">当前密码</label>
                  <ui-input
                    type="password"
                    placeholder="请输入当前密码"
                    [(value)]="passwordForm.currentPassword"
                  />
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-foreground">新密码</label>
                    <ui-input
                      type="password"
                      placeholder="请输入新密码"
                      [(value)]="passwordForm.newPassword"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-foreground">确认新密码</label>
                    <ui-input
                      type="password"
                      placeholder="请再次输入新密码"
                      [(value)]="passwordForm.confirmPassword"
                    />
                  </div>
                </div>

                <!-- 密码强度提示 -->
                @if (passwordForm.newPassword()) {
                  <div class="space-y-2">
                    <div class="flex gap-1">
                      @for (i of [1, 2, 3, 4]; track i) {
                        <div
                          class="h-1 flex-1 rounded-full transition-colors"
                          [class]="i <= passwordStrength() ? getStrengthColor() : 'bg-muted'"
                        ></div>
                      }
                    </div>
                    <p class="text-xs text-muted-foreground">
                      密码强度：{{ getStrengthText() }}
                    </p>
                  </div>
                }

                @if (passwordMessage()) {
                  <p
                    [class]="passwordSuccess() ? 'text-sm text-green-500' : 'text-sm text-destructive'"
                  >
                    {{ passwordMessage() }}
                  </p>
                }

                <div class="flex justify-end">
                  <ui-button type="submit" [disabled]="passwordLoading()">
                    @if (passwordLoading()) {
                      更新中...
                    } @else {
                      更新密码
                    }
                  </ui-button>
                </div>
              </form>
            </ui-card-content>
          </ui-card>
        </div>
      </div>
    </div>
  `,
})
export class ProfilePage {
  protected readonly auth = inject(AuthService);

  // Icons
  protected readonly UserIcon = User;
  protected readonly MailIcon = Mail;
  protected readonly LockIcon = Lock;
  protected readonly CameraIcon = Camera;
  protected readonly ShieldIcon = Shield;
  protected readonly ClockIcon = Clock;
  protected readonly SaveIcon = Save;

  // 模拟上次登录时间
  protected readonly lastLogin = new Date().toLocaleString('zh-CN');

  // Profile form
  readonly profileForm = {
    name: signal(this.auth.user()?.name || ''),
    email: signal(this.auth.user()?.email || ''),
    phone: signal(''),
    bio: '',
  };
  readonly profileLoading = signal(false);
  readonly profileMessage = signal('');
  readonly profileSuccess = signal(false);

  // Password form
  readonly passwordForm = {
    currentPassword: signal(''),
    newPassword: signal(''),
    confirmPassword: signal(''),
  };
  readonly passwordLoading = signal(false);
  readonly passwordMessage = signal('');
  readonly passwordSuccess = signal(false);

  protected userInitials(): string {
    const name = this.auth.user()?.name || '用户';
    return name.charAt(0).toUpperCase();
  }

  protected getRoleName(): string {
    const role = this.auth.user()?.role;
    const roleNames: Record<string, string> = {
      admin: '管理员',
      manager: '经理',
      user: '普通用户',
    };
    return roleNames[role || 'user'] || '普通用户';
  }

  protected passwordStrength(): number {
    const password = this.passwordForm.newPassword();
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    return strength;
  }

  protected getStrengthColor(): string {
    const strength = this.passwordStrength();
    if (strength <= 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  protected getStrengthText(): string {
    const strength = this.passwordStrength();
    if (strength <= 1) return '弱';
    if (strength === 2) return '一般';
    if (strength === 3) return '强';
    return '非常强';
  }

  protected triggerAvatarUpload(): void {
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    input?.click();
  }

  protected onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      // Mock avatar upload
      console.log('Selected file:', input.files[0].name);
      // In a real app, you would upload the file here
    }
  }

  async updateProfile(): Promise<void> {
    this.profileLoading.set(true);
    this.profileMessage.set('');

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update auth state
      const currentUser = this.auth.user();
      if (currentUser) {
        this.auth.setAuth(this.auth.token || '', {
          ...currentUser,
          name: this.profileForm.name(),
          email: this.profileForm.email(),
        });
      }

      this.profileSuccess.set(true);
      this.profileMessage.set('个人信息已更新');
    } catch {
      this.profileSuccess.set(false);
      this.profileMessage.set('更新失败，请重试');
    } finally {
      this.profileLoading.set(false);
    }
  }

  async updatePassword(): Promise<void> {
    // Validation
    if (!this.passwordForm.currentPassword()) {
      this.passwordSuccess.set(false);
      this.passwordMessage.set('请输入当前密码');
      return;
    }

    if (this.passwordForm.newPassword() !== this.passwordForm.confirmPassword()) {
      this.passwordSuccess.set(false);
      this.passwordMessage.set('两次输入的密码不一致');
      return;
    }

    if (this.passwordStrength() < 2) {
      this.passwordSuccess.set(false);
      this.passwordMessage.set('密码强度不足，请使用更复杂的密码');
      return;
    }

    this.passwordLoading.set(true);
    this.passwordMessage.set('');

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.passwordSuccess.set(true);
      this.passwordMessage.set('密码已更新');

      // Clear form
      this.passwordForm.currentPassword.set('');
      this.passwordForm.newPassword.set('');
      this.passwordForm.confirmPassword.set('');
    } catch {
      this.passwordSuccess.set(false);
      this.passwordMessage.set('更新失败，请重试');
    } finally {
      this.passwordLoading.set(false);
    }
  }
}
