import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Home } from './components/pages/Home';
import { MyProjects } from './components/pages/MyProjects';
import { AssignProjects } from './components/pages/AssignProjects';
import { ManageProjects } from './components/pages/ManageProjects';
import { Profile } from './components/pages/Profile';
import { Settings } from './components/pages/Settings';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Router>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Sidebar 
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
          <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/my-projects" element={<MyProjects />} />
              <Route path="/assign-projects" element={<AssignProjects />} />
              <Route path="/manage-projects" element={<ManageProjects />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
}