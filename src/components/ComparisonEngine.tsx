import React, { useState } from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import {
  Scale,
  Sparkles,
  ArrowRightLeft,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  Shield,
  Coins,
  Cpu
} from "lucide-react";

interface ComparisonEngineProps {
  initialOptionA?: string;
  initialOptionB?: string;
  onSendToTutor: (prompt: string) => void;
}

const COMPARISON_PRESETS = [
  {
    label: "Type 1 vs Type 2 Hypervisor",
    optionA: "Type 1 Bare-Metal Hypervisor",
    optionB: "Type 2 Hosted Hypervisor",
    tag: "Module 1: Virtualization",
  },
  {
    label: "Hardware vs OS Virtualization (Containers)",
    optionA: "Hardware Virtualization (Virtual Machines)",
    optionB: "OS-Level Virtualization (Containers)",
    tag: "Module 1: Foundations",
  },
  {
    label: "Static Allocation vs Statistical Multiplexing",
    optionA: "Static Allocation (1:1 Dedicated Hardware)",
    optionB: "Statistical Multiplexing (Shared Overcommit)",
    tag: "Module 2: FinOps",
  },
  {
    label: "IaaS vs PaaS vs SaaS",
    optionA: "IaaS (Virtual Machines & VPC)",
    optionB: "PaaS (Managed Cloud Platform)",
    tag: "Module 3: Cloud Models",
  },
  {
    label: "Serverless vs Provisioned Containers",
    optionA: "Serverless Compute (FaaS / Scale-to-Zero)",
    optionB: "Provisioned Containers (Always-On Pods)",
    tag: "Module 3: Compute",
  },
  {
    label: "Public Cloud vs Hybrid vs Multi-Cloud",
    optionA: "Single Hyper-Scale Public Cloud",
    optionB: "Active-Active Multi-Cloud Deployment",
    tag: "Module 4: Global Strategy",
  },
  {
    label: "Rehost (Lift & Shift) vs Refactor (Modernize)",
    optionA: "Rehost (Lift & Shift to IaaS)",
    optionB: "Refactor (Cloud-Native Microservices)",
    tag: "Module 5: 7 Rs Migration",
  },
];

