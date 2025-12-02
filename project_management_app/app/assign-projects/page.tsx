// app/assign-projects/page.tsx
"use client";

import { useState } from "react";
import { Search, X, UserCircle } from "lucide-react";
import { FilterDropdown } from "@/components/FilterDropdown";
import { ViewToggle } from "@/components/ViewToggle";
import { formatNumber, formatDate } from "@/utils/formatters";
import { getSystemColor } from "@/utils/toChange/systemColors";
import {
  matchesDueDateFilter,
  matchesLengthFilter,
} from "@/utils/filterHelpers";

type Project = {
  id: string;
  system: string;
  project: string;
  words: number;
  lines: number;
  translators: string[];
  dueDate: string; // ISO string, e.g. "2025-11-27"
  instructions: string;
  sourceLanguage?: string;
  targetLanguage?: string;
};

type User = {
  id: string;
  name: string;
  role: string;
  avatar: string;
};

const projects: Project[] = [
  {
    id: "1",
    system: "B0X",
    project: "Marketing Campaign Q4",
    words: 2500,
    lines: 180,
    translators: [],
    dueDate: "2025-11-27",
    instructions: "Follow brand guidelines",
    sourceLanguage: "EN-English",
    targetLanguage: "ES-Spanish",
  },
  {
    id: "2",
    system: "XTM",
    project: "Legal Contract Translation",
    words: 4200,
    lines: 310,
    translators: ["John Smith"],
    dueDate: "2025-11-27",
    instructions: "Certified translation required",
    sourceLanguage: "EN-English",
    targetLanguage: "DE-German",
  },
  {
    id: "3",
    system: "SSE",
    project: "Technical Manual v2.3",
    words: 8900,
    lines: 650,
    translators: ["Maria Garcia", "Jean Dupont"],
    dueDate: "2025-11-28",
    instructions: "Use glossary provided",
    sourceLanguage: "DE-German",
    targetLanguage: "EN-English",
  },
  {
    id: "4",
    system: "B0X",
    project: "Website Localization",
    words: 1800,
    lines: 125,
    translators: [],
    dueDate: "2025-11-28",
    instructions: "SEO keywords must be maintained",
    sourceLanguage: "EN-English",
    targetLanguage: "PT-Portuguese",
  },
  {
    id: "5",
    system: "XTM",
    project: "User Guide Translation",
    words: 3200,
    lines: 240,
    translators: ["Anna Kowalski"],
    dueDate: "2025-11-29",
    instructions: "Maintain formatting",
    sourceLanguage: "EN-English",
    targetLanguage: "BR-Brazilian",
  },
];

const users: User[] = [
  { id: "1", name: "John Smith", role: "Senior Translator", avatar: "JS" },
  { id: "2", name: "Maria Garcia", role: "Translator", avatar: "MG" },
  { id: "3", name: "Jean Dupont", role: "Translator", avatar: "JD" },
  { id: "4", name: "Anna Kowalski", role: "Junior Translator", avatar: "AK" },
  { id: "5", name: "Li Wei", role: "Senior Translator", avatar: "LW" },
  { id: "6", name: "Ahmed Hassan", role: "Translator", avatar: "AH" },
  { id: "7", name: "Sofia Rodriguez", role: "Translator", avatar: "SR" },
  { id: "8", name: "Yuki Tanaka", role: "Senior Translator", avatar: "YT" },
];

