"use client";

import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { menuItems } from "@/components/config";

const Dashboard: React.FC = () => {
  const [selectedItemKey, setSelectedItemKey] = useState<string>(
    menuItems[0].key as string
  );

  // 刷新时使用 hash 来初始化选中项
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && menuItems.some((item) => item.key === hash)) {
      setSelectedItemKey(hash);
    } else {
      window.location.hash = menuItems[0].key as string;
    }
  }, []);

  // 监听 hash 变化
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && menuItems.some((item) => item.key === hash)) {
        setSelectedItemKey(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    // 组件卸载时移除事件监听
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div className="flex px-20 overflow-hidden max-w-[1280px] mx-auto h-[calc(100vh-88px)]">
      <Menu
        style={{ width: 256, borderRight: "none" }}
        mode="inline"
        items={menuItems}
        selectedKeys={[selectedItemKey]}
        onSelect={({ key }) => {
          setSelectedItemKey(key as string);
          window.location.hash = key;
        }}
      />

      <div className="relative flex flex-col flex-1 overflow-hidden">
        <main className="grow overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {menuItems.find((item) => item.key === selectedItemKey)
              ?.component || null}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
