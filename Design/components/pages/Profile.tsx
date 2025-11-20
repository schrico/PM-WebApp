import { useState } from 'react';
import { Camera, Save } from 'lucide-react';

export function Profile() {
  const [formData, setFormData] = useState({
    name: 'John Smith',
    shortName: 'John',
    email: 'john.smith@transagency.com',
    cUser: 'jsmith',
    teUser: 'john.smith',
    role: 'Senior Translator',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving profile:', formData);
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
        <div className="p-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
                JS
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <Camera className="w-4 h-4 text-white dark:text-gray-900" />
              </button>
            </div>
            <div>
              <h2 className="text-gray-900 dark:text-white mb-1">
                {formData.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {formData.email}
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
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
                onChange={(e) => handleChange('shortName', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
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

            {/* C User */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm">
                C Username
              </label>
              <input
                type="text"
                value={formData.cUser}
                onChange={(e) => handleChange('cUser', e.target.value)}
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
                onChange={(e) => handleChange('teUser', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
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