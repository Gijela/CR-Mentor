import React from "react";
import SidebarLinkGroup from "./SidebarLinkGroup";

interface SidebarItemProps {
  menuData: {
    key: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    children?: { key: string; label: string }[];
    defaultOpen?: boolean;
  };
}

const SidebarItem: React.FC<SidebarItemProps> = ({ menuData }) => {
  // 当前 hash 值
  const hash = window.location.hash.slice(1);
  // 是否被选中
  const isActive =
    menuData.key === hash ||
    menuData.children?.some((child) => child.key === hash);

  // 更新 hash
  const updateHash = (hash: string) => {
    window.location.hash = hash;
  };

  // 菜单项组件
  const MenuItem = ({
    converseArrow = () => {},
    openSubMenu,
  }: {
    converseArrow?: () => void; // 展开/关闭折叠箭头
    openSubMenu?: boolean; // 是否展开
  }) => {
    return (
      <div
        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
          !isActive && "hover:text-gray-900 dark:hover:text-white"
        }`}
        onClick={() => {
          if (!menuData.children) {
            updateHash(menuData.key);
          }

          converseArrow?.();
        }}
      >
        <div className="flex items-center justify-between">
          <div className="grow flex items-center">
            <div
              className={`shrink-0 fill-current ${
                isActive
                  ? "text-violet-500"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {menuData.icon}
            </div>
            <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 duration-200">
              {menuData.label}
            </span>
          </div>
          {/* 徽章[数字] */}
          {menuData.badge && (
            <div className="flex flex-shrink-0 ml-2">
              <span className="inline-flex items-center justify-center h-5 text-xs font-medium text-white bg-violet-400 px-2 rounded">
                {menuData.badge}
              </span>
            </div>
          )}
          {/* 箭头 Icon */}
          {openSubMenu !== undefined && (
            <div className="flex shrink-0 ml-2">
              <svg
                className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${
                  openSubMenu && "rotate-180"
                }`}
                viewBox="0 0 12 12"
              >
                <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {menuData.children && menuData.children?.length > 0 ? (
        // 含有子菜单
        <SidebarLinkGroup
          activecondition={isActive}
          defaultOpen={menuData.defaultOpen}
        >
          {(handleClick, open) => {
            return (
              <React.Fragment>
                <MenuItem converseArrow={handleClick} openSubMenu={open} />

                {/* 子菜单 */}
                <div className="lg:hidden lg:sidebar-expanded:block">
                  <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                    {(menuData.children || []).map((child) => (
                      <li className="mb-1 last:mb-0" key={child.key}>
                        <div
                          className={`block transition duration-150 truncate ${
                            hash === child.key
                              ? "text-violet-500"
                              : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          }`}
                          onClick={() => {
                            updateHash(child.key);
                          }}
                        >
                          <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100  duration-200">
                            {child.label}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </React.Fragment>
            );
          }}
        </SidebarLinkGroup>
      ) : (
        // 不含子菜单
        <li
          className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${
            isActive &&
            "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
          }`}
        >
          <MenuItem />
        </li>
      )}
    </>
  );
};

export default SidebarItem;
