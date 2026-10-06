import React from 'react';
import {
  LayoutDashboard,
  Search,
  Compass,
  SplitSquareVertical,
  Layers,
  Activity,
  FileCheck2,
  FolderGit2,
  FileText,
  Sliders,
  ShieldAlert,
  Satellite,
  Radar
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  investigationCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  investigationCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'search', label: 'Semantic Search', icon: Search, badge: 'NLP' },
    { id: 'workspace', label: 'Investigation Workspace', icon: Compass },
    { id: 'comparison', label: 'BEFORE / AFTER Viewer', icon: SplitSquareVertical },
    { id: 'change-detection', label: 'Change Detection', icon: Layers },
    { id: 'spectral', label: 'Spectral Indices', icon: Activity, badge: 'NDVI' },
    { id: 'evidence', label: 'Evidence & Provenance', icon: FileCheck2 },
    { id: 'investigations', label: 'Saved Investigations', icon: FolderGit2, count: investigationCount },
    { id: 'reports', label: 'Intelligence Reports', icon: FileText },
    { id: 'settings', label: 'Gateways & Settings', icon: Sliders },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between border-r border-slate-800 bg-[#070b12] text-slate-300 font-mono select-none">
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] tracking-wider font-bold text-slate-500 uppercase">
          OPERATIONAL WORKSPACES
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition ${
                isActive
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-slate-800 border border-slate-700 px-1.5 py-0.2 rounded text-cyan-400">
                  {item.badge}
                </span>
              )}
              {item.count !== undefined && item.count > 0 && (
                <span className="text-[10px] bg-cyan-950 border border-cyan-800 px-1.5 py-0.2 rounded text-cyan-300 font-bold">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Constellation & Telemetry Status Card at Bottom of Sidebar */}
      <div className="p-3 m-3 rounded-lg border border-slate-800/80 bg-slate-950/70 text-[11px] space-y-2">
        <div className="flex items-center justify-between text-slate-400 font-bold text-[10px] uppercase">
          <span className="flex items-center space-x-1">
            <Radar className="w-3.5 h-3.5 text-cyan-400" />
            <span>SENSOR TELEMETRY</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>

        <div className="space-y-1 text-[10px] text-slate-400">
          <div className="flex justify-between">
            <span>Sentinel-2 Optical:</span>
            <span className="text-emerald-400 font-semibold">ORBIT 138 [L2A]</span>
          </div>
          <div className="flex justify-between">
            <span>Sentinel-1 C-SAR:</span>
            <span className="text-emerald-400 font-semibold">IW GRD [VV+VH]</span>
          </div>
          <div className="flex justify-between">
            <span>Cartosat-3 Spot:</span>
            <span className="text-cyan-400 font-semibold">0.28m PAN READY</span>
          </div>
          <div className="flex justify-between">
            <span>Gemini Thinking Mode:</span>
            <span className="text-amber-400 font-semibold">3.1 PRO (HIGH)</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 text-[9px] text-slate-500 leading-tight">
          SIH26227 // DGIS INDIAN ARMY<br />
          TEAM: ASIA [192122]
        </div>
      </div>
    </aside>
  );
};
