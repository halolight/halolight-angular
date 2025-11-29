import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { projectInfo } from '../../../core/constants/project-info';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div class="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center justify-between gap-2 py-4 text-sm text-muted-foreground sm:flex-row">
          <!-- 版权信息 -->
          <div class="flex items-center gap-1">
            <span>© {{ currentYear }} {{ projectInfo.name }}</span>
            <span class="hidden sm:inline">·</span>
            <span class="hidden sm:inline">All rights reserved</span>
          </div>

          <!-- 作者信息 -->
          <div class="flex items-center gap-1">
            <span class="hidden sm:inline">Made with</span>
            <svg class="h-3.5 w-3.5 text-red-500 fill-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span class="hidden sm:inline">by</span>
            <a
              [href]="'https://github.com/' + projectInfo.author"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {{ projectInfo.author }}
            </a>
          </div>

          <!-- 链接 -->
          <div class="flex items-center gap-3 text-xs">
            <a
              href="https://halolight.docs.h7ml.cn"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-primary transition-colors"
            >
              在线文档
            </a>
            <a
              routerLink="/privacy"
              class="hover:text-primary transition-colors"
            >
              隐私政策
            </a>
            <a
              routerLink="/terms"
              class="hover:text-primary transition-colors"
            >
              服务条款
            </a>
            <a
              [href]="projectInfo.repo"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
  readonly projectInfo = projectInfo;
}
