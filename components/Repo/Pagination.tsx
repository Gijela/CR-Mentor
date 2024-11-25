import React, { useMemo, useState, useEffect } from "react";
import { useRepoStore } from "@/store/useRepo";

const Pagination: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const { repositories, addFilteredRepository } = useRepoStore();

  // 设置分页
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // 每页显示20条数据

  // 计算分页数据
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // 根据搜索词过滤仓库
  const filteredRepositories = useMemo(() => {
    return repositories.filter((repo) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [repositories, searchTerm]);

  // 更新分页计算，使用过滤后的数据
  const totalPages = Math.ceil(filteredRepositories.length / itemsPerPage);
  const currentItems = filteredRepositories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    addFilteredRepository(currentItems);
  }, [currentItems]);

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
