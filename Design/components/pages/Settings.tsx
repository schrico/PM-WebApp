import { useState } from 'react';
import { Bell, Globe, Lock, Mail, Smartphone, Check } from 'lucide-react';

export function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    projectAssignments: true,
    deadlineReminders: true,
    weeklyDigest: false,
  });

  const [preferences, setPreferences] = useState({
    language: 'English',
    timezone: 'UTC-5 (EST)',
    dateFormat: 'DD/MM/YYYY',
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your application preferences and notifications
        </p>
      </div>

      {/* Notifications Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-gray-900 dark:text-white">
                Notifications
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Choose how you receive updates
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-900 dark:text-white">Email Notifications</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Receive updates via email</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications.email ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.email ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-900 dark:text-white">Push Notifications</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Receive push notifications</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications.push ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.push ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 dark:text-white">Project Assignments</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">When you're assigned to a project</p>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, projectAssignments: !notifications.projectAssignments })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications.projectAssignments ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.projectAssignments ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 dark:text-white">Deadline Reminders</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">24 hours before project deadline</p>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, deadlineReminders: !notifications.deadlineReminders })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications.deadlineReminders ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.deadlineReminders ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 dark:text-white">Weekly Digest</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Summary of your week every Monday</p>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, weeklyDigest: !notifications.weeklyDigest })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications.weeklyDigest ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.weeklyDigest ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-gray-900 dark:text-white">
                Preferences
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Customize your experience
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm">
              Language
            </label>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Chinese</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm">
              Timezone
            </label>
            <select
              value={preferences.timezone}
              onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>UTC-5 (EST)</option>
              <option>UTC-8 (PST)</option>
              <option>UTC+0 (GMT)</option>
              <option>UTC+1 (CET)</option>
              <option>UTC+8 (CST)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm">
              Date Format
            </label>
            <select
              value={preferences.dateFormat}
              onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-gray-900 dark:text-white mb-1">Security & Privacy</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              For password changes and two-factor authentication, please contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
