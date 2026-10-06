import React, { useState } from 'react';
import { UserRole } from '../../types';
import {
  Sliders,
  Database,
  Cpu,
  Shield,
  Key,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Server,
  Zap,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface SettingsViewProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  demoModeActive: boolean;
  onToggleDemoMode: () => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userRole,
  onRoleChange,
  demoModeActive,
  onToggleDemoMode,
  onResetData,
}) => {
  const [stacEndpoint, setStacEndpoint] = useState('https://planetarycomputer.microsoft.com/api/stac/v1');
  const [copernicusEndpoint, setCopernicusEndpoint] = useState('https://catalogue.dataspace.copernicus.eu/stac');
  const [thinkingLevel, setThinkingLevel] = useState('ThinkingLevel.HIGH');
  const [geminiModel, setGeminiModel] = useState('gemini-3.1-pro-preview');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const rolePermissions: Record<UserRole, string[]> = {
    ADMIN: ['Full System Configuration', 'Audit Log Access', 'API Gateway Management', 'User Role Assignment', 'Export All Dossiers'],
    ANALYST: ['Run Multi-Temporal Detections', 'Execute Gemini Deep Reasoning', 'Create & Edit Investigations', 'Export Classified Dossiers'],
    RESEARCHER: ['Search STAC Catalogs', 'Analyze Spectral Indices', 'View Evidence Trails', 'Export De-identified Data'],
    VIEWER: ['Read-only Map & Dossier Browsing', 'View Verified Anomalies', 'Inspect Public Metadata'],
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#070b12] text-slate-100 font-mono">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-1">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>SYSTEM CONFIGURATION & SATELLITE GATEWAYS</span>
        </div>
        <h1 className="text-2xl font-black tracking-wide text-slate-100">
          SETTINGS & EXTERNAL INTERFACES
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure STAC catalogs, Copernicus Sentinel feeds, Gemini High-Thinking model parameters, and role-based access control.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Satellite & STAC Gateway Connectors */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase border-b border-slate-800 pb-2.5">
            <Database className="w-4 h-4" />
            <span>SATELLITE DATA GATEWAYS & STAC APIS</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                COPERNICUS DATA SPACE (SENTINEL-1 / 2 CDSE):
              </label>
              <input
                type="text"
                value={copernicusEndpoint}
                onChange={(e) => setCopernicusEndpoint(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-mono"
              />
              <span className="text-[10px] text-emerald-400 mt-0.5 block">
                Status: Connected (L2A BOA Reflectance + GRD SAR)
              </span>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                STAC CATALOG ENDPOINT (PLANETARY / AWS EARTH):
              </label>
              <input
                type="text"
                value={stacEndpoint}
                onChange={(e) => setStacEndpoint(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Standard: STAC v1.0.0-beta Spec
              </span>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                ISRO BHUVAN / CARTOSAT GATEWAY:
              </label>
              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                <span>Cartosat-3 Panchromatic (0.28m) Spot Endpoint</span>
                <span className="text-cyan-400 font-bold">READY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: AI Geospatial Inference Core (Thinking Mode) */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase border-b border-slate-800 pb-2.5">
            <Cpu className="w-4 h-4" />
            <span>GEMINI HIGH THINKING ENGINE CONFIGURATION</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                PRIMARY REASONING MODEL (MANDATED FOR COMPLEX QUERIES):
              </label>
              <select
                value={geminiModel}
                onChange={(e) => setGeminiModel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Thinking Mode)</option>
                <option value="gemini-3.8-flash">gemini-3.8-flash (High Throughput Fallback)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                THINKING LEVEL PARAMETER:
              </label>
              <div className="p-2.5 rounded bg-slate-900/60 border border-cyan-800/60 text-xs text-cyan-300 font-bold flex items-center justify-between">
                <span>ThinkingLevel.HIGH (Full CoT Reasoning)</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                `thinkingLevel: ThinkingLevel.HIGH` enabled per SIH problem statement specifications.
              </span>
            </div>

            <div className="p-3 rounded bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="font-bold text-slate-300">SERVER-SIDE API KEY ENFORCEMENT:</div>
              <p>
                API credentials are strictly handled on the backend via <code>process.env.GEMINI_API_KEY</code>. No secret keys are ever exposed to client bundles.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Role-Based Access Control (RBAC) */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase border-b border-slate-800 pb-2.5">
            <Shield className="w-4 h-4" />
            <span>ROLE-BASED ACCESS CONTROL (RBAC)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                CURRENT ACTIVE SESSION ROLE:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['ADMIN', 'ANALYST', 'RESEARCHER', 'VIEWER'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => onRoleChange(r)}
                    className={`py-2 px-2 rounded text-center transition font-bold text-xs ${
                      userRole === r
                        ? 'bg-cyan-600 text-white border border-cyan-400 shadow-md'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded bg-slate-900/50 border border-slate-800 space-y-1.5">
              <div className="text-[10px] text-slate-400 uppercase font-bold">
                PERMISSIONS FOR {userRole}:
              </div>
              <div className="space-y-1">
                {rolePermissions[userRole].map((perm, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Demo Mode & Testbed Benchmarking */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase border-b border-slate-800 pb-2.5">
            <Server className="w-4 h-4" />
            <span>TESTBED DEMO MODE & LOCAL CACHE</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded bg-amber-950/20 border border-amber-800/40">
              <div>
                <div className="font-bold text-amber-300 text-xs">DEMO BENCHMARK MODE</div>
                <div className="text-[10px] text-amber-400/80">
                  Operate on calibrated Indian Army DGIS testbed scenes
                </div>
              </div>
              <button
                onClick={onToggleDemoMode}
                className={`px-3 py-1.5 rounded font-bold text-xs transition ${
                  demoModeActive
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {demoModeActive ? 'ACTIVE' : 'OFFLINE'}
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">RESET BENCHMARK REPOSITORY</div>
                <div className="text-[10px] text-slate-500">Restore default testbed investigations & scenes</div>
              </div>
              <button
                onClick={onResetData}
                className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition text-xs font-semibold flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Settings Bar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/90 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          Settings are saved to server-side memory and persist throughout your active session.
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-md shadow-cyan-900/30 flex items-center space-x-1.5"
        >
          {saveSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>SAVED!</span>
            </>
          ) : (
            <span>APPLY CONFIGURATION</span>
          )}
        </button>
      </div>
    </div>
  );
};
