import React, { useState, useEffect } from "react";
import Header from "./Header";
import RepositoryList from "./RepositoryList";
import CreatePRModal from "./CreatePRModal";
import SearchRepoControl from "./SearchRepoControl";
import { RepoStoreProvider } from "@/store/useRepo";

const githubName = "Gijela";

const Repositories = () => {
  const [showPRModal, setShowPRModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const repoParam = urlParams.get("repository");
    if (repoParam) {
      setSearchTerm(repoParam);
    }
  }, []);

  return (
    <RepoStoreProvider>
      <div className="bg-white max-w-7xl mx-auto px-4 flex flex-col h-full">
        <Header />

        <SearchRepoControl
          setShowPRModal={setShowPRModal}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <RepositoryList searchTerm={searchTerm} githubName={githubName} />

        {showPRModal && (
          <CreatePRModal
            closeModal={() => setShowPRModal(false)}
            githubName={githubName}
            repoName={searchTerm}
          />
        )}
      </div>
    </RepoStoreProvider>
  );
};

export default Repositories;
