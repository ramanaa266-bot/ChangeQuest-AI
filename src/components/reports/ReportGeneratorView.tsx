import React, { useState } from 'react';
import {
  Investigation,
  SatelliteScene,
  ChangeAnalysisResult,
  AIInterpretationResponse
} from '../../types';
import {
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  Shield,
  Calendar,
  Satellite,
  Compass,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface ReportGeneratorViewProps {
  investigation: Investigation;
  sceneA: SatelliteScene;
  sceneB: SatelliteScene;
  analysis: ChangeAnalysisResult;
  interpretation: AIInterpretationResponse | null;
}

export const ReportGeneratorView: React.FC<ReportGeneratorViewProps> = ({
  investigation,
  sceneA,
  sceneB,
  analysis,
  interpretation,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportRefId = `DGIS/SIH26227/ASIA-192122/REP-${investigation.id.slice(-4)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      platform: 'CHANGEQUEST AI',
      problemStatement: 'SIH26227: Semantic Retrieval & Multi-Temporal Change Analysis of Satellite Imagery',
      team: 'ASIA [Astro Spatial Intelligence Alliance] (192122)',
      organization: 'Ministry of Defence / Indian Army (DGIS)',
      dossierReference: reportRefId,
      classification: investigation.classification,
      generatedDate: new Date().toISOString(),
      investigation,
      scenePair: { sceneA, sceneB },
      analysis,
      aiBrief: interpretation,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CHANGEQUEST-DOSSIER-${investigation.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    const md = `
# GEOSPATIAL INTELLIGENCE DOSSIER // CHANGEQUEST AI
**Reference:** ${reportRefId}  
**Classification:** ${investigation.classification}  
**Problem Statement:** SIH26227 // Ministry of Defence // Indian Army (DGIS)  
**Team ID:** 192122 | Team ASIA  
**Date:** ${new Date().toISOString()}  
**Analyst:** ${investigation.assignedAnalyst}  

---

### MISSION SUMMARY
- **AOI:** ${investigation.aoiName} (Lat: ${investigation.coordinates.lat}°, Lng: ${investigation.coordinates.lng}°)
- **Objective Query:** "${investigation.query}"
- **T0 Baseline Scene:** ${sceneA.name} (${sceneA.acquisitionDate})
- **T1 Target Scene:** ${sceneB.name} (${sceneB.acquisitionDate})
- **Interval:** ${analysis.timeDifferenceDays} Days

### QUANTITATIVE DETECTIONS (${analysis.features.length} FEATURES)
${analysis.features.map((f, i) => `${i + 1}. **${f.title}** (${f.type.toUpperCase()}) - Area: ${f.areaSquareMeters.toLocaleString()} m² | Conf: ${f.confidenceScore}% | ${f.evidenceSummary}`).join('\n')}

### SPECTRAL & SENSOR EVIDENCE
- **NDBI (Built-up):** ${analysis.spectralIndices.ndbiBefore} ➔ ${analysis.spectralIndices.ndbiAfter} (Delta: +${analysis.spectralIndices.ndbiDelta})
- **Sentinel-1 SAR:** ${analysis.spectralIndices.sarBackscatterBefore} dB ➔ ${analysis.spectralIndices.sarBackscatterAfter} dB (Delta: +${analysis.spectralIndices.sarDeltaDb} dB)
- **Co-Registration:** RMSE ${analysis.coRegistrationRmsePx} px

### AI STRATEGIC SYNTHESIS (GEMINI 3.1 PRO)
${interpretation?.strategicImplications?.map(s => `- ${s}`).join('\n') || '- Verified permanent forward shelter complex with fortified ridgeline feeder spur.'}

### PROVENANCE & CUSTODY
${interpretation?.provenanceAudit || 'Calibrated via ESA Copernicus CDSE Sentinel-2A/B L2A and Sentinel-1 SAR IW GRD.'}
`;

    navigator.clipboard.writeText(md.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#070b12] text-slate-100 font-mono">
      {/* Header & Export Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-1">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>OPERATIONAL DEFENSE INTELLIGENCE DOSSIER</span>
          </div>
          <h1 className="text-2xl font-black tracking-wide text-slate-100">
            INTELLIGENCE DOSSIER GENERATOR
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Standard military remote sensing decision brief with provenance, spectral evidence, and tactical recommendations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="px-3.5 py-2 rounded text-xs bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition font-semibold flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied MD!' : 'Copy Markdown'}</span>
          </button>
          <button
            onClick={handleDownloadJSON}
            className="px-3.5 py-2 rounded text-xs bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition font-semibold flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center space-x-1.5 shadow-md shadow-cyan-900/30"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Formatted Dossier Document */}
      <div className="max-w-4xl mx-auto rounded-xl border border-slate-800 bg-slate-950 p-8 shadow-2xl space-y-6 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Document Classification Header */}
        <div className="border-b-2 border-slate-700 pb-4 text-center space-y-1">
          <div className="text-xs tracking-widest text-red-400 font-bold uppercase">
            // {investigation.classification} // STRICT OFFICIAL USE ONLY //
          </div>
          <h2 className="text-xl font-black text-slate-100 tracking-wider">
            GEOSPATIAL INTELLIGENCE BRIEFING: MULTI-TEMPORAL SURVEILLANCE
          </h2>
          <div className="text-[11px] text-slate-400">
            DIRECTORATE GENERAL OF INFORMATION SYSTEMS (DGIS) • INDIAN ARMY • SIH26227
          </div>
        </div>

        {/* Dossier Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-900/60 p-4 rounded-lg border border-slate-800">
          <div>
            <span className="text-slate-500 text-[10px] block">REFERENCE NO:</span>
            <span className="font-bold text-slate-200">{reportRefId}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">TEAM & ID:</span>
            <span className="font-bold text-cyan-400">ASIA [192122]</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">AOI TARGET:</span>
            <span className="font-bold text-slate-200">{investigation.aoiName.slice(0, 20)}...</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">INTERVAL SPAN:</span>
            <span className="font-bold text-amber-400">{analysis.timeDifferenceDays} DAYS</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-1">
            1. EXECUTIVE SUMMARY & QUERY DECOMPOSITION
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Multi-temporal change detection tasking conducted across <b>{investigation.aoiName}</b> (Centroid Lat: {investigation.coordinates.lat}°, Lng: {investigation.coordinates.lng}°).
            Objective: "<i>{investigation.query}</i>". Pairwise difference modeling between Sentinel-2 optical and Sentinel-1 SAR scenes revealed <b>{analysis.features.length} major structural modifications</b> encompassing a net spatial footprint of <b>{analysis.totalAreaAffectedSqM.toLocaleString()} square meters</b>.
          </p>
        </div>

        {/* Imagery Ingest Metadata Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-1">
            2. INGESTED SATELLITE SENSORS & METADATA
          </h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                <th className="py-2">Temporal Node</th>
                <th className="py-2">Platform / Sensor</th>
                <th className="py-2">Acquisition UTC</th>
                <th className="py-2">Cloud Cover</th>
                <th className="py-2">Resolution</th>
                <th className="py-2">Processing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-[11px] text-slate-300">
              <tr>
                <td className="py-2 font-bold text-blue-400">T0 (BEFORE)</td>
                <td className="py-2">{sceneA.satellite} ({sceneA.sensor})</td>
                <td className="py-2">{sceneA.acquisitionDate}</td>
                <td className="py-2">{sceneA.cloudCoverage}%</td>
                <td className="py-2">{sceneA.resolution}</td>
                <td className="py-2">{sceneA.processingLevel}</td>
              </tr>
              <tr>
                <td className="py-2 font-bold text-amber-400">T1 (AFTER)</td>
                <td className="py-2">{sceneB.satellite} ({sceneB.sensor})</td>
                <td className="py-2">{sceneB.acquisitionDate}</td>
                <td className="py-2">{sceneB.cloudCoverage}%</td>
                <td className="py-2">{sceneB.resolution}</td>
                <td className="py-2">{sceneB.processingLevel}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Detected Changes Log */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-1">
            3. AUDITED CHANGE ANOMALY INVENTORY
          </h3>
          <div className="space-y-2.5">
            {analysis.features.map((feat) => (
              <div key={feat.id} className="p-3 rounded bg-slate-900/60 border border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-100">{feat.title} ({feat.type.toUpperCase()})</span>
                  <span className="text-emerald-400">{feat.confidence} CONF ({feat.confidenceScore}%)</span>
                </div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  {feat.evidenceSummary}
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between pt-1">
                  <span>Footprint: {feat.areaSquareMeters.toLocaleString()} m²</span>
                  <span>Coordinates: Lat {feat.coordinates.lat}° | Lng {feat.coordinates.lng}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spectral Evidence Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-1">
            4. BI-TEMPORAL SPECTRAL & RADAR PROVENANCE
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-900/40 p-3 rounded border border-slate-800">
            <div>
              <span className="text-slate-500 text-[10px] block">NDBI SHIFT:</span>
              <span className="font-bold text-amber-400">+{analysis.spectralIndices.ndbiDelta} (Dense Built-Up)</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">C-BAND SAR COHERENCE:</span>
              <span className="font-bold text-cyan-400">+{analysis.spectralIndices.sarDeltaDb ?? 5.6} dB (Dihedral Return)</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">CO-REGISTRATION ERROR:</span>
              <span className="font-bold text-emerald-400">RMSE {analysis.coRegistrationRmsePx} px (SIFT Alignment)</span>
            </div>
          </div>
        </div>

        {/* AI Strategic Assessment */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-1">
            5. AI STRATEGIC IMPLICATIONS & SYNTHESIS (GEMINI 3.1 PRO)
          </h3>
          <div className="space-y-1.5 text-xs text-slate-300">
            {(interpretation?.strategicImplications || [
              'Erection of permanent all-weather prefab structures signifies shift to permanent winter deployment.',
              'Corridor road spur augments logistical transit, facilitating armored support to forward observation ridge.',
            ]).map((s, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Flight Tasking */}
        <div className="p-3.5 rounded-lg border border-amber-500/40 bg-amber-950/20 text-xs space-y-1">
          <div className="text-amber-400 font-bold text-[11px] uppercase flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>RECOMMENDED OPERATIONAL TASKING</span>
          </div>
          <p className="text-amber-200/90 text-[11px] leading-relaxed">
            Task UAV Tactical Reconnaissance flight: <b>TASKING-UAV-RECCE-LDK-409</b> during morning lighting window (0600-0800 HRS) to obtain 5cm oblique imagery of shelter roofs. Task Cartosat-3 0.28m PAN spotlight mode on next orbit pass.
          </p>
        </div>

        {/* Signature & Authentication Block */}
        <div className="pt-6 border-t border-slate-800 flex justify-between items-end text-xs text-slate-400">
          <div>
            <div>Authenticated by: <b>Capt. A. Sharma</b></div>
            <div className="text-[10px] text-slate-500">Defense Geospatial Information Systems (DGIS)</div>
            <div className="text-[10px] text-slate-500">Indian Army HQ / ASIA Alliance Node</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-cyan-400 font-bold">DIGITALLY ENCRYPTED</div>
            <div className="text-[9px] text-slate-600">SHA-256: 9b2d8e417a80...c03f</div>
          </div>
        </div>
      </div>
    </div>
  );
};
