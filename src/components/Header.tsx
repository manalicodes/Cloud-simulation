import React from "react";
import { NavigationTab } from "../types";
import {
  Layers,
  Scale,
  Cpu,
  ShieldAlert,
  Briefcase,
  Sparkles,
  BookOpen
} from "lucide-react";

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenQuickCompare?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuickCompare,
}) => {
  const tabs: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "tutor", label: "Tutor & Chat", icon: BookOpen },
    { id: "comparison", label: "Comparison Engine", icon: Scale },
    { id: "finops-lab", label: "FinOps Multiplexing Lab", icon: Cpu },
    { id: "shared-responsibility", label: "Shared Responsibility", icon: ShieldAlert },
    { id: "capstone", label: "Capstone Boardroom", icon: Briefcase },
  ];

  return (
    <header className="bg-[#1A1A1A] text-white border-b border-[#333] sticky top-0 z-40 shadow-xs">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-8 h-8 bg-[#F27D26] rounded-sm flex items-center justify-center font-bold text-xs text-white shadow-xs">
              CE
            </div>
            <div>
              <div className="flex items-center">
                <h1 className="text-base sm:text-lg font-bold tracking-tight uppercase text-white">
                  CloudExec <span className="font-light opacity-50 ml-1.5 hidden sm:inline text-xs sm:text-sm">| Strategy Tutor</span>
                </h1>
              </div>
              <p className="text-[10px] text-[#999] uppercase tracking-wider hidden md:block">
                Techno-Management Matrix • FinOps • Governance
              </p>
            </div>
          </div>

          {/* Center Status Indicators */}
          <div className="hidden lg:flex items-center space-x-5 text-[11px] font-medium uppercase tracking-widest text-[#999]">
            <span className="inline-flex items-center gap-1.5 text-[#F27D26]">
              <span className="w-2 h-2 rounded-full bg-[#F27D26] animate-pulse"></span>
              Live Matrix Mode
            </span>
            <span className="opacity-60 text-slate-400">
              3-Pillar Framework
            </span>
            <div className="flex items-center space-x-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF00]"></span>
              <span className="text-[10px] text-slate-300">Active</span>
            </div>
          </div>

          {/* Quick Engine Trigger */}
          <div className="flex items-center space-x-2.5">
            <button
              id="header-quick-compare-btn"
              onClick={() => onSelectTab("comparison")}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider bg-[#F27D26] hover:bg-[#E06D1B] text-white shadow-xs transition-colors cursor-pointer border border-[#F27D26]"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare Engine</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-[#141414] border-t border-[#2A2A2A] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex space-x-1 overflow-x-auto py-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-none text-xs tracking-wide transition-all cursor-pointer border-b-2 ${
                  isActive
                    ? "bg-[#222222] text-white border-[#F27D26] font-bold"
                    : "text-slate-400 hover:text-white hover:bg-[#1A1A1A] border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#F27D26]" : "text-slate-500"}`} />
                <span>{tab.label}</span>
                {tab.id === "comparison" && (
                  <span className="ml-1 text-[9px] px-1.5 py-0.2 bg-[#F27D26]/20 text-[#F27D26] border border-[#F27D26]/40 rounded-xs font-mono font-bold">
                    MATRIX
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

