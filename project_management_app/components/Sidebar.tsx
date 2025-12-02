"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderKanban,
  UserPlus,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Settings,
  UserCircle,
  Receipt,
  ClipboardList,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SidebarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export function Sidebar({
  darkMode,
  setDarkMode,
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/my-projects", icon: ClipboardList, label: "My Projects" },
    { path: "/assign-projects", icon: UserPlus, label: "Assign Projects" },
    { path: "/manage-projects", icon: FolderKanban, label: "Manage Projects" },
    { path: "/invoicing", icon: Receipt, label: "Invoicing" },
  ];

  // Controls when text labels are visible (for the 350ms delay)
  const [showLabels, setShowLabels] = useState(!collapsed);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (!collapsed) {
      // expanding → wait 350ms before showing labels
      timeout = setTimeout(() => {
        setShowLabels(true);
      }, 115);
    } else {
      // collapsing → hide labels immediately
      setShowLabels(false);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [collapsed]);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        collapsed ? "w-20" : "w-52"
      } z-50`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {showLabels && (
              <span className="text-gray-900 dark:text-white font-medium">
                TETRAEPIK
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
            type="button"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {showLabels && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="px-3 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <Link
            href="/profile"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/profile"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            title={collapsed ? "Profile" : undefined}
          >
            <UserCircle className="w-8 h-8 shrink-0 rounded-full bg-gray-300 text-gray-500 p-1" />
            {showLabels && (
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">John Smith</p>
                <p className="text-xs opacity-70 truncate">Senior Translator</p>
              </div>
            )}
          </Link>
        </div>

        {/* Settings & Dark Mode Toggle */}
        <div className="px-3 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-1">
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/settings"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            title={collapsed ? "Settings" : undefined}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {showLabels && <span>Settings</span>}
          </Link>
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="flex cursor-pointer items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title={
              collapsed ? (darkMode ? "Light Mode" : "Dark Mode") : undefined
            }
          >
            {darkMode ? (
              <Sun className="w-5 h-5 shrink-0" />
            ) : (
              <Moon className="w-5 h-5 shrink-0" />
            )}
            {showLabels && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
