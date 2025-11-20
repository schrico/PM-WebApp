import { Link, useLocation } from 'react-router-dom';
import { Home, FolderKanban, UserPlus, LayoutGrid, User, Moon, Sun, ChevronLeft, ChevronRight, Settings } from 'lucide-react';

interface SidebarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export function Sidebar({ darkMode, setDarkMode, collapsed, setCollapsed }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/my-projects', icon: FolderKanban, label: 'My Projects' },
    { path: '/assign-projects', icon: UserPlus, label: 'Assign Projects' },
    { path: '/manage-projects', icon: LayoutGrid, label: 'Manage Projects' },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} z-50`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">Logo</span>
              </div>
              <span className="text-gray-900 dark:text-white">TETRAEPIK</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="px-3 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <Link
            to="/profile"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              location.pathname === '/profile'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title={collapsed ? 'Profile' : undefined}
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
              JS
            </div>
            {!collapsed && (
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
            to="/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              location.pathname === '/settings'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title={collapsed ? 'Settings' : undefined}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title={collapsed ? (darkMode ? 'Light Mode' : 'Dark Mode') : undefined}
          >
            {darkMode ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
            {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}