import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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
import { LucideAngularModule, ArrowLeft, Mail, CheckCircle } from 'lucide-angular';

@Component({
  selector: 'app-forgot-password-page',
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
          找回密码
          <span class="inline-block ml-2 animate-wave">🔑</span>
        </h1>
        <p class="text-lg text-white/70 max-w-md leading-relaxed mb-12">
          别担心，我们会帮您找回账户访问权限。只需输入您注册时使用的邮箱地址即可。
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
          <p class="text-sm text-muted-foreground">重置密码，恢复账户访问</p>
        </div>

        <ui-card class="border border-border/50 shadow-2xl backdrop-blur-xl bg-card/80 overflow-hidden">
          <!-- 渐变顶部条 -->
          <div class="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>

          @if (!submitted()) {
            <ui-card-header class="space-y-1 text-center pb-3 sm:pb-5 pt-4 sm:pt-7">
              <ui-card-title class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                忘记密码
              </ui-card-title>
              <ui-card-description class="text-xs sm:text-sm mt-2">
                输入您的邮箱地址，我们将发送重置链接
              </ui-card-description>
            </ui-card-header>

            <ui-card-content class="space-y-3 sm:space-y-4 px-4 sm:px-6">
              <form (ngSubmit)="onSubmit()" class="space-y-3 sm:space-y-4">
                @if (error()) {
                  <div class="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm animate-shake">
                    {{ error() }}
                  </div>
                }

                <!-- 邮箱输入 -->
                <div class="space-y-2">
                  <label class="text-xs font-medium text-muted-foreground">邮箱地址</label>
                  <div class="relative">
                    <lucide-angular [img]="MailIcon" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <ui-input
                      type="email"
                      placeholder="your@email.h7ml.cn"
                      class="pl-10 h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
                      [(value)]="email"
                    />
                  </div>
                </div>

                <!-- 发送按钮 -->
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
                    发送中...
                  } @else {
                    发送重置链接
                    <span class="ml-2">→</span>
                  }
                </ui-button>
              </form>
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
                邮件已发送
              </ui-card-title>
              <ui-card-description class="text-xs sm:text-sm mt-2">
                我们已向 {{ email() }} 发送了密码重置链接
              </ui-card-description>
            </ui-card-header>

            <ui-card-content class="space-y-3 sm:space-y-4 px-4 sm:px-6">
              <div class="p-4 rounded-xl bg-muted/50 border border-border/50">
                <p class="text-sm text-muted-foreground text-center">
                  如果几分钟内未收到邮件，请检查垃圾邮件文件夹
                </p>
              </div>

              <ui-button
                variant="outline"
                class="w-full h-12 text-sm font-medium border-border/50 hover:border-primary/50 rounded-xl transition-all"
                (click)="resend()"
                [disabled]="resendCooldown() > 0"
              >
                @if (resendCooldown() > 0) {
                  {{ resendCooldown() }}秒后可重新发送
                } @else {
                  重新发送
                }
              </ui-button>
            </ui-card-content>

            <ui-card-footer class="flex-col space-y-3 sm:space-y-4 px-4 sm:px-6 pb-5 sm:pb-8 pt-2">
              <ui-separator />
              <a routerLink="/auth/login" class="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <lucide-angular [img]="ArrowLeftIcon" class="h-4 w-4" />
                返回登录
              </a>
            </ui-card-footer>
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
export class ForgotPasswordPage {
  readonly MailIcon = Mail;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly CheckCircleIcon = CheckCircle;

  email = signal('');
  loading = signal(false);
  error = signal('');
  submitted = signal(false);
  resendCooldown = signal(0);

  private cooldownInterval: ReturnType<typeof setInterval> | null = null;

  // 特性列表
  readonly features = [
    { icon: '📧', text: '安全的邮件验证流程' },
    { icon: '⏱️', text: '重置链接有效期24小时' },
    { icon: '🔒', text: '一次性使用，确保安全' },
    { icon: '💡', text: '简单几步即可完成重置' },
  ];

  async onSubmit(): Promise<void> {
    if (!this.email()) {
      this.error.set('请输入邮箱地址');
      return;
    }

    if (!this.isValidEmail(this.email())) {
      this.error.set('请输入有效的邮箱地址');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      this.submitted.set(true);
      this.startCooldown();
    } catch {
      this.error.set('发送失败，请稍后重试');
    } finally {
      this.loading.set(false);
    }
  }

  async resend(): Promise<void> {
    if (this.resendCooldown() > 0) return;

    this.loading.set(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.startCooldown();
    } finally {
      this.loading.set(false);
    }
  }

  private startCooldown(): void {
    this.resendCooldown.set(60);
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
    this.cooldownInterval = setInterval(() => {
      const current = this.resendCooldown();
      if (current <= 1) {
        this.resendCooldown.set(0);
        if (this.cooldownInterval) {
          clearInterval(this.cooldownInterval);
          this.cooldownInterval = null;
        }
      } else {
        this.resendCooldown.set(current - 1);
      }
    }, 1000);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
