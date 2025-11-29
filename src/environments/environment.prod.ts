export const environment = {
  production: true,
  apiUrl: import.meta.env.NG_APP_API_URL || 'https://api.halolight.h7ml.cn',
  useMock: import.meta.env.NG_APP_USE_MOCK === 'true',
  // 演示账号
  demoEmail: import.meta.env.NG_APP_DEMO_EMAIL || '',
  demoPassword: import.meta.env.NG_APP_DEMO_PASSWORD || '',
  showDemoHint: import.meta.env.NG_APP_SHOW_DEMO_HINT === 'true',
  // 应用配置
  appTitle: import.meta.env.NG_APP_TITLE || 'Admin Pro',
  brandName: import.meta.env.NG_APP_BRAND_NAME || 'Halolight',
};
