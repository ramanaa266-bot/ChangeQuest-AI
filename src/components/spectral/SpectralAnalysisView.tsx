import React, { useState } from 'react';
import {
  SatelliteScene,
  SpectralValues
} from '../../types';
import {
  Activity,
  Droplets,
  Building2,
  Radio,
  Flame,
  Info,
  Calendar,
  Satellite,
  Percent,
  Compass,
  ArrowRight
} from 'lucide-react';

interface SpectralAnalysisViewProps {
  sceneA: SatelliteScene;
  sceneB: SatelliteScene;
  spectralData: SpectralValues;
  onNavigateToWorkspace: () => void;
}

export const SpectralAnalysisView: React.FC<SpectralAnalysisViewProps> = ({
  sceneA,
  sceneB,
  spectralData,
  onNavigateToWorkspace,
}) => {
  type IndexType = 'NDBI' | 'NDVI' | 'NDWI' | 'SAR';
  const [selectedIndex, setSelectedIndex] = useState<IndexType>('NDBI');

  const indexDefinitions = {
    NDBI: {
      name: 'Normalized Difference Built-Up Index (NDBI)',
      formula: '(SWIR - NIR) / (SWIR + NIR)  [Sentinel-2 B11 vs B08]',
      description:
        'Sensitive to impervious artificial surfaces like asphalt, concrete, pre-engineered buildings, and metal roofing. Highly elevated values indicate new urban/military construction.',
      beforeVal: spectralData.ndbiBefore,
      afterVal: spectralData.ndbiAfter,
      delta: spectralData.ndbiDelta,
      interpretation:
        'A +0.27 surge in NDBI is a definitive indicator of newly paved roads and compacted concrete foundation pads erected between January and June.',
      color: 'text-amber-400',
      barColor: 'bg-amber-500',
    },
    NDVI: {
      name: 'Normalized Difference Vegetation Index (NDVI)',
      formula: '(NIR - Red) / (NIR + Red)  [Sentinel-2 B08 vs B04]',
      description:
        'Quantifies photosynthetic biomass and chlorophyll health. Negative delta signifies deforestation, clear-cutting, surface stripping, or earthworks.',
      beforeVal: spectralData.ndviBefore,
      afterVal: spectralData.ndviAfter,
      delta: spectralData.ndviDelta,
      interpretation:
        'Slight decrease (-0.03) reflects scree removal and natural barren ground clearing for the access road.',
      color: 'text-emerald-400',
      barColor: 'bg-emerald-500',
    },
    NDWI: {
      name: 'Normalized Difference Water Index (NDWI)',
      formula: '(Green - NIR) / (Green + NIR)  [Sentinel-2 B03 vs B08]',
      description:
        'Delineates open water bodies, lake shores, drainage channels, and water content in vegetation.',
      beforeVal: spectralData.ndwiBefore,
      afterVal: spectralData.ndwiAfter,
      delta: spectralData.ndwiDelta,
      interpretation:
        'Shoreline of Pangong Tso remained stable within ±0.01 NDWI variance across the bi-temporal interval.',
      color: 'text-cyan-400',
      barColor: 'bg-cyan-500',
    },
    SAR: {
      name: 'Sentinel-1 C-Band SAR Radar Coherence & Backscatter (Sigma-0)',
      formula: '10 * log10(Sigma0_VV) [Sentinel-1 IW GRD C-Band (5.4 GHz)]',
      description:
        'All-weather day-and-night microwave radar reflectivity. Sharp double-bounce return indicates artificial vertical surfaces, metallic walls, and wire fencing.',
      beforeVal: `${spectralData.sarBackscatterBefore ?? -14.2} dB`,
      afterVal: `${spectralData.sarBackscatterAfter ?? -8.6} dB`,
      delta: `${spectralData.sarDeltaDb ?? '+5.6'} dB`,
      interpretation:
        '+5.6 dB increase in radar double-bounce dihedral return confirms artificial vertical structures that cannot be explained by natural topography.',
      color: 'text-blue-400',
      barColor: 'bg-blue-500',
    },
  };

  const current = indexDefinitions[selectedIndex];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#070b12] text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-1">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>REMOTE-SENSING BI-TEMPORAL SPECTRAL INDICES</span>
          </div>
          <h1 className="text-2xl font-black tracking-wide text-slate-100">
            SPECTRAL TRANSFORM & RADAR COHERENCE
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Comparing Bottom-of-Atmosphere (BOA) spectral band ratios and Sentinel-1 SAR Sigma-0 backscatter.
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

      {/* Index Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* NDBI */}
        <div
          onClick={() => setSelectedIndex('NDBI')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            selectedIndex === 'NDBI'
              ? 'bg-amber-950/30 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] bg-amber-950 border border-amber-800 text-amber-300 px-1.5 py-0.5 rounded font-bold">
              BUILT-UP
            </span>
          </div>
          <div className="text-xs font-bold text-slate-200">NDBI Index</div>
          <div className="text-xl font-black text-amber-400 mt-1">
            +{spectralData.ndbiDelta}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Concrete & Pavement Detection
          </div>
        </div>

        {/* SAR */}
        <div
          onClick={() => setSelectedIndex('SAR')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            selectedIndex === 'SAR'
              ? 'bg-blue-950/30 border-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Radio className="w-5 h-5 text-blue-400" />
            <span className="text-[10px] bg-blue-950 border border-blue-800 text-blue-300 px-1.5 py-0.5 rounded font-bold">
              RADAR
            </span>
          </div>
          <div className="text-xs font-bold text-slate-200">Sentinel-1 SAR</div>
          <div className="text-xl font-black text-blue-400 mt-1">
            +{spectralData.sarDeltaDb ?? 5.6} dB
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Double-Bounce Dihedral Scatter
          </div>
        </div>

        {/* NDVI */}
        <div
          onClick={() => setSelectedIndex('NDVI')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            selectedIndex === 'NDVI'
              ? 'bg-emerald-950/30 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
              BIOMASS
            </span>
          </div>
          <div className="text-xs font-bold text-slate-200">NDVI Index</div>
          <div className="text-xl font-black text-emerald-400 mt-1">
            {spectralData.ndviDelta}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Canopy Clearing & Defoliation
          </div>
        </div>

        {/* NDWI */}
        <div
          onClick={() => setSelectedIndex('NDWI')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            selectedIndex === 'NDWI'
              ? 'bg-cyan-950/30 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Droplets className="w-5 h-5 text-cyan-400" />
            <span className="text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-300 px-1.5 py-0.5 rounded font-bold">
              WATER
            </span>
          </div>
          <div className="text-xs font-bold text-slate-200">NDWI Index</div>
          <div className="text-xl font-black text-cyan-400 mt-1">
            +{spectralData.ndwiDelta}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Hydrology & Lake Boundary
          </div>
        </div>
      </div>

      {/* Selected Index Detailed Breakdown Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase">ACTIVE SPECTRAL METRIC:</div>
            <h2 className="text-lg font-bold text-slate-100">{current.name}</h2>
          </div>
          <div className="text-xs bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-cyan-300 font-mono">
            {current.formula}
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {current.description}
        </p>

        {/* Comparison Bar Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* T0 Before */}
          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-[10px] text-blue-400 font-bold uppercase flex items-center justify-between">
              <span>T0 (BEFORE): {sceneA.acquisitionDate.slice(0, 10)}</span>
              <span>{sceneA.satellite}</span>
            </div>
            <div className="text-2xl font-black text-slate-200">{current.beforeVal}</div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[40%]"></div>
            </div>
            <div className="text-[10px] text-slate-500">Baseline pre-construction status</div>
          </div>

          {/* T1 After */}
          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-[10px] text-amber-400 font-bold uppercase flex items-center justify-between">
              <span>T1 (AFTER): {sceneB.acquisitionDate.slice(0, 10)}</span>
              <span>{sceneB.satellite}</span>
            </div>
            <div className="text-2xl font-black text-slate-200">{current.afterVal}</div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full w-[78%]"></div>
            </div>
            <div className="text-[10px] text-slate-500">Current post-activity observation</div>
          </div>

          {/* Delta */}
          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-[10px] text-emerald-400 font-bold uppercase flex items-center justify-between">
              <span>TEMPORAL DELTA SHIFT</span>
              <span>CONFIDENCE 94%</span>
            </div>
            <div className="text-2xl font-black text-emerald-400">{current.delta}</div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className={`${current.barColor} h-full w-[65%]`}></div>
            </div>
            <div className="text-[10px] text-slate-500">Net physical property transformation</div>
          </div>
        </div>

        {/* Defense Intelligence Interpretation */}
        <div className="p-3.5 rounded-lg bg-slate-900/80 border border-cyan-900/50 text-xs space-y-1">
          <div className="text-cyan-400 font-bold text-[11px] uppercase">
            GEOSPATIAL INTELLIGENCE INTERPRETATION
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            {current.interpretation}
          </p>
        </div>
      </div>
    </div>
  );
};
