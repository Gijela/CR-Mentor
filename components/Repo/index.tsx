import React, { useEffect, useMemo, useState } from "react";
import { mockRepositories, Repository } from "./interface";
import Header from "./Header";
import RepositoryList from "./RepositoryList";
import CreatePRModal from "./CreatePRModal";
import Pagination from "./Pagination";
import SearchRepoControl from "./SearchRepoControl";
import { message } from "antd";
import { useRepoStore, RepoStoreProvider } from "@/store/useRepo";

const Repositories = () => {
  // 设置分页
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 每页显示5条数据

  // 计算分页数据
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // 添加搜索状态
  const [searchTerm, setSearchTerm] = useState("");

  // 根据搜索词过滤仓库
  const filteredRepositories = useMemo(() => {
    return mockRepositories.filter((repo) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // 更新分页计算，使用过滤后的数据
  const totalPages = Math.ceil(filteredRepositories.length / itemsPerPage);
  const currentItems = filteredRepositories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // 添加弹窗状态控制
  const [showPRModal, setShowPRModal] = useState(false);

  return (
    <RepoStoreProvider>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* 标题 & 按钮 */}
          <Header />

          {/* 搜索框控件 */}
          <SearchRepoControl
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredRepositories={filteredRepositories}
            setShowPRModal={setShowPRModal}
          />

          {/* 仓库列表 */}
          <RepositoryList />

          {/* 分页器控件 */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />

          {/* PR创建弹窗 */}
          {showPRModal && (
            <CreatePRModal closeModal={() => setShowPRModal(false)} />
          )}
        </div>
      </div>
    </RepoStoreProvider>
  );
};

export default Repositories;
