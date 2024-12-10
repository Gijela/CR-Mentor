import { useRepoStore } from "@/store/useRepo";
import { useEffect, useRef, useState } from "react";
import { message } from "antd";

const SearchRepoControl: React.FC<{
  setShowPRModal: React.Dispatch<React.SetStateAction<boolean>>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}> = ({ setShowPRModal, searchTerm, setSearchTerm }) => {
  const searchInputRef = useRef(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { repositories } = useRepoStore();

  const filteredRepos = repositories.filter((repo) => {
    const searchLower = searchTerm.toLowerCase();
    return repo.name.toLowerCase().includes(searchLower);
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSearchDropdown) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filteredRepos.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filteredRepos.length) {
          setSearchTerm(filteredRepos[activeIndex].name);
          setShowSearchDropdown(false);
          setActiveIndex(-1);
        }
        break;
      case "Escape":
        setShowSearchDropdown(false);
        setActiveIndex(-1);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSearchDropdown(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [searchTerm]);

  useEffect(() => {
    if (activeIndex >= 0 && dropdownRef.current) {
      const dropdown = dropdownRef.current;
      const activeItem = dropdown.children[activeIndex] as HTMLElement;

      if (activeItem) {
        const dropdownRect = dropdown.getBoundingClientRect();
        const activeItemRect = activeItem.getBoundingClientRect();

        if (activeItemRect.bottom > dropdownRect.bottom) {
          dropdown.scrollTop += activeItemRect.bottom - dropdownRect.bottom;
        } else if (activeItemRect.top < dropdownRect.top) {
          dropdown.scrollTop -= dropdownRect.top - activeItemRect.top;
        }
      }
    }
  }, [activeIndex]);

  const handleCreatePR = () => {
    if (!searchTerm) {
      message.warning("Please select a repository");
      return;
    }
    setShowPRModal(true);
  };

  return (
    <div className="flex items-center gap-4 pb-3 border-b mb-4">
      <div className="relative w-[480px]" ref={searchInputRef}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSearchDropdown(true);
          }}
          onFocus={() => setShowSearchDropdown(true)}
          onClick={() => setShowSearchDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder="select a repository..."
          className="w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
        {showSearchDropdown && repositories.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {filteredRepos.map((repo, index) => (
              <div
                key={repo.name}
                className={`px-4 py-2 cursor-pointer ${
                  index === activeIndex ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  setSearchTerm(repo.name);
                  setShowSearchDropdown(false);
                  setActiveIndex(-1);
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{repo.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      repo.private
                        ? "bg-yellow-50 text-yellow-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {repo.private ? "Private" : "Public"}
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
          onClick={handleCreatePR}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[rgba(99,0,255,0.87)] hover:bg-[rgba(99,0,255,0.95)] rounded-lg"
        >
          <span>Create PR</span>
        </button>
      </div>
    </div>
  );
};

export default SearchRepoControl;
