import { useState } from "react";
import { createStore } from "hox";
import { Repository } from "@/components/Repo/interface";

// 仓库列表信息
export const [useRepoStore, RepoStoreProvider] = createStore(() => {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  function addRepository(repository: Repository[]) {
    setRepositories(repository);
  }

  return {
    repositories,
    addRepository,
  };
});
