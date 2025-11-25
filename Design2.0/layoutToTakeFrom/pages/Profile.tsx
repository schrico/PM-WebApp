import { useState } from 'react';
import { Camera, Save, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'John Smith',
    shortName: 'John',
    email: 'john.smith@transagency.com',
    cUser: 'jsmith',
    teUser: 'john.smith',
    role: 'Administrator',
  });

  const [changesSaved, setChangesSaved] = useState(true);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setChangesSaved(false);
  };

  const handleSave = () => {
    console.log('Saving profile:', formData);
    setChangesSaved(true);
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
        {/* Profile Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar with Camera Icon */}
              <div className="relative">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">JS</span>
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 dark:bg-gray-700 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Name and Email */}
              <div>
                <h2 className="text-gray-900 dark:text-white mb-1">
                  {formData.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {formData.email}
                </p>
              </div>
            </div>

            {/* All changes saved indicator */}
            {changesSaved && (
              <span className="text-blue-400 dark:text-blue-700 text-sm">
                All changes saved
              </span>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <h3 className="text-gray-900 dark:text-white mb-1">
              Personal information
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              This will be visible to project managers and colleagues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Preferred Name */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
                Preferred Name
              </label>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => handleChange('shortName', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                This is how your name will appear in project views.
              </p>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role (Read-only) */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                disabled
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-gray-900 dark:text-white mb-1">
              Account details
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Integration usernames for your CAT tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* C Username */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
                C Username
              </label>
              <input
                type="text"
                value={formData.cUser}
                onChange={(e) => handleChange('cUser', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* TE Username */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
                TE Username
              </label>
              <input
                type="text"
                value={formData.teUser}
                onChange={(e) => handleChange('teUser', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={changesSaved}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                changesSaved
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-400" />
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Notification rules are managed in Settings.
            </p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
          >
            Open Settings
          </button>
        </div>
      </div>

      {/* Additional Info Card */}
      <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
        <p className="text-blue-900 dark:text-blue-200 text-sm">
          <span>💡 </span>Your role is assigned by project managers and cannot be changed here. Contact your PM if you believe your role needs updating.
        </p>
      </div>
    </div>
  );
}