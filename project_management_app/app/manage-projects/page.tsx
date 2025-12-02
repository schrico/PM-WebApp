"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MoreVertical,
  LayoutGrid,
  UserCircle,
  UserPlus,
  UserMinus,
  Copy,
  Edit,
  X,
  CheckCircle,
} from "lucide-react";
import { FilterDropdown } from "@/components/FilterDropdown";
import { ViewToggle } from "@/components/ViewToggle";
import { formatNumber, formatDate } from "@/utils/formatters";
import { getSystemColor } from "@/utils/toChange/systemColors";
import {
  matchesDueDateFilter,
  matchesLengthFilter,
} from "@/utils/filterHelpers";

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
  sourceLanguage?: string;
  targetLanguage?: string;
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
    status: "unclaimed",
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
    status: "inProgress",
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
    status: "inProgress",
    sourceLanguage: "DE-German",
    targetLanguage: "EN-English",
  },
  {
    id: "4",
    system: "B0X",
    project: "Website Localization",
    words: 1800,
    lines: 125,
    translators: ["Anna Kowalski"],
    dueDate: "2025-11-28",
    instructions: "SEO keywords must be maintained",
    status: "ready",
    sourceLanguage: "EN-English",
    targetLanguage: "PT-Portuguese",
  },
  {
    id: "5",
    system: "XTM",
    project: "User Guide Translation",
    words: 3200,
    lines: 240,
    translators: ["Li Wei"],
    dueDate: "2025-11-29",
    instructions: "Maintain formatting",
    status: "ready",
    sourceLanguage: "EN-English",
    targetLanguage: "BR-Brazilian",
  },
  {
    id: "6",
    system: "SSE",
    project: "Product Description Set",
    words: 1500,
    lines: 95,
    translators: [],
    dueDate: "2025-11-28",
    instructions: "Creative adaptation allowed",
    status: "unclaimed",
    sourceLanguage: "EN-English",
    targetLanguage: "ES-Spanish",
  },
  {
    id: "7",
    system: "STM",
    project: "Email Templates",
    words: 950,
    lines: 68,
    translators: ["Ahmed Hassan"],
    dueDate: "2025-11-27",
    instructions: "Keep tone professional yet friendly",
    status: "inProgress",
    sourceLanguage: "EN-English",
    targetLanguage: "DE-German",
  },
  {
    id: "8",
    system: "LAT",
    project: "Annual Report 2024",
    words: 6800,
    lines: 480,
    translators: ["John Smith", "Li Wei"],
    dueDate: "2025-11-30",
    instructions: "Financial terminology check required",
    status: "ready",
    sourceLanguage: "EN-English",
    targetLanguage: "PT-Portuguese",
  },
];

