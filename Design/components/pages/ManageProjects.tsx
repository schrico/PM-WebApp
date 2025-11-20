import { useState } from 'react';
import { Search, MoreVertical, LayoutGrid, UserCircle } from 'lucide-react';
import { FilterDropdown } from '../FilterDropdown';
import { formatNumber, formatDate } from '../../utils/formatters';
import { getSystemColor } from '../../utils/systemColors';
import { ViewToggle } from '../ViewToggle';

type Project = {
  id: string;
  system: string;
  project: string;
  words: number;
  lines: number;
  translators: string[];
  dueDate: string;
  instructions: string;
  status: 'all' | 'ready' | 'inProgress' | 'unclaimed';
};

const projects: Project[] = [
  { id: '1', system: 'Phrase', project: 'Marketing Campaign Q4', words: 2500, lines: 180, translators: [], dueDate: '2025-11-25', instructions: 'Follow brand guidelines', status: 'unclaimed' },
  { id: '2', system: 'Trados', project: 'Legal Contract Translation', words: 4200, lines: 310, translators: ['John Smith'], dueDate: '2025-11-22', instructions: 'Certified translation required', status: 'inProgress' },
  { id: '3', system: 'MemoQ', project: 'Technical Manual v2.3', words: 8900, lines: 650, translators: ['Maria Garcia', 'Jean Dupont'], dueDate: '2025-11-28', instructions: 'Use glossary provided', status: 'inProgress' },
  { id: '4', system: 'Phrase', project: 'Website Localization', words: 1800, lines: 125, translators: ['Anna Kowalski'], dueDate: '2025-11-24', instructions: 'SEO keywords must be maintained', status: 'ready' },
  { id: '5', system: 'Trados', project: 'User Guide Translation', words: 3200, lines: 240, translators: ['Li Wei'], dueDate: '2025-11-20', instructions: 'Maintain formatting', status: 'ready' },
  { id: '6', system: 'MemoQ', project: 'Product Description Set', words: 1500, lines: 95, translators: [], dueDate: '2025-11-21', instructions: 'Creative adaptation allowed', status: 'unclaimed' },
  { id: '7', system: 'Phrase', project: 'Email Templates', words: 950, lines: 68, translators: ['Ahmed Hassan'], dueDate: '2025-11-19', instructions: 'Keep tone professional yet friendly', status: 'inProgress' },
  { id: '8', system: 'Trados', project: 'Annual Report 2024', words: 6800, lines: 480, translators: ['John Smith', 'Li Wei'], dueDate: '2025-11-30', instructions: 'Financial terminology check required', status: 'ready' },
];

type TabType = 'all' | 'ready' | 'inProgress' | 'unclaimed';

export function ManageProjects() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  
  // Filter states
  const [systemFilter, setSystemFilter] = useState<string | null>(null);
  const [deadlineFilter, setDeadlineFilter] = useState<string | null>(null);
  const [sourceLangFilter, setSourceLangFilter] = useState<string | null>(null);
  const [targetLangFilter, setTargetLangFilter] = useState<string | null>(null);
  const [lengthFilter, setLengthFilter] = useState<string | null>(null);
  const [toolFilter, setToolFilter] = useState<string | null>(null);

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'all') return true;
    return project.status === activeTab;
  });

  const tabs = [
    { id: 'all' as TabType, label: 'All Projects', count: projects.length },
    { id: 'ready' as TabType, label: 'Ready to Go', count: projects.filter(p => p.status === 'ready').length },
    { id: 'inProgress' as TabType, label: 'In Progress', count: projects.filter(p => p.status === 'inProgress').length },
    { id: 'unclaimed' as TabType, label: 'Awaiting Assignment', count: projects.filter(p => p.status === 'unclaimed').length },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">
          Manage Projects
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Complete oversight of all translation projects and their status
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-end justify-between">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
          
          <div className="mb-3 flex flex-col items-center gap-1">
            <span className="text-gray-500 dark:text-gray-400 text-xs">View</span>
            <ViewToggle view={viewMode} onViewChange={setViewMode} />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
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
        <div className="flex flex-wrap gap-3">
          <FilterDropdown
            label="System"
            options={['Phrase', 'Trados', 'MemoQ']}
            selected={systemFilter}
            onSelect={setSystemFilter}
          />
          <FilterDropdown
            label="Deadline"
            options={['This Week', 'Next Week', 'This Month', 'Overdue']}
            selected={deadlineFilter}
            onSelect={setDeadlineFilter}
          />
          <FilterDropdown
            label="Source Language"
            options={['English', 'Spanish', 'French', 'German', 'Chinese']}
            selected={sourceLangFilter}
            onSelect={setSourceLangFilter}
          />
          <FilterDropdown
            label="Target Language"
            options={['English', 'Spanish', 'French', 'German', 'Chinese']}
            selected={targetLangFilter}
            onSelect={setTargetLangFilter}
          />
          <FilterDropdown
            label="Length"
            options={['Short (<2000)', 'Medium (2000-5000)', 'Long (>5000)']}
            selected={lengthFilter}
            onSelect={setLengthFilter}
          />
          <FilterDropdown
            label="Tool"
            options={['CAT Tool', 'Manual', 'MT Post-editing']}
            selected={toolFilter}
            onSelect={setToolFilter}
          />
        </div>
      </div>

      {/* Table or Card View */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <th className="px-6 py-4 w-4"></th>
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">System</th>
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Project</th>
                  <th className="px-6 py-4 text-right text-gray-700 dark:text-gray-300">Words</th>
                  <th className="px-6 py-4 text-right text-gray-700 dark:text-gray-300">Lines</th>
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Translator(s)</th>
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Due Date</th>
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Instructions</th>
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`w-3 h-3 rounded ${getSystemColor(project.system)}`} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-blue-400 text-sm">
                          {project.system}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{project.project}</td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300 text-right">{formatNumber(project.words)}</td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300 text-right">{formatNumber(project.lines)}</td>
                      <td className="px-6 py-4">
                        {project.translators.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {project.translators.map((translator, idx) => (
                              <div key={idx} className="flex items-center gap-1 text-gray-700 dark:text-gray-300 text-sm">
                                <UserCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                <span>{translator}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 text-sm italic">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{formatDate(project.dueDate)}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm max-w-xs truncate">{project.instructions}</td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenu(openMenu === project.id ? null : project.id)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </button>
                          {openMenu === project.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                              <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg">
                                Edit Details
                              </button>
                              <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                Reassign
                              </button>
                              <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                View Full Details
                              </button>
                              <button className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors last:rounded-b-lg">
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
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <LayoutGrid className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">No projects found in this category</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">Try adjusting your filters or check another tab</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded ${getSystemColor(project.system)}`} />
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-blue-400 text-sm ml-2">
                    {project.system}
                  </span>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === project.id ? null : project.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  {openMenu === project.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                      <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg">
                        Edit Details
                      </button>
                      <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Reassign
                      </button>
                      <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        View Full Details
                      </button>
                      <button className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors last:rounded-b-lg">
                        Delete Project
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-gray-900 dark:text-white text-sm font-bold mt-2">{project.project}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Words: {formatNumber(project.words)}, Lines: {formatNumber(project.lines)}</p>
              <div className="mt-2">
                {project.translators.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {project.translators.map((translator, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-gray-700 dark:text-gray-300 text-sm">
                        <UserCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span>{translator}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500 text-sm italic">Not assigned</span>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">Due Date: {formatDate(project.dueDate)}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs truncate mt-1">Instructions: {project.instructions}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}