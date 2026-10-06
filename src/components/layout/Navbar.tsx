import React, { useState } from 'react';
import { UserRole } from '../../types';
import {
  Satellite,
  Radio,
  Search,
  Bell,
  User,
  Shield,
  HelpCircle,
  ExternalLink,
  Info,
  ChevronDown,
  Check
} from 'lucide-react';

interface NavbarProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onSearchQuery?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userRole,
  onRoleChange,
  activeTab,
  onNavigate,
  onSearchQuery,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim() && onSearchQuery) {
      onSearchQuery(searchVal);
      onNavigate('search');
    }
  };

  const roles: UserRole[] = ['ADMIN', 'ANALYST', 'RESEARCHER', 'VIEWER'];

  return (
    <header className="sticky top-0 z-50 flex flex-col w-full border-b border-slate-800 bg-[#070b12]/95 backdrop-blur-md">
      {/* Top Classification & Agency Security Banner */}
      <div className="flex items-center justify-between px-4 py-1 bg-slate-950 border-b border-slate-900 text-[10px] font-mono tracking-widest text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-cyan-400 font-bold">UNCLASSIFIED // DEFENSE RESEARCH TESTBED</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">MINISTRY OF DEFENCE — INDIAN ARMY (DGIS)</span>
        </div>
        <div className="hidden sm:flex items-center space-x-3">
          <span className="text-amber-400 font-semibold">SIH26227: SPACE TECHNOLOGY</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">TEAM: ASIA [192122]</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400">NODE: CQ-IN-01</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="relative flex items-center justify-center w-9 h-9 rounded-md bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Satellite className="w-5 h-5 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-extrabold tracking-wider text-slate-100 font-mono">
                CHANGEQUEST
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 rounded">
                AI
              </span>
            </div>
            <div className="text-[10px] tracking-tight text-slate-400 font-mono">
              Semantic Satellite Retrieval & Multi-Temporal Change Engine
            </div>
          </div>
        </div>

        {/* Center: Global Quick Query Input */}
        <div className="hidden md:flex flex-1 max-w-xl mx-6">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Ask CHANGEQUEST AI (e.g., 'Find new structures near Finger 4 between Jan and June 2026')..."
              className="w-full pl-9 pr-20 py-2 text-xs font-mono bg-slate-950/80 border border-slate-800 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-2.5 py-1 text-[10px] font-mono bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 rounded transition"
            >
              RETRIEVE
            </button>
          </form>
        </div>

        {/* Right: Status, Demo Badge, Role Selector & Profile */}
        <div className="flex items-center space-x-3">
          {/* Demo Mode Badge */}
          <div className="relative">
            <button
              onClick={() => setShowDemoInfo(!showDemoInfo)}
              className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-mono bg-amber-950/40 border border-amber-600/60 rounded text-amber-300 hover:bg-amber-950/60 transition shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
              <span className="font-bold">DEMO MODE</span>
              <Info className="w-3 h-3 text-amber-400 ml-0.5" />
            </button>

            {showDemoInfo && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-950 border border-amber-600/60 rounded-md p-3 text-xs font-mono text-slate-300 shadow-2xl z-50">
                <div className="font-bold text-amber-400 mb-1 flex items-center space-x-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>DEMO MODE ACTIVE</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                  Operating on verified Indian Army DGIS testbed benchmark scenes (Sentinel-2A/B, Sentinel-1 SAR, Cartosat-3). Real STAC/Copernicus API integration ready in Settings.
                </p>
                <div className="text-[10px] text-cyan-400 border-t border-slate-800 pt-1.5">
                  No fake live imagery claimed. All provenance audited.
                </div>
              </div>
            )}
          </div>

          {/* Role Selector */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-mono bg-slate-900 border border-slate-800 rounded text-slate-300 hover:border-slate-700 transition"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>ROLE:</span>
              <span className="font-semibold text-cyan-300">{userRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-slate-950 border border-slate-800 rounded-md py-1 shadow-xl z-50 font-mono text-xs">
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-slate-900 ${
                      userRole === r ? 'text-cyan-400 font-bold bg-slate-900/60' : 'text-slate-300'
                    }`}
                  >
                    <span>{r}</span>
                    {userRole === r && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800 text-xs font-mono">
            <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <User className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="hidden xl:block">
              <div className="text-slate-200 font-semibold leading-tight">Capt. A. Sharma</div>
              <div className="text-[10px] text-slate-500 leading-tight">DGIS Intelligence Wing</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
