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

const SessionListSkeletonItems: React.FC<{ itemCount?: number }> = ({
  itemCount = 5,
}) => {
  return (
    <>
      {[...Array(itemCount)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 py-2 px-2">
          <SkeletonElement className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <SkeletonElement className="h-4 w-3/4" />
            <SkeletonElement className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </>
  );
};

export default SessionListSkeletonItems;
