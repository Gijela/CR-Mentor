import React, { useState } from "react";
import Header from "./Header";
import RepositoryList from "./RepositoryList";
import CreatePRModal from "./CreatePRModal";
import SearchRepoControl from "./SearchRepoControl";
import { RepoStoreProvider } from "@/store/useRepo";

const Repositories = () => {
  const [showPRModal, setShowPRModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <RepoStoreProvider>
      <div className="bg-white max-w-7xl mx-auto px-4 flex flex-col h-full">
        <Header />

        <SearchRepoControl
          setShowPRModal={setShowPRModal}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <RepositoryList searchTerm={searchTerm} />

        {showPRModal && (
          <CreatePRModal
            closeModal={() => setShowPRModal(false)}
            repoName={searchTerm}
          />
        )}
      </div>
    </RepoStoreProvider>
  );
};

export default Repositories;
