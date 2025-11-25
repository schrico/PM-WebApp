import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { FilterDropdown } from '../FilterDropdown';
import { formatNumber, formatDate } from '../../utils/formatters';
import { getSystemColor } from '../../utils/systemColors';
import { ViewToggle } from '../ViewToggle';

type Project = {
  id: string;
  system: string;
  project: string;
  translators: string[];
  dueDate: string;
  instructions: string;
  invoiced: boolean;
  paid: boolean;
  status: 'all' | 'toBeInvoiced' | 'toBePaid';
};

const projects: Project[] = [
  { id: '1', system: 'B0X', project: 'Marketing Campaign Q4', translators: [], dueDate: '2025-11-25', instructions: 'Follow brand guidelines', invoiced: false, paid: false, status: 'toBeInvoiced' },
  { id: '2', system: 'XTM', project: 'Legal Contract Translation', translators: ['John Smith'], dueDate: '2025-11-22', instructions: 'Certified translation required', invoiced: true, paid: false, status: 'toBePaid' },
  { id: '3', system: 'SSE', project: 'Technical Manual v2.3', translators: ['Maria Garcia', 'Jean Dupont'], dueDate: '2025-11-28', instructions: 'Use glossary provided', invoiced: true, paid: true, status: 'all' },
  { id: '4', system: 'B0X', project: 'Website Localization', translators: ['Anna Kowalski'], dueDate: '2025-11-24', instructions: 'SEO keywords must be maintained', invoiced: false, paid: false, status: 'toBeInvoiced' },
  { id: '5', system: 'XTM', project: 'User Guide Translation', translators: ['Li Wei'], dueDate: '2025-11-20', instructions: 'Maintain formatting', invoiced: true, paid: false, status: 'toBePaid' },
  { id: '6', system: 'SSE', project: 'Product Description Set', translators: [], dueDate: '2025-11-21', instructions: 'Creative adaptation allowed', invoiced: false, paid: false, status: 'toBeInvoiced' },
  { id: '7', system: 'STM', project: 'Email Templates', translators: ['Ahmed Hassan'], dueDate: '2025-11-19', instructions: 'Keep tone professional yet friendly', invoiced: true, paid: true, status: 'all' },
  { id: '8', system: 'LAT', project: 'Annual Report 2024', translators: ['John Smith', 'Li Wei'], dueDate: '2025-11-30', instructions: 'Financial terminology check required', invoiced: true, paid: false, status: 'toBePaid' },
];

type TabType = 'all' | 'toBeInvoiced' | 'toBePaid';

