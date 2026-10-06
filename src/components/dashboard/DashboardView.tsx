import React, { useState } from 'react';
import {
  SatelliteScene,
  Investigation,
  ChangeAnalysisResult
} from '../../types';
import {
  Compass,
  Search,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Activity,
  AlertTriangle,
  Clock,
  Satellite,
  CheckCircle2,
  Calendar,
  Eye,
  FileText,
  BarChart2,
  Cpu
} from 'lucide-react';

interface DashboardViewProps {
  investigations: Investigation[];
  scenes: SatelliteScene[];
  analysis: ChangeAnalysisResult;
  onStartInvestigation: (query: string) => void;
  onOpenInvestigation: (inv: Investigation) => void;
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  investigations,
  scenes,
  analysis,
  onStartInvestigation,
  onOpenInvestigation,
  onNavigate,
}) => {
  const [queryInput, setQueryInput] = useState('');

  const sampleQueries = [
    'Find new hardened structures, shelters and concrete pads near Finger 4 between January and June 2026.',
    'Detect logistical road expansion and rail siding construction in Siliguri corridor.',
    'Identify defensive trench earthworks and helipad clearances across Doklam plateau crest.',
    'Track canopy degradation and hydrological shifts along forward river defiles.',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryInput.trim()) {
      onStartInvestigation(queryInput.trim());
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#070b12] text-slate-100 font-mono">
      {/* Top Welcome & Operational Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>STRATEGIC SATELLITE RETRIEVAL & TEMPORAL INTELLIGENCE HUB</span>
          </div>
          <h1 className="text-2xl font-black tracking-wide text-slate-100">
            CHANGEQUEST AI OPERATIONAL CONSOLE
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            SIH26227 // Ministry of Defence // Indian Army (DGIS) // Team ASIA [192122]
          </p>
        </div>

        {/* System Health Overview Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded text-xs flex items-center space-x-2">
            <Satellite className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Scenes Ingested:</span>
            <span className="text-slate-200 font-bold">{scenes.length}</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded text-xs flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Active Missions:</span>
            <span className="text-emerald-400 font-bold">{investigations.length}</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded text-xs flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Thinking Mode:</span>
            <span className="text-amber-300 font-bold">3.1 PRO (HIGH)</span>
          </div>
        </div>
      </div>

      {/* Central "Start New Investigation" Prompt Console */}
      <div className="relative rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 via-[#0a1120] to-slate-950 p-6 shadow-2xl overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-2">
            <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
            <span>NATURAL LANGUAGE MULTI-TEMPORAL INQUIRY</span>
          </div>

          <h2 className="text-xl font-bold text-slate-100 mb-2">
            Ask CHANGEQUEST AI about satellite imagery...
          </h2>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Specify geographic targets, temporal windows, and target change semantics. The engine automatically co-registers multi-spectral optical and C-SAR radar pairs to detect ground truth modifications.
          </p>

          <form onSubmit={handleSubmit} className="relative mb-4">
            <div className="relative flex items-center">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="e.g., 'Find significant infrastructure changes around Pangong Tso Finger 4 between January and June 2026.'"
                className="w-full pl-4 pr-32 py-3.5 text-sm bg-slate-950/90 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2 rounded-md bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold text-xs tracking-wider shadow-lg shadow-cyan-900/40 flex items-center space-x-2 transition"
              >
                <span>RETRIEVE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Query Sample Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Suggested Inquiries:</span>
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQueryInput(q);
                  onStartInvestigation(q);
                }}
                className="text-[11px] px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition text-left"
              >
                "{q.slice(0, 48)}..."
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Intelligence Metrics & Performance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Multi-Temporal Accuracy</div>
            <div className="text-xl font-bold text-cyan-400 mt-1">94.2%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Validated against DGIS ground-truth</div>
          </div>
          <Activity className="w-6 h-6 text-cyan-500/50" />
        </div>

        <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Sub-Pixel Co-Registration</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">RMSE 0.12 px</div>
            <div className="text-[10px] text-slate-500 mt-0.5">SIFT Feature Alignment</div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-500/50" />
        </div>

        <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">SAR Coherence Delta</div>
            <div className="text-xl font-bold text-amber-400 mt-1">+5.6 dB</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Sentinel-1 C-Band Radar</div>
          </div>
          <Satellite className="w-6 h-6 text-amber-500/50" />
        </div>

        <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Constellation Latency</div>
            <div className="text-xl font-bold text-slate-200 mt-1">&lt; 180 ms</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Distributed STAC index</div>
          </div>
          <BarChart2 className="w-6 h-6 text-slate-500" />
        </div>
      </div>

      {/* Two Column Layout: Active Investigations & Recent Satellite Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Investigations List */}
        <div className="lg:col-span-2 rounded-lg border border-slate-800 bg-slate-950/70 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-200">ACTIVE GEOSPATIAL INVESTIGATIONS</h3>
            </div>
            <button
              onClick={() => onNavigate('investigations')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
            >
              <span>View All ({investigations.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {investigations.map((inv) => (
              <div
                key={inv.id}
                onClick={() => onOpenInvestigation(inv)}
                className="p-3.5 rounded-lg border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-cyan-500/50 cursor-pointer transition shadow-sm space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-cyan-400">{inv.id}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-xs font-semibold text-slate-200">{inv.title}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      inv.classification === 'SECRET' ? 'bg-red-950 text-red-400 border border-red-800' :
                      inv.classification === 'CONFIDENTIAL' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {inv.classification}
                    </span>
                    <span className="px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {inv.status}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 line-clamp-1">
                  Query: "{inv.query}"
                </div>

                <div className="flex flex-wrap items-center justify-between pt-1 border-t border-slate-800/60 text-[11px] text-slate-500 gap-2">
                  <div className="flex items-center space-x-3">
                    <span>AOI: <span className="text-slate-300">{inv.aoiName}</span></span>
                    <span>Interval: <span className="text-slate-300">{inv.beforeDate} ➔ {inv.afterDate}</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-amber-400 font-semibold">{inv.changesDetectedCount} Anomalies</span>
                    <span className="text-cyan-400 font-semibold">{inv.confidence} Conf</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recent Satellite Scene Ingest */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <Satellite className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-200">RECENT SATELLITE INGEST</h3>
            </div>
            <button
              onClick={() => onNavigate('search')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
            >
              <span>Catalog</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {scenes.slice(0, 4).map((sc) => (
              <div
                key={sc.id}
                className="flex items-center space-x-3 p-2 rounded border border-slate-800/60 bg-slate-900/30 hover:bg-slate-900/70 transition"
              >
                <img
                  src={sc.previewUrl}
                  alt={sc.name}
                  className="w-14 h-14 object-cover rounded border border-slate-700 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 text-xs">
                  <div className="font-semibold text-slate-200 truncate">{sc.satellite} ({sc.resolution})</div>
                  <div className="text-[10px] text-slate-400 truncate">{sc.locationName}</div>
                  <div className="flex items-center space-x-2 mt-1 text-[10px] text-slate-500">
                    <span>{sc.acquisitionDate.slice(0, 10)}</span>
                    <span>•</span>
                    <span className={sc.cloudCoverage < 5 ? 'text-emerald-400' : 'text-amber-400'}>
                      Cloud: {sc.cloudCoverage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Benchmark Provenance Notice */}
          <div className="p-2.5 rounded bg-slate-900/50 border border-slate-800 text-[10px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-300">DATA SOURCE PROVENANCE</div>
            <p>
              Scenes calibrated to Sentinel-2 MSI L2A bottom-of-atmosphere reflectance and Sentinel-1 IW GRD radar. STAC-compliant endpoint active.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
