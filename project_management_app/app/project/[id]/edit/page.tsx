"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, X, UserPlus } from "lucide-react";
import { useState } from "react";

type Project = {
  id: string;
  system: string;
  project: string;
  words: number;
  lines: number;
  translators: string[];
  dueDate: string;
  instructions: string;
  status?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  createdDate?: string;
  priority?: string;
};

// Mock project data - in a real app this would come from an API or state management
const mockProjects: Record<string, Project> = {
  "1": {
    id: "1",
    system: "B0X",
    project: "Marketing Campaign Q4",
    words: 2500,
    lines: 180,
    translators: [],
    dueDate: "2025-11-27",
    instructions: "Follow brand guidelines",
    status: "Unclaimed",
    sourceLanguage: "English",
    targetLanguage: "Spanish",
    createdDate: "2025-11-10",
    priority: "High",
  },
  "2": {
    id: "2",
    system: "XTM",
    project: "Legal Contract Translation",
    words: 4200,
    lines: 310,
    translators: ["John Smith"],
    dueDate: "2025-11-27",
    instructions: "Certified translation required",
    status: "In Progress",
    sourceLanguage: "English",
    targetLanguage: "French",
    createdDate: "2025-11-08",
    priority: "Urgent",
  },
  "3": {
    id: "3",
    system: "SSE",
    project: "Technical Manual v2.3",
    words: 8900,
    lines: 650,
    translators: ["Maria Garcia", "Jean Dupont"],
    dueDate: "2025-11-28",
    instructions: "Use glossary provided",
    status: "In Progress",
    sourceLanguage: "German",
    targetLanguage: "English",
    createdDate: "2025-11-05",
    priority: "Medium",
  },
  "4": {
    id: "4",
    system: "B0X",
    project: "Website Localization",
    words: 1800,
    lines: 125,
    translators: ["Anna Kowalski"],
    dueDate: "2025-11-28",
    instructions: "SEO keywords must be maintained",
    status: "Ready",
    sourceLanguage: "English",
    targetLanguage: "German",
    createdDate: "2025-11-12",
    priority: "High",
  },
  "5": {
    id: "5",
    system: "XTM",
    project: "User Guide Translation",
    words: 3200,
    lines: 240,
    translators: ["Li Wei"],
    dueDate: "2025-11-29",
    instructions: "Maintain formatting",
    status: "Ready",
    sourceLanguage: "English",
    targetLanguage: "Chinese",
    createdDate: "2025-11-09",
    priority: "Medium",
  },
  "6": {
    id: "6",
    system: "SSE",
    project: "Product Description Set",
    words: 1500,
    lines: 95,
    translators: [],
    dueDate: "2025-11-28",
    instructions: "Creative adaptation allowed",
    status: "Unclaimed",
    sourceLanguage: "English",
    targetLanguage: "Italian",
    createdDate: "2025-11-11",
    priority: "Low",
  },
  "7": {
    id: "7",
    system: "STM",
    project: "Email Templates",
    words: 950,
    lines: 68,
    translators: ["Ahmed Hassan"],
    dueDate: "2025-11-27",
    instructions: "Keep tone professional yet friendly",
    status: "In Progress",
    sourceLanguage: "English",
    targetLanguage: "Arabic",
    createdDate: "2025-11-06",
    priority: "High",
  },
  "8": {
    id: "8",
    system: "LAT",
    project: "Annual Report 2024",
    words: 6800,
    lines: 480,
    translators: ["John Smith", "Li Wei"],
    dueDate: "2025-11-30",
    instructions: "Financial terminology check required",
    status: "Ready",
    sourceLanguage: "English",
    targetLanguage: "Japanese",
    createdDate: "2025-11-07",
    priority: "Urgent",
  },
};

