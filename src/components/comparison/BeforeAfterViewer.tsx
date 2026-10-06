import React, { useState, useEffect, useRef } from 'react';
import { SatelliteScene, ChangeFeature, ChangeAnalysisResult } from '../../types';
import {
  SplitSquareVertical,
  Columns,
  Sparkles,
  Flame,
  Layers,
  Info,
  Calendar,
  Satellite,
  Percent,
  Compass,
  Eye,
  EyeOff,
  Maximize2,
  Crosshair
} from 'lucide-react';

interface BeforeAfterViewerProps {
  sceneA: SatelliteScene;
  sceneB: SatelliteScene;
  analysis?: ChangeAnalysisResult;
  selectedFeatureId?: string | null;
  onSelectFeature?: (feature: ChangeFeature) => void;
}

export const BeforeAfterViewer: React.FC<BeforeAfterViewerProps> = ({
  sceneA,
  sceneB,
  analysis,
  selectedFeatureId,
  onSelectFeature,
}) => {
  type Mode = 'slider' | 'side-by-side' | 'flicker' | 'difference';
  const [mode, setMode] = useState<Mode>('slider');
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0-100
  const [flickerState, setFlickerState] = useState<'A' | 'B'>('A');
  const [flickerSpeed, setFlickerSpeed] = useState<number>(1000); // ms
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [differenceThreshold, setDifferenceThreshold] = useState<number>(45);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Flicker comparator loop
  useEffect(() => {
    if (mode !== 'flicker') return;
    const interval = setInterval(() => {
      setFlickerState((prev) => (prev === 'A' ? 'B' : 'A'));
    }, flickerSpeed);
    return () => clearInterval(interval);
  }, [mode, flickerSpeed]);

  // Handle slider drag
  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#070b12] text-slate-100 rounded-lg border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-2.5 backdrop-blur-md gap-3">
        {/* Left: Mode switcher */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-md border border-slate-800">
          <button
            onClick={() => setMode('slider')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono rounded transition ${
              mode === 'slider'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Split Curtain</span>
          </button>
          <button
            onClick={() => setMode('side-by-side')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono rounded transition ${
              mode === 'side-by-side'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
          <button
            onClick={() => setMode('flicker')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono rounded transition ${
              mode === 'flicker'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Blink Comparator</span>
          </button>
          <button
            onClick={() => setMode('difference')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono rounded transition ${
              mode === 'difference'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Delta Heatmap</span>
          </button>
        </div>

        {/* Center: Metadata Badges */}
        <div className="hidden lg:flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="font-semibold text-slate-300">BEFORE (T0):</span>
            <span className="text-blue-400">{sceneA.acquisitionDate.slice(0, 10)}</span>
            <span className="text-slate-600">[{sceneA.satellite}]</span>
          </div>
          <span className="text-slate-700">➔</span>
          <div className="flex items-center space-x-1 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="font-semibold text-slate-300">AFTER (T1):</span>
            <span className="text-amber-400">{sceneB.acquisitionDate.slice(0, 10)}</span>
            <span className="text-slate-600">[{sceneB.satellite}]</span>
          </div>
        </div>

        {/* Right: Overlays & Options */}
        <div className="flex items-center space-x-2">
          {mode === 'flicker' && (
            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-300">
              <span className="text-slate-400 text-[11px]">RATE:</span>
              <button
                onClick={() => setFlickerSpeed(1000)}
                className={`px-1.5 py-0.5 rounded text-[10px] ${flickerSpeed === 1000 ? 'bg-cyan-500/30 text-cyan-300' : 'text-slate-400'}`}
              >
                1Hz
              </button>
              <button
                onClick={() => setFlickerSpeed(500)}
                className={`px-1.5 py-0.5 rounded text-[10px] ${flickerSpeed === 500 ? 'bg-cyan-500/30 text-cyan-300' : 'text-slate-400'}`}
              >
                2Hz
              </button>
              <button
                onClick={() => setFlickerSpeed(250)}
                className={`px-1.5 py-0.5 rounded text-[10px] ${flickerSpeed === 250 ? 'bg-cyan-500/30 text-cyan-300' : 'text-slate-400'}`}
              >
                4Hz
              </button>
            </div>
          )}

          {mode === 'difference' && (
            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-300">
              <span className="text-slate-400 text-[11px]">SENSITIVITY:</span>
              <input
                type="range"
                min="10"
                max="90"
                value={differenceThreshold}
                onChange={(e) => setDifferenceThreshold(Number(e.target.value))}
                className="w-16 accent-cyan-400 h-1"
              />
              <span className="text-cyan-400 text-[10px]">{differenceThreshold}%</span>
            </div>
          )}

          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-mono rounded border transition ${
              showOverlays
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            {showOverlays ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Vector Anomaly Polygons</span>
          </button>
        </div>
      </div>

      {/* Main Imagery Comparison Canvas */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative flex-1 min-h-[460px] w-full bg-slate-950 overflow-hidden select-none cursor-crosshair"
      >
        {/* MODE 1: SPLIT CURTAIN SLIDER */}
        {mode === 'slider' && (
          <div className="relative w-full h-full">
            {/* Base: AFTER Image (Scene B) */}
            <div className="absolute inset-0">
              <img
                src={sceneB.previewUrl}
                alt="Scene B (After)"
                className="w-full h-full object-cover filter contrast-105"
              />
              <div className="absolute bottom-3 right-3 bg-slate-950/80 px-2 py-1 rounded border border-slate-800 text-[11px] font-mono text-amber-400">
                AFTER: {sceneB.acquisitionDate.slice(0, 10)} // {sceneB.satellite}
              </div>
            </div>

            {/* Clipped Top: BEFORE Image (Scene A) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={sceneA.previewUrl}
                alt="Scene A (Before)"
                className="w-full h-full object-cover filter contrast-105"
                style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw' }}
              />
              <div className="absolute bottom-3 left-3 bg-slate-950/80 px-2 py-1 rounded border border-slate-800 text-[11px] font-mono text-blue-400">
                BEFORE: {sceneA.acquisitionDate.slice(0, 10)} // {sceneA.satellite}
              </div>
            </div>

            {/* Draggable Divider Line */}
            <div
              className="absolute top-0 bottom-0 z-30 cursor-ew-resize flex items-center justify-center"
              style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
              onMouseDown={handleMouseDown}
            >
              <div className="w-[2px] h-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
              <div className="absolute w-8 h-8 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-xl backdrop-blur-sm">
                <SplitSquareVertical className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: SIDE-BY-SIDE */}
        {mode === 'side-by-side' && (
          <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full gap-1 p-1 bg-slate-900">
            {/* Left Box: Scene A */}
            <div className="relative h-full overflow-hidden rounded border border-slate-800 bg-slate-950">
              <img
                src={sceneA.previewUrl}
                alt="Scene A (Before)"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-slate-950/85 px-2 py-1 rounded border border-blue-500/50 text-[11px] font-mono text-blue-400">
                T0 (BEFORE) // {sceneA.acquisitionDate.slice(0, 10)}
              </div>
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-400 bg-slate-950/70 px-1.5 py-0.5 rounded">
                Cloud: {sceneA.cloudCoverage}% | Sun: {sceneA.sunElevation}° | {sceneA.processingLevel}
              </div>
            </div>

            {/* Right Box: Scene B */}
            <div className="relative h-full overflow-hidden rounded border border-slate-800 bg-slate-950">
              <img
                src={sceneB.previewUrl}
                alt="Scene B (After)"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-slate-950/85 px-2 py-1 rounded border border-amber-500/50 text-[11px] font-mono text-amber-400">
                T1 (AFTER) // {sceneB.acquisitionDate.slice(0, 10)}
              </div>
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-400 bg-slate-950/70 px-1.5 py-0.5 rounded">
                Cloud: {sceneB.cloudCoverage}% | Sun: {sceneB.sunElevation}° | {sceneB.processingLevel}
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: FLICKER COMPARATOR */}
        {mode === 'flicker' && (
          <div className="relative w-full h-full">
            <img
              src={flickerState === 'A' ? sceneA.previewUrl : sceneB.previewUrl}
              alt="Flicker Frame"
              className="w-full h-full object-cover transition-opacity duration-75"
            />
            {/* Tactical Indicator */}
            <div className="absolute top-3 left-3 flex items-center space-x-2 bg-slate-950/90 px-3 py-1.5 rounded border border-cyan-500/40 text-xs font-mono shadow-lg">
              <span className={`w-2.5 h-2.5 rounded-full ${flickerState === 'A' ? 'bg-blue-500' : 'bg-amber-500'}`} />
              <span className="text-slate-300">ACTIVE FRAME:</span>
              <span className={`font-bold ${flickerState === 'A' ? 'text-blue-400' : 'text-amber-400'}`}>
                {flickerState === 'A' ? `T0 BEFORE (${sceneA.acquisitionDate.slice(0, 10)})` : `T1 AFTER (${sceneB.acquisitionDate.slice(0, 10)})`}
              </span>
            </div>
            <div className="absolute bottom-3 right-3 bg-slate-950/80 px-2 py-1 rounded border border-slate-800 text-[11px] font-mono text-slate-400">
              Defense Blink Comparator Active // {1000 / flickerSpeed} FPS Alternation
            </div>
          </div>
        )}

        {/* MODE 4: SPECTRAL DELTA HEATMAP */}
        {mode === 'difference' && (
          <div className="relative w-full h-full bg-slate-950">
            {/* Base imagery */}
            <img
              src={sceneB.previewUrl}
              alt="Difference Base"
              className="w-full h-full object-cover filter grayscale contrast-125 opacity-40"
            />
            {/* Simulated False-Color Spectral Difference Heatmap Overlay */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-screen"
              style={{
                background: `radial-gradient(circle at 45% 40%, rgba(239, 68, 68, ${differenceThreshold / 100}) 0%, rgba(245, 158, 11, ${differenceThreshold / 140}) 25%, transparent 55%),
                             radial-gradient(circle at 35% 65%, rgba(245, 158, 11, ${differenceThreshold / 120}) 0%, rgba(234, 179, 8, ${differenceThreshold / 160}) 20%, transparent 45%),
                             radial-gradient(circle at 75% 55%, rgba(16, 185, 129, ${differenceThreshold / 130}) 0%, transparent 35%)`,
              }}
            />
            {/* Heatmap Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-950/90 p-2.5 rounded border border-slate-800 font-mono text-xs">
              <div className="text-slate-300 font-semibold mb-1.5 flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span>SPECTRAL DIFFERENCE INTENSITY (ΔNDBI + ΔSAR)</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px]">
                <div className="w-4 h-2 bg-red-600 rounded-sm"></div>
                <span className="text-red-300">Severe (+0.30 NDBI) Structural Built-Up</span>
                <div className="w-4 h-2 bg-amber-500 rounded-sm ml-2"></div>
                <span className="text-amber-300">Linear Road Network</span>
                <div className="w-4 h-2 bg-yellow-400 rounded-sm ml-2"></div>
                <span className="text-yellow-300">Excavation / Trench</span>
              </div>
            </div>
          </div>
        )}

        {/* Change Polygons / Target Callouts (Overlaid if toggled on) */}
        {showOverlays && analysis && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Anomaly 1: Shelter Complex */}
            <div
              className="absolute top-[35%] left-[45%] pointer-events-auto cursor-pointer transition transform hover:scale-105"
              onClick={() => onSelectFeature && onSelectFeature(analysis.features[0])}
            >
              <div className="relative">
                <div className="w-24 h-16 border-2 border-red-500 bg-red-500/20 rounded shadow-[0_0_12px_rgba(239,68,68,0.6)] flex flex-col justify-between p-1">
                  <span className="text-[9px] font-mono font-bold bg-red-950 text-red-200 px-1 py-0.5 rounded w-max border border-red-500/50">
                    ANOMALY-01
                  </span>
                  <span className="text-[10px] font-mono text-red-300 font-semibold truncate">
                    Fortified Shelters
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Anomaly 2: Road Spur */}
            <div
              className="absolute top-[55%] left-[32%] pointer-events-auto cursor-pointer transition transform hover:scale-105"
              onClick={() => onSelectFeature && onSelectFeature(analysis.features[1])}
            >
              <div className="w-28 h-10 border-2 border-amber-500 bg-amber-500/20 rounded rotate-[-12deg] shadow-[0_0_12px_rgba(245,158,11,0.6)] flex items-center justify-between px-1.5">
                <span className="text-[9px] font-mono font-bold bg-amber-950 text-amber-200 px-1 py-0.5 rounded border border-amber-500/50">
                  ANOMALY-02
                </span>
                <span className="text-[9px] font-mono text-amber-300 font-semibold">
                  Feeder Road Spur
                </span>
              </div>
            </div>

            {/* Anomaly 3: Earthworks */}
            <div
              className="absolute top-[65%] left-[62%] pointer-events-auto cursor-pointer transition transform hover:scale-105"
              onClick={() => onSelectFeature && onSelectFeature(analysis.features[2])}
            >
              <div className="w-20 h-14 border-2 border-yellow-500 bg-yellow-500/20 rounded shadow-[0_0_12px_rgba(234,179,8,0.6)] flex flex-col justify-between p-1">
                <span className="text-[9px] font-mono font-bold bg-yellow-950 text-yellow-200 px-1 py-0.5 rounded w-max border border-yellow-500/50">
                  ANOMALY-03
                </span>
                <span className="text-[9px] font-mono text-yellow-300 font-semibold truncate">
                  Trench Perimeter
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Feature Details Drawer */}
      {analysis && (
        <div className="bg-slate-950 border-t border-slate-800 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-slate-400">DETECTED CHANGE REGIONS:</span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
                {analysis.features.length} CONFIRMED
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Total Footprint: {analysis.totalAreaAffectedSqM.toLocaleString()} m²
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Co-Registration Alignment: <span className="text-emerald-400">RMSE {analysis.coRegistrationRmsePx} px</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {analysis.features.map((feat) => {
              const isSelected = feat.id === selectedFeatureId;
              return (
                <div
                  key={feat.id}
                  onClick={() => onSelectFeature && onSelectFeature(feat)}
                  className={`p-2 rounded border cursor-pointer transition ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="font-semibold text-slate-200">{feat.title}</span>
                    <span
                      className={`px-1 py-0.5 rounded text-[10px] ${
                        feat.confidence === 'HIGH'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {feat.confidence} ({feat.confidenceScore}%)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mb-1">
                    {feat.evidenceSummary}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Area: {feat.areaSquareMeters.toLocaleString()} m²</span>
                    <span>Lat: {feat.coordinates.lat.toFixed(4)}° Lng: {feat.coordinates.lng.toFixed(4)}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
