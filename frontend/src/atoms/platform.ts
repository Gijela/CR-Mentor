import { atomWithStorage } from "jotai/utils"

export type PlatformType = "github" | "gitlab"

export const platformAtom = atomWithStorage<PlatformType>("platform", "github") 