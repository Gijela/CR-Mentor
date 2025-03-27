import { useAtom } from "jotai";
import { useCallback } from "react";

import { platformAtom, type PlatformType } from "@/atoms/platform";

export function usePlatform() {
  const [platform, setPlatform] = useAtom(platformAtom);

  const isGithub = platform === "github";
  const isGitlab = platform === "gitlab";

  const togglePlatform = useCallback(() => {
    setPlatform((current) => (current === "github" ? "gitlab" : "github"));
  }, [setPlatform]);

  return {
    platform,
    setPlatform,
    isGithub,
    isGitlab,
    togglePlatform,
  };
} 