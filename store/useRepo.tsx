import { useState } from "react";
import { createStore } from "hox";
import { Repository } from "@/components/Repo/interface";

// 仓库列表信息
export const [useRepoStore, RepoStoreProvider] = createStore(() => {
  const [repositories, setRepositories] = useState<Repository[]>([]); // all repositories
  const [filteredRepositories, setFilteredRepositories] = useState<
    Repository[]
  >([]); // filtered repositories

  function addRepository(repository: Repository[]) {
    setRepositories(repository);
  }

  function addFilteredRepository(repository: Repository[]) {
    setFilteredRepositories(repository);
  }

  return {
    repositories,
    filteredRepositories,
    addRepository,
    addFilteredRepository,
  };
});
