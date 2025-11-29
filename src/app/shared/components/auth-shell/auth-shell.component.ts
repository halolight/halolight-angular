import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [NgClass],
  template: `
    <!-- 背景装饰 -->
    <div class="relative min-h-screen lg:h-dvh overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <!-- 网格背景 -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <!-- 光晕装饰 -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/30 to-cyan-400/30 blur-3xl animate-pulse-slow"></div>
        <div class="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-400/30 to-purple-400/30 blur-3xl animate-pulse-slower"></div>
        <div class="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-violet-400/20 to-pink-400/20 blur-3xl animate-pulse-slow"></div>
      </div>

      <!-- 主内容区 -->
      <div class="relative flex min-h-screen lg:h-full flex-col lg:flex-row">
        <!-- 左侧装饰区 (仅桌面端显示) -->
        @if (showLeft()) {
          <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden animate-slide-in-left">
            <!-- 渐变背景 -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700"></div>
            <!-- 网格叠加 -->
            <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            <!-- 鼠标跟随光效 (静态版) -->
            <div class="absolute inset-0 bg-[radial-gradient(600px_circle_at_50%_50%,rgba(255,255,255,0.1),transparent_40%)]"></div>

            <!-- 左侧内容 -->
            <div class="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
              <ng-content select="[leftContent]"></ng-content>
            </div>

            <!-- 浮动圆点装饰 -->
            <div class="absolute w-2 h-2 rounded-full bg-white/20 animate-float-1" style="left: 20%; top: 30%"></div>
            <div class="absolute w-2 h-2 rounded-full bg-white/20 animate-float-2" style="left: 35%; top: 50%"></div>
            <div class="absolute w-2 h-2 rounded-full bg-white/20 animate-float-3" style="left: 50%; top: 40%"></div>
            <div class="absolute w-2 h-2 rounded-full bg-white/20 animate-float-1" style="left: 65%; top: 60%"></div>
            <div class="absolute w-2 h-2 rounded-full bg-white/20 animate-float-2" style="left: 80%; top: 35%"></div>
          </div>
        }

        <!-- 右侧表单区 -->
        <div [ngClass]="[
          'flex-1 flex items-center justify-center',
          rightPadding()
        ]">
          <ng-content select="[rightContent]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes pulse-slow {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.2); opacity: 0.5; }
    }
    @keyframes pulse-slower {
      0%, 100% { transform: scale(1.2); opacity: 0.4; }
      50% { transform: scale(1); opacity: 0.6; }
    }
    @keyframes slide-in-left {
      from { transform: translateX(-100px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes float-1 {
      0%, 100% { transform: translateY(0); opacity: 0.2; }
      50% { transform: translateY(-20px); opacity: 0.5; }
    }
    @keyframes float-2 {
      0%, 100% { transform: translateY(0); opacity: 0.3; }
      50% { transform: translateY(-15px); opacity: 0.6; }
    }
    @keyframes float-3 {
      0%, 100% { transform: translateY(0); opacity: 0.25; }
      50% { transform: translateY(-25px); opacity: 0.55; }
    }
    :host ::ng-deep .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
    :host ::ng-deep .animate-pulse-slower { animation: pulse-slower 10s ease-in-out infinite; }
    :host ::ng-deep .animate-slide-in-left { animation: slide-in-left 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
    :host ::ng-deep .animate-float-1 { animation: float-1 3s ease-in-out infinite; }
    :host ::ng-deep .animate-float-2 { animation: float-2 3.5s ease-in-out infinite; }
    :host ::ng-deep .animate-float-3 { animation: float-3 4s ease-in-out infinite; }
  `],
})
export class AuthShellComponent {
  readonly showLeft = input(true);
  readonly rightPadding = input('p-3 sm:p-4 lg:px-10 lg:py-6');
}
