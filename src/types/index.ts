export type UserRole = 'ADMIN' | 'ANALYST' | 'RESEARCHER' | 'VIEWER';

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface SatelliteBand {
  name: string;
  wavelength: string;
  resolution: string;
  description: string;
}

export interface SatelliteScene {
  id: string;
  name: string;
  satellite: 'Sentinel-2A' | 'Sentinel-2B' | 'Sentinel-1A SAR' | 'Landsat-9' | 'Cartosat-3' | 'WorldView-3';
  sensor: 'MSI (MultiSpectral Instrument)' | 'C-SAR' | 'OLI-2/TIRS-2' | 'PAN/MX' | 'VNIR';
  acquisitionDate: string; // ISO or YYYY-MM-DD
  cloudCoverage: number; // percentage
  resolution: string; // e.g. "10m"
  locationName: string;
  coordinates: LatLng;
  bounds: BoundingBox;
  sunElevation?: number;
  sunAzimuth?: number;
  orbitNumber: number;
  processingLevel: 'L1C' | 'L2A (BOA Reflectance)' | 'GRD (SAR)';
  bands: SatelliteBand[];
  previewUrl: string;
  spectralThumbnail?: string;
  stacAssetUri?: string;
  isDemoData: boolean;
}

export interface SpectralValues {
  ndviBefore: number;
  ndviAfter: number;
  ndviDelta: number;
  ndwiBefore: number;
  ndwiAfter: number;
  ndwiDelta: number;
  ndbiBefore: number;
  ndbiAfter: number;
  ndbiDelta: number;
  sarBackscatterBefore?: number;
  sarBackscatterAfter?: number;
  sarDeltaDb?: number;
}

export interface ChangeFeature {
  id: string;
  title: string;
  type: 'structure' | 'road' | 'vegetation' | 'water' | 'earthwork' | 'fortification';
  coordinates: LatLng;
  polygon: LatLng[];
  areaSquareMeters: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceScore: number; // 0 to 100
  deltaNDVI?: number;
  deltaNDBI?: number;
  deltaNDWI?: number;
  evidenceSummary: string;
  status: 'VERIFIED' | 'SUSPECTED' | 'FALSE_POSITIVE' | 'FLAGGED';
}

export interface EvidenceItem {
  id: string;
  category: 'SPECTRAL' | 'GEOMETRIC' | 'TEMPORAL' | 'SAR_RADAR' | 'HISTORICAL';
  title: string;
  observation: string;
  valueBefore: string | number;
  valueAfter: string | number;
  delta: string | number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  sensorSource: string;
  provenance: string;
}

export interface ChangeAnalysisResult {
  id: string;
  sceneA: SatelliteScene;
  sceneB: SatelliteScene;
  timeDifferenceDays: number;
  overallChangeScore: number; // 0-100
  dominantChangeCategory: string;
  totalAreaAffectedSqM: number;
  features: ChangeFeature[];
  spectralIndices: SpectralValues;
  evidenceList: EvidenceItem[];
  coRegistrationRmsePx: number;
  analyzedAt: string;
  isDemo: boolean;
}

export interface SemanticSearchResult {
  query: string;
  extractedAOI: {
    name: string;
    coordinates: LatLng;
    radiusKm: number;
  };
  extractedTemporal: {
    startDate: string;
    endDate: string;
  };
  detectedConcepts: string[];
  suggestedSensors: string[];
  matchedScenes: {
    scene: SatelliteScene;
    relevanceScore: number;
    matchReason: string;
  }[];
}

export interface Investigation {
  id: string;
  title: string;
  query: string;
  classification: 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET' | 'OFFICIAL_USE';
  status: 'ACTIVE' | 'COMPLETED' | 'FLAGGED' | 'ARCHIVED';
  assignedAnalyst: string;
  aoiName: string;
  coordinates: LatLng;
  sceneAId: string;
  sceneBId: string;
  beforeDate: string;
  afterDate: string;
  category: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  changesDetectedCount: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  aiInterpretation?: AIInterpretationResponse;
}

export interface AIInterpretationResponse {
  queryUnderstanding: string;
  keyObservations: string[];
  spectralEvidenceText: string;
  geospatialSignificance: string;
  confidenceAssessment: {
    level: 'HIGH' | 'MEDIUM' | 'LOW';
    score: number;
    reasoning: string;
  };
  strategicImplications: string[];
  limitationsAndUncertainties: string[];
  provenanceAudit: string;
  thinkingProcess?: string;
  modelUsed: string;
}

export interface IntelligenceReport {
  id: string;
  investigationId: string;
  title: string;
  referenceNumber: string;
  classification: string;
  teamId: string;
  problemStatement: string;
  generatedDate: string;
  author: string;
  aoiSummary: string;
  scenePair: {
    beforeScene: SatelliteScene;
    afterScene: SatelliteScene;
  };
  analysis: ChangeAnalysisResult;
  aiBrief: AIInterpretationResponse;
  recommendations: string[];
  verificationFlightTasking: string;
}
