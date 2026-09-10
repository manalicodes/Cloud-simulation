import React, { useState } from "react";
import { NavigationTab } from "./types";
import { Header } from "./components/Header";
import { TutorChat } from "./components/TutorChat";
import { ComparisonEngine } from "./components/ComparisonEngine";
import { FinOpsSimulator } from "./components/FinOpsSimulator";
import { SharedResponsibilityExplorer } from "./components/SharedResponsibilityExplorer";
import { ExecutiveCapstone } from "./components/ExecutiveCapstone";

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>("tutor");
  const [comparisonPair, setComparisonPair] = useState<{ optionA: string; optionB: string }>({
    optionA: "Type 1 Bare-Metal Hypervisor",
    optionB: "Type 2 Hosted Hypervisor",
  });

  const handleNavigateTab = (tab: NavigationTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRunComparison = (optionA: string, optionB: string) => {
    setComparisonPair({ optionA, optionB });
    setCurrentTab("comparison");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSendToTutor = (prompt: string) => {
    setCurrentTab("tutor");
    // Handled by user typing or quick query
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#1A1A1A] flex flex-col font-sans antialiased">
      {/* Global Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleNavigateTab}
        onOpenQuickCompare={() => handleNavigateTab("comparison")}
      />

      {/* Main View Container */}
      <main className="flex-1 pb-8">
        {currentTab === "tutor" && (
          <TutorChat
            onNavigateTab={handleNavigateTab}
            onRunComparison={handleRunComparison}
          />
        )}

        {currentTab === "comparison" && (
          <ComparisonEngine
            key={`${comparisonPair.optionA}-${comparisonPair.optionB}`}
            initialOptionA={comparisonPair.optionA}
            initialOptionB={comparisonPair.optionB}
            onSendToTutor={handleSendToTutor}
          />
        )}

        {currentTab === "finops-lab" && (
          <FinOpsSimulator onCompareTrigger={handleRunComparison} />
        )}

        {currentTab === "shared-responsibility" && (
          <SharedResponsibilityExplorer onCompareTrigger={handleRunComparison} />
        )}

        {currentTab === "capstone" && (
          <ExecutiveCapstone onAskTutor={handleSendToTutor} />
        )}
      </main>

      {/* Footer in Geometric Balance Style */}
      <footer className="bg-white border-t border-[#D1D1D1] py-4 text-[10px] uppercase font-bold text-[#999] tracking-widest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-[#1A1A1A]">
            <span className="w-5 h-5 bg-[#F27D26] text-white rounded-xs flex items-center justify-center font-bold text-[9px]">
              CE
            </span>
            <span className="font-bold tracking-wider">CloudExec | Strategy Tutor</span>
            <span className="text-[#999]">•</span>
            <span className="text-[#666] lowercase font-normal text-[11px] hidden md:inline">Techno-Management Matrix Framework</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00FF00]"></span>
              <span className="text-[#333]">Live Matrix Engine</span>
            </div>
            <span>Simulation Mode: Active</span>
            <span className="text-[#F27D26] font-mono">Pillars: 1 • 2 • 3</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
