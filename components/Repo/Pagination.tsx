import React, { useState } from "react";

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}> = ({ currentPage, totalPages, setCurrentPage }) => {
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
