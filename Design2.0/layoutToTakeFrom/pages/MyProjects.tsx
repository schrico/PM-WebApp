import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { formatNumber, formatDate } from '../../utils/formatters';
import { getSystemColor } from '../../utils/systemColors';
import { ViewToggle } from '../ViewToggle';

type Project = {
  id: string;
  system: string;
  project: string;
  words: number;
  lines: number;
  dueDate: string;
  instructions: string;
};

const unclaimedProjects: Project[] = [
  { id: '1', system: 'Phrase', project: 'Marketing Campaign Q4', words: 2500, lines: 180, dueDate: '2025-11-25', instructions: 'Follow brand guidelines' },
  { id: '2', system: 'Trados', project: 'Legal Contract Translation', words: 4200, lines: 310, dueDate: '2025-11-22', instructions: 'Certified translation required' },
  { id: '3', system: 'MemoQ', project: 'Technical Manual v2.3', words: 8900, lines: 650, dueDate: '2025-11-28', instructions: 'Use glossary provided' },
  { id: '4', system: 'Phrase', project: 'Website Localization', words: 1800, lines: 125, dueDate: '2025-11-24', instructions: 'SEO keywords must be maintained' },
];

const inProgressProjects: Project[] = [
  { id: '5', system: 'Trados', project: 'User Guide Translation', words: 3200, lines: 240, dueDate: '2025-11-20', instructions: 'Maintain formatting' },
  { id: '6', system: 'MemoQ', project: 'Product Description Set', words: 1500, lines: 95, dueDate: '2025-11-21', instructions: 'Creative adaptation allowed' },
  { id: '7', system: 'Phrase', project: 'Email Templates', words: 950, lines: 68, dueDate: '2025-11-19', instructions: 'Keep tone professional yet friendly' },
];

export function MyProjects() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'unclaimed' | 'inProgress'>('unclaimed');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  const handleClaim = (id: string) => {
    console.log('Claiming project:', id);
  };

  const handleRefuse = (id: string) => {
    console.log('Refusing project:', id);
  };

  const handleDone = (id: string) => {
    console.log('Marking project as done:', id);
  };

  const handleRowClick = (id: string, e: React.MouseEvent) => {
    // Don't navigate if clicking on a button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/project/${id}`);
  };

  // Sort projects by due date (earliest to latest)
  const sortedUnclaimedProjects = [...unclaimedProjects].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const sortedInProgressProjects = [...inProgressProjects].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const currentProjects = activeTab === 'unclaimed' ? sortedUnclaimedProjects : sortedInProgressProjects;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">
          My Projects
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Claim new assignments or mark your work as complete
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-end justify-between">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('unclaimed')}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === 'unclaimed'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Available to Claim ({unclaimedProjects.length})
            </button>
            <button
              onClick={() => setActiveTab('inProgress')}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === 'inProgress'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              In Progress ({inProgressProjects.length})
            </button>
          </div>
          
          <div className="mb-3 flex flex-col items-center gap-1">
            <span className="text-gray-500 dark:text-gray-400 text-xs">View</span>
            <ViewToggle view={viewMode} onViewChange={setViewMode} />
          </div>
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
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Due Date</th>
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Instructions</th>
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentProjects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer" onClick={(e) => handleRowClick(project.id, e)}>
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
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{formatDate(project.dueDate)}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm max-w-xs truncate">{project.instructions}</td>
                    <td className="px-6 py-4">
                      {activeTab === 'unclaimed' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleClaim(project.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-all text-sm hover:bg-blue-500 hover:text-white border border-gray-200 dark:border-gray-600 shadow-sm"
                          >
                            <Check className="w-4 h-4" />
                            Claim
                          </button>
                          <button
                            onClick={() => handleRefuse(project.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-all text-sm hover:bg-red-500 hover:text-white border border-gray-200 dark:border-gray-600 shadow-sm"
                          >
                            <X className="w-4 h-4" />
                            Refuse
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDone(project.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-all text-sm hover:bg-green-500 hover:text-white border border-gray-200 dark:border-gray-600 shadow-sm"
                        >
                          <Check className="w-4 h-4" />
                          Done
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentProjects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-lg dark:hover:shadow-blue-500/20 dark:hover:border-blue-500/50 transition-all"
              onClick={(e) => handleRowClick(project.id, e)}
            >
              <div className="flex items-center mb-4">
                <div className={`w-3 h-3 rounded ${getSystemColor(project.system)}`} />
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm ml-2">
                  {project.system}
                </span>
              </div>
              <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-2">{project.project}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Words: {formatNumber(project.words)}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Lines: {formatNumber(project.lines)}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Due Date: {formatDate(project.dueDate)}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs truncate mb-4">{project.instructions}</p>
              {activeTab === 'unclaimed' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleClaim(project.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-all text-sm hover:bg-blue-500 hover:text-white border border-gray-200 dark:border-gray-600 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    Claim
                  </button>
                  <button
                    onClick={() => handleRefuse(project.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-all text-sm hover:bg-red-500 hover:text-white border border-gray-200 dark:border-gray-600 shadow-sm"
                  >
                    <X className="w-4 h-4" />
                    Refuse
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleDone(project.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-all text-sm hover:bg-green-500 hover:text-white border border-gray-200 dark:border-gray-600 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  Done
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}