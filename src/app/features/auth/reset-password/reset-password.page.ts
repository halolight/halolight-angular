import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthShellComponent } from '../../../shared/components/auth-shell';
import {
  ButtonComponent,
  InputComponent,
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  CardFooterComponent,
  SeparatorComponent,
} from '../../../shared/components/ui';
import { LucideAngularModule, ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-angular';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    AuthShellComponent,
    ButtonComponent,
    InputComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    CardFooterComponent,
    SeparatorComponent,
    LucideAngularModule,
  ],
  template: `
    <app-auth-shell>
      <!-- 左侧内容 -->
      <div leftContent class="animate-fade-in-up">
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-12">
          <div class="relative h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
            <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
          </div>
          <div>
            <h2 class="text-2xl font-bold tracking-tight">Admin Pro</h2>
            <p class="text-xs text-white/60">企业级管理系统</p>
          </div>
        </div>

        <!-- 标题 -->
        <h1 class="text-5xl xl:text-6xl font-bold mb-6 leading-tight">
          重置密码
          <span class="inline-block ml-2 animate-wave">🔐</span>
        </h1>
        <p class="text-lg text-white/70 max-w-md leading-relaxed mb-12">
          设置一个新的安全密码，保护您的账户安全。建议使用包含字母、数字和特殊字符的组合。
        </p>

        <!-- 特性列表 -->
        <div class="space-y-4">
          @for (item of features; track item.text) {
            <div class="flex items-center gap-3 group">
              <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                {{ item.icon }}
              </div>
              <span class="text-white/90">{{ item.text }}</span>
            </div>
          }
        </div>
      </div>

      <!-- 右侧表单 -->
      <div rightContent class="w-full max-w-md animate-fade-in-up">
        <!-- 移动端 Logo -->
        <div class="mb-5 lg:hidden text-center">
          <div class="inline-flex items-center gap-3 mb-3 px-6 py-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl">
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span class="text-xl font-bold text-white">Admin Pro</span>
          </div>
          <p class="text-sm text-muted-foreground">设置新密码，保护账户安全</p>
        </div>

        <ui-card class="border border-border/50 shadow-2xl backdrop-blur-xl bg-card/80 overflow-hidden">
          <!-- 渐变顶部条 -->
          <div class="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>

          @if (!success()) {
            <ui-card-header class="space-y-1 text-center pb-3 sm:pb-5 pt-4 sm:pt-7">
              <ui-card-title class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                重置密码
              </ui-card-title>
              <ui-card-description class="text-xs sm:text-sm mt-2">
                请输入您的新密码
              </ui-card-description>
            </ui-card-header>

            <ui-card-content class="space-y-3 sm:space-y-4 px-4 sm:px-6">
              @if (tokenError()) {
                <div class="text-center py-4">
                  <div class="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <svg class="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p class="text-destructive mb-4">{{ tokenError() }}</p>
                  <a routerLink="/auth/forgot-password" class="text-primary hover:underline">
                    重新获取重置链接
                  </a>
                </div>
              } @else {
                <form (ngSubmit)="onSubmit()" class="space-y-3 sm:space-y-4">
                  @if (error()) {
                    <div class="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm animate-shake">
                      {{ error() }}
                    </div>
                  }

                  <!-- 新密码输入 -->
                  <div class="space-y-2">
                    <label class="text-xs font-medium text-muted-foreground">新密码</label>
                    <div class="relative">
                      <lucide-angular [img]="LockIcon" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <ui-input
                        [type]="showPassword() ? 'text' : 'password'"
                        placeholder="至少8个字符"
                        class="pl-10 pr-10 h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
                        [(value)]="password"
                      />
                      <button
                        type="button"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        (click)="togglePassword()"
                      >
                        <lucide-angular [img]="showPassword() ? EyeOffIcon : EyeIcon" class="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <!-- 确认密码输入 -->
                  <div class="space-y-2">
                    <label class="text-xs font-medium text-muted-foreground">确认密码</label>
                    <div class="relative">
                      <lucide-angular [img]="LockIcon" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <ui-input
                        [type]="showConfirmPassword() ? 'text' : 'password'"
                        placeholder="再次输入密码"
                        class="pl-10 pr-10 h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
                        [(value)]="confirmPassword"
                      />
                      <button
                        type="button"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        (click)="toggleConfirmPassword()"
                      >
                        <lucide-angular [img]="showConfirmPassword() ? EyeOffIcon : EyeIcon" class="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <!-- 密码强度指示器 -->
                  <div class="space-y-2">
                    <div class="flex gap-1">
                      @for (i of [1, 2, 3, 4]; track i) {
                        <div
                          class="h-1.5 flex-1 rounded-full transition-colors"
                          [class]="getStrengthColor(i)"
                        ></div>
                      }
                    </div>
                    <p class="text-xs text-muted-foreground">{{ strengthText() }}</p>
                  </div>

                  <!-- 重置按钮 -->
                  <ui-button
                    type="submit"
                    class="w-full h-12 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    [disabled]="loading()"
                  >
                    @if (loading()) {
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      重置中...
                    } @else {
                      重置密码
                      <span class="ml-2">→</span>
                    }
                  </ui-button>
                </form>
              }
            </ui-card-content>

            <ui-card-footer class="flex-col space-y-3 sm:space-y-4 px-4 sm:px-6 pb-5 sm:pb-8 pt-2">
              <ui-separator />
              <a routerLink="/auth/login" class="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <lucide-angular [img]="ArrowLeftIcon" class="h-4 w-4" />
                返回登录
              </a>
            </ui-card-footer>
          } @else {
            <ui-card-header class="text-center pb-3 sm:pb-5 pt-4 sm:pt-7">
              <div class="mx-auto mb-4 h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <lucide-angular [img]="CheckCircleIcon" class="h-8 w-8 text-green-500" />
              </div>
              <ui-card-title class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                密码已重置
              </ui-card-title>
              <ui-card-description class="text-xs sm:text-sm mt-2">
                您的密码已成功重置，现在可以使用新密码登录
              </ui-card-description>
            </ui-card-header>

            <ui-card-content class="px-4 sm:px-6">
              <ui-button
                class="w-full h-12 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                (click)="goToLogin()"
              >
                前往登录
                <span class="ml-2">→</span>
              </ui-button>
            </ui-card-content>

            <ui-card-footer class="pb-5 sm:pb-8"></ui-card-footer>
          }
        </ui-card>
      </div>
    </app-auth-shell>
  `,
  styles: [`
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes wave {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(20deg); }
      75% { transform: rotate(-20deg); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    :host ::ng-deep .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
    :host ::ng-deep .animate-wave { animation: wave 2s ease-in-out infinite; }
    :host ::ng-deep .animate-shake { animation: shake 0.3s ease-in-out; }
  `],
})
export class ResetPasswordPage implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly LockIcon = Lock;
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly CheckCircleIcon = CheckCircle;

  password = signal('');
  confirmPassword = signal('');
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  loading = signal(false);
  error = signal('');
  success = signal(false);
  tokenError = signal('');

  private token = '';

  // 特性列表
  readonly features = [
    { icon: '🔒', text: '使用强密码保护账户' },
    { icon: '🔢', text: '至少8个字符' },
    { icon: '🔠', text: '包含大小写字母' },
    { icon: '⭐', text: '添加数字或特殊字符' },
  ];

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.tokenError.set('重置链接无效或已过期');
      }
    });
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  getPasswordStrength(): number {
    const pwd = this.password();
    if (!pwd) return 0;

    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++;

    return strength;
  }

  getStrengthColor(index: number): string {
    const strength = this.getPasswordStrength();
    if (index > strength) return 'bg-muted';

    switch (strength) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      default: return 'bg-muted';
    }
  }

  strengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 0: return '请输入密码';
      case 1: return '密码强度：弱';
      case 2: return '密码强度：一般';
      case 3: return '密码强度：强';
      case 4: return '密码强度：非常强';
      default: return '';
    }
  }

  async onSubmit(): Promise<void> {
    const pwd = this.password();
    const confirmPwd = this.confirmPassword();

    if (!pwd || !confirmPwd) {
      this.error.set('请填写所有字段');
      return;
    }

    if (pwd.length < 8) {
      this.error.set('密码至少需要8个字符');
      return;
    }

    if (pwd !== confirmPwd) {
      this.error.set('两次输入的密码不一致');
      return;
    }

    if (this.getPasswordStrength() < 2) {
      this.error.set('密码强度不足，请使用更复杂的密码');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      this.success.set(true);
    } catch {
      this.error.set('重置失败，请稍后重试');
    } finally {
      this.loading.set(false);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
