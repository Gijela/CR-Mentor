import { PlusOutlined } from "@ant-design/icons";
import { FC } from "react";

const EmptyKb: FC<{ setIsModalOpen: (open: boolean) => void }> = ({
  setIsModalOpen,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-[120px] h-[120px] bg-[rgb(245,248,255)] rounded-full flex items-center justify-center mb-6">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 5C3 3.89543 3.89543 3 5 3H9.58579C9.851 3 10.1054 3.10536 10.2929 3.29289L12 5H19C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z"
            stroke="rgba(99, 0, 255, 0.87)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 12H16M8 16H13"
            stroke="rgba(99, 0, 255, 0.87)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="text-xl font-medium text-gray-900 mb-2">还没有知识库</h2>
      <p className="text-gray-500 mb-6">创建一个新的知识库开始使用吧</p>
      <button
        onClick={() => setIsModalOpen(true)}
        className="h-10 px-6 flex items-center gap-2 bg-[rgba(99,0,255,0.87)] hover:bg-[rgba(99,0,255,1)] text-white rounded-lg transition-colors duration-200"
      >
        <PlusOutlined />
        <span>新建知识库</span>
      </button>
    </div>
  );
};

export default EmptyKb;
