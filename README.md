# Halolight Angular | Admin Pro

[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/halolight/halolight-angular/blob/main/LICENSE)
[![Angular](https://img.shields.io/badge/Angular-21-%23DD0031.svg)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-%233178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-%2306B6D4.svg)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-%23FF4154.svg)](https://tanstack.com/query)

基于 Angular 21 + Tailwind CSS 4 的现代化中文后台管理系统，使用 Standalone Components、Signals 和 TanStack Query 构建。

- 在线预览：<https://halolight-angular.h7ml.cn>
- GitHub：<https://github.com/halolight/halolight-angular>

## 功能亮点

- **Angular 21 + TypeScript**：使用最新 Standalone Components 和 Signals API
- **响应式状态**：Angular Signals (`signal`, `computed`, `effect`) + RxJS
- **新控制流语法**：`@if`、`@for`、`@switch`、`@defer`
- **Tailwind CSS 4**：原子化样式、CSS 变量主题系统
- **自定义 UI 组件**：shadcn 风格组件库
- **可拖拽仪表盘**：angular-gridster2 支持布局持久化
- **ECharts 图表**：主题自适应配色
- **TanStack Angular Query**：强大的数据获取和缓存
- **Mock.js 集成**：环境变量一键启用

## 目录结构

```
src/app/
├── app.ts                 # 根组件 (Standalone)
├── app.config.ts          # 应用配置 (Providers)
├── app.routes.ts          # 路由配置
├── core/                  # 核心模块
│   ├── guards/            # 路由守卫
│   ├── interceptors/      # HTTP 拦截器
│   └── services/          # 单例服务
├── shared/components/ui/  # UI 组件
├── features/              # 功能模块
├── layouts/               # 布局组件
└── environments/          # 环境配置
```

## 快速开始

环境要求：Node.js 20.19+ 或 22.12+

```bash
npm install
npm start        # 开发模式 http://localhost:4200
npm run build    # 生产构建
npm test         # 运行测试
```

## 技术栈

| 类别 | 技术 |
|------|------|
| 核心框架 | Angular 21 (Standalone + Signals) |
| 类型系统 | TypeScript 5.9 |
| 路由 | @angular/router + View Transitions |
| 状态管理 | Signals + RxJS |
| 数据请求 | HttpClient + TanStack Angular Query |
| 样式 | Tailwind CSS 4 + class-variance-authority |
| 图表 | ECharts + ngx-echarts |
| 测试 | Vitest + jsdom |

## Angular 21 特性

- **Standalone Components**：无需 NgModule
- **Signals**：`signal()`, `computed()`, `effect()`, `model()`, `input()`, `output()`
- **新控制流**：`@if`, `@for`, `@switch`, `@defer`
- **View Transitions**：页面切换动画
- **Function-based Guards/Interceptors**

## 许可证

[MIT](LICENSE)
