import React, { useState } from 'react';
import {
  SatelliteScene,
  SemanticSearchResult
} from '../../types';
import {
  Search,
  Filter,
  Sparkles,
  Sliders,
  Calendar,
  Layers,
  Satellite,
  Percent,
  Compass,
  ArrowRight,
  CheckCircle2,
  Tag,
  Eye,
  Info
} from 'lucide-react';

interface SemanticSearchViewProps {
  onSearch: (query: string) => Promise<SemanticSearchResult>;
  searchResult: SemanticSearchResult | null;
  allScenes: SatelliteScene[];
  onSelectSceneAsBefore: (scene: SatelliteScene) => void;
  onSelectSceneAsAfter: (scene: SatelliteScene) => void;
  selectedBeforeId: string;
  selectedAfterId: string;
  onLaunchInvestigation: (sceneA: SatelliteScene, sceneB: SatelliteScene, query: string) => void;
}

export const SemanticSearchView: React.FC<SemanticSearchViewProps> = ({
  onSearch,
  searchResult,
  allScenes,
  onSelectSceneAsBefore,
  onSelectSceneAsAfter,
  selectedBeforeId,
  selectedAfterId,
  onLaunchInvestigation,
}) => {
  const [query, setQuery] = useState(
    searchResult?.query ||
      'Find satellite scenes showing newly constructed concrete shelters and logistical roads around Pangong Tso between January and June 2026'
  );
  const [isSearching, setIsSearching] = useState(false);
  const [cloudFilter, setCloudFilter] = useState<number>(10);
  const [satelliteFilter, setSatelliteFilter] = useState<string>('ALL');
  const [resolutionFilter, setResolutionFilter] = useState<string>('ALL');

  const handleExecuteSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      await onSearch(query);
    } finally {
      setIsSearching(false);
    }
  };

  // Filter scenes
  const scenesToDisplay = (searchResult?.matchedScenes || allScenes.map((s) => ({
    scene: s,
    relevanceScore: 85,
    matchReason: 'General catalog scene matching default spatial buffer',
  }))).filter((item) => {
    if (item.scene.cloudCoverage > cloudFilter) return false;
    if (satelliteFilter !== 'ALL' && !item.scene.satellite.includes(satelliteFilter)) return false;
    if (resolutionFilter !== 'ALL' && !item.scene.resolution.includes(resolutionFilter)) return false;
    return true;
  });

  const selectedSceneA = allScenes.find((s) => s.id === selectedBeforeId) || allScenes[0];
  const selectedSceneB = allScenes.find((s) => s.id === selectedAfterId) || allScenes[1];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#070b12] text-slate-100 font-mono">
      {/* Search Header */}
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-1">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>NATURAL LANGUAGE MULTI-SPECTRAL & SAR RETRIEVAL</span>
        </div>
        <h1 className="text-2xl font-black tracking-wide text-slate-100">
          SEMANTIC SATELLITE SCENE SEARCH
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Translates natural language questions into spatio-temporal constraints, sensor wavelength requirements, and ranked satellite candidates.
        </p>
      </div>

      {/* Main Search Input Box */}
      <form onSubmit={handleExecuteSearch} className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 shadow-xl space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe what you want to find across satellite imagery..."
            className="w-full pl-11 pr-32 py-3 text-sm bg-slate-900/90 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-2 top-2 px-5 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs tracking-wider transition flex items-center space-x-1.5 shadow-md shadow-cyan-900/30"
          >
            {isSearching ? (
              <span>Retrieving...</span>
            ) : (
              <>
                <span>SEARCH</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400 gap-3">
          <div className="flex flex-wrap items-center gap-4">
            {/* Cloud slider */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-400">Max Cloud:</span>
              <input
                type="range"
                min="0"
                max="30"
                value={cloudFilter}
                onChange={(e) => setCloudFilter(Number(e.target.value))}
                className="w-20 accent-cyan-400 h-1"
              />
              <span className="text-cyan-400 font-bold">{cloudFilter}%</span>
            </div>

            {/* Satellite select */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] text-slate-400">Constellation:</span>
              <select
                value={satelliteFilter}
                onChange={(e) => setSatelliteFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Satellites</option>
                <option value="Sentinel-2">Sentinel-2 (Optical)</option>
                <option value="Sentinel-1">Sentinel-1 (SAR Radar)</option>
                <option value="Cartosat-3">Cartosat-3 (High-Res)</option>
                <option value="Landsat-9">Landsat-9 (Thermal/OLI)</option>
              </select>
            </div>

            {/* Resolution select */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] text-slate-400">Resolution:</span>
              <select
                value={resolutionFilter}
                onChange={(e) => setResolutionFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">Any Resolution</option>
                <option value="10m">10m (Sentinel)</option>
                <option value="0.28m">0.28m (Cartosat Spot)</option>
                <option value="15m">15m (Landsat Pan)</option>
              </select>
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            Matching Scenes: <span className="text-cyan-400 font-bold">{scenesToDisplay.length}</span>
          </div>
        </div>
      </form>

      {/* Semantic Decomposition Card (Query Understanding) */}
      {searchResult && (
        <div className="rounded-lg border border-cyan-500/30 bg-slate-950/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>SEMANTIC QUERY DECOMPOSITION & GEOSPATIAL EXTRACTION</span>
            </div>
            <span className="text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-300 px-2 py-0.5 rounded">
              STAC CATALOG READY
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Resolved AOI Location</div>
              <div className="font-bold text-slate-200 mt-0.5">{searchResult.extractedAOI.name}</div>
              <div className="text-[10px] text-cyan-400 mt-1">
                Lat: {searchResult.extractedAOI.coordinates.lat}° Lng: {searchResult.extractedAOI.coordinates.lng}°
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Temporal Window</div>
              <div className="font-bold text-slate-200 mt-0.5">
                {searchResult.extractedTemporal.startDate} ➔ {searchResult.extractedTemporal.endDate}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Bi-temporal multi-date pairing</div>
            </div>

            <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Detected Semantic Concepts</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {searchResult.detectedConcepts.map((c, i) => (
                  <span key={i} className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.2 rounded">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Recommended Sensor Constellation</div>
              <div className="text-slate-200 mt-0.5 font-semibold text-[11px]">
                {searchResult.suggestedSensors.join(' • ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Pair Quick Action Dock */}
      <div className="flex flex-wrap items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-slate-950/90 gap-3">
        <div className="flex items-center space-x-4 text-xs">
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">T0 (BEFORE) SELECTED:</span>
            <span className="text-blue-400 font-bold">{selectedSceneA.name.slice(0, 36)}...</span>
          </div>
          <span className="text-slate-600 font-bold">VS</span>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">T1 (AFTER) SELECTED:</span>
            <span className="text-amber-400 font-bold">{selectedSceneB.name.slice(0, 36)}...</span>
          </div>
        </div>

        <button
          onClick={() => onLaunchInvestigation(selectedSceneA, selectedSceneB, query)}
          className="px-4 py-2 rounded-md bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold text-xs tracking-wider transition shadow-lg shadow-cyan-900/30 flex items-center space-x-2"
        >
          <span>LAUNCH MULTI-TEMPORAL INVESTIGATION</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Ranked Satellite Scenes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenesToDisplay.map((item) => {
          const sc = item.scene;
          const isBefore = sc.id === selectedBeforeId;
          const isAfter = sc.id === selectedAfterId;

          return (
            <div
              key={sc.id}
              className={`flex flex-col justify-between rounded-lg border transition overflow-hidden bg-slate-950/70 ${
                isBefore
                  ? 'border-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : isAfter
                  ? 'border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Scene Thumbnail + Badges */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={sc.previewUrl}
                  alt={sc.name}
                  className="w-full h-full object-cover transition duration-300 hover:scale-105"
                />

                {/* Relevance badge */}
                <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-sm px-2 py-0.5 rounded border border-cyan-500/40 text-[10px] font-bold text-cyan-300">
                  RELEVANCE: {item.relevanceScore}%
                </div>

                {/* Cloud & Resolution Badge */}
                <div className="absolute top-2 right-2 bg-slate-950/85 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-700 text-[10px] text-slate-300">
                  Cloud: {sc.cloudCoverage}% | Res: {sc.resolution}
                </div>

                {/* Selection state marker */}
                {isBefore && (
                  <div className="absolute bottom-2 left-2 bg-blue-600/90 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                    SELECTED AS BEFORE (T0)
                  </div>
                )}
                {isAfter && (
                  <div className="absolute bottom-2 left-2 bg-amber-600/90 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                    SELECTED AS AFTER (T1)
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2.5 flex-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-cyan-400">{sc.satellite}</span>
                  <span>{sc.acquisitionDate.slice(0, 10)}</span>
                </div>

                <h3 className="text-xs font-bold text-slate-200 line-clamp-1">
                  {sc.locationName}
                </h3>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {item.matchReason}
                </p>

                {/* Bands Badges */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {sc.bands.map((b) => (
                    <span
                      key={b.name}
                      className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded"
                      title={b.description}
                    >
                      {b.name}
                    </span>
                  ))}
                </div>

                {/* Sensor Telemetry info */}
                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 space-y-0.5">
                  <div>Sensor: {sc.sensor}</div>
                  <div>Processing: {sc.processingLevel} | Orbit: {sc.orbitNumber}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-slate-900/60 border-t border-slate-800 flex items-center space-x-2 text-xs">
                <button
                  onClick={() => onSelectSceneAsBefore(sc)}
                  className={`flex-1 py-1.5 rounded text-center transition font-semibold ${
                    isBefore
                      ? 'bg-blue-600 text-white border border-blue-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700'
                  }`}
                >
                  Set as BEFORE (T0)
                </button>
                <button
                  onClick={() => onSelectSceneAsAfter(sc)}
                  className={`flex-1 py-1.5 rounded text-center transition font-semibold ${
                    isAfter
                      ? 'bg-amber-600 text-white border border-amber-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                  }`}
                >
                  Set as AFTER (T1)
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