export function Invoicing({ sidebarCollapsed = false }: { sidebarCollapsed?: boolean }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  
  // Filter states
  const [systemFilter, setSystemFilter] = useState<string | null>(null);
  const [dueDateFilter, setDueDateFilter] = useState<string | null>(null);
  const [customDueDate, setCustomDueDate] = useState<string>('');
  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState<string | null>(null);
  const [sourceLanguageFilter, setSourceLanguageFilter] = useState<string | null>(null);
  const [targetLanguageFilter, setTargetLanguageFilter] = useState<string | null>(null);
  const [lengthFilter, setLengthFilter] = useState<string | null>(null);
  const [toolFilter, setToolFilter] = useState<string | null>(null);

  const handleRowClick = (id: string, e: React.MouseEvent) => {
    // Select the project instead of navigating
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

  const handleConfirmInvoiced = () => {
    console.log('Confirming invoiced for projects:', Array.from(selectedProjects));
    setSelectedProjects(new Set());
  };

  const handleConfirmPaid = () => {
    console.log('Confirming paid for projects:', Array.from(selectedProjects));
    setSelectedProjects(new Set());
  };

  const clearAllFilters = () => {
    setSystemFilter(null);
    setDueDateFilter(null);
    setCustomDueDate('');
    setAssignmentStatusFilter(null);
    setSourceLanguageFilter(null);
    setTargetLanguageFilter(null);
    setLengthFilter(null);
    setToolFilter(null);
  };

  const hasActiveFilters = systemFilter || dueDateFilter || assignmentStatusFilter || sourceLanguageFilter || targetLanguageFilter || lengthFilter || toolFilter;

  // Sort projects by due date (earliest to latest)
  const sortedProjects = [...projects].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const filteredProjects = sortedProjects.filter(project => {
    if (activeTab === 'toBeInvoiced') return !project.invoiced;
    if (activeTab === 'toBePaid') return project.invoiced && !project.paid;
    return true; // 'all' tab
  });

  const tabs = [
    { id: 'all' as TabType, label: 'All Projects', count: projects.length },
    { id: 'toBeInvoiced' as TabType, label: 'To be Invoiced', count: projects.filter(p => !p.invoiced).length },
    { id: 'toBePaid' as TabType, label: 'To Be Paid', count: projects.filter(p => p.invoiced && !p.paid).length },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">
          Invoicing & Payments
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track and manage invoicing and payment status for all projects
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-end justify-between">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedProjects(new Set());
                }}
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
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-wrap gap-3 items-start">
            <FilterDropdown
              label="System"
              options={['B0X', 'XTM', 'SSE', 'STM', 'LAT']}
              selected={systemFilter}
              onSelect={setSystemFilter}
            />
            <FilterDropdown
              label="Due Date"
              options={['Today', 'In 1 day', 'In 3 days', 'In a week', 'In a month', 'Custom date']}
              selected={dueDateFilter}
              onSelect={setDueDateFilter}
              customDateValue={customDueDate}
              onCustomDateChange={setCustomDueDate}
            />
            <FilterDropdown
              label="Assignment Status"
              options={['Unassigned', 'Assigned']}
              selected={assignmentStatusFilter}
              onSelect={setAssignmentStatusFilter}
            />
            <FilterDropdown
              label="Source Language"
              options={['EN-English', 'DE-German', 'BR-Brazilian', 'PT-Portuguese', 'ES-Spanish']}
              selected={sourceLanguageFilter}
              onSelect={setSourceLanguageFilter}
            />
            <FilterDropdown
              label="Target Language"
              options={['EN-English', 'DE-German', 'BR-Brazilian', 'PT-Portuguese', 'ES-Spanish']}
              selected={targetLanguageFilter}
              onSelect={setTargetLanguageFilter}
            />
            <FilterDropdown
              label="Length"
              options={['Short', 'Long']}
              selected={lengthFilter}
              onSelect={setLengthFilter}
            />
            <FilterDropdown
              label="Tool"
              options={['C-User', 'TE-User']}
              selected={toolFilter}
              onSelect={setToolFilter}
            />
          </div>
          
          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-black text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 transition-all flex items-center gap-2 text-sm shadow-sm flex-shrink-0"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table or Card View */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <th className="px-6 py-4 w-4"></th>
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300 w-12"></th>
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">System</th>
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Project</th>
                  <th className="px-6 py-4 text-center text-gray-700 dark:text-gray-300">Invoiced</th>
                  <th className="px-6 py-4 text-center text-gray-700 dark:text-gray-300">Paid</th>
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Translator(s)</th>
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Due Date</th>
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Instructions</th>
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
                        className="outline-style w-4 h-4 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className={`w-3 h-3 rounded ${getSystemColor(project.system)}`} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm">
                        {project.system}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{project.project}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm ${
                        project.invoiced 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {project.invoiced ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm ${
                        project.paid 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {project.paid ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {project.translators.length > 0 ? (
                        <div className="flex flex-wrap gap-1 text-gray-700 dark:text-gray-300 text-sm">
                          {project.translators.join(', ')}
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm italic">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{formatDate(project.dueDate)}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm max-w-xs truncate">{project.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredProjects.map((project) => {
            const isSelected = selectedProjects.has(project.id);
            return (
              <div
                key={project.id}
                className={`p-6 bg-white dark:bg-gray-800 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 shadow-lg dark:shadow-blue-500/20'
                    : 'border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-blue-500/20 dark:hover:border-blue-500/50'
                }`}
                onClick={() => handleSelection(project.id)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelection(project.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="outline-style w-4 h-4 mt-1 rounded"
                  />
                  <div className={`w-3 h-3 mt-1 rounded flex-shrink-0 ${getSystemColor(project.system)}`} />
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
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Invoiced</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm ${
                      project.invoiced 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {project.invoiced ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Paid</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm ${
                      project.paid 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {project.paid ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Due Date</span>
                    <span className="text-gray-900 dark:text-white">{formatDate(project.dueDate)}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-gray-500 dark:text-gray-400 text-sm block mb-1">Translator(s)</span>
                  {project.translators.length > 0 ? (
                    <div className="text-gray-700 dark:text-gray-300 text-sm">
                      {project.translators.join(', ')}
                    </div>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-sm italic">Not assigned</span>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{project.instructions}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Button Bar */}
      {selectedProjects.size > 0 && (
        <div className={`fixed bottom-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 transition-all duration-300 ${sidebarCollapsed ? 'left-20' : 'left-64'}`}>
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-gray-900 dark:text-white">
                <span className="font-semibold">{selectedProjects.size}</span> project{selectedProjects.size !== 1 ? 's' : ''} selected
              </div>
              <button
                onClick={() => setSelectedProjects(new Set())}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors border border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-800"
              >
                Clear selection
              </button>
            </div>
            <div className="flex gap-3">
              {(activeTab === 'all' || activeTab === 'toBeInvoiced') && (
                <button
                  onClick={handleConfirmInvoiced}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  Confirm Invoiced
                </button>
              )}
              {(activeTab === 'all' || activeTab === 'toBePaid') && (
                <button
                  onClick={handleConfirmPaid}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  Confirm Paid
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}