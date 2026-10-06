import React, { useState } from 'react';
import {
  SatelliteScene,
  ChangeAnalysisResult,
  AIInterpretationResponse,
  ChangeFeature
} from '../../types';
import { GeospatialMap } from '../map/GeospatialMap';
import { AIIntelligencePanel } from './AIIntelligencePanel';
import {
  Compass,
  Layers,
  Sliders,
  Calendar,
  Satellite,
  Percent,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Maximize2,
  Eye,
  MapPin,
  Flame,
  ArrowRight
} from 'lucide-react';

interface InvestigationWorkspaceProps {
  sceneA: SatelliteScene;
  sceneB: SatelliteScene;
  allScenes: SatelliteScene[];
  onSelectSceneA: (scene: SatelliteScene) => void;
  onSelectSceneB: (scene: SatelliteScene) => void;
  analysis: ChangeAnalysisResult;
  interpretation: AIInterpretationResponse | null;
  onRunAnalysis: (category: string) => Promise<void>;
  onRunDeepInference: () => Promise<void>;
  isAnalyzing: boolean;
  isInferenceLoading: boolean;
  onNavigateToComparison: () => void;
}

export const InvestigationWorkspace: React.FC<InvestigationWorkspaceProps> = ({
  sceneA,
  sceneB,
  allScenes,
  onSelectSceneA,
  onSelectSceneB,
  analysis,
  interpretation,
  onRunAnalysis,
  onRunDeepInference,
  isAnalyzing,
  isInferenceLoading,
  onNavigateToComparison,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Change Categories');
  const [cloudThreshold, setCloudThreshold] = useState<number>(10);
  const [selectedFeature, setSelectedFeature] = useState<ChangeFeature | null>(null);
  const [showOverlays, setShowOverlays] = useState<boolean>(true);

  const categories = [
    'All Change Categories',
    'Military Fortifications & Shelters',
    'Logistical Roads & Infrastructure',
    'Earthworks & Defensive Trenches',
    'Vegetation & Canopy Disruption',
    'Hydrological & Water Changes',
  ];

  const handleExecute = () => {
    onRunAnalysis(selectedCategory);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-[#070b12] text-slate-100 font-mono">
      {/* ============================================================ */}
      {/* LEFT COLUMN: Investigation Controls (320px)                  */}
      {/* ============================================================ */}
      <div className="w-full lg:w-80 flex-shrink-0 border-r border-slate-800 bg-slate-950/70 p-4 overflow-y-auto space-y-4">
        {/* Controls Header */}
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-1">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>MISSION PARAMETERS</span>
          </div>
          <h2 className="text-sm font-bold text-slate-200">
            INVESTIGATION CONTROL CONSOLE
          </h2>
        </div>

        {/* AOI Location Card */}
        <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>ACTIVE MISSION AOI</span>
            </span>
            <span className="text-[10px] text-emerald-400">RESOLVED</span>
          </div>
          <div className="text-xs font-bold text-slate-200">{sceneA.locationName}</div>
          <div className="text-[10px] text-slate-400">
            Centroid: Lat {sceneA.coordinates.lat}° | Lng {sceneA.coordinates.lng}°
          </div>
        </div>

        {/* Scene A (BEFORE) Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-blue-400 flex items-center justify-between">
            <span>T0 (BEFORE) SCENE:</span>
            <span>{sceneA.acquisitionDate.slice(0, 10)}</span>
          </label>
          <select
            value={sceneA.id}
            onChange={(e) => {
              const sc = allScenes.find((s) => s.id === e.target.value);
              if (sc) onSelectSceneA(sc);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {allScenes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.acquisitionDate.slice(0, 10)} - {s.satellite} ({s.locationName.slice(0, 24)}...)
              </option>
            ))}
          </select>
          <div className="text-[10px] text-slate-500 flex justify-between">
            <span>Sensor: {sceneA.sensor}</span>
            <span>Cloud: {sceneA.cloudCoverage}%</span>
          </div>
        </div>

        {/* Scene B (AFTER) Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-amber-400 flex items-center justify-between">
            <span>T1 (AFTER) SCENE:</span>
            <span>{sceneB.acquisitionDate.slice(0, 10)}</span>
          </label>
          <select
            value={sceneB.id}
            onChange={(e) => {
              const sc = allScenes.find((s) => s.id === e.target.value);
              if (sc) onSelectSceneB(sc);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {allScenes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.acquisitionDate.slice(0, 10)} - {s.satellite} ({s.locationName.slice(0, 24)}...)
              </option>
            ))}
          </select>
          <div className="text-[10px] text-slate-500 flex justify-between">
            <span>Sensor: {sceneB.sensor}</span>
            <span>Cloud: {sceneB.cloudCoverage}%</span>
          </div>
        </div>

        {/* Analysis Category Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-400">
            TARGET CHANGE CATEGORY:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Cloud Threshold Slider */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>MAX CLOUD THRESHOLD:</span>
            <span className="text-cyan-400 font-bold">{cloudThreshold}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            value={cloudThreshold}
            onChange={(e) => setCloudThreshold(Number(e.target.value))}
            className="w-full accent-cyan-400 h-1 bg-slate-800"
          />
        </div>

        {/* Run Analysis Trigger Button */}
        <button
          onClick={handleExecute}
          disabled={isAnalyzing}
          className={`w-full py-2.5 rounded font-bold text-xs tracking-wider transition flex items-center justify-center space-x-2 shadow-lg ${
            isAnalyzing
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
              : 'bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400 shadow-cyan-900/40'
          }`}
        >
          {isAnalyzing ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              <span>CO-REGISTERING & ANALYZING...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>RUN MULTI-TEMPORAL ANALYSIS</span>
            </>
          )}
        </button>

        {/* Comparison Viewer Quick Link Button */}
        <button
          onClick={onNavigateToComparison}
          className="w-full py-2 rounded font-bold text-xs bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 transition flex items-center justify-center space-x-2"
        >
          <span>OPEN BEFORE / AFTER SPLIT VIEWER</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Pipeline Telemetry Status */}
        <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300">CALIBRATION PIPELINE:</div>
          <div className="flex justify-between">
            <span>Co-registration Error:</span>
            <span className="text-emerald-400">RMSE 0.12 px</span>
          </div>
          <div className="flex justify-between">
            <span>Atmospheric Correction:</span>
            <span className="text-cyan-400">Sen2Cor L2A BOA</span>
          </div>
          <div className="flex justify-between">
            <span>Sensor Pairing:</span>
            <span className="text-slate-300">Optical + C-SAR</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CENTER: Geospatial Map & Anomaly Visualizer                 */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-h-[450px] p-4 bg-[#070b12] space-y-3">
        {/* Center Viewer Header */}
        <div className="flex flex-wrap items-center justify-between text-xs pb-1 gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200 uppercase tracking-wide">
              INTELLIGENCE GEOSPATIAL VIEWER
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-semibold">{sceneA.locationName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowOverlays(!showOverlays)}
              className={`px-2 py-1 rounded text-[11px] border transition ${
                showOverlays
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {showOverlays ? 'Vector Overlays ON' : 'Vector Overlays OFF'}
            </button>
            <button
              onClick={onNavigateToComparison}
              className="px-2.5 py-1 rounded text-[11px] bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900"
            >
              Split-Screen Mode
            </button>
          </div>
        </div>

        {/* Geospatial Map Canvas */}
        <div className="flex-1 relative rounded-lg overflow-hidden border border-slate-800 shadow-2xl min-h-[420px]">
          <GeospatialMap
            center={sceneA.coordinates}
            bounds={sceneA.bounds}
            features={analysis.features}
            selectedFeatureId={selectedFeature?.id}
            onSelectFeature={(feat) => setSelectedFeature(feat)}
            showChangeOverlay={showOverlays}
            height="100%"
          />
        </div>

        {/* Selected Anomaly Details Strip */}
        {selectedFeature && (
          <div className="p-3 rounded-lg border border-cyan-500/40 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-cyan-400">{selectedFeature.title}</span>
                <span className="text-[10px] bg-red-950 border border-red-800 text-red-300 px-1.5 py-0.2 rounded font-bold">
                  {selectedFeature.confidence} ({selectedFeature.confidenceScore}%)
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {selectedFeature.evidenceSummary}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center space-x-4">
              <span>Footprint: <b className="text-slate-200">{selectedFeature.areaSquareMeters.toLocaleString()} m²</b></span>
              <span>Delta NDBI: <b className="text-amber-400">{selectedFeature.deltaNDBI || '+0.31'}</b></span>
              <button
                onClick={() => setSelectedFeature(null)}
                className="text-slate-500 hover:text-slate-300"
              >
                Clear Focus
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* RIGHT COLUMN: AI Intelligence & Evidence Panel (380px)        */}
      {/* ============================================================ */}
      <div className="w-full lg:w-96 flex-shrink-0 border-l border-slate-800 bg-[#070b12] p-2 flex flex-col h-full overflow-hidden">
        <AIIntelligencePanel
          interpretation={interpretation}
          analysis={analysis}
          sceneA={sceneA}
          sceneB={sceneB}
          onRunDeepInference={onRunDeepInference}
          isLoading={isInferenceLoading}
        />
      </div>
    </div>
  );
};
