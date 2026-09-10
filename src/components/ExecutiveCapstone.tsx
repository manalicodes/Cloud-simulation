import React, { useState } from "react";
import { CAPSTONE_WORKLOADS } from "../data/modulesData";
import { SevenRStrategy, WorkloadProfile } from "../types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import {
  Briefcase,
  Award,
  AlertTriangle,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Clock,
  ShieldCheck,
  Send,
  Building2
} from "lucide-react";

interface ExecutiveCapstoneProps {
  onAskTutor: (prompt: string) => void;
}

const SEVEN_R_OPTIONS: { strategy: SevenRStrategy; label: string; desc: string }[] = [
  {
    strategy: "Rehost",
    label: "Rehost (Lift & Shift)",
    desc: "Move VMs as-is to cloud IaaS without architectural changes. Fast, but retains technical debt and high VM run costs.",
  },
  {
    strategy: "Replatform",
    label: "Replatform (Lift, Tinker & Shift)",
    desc: "Adopt managed cloud databases or containerize without modifying core code. Reduces OS maintenance with minimal rewrite risk.",
  },
  {
    strategy: "Refactor",
    label: "Refactor (Cloud-Native Modernize)",
    desc: "Re-architect into microservices / serverless. Maximum cloud agility & lowest steady-state unit cost, but high upfront migration investment.",
  },
  {
    strategy: "Repurchase",
    label: "Repurchase (Drop & Shop to SaaS)",
    desc: "Retire legacy custom software and adopt turnkey SaaS (e.g. Workday, Salesforce). Eliminates infrastructure and maintenance labor.",
  },
  {
    strategy: "Retain",
    label: "Retain (Keep On-Premises / Hybrid)",
    desc: "Keep on current hardware or air-gapped environment. Ideal for depreciated assets, compliance vaults, or systems approaching end-of-life.",
  },
  {
    strategy: "Retire",
    label: "Retire (Decommission)",
    desc: "Safely archive data and turn off obsolete servers. 100% cost reduction and zero operational burden.",
  },
  {
    strategy: "Relocate",
    label: "Relocate (Hypervisor Cloud Mobility)",
    desc: "Move instances directly to dedicated cloud VMware/hypervisor nodes (e.g. AWS VMC / Azure AVS) with zero VM conversion.",
  },
];

