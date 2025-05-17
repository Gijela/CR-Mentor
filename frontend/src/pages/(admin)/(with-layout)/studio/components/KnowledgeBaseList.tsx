import React, { useMemo, useState } from "react";
import KnowledgeBaseListSkeletonItems from "./KnowledgeBaseListSkeleton";

const KnowledgeBaseList: React.FC<{
  isRightSidebarOpen: boolean;
  setIsRightSidebarOpen: (value: boolean) => void;
  currentSelectedKbs: string[];
  handleKbSelection: (kbTitle: string) => void;
  knowledgeBases: string[];
  isLoading?: boolean;
}> = React.memo(
  ({
    isRightSidebarOpen,
    setIsRightSidebarOpen,
    currentSelectedKbs,
    handleKbSelection,
    knowledgeBases,
    isLoading,
  }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // 对知识库列表进行排序和过滤
    const sortedAndFilteredList = useMemo(() => {
      // 首先基于搜索词过滤
      const filtered = (knowledgeBases || []).filter((kbName) =>
        kbName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // 然后对过滤后的列表进行排序，选中的排在前面
      return filtered.sort((a, b) => {
        const aSelected = currentSelectedKbs.includes(a);
        const bSelected = currentSelectedKbs.includes(b);
        if (aSelected && !bSelected) return -1;
        if (!aSelected && bSelected) return 1;
        return 0;
      });
    }, [searchQuery, knowledgeBases, currentSelectedKbs]);

    // 处理搜索框失焦时的行为
    const handleSearchBlur = () => {
      // 只有当搜索框为空时才关闭搜索
      if (!searchQuery) {
        setIsSearching(false);
      }
    };

    return (
      <div
        className={`${
          isRightSidebarOpen ? "w-[288px] border-x" : "w-0 border-l"
        } flex-shrink-0 transition-all duration-300 relative group`}
      >
        {/* 左侧切换按钮 */}
        <button
          onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          className={`absolute -left-4 top-[40%] transform -translate-y-1/2 bg-accent 
            border h-11 w-4 hover:bg-accent/80
            z-50 flex items-center justify-center rounded-l-md
            ${
              isRightSidebarOpen
                ? "opacity-0 group-hover:opacity-100"
                : "opacity-100"
            }
            transition-opacity duration-200`}
        >
          <svg
            className={`w-8 h-8 text-gray-500 transform transition-transform duration-300 
              ${isRightSidebarOpen ? "rotate-180" : "rotate-0"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 7L8 12L14 17"
            />
          </svg>
        </button>

        <div
          className={`${
            isRightSidebarOpen ? "opacity-100" : "opacity-0"
          } bg-background flex flex-col h-full relative`}
        >
          {/* 右侧头部 */}
          <div className="sticky top-0 bg-background z-10">
            <div className="h-16 px-4 flex items-center justify-between">
              <span className="text-base font-medium text-foreground">KBs</span>
              <div className="flex items-center gap-2">
                {/* 搜索按钮和输入框 */}
                {isSearching ? (
                  <div className="flex items-center gap-2 absolute inset-x-0 top-0 h-full bg-background px-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search knowledge base..."
                      className="flex-1 bg-transparent border-none outline-none text-sm"
                      autoFocus
                      onBlur={handleSearchBlur}
                    />
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setIsSearching(false);
                      }}
                      className="p-2 hover:bg-accent rounded-lg"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSearching(true)}
                    className="p-2 hover:bg-accent rounded-lg"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 知识库列表 */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="px-3 py-2">
              <div className="space-y-1">
                {isLoading ? (
                  <KnowledgeBaseListSkeletonItems />
                ) : (
                  sortedAndFilteredList.map((kbName) => (
                    <div
                      key={kbName}
                      className={`p-2 rounded-lg cursor-pointer flex items-center gap-3 ${
                        currentSelectedKbs.includes(kbName)
                          ? "bg-accent"
                          : "hover:bg-accent/50"
                      }`}
                      onClick={() => handleKbSelection(kbName)}
                    >
                      {/* 头像 */}
                      <div
                        className={`flex-shrink-0 rounded-full ${
                          currentSelectedKbs.includes(kbName)
                            ? "bg-primary/10"
                            : "bg-accent"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center">
                          <div className="flex items-center justify-center">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3 5C3 3.89543 3.89543 3 5 3H9.58579C9.851 3 10.1054 3.10536 10.2929 3.29289L12 5H19C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z"
                                stroke={
                                  currentSelectedKbs.includes(kbName)
                                    ? "rgba(99, 0, 255, 0.87)"
                                    : "currentColor"
                                }
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* 文本内容 */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {kbName}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {kbName}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default KnowledgeBaseList;
