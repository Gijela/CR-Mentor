"use client";

import React, { useEffect, useState } from "react";

// import Sidebar from "@/components/SideBar";
// import { sidebarItems } from "@/components/SideBar/config";

function Dashboard() {
  // 当前选中项
  // const [selectedItemKey, setSelectedItemKey] = useState(sidebarItems[0].key);

  // // 刷新时使用 hash 来初始化选中项
  // useEffect(() => {
  //   const hash = window.location.hash.slice(1);
  //   if (
  //     hash &&
  //     (sidebarItems.some((item) => !item.children && item.key === hash) ||
  //       sidebarItems.some((item) =>
  //         item.children?.some((child) => child.key === hash)
  //       ))
  //   ) {
  //     setSelectedItemKey(hash);
  //   } else {
  //     // 默认选择第一个菜单项的第一个子项
  //     const defaultKey =
  //       sidebarItems[0].children?.[0]?.key || sidebarItems[0].key;
  //     window.location.hash = defaultKey;
  //     setSelectedItemKey(defaultKey);
  //   }
  // }, []);

  // // 监听 hash 变化
  // useEffect(() => {
  //   const handleHashChange = () => {
  //     const hash = window.location.hash.slice(1);
  //     if (
  //       hash &&
  //       (sidebarItems.some((item) => !item.children && item.key === hash) ||
  //         sidebarItems.some((item) =>
  //           item.children?.some((child) => child.key === hash)
  //         ))
  //     ) {
  //       setSelectedItemKey(hash);
  //     }
  //   };

  //   window.addEventListener("hashchange", handleHashChange);
  //   return () => {
  //     window.removeEventListener("hashchange", handleHashChange);
  //   };
  // }, []);

  return (
    <>
      <a href="https://dashboard.cr-mentor.top">dashboard</a>
    </>
    // <div className="flex h-screen overflow-hidden">
    //   {/* 侧边栏 */}
    //   <Sidebar />

    //   {/* 内容区域 */}
    //   <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
    //     {/* header */}
    //     {/* <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

    //     {/* 主内容区域 */}
    //     {/*  bg-gray-100 */}
    //     <main className="grow">
    //       {(() => {
    //         // 先查找顶层项
    //         const topLevelItem = sidebarItems.find(
    //           (item) => item.key === selectedItemKey
    //         );

    //         // 如果是父菜单且有子项，显示第一个子项的组件
    //         if (topLevelItem?.children?.length) {
    //           return topLevelItem.children[0].component;
    //         }

    //         // 如果是普通顶层项且有组件，直接显示
    //         if (topLevelItem?.component) {
    //           return topLevelItem.component;
    //         }

    //         // 查找子项
    //         const childItem = sidebarItems
    //           .flatMap((item) => item.children || [])
    //           .find((child) => child.key === selectedItemKey);
    //         return childItem?.component || null;
    //       })()}
    //     </main>

    //     {/* <Banner /> */}
    //   </div>
    // </div>
  );
}

export default Dashboard;