// Available translators list
const availableTranslators = [
  "John Smith",
  "Maria Garcia",
  "Jean Dupont",
  "Anna Kowalski",
  "Li Wei",
  "Ahmed Hassan",
  "Sofia Rodriguez",
  "Yuki Tanaka",
];

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const project = id ? mockProjects[id] : null;

  const [formData, setFormData] = useState({
    project: project?.project || "",
    system: project?.system || "B0X",
    words: project?.words || 0,
    lines: project?.lines || 0,
    dueDate: project?.dueDate || "",
    instructions: project?.instructions || "",
    status: project?.status || "Unclaimed",
    sourceLanguage: project?.sourceLanguage || "",
    targetLanguage: project?.targetLanguage || "",
    priority: project?.priority || "Medium",
    translators: project?.translators || [],
  });

  const [selectedTranslator, setSelectedTranslator] = useState<string>("");
  const [translatorToRemove, setTranslatorToRemove] = useState<string | null>(
    null
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleAddTranslator = () => {
    if (
      selectedTranslator &&
      !formData.translators.includes(selectedTranslator)
    ) {
      setFormData({
        ...formData,
        translators: [...formData.translators, selectedTranslator],
      });
      setSelectedTranslator("");
    }
  };

  const handleRemoveTranslatorClick = (translator: string) => {
    setTranslatorToRemove(translator);
    setShowConfirmDialog(true);
  };

  const handleConfirmRemove = () => {
    if (translatorToRemove) {
      setFormData({
        ...formData,
        translators: formData.translators.filter(
          (t) => t !== translatorToRemove
        ),
      });
      setShowConfirmDialog(false);
      setTranslatorToRemove(null);
    }
  };

  const handleCancelRemove = () => {
    setShowConfirmDialog(false);
    setTranslatorToRemove(null);
  };

  if (!project) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <h2 className="text-gray-900 dark:text-white mb-4">
            Project not found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The project you&apos;re trying to edit doesn&apos;t exist or has
            been removed.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
            type="button"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    console.log("Saving project:", formData);
    // In a real app, this would save the project including translators
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={handleCancel}
          className="inline-flex cursor-pointer items-center gap-2 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors mb-4"
          type="button"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <h1 className="text-gray-900 dark:text-white mb-2">Edit Project</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Update project details and settings
        </p>
      </div>

      {/* Form */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={formData.project}
              onChange={(e) =>
                setFormData({ ...formData, project: e.target.value })
              }
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project name"
            />
          </div>

          {/* System and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                System
              </label>
              <select
                value={formData.system}
                onChange={(e) =>
                  setFormData({ ...formData, system: e.target.value })
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="B0X">B0X</option>
                <option value="XTM">XTM</option>
                <option value="SSE">SSE</option>
                <option value="STM">STM</option>
                <option value="LAT">LAT</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Unclaimed">Unclaimed</option>
                <option value="In Progress">In Progress</option>
                <option value="Ready">Ready</option>
              </select>
            </div>
          </div>

          {/* Words and Lines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Word Count
              </label>
              <input
                type="number"
                value={formData.words}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    words: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Line Count
              </label>
              <input
                type="number"
                value={formData.lines}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lines: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Source Language
              </label>
              <input
                type="text"
                value={formData.sourceLanguage}
                onChange={(e) =>
                  setFormData({ ...formData, sourceLanguage: e.target.value })
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. English"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Target Language
              </label>
              <input
                type="text"
                value={formData.targetLanguage}
                onChange={(e) =>
                  setFormData({ ...formData, targetLanguage: e.target.value })
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Spanish"
              />
            </div>
          </div>

          {/* Due Date and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Translators */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Translators
            </label>
            <div className="space-y-3">
              {/* Add Translator */}
              <div className="flex gap-2">
                <select
                  value={selectedTranslator}
                  onChange={(e) => setSelectedTranslator(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a translator...</option>
                  {availableTranslators
                    .filter((t) => !formData.translators.includes(t))
                    .map((translator) => (
                      <option key={translator} value={translator}>
                        {translator}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddTranslator}
                  disabled={!selectedTranslator}
                  className="px-4 py-3 cursor-pointer bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Add
                </button>
              </div>

              {/* Current Translators */}
              {formData.translators.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.translators.map((translator) => (
                    <div
                      key={translator}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      <span className="text-sm">{translator}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTranslatorClick(translator)}
                        className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No translators assigned
                </p>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
              }
              className="w-full h-32 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter project instructions..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleCancel}
            className="px-6 py-3 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
            type="button"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Remove Translator
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {translatorToRemove}
              </span>{" "}
              from this project?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelRemove}
                className="px-4 py-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemove}
                className="px-4 py-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
