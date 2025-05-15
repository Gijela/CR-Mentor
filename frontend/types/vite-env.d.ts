/// <reference types="vite/client" />

declare const APP_VERSION: string
declare const APP_NAME: string

interface ImportMetaEnv {
  VITE_ENABLE_MOCK: string
  VITE_SERVER_HOST: string
  VITE_AGENT_HOST: string
  VITE_CLERK_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