export const ComparisonEngine: React.FC<ComparisonEngineProps> = ({
  initialOptionA = "Type 1 Bare-Metal Hypervisor",
  initialOptionB = "Type 2 Hosted Hypervisor",
  onSendToTutor,
}) => {
  const [optionA, setOptionA] = useState(initialOptionA);
  const [optionB, setOptionB] = useState(initialOptionB);
  const [enterpriseContext, setEnterpriseContext] = useState("Enterprise Core Banking & Real-Time Payments");
  const [comparisonOutput, setComparisonOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate comparison
  const handleRunComparison = async (overrideA?: string, overrideB?: string) => {
    const a = overrideA || optionA;
    const b = overrideB || optionB;
    if (!a.trim() || !b.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optionA: a,
          optionB: b,
          context: enterpriseContext,
        }),
      });

      const data = await response.json();
      setComparisonOutput(data.comparison || "No comparison generated.");
    } catch (err) {
      console.error("Comparison error:", err);
      setComparisonOutput(`### Error generating comparison. Please verify connectivity.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPreset = (preset: typeof COMPARISON_PRESETS[0]) => {
    setOptionA(preset.optionA);
    setOptionB(preset.optionB);
    handleRunComparison(preset.optionA, preset.optionB);
  };

  const handleCopyMarkdown = () => {
    if (!comparisonOutput) return;
    navigator.clipboard.writeText(comparisonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#1A1A1A] text-white border border-[#333] shadow-[6px_6px_0px_rgba(20,20,20,0.1)] p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#F27D26] mb-2">
              <Scale className="w-3.5 h-3.5" />
              <span>Special Feature • Techno-Management Comparison Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif italic tracking-tight text-white">
              Comparative Decision Matrix Engine
            </h1>
            <p className="text-xs sm:text-sm text-[#BBB] mt-1.5 max-w-3xl leading-relaxed">
              Benchmarking architectures side-by-side using the strict three-pillar standard: 
              <span className="text-white font-semibold"> 1. Technical Mechanics</span> (latency, hardware rings), 
              <span className="text-white font-semibold"> 2. Business & Unit Economics</span> (CAPEX/OPEX, overcommit), and 
              <span className="text-white font-semibold"> 3. Operational Governance</span> (blast radius, SLAs).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="compare-ask-tutor-btn"
              onClick={() =>
                onSendToTutor(
                  `Help me deeply analyze the trade-offs between ${optionA} and ${optionB} for my enterprise architecture.`
                )
              }
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-transparent hover:bg-[#2A2A2A] text-white text-xs font-bold uppercase tracking-wider border border-[#444] rounded-sm transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#F27D26]" />
              <span>Ask Tutor Questions</span>
            </button>
          </div>
        </div>

        {/* 3 Pillars Summary Mini Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#333] text-xs">
          <div className="flex items-start space-x-3 p-3 bg-[#222] border border-[#333]">
            <Cpu className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white text-[11px] uppercase tracking-wider block">
                1. Technical Mechanics
              </span>
              <p className="text-[11px] text-[#999] mt-0.5 leading-normal">
                Ring-0 privilege, trap-and-emulate, vCPU latency, hardware MMU dependencies.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-[#222] border border-[#333]">
            <Coins className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white text-[11px] uppercase tracking-wider block">
                2. Business & FinOps
              </span>
              <p className="text-[11px] text-[#999] mt-0.5 leading-normal">
                CAPEX vs OPEX, overcommit yields, peak-to-average ratios (PAR), vendor lock-in.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-[#222] border border-[#333]">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white text-[11px] uppercase tracking-wider block">
                3. Operational Governance
              </span>
              <p className="text-[11px] text-[#999] mt-0.5 leading-normal">
                Blast radius, compliance isolation (SOC2/HIPAA), noisy neighbor SLA risk.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Quick Chooser */}
      <div className="bg-white p-5 border border-[#D1D1D1] shadow-[6px_6px_0px_rgba(20,20,20,0.06)]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#666] block mb-3">
          Curated Architectural Comparisons (Click to load matrix):
        </span>
        <div className="flex flex-wrap gap-2">
          {COMPARISON_PRESETS.map((p, idx) => (
            <button
              key={idx}
              id={`preset-compare-${idx}`}
              onClick={() => handleApplyPreset(p)}
              className="inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold text-[#1A1A1A] bg-[#F2F2F2] hover:bg-[#1A1A1A] hover:text-white border border-[#D1D1D1] transition-all cursor-pointer rounded-xs"
            >
              <span>{p.label}</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-[#E0E0E0] group-hover:bg-[#333] text-[#555] font-mono uppercase">
                {p.tag.split(":")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Input Customizer */}
      <div className="bg-white p-6 border border-[#1A1A1A] shadow-[6px_6px_0px_rgba(20,20,20,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-[#F27D26]" />
            <span>Configure Comparative Dimension Engine</span>
          </h3>
          <span className="text-[10px] font-mono text-[#999] uppercase tracking-wider">
            Framework: Markdown Matrix
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#333] mb-1">
              Option A (Baseline Architecture)
            </label>
            <input
              id="compare-input-option-a"
              type="text"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              placeholder="e.g. Type 1 Bare-Metal Hypervisor"
              className="w-full px-3.5 py-2 text-sm bg-[#F9F9F9] border border-[#D1D1D1] focus:border-[#1A1A1A] focus:bg-white text-[#1A1A1A] font-medium outline-hidden rounded-xs"
            />
          </div>

          <div className="md:col-span-1 flex items-center justify-center pt-5">
            <span className="text-xs font-bold text-[#F27D26] uppercase font-mono px-2 py-0.5 bg-[#FFF2E8] border border-[#F27D26]/30">
              vs
            </span>
          </div>

          <div className="md:col-span-5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#333] mb-1">
              Option B (Candidate Architecture)
            </label>
            <input
              id="compare-input-option-b"
              type="text"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              placeholder="e.g. Type 2 Hosted Hypervisor"
              className="w-full px-3.5 py-2 text-sm bg-[#F9F9F9] border border-[#D1D1D1] focus:border-[#1A1A1A] focus:bg-white text-[#1A1A1A] font-medium outline-hidden rounded-xs"
            />
          </div>

          <div className="md:col-span-1 flex items-end">
            <button
              id="compare-run-btn"
              onClick={() => handleRunComparison()}
              disabled={isLoading || !optionA || !optionB}
              className="w-full py-2.5 px-3 bg-[#F27D26] hover:bg-[#E06D1B] text-white font-bold uppercase text-[11px] tracking-wider transition-colors shadow-xs disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-1 border border-[#F27D26] rounded-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run</span>
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#EBEBEB]">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#666] mb-1">
            Enterprise Context / Industry Scenario (Optional)
          </label>
          <input
            id="compare-input-context"
            type="text"
            value={enterpriseContext}
            onChange={(e) => setEnterpriseContext(e.target.value)}
            placeholder="e.g. Tier-1 Banking Core, High-Frequency Trading, or E-commerce Web Tier"
            className="w-full px-3 py-1.5 text-xs bg-[#F9F9F9] border border-[#D1D1D1] focus:border-[#1A1A1A] text-[#333] outline-hidden rounded-xs"
          />
        </div>
      </div>

      {/* Comparison Results Card */}
      <div className="bg-white border border-[#1A1A1A] shadow-[8px_8px_0px_rgba(20,20,20,0.05)] overflow-hidden">
        <div className="px-6 py-4 bg-[#1A1A1A] text-white flex items-center justify-between border-b border-[#333]">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 bg-[#F27D26]"></div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">
              Comparative Analysis Output Matrix
            </h3>
          </div>

          {comparisonOutput && (
            <div className="flex items-center space-x-2">
              <button
                id="compare-copy-btn"
                onClick={handleCopyMarkdown}
                className="inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-[#333] hover:bg-[#444] border border-[#555] transition-colors cursor-pointer rounded-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          {isLoading ? (
            <div className="py-20 text-center space-y-4">
              <div className="inline-block w-10 h-10 border-4 border-[#F27D26] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-base font-serif italic text-[#1A1A1A]">
                Synthesizing Techno-Management Decision Matrix...
              </p>
              <p className="text-xs text-[#666] max-w-sm mx-auto font-mono">
                Cross-referencing technical isolation, hypervisor overhead, FinOps unit costs, and compliance governance.
              </p>
            </div>
          ) : comparisonOutput ? (
            <div className="space-y-6">
              <div className="flex items-baseline justify-between border-b border-[#D1D1D1] pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#666]">
                    Matrix Synthesis • {enterpriseContext || "Enterprise Workload"}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif italic text-[#141414] mt-0.5">
                    {optionA} vs {optionB}
                  </h2>
                </div>
              </div>
              <MarkdownRenderer content={comparisonOutput} />
            </div>
          ) : (
            <div className="py-16 text-center text-[#666] space-y-4">
              <div className="w-12 h-12 bg-[#F2F2F2] border border-[#D1D1D1] flex items-center justify-center mx-auto text-[#1A1A1A]">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif italic text-[#141414]">
                  Comparison Engine Ready
                </h3>
                <p className="text-xs text-[#666] mt-1 max-w-md mx-auto">
                  Click below or choose a curated architectural preset to run the full Techno-Management 3-Pillar Matrix.
                </p>
              </div>
              <button
                id="compare-initial-load-btn"
                onClick={() => handleRunComparison()}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#333] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-[#1A1A1A] rounded-xs shadow-[4px_4px_0px_#F27D26]"
              >
                <span>Generate Default Matrix ({optionA} vs {optionB})</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
