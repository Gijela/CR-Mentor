import { useEffect, useRef, useState } from "react";

const SearchRepoControl: React.FC<{
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filteredRepositories: any[];
  setShowPRModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ searchTerm, setSearchTerm, filteredRepositories, setShowPRModal }) => {
  const searchInputRef = useRef(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // 添加点击外部关闭下拉框的处理
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-4 pb-3 border-b mb-4">
      <div className="relative w-[480px]" ref={searchInputRef}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowSearchDropdown(true)}
          placeholder="select a repository..."
          className="w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
        {/* 添加搜索下拉框 */}
        {showSearchDropdown && filteredRepositories.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredRepositories.map((repo) => (
              <div
                key={repo.name}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSearchTerm(repo.name);
                  setShowSearchDropdown(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{repo.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      repo.isPublic
                        ? "bg-gray-100 text-gray-600"
                        : "bg-yellow-50 text-yellow-800"
                    }`}
                  >
                    {repo.isPublic ? "Public" : "Private"}
                  </span>
                </div>
                {repo.description && (
                  <p className="text-sm text-gray-500 truncate">
                    {repo.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => setShowPRModal(true)}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[rgba(99,0,255,0.87)] hover:bg-[rgba(99,0,255,0.95)] rounded-lg"
        >
          <span>Create PR</span>
        </button>
      </div>
    </div>
  );
};

export default SearchRepoControl;
