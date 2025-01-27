/// <reference types="vite/client" />

declare const APP_VERSION: string
declare const APP_NAME: string

interface ImportMetaEnv {
  VITE_APP_NAME: string
  VITE_WEB_URL: string
  VITE_API_URL: string
  VITE_ENABLE_DEVTOOLS: string
  VITE_EDITOR: string
  VITE_ENABLE_MOCK: string
  VITE_GITHUB_SERVER_API: string
  VITE_GITHUB_NAME: string
  VITE_GITHUB_USER_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
