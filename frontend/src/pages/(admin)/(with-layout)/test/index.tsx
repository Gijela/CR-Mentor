import Editor from "@monaco-editor/react";
import { options } from "./config";
import { extraHeight } from "../agents";

export function Component() {
  return (
    <div
      className="w-full border border-red-500"
      style={{
        height: window.innerHeight - extraHeight - 2 * 24, // 24 的自身容器的padding
      }}
    >
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue="// some comment \n 123"
        theme="light"
        options={options as any}
        loading={<div>加载中...</div>}
      />
    </div>
  );
}
