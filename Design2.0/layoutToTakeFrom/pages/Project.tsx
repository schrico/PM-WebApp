import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Calendar, FileText, Users, Clock, Hash, Bell, FileDown, FileUp, MoreVertical, UserMinus } from 'lucide-react';
import { formatNumber, formatDate } from '../../utils/formatters';
import { getSystemColor } from '../../utils/systemColors';
import { useState } from 'react';

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
  '1': { id: '1', system: 'Phrase', project: 'Marketing Campaign Q4', words: 2500, lines: 180, translators: [], dueDate: '2025-11-25', instructions: 'Follow brand guidelines', status: 'Unclaimed', sourceLanguage: 'English', targetLanguage: 'Spanish', createdDate: '2025-11-10', priority: 'High' },
  '2': { id: '2', system: 'Trados', project: 'Legal Contract Translation', words: 4200, lines: 310, translators: ['John Smith'], dueDate: '2025-11-22', instructions: 'Certified translation required', status: 'In Progress', sourceLanguage: 'English', targetLanguage: 'French', createdDate: '2025-11-08', priority: 'Urgent' },
  '3': { id: '3', system: 'MemoQ', project: 'Technical Manual v2.3', words: 8900, lines: 650, translators: ['Maria Garcia', 'Jean Dupont'], dueDate: '2025-11-28', instructions: 'Use glossary provided', status: 'In Progress', sourceLanguage: 'German', targetLanguage: 'English', createdDate: '2025-11-05', priority: 'Medium' },
  '4': { id: '4', system: 'Phrase', project: 'Website Localization', words: 1800, lines: 125, translators: ['Anna Kowalski'], dueDate: '2025-11-24', instructions: 'SEO keywords must be maintained', status: 'Ready', sourceLanguage: 'English', targetLanguage: 'German', createdDate: '2025-11-12', priority: 'High' },
  '5': { id: '5', system: 'Trados', project: 'User Guide Translation', words: 3200, lines: 240, translators: ['Li Wei'], dueDate: '2025-11-20', instructions: 'Maintain formatting', status: 'Ready', sourceLanguage: 'English', targetLanguage: 'Chinese', createdDate: '2025-11-09', priority: 'Medium' },
  '6': { id: '6', system: 'MemoQ', project: 'Product Description Set', words: 1500, lines: 95, translators: [], dueDate: '2025-11-21', instructions: 'Creative adaptation allowed', status: 'Unclaimed', sourceLanguage: 'English', targetLanguage: 'Italian', createdDate: '2025-11-11', priority: 'Low' },
  '7': { id: '7', system: 'Phrase', project: 'Email Templates', words: 950, lines: 68, translators: ['Ahmed Hassan'], dueDate: '2025-11-19', instructions: 'Keep tone professional yet friendly', status: 'In Progress', sourceLanguage: 'English', targetLanguage: 'Arabic', createdDate: '2025-11-06', priority: 'High' },
  '8': { id: '8', system: 'Trados', project: 'Annual Report 2024', words: 6800, lines: 480, translators: ['John Smith', 'Li Wei'], dueDate: '2025-11-30', instructions: 'Financial terminology check required', status: 'Ready', sourceLanguage: 'English', targetLanguage: 'Japanese', createdDate: '2025-11-07', priority: 'Urgent' },
};

export function Project() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedTranslator, setSelectedTranslator] = useState<string>('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const project = id ? mockProjects[id] : null;

  if (!project) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <h2 className="text-gray-900 dark:text-white mb-4">Project not found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/project/${project.id}/edit`);
  };

  const handleSendReminder = (translator: string) => {
    setSelectedTranslator(translator);
    setOpenMenu(null);
    setShowReminderModal(true);
  };

  const handleRemoveTranslator = (translator: string) => {
    console.log('Removing translator:', translator);
    setOpenMenu(null);
  };

  const handleSendMessage = () => {
    console.log('Sending reminder to:', selectedTranslator, 'Message:', reminderMessage);
    setShowReminderModal(false);
    setReminderMessage('');
    setSelectedTranslator('');
  };

  const handleSendDefault = () => {
    console.log('Sending default reminder to:', selectedTranslator);
    setShowReminderModal(false);
    setSelectedTranslator('');
  };

  const calculateDaysLeft = (dueDate: string) => {
    const today = new Date('2025-11-25'); // Using a fixed date for consistency
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} Days Overdue`;
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return '1 Day Left';
    return `${diffDays} Days Left`;
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'High':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Ready':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Unclaimed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded ${getSystemColor(project.system)}`} />
            <div>
              <h1 className="text-gray-900 dark:text-white mb-2">
                {project.project}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm">
                  {project.system}
                </span>
                {project.status && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                )}
                {project.dueDate && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400`}>
                    {calculateDaysLeft(project.dueDate)}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
          >
            <Edit className="w-5 h-5" />
            Edit Project
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-gray-900 dark:text-white mb-6">
              Project Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Project ID</p>
                  <p className="text-gray-900 dark:text-white">#{project.id}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Word Count</p>
                  <p className="text-gray-900 dark:text-white">{formatNumber(project.words)} words</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Due Date</p>
                  <p className="text-gray-900 dark:text-white">{formatDate(project.dueDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Days Left</p>
                  <p className="text-gray-900 dark:text-white">{calculateDaysLeft(project.dueDate)}</p>
                </div>
              </div>

              {project.sourceLanguage && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileDown className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Source Language</p>
                    <p className="text-gray-900 dark:text-white">{project.sourceLanguage}</p>
                  </div>
                </div>
              )}

              {project.targetLanguage && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Target Language</p>
                    <p className="text-gray-900 dark:text-white">{project.targetLanguage}</p>
                  </div>
                </div>
              )}

              

              {project.lines && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Lines</p>
                    <p className="text-gray-900 dark:text-white">{project.lines}</p>
                  </div>
                </div>
              )}

              
            </div>
          </div>

          {/* Instructions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-gray-900 dark:text-white mb-4">
              Instructions
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {project.instructions}
            </p>
          </div>
        </div>

        {/* Right Column - Translators */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-gray-900 dark:text-white">
                Assigned Translators
              </h2>
            </div>

            {project.translators.length > 0 ? (
              <div className="space-y-3">
                {project.translators.map((translator, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                        {translator.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white">{translator}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Translator</p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === index ? null : index)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer hover:shadow-lg"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors" />
                        </button>
                        {openMenu === index && (
                          <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                            <button 
                              className="w-full px-4 py-2.5 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg flex items-center gap-2" 
                              onClick={() => handleRemoveTranslator(translator)}
                            >
                              <UserMinus className="w-4 h-4" />
                              Remove Translator
                            </button>
                            <button 
                              className="w-full px-4 py-2.5 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors last:rounded-b-lg flex items-center gap-2" 
                              onClick={() => handleSendReminder(translator)}
                            >
                              <Bell className="w-4 h-4" />
                              Send Reminder
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-13">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
                        Unclaimed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  No translators assigned yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 max-w-2xl w-full mx-auto">
            <h2 className="text-gray-900 dark:text-white mb-4">
              Send Reminder to {selectedTranslator}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Enter a custom message or send a default reminder
            </p>
            <textarea
              value={reminderMessage}
              onChange={(e) => setReminderMessage(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 resize-none"
              placeholder="Type your custom message here..."
            />
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => {
                  setShowReminderModal(false);
                  setReminderMessage('');
                  setSelectedTranslator('');
                }}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
              >
                Cancel
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleSendDefault}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  Send Default
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!reminderMessage.trim()}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Custom Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}