import React from "react";

const SkeletonElement: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded ${
        className || ""
      }`}
    />
  );
};

const ChatMessagesSkeleton: React.FC = () => {
  return (
    <div className="flex-grow space-y-6 p-4 overflow-y-auto max-w-3xl">
      <div className="flex items-start space-x-3">
        <SkeletonElement className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonElement className="h-4 w-1/4" />
          <SkeletonElement className="h-16 w-3/4" />
        </div>
      </div>
      <div className="flex flex-row-reverse items-start space-x-3 space-x-reverse">
        <SkeletonElement className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2 items-end flex flex-col">
          <SkeletonElement className="h-4 w-1/4" />
          <SkeletonElement className="h-12 w-1/2" />
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <SkeletonElement className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonElement className="h-4 w-1/4" />
          <SkeletonElement className="h-20 w-4/5" />
        </div>
      </div>
      <div className="flex flex-row-reverse items-start space-x-3 space-x-reverse">
        <SkeletonElement className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2 items-end flex flex-col">
          <SkeletonElement className="h-4 w-1/4" />
          <SkeletonElement className="h-10 w-2/3" />
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <SkeletonElement className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonElement className="h-4 w-1/4" />
          <SkeletonElement className="h-20 w-4/5" />
        </div>
      </div>
      <div className="flex flex-row-reverse items-start space-x-3 space-x-reverse">
        <SkeletonElement className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2 items-end flex flex-col">
          <SkeletonElement className="h-4 w-1/4" />
          <SkeletonElement className="h-10 w-2/3" />
        </div>
      </div>
    </div>
  );
};

export default ChatMessagesSkeleton;
