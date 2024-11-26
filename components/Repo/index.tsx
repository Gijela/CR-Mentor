import React, { useState } from "react";
import Header from "./Header";
import RepositoryList from "./RepositoryList";
import CreatePRModal from "./CreatePRModal";
import Pagination from "./Pagination";
import SearchRepoControl from "./SearchRepoControl";
import { RepoStoreProvider } from "@/store/useRepo";

const Repositories = () => {
  const [searchTerm, setSearchTerm] = useState(""); // 搜索词
  const [showPRModal, setShowPRModal] = useState(false); // PR创建弹窗

  return (
    <div className="bg-white">
      <RepoStoreProvider>
        <div className="max-w-7xl mx-auto px-4">
          {/* 标题 & 按钮 */}
          <Header />

          {/* 搜索框控件 */}
          <SearchRepoControl
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setShowPRModal={setShowPRModal}
          />

          {/* 仓库列表 */}
          <RepositoryList />

          {/* 分页器控件 */}
          <Pagination searchTerm={searchTerm} />

          {/* PR创建弹窗 */}
          {showPRModal && (
            <CreatePRModal closeModal={() => setShowPRModal(false)} />
          )}
        </div>
      </RepoStoreProvider>
    </div>
  );
};

export default Repositories;
