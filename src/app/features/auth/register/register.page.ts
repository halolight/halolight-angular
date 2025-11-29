import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../../core/services/auth.service';
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

@Component({
  selector: 'app-register-page',
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
          加入我们
          <span class="inline-block ml-2 animate-wave">🎉</span>
        </h1>
        <p class="text-lg text-white/70 max-w-md leading-relaxed mb-12">
          创建您的账户，开启高效的团队协作之旅，体验现代化的管理方式。
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
          <p class="text-sm text-muted-foreground">创建账户，开启管理之旅</p>
        </div>

        <ui-card class="border border-border/50 shadow-2xl backdrop-blur-xl bg-card/80 overflow-hidden">
          <!-- 渐变顶部条 -->
          <div class="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>

          <ui-card-header class="space-y-1 text-center pb-3 sm:pb-5 pt-4 sm:pt-7">
            <ui-card-title class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              创建账户
            </ui-card-title>
            <ui-card-description class="text-xs sm:text-sm mt-2">
              填写以下信息完成注册
            </ui-card-description>
          </ui-card-header>

          <ui-card-content class="space-y-3 sm:space-y-4 px-4 sm:px-6">
            <!-- 社交登录按钮 -->
            <div class="grid grid-cols-3 gap-2 sm:gap-3">
              @for (provider of socialProviders; track provider.name) {
                <ui-button
                  variant="outline"
                  class="w-full h-11 sm:h-12 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
                  (click)="handleSocialRegister(provider.name)"
                >
                  <span [innerHTML]="provider.icon" class="group-hover:scale-110 transition-transform"></span>
                </ui-button>
              }
            </div>

            <!-- 分隔线 -->
            <div class="relative py-3">
              <div class="absolute inset-0 flex items-center">
                <ui-separator />
              </div>
              <div class="relative flex justify-center text-xs uppercase">
                <span class="bg-card px-3 text-muted-foreground font-medium">
                  或使用邮箱注册
                </span>
              </div>
            </div>

            <!-- 注册表单 -->
            <form (ngSubmit)="onSubmit()" class="space-y-3 sm:space-y-4">
              @if (error()) {
                <div class="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm animate-shake">
                  {{ error() }}
                </div>
              }

              <!-- 姓名输入 -->
              <div class="space-y-2">
                <label class="text-xs font-medium text-muted-foreground">姓名</label>
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <ui-input
                    type="text"
                    placeholder="您的姓名"
                    class="pl-10 h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
                    [(value)]="name"
                  />
                </div>
              </div>

              <!-- 邮箱输入 -->
              <div class="space-y-2">
                <label class="text-xs font-medium text-muted-foreground">邮箱地址</label>
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <ui-input
                    type="email"
                    placeholder="your@email.h7ml.cn"
                    class="pl-10 h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
                    [(value)]="email"
                  />
                </div>
              </div>

              <!-- 密码输入 -->
              <div class="space-y-2">
                <label class="text-xs font-medium text-muted-foreground">密码</label>
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <ui-input
                    [type]="showPassword() ? 'text' : 'password'"
                    placeholder="至少8个字符"
                    class="pl-10 pr-10 h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
                    [(value)]="password"
                  />
                  <button
                    type="button"
                    (click)="togglePassword()"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    @if (showPassword()) {
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    } @else {
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    }
                  </button>
                </div>
              </div>

              <!-- 确认密码输入 -->
              <div class="space-y-2">
                <label class="text-xs font-medium text-muted-foreground">确认密码</label>
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <ui-input
                    [type]="showConfirmPassword() ? 'text' : 'password'"
                    placeholder="再次输入密码"
                    class="pl-10 pr-10 h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
                    [(value)]="confirmPassword"
                  />
                  <button
                    type="button"
                    (click)="toggleConfirmPassword()"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    @if (showConfirmPassword()) {
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    } @else {
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    }
                  </button>
                </div>
              </div>

              <!-- 服务条款 -->
              <div class="flex items-start gap-2 text-xs sm:text-sm">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  [(ngModel)]="agreeTerms"
                  class="rounded border-gray-300 w-4 h-4 mt-0.5 text-primary focus:ring-primary"
                />
                <span class="text-muted-foreground">
                  我已阅读并同意
                  <a href="/terms" class="text-primary hover:underline">服务条款</a>
                  和
                  <a href="/privacy" class="text-primary hover:underline">隐私政策</a>
                </span>
              </div>

              <!-- 注册按钮 -->
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
                  注册中...
                } @else {
                  创建账户
                  <span class="ml-2">→</span>
                }
              </ui-button>
            </form>
          </ui-card-content>

          <ui-card-footer class="flex-col space-y-3 sm:space-y-4 px-4 sm:px-6 pb-5 sm:pb-8 pt-2">
            <ui-separator />
            <p class="text-xs sm:text-sm text-muted-foreground text-center">
              已有账户？
              <a routerLink="/auth/login" class="text-primary hover:text-primary/80 font-semibold transition-colors">
                立即登录
              </a>
            </p>
          </ui-card-footer>
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
export class RegisterPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);

  // 表单状态
  name = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  agreeTerms = false;
  loading = signal(false);
  error = signal('');

  // 特性列表
  readonly features = [
    { icon: '🎯', text: '简洁直观的操作界面' },
    { icon: '📈', text: '实时数据分析报告' },
    { icon: '🔐', text: '企业级数据安全' },
    { icon: '🌐', text: '多端同步，随时随地' },
  ];

  // 社交登录提供商
  readonly socialProviders: { name: string; icon: SafeHtml }[] = [];

  constructor() {
    this.socialProviders = [
      { name: 'github', icon: this.sanitizer.bypassSecurityTrustHtml('<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>') },
      { name: 'google', icon: this.sanitizer.bypassSecurityTrustHtml('<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>') },
      { name: 'wechat', icon: this.sanitizer.bypassSecurityTrustHtml('<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" fill="#07C160"/></svg>') },
    ];
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(v => !v);
  }

  handleSocialRegister(provider: string): void {
    console.log(`使用 ${provider} 注册`);
  }

  async onSubmit(): Promise<void> {
    if (!this.name() || !this.email() || !this.password() || !this.confirmPassword()) {
      this.error.set('请填写所有字段');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.error.set('两次输入的密码不一致');
      return;
    }

    if (this.password().length < 8) {
      this.error.set('密码至少需要8个字符');
      return;
    }

    if (!this.agreeTerms) {
      this.error.set('请阅读并同意服务条款和隐私政策');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.auth.setAuth('mock-token-123', {
        id: '1',
        email: this.email(),
        name: this.name(),
      });

      this.router.navigate(['/dashboard']);
    } catch {
      this.error.set('注册失败，请稍后重试');
    } finally {
      this.loading.set(false);
    }
  }
}
