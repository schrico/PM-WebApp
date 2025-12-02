"use client";

import { useMemo, useState } from "react";
import { Camera, Save, Loader2, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

type ProfileFormData = {
  name: string;
  shortName: string;
  email: string;
  cUser: string;
  teUser: string;
  role: string;
};

const INITIAL_DATA: ProfileFormData = {
  name: "John Smith",
  shortName: "John",
  email: "john.smith@transagency.com",
  cUser: "jsmith",
  teUser: "john.smith",
  role: "Senior Translator",
};

export default function Profile() {
  const [formData, setFormData] = useState<ProfileFormData>(INITIAL_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const hasChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(INITIAL_DATA);
  }, [formData]);

  const initials = useMemo(() => {
    if (!formData.name.trim()) return "??";
    const parts = formData.name.trim().split(" ");
    const first = parts[0]?.[0] ?? "";
    const last = parts[parts.length - 1]?.[0] ?? "";
    return (first + last).toUpperCase();
  }, [formData.name]);

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    try {
      setIsSaving(true);
      // 👉 Aqui depois ligas ao teu backend / Supabase
      // await updateUserProfile(formData);
      console.log("Saving profile:", formData);
      setLastSavedAt(new Date());
      // Se quiseres, podes também atualizar o INITIAL_DATA com o que foi guardado
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Update your personal information and account details
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Avatar Section */}
        <div className="p-8 border-b border-gray-200 dark:border-gray-700 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                {initials}
              </div>
              <button
                className="absolute bottom-0 right-0 w-8 h-8 cursor-pointer bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                type="button"
              >
                <Camera className="w-4 h-4 text-white dark:text-gray-900" />
              </button>
            </div>
            <div>
              <h2 className="text-gray-900 dark:text-white mb-1 text-lg font-semibold">
                {formData.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {formData.email}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1 text-xs text-gray-500 dark:text-gray-400">
            {hasChanges ? (
              <span className="text-amber-600 dark:text-amber-400">
                • Unsaved changes
              </span>
            ) : (
              <span>All changes saved</span>
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

        {/* Form Section */}
        <div className="p-8 space-y-8">
          {/* Personal info */}
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Personal information
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This will be visible to project managers and colleagues.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Short Name */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm">
                  Preferred Name
                </label>
                <input
                  type="text"
                  value={formData.shortName}
                  onChange={(e) => handleChange("shortName", e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This is how your name will appear in project views.
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm">
                  Role
                </label>
                <input
                  type="text"
                  value={formData.role}
                  disabled
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Account details */}
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Account details
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Integration usernames for your CAT tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* C User */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm">
                  C Username
                </label>
                <input
                  type="text"
                  value={formData.cUser}
                  onChange={(e) => handleChange("cUser", e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* TE User */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm">
                  TE Username
                </label>
                <input
                  type="text"
                  value={formData.teUser}
                  onChange={(e) => handleChange("teUser", e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`px-6 py-3 cursor-pointer rounded-lg transition-colors flex items-center gap-2 shadow-sm text-sm font-medium ${
                !hasChanges || isSaving
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              type="button"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Link to Settings for notifications */}
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-300" />
          <p className="text-gray-700 dark:text-gray-200 text-sm">
            Notification rules are managed in{" "}
            <span className="font-medium">Settings</span>.
          </p>
        </div>
        <Link
          href="/settings"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        >
          Open Settings
        </Link>
      </div>

      {/* Additional Info Card */}
      <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
        <p className="text-blue-900 dark:text-blue-200 text-sm">
          <span>💡 </span>
          Your role is assigned by project managers and cannot be changed here.
          Contact your PM if you believe your role needs updating.
        </p>
      </div>
    </div>
  );
}