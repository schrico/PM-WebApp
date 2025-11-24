"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Lock,
  Mail,
  Smartphone,
  Check,
  Loader2,
  Save,
  User,
} from "lucide-react";

type NotificationSettings = {
  email: boolean;
  push: boolean;
  projectAssignments: boolean;
  deadlineReminders: boolean;
  weeklyDigest: boolean;
};

type SettingsState = {
  notifications: NotificationSettings;
};

const INITIAL_SETTINGS: SettingsState = {
  notifications: {
    email: true,
    push: false,
    projectAssignments: true,
    deadlineReminders: true,
    weeklyDigest: false,
  },
};

export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>(INITIAL_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const hasChanges = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(INITIAL_SETTINGS),
    [settings]
  );

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleSave = async () => {
    if (!hasChanges || isSaving) return;
    try {
      setIsSaving(true);
      // Hook this up to your backend / Supabase later
      console.log("Saving settings:", settings);
      setLastSavedAt(new Date());
    } finally {
      setIsSaving(false);
    }
  };

  const { notifications } = settings;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage how the app keeps you up to date
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 text-xs text-gray-500 dark:text-gray-400">
          {hasChanges ? (
            <span className="text-amber-600 dark:text-amber-400">
              • Unsaved changes
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3" />
              All changes saved
            </span>
          )}
          {lastSavedAt && (
            <span>
              Last updated:{" "}
              {lastSavedAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-gray-900 dark:text-white">Notifications</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Choose when we should tap you on the shoulder
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Channels */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-900 dark:text-white">
                  Email notifications
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Project updates sent to your inbox
                </p>
              </div>
            </div>
            <button
              onClick={() => handleNotificationToggle("email")}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications.email
                  ? "bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              type="button"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.email ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-900 dark:text-white">
                  Push notifications
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Alerts on your device (when enabled)
                </p>
              </div>
            </div>
            <button
              onClick={() => handleNotificationToggle("push")}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications.push
                  ? "bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              type="button"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.push ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />

          {/* Events */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 dark:text-white">
                Project assignments
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                When you&apos;re added to or removed from a project
              </p>
            </div>
            <button
              onClick={() => handleNotificationToggle("projectAssignments")}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications.projectAssignments
                  ? "bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              type="button"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.projectAssignments ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 dark:text-white">
                Deadline reminders
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Heads-up before a project is due
              </p>
            </div>
            <button
              onClick={() => handleNotificationToggle("deadlineReminders")}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications.deadlineReminders
                  ? "bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              type="button"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.deadlineReminders ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 dark:text-white">Weekly digest</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                A simple summary of your week, every Monday
              </p>
            </div>
            <button
              onClick={() => handleNotificationToggle("weeklyDigest")}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications.weeklyDigest
                  ? "bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              type="button"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.weeklyDigest ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end mt-2 mb-4">
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          type="button"
          className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 shadow-sm text-sm font-medium ${
            !hasChanges || isSaving
              ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save changes
            </>
          )}
        </button>
      </div>

      {/* Info: personal info lives on Profile */}
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          <p className="text-gray-800 dark:text-blue-50 text-sm">
            To change your name or email, use your{" "}
            <span className="font-medium">Profile</span>.
          </p>
        </div>
        <Link
          href="/profile"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-400 text-blue-700 dark:text-blue-100 hover:bg-blue-100/60 dark:hover:bg-blue-900/40 transition-colors"
        >
          Open Profile
        </Link>
      </div>

      {/* Security & privacy */}
      <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-gray-900 dark:text-white mb-1">
              Security & privacy
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Passwords and advanced security (like two-factor authentication)
              are managed by your system administrator. If something
              doesn&apos;t look right with your account, please contact your
              admin team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
