import React from "react";
import { mockRepositories } from "./config";

// 添加选项数据
const branchOptions = [
  { value: "feature/new-feature", label: "feature/new-feature" },
  { value: "develop", label: "develop" },
  { value: "main", label: "main" },
  // ... 更多分支选项
];

const guidelineOptions = [
  { value: "angular", label: "Angular提交规范" },
  { value: "conventional", label: "约定式提交规范" },
  // ... 更多规范选项
];

// 添加可搜索的Select组件
const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  onFocus,
  isActive,
  onClickOutside,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const selectRef = React.useRef(null);

  // 初始化和value更新时同步显示值
  React.useEffect(() => {
    if (value && value.label) {
      setSearchTerm(value.label);
    }
  }, [value]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionClick = (option) => {
    setSearchTerm(option.label);
    onChange(option);
    setIsOpen(false);
    onClickOutside && onClickOutside();
  };

  return (
    <div className="relative" ref={selectRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => {
          onFocus && onFocus();
          setIsOpen(true);
        }}
        placeholder={placeholder}
        className="w-full border rounded-lg p-2"
      />
      {isOpen && isActive && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Repositories = () => {
  // 设置分页
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5; // 每页显示5条数据

  // 计算分页数据
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // 添加搜索状态
  const [searchTerm, setSearchTerm] = React.useState("");

  // 根据搜索词过滤仓库
  const filteredRepositories = React.useMemo(() => {
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
  const [showPRModal, setShowPRModal] = React.useState(false);

  // 添加新的状态
  const [sourceBranch, setSourceBranch] = React.useState(null);
  const [targetBranch, setTargetBranch] = React.useState(null);
  const [guideline, setGuideline] = React.useState(null);

  // 添加新的状态来跟踪当前打开的搜索框
  const [currentOpenSelect, setCurrentOpenSelect] = React.useState(null);

  // 添加搜索下拉框显示状态
  const [showSearchDropdown, setShowSearchDropdown] = React.useState(false);
  const searchInputRef = React.useRef(null);

  // 添加点击外部关闭下拉框的处理
  React.useEffect(() => {
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
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* 标题 & 按钮 */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              Repositories
            </h1>
            <p className="mt-2 text-gray-600 text-sm">
              Create your Pull Requests
            </p>
          </div>

          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            <button className="btn bg-gray-900 text-white hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span>Install CR-Mentor</span>
            </button>
          </div>
        </div>

        {/* 修改后的搜索控件 */}
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

        {/* 列表 */}
        <div className="space-y-6">
          {currentItems.map((repo) => (
            <div key={repo.name} className="border-b pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold">
                      <a href="#" className="text-blue-600">
                        {repo.name}
                      </a>
                    </h3>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border ${
                        repo.isPublic
                          ? "border-gray-200 text-gray-600"
                          : "border-yellow-200 text-yellow-800 bg-yellow-50"
                      }`}
                    >
                      {repo.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                    {repo.description}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="border rounded-lg px-4 py-1.5 flex items-center gap-2 text-sm bg-white hover:bg-[rgba(99,0,255,0.87)] hover:text-white hover:border-[rgba(99,0,255,0.87)]">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Setting</span>
                  </button>
                  <a
                    href={`/${repo.name}/pulls`}
                    className="border rounded-lg px-4 py-1.5 flex items-center gap-2 text-sm bg-white hover:bg-[rgba(99,0,255,0.87)] hover:text-white hover:border-[rgba(99,0,255,0.87)]"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354Z" />
                    </svg>
                    <span>PRs</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                {repo.language && (
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        repo.language === "TypeScript"
                          ? "bg-blue-400"
                          : repo.language === "JavaScript"
                          ? "bg-yellow-400"
                          : repo.language === "Vue"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    ></span>
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 relative top-[0.5px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                  <span className="leading-none relative top-[0.5px]">
                    {repo.stars}
                  </span>
                </span>
                {repo.license && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"
                      />
                    </svg>
                    {repo.license}
                  </span>
                )}
                {repo.forks && (
                  <a
                    href={`/${repo.name}/pulls`}
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z" />
                    </svg>
                    <span>{repo.forks}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 添加分页控件 */}
        <div className="flex justify-center items-center space-x-2 mt-8 pb-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed hover:text-blue-500"
          >
            上一页
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-2 py-1 ${
                currentPage === page
                  ? "text-blue-500 font-medium"
                  : "hover:text-blue-500"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed hover:text-blue-500"
          >
            下一页
          </button>
        </div>

        {/* PR创建弹窗 */}
        {showPRModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[600px] p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">创建Pull Request</h2>
                <button
                  onClick={() => setShowPRModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    源分支
                  </label>
                  <SearchableSelect
                    options={branchOptions}
                    value={sourceBranch}
                    onChange={setSourceBranch}
                    placeholder="搜索源分支..."
                    onFocus={() => setCurrentOpenSelect("source")}
                    isActive={currentOpenSelect === "source"}
                    onClickOutside={() => setCurrentOpenSelect(null)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    目标分支
                  </label>
                  <SearchableSelect
                    options={branchOptions}
                    value={targetBranch}
                    onChange={setTargetBranch}
                    placeholder="搜索目标分支..."
                    onFocus={() => setCurrentOpenSelect("target")}
                    isActive={currentOpenSelect === "target"}
                    onClickOutside={() => setCurrentOpenSelect(null)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    规范知识库
                  </label>
                  <SearchableSelect
                    options={guidelineOptions}
                    value={guideline}
                    onChange={setGuideline}
                    placeholder="搜索规范..."
                    onFocus={() => setCurrentOpenSelect("guideline")}
                    isActive={currentOpenSelect === "guideline"}
                    onClickOutside={() => setCurrentOpenSelect(null)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PR标题
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2"
                    placeholder="输入PR标题"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PR描述
                  </label>
                  <textarea
                    className="w-full border rounded-lg p-2 h-24"
                    placeholder="输入PR描述"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowPRModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[rgba(99,0,255,0.87)] text-white rounded-lg hover:bg-[rgba(99,0,255,0.95)]"
                  >
                    创建
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Repositories;
