# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Halolight Angular 是一个基于 Angular 21 + Tailwind CSS 4 的现代化中文后台管理系统，使用 TypeScript、Standalone Components 和 Signals 构建。这是 Halolight 系列的 Angular 版本实现。

- **在线预览**: https://halolight-angular.h7ml.cn
- **GitHub**: https://github.com/halolight/halolight-angular

## 技术栈速览

- **核心框架**: Angular 21 (Standalone Components + Signals) + TypeScript 5.9
- **路由**: @angular/router (with View Transitions)
- **状态管理**: Angular Signals + RxJS 7.8
- **数据请求**: HttpClient + TanStack Angular Query
- **样式**: Tailwind CSS 4、自定义 UI 组件 (shadcn 风格)、class-variance-authority
- **图表**: ECharts + ngx-echarts
- **拖拽布局**: angular-gridster2
- **Mock**: Mock.js
- **图标**: lucide-angular
- **构建/规范**: npm 11、Prettier
- **测试**: Vitest + jsdom

## 常用命令

```bash
npm start         # 启动开发服务器 (http://localhost:4200)
npm run build     # 生产构建
npm run watch     # 开发模式监听构建
npm test          # 运行单元测试 (Vitest)
ng generate       # Angular CLI 代码生成器
```

**注意**: Angular 21 需要 Node.js 20.19+ 或 22.12+

## 架构

### 应用入口 (src/main.ts)

Angular 应用通过 `bootstrapApplication` 使用 Standalone API 初始化：

```ts
bootstrapApplication(App, appConfig)
```

