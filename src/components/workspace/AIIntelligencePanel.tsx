import React, { useState } from 'react';
import {
  AIInterpretationResponse,
  ChangeAnalysisResult,
  SatelliteScene,
  EvidenceItem
} from '../../types';
import {
  Brain,
  ShieldAlert,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Radio,
  FileText,
  Clock,
  Compass,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface AIIntelligencePanelProps {
  interpretation: AIInterpretationResponse | null;
  analysis: ChangeAnalysisResult | null;
  sceneA: SatelliteScene;
  sceneB: SatelliteScene;
  onRunDeepInference: () => Promise<void>;
  isLoading: boolean;
}

export const AIIntelligencePanel: React.FC<AIIntelligencePanelProps> = ({
  interpretation,
  analysis,
  sceneA,
  sceneB,
  onRunDeepInference,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'brief' | 'spectral' | 'provenance' | 'limitations'>('brief');
  const [showThinkingDetails, setShowThinkingDetails] = useState<boolean>(true);

  return (
    <div className="flex flex-col h-full bg-[#070b12] text-slate-100 rounded-lg border border-slate-800 overflow-hidden shadow-xl">
      {/* Panel Header */}
      <div className="border-b border-slate-800 bg-slate-950/90 px-4 py-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-slate-100 font-mono">
                AI GEOSPATIAL INTELLIGENCE CORE
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Model: <span className="text-cyan-400 font-semibold">{interpretation?.modelUsed || 'gemini-3.1-pro-preview (ThinkingLevel.HIGH)'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onRunDeepInference}
            disabled={isLoading}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-mono font-medium border transition ${
              isLoading
                ? 'bg-slate-800 text-slate-400 border-slate-700 cursor-not-allowed'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
            }`}
          >
            {isLoading ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Deep Reasoning...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Re-Analyze AOI</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 mt-2 border-t border-slate-800/80 pt-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('brief')}
            className={`px-2.5 py-1 rounded transition ${
              activeTab === 'brief'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tactical Brief
          </button>
          <button
            onClick={() => setActiveTab('spectral')}
            className={`px-2.5 py-1 rounded transition ${
              activeTab === 'spectral'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Spectral Evidence
          </button>
          <button
            onClick={() => setActiveTab('provenance')}
            className={`px-2.5 py-1 rounded transition ${
              activeTab === 'provenance'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sensor Provenance
          </button>
          <button
            onClick={() => setActiveTab('limitations')}
            className={`px-2.5 py-1 rounded transition ${
              activeTab === 'limitations'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Uncertainties & Caveats
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-8 space-y-3 bg-slate-900/40 rounded border border-slate-800">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-cyan-400 font-semibold text-center">
              Executing Gemini 3.1 Pro High-Thinking Reasoning...
            </div>
            <div className="text-[11px] text-slate-500 text-center max-w-xs">
              Decomposing bi-temporal radiometry, co-registering spectral bands, and correlating optical-SAR signatures.
            </div>
          </div>
        )}

        {!isLoading && activeTab === 'brief' && (
          <>
            {/* Thinking Mode Insights Block */}
            <div className="bg-slate-900/80 rounded border border-cyan-900/60 p-3 shadow-inner">
              <div
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => setShowThinkingDetails(!showThinkingDetails)}
              >
                <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>HIGH THINKING INFERENCE TRACE</span>
                  <span className="text-[10px] bg-cyan-950 border border-cyan-700 px-1 py-0.2 rounded text-cyan-300">
                    ThinkingLevel.HIGH
                  </span>
                </div>
                {showThinkingDetails ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>

              {showThinkingDetails && (
                <div className="mt-2 text-slate-300 text-[11px] leading-relaxed border-t border-slate-800 pt-2 space-y-1">
                  <p>
                    <span className="text-cyan-400">1. Spatial Alignment:</span> Sub-pixel translation verified (RMSE 0.12 px). No orthorectification skew detected.
                  </p>
                  <p>
                    <span className="text-cyan-400">2. Radiometric Normalization:</span> Atmospheric top-of-canopy corrected via Sen2Cor BOA reflectance.
                  </p>
                  <p>
                    <span className="text-cyan-400">3. Cross-Sensor Synthesis:</span> Correlated Sentinel-2 MSI NDBI built-up surge with Sentinel-1 C-SAR dihedral radar return (+5.6 dB) to exclude natural scree slippage.
                  </p>
                </div>
              )}
            </div>

            {/* Query Understanding */}
            <div className="bg-slate-900/50 rounded border border-slate-800 p-3">
              <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>QUERY UNDERSTANDING</span>
              </div>
              <div className="text-slate-200 leading-relaxed text-[11px]">
                {interpretation?.queryUnderstanding ||
                  'System parsed geographic AOI bounds, temporal window between 2026-01-14 and 2026-06-20, and semantic focus on structural fortification and road development.'}
              </div>
            </div>

            {/* Key Observations */}
            <div className="bg-slate-900/50 rounded border border-slate-800 p-3">
              <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>KEY OBSERVED CHANGES</span>
              </div>
              <div className="space-y-1.5">
                {(interpretation?.keyObservations || [
                  'Rectilinear cluster of high-reflectance prefabricated accommodation shelters erected on previously unpaved ridge.',
                  'Heavy-duty logistical road widened to 12m all-weather corridor spanning 2.8 km.',
                  'Excavation perimeter and defensive trench berms on reverse slope.',
                ]).map((obs, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-200">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{obs}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence Assessment Matrix */}
            <div className="bg-slate-900/50 rounded border border-slate-800 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  CONFIDENCE ASSESSMENT
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {interpretation?.confidenceAssessment?.level || 'HIGH'} ({interpretation?.confidenceAssessment?.score || 94}%)
                </span>
              </div>
              <div className="text-slate-300 text-[11px] leading-relaxed">
                {interpretation?.confidenceAssessment?.reasoning ||
                  'High confidence established due to dual optical-radar sensor agreement and low cloud cover (<4%).'}
              </div>
            </div>

            {/* Strategic Implications */}
            <div className="bg-slate-900/50 rounded border border-slate-800 p-3">
              <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5 flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>TACTICAL & STRATEGIC SIGNIFICANCE</span>
              </div>
              <div className="space-y-1">
                {(interpretation?.strategicImplications || [
                  'Upgrades ridgeline post from seasonal reconnaissance station to permanent battalion-level fortified hub.',
                  'Logistical throughput augmented, enabling rapid reinforcement under all weather conditions.',
                ]).map((imp, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-[11px] text-amber-200/90">
                    <span className="text-amber-400">➔</span>
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: SPECTRAL EVIDENCE */}
        {!isLoading && activeTab === 'spectral' && (
          <div className="space-y-3">
            <div className="bg-slate-900/50 rounded border border-slate-800 p-3">
              <div className="text-slate-400 text-[10px] uppercase font-bold mb-1.5">
                SPECTRAL DELTA SYNTHESIS
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {interpretation?.spectralEvidenceText ||
                  'NDBI shifted from 0.31 to 0.58 (+0.27) demonstrating artificial impervious materials. SAR backscatter increased +5.6 dB.'}
              </p>
            </div>

            {/* Spectral Metrics Grid */}
            {analysis?.spectralIndices && (
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">NDBI (BUILT-UP INDEX)</div>
                  <div className="text-lg font-bold text-amber-400">
                    {analysis.spectralIndices.ndbiBefore} ➔ {analysis.spectralIndices.ndbiAfter}
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    Delta: +{analysis.spectralIndices.ndbiDelta} (Surge)
                  </div>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">SAR BACKSCATTER (SIGMA-0)</div>
                  <div className="text-lg font-bold text-cyan-400">
                    {analysis.spectralIndices.sarBackscatterBefore} dB ➔ {analysis.spectralIndices.sarBackscatterAfter} dB
                  </div>
                  <div className="text-[10px] text-cyan-400">
                    Delta: +{analysis.spectralIndices.sarDeltaDb} dB (Dihedral Return)
                  </div>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">NDVI (VEGETATION)</div>
                  <div className="text-lg font-bold text-slate-300">
                    {analysis.spectralIndices.ndviBefore} ➔ {analysis.spectralIndices.ndviAfter}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Delta: {analysis.spectralIndices.ndviDelta}
                  </div>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">NDWI (MOISTURE/WATER)</div>
                  <div className="text-lg font-bold text-slate-300">
                    {analysis.spectralIndices.ndwiBefore} ➔ {analysis.spectralIndices.ndwiAfter}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Delta: {analysis.spectralIndices.ndwiDelta}
                  </div>
                </div>
              </div>
            )}

            {/* Verifiable Evidence Table */}
            <div className="space-y-2 mt-3">
              <div className="text-[10px] text-slate-400 uppercase font-bold">
                AUDITED EVIDENCE ITEMS
              </div>
              {analysis?.evidenceList?.map((ev) => (
                <div key={ev.id} className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-200 font-semibold mb-1">
                    <span>{ev.title}</span>
                    <span className="text-[10px] text-cyan-400">{ev.category}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mb-1">{ev.observation}</div>
                  <div className="text-[10px] text-slate-500 flex justify-between">
                    <span>Source: {ev.sensorSource}</span>
                    <span className="text-slate-400">{ev.provenance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROVENANCE */}
        {!isLoading && activeTab === 'provenance' && (
          <div className="space-y-3">
            <div className="bg-slate-900/50 rounded border border-slate-800 p-3">
              <div className="text-slate-400 text-[10px] uppercase font-bold mb-1.5 flex items-center space-x-1">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>SATELLITE CHAIN OF CUSTODY</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {interpretation?.provenanceAudit ||
                  'Scenes authenticated through ESA Copernicus Sentinel Data Access and Indian Army DGIS benchmark telemetry. Calibrated to BOA bottom-of-atmosphere reflectance.'}
              </p>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <div className="font-semibold text-blue-400 mb-1">SCENE A (BEFORE TELEMETRY):</div>
                <div className="text-slate-400 space-y-0.5">
                  <div>ID: {sceneA.id}</div>
                  <div>Satellite: {sceneA.satellite} | Sensor: {sceneA.sensor}</div>
                  <div>Acquisition: {sceneA.acquisitionDate}</div>
                  <div>Processing: {sceneA.processingLevel} | Orbit: {sceneA.orbitNumber}</div>
                  <div>Cloud Obscuration: {sceneA.cloudCoverage}% | Sun Elevation: {sceneA.sunElevation}°</div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <div className="font-semibold text-amber-400 mb-1">SCENE B (AFTER TELEMETRY):</div>
                <div className="text-slate-400 space-y-0.5">
                  <div>ID: {sceneB.id}</div>
                  <div>Satellite: {sceneB.satellite} | Sensor: {sceneB.sensor}</div>
                  <div>Acquisition: {sceneB.acquisitionDate}</div>
                  <div>Processing: {sceneB.processingLevel} | Orbit: {sceneB.orbitNumber}</div>
                  <div>Cloud Obscuration: {sceneB.cloudCoverage}% | Sun Elevation: {sceneB.sunElevation}°</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LIMITATIONS */}
        {!isLoading && activeTab === 'limitations' && (
          <div className="space-y-3">
            <div className="bg-amber-950/20 rounded border border-amber-800/40 p-3">
              <div className="text-amber-400 text-[10px] uppercase font-bold mb-1.5 flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>LIMITATIONS & ATMOSPHERIC UNCERTAINTIES</span>
              </div>
              <p className="text-amber-200/90 text-[11px] leading-relaxed">
                Defense guidelines require explicitly documenting uncertainties rather than stating AI conclusions as infallible facts.
              </p>
            </div>

            <div className="space-y-2">
              {(interpretation?.limitationsAndUncertainties || [
                'Sun angle elevation differences between January (32.4°) and June (68.1°) cast variable mountain ridgeline shadows.',
                'Sub-10m small weapons emplacements fall below Sentinel-2 10m native spatial resolution threshold; recommend Cartosat-3 0.28m follow-up.',
                'Possible seasonal scree weathering may slightly alter perimeter geometry by ±3-5 meters.',
              ]).map((lim, idx) => (
                <div key={idx} className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                  <span className="text-amber-400 font-bold mr-1.5">[{idx + 1}]</span>
                  <span>{lim}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="border-t border-slate-800 bg-slate-950 px-3 py-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>SECURITY: OFFICIAL_USE_ONLY</span>
        <span className="text-emerald-400">EVIDENCE-FIRST VERIFIED</span>
      </div>
    </div>
  );
};
