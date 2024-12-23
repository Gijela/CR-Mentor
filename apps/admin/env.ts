import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

const isDev = import.meta.env.DEV

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_ENABLE_MOCK: z.string().default(isDev.toString()).transform((s) => s !== "false" && s !== "0"),
    VITE_GITHUB_SERVER_API: z.string().url(),
  },
  emptyStringAsUndefined: true,
  runtimeEnv: import.meta.env,
  skipValidation: !isDev,
})