export const ExecutiveCapstone: React.FC<ExecutiveCapstoneProps> = ({
  onAskTutor,
}) => {
  const [workloads, setWorkloads] = useState<WorkloadProfile[]>(
    CAPSTONE_WORKLOADS.map((w) => ({ ...w }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [boardEvaluation, setBoardEvaluation] = useState<string | null>(null);

  // Strategy modification
  const handleUpdateStrategy = (workloadId: string, newStrategy: SevenRStrategy) => {
    setWorkloads((prev) =>
      prev.map((w) =>
        w.id === workloadId
          ? {
              ...w,
              selectedStrategy: newStrategy,
            }
          : w
      )
    );
  };

  // Calculate dynamic metrics based on chosen 7 Rs
  const totalBaselineCost = workloads.reduce((sum, w) => sum + w.annualRunCost, 0);

  // Approximate run cost multiplier per strategy
  const strategyMultipliers: Record<SevenRStrategy, number> = {
    Rehost: 0.85, // 15% savings
    Replatform: 0.55, // 45% savings
    Refactor: 0.35, // 65% savings (high elasticity)
    Repurchase: 0.60, // 40% savings (SaaS replaces labor)
    Retain: 1.0, // 0% savings
    Retire: 0.0, // 100% savings
    Relocate: 0.90, // 10% savings
  };

  const strategyAgilityScores: Record<SevenRStrategy, number> = {
    Rehost: 30,
    Replatform: 65,
    Refactor: 95,
    Repurchase: 85,
    Retain: 10,
    Retire: 50,
    Relocate: 25,
  };

  const strategyRiskScores: Record<SevenRStrategy, number> = {
    Rehost: 20,
    Replatform: 40,
    Refactor: 75, // migration project execution risk
    Repurchase: 35,
    Retain: 50, // technical debt risk
    Retire: 10,
    Relocate: 15,
  };

  const projectedNewCost = Math.round(
    workloads.reduce(
      (sum, w) => sum + w.annualRunCost * strategyMultipliers[w.selectedStrategy],
      0
    )
  );

  const annualSavings = totalBaselineCost - projectedNewCost;
  const savingsPercent = Math.round((annualSavings / totalBaselineCost) * 100);

  const averageAgility = Math.round(
    workloads.reduce(
      (sum, w) => sum + strategyAgilityScores[w.selectedStrategy],
      0
    ) / workloads.length
  );

  const averageRisk = Math.round(
    workloads.reduce(
      (sum, w) => sum + strategyRiskScores[w.selectedStrategy],
      0
    ) / workloads.length
  );

  const handleEvaluateWithBoard = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/capstone/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decisions: workloads.map((w) => ({
            workload: w.name,
            strategy: w.selectedStrategy,
            priority: w.businessPriority,
            baselineCost: `$${w.annualRunCost}k`,
          })),
          totalBudget: totalBaselineCost,
          projectedSavings: savingsPercent,
        }),
      });

      const data = await response.json();
      setBoardEvaluation(data.evaluation);
    } catch (e) {
      console.error("Board evaluation failed:", e);
      setBoardEvaluation(
        "### Board Audit Committee Response\n\nThe Board has reviewed your strategy. While the portfolio achieves a 42% cost reduction, ensure that your operational migration runway accounts for cloud egress charges and the engineering skills transition."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Boardroom Scenario Banner */}
      <div className="bg-[#1A1A1A] text-white border border-[#333] shadow-[6px_6px_0px_rgba(20,20,20,0.1)] p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#F27D26] mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Unit 5 • Executive Boardroom Capstone Simulation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif italic tracking-tight text-white">
              The CIO's Boardroom Presentation: The 7 Rs of Cloud Migration
            </h1>
            <p className="text-xs sm:text-sm text-[#BBB] mt-1.5 max-w-3xl leading-relaxed">
              You are the Chief Information Officer of an enterprise with 400 legacy VMs facing an abrupt 
              <strong> 4x hypervisor licensing price hike</strong> ($1.4M/year increase) and $12M technical debt. 
              Map each enterprise workload to the optimal <strong>7 Rs migration strategy</strong> to balance financial ROI, technical latency, and operational blast-radius.
            </p>
          </div>

          <button
            id="capstone-submit-btn"
            onClick={handleEvaluateWithBoard}
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#F27D26] hover:bg-[#E06D1B] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-[#F27D26] rounded-xs shadow-xs disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? "Board Reviewing..." : "Submit to Board of Directors"}</span>
          </button>
        </div>

        {/* Live Executive KPI Meters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-[#333] text-xs">
          <div className="p-3.5 bg-[#262626] border border-[#444]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#999] block">Baseline Annual Run</span>
            <span className="text-2xl font-serif italic text-white mt-1 block">
              ${totalBaselineCost}k/yr
            </span>
          </div>
          <div className="p-3.5 bg-[#262626] border border-[#444]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#999] block">Projected Run Cost</span>
            <span className="text-2xl font-serif italic text-emerald-400 mt-1 block">
              ${projectedNewCost}k/yr
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mt-0.5">
              (-{savingsPercent}% TCO reduction)
            </span>
          </div>
          <div className="p-3.5 bg-[#262626] border border-[#444]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#999] block">Digital Agility Score</span>
            <span className="text-2xl font-serif italic text-[#60A5FA] mt-1 block">
              {averageAgility} / 100
            </span>
            <span className="text-[10px] uppercase text-[#AAA] block mt-0.5">
              {averageAgility > 60 ? "High Innovation Velocity" : "Moderate Agility"}
            </span>
          </div>
          <div className="p-3.5 bg-[#262626] border border-[#444]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#999] block">Execution Risk Index</span>
            <span className="text-2xl font-serif italic text-amber-400 mt-1 block">
              {averageRisk} / 100
            </span>
            <span className="text-[10px] uppercase text-[#AAA] block mt-0.5">
              {averageRisk > 50 ? "Requires Strict Phasing" : "Manageable Blast Radius"}
            </span>
          </div>
        </div>
      </div>

      {/* Workload Mapping Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#D1D1D1] pb-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#F27D26]" />
            <span>Map Enterprise Workloads across the 7 Rs</span>
          </h3>
          <span className="text-[11px] text-[#666]">
            Select target modernization strategy for each system
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {workloads.map((wl) => {
            return (
              <div
                key={wl.id}
                className="bg-white border border-[#1A1A1A] shadow-[6px_6px_0px_rgba(20,20,20,0.06)] p-6 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left info */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2.5">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 ${
                          wl.businessPriority === "Critical"
                            ? "bg-[#1A1A1A] text-white border border-[#1A1A1A]"
                            : wl.businessPriority === "High"
                            ? "bg-[#FFF2E8] text-[#F27D26] border border-[#F27D26]/40"
                            : "bg-[#F2F2F2] text-[#666] border border-[#D1D1D1]"
                        }`}
                      >
                        {wl.businessPriority} Priority
                      </span>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">
                        {wl.name}
                      </h4>
                    </div>

                    <p className="text-xs text-[#444] font-medium leading-relaxed">
                      Current Architecture: <span className="font-normal text-[#666]">{wl.currentTech}</span>
                    </p>
                    <p className="text-[11px] text-[#666] leading-relaxed">
                      Characteristics: {wl.characteristics}
                    </p>
                  </div>

                  {/* Financial snapshot */}
                  <div className="lg:w-52 text-left lg:text-right shrink-0 bg-[#F9F9F9] p-3 border border-[#EBEBEB]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#888] block">Baseline Cost:</span>
                    <span className="text-sm font-bold text-[#1A1A1A] font-mono">
                      ${wl.annualRunCost}k/year
                    </span>
                    <span className="text-[11px] text-emerald-700 block font-bold font-mono mt-0.5">
                      → Post-7R: ${Math.round(wl.annualRunCost * strategyMultipliers[wl.selectedStrategy])}k/yr
                    </span>
                  </div>
                </div>

                {/* 7 Rs Selector Controls */}
                <div className="mt-4 pt-4 border-t border-[#EBEBEB]">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#444] mb-2.5">
                    Select 7 Rs Modernization Strategy:
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
                    {SEVEN_R_OPTIONS.map((opt) => {
                      const isSelected = wl.selectedStrategy === opt.strategy;
                      return (
                        <button
                          key={opt.strategy}
                          id={`strategy-btn-${wl.id}-${opt.strategy}`}
                          onClick={() => handleUpdateStrategy(wl.id, opt.strategy)}
                          title={opt.desc}
                          className={`p-2.5 text-left text-xs transition-all border cursor-pointer ${
                            isSelected
                              ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-[2px_2px_0px_#F27D26]"
                              : "bg-[#F9F9F9] hover:bg-white text-[#333] border-[#D1D1D1] hover:border-[#1A1A1A]"
                          }`}
                        >
                          <div className="font-bold text-[11px] uppercase tracking-wider truncate">{opt.strategy}</div>
                          <div className={`text-[9px] mt-0.5 line-clamp-1 ${isSelected ? "text-[#DDD]" : "text-[#777]"}`}>
                            {opt.strategy === "Rehost" ? "Lift & Shift" : opt.strategy === "Refactor" ? "Cloud-Native" : opt.strategy === "Repurchase" ? "SaaS" : opt.strategy}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 p-3 bg-[#F9F9F9] border border-[#EBEBEB] text-[11px] text-[#555] leading-relaxed">
                    <strong className="text-[#1A1A1A] uppercase text-[10px] tracking-wider">Strategy Rationale:</strong> {wl.strategyRationale}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Board Evaluation Feedback Modal/Area */}
      {boardEvaluation && (
        <div className="bg-white border border-[#1A1A1A] shadow-[8px_8px_0px_rgba(20,20,20,0.08)] overflow-hidden space-y-0">
          <div className="px-6 py-4 bg-[#1A1A1A] text-white flex items-center justify-between border-b border-[#333]">
            <div className="flex items-center space-x-2.5">
              <Award className="w-5 h-5 text-[#F27D26]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Official Board of Directors Evaluation & Audit Report
              </h3>
            </div>
            <button
              id="capstone-ask-tutor-followup"
              onClick={() =>
                onAskTutor(
                  `I just presented my 7 Rs cloud migration strategy to the Board of Directors with a projected ${savingsPercent}% TCO reduction. Help me answer the Audit Committee Chairman's question.`
                )
              }
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#2A2A2A] hover:bg-[#333] border border-[#444] text-[#F27D26] hover:text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
            >
              <span>Consult CloudExec Tutor on this Verdict →</span>
            </button>
          </div>

          <div className="p-6 bg-[#F9F9F9]">
            <MarkdownRenderer content={boardEvaluation} />
          </div>
        </div>
      )}
    </div>
  );
};
