// app/layout.tsx
"use client";

import "./globals.css";
import type { ReactNode } from "react";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <html lang="en" className={darkMode ? "dark" : ""}>
      <body className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Sidebar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        <main
          className={`min-h-screen transition-all duration-300 ${
            sidebarCollapsed ? "ml-20" : "ml-52"
          }`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
