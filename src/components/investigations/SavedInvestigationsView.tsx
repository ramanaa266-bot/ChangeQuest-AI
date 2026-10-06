import React, { useState } from 'react';
import {
  Investigation,
  SatelliteScene
} from '../../types';
import {
  FolderGit2,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Shield,
  Calendar,
  Compass,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Clock,
  User,
  Filter
} from 'lucide-react';

interface SavedInvestigationsViewProps {
  investigations: Investigation[];
  onOpenInvestigation: (inv: Investigation) => void;
  onCreateInvestigation: (inv: Partial<Investigation>) => Promise<void>;
  onDeleteInvestigation: (id: string) => Promise<void>;
  allScenes: SatelliteScene[];
}

export const SavedInvestigationsView: React.FC<SavedInvestigationsViewProps> = ({
  investigations,
  onOpenInvestigation,
  onCreateInvestigation,
  onDeleteInvestigation,
  allScenes,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states for modal
  const [newTitle, setNewTitle] = useState('');
  const [newQuery, setNewQuery] = useState('');
  const [newAoi, setNewAoi] = useState('Pangong Tso North Ridge & Finger 4 Sector');
  const [newClassification, setNewClassification] = useState<Investigation['classification']>('RESTRICTED');
  const [newSceneA, setNewSceneA] = useState(allScenes[0]?.id || '');
  const [newSceneB, setNewSceneB] = useState(allScenes[1]?.id || '');
  const [newNotes, setNewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = investigations.filter((inv) => {
    if (statusFilter !== 'ALL' && inv.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const matchQuery = inv.query.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTitle = inv.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchAoi = inv.aoiName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchQuery || matchTitle || matchAoi;
    }
    return true;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreateInvestigation({
        title: newTitle.trim(),
        query: newQuery.trim(),
        aoiName: newAoi,
        classification: newClassification,
        sceneAId: newSceneA,
        sceneBId: newSceneB,
        notes: newNotes.trim(),
        status: 'ACTIVE',
        assignedAnalyst: 'Capt. A. Sharma (DGIS)',
      });
      setShowCreateModal(false);
      setNewTitle('');
      setNewQuery('');
      setNewNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#070b12] text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-1">
            <FolderGit2 className="w-4 h-4 text-cyan-400" />
            <span>GEOSPATIAL INTELLIGENCE DOSSIER REPOSITORY</span>
          </div>
          <h1 className="text-2xl font-black tracking-wide text-slate-100">
            SAVED INVESTIGATIONS ARCHIVE
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, manage, and resume multi-temporal satellite change analysis investigations.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center space-x-2 shadow-lg shadow-cyan-900/30"
        >
          <Plus className="w-4 h-4" />
          <span>START NEW INVESTIGATION</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-slate-950/80">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, query or AOI..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 text-[10px] uppercase font-bold">STATUS:</span>
          {['ALL', 'ACTIVE', 'COMPLETED', 'FLAGGED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-[11px] transition ${
                statusFilter === st
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Investigations Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((inv) => (
          <div
            key={inv.id}
            className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-3 shadow-lg hover:border-slate-700 transition"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-cyan-400 text-xs">{inv.id}</span>
                <div className="flex items-center space-x-1.5 text-[10px]">
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      inv.classification === 'SECRET'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : inv.classification === 'CONFIDENTIAL'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {inv.classification}
                  </span>
                  <span className="px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {inv.status}
                  </span>
                </div>
              </div>

              {/* Title & Query */}
              <h3 className="text-sm font-bold text-slate-100 line-clamp-2 mb-1.5">
                {inv.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                "{inv.query}"
              </p>

              {/* Metadata details */}
              <div className="space-y-1 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5">
                <div>
                  <span className="text-slate-500">AOI: </span>
                  <span className="text-slate-200 font-semibold">{inv.aoiName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Analyst: </span>
                  <span className="text-slate-300">{inv.assignedAnalyst}</span>
                </div>
                <div>
                  <span className="text-slate-500">Interval: </span>
                  <span className="text-cyan-400">{inv.beforeDate} ➔ {inv.afterDate}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => onDeleteInvestigation(inv.id)}
                className="text-slate-500 hover:text-red-400 p-1 transition"
                title="Delete Investigation"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenInvestigation(inv)}
                className="px-3 py-1.5 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 font-semibold flex items-center space-x-1.5 transition"
              >
                <span>Resume in Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create New Investigation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-cyan-500/40 bg-slate-950 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                <Plus className="w-4 h-4" />
                <span>COMMISSION NEW SATELLITE INVESTIGATION</span>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  INVESTIGATION TITLE:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Surveillance of Northern Ridge Finger 4"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  NATURAL LANGUAGE QUERY:
                </label>
                <textarea
                  rows={2}
                  required
                  value={newQuery}
                  onChange={(e) => setNewQuery(e.target.value)}
                  placeholder="e.g. Identify newly erected shelters and access road spurs..."
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    CLASSIFICATION:
                  </label>
                  <select
                    value={newClassification}
                    onChange={(e) => setNewClassification(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none"
                  >
                    <option value="RESTRICTED">RESTRICTED</option>
                    <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                    <option value="SECRET">SECRET</option>
                    <option value="OFFICIAL_USE">OFFICIAL_USE</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    MISSION AOI:
                  </label>
                  <input
                    type="text"
                    value={newAoi}
                    onChange={(e) => setNewAoi(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  ANALYST INTEL NOTES:
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Operational context, tasking directives..."
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition shadow-md shadow-cyan-900/30"
                >
                  {isSubmitting ? 'Creating...' : 'Create Investigation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
