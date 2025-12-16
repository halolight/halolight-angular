export const environment = {
  production: false,
  apiUrl: import.meta.env.NG_APP_API_URL || '/api',
  useMock: import.meta.env.NG_APP_USE_MOCK === 'true',
  // 演示账号（仅开发/演示环境）
  demoEmail: import.meta.env.NG_APP_DEMO_EMAIL || '',
  demoPassword: import.meta.env.NG_APP_DEMO_PASSWORD || '',
  showDemoHint: import.meta.env.NG_APP_SHOW_DEMO_HINT === 'true',
  // 应用配置
  appTitle: import.meta.env.NG_APP_TITLE || 'Admin Pro',
  brandName: import.meta.env.NG_APP_BRAND_NAME || 'Halolight',
  // 注册开关（默认关闭）
  enableRegistration: import.meta.env.NG_APP_ENABLE_REGISTRATION === 'true',
};
