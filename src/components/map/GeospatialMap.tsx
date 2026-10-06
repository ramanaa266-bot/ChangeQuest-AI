import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LatLng, BoundingBox, ChangeFeature } from '../../types';
import { Layers, Crosshair, ZoomIn, ZoomOut, Maximize2, Compass } from 'lucide-react';

interface GeospatialMapProps {
  center: LatLng;
  zoom?: number;
  bounds?: BoundingBox;
  features?: ChangeFeature[];
  selectedFeatureId?: string | null;
  onSelectFeature?: (feature: ChangeFeature) => void;
  showChangeOverlay?: boolean;
  activeLayerType?: 'satellite' | 'dark' | 'topo';
  overlayMode?: 'polygons' | 'heatmap' | 'none';
  height?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

export const GeospatialMap: React.FC<GeospatialMapProps> = ({
  center,
  zoom = 13,
  bounds,
  features = [],
  selectedFeatureId,
  onSelectFeature,
  showChangeOverlay = true,
  activeLayerType = 'satellite',
  overlayMode = 'polygons',
  height = '500px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const overlayGroupRef = useRef<L.LayerGroup | null>(null);

  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [cursorCoords, setCursorCoords] = useState<LatLng>(center);
  const [layerType, setLayerType] = useState<'satellite' | 'dark' | 'topo'>(activeLayerType);

  // Basemap URLs
  const TILE_SERVERS = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  };

  const ATTRIBUTIONS = {
    satellite: 'Esri, Maxar, Earthstar Geographics, CNES/Airbus DS',
    dark: '&copy; OpenStreetMap contributors &copy; CARTO',
    topo: 'OpenTopoMap (CC-BY-SA)',
  };

  // Convert lat/lng to approximate MGRS for military UI styling
  const toMockMGRS = (lat: number, lng: number) => {
    const zone = Math.floor((lng + 180) / 6) + 1;
    const latBand = 'S';
    const easting = Math.floor(Math.abs(lng * 10000) % 100000).toString().padStart(5, '0');
    const northing = Math.floor(Math.abs(lat * 10000) % 100000).toString().padStart(5, '0');
    return `${zone}${latBand} FU ${easting.slice(0, 3)} ${northing.slice(0, 3)}`;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Add default tile layer
      const tiles = L.tileLayer(TILE_SERVERS[layerType], {
        maxZoom: 19,
        attribution: ATTRIBUTIONS[layerType],
      }).addTo(map);

      tileLayerRef.current = tiles;

      // Create overlay group
      const overlayGroup = L.layerGroup().addTo(map);
      overlayGroupRef.current = overlayGroup;

      map.on('mousemove', (e: L.LeafletMouseEvent) => {
        setCursorCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([center.lat, center.lng], zoom);
    }

    return () => {
      // Don't destroy immediately if parent re-renders quickly, or destroy on unmount
    };
  }, [center.lat, center.lng, zoom]);

  // Update tile server on layer change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const newTiles = L.tileLayer(TILE_SERVERS[layerType], {
      maxZoom: 19,
      attribution: ATTRIBUTIONS[layerType],
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTiles;
  }, [layerType]);

  // Update feature overlays and bounding boxes
  useEffect(() => {
    if (!mapInstanceRef.current || !overlayGroupRef.current) return;
    overlayGroupRef.current.clearLayers();

    if (!showChangeOverlay || overlayMode === 'none') return;

    // Add AOI bounding box if provided
    if (bounds) {
      const boundsRect = L.rectangle(
        [
          [bounds.south, bounds.west],
          [bounds.north, bounds.east],
        ],
        {
          color: '#06b6d4', // cyan-500
          weight: 2,
          dashArray: '6, 6',
          fillColor: '#06b6d4',
          fillOpacity: 0.05,
        }
      );
      boundsRect.bindTooltip('MISSION AOI BOUNDARY', { permanent: false, direction: 'top', className: 'text-xs font-mono bg-slate-900 border border-cyan-500/50 text-cyan-400 px-2 py-1' });
      overlayGroupRef.current.addLayer(boundsRect);
    }

    // Add change polygons
    features.forEach((feat) => {
      const isSelected = feat.id === selectedFeatureId;
      const polyCoords: [number, number][] = feat.polygon.map((p) => [p.lat, p.lng]);

      const polyColor =
        feat.type === 'structure'
          ? '#ef4444' // red for structures
          : feat.type === 'road'
          ? '#f59e0b' // amber for road
          : feat.type === 'earthwork'
          ? '#eab308' // yellow
          : '#10b981'; // green for vegetation/other

      const polygon = L.polygon(polyCoords, {
        color: polyColor,
        weight: isSelected ? 3 : 2,
        dashArray: isSelected ? undefined : '4, 4',
        fillColor: polyColor,
        fillOpacity: isSelected ? 0.35 : 0.2,
      });

      // Tooltip
      polygon.bindTooltip(
        `<div class="font-mono text-xs">
          <div class="font-bold text-slate-100">${feat.title}</div>
          <div class="text-cyan-400">Area: ${feat.areaSquareMeters.toLocaleString()} m² | Conf: ${feat.confidenceScore}%</div>
        </div>`,
        {
          direction: 'top',
          className: 'bg-slate-950/90 text-slate-200 border border-slate-700 rounded p-1 shadow-lg backdrop-blur-sm',
        }
      );

      polygon.on('click', () => {
        if (onSelectFeature) onSelectFeature(feat);
      });

      overlayGroupRef.current?.addLayer(polygon);

      // Centroid marker with pulsing icon
      const centerMarker = L.circleMarker([feat.coordinates.lat, feat.coordinates.lng], {
        radius: isSelected ? 7 : 5,
        color: '#ffffff',
        weight: 1.5,
        fillColor: polyColor,
        fillOpacity: 0.9,
      });

      centerMarker.on('click', () => {
        if (onSelectFeature) onSelectFeature(feat);
      });

      overlayGroupRef.current?.addLayer(centerMarker);
    });
  }, [features, bounds, showChangeOverlay, overlayMode, selectedFeatureId, onSelectFeature]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleRecenter = () => mapInstanceRef.current?.setView([center.lat, center.lng], zoom);

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-slate-800 bg-[#070b12]" style={{ height }}>
      {/* Tactical HUD Header */}
      <div className="absolute top-2 left-2 z-[400] flex items-center space-x-2 bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded border border-slate-800 text-[11px] font-mono text-slate-300 pointer-events-auto shadow-md">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-cyan-400 font-semibold">GEOSPATIAL FEED:</span>
        <span>LAT {cursorCoords.lat.toFixed(5)}°</span>
        <span className="text-slate-600">|</span>
        <span>LNG {cursorCoords.lng.toFixed(5)}°</span>
        <span className="text-slate-600">|</span>
        <span className="text-amber-400">MGRS: {toMockMGRS(cursorCoords.lat, cursorCoords.lng)}</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400">ZOOM {currentZoom}x</span>
      </div>

      {/* Layer selector & Controls */}
      <div className="absolute top-2 right-2 z-[400] flex items-center space-x-1 bg-slate-950/85 backdrop-blur-md p-1 rounded border border-slate-800 text-xs font-mono pointer-events-auto shadow-md">
        <button
          onClick={() => setLayerType('satellite')}
          className={`px-2 py-1 rounded transition-colors ${
            layerType === 'satellite' ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Satellite Imagery"
        >
          Sat Optical
        </button>
        <button
          onClick={() => setLayerType('dark')}
          className={`px-2 py-1 rounded transition-colors ${
            layerType === 'dark' ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Tactical Dark Vector"
        >
          Dark Vector
        </button>
        <button
          onClick={() => setLayerType('topo')}
          className={`px-2 py-1 rounded transition-colors ${
            layerType === 'topo' ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Topographic Contours"
        >
          Topo Elevation
        </button>
      </div>

      {/* Floating Tactical Tools Toolbar */}
      <div className="absolute right-2 bottom-8 z-[400] flex flex-col space-y-1 bg-slate-950/85 backdrop-blur-md p-1 rounded border border-slate-800 text-slate-300 pointer-events-auto shadow-md">
        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-cyan-400 transition"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-cyan-400 transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleRecenter}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-cyan-400 transition"
          title="Recenter AOI"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* North Indicator / Compass */}
      <div className="absolute left-3 bottom-3 z-[400] flex items-center space-x-1.5 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded border border-slate-800 text-[10px] font-mono text-slate-400">
        <Compass className="w-3.5 h-3.5 text-cyan-400" />
        <span>NORTH 000°</span>
        <span className="text-slate-600">|</span>
        <span>WGS84 EPSG:4326</span>
      </div>

      {/* Map Target Reticle in Center */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-[300] opacity-30">
        <div className="w-8 h-8 border border-cyan-400/40 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
        </div>
      </div>

      {/* Actual Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
};
