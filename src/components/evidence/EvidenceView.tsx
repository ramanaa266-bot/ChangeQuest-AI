import React, { useState } from 'react';
import {
  SatelliteScene,
  ChangeAnalysisResult,
  EvidenceItem
} from '../../types';
import {
  FileCheck2,
  Shield,
  Activity,
  Layers,
  Radio,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  ExternalLink,
  Info
} from 'lucide-react';

interface EvidenceViewProps {
  analysis: ChangeAnalysisResult;
  sceneA: SatelliteScene;
  sceneB: SatelliteScene;
  onNavigateToWorkspace: () => void;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({
  analysis,
  sceneA,
  sceneB,
  onNavigateToWorkspace,
}) => {
  type Category = 'ALL' | 'SPECTRAL' | 'SAR_RADAR' | 'GEOMETRIC' | 'TEMPORAL';
  const [activeCategory, setActiveCategory] = useState<Category>('ALL');

  const evidenceList = analysis.evidenceList || [];
  const filtered = evidenceList.filter((e) => {
    if (activeCategory === 'ALL') return true;
    return e.category === activeCategory;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#070b12] text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-1">
            <FileCheck2 className="w-4 h-4 text-cyan-400" />
            <span>TRACEABLE PROVENANCE & SENSOR AUDIT TRAIL</span>
          </div>
          <h1 className="text-2xl font-black tracking-wide text-slate-100">
            EVIDENCE-FIRST INTELLIGENCE AUDIT
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Every conclusion is connected to verifiable spectral, geometric, and SAR microwave sensor evidence.
          </p>
        </div>

        <button
          onClick={onNavigateToWorkspace}
          className="px-4 py-2 rounded text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center space-x-1.5 shadow-md"
        >
          <span>Return to Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Philosophy Banner */}
      <div className="p-4 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 shadow-xl space-y-2">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase">
          <Shield className="w-4 h-4" />
          <span>DIRECTORATE GENERAL OF INFORMATION SYSTEMS (DGIS) EVIDENCE STANDARD</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          AI inferences in defense decision-support must not operate as an opaque black box. All detected spatial anomalies must link back to raw band ratios, sensor orbits, atmospheric correction logs, and geometric measurements.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs">
        <span className="text-slate-400 text-[10px] uppercase font-bold mr-2">EVIDENCE CATEGORY:</span>
        {(['ALL', 'SPECTRAL', 'SAR_RADAR', 'GEOMETRIC', 'TEMPORAL'] as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded transition ${
              activeCategory === cat
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-600 font-bold'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Evidence Cards Matrix */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-3 shadow-lg hover:border-slate-700 transition"
          >
            {/* Item Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="text-cyan-400 font-bold text-xs">{item.id}</span>
                <span className="text-slate-600">|</span>
                <span className="text-sm font-bold text-slate-200">{item.title}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {item.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {item.confidence} CONFIDENCE
                </span>
              </div>
            </div>

            {/* Core Observation */}
            <div className="text-xs text-slate-300 leading-relaxed">
              <b className="text-slate-100">Observation: </b> {item.observation}
            </div>

            {/* Before / After / Delta Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">VALUE BEFORE (T0):</span>
                <span className="font-bold text-slate-200">{item.valueBefore}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">VALUE AFTER (T1):</span>
                <span className="font-bold text-slate-200">{item.valueAfter}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 uppercase block">QUANTITATIVE DELTA:</span>
                <span className="font-bold text-emerald-400">{item.delta}</span>
              </div>
            </div>

            {/* Provenance & Sensor Attribution */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
              <div>
                <span className="text-slate-500">Sensor Source: </span>
                <span className="text-slate-300 font-semibold">{item.sensorSource}</span>
              </div>
              <div>
                <span className="text-slate-500">Processing Provenance: </span>
                <span className="text-cyan-400 font-semibold">{item.provenance}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Satellite Telemetry Chain of Custody Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-3 shadow-xl">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>SATELLITE SCENE CHAIN-OF-CUSTODY (AUDIT LOG)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-2 px-3">Role</th>
                <th className="py-2 px-3">Scene Identifier</th>
                <th className="py-2 px-3">Satellite / Sensor</th>
                <th className="py-2 px-3">Acquisition UTC</th>
                <th className="py-2 px-3">Processing Level</th>
                <th className="py-2 px-3">Cloud Cover</th>
                <th className="py-2 px-3">CRS / Grid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-[11px] text-slate-300">
              <tr>
                <td className="py-2.5 px-3 text-blue-400 font-bold">T0 (BEFORE)</td>
                <td className="py-2.5 px-3 font-mono">{sceneA.id}</td>
                <td className="py-2.5 px-3">{sceneA.satellite} ({sceneA.sensor})</td>
                <td className="py-2.5 px-3 font-mono">{sceneA.acquisitionDate}</td>
                <td className="py-2.5 px-3">{sceneA.processingLevel}</td>
                <td className="py-2.5 px-3 text-emerald-400">{sceneA.cloudCoverage}%</td>
                <td className="py-2.5 px-3 font-mono">EPSG:4326 / UTM 43N</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-amber-400 font-bold">T1 (AFTER)</td>
                <td className="py-2.5 px-3 font-mono">{sceneB.id}</td>
                <td className="py-2.5 px-3">{sceneB.satellite} ({sceneB.sensor})</td>
                <td className="py-2.5 px-3 font-mono">{sceneB.acquisitionDate}</td>
                <td className="py-2.5 px-3">{sceneB.processingLevel}</td>
                <td className="py-2.5 px-3 text-emerald-400">{sceneB.cloudCoverage}%</td>
                <td className="py-2.5 px-3 font-mono">EPSG:4326 / UTM 43N</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
