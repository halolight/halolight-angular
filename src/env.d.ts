interface ImportMetaEnv {
  readonly NG_APP_API_URL: string;
  readonly NG_APP_USE_MOCK: string;
  readonly NG_APP_DEMO_EMAIL: string;
  readonly NG_APP_DEMO_PASSWORD: string;
  readonly NG_APP_SHOW_DEMO_HINT: string;
  readonly NG_APP_TITLE: string;
  readonly NG_APP_BRAND_NAME: string;
  readonly NG_APP_ENABLE_REGISTRATION: string;
  readonly NODE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
