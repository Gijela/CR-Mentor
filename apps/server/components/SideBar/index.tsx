"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import SidebarItem from "./SidebarItem";
import { sidebarItems } from "./config";
import CollapseIcon from "./icons/CollapseIcon";

function Sidebar() {
  // 侧边栏展开/折叠状态
  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // 本地保存侧边栏状态
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div className="min-w-fit">
      {/* 侧边栏 */}
      <div
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out rounded-tr-xl rounded-br-xl shadow-sm`}
      >
        {/* [内容]菜单 */}
        <div className="space-y-8">
          <ul className="mt-3">
            {sidebarItems.map((item, index) => (
              <SidebarItem menuData={item} key={index} />
            ))}
          </ul>
        </div>

        {/* [底部]展开/折叠按钮 */}
        <div className="pt-3 hidden lg:inline-flex justify-end mt-auto">
          <div className="w-12 pl-4 pr-3 py-2">
            <button
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
            >
              <CollapseIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
