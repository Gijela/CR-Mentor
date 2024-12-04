import React, { useMemo, useState, useEffect } from "react";
import { useRepoStore } from "@/store/useRepo";

const Pagination: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const { repositories, addFilteredRepository } = useRepoStore();

  // 设置分页
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // 每页显示20条数据

  // 先根据搜索词过滤仓库
  const filteredRepositories = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return repositories.filter((repo) =>
      repo.name.toLowerCase().includes(searchLower)
    );
  }, [repositories, searchTerm]);

  // 当搜索词改变时，重置页码到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 计算分页数据
  const totalPages = Math.ceil(filteredRepositories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // 获取当前页的数据
  const currentItems = filteredRepositories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // 更新过滤后的仓库列表
  useEffect(() => {
    addFilteredRepository(currentItems);
  }, [currentItems, searchTerm]);

  return (
    <div className="flex justify-center items-center space-x-2 mt-8 pb-8">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed hover:text-blue-600"
      >
        &lt; Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-2 py-1 ${
            currentPage === page
              ? "text-blue-600 font-medium"
              : "hover:text-blue-600"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed hover:text-blue-600"
      >
        Next &gt;
      </button>
    </div>
  );
};

export default Pagination;
