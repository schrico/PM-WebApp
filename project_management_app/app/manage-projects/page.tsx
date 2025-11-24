"use client";

import { useRef, useState } from "react";
import { Search, MoreVertical, LayoutGrid, UserCircle } from "lucide-react";
import { FilterDropdown } from "@/components/FilterDropdown";
import { ViewToggle } from "@/components/ViewToggle";
import { formatNumber, formatDate } from "@/utils/formatters";
import { getSystemColor } from "@/utils/toChange/systemColors";

type ProjectStatus = "all" | "ready" | "inProgress" | "unclaimed";

type Project = {
  id: string;
  system: string;
  project: string;
  words: number;
  lines: number;
  translators: string[];
  dueDate: string; // ISO date string
  instructions: string;
  status: ProjectStatus;
};

const projects: Project[] = [
  {
    id: "1",
    system: "Phrase",
    project: "Marketing Campaign Q4",
    words: 2500,
    lines: 180,
    translators: [],
    dueDate: "2025-11-25",
    instructions: "Follow brand guidelines",
    status: "unclaimed",
  },
  {
    id: "2",
    system: "Trados",
    project: "Legal Contract Translation",
    words: 4200,
    lines: 310,
    translators: ["John Smith"],
    dueDate: "2025-11-22",
    instructions: "Certified translation required",
    status: "inProgress",
  },
  {
    id: "3",
    system: "MemoQ",
    project: "Technical Manual v2.3",
    words: 8900,
    lines: 650,
    translators: ["Maria Garcia", "Jean Dupont"],
    dueDate: "2025-11-28",
    instructions: "Use glossary provided",
    status: "inProgress",
  },
  {
    id: "4",
    system: "Phrase",
    project: "Website Localization",
    words: 1800,
    lines: 125,
    translators: ["Anna Kowalski"],
    dueDate: "2025-11-24",
    instructions: "SEO keywords must be maintained",
    status: "ready",
  },
  {
    id: "5",
    system: "Trados",
    project: "User Guide Translation",
    words: 3200,
    lines: 240,
    translators: ["Li Wei"],
    dueDate: "2025-11-20",
    instructions: "Maintain formatting",
    status: "ready",
  },
  {
    id: "6",
    system: "MemoQ",
    project: "Product Description Set",
    words: 1500,
    lines: 95,
    translators: [],
    dueDate: "2025-11-21",
    instructions: "Creative adaptation allowed",
    status: "unclaimed",
  },
  {
    id: "7",
    system: "Phrase",
    project: "Email Templates",
    words: 950,
    lines: 68,
    translators: ["Ahmed Hassan"],
    dueDate: "2025-11-19",
    instructions: "Keep tone professional yet friendly",
    status: "inProgress",
  },
  {
    id: "8",
    system: "Trados",
    project: "Annual Report 2024",
    words: 6800,
    lines: 480,
    translators: ["John Smith", "Li Wei"],
    dueDate: "2025-11-30",
    instructions: "Financial terminology check required",
    status: "ready",
  },
];

const tabs: { id: ProjectStatus; label: string; count: number }[] = [
  { id: "all", label: "All Projects", count: projects.length },
  {
    id: "ready",
    label: "Ready to Go",
    count: projects.filter((p) => p.status === "ready").length,
  },
  {
    id: "inProgress",
    label: "In Progress",
    count: projects.filter((p) => p.status === "inProgress").length,
  },
  {
    id: "unclaimed",
    label: "Awaiting Assignment",
    count: projects.filter((p) => p.status === "unclaimed").length,
  },
];



