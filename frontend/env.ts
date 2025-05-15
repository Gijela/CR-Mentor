import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

const isDev = import.meta.env.DEV

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {},
  emptyStringAsUndefined: true,
  runtimeEnv: import.meta.env,
  skipValidation: !isDev,
})
