/// <reference types="vite/client" />

declare const APP_VERSION: string
declare const APP_NAME: string

interface ImportMetaEnv {
  VITE_WEB_URL: string
  VITE_ENABLE_MOCK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