export default function AssignProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(
    new Set()
  );
  const [showUserSelection, setShowUserSelection] = useState(false);
  const [selectedTranslators, setSelectedTranslators] = useState<Set<string>>(
    new Set()
  );
  const [translatorMessages, setTranslatorMessages] = useState<
    Record<string, string>
  >({});
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // Filter states
  const [systemFilter, setSystemFilter] = useState<string | null>(null);
  const [dueDateFilter, setDueDateFilter] = useState<string | null>(null);
  const [customDueDate, setCustomDueDate] = useState<string>("");
  const [sourceLangFilter, setSourceLangFilter] = useState<string | null>(null);
  const [targetLangFilter, setTargetLangFilter] = useState<string | null>(null);
  const [lengthFilter, setLengthFilter] = useState<string | null>(null);
  // const [toolFilter, setToolFilter] = useState<string | null>(null); // commented out
  const [assignmentFilter, setAssignmentFilter] = useState<string | null>(
    "Unassigned"
  );

  const clearAllFilters = () => {
    setSystemFilter(null);
    setDueDateFilter(null);
    setCustomDueDate("");
    setAssignmentFilter(null); // Keep the default
    setSourceLangFilter(null);
    setTargetLangFilter(null);
    setLengthFilter(null);
    // setToolFilter(null); // commented out
  };

  const hasActiveFilters =
    systemFilter ||
    dueDateFilter ||
    assignmentFilter ||
    sourceLangFilter ||
    targetLangFilter ||
    lengthFilter; // toolFilter commented out

  // Sort projects by due date (earliest to latest)
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  // Filtering logic
  const filteredProjects = sortedProjects.filter((p) => {
    // Search filter
    if (
      searchTerm &&
      !p.project.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Assignment status filter
    if (assignmentFilter === "Unassigned" && p.translators.length > 0) {
      return false;
    }

    if (assignmentFilter === "Assigned" && p.translators.length === 0) {
      return false;
    }

    // System filter
    if (systemFilter && p.system !== systemFilter) {
      return false;
    }

    // Due date filter
    if (
      dueDateFilter &&
      !matchesDueDateFilter(
        p.dueDate,
        dueDateFilter,
        customDueDate || undefined
      )
    ) {
      return false;
    }

    // Source language filter
    if (sourceLangFilter && p.sourceLanguage !== sourceLangFilter) {
      return false;
    }

    // Target language filter
    if (targetLangFilter && p.targetLanguage !== targetLangFilter) {
      return false;
    }

    // Length filter
    if (lengthFilter && !matchesLengthFilter(p.words, lengthFilter)) {
      return false;
    }

    // Tool filter - commented out as requested
    // if (toolFilter && p.tool !== toolFilter) {
    //   return false;
    // }

    return true;
  });

  const handleRowClick = (id: string, e: React.MouseEvent) => {
    // Don't handle clicks on buttons (but allow clicks on checkboxes to be handled by the row)
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    // If clicking directly on the checkbox, let the checkbox's onChange handle it
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" &&
      target.getAttribute("type") === "checkbox"
    ) {
      return;
    }
    handleSelection(id);
  };

  const handleSelection = (projectId: string) => {
    const newSelection = new Set(selectedProjects);
    if (newSelection.has(projectId)) {
      newSelection.delete(projectId);
    } else {
      newSelection.add(projectId);
    }
    setSelectedProjects(newSelection);
  };

  const handleConfirmSelection = () => {
    if (selectedProjects.size > 0) {
      setShowUserSelection(true);
    }
  };

  const handleTranslatorToggle = (userId: string) => {
    const newSelection = new Set(selectedTranslators);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
      const newMessages = { ...translatorMessages };
      delete newMessages[userId];
      setTranslatorMessages(newMessages);
    } else {
      newSelection.add(userId);
    }
    setSelectedTranslators(newSelection);
  };

  const handleMessageChange = (userId: string, message: string) => {
    setTranslatorMessages((prev) => ({ ...prev, [userId]: message }));
  };

  const handleAssign = () => {
    console.log(
      "Assigning projects",
      Array.from(selectedProjects),
      "to users",
      Array.from(selectedTranslators),
      "with messages",
      translatorMessages
    );
    setShowUserSelection(false);
    setSelectedProjects(new Set());
    setSelectedTranslators(new Set());
    setTranslatorMessages({});
  };

  const selectedProjectsList = projects.filter((p) =>
    selectedProjects.has(p.id)
  );

  // --- USER SELECTION VIEW ---
  if (showUserSelection) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 dark:text-white mb-2">
              Assign to Translator
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Select one or more translators for {selectedProjects.size}{" "}
              selected project{selectedProjects.size !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => {
              setShowUserSelection(false);
              setSelectedTranslators(new Set());
              setTranslatorMessages({});
            }}
            className="px-5 py-2.5 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors flex items-center gap-2 border border-gray-200 dark:border-gray-700"
            type="button"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>

        {/* Selected Projects Summary */}
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
          <h3 className="text-blue-900 dark:text-blue-200 mb-3">
            Selected Projects ({selectedProjectsList.length})
          </h3>
          <div className="space-y-2">
            {selectedProjectsList.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-blue-800 dark:text-blue-300">
                  {project.system} - {project.project}
                </span>
                <div className="flex items-center gap-4 text-blue-700 dark:text-blue-400">
                  <span>{formatNumber(project.words)} words</span>
                  <span>Due: {formatDate(project.dueDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Translator Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {users.map((user) => {
            const isSelected = selectedTranslators.has(user.id);
            return (
              <div
                key={user.id}
                className={`p-6 bg-white dark:bg-gray-800 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-blue-500 shadow-lg"
                    : "border-gray-200 dark:border-gray-700 hover:shadow-lg"
                }`}
                onClick={(e) => {
                  // Don't handle clicks on buttons, textarea, or label
                  if (
                    (e.target as HTMLElement).closest("button") ||
                    (e.target as HTMLElement).closest("textarea") ||
                    (e.target as HTMLElement).closest("label")
                  ) {
                    return;
                  }
                  // If clicking directly on the checkbox, let the checkbox's onChange handle it
                  const target = e.target as HTMLElement;
                  if (
                    target.tagName === "INPUT" &&
                    target.getAttribute("type") === "checkbox"
                  ) {
                    return;
                  }
                  handleTranslatorToggle(user.id);
                }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleTranslatorToggle(user.id)}
                    className="outline-style w-5 h-5 mt-1 rounded cursor-pointer"
                  />
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white mb-3">
                      {user.avatar}
                    </div>
                    <h3 className="text-gray-900 dark:text-white mb-1">
                      {user.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {user.role}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
                      Instructions (optional)
                    </label>
                    <textarea
                      value={translatorMessages[user.id] || ""}
                      onChange={(e) =>
                        handleMessageChange(user.id, e.target.value)
                      }
                      placeholder="Add special instructions..."
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Assign Button */}
        <div className="flex justify-center">
          <button
            onClick={handleAssign}
            disabled={selectedTranslators.size === 0}
            className="px-8 py-4 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
            type="button"
          >
            Assign to {selectedTranslators.size} Translator
            {selectedTranslators.size !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    );
  }

  // --- PROJECT SELECTION VIEW ---
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Assign Projects</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Select one or more projects and assign them to a translator
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by project name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1 items-center">
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              View
            </span>
            <ViewToggle view={viewMode} onViewChange={setViewMode} />
          </div>
        </div>

        {/* Individual Filter Dropdowns */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-wrap gap-3 items-start">
            <FilterDropdown
              label="Assignment Status"
              options={["Unassigned", "Assigned"]}
              selected={assignmentFilter}
              onSelect={setAssignmentFilter}
            />
            <FilterDropdown
              label="System"
              options={["B0X", "XTM", "SSE", "STM", "LAT"]}
              selected={systemFilter}
              onSelect={setSystemFilter}
            />
            <FilterDropdown
              label="Due Date"
              options={[
                "Today",
                "In 1 day",
                "In 3 days",
                "In a week",
                "In a month",
                "Custom date",
              ]}
              selected={dueDateFilter}
              onSelect={setDueDateFilter}
              customDateValue={customDueDate}
              onCustomDateChange={setCustomDueDate}
            />
            <FilterDropdown
              label="Source Language"
              options={[
                "EN-English",
                "DE-German",
                "BR-Brazilian",
                "PT-Portuguese",
                "ES-Spanish",
              ]}
              selected={sourceLangFilter}
              onSelect={setSourceLangFilter}
            />
            <FilterDropdown
              label="Target Language"
              options={[
                "EN-English",
                "DE-German",
                "BR-Brazilian",
                "PT-Portuguese",
                "ES-Spanish",
              ]}
              selected={targetLangFilter}
              onSelect={setTargetLangFilter}
            />
            <FilterDropdown
              label="Length"
              options={["Short", "Long"]}
              selected={lengthFilter}
              onSelect={setLengthFilter}
            />
            {/* Tool filter - commented out as requested */}
            {/* <FilterDropdown
              label="Tool"
              options={["C-User", "TE-User"]}
              selected={toolFilter}
              onSelect={setToolFilter}
            /> */}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-black text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 transition-all flex items-center gap-2 text-sm shadow-sm shrink-0"
              type="button"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table or Card View */}
      {viewMode === "table" ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <th className="px-6 py-4 w-4" />
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300 w-12" />
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">
                    System
                  </th>
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">
                    Project
                  </th>
                  <th className="px-6 py-4 text-right text-gray-700 dark:text-gray-300">
                    Words
                  </th>
                  <th className="px-6 py-4 text-right text-gray-700 dark:text-gray-300">
                    Lines
                  </th>
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">
                    Translator(s)
                  </th>
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">
                    Instructions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                    onClick={(e) => handleRowClick(project.id, e)}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProjects.has(project.id)}
                        onChange={() => handleSelection(project.id)}
                        className="outline-style w-4 h-4 rounded cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`w-3 h-3 rounded ${getSystemColor(
                          project.system
                        )}`}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm">
                        {project.system}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {project.project}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300 text-right">
                      {formatNumber(project.words)}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300 text-right">
                      {formatNumber(project.lines)}
                    </td>
                    <td className="px-6 py-4">
                      {project.translators.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {project.translators.map((translator, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1 text-gray-700 dark:text-gray-300 text-xs md:text-sm"
                            >
                              <UserCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                              <span>{translator}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-xs md:text-sm italic">
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {formatDate(project.dueDate)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs md:text-sm max-w-xs overflow-hidden text-ellipsis">
                      {project.instructions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // CARD VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredProjects.map((project) => {
            const isSelected = selectedProjects.has(project.id);
            return (
              <div
                key={project.id}
                className={`p-6 bg-white dark:bg-gray-800 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-blue-500 shadow-lg"
                    : "border-gray-200 dark:border-gray-700 hover:shadow-lg"
                }`}
                onClick={(e) => {
                  // If clicking directly on the checkbox, let the checkbox's onChange handle it
                  const target = e.target as HTMLElement;
                  if (
                    target.tagName === "INPUT" &&
                    target.getAttribute("type") === "checkbox"
                  ) {
                    return;
                  }
                  handleSelection(project.id);
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelection(project.id)}
                    className="outline-style w-4 h-4 mt-1 rounded cursor-pointer"
                  />
                  <div
                    className={`w-3 h-3 mt-1 rounded shrink-0 ${getSystemColor(
                      project.system
                    )}`}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm mb-2">
                      {project.system}
                    </span>
                  </div>
                </div>

                <h3 className="text-gray-900 dark:text-white mb-4">
                  {project.project}
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      Words
                    </span>
                    <span className="text-gray-900 dark:text-white text-sm">
                      {formatNumber(project.words)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      Lines
                    </span>
                    <span className="text-gray-900 dark:text-white text-sm">
                      {formatNumber(project.lines)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      Due Date
                    </span>
                    <span className="text-gray-900 dark:text-white text-sm">
                      {formatDate(project.dueDate)}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-gray-500 dark:text-gray-400 text-xs block mb-1">
                    Translator(s)
                  </span>
                  {project.translators.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {project.translators.map((translator, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 text-gray-700 dark:text-gray-300 text-xs md:text-sm"
                        >
                          <UserCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span>{translator}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-xs md:text-sm italic">
                      Not assigned
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm max-h-12 overflow-hidden text-ellipsis">
                    {project.instructions}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Button Bar */}
      {selectedProjects.size > 0 && (
        <div
          className="fixed bottom-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 transition-all duration-300"
          style={{ left: "var(--sidebar-width)" }}
        >
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-gray-900 dark:text-white">
                <span className="font-semibold">{selectedProjects.size}</span>{" "}
                project{selectedProjects.size !== 1 ? "s" : ""} selected
              </div>
              <button
                onClick={() => setSelectedProjects(new Set())}
                className="px-4 py-2 cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors border border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-800"
                type="button"
              >
                Clear selection
              </button>
            </div>
            <button
              onClick={handleConfirmSelection}
              className="px-6 py-3 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
              type="button"
            >
              Continue with {selectedProjects.size} project
              {selectedProjects.size !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