### 应用配置 (src/app/app.config.ts)

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    provideAngularQuery(queryClient),
  ],
};
```

### 核心目录结构

```
src/
├── app/
│   ├── app.ts                 # 根组件 (Standalone)
│   ├── app.config.ts          # 应用配置 (Providers)
│   ├── app.routes.ts          # 路由配置
│   ├── core/                  # 核心模块
│   │   ├── guards/            # 路由守卫
│   │   │   └── auth.guard.ts  # authGuard, guestGuard
│   │   ├── interceptors/      # HTTP 拦截器
│   │   │   └── auth.interceptor.ts
│   │   └── services/          # 单例服务
│   │       ├── auth.service.ts  # 认证服务 (Signals + localStorage)
│   │       └── http.service.ts  # HTTP 封装
│   ├── shared/                # 共享模块
│   │   ├── components/ui/     # UI 组件 (shadcn 风格)
│   │   │   ├── button/        # ButtonComponent
│   │   │   ├── input/         # InputComponent (ControlValueAccessor)
│   │   │   └── card/          # Card 系列组件
│   │   └── lib/
│   │       └── utils.ts       # cn() 工具函数
│   ├── features/              # 功能模块
│   │   ├── auth/              # 认证模块
│   │   │   ├── login/         # LoginPage
│   │   │   └── register/      # RegisterPage
│   │   └── dashboard/         # 仪表盘模块
│   │       └── dashboard.page.ts
│   ├── layouts/               # 布局组件
│   │   ├── admin-layout/      # AdminLayout (Sidebar + Header)
│   │   └── auth-layout/       # AuthLayout
│   ├── config/                # 配置
│   ├── store/                 # 状态管理
│   └── environments/          # 环境配置
├── styles.css                 # 全局样式 (Tailwind + CSS 变量主题)
├── index.html                 # HTML 入口
└── main.ts                    # 应用启动入口
```

### 数据流模式

1. **API 请求**: `core/services/http.service.ts` 封装 HttpClient → TanStack Query 或直接在组件中使用
2. **状态管理**:
   - **响应式状态**: 使用 Angular **Signals** (`signal`, `computed`, `effect`)
   - **认证状态**: `AuthService` 使用 Signals + localStorage 持久化
   - **异步流**: 复杂场景使用 **RxJS** Observables
3. **Mock 数据**: 开发环境下可通过 Mock.js 拦截

### TanStack Query 配置

在 `src/app/app.config.ts` 中配置：

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 分钟
      gcTime: 1000 * 60 * 30,   // 30 分钟
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### 主题系统

使用 CSS 变量实现暗色/亮色主题切换：

- 暗色主题 (默认): `:root` 中定义
- 亮色主题: `.light` 类中覆盖
- 变量包括: `--background`, `--foreground`, `--primary`, `--card`, `--border` 等
- 图表颜色: `--chart-1` 到 `--chart-5`

### 代码规范

- **组件风格**: 严格使用 Angular 21 **Standalone Components**
- **响应式**: 优先使用 **Signals** (`signal`, `computed`, `model`, `input`, `output`)
- **模板**: 使用新的控制流语法 (`@if`, `@for`, `@switch`)
- **样式**: 使用 Tailwind Utility Classes + `cn()` 合并类名
- **类型安全**: 严格模式 (`strict: true`)，避免使用 `any`
- **组件前缀**: UI 组件使用 `ui-` 前缀，页面使用 `app-` 前缀

### UI 组件

自定义组件库 (shadcn/ui 风格):

- **ButtonComponent**: 支持 variant、size、disabled、type
- **InputComponent**: 实现 ControlValueAccessor，支持 Reactive Forms
- **CardComponent**: Card、CardHeader、CardTitle、CardDescription、CardContent、CardFooter

使用 `class-variance-authority` 管理变体样式。

## 安全特性

- **Token 存储**: localStorage (通过 AuthService 管理)
- **路由守卫**: `authGuard` (需认证) 和 `guestGuard` (仅游客)
- **HTTP 拦截器**: 自动附加 Authorization header，处理 401 错误

## 新增功能开发指南

### 添加新页面

1. 在 `src/app/features/` 下创建功能模块目录
2. 创建页面组件 (Standalone):
   ```ts
   @Component({
     selector: 'app-xxx-page',
     standalone: true,
     imports: [...],
     template: `...`,
   })
   export class XxxPage {}
   ```
3. 在 `src/app/app.routes.ts` 中注册路由 (支持懒加载):
   ```ts
   {
     path: 'xxx',
     loadComponent: () => import('./features/xxx/xxx.page').then(m => m.XxxPage),
   }
   ```
4. 在 `AdminLayout` 的 `menuItems` 中添加导航项

### 添加新的 API 服务

1. 在 `src/app/core/services/` 创建服务文件
2. 使用 `@Injectable({ providedIn: 'root' })` 声明单例服务
3. 注入 `HttpService` 或直接使用 `HttpClient`
4. 可选: 使用 TanStack Query 封装

### 添加 UI 组件

1. 在 `src/app/shared/components/ui/` 下创建组件目录
2. 使用 `class-variance-authority` 定义变体
3. 使用 `cn()` 合并类名
4. 在 `index.ts` 中导出

### 添加仪表盘部件

1. 在 `src/app/features/dashboard/widgets/` 创建部件组件
2. 使用 Signal-based 数据绑定
3. 集成 ngx-echarts 图表
4. 在 Dashboard 页面中组合部件

## Angular 21 特性

本项目使用 Angular 21 最新特性：

- **Standalone Components**: 无需 NgModule，组件直接声明依赖
- **Signals**: `signal()`, `computed()`, `effect()`, `model()`, `input()`, `output()`
- **新控制流语法**: `@if`, `@for`, `@switch`, `@defer`
- **View Transitions**: 页面切换动画
- **Function-based Guards**: `CanActivateFn`
- **Function-based Interceptors**: `HttpInterceptorFn`

## 注意事项

- **Node.js 版本**: 需要 20.19+ 或 22.12+
- **Standalone 组件**: 所有组件必须在 `imports` 数组中声明依赖
- **Signal 绑定**: 模板中调用 signal 需要使用 `()` (e.g., `{{ title() }}`)
- **model()**: 用于双向绑定，替代 `@Input()` + `@Output()`
- **Tailwind CSS 4**: 使用 `@import "tailwindcss"` 和 `@theme` 扩展

## 与其他 Halolight 项目的对照

| 功能 | Angular 版本 | Vue 版本 | Next.js 版本 |
|------|-------------|----------|--------------|
| 状态管理 | Signals + RxJS | Pinia | Zustand |
| 数据请求 | TanStack Angular Query | TanStack Vue Query | React Query |
| UI 组件 | 自定义 (shadcn 风格) | shadcn-vue | shadcn/ui |
| 路由 | @angular/router | Vue Router | Next.js App Router |
| 表单 | Reactive Forms + Zod | Vue + Zod | React Hook Form + Zod |
| 构建工具 | Angular CLI / esbuild | Vite (Rolldown) | Next.js |