export default function ManageProjectsPage() {
  const [activeTab, setActiveTab] = useState<ProjectStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // Filter states (hooked up to UI; you can wire them to real backend data later)
  const [systemFilter, setSystemFilter] = useState<string | null>(null);
  const [deadlineFilter, setDeadlineFilter] = useState<string | null>(null);
  const [sourceLangFilter, setSourceLangFilter] = useState<string | null>(null);
  const [targetLangFilter, setTargetLangFilter] = useState<string | null>(null);
  const [lengthFilter, setLengthFilter] = useState<string | null>(null);
  const [toolFilter, setToolFilter] = useState<string | null>(null);

  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpenMenu(null);
    }, 300);
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }
  

  const filteredProjects = projects.filter((project) => {
    if (activeTab !== "all" && project.status !== activeTab) return false;

    if (
      searchTerm &&
      !project.project.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Future: hook systemFilter / deadlineFilter / etc. to real data semantics
    // For now, they just change UI state, not filtering logic.

    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Manage Projects</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Complete oversight of all translation projects and their status
        </p>
      </div>

      {/* Tabs + View Toggle */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-end justify-between">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                type="button"
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="mb-3 flex flex-col items-center gap-1">
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              View
            </span>
            <ViewToggle view={viewMode} onViewChange={setViewMode} />
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by project name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <FilterDropdown
            label="System"
            options={["Phrase", "Trados", "MemoQ"]}
            selected={systemFilter}
            onSelect={setSystemFilter}
          />
          <FilterDropdown
            label="Deadline"
            options={["This Week", "Next Week", "This Month", "Overdue"]}
            selected={deadlineFilter}
            onSelect={setDeadlineFilter}
          />
          <FilterDropdown
            label="Source Language"
            options={["English", "Spanish", "French", "German", "Chinese"]}
            selected={sourceLangFilter}
            onSelect={setSourceLangFilter}
          />
          <FilterDropdown
            label="Target Language"
            options={["English", "Spanish", "French", "German", "Chinese"]}
            selected={targetLangFilter}
            onSelect={setTargetLangFilter}
          />
          <FilterDropdown
            label="Length"
            options={["Short (<2000)", "Medium (2000-5000)", "Long (>5000)"]}
            selected={lengthFilter}
            onSelect={setLengthFilter}
          />
          <FilterDropdown
            label="Tool"
            options={["CAT Tool", "Manual", "MT Post-editing"]}
            selected={toolFilter}
            onSelect={setToolFilter}
          />
        </div>
      </div>

      {/* Table or Card View */}
      {viewMode === "table" ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <th className="px-6 py-4 w-4" />
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
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div
                          className={`w-3 h-3 rounded ${getSystemColor(project.system)}`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-blue-400 text-xs md:text-sm">
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
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs md:text-sm max-w-xs truncate">
                        {project.instructions}
                      </td>
                      <td className="px-6 py-4">
                        <div 
                          className="relative"
                          onMouseEnter={cancelClose}
                          onMouseLeave={scheduleClose}
                        >
                          <button
                            onClick={() =>
                              setOpenMenu(
                                openMenu === project.id ? null : project.id,
                              )
                            }
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 hover:scale-[1.2] rounded-lg transition-colors"
                            type="button"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-800 dark:text-gray-400" />
                          </button>
                          {openMenu === project.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                              <button
                                className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg"
                                type="button"
                              >
                                Edit Details
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                type="button"
                              >
                                Reassign
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                type="button"
                              >
                                View Full Details
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors last:rounded-b-lg"
                                type="button"
                              >
                                Delete Project
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <LayoutGrid className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                          No projects found in this category
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">
                          Try adjusting your filters or check another tab
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // CARD VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded ${getSystemColor(project.system)}`}
                  />
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-blue-400 text-xs md:text-sm ml-2">
                    {project.system}
                  </span>
                </div>
                <div 
                  className="relative"
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    onClick={() =>
                      setOpenMenu(
                        openMenu === project.id ? null : project.id,
                      )
                    }
                    className="p-2 hover:bg-gray-50 dark:hover:bg-gray-900 hover:scale-[1.2] rounded-lg transition-colors"
                    type="button"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-800 dark:text-gray-400" />
                  </button>
                  {openMenu === project.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                      <button
                        className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg"
                        type="button"
                      >
                        Edit Details
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        type="button"
                      >
                        Reassign
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        type="button"
                      >
                        View Full Details
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors last:rounded-b-lg"
                        type="button"
                      >
                        Delete Project
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-gray-900 dark:text-white text-sm font-bold mt-2">
                {project.project}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Words: {formatNumber(project.words)}, Lines:{" "}
                {formatNumber(project.lines)}
              </p>

              <div className="mt-2">
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

              <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm mt-2">
                Due Date: {formatDate(project.dueDate)}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm max-w-xs truncate mt-1">
                Instructions: {project.instructions}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
