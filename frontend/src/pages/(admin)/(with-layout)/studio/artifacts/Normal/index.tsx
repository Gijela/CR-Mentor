import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface ToolInvocationDisplayProps {
  invocation: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const ToolInvocationDisplay: React.FC<ToolInvocationDisplayProps> = ({
  invocation,
  isExpanded,
  onToggleExpand,
}) => {
  return (
    <div className="text-sm">
      <button
        onClick={onToggleExpand}
        className="flex items-center space-x-1 p-0.5 rounded-md focus:outline-none w-auto text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-white"
      >
        <span className="font-medium">{invocation.toolName || "未知工具"}</span>
        {isExpanded ? (
          <ChevronDownIcon className="h-4 w-4 text-currentColor" />
        ) : (
          <ChevronRightIcon className="h-4 w-4 text-currentColor" />
        )}
      </button>
      {isExpanded && (
        <div
          className="p-3 border rounded-md bg-gray-50 dark:bg-gray-750 dark:border-gray-600"
          style={{ height: "360px", overflowY: "auto" }}
        >
          <div className="mb-2">
            <p className="font-medium text-gray-700 dark:text-gray-300">
              params:
            </p>
            <pre className="bg-white dark:bg-gray-800 p-2 rounded text-xs whitespace-pre-wrap break-all text-gray-700 dark:text-gray-200 shadow-sm">
              {JSON.stringify(
                invocation.args || invocation.toolCall?.args || {},
                null,
                2
              )}
            </pre>
          </div>
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">
              response:
            </p>
            <pre className="bg-white dark:bg-gray-800 p-2 rounded text-xs whitespace-pre-wrap break-all text-gray-700 dark:text-gray-200 shadow-sm">
              {typeof (invocation.result || invocation.toolResult) === "string"
                ? invocation.result || invocation.toolResult
                : JSON.stringify(
                    invocation.result || invocation.toolResult || {},
                    null,
                    2
                  )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolInvocationDisplay;