type User = {
  id: string;
  name: string;
  role: string;
  avatar: string;
};

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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProjectStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [removeTranslatorModal, setRemoveTranslatorModal] = useState<{
    open: boolean;
    projectId: string | null;
  }>({ open: false, projectId: null });
  const [addTranslatorModal, setAddTranslatorModal] = useState<{
    open: boolean;
    projectId: string | null;
  }>({ open: false, projectId: null });
  const [selectedTranslators, setSelectedTranslators] = useState<Set<string>>(
    new Set()
  );
  const [translatorMessages, setTranslatorMessages] = useState<
    Record<string, string>
  >({});

  // Filter states
  const [systemFilter, setSystemFilter] = useState<string | null>(null);
  const [dueDateFilter, setDueDateFilter] = useState<string | null>(null);
  const [customDueDate, setCustomDueDate] = useState<string>("");
  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState<
    string | null
  >(null);
  const [sourceLangFilter, setSourceLangFilter] = useState<string | null>(null);
  const [targetLangFilter, setTargetLangFilter] = useState<string | null>(null);
  const [lengthFilter, setLengthFilter] = useState<string | null>(null);
  // const [toolFilter, setToolFilter] = useState<string | null>(null); // commented out

  const handleRowClick = (id: string, e: React.MouseEvent) => {
    // Don't navigate if clicking on a button or menu
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    router.push(`/project/${id}`);
  };

  const handleAddTranslator = (projectId: string) => {
    setOpenMenu(null);
    setAddTranslatorModal({ open: true, projectId });
  };

  const handleRemoveTranslator = (projectId: string) => {
    setOpenMenu(null);
    setRemoveTranslatorModal({ open: true, projectId });
  };

  const handleDuplicate = (projectId: string) => {
    setOpenMenu(null);
    router.push(`/new-project?duplicateFrom=${projectId}`);
  };

  const handleEditDetails = (projectId: string) => {
    setOpenMenu(null);
    router.push(`/project/${projectId}/edit`);
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

  const handleAssignTranslators = () => {
    console.log(
      "Adding translators",
      Array.from(selectedTranslators),
      "to project",
      addTranslatorModal.projectId,
      "with messages",
      translatorMessages
    );
    setAddTranslatorModal({ open: false, projectId: null });
    setSelectedTranslators(new Set());
    setTranslatorMessages({});
  };

  const handleCompleteProject = (projectId: string) => {
    setOpenMenu(null);
    console.log(`Marking project ${projectId} as complete`);
  };

  const clearAllFilters = () => {
    setSystemFilter(null);
    setDueDateFilter(null);
    setCustomDueDate("");
    setAssignmentStatusFilter(null);
    setSourceLangFilter(null);
    setTargetLangFilter(null);
    setLengthFilter(null);
    // setToolFilter(null); // commented out
  };

  const hasActiveFilters =
    systemFilter ||
    dueDateFilter ||
    assignmentStatusFilter ||
    sourceLangFilter ||
    targetLangFilter ||
    lengthFilter; // toolFilter commented out

  // Sort projects by due date (earliest to latest)
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const filteredProjects = sortedProjects.filter((project) => {
    // Tab filter
    if (activeTab !== "all" && project.status !== activeTab) return false;

    // Search filter
    if (
      searchTerm &&
      !project.project.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // System filter
    if (systemFilter && project.system !== systemFilter) {
      return false;
    }

    // Due date filter
    if (
      dueDateFilter &&
      !matchesDueDateFilter(
        project.dueDate,
        dueDateFilter,
        customDueDate || undefined
      )
    ) {
      return false;
    }

    // Assignment status filter
    if (
      assignmentStatusFilter === "Unassigned" &&
      project.translators.length > 0
    ) {
      return false;
    }
    if (
      assignmentStatusFilter === "Assigned" &&
      project.translators.length === 0
    ) {
      return false;
    }

    // Source language filter
    if (sourceLangFilter && project.sourceLanguage !== sourceLangFilter) {
      return false;
    }

    // Target language filter
    if (targetLangFilter && project.targetLanguage !== targetLangFilter) {
      return false;
    }

    // Length filter
    if (lengthFilter && !matchesLengthFilter(project.words, lengthFilter)) {
      return false;
    }

    // Tool filter - commented out as requested
    // if (toolFilter && project.tool !== toolFilter) {
    //   return false;
    // }

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
                className={`pb-3 cursor-pointer border-b-2 transition-colors whitespace-nowrap ${
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

        {/* Individual Filter Dropdowns */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-wrap gap-3 items-start">
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
              label="Assignment Status"
              options={["Unassigned", "Assigned"]}
              selected={assignmentStatusFilter}
              onSelect={setAssignmentStatusFilter}
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
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer"
                      onClick={(e) => handleRowClick(project.id, e)}
                    >
                      <td className="px-6 py-4">
                        <div
                          className={`w-3 h-3 rounded ${getSystemColor(
                            project.system
                          )}`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-blue-400 text-sm">
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
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenu(
                                openMenu === project.id ? null : project.id
                              )
                            }
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer hover:shadow-lg"
                            type="button"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors" />
                          </button>
                          {openMenu === project.id && (
                            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                              {(activeTab === "all" ||
                                activeTab === "ready") && (
                                <button
                                  className="w-full cursor-pointer px-4 py-2.5 text-left text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors first:rounded-t-lg flex items-center gap-2 border-b border-gray-200 dark:border-gray-700"
                                  onClick={() =>
                                    handleCompleteProject(project.id)
                                  }
                                  type="button"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Complete Project
                                </button>
                              )}
                              <button
                                className="w-full cursor-pointer px-4 py-2.5 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg flex items-center gap-2"
                                onClick={() => handleAddTranslator(project.id)}
                                type="button"
                              >
                                <UserPlus className="w-4 h-4" />
                                Add translator
                              </button>
                              <button
                                className="w-full cursor-pointer px-4 py-2.5 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-2"
                                onClick={() =>
                                  handleRemoveTranslator(project.id)
                                }
                                type="button"
                              >
                                <UserMinus className="w-4 h-4" />
                                Remove a translator
                              </button>
                              <button
                                className="w-full cursor-pointer px-4 py-2.5 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                                onClick={() => handleDuplicate(project.id)}
                                type="button"
                              >
                                <Copy className="w-4 h-4" />
                                Duplicate Project
                              </button>
                              <button
                                className="w-full cursor-pointer px-4 py-2.5 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors last:rounded-b-lg flex items-center gap-2"
                                onClick={() => handleEditDetails(project.id)}
                                type="button"
                              >
                                <Edit className="w-4 h-4" />
                                Edit Details
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
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-lg dark:hover:shadow-blue-500/20 dark:hover:border-blue-500/50 transition-all"
              onClick={(e) => handleRowClick(project.id, e)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded ${getSystemColor(
                      project.system
                    )}`}
                  />
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-blue-400 text-xs md:text-sm ml-2">
                    {project.system}
                  </span>
                </div>
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === project.id ? null : project.id)
                    }
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer rounded-lg transition-colors hover:shadow-md"
                    type="button"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors" />
                  </button>
                  {openMenu === project.id && (
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                      {(activeTab === "all" || activeTab === "ready") && (
                        <button
                          className="w-full cursor-pointer px-4 py-2.5 text-left text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors first:rounded-t-lg flex items-center gap-2 border-b border-gray-200 dark:border-gray-700"
                          onClick={() => handleCompleteProject(project.id)}
                          type="button"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Complete Project
                        </button>
                      )}
                      <button
                        className="w-full cursor-pointer px-4 py-2.5 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg flex items-center gap-2"
                        onClick={() => handleAddTranslator(project.id)}
                        type="button"
                      >
                        <UserPlus className="w-4 h-4" />
                        Add translator
                      </button>
                      <button
                        className="w-full cursor-pointer px-4 py-2.5 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                        onClick={() => handleRemoveTranslator(project.id)}
                        type="button"
                      >
                        <UserMinus className="w-4 h-4" />
                        Remove a translator
                      </button>
                      <button
                        className="w-full cursor-pointer px-4 py-2.5 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                        onClick={() => handleDuplicate(project.id)}
                        type="button"
                      >
                        <Copy className="w-4 h-4" />
                        Duplicate
                      </button>
                      <button
                        className="w-full cursor-pointer px-4 py-2.5 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors last:rounded-b-lg flex items-center gap-2"
                        onClick={() => handleEditDetails(project.id)}
                        type="button"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Details
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

      {/* Remove Translator Modal */}
      {removeTranslatorModal.open &&
        removeTranslatorModal.projectId &&
        (() => {
          const project = projects.find(
            (p) => p.id === removeTranslatorModal.projectId
          );
          return (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() =>
                setRemoveTranslatorModal({ open: false, projectId: null })
              }
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-900 dark:text-white">
                    Remove Translator
                  </h2>
                  <button
                    onClick={() =>
                      setRemoveTranslatorModal({ open: false, projectId: null })
                    }
                    className="p-1 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                    type="button"
                  >
                    <X className="text-gray-500 dark:text-gray-400 text-xl leading-none" />
                  </button>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Select a translator to remove from{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {project?.project}
                  </span>
                  :
                </p>

                {project && project.translators.length > 0 ? (
                  <div className="space-y-2 mb-6">
                    {project.translators.map((translator, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          console.log(
                            `Removing ${translator} from project ${project.id}`
                          );
                          setRemoveTranslatorModal({
                            open: false,
                            projectId: null,
                          });
                        }}
                        className="w-full cursor-pointer flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 rounded-lg transition-colors text-left group"
                        type="button"
                      >
                        <UserCircle className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-red-500" />
                        <span className="text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
                          {translator}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 italic">
                    No translators assigned to this project.
                  </p>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() =>
                      setRemoveTranslatorModal({ open: false, projectId: null })
                    }
                    className="px-4 py-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* Add Translator Modal */}
      {addTranslatorModal.open &&
        addTranslatorModal.projectId &&
        (() => {
          const project = projects.find(
            (p) => p.id === addTranslatorModal.projectId
          );
          return (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => {
                setAddTranslatorModal({ open: false, projectId: null });
                setSelectedTranslators(new Set());
                setTranslatorMessages({});
              }}
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-gray-900 dark:text-white">
                      Add Translator
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      Select translators to add to{" "}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {project?.project}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAddTranslatorModal({ open: false, projectId: null });
                      setSelectedTranslators(new Set());
                      setTranslatorMessages({});
                    }}
                    className="p-1 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                    type="button"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Translator Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {users.map((user) => {
                    const isSelected = selectedTranslators.has(user.id);
                    return (
                      <div
                        key={user.id}
                        className={`p-4 bg-white dark:bg-gray-800 rounded-xl border transition-all duration-200 ${
                          isSelected
                            ? "border-blue-500 shadow-lg"
                            : "border-gray-200 dark:border-gray-700 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleTranslatorToggle(user.id)}
                            className="outline-style w-5 h-5 mt-1 rounded"
                          />
                          <div className="flex flex-col items-center text-center flex-1">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white mb-2">
                              {user.avatar}
                            </div>
                            <h3 className="text-gray-900 dark:text-white text-sm">
                              {user.name}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">
                              {user.role}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <label className="block text-gray-700 dark:text-gray-300 text-xs mb-1">
                              Instructions (optional)
                            </label>
                            <textarea
                              value={translatorMessages[user.id] || ""}
                              onChange={(e) =>
                                handleMessageChange(user.id, e.target.value)
                              }
                              placeholder="Add special instructions..."
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                              rows={2}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center gap-4">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {selectedTranslators.size} translator
                    {selectedTranslators.size !== 1 ? "s" : ""} selected
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setAddTranslatorModal({ open: false, projectId: null });
                        setSelectedTranslators(new Set());
                        setTranslatorMessages({});
                      }}
                      className="px-4 py-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAssignTranslators}
                      disabled={selectedTranslators.size === 0}
                      className="px-6 py-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      type="button"
                    >
                      Add {selectedTranslators.size} Translator
                      {selectedTranslators.size !== 1 ? "s" : ""}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
