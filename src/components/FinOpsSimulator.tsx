import React, { useState } from "react";
import {
  Cpu,
  Coins,
  TrendingDown,
  AlertCircle,
  ShieldAlert,
  Server,
  Info,
  CheckCircle,
  Layers,
  ArrowRight
} from "lucide-react";

interface FinOpsSimulatorProps {
  onCompareTrigger: (optionA: string, optionB: string) => void;
}

export const FinOpsSimulator: React.FC<FinOpsSimulatorProps> = ({
  onCompareTrigger,
}) => {
  // Simulator inputs
  const [workloadCount, setWorkloadCount] = useState<number>(120); // number of VMs / services
  const [vCpuPerWorkload, setVCpuPerWorkload] = useState<number>(4); // vCPUs per workload
  const [ramPerWorkload, setRamPerWorkload] = useState<number>(16); // GB RAM per workload
  const [par, setPar] = useState<number>(3.5); // Peak-to-Average Ratio
  const [overcommitRatio, setOvercommitRatio] = useState<number>(3.0); // vCPU to pCPU overcommit ratio
  const [ballooningEfficiency, setBallooningEfficiency] = useState<number>(35); // % RAM reclaimed via ballooning
  const [hostCoreCapacity, setHostCoreCapacity] = useState<number>(64); // Physical cores per dual-socket server
  const [hostRamCapacity, setHostRamCapacity] = useState<number>(256); // GB RAM per host
  const [serverHardwareCost, setServerHardwareCost] = useState<number>(12000); // $ CAPEX per server
  const [annualOpexPerServer, setAnnualOpexPerServer] = useState<number>(3200); // $ Power, cooling, rack, VMware license/yr

  // Calculations
  const totalVirtualCpus = workloadCount * vCpuPerWorkload;
  const totalVirtualRam = workloadCount * ramPerWorkload;

  // 1. Static Allocation (1:1 dedicated, sized for peak)
  // Needs 1 physical core per virtual core
  const staticPhysicalCoresNeeded = totalVirtualCpus;
  const staticHostsNeeded = Math.ceil(
    Math.max(
      staticPhysicalCoresNeeded / hostCoreCapacity,
      totalVirtualRam / hostRamCapacity
    )
  );
  const staticCapex = staticHostsNeeded * serverHardwareCost;
  const staticAnnualOpex = staticHostsNeeded * annualOpexPerServer;
  const static3YrTco = staticCapex + staticAnnualOpex * 3;

  // 2. Statistical Multiplexing with Overcommit & Memory Ballooning
  // Effective physical cores needed based on overcommit ratio
  const multiplexedCoresNeeded = Math.ceil(totalVirtualCpus / overcommitRatio);
  // Reclaim memory via ballooning
  const effectiveRamNeeded = totalVirtualRam * (1 - ballooningEfficiency / 100);
  const multiplexedHostsNeeded = Math.ceil(
    Math.max(
      multiplexedCoresNeeded / hostCoreCapacity,
      effectiveRamNeeded / hostRamCapacity
    )
  );
  const multiplexedCapex = multiplexedHostsNeeded * serverHardwareCost;
  const multiplexedAnnualOpex = multiplexedHostsNeeded * annualOpexPerServer;
  const multiplexed3YrTco = multiplexedCapex + multiplexedAnnualOpex * 3;

  // Savings
  const hostsConsolidated = staticHostsNeeded - multiplexedHostsNeeded;
  const consolidationRatio = (staticHostsNeeded / multiplexedHostsNeeded).toFixed(1);
  const capexSavings = staticCapex - multiplexedCapex;
  const annualOpexSavings = staticAnnualOpex - multiplexedAnnualOpex;
  const threeYearSavings = static3YrTco - multiplexed3YrTco;
  const tcoSavingsPercent = Math.round((threeYearSavings / static3YrTco) * 100);

  // Noisy Neighbor Risk Modeling: based on overcommit ratio and PAR
  // If overcommit exceeds PAR, simultaneous spikes cause CPU throttling
  const riskIndex = Math.min(100, Math.round((overcommitRatio / par) * 55));
  const getRiskStatus = () => {
    if (riskIndex < 40) return { label: "Low Contention (Over-Provisioned)", color: "text-emerald-700 bg-emerald-50 border-emerald-300" };
    if (riskIndex < 70) return { label: "Optimal FinOps Equilibrium", color: "text-blue-700 bg-blue-50 border-blue-300" };
    return { label: "High Noisy Neighbor Risk (SLA Vulnerable)", color: "text-red-700 bg-red-50 border-red-300" };
  };

  const riskStatus = getRiskStatus();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#1A1A1A] text-white border border-[#333] shadow-[6px_6px_0px_rgba(20,20,20,0.1)] p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#F27D26] mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Unit 3.3 • Interactive FinOps Multiplexing Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif italic tracking-tight text-white">
              Statistical Multiplexing & FinOps Overcommit Lab
            </h1>
            <p className="text-xs sm:text-sm text-[#BBB] mt-1.5 max-w-3xl leading-relaxed">
              Model how statistical multiplexing, CPU overcommit, and memory ballooning transform 
              low single-tenant server utilization (15%) into massive server consolidation and 50%+ TCO reduction.
            </p>
          </div>

          <button
            id="finops-compare-btn"
            onClick={() =>
              onCompareTrigger(
                "Static Allocation (1:1 Dedicated Hardware)",
                "Statistical Multiplexing (Shared Overcommit)"
              )
            }
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#F27D26] hover:bg-[#E06D1B] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-[#F27D26] rounded-xs shadow-xs"
          >
            <span>Compare in Engine →</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Controls + Live Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders and Configuration (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#1A1A1A] shadow-[6px_6px_0px_rgba(20,20,20,0.06)] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#EBEBEB] pb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] flex items-center gap-2">
              <Server className="w-4 h-4 text-[#F27D26]" />
              <span>Capacity & Overcommit Sliders</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-[#666] bg-[#F2F2F2] border border-[#D1D1D1] px-2 py-0.5 rounded-none">
              {totalVirtualCpus} vCPUs / {totalVirtualRam} GB
            </span>
          </div>

          {/* Slider: Workload Count */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#333]">Total Virtual Workloads (VMs)</span>
              <span className="font-bold text-[#1A1A1A] font-mono px-1.5 bg-[#F2F2F2] border border-[#D1D1D1]">{workloadCount} VMs</span>
            </div>
            <input
              id="slider-workload-count"
              type="range"
              min={20}
              max={400}
              step={10}
              value={workloadCount}
              onChange={(e) => setWorkloadCount(Number(e.target.value))}
              className="w-full accent-[#F27D26] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#999] font-mono">
              <span>20 VMs</span>
              <span>200 VMs</span>
              <span>400 VMs</span>
            </div>
          </div>

          {/* Slider: Peak-to-Average Ratio (PAR) */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#333] flex items-center gap-1">
                <span>Peak-to-Average Ratio (PAR)</span>
              </span>
              <span className="font-bold text-[#1A1A1A] font-mono px-1.5 bg-[#F2F2F2] border border-[#D1D1D1]">{par.toFixed(1)}:1 Peak</span>
            </div>
            <input
              id="slider-par"
              type="range"
              min={1.5}
              max={6.0}
              step={0.5}
              value={par}
              onChange={(e) => setPar(Number(e.target.value))}
              className="w-full accent-[#F27D26] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#999] font-mono">
              <span>1.5:1 (Flat)</span>
              <span>3.5:1 (Enterprise)</span>
              <span>6.0:1 (Spiky)</span>
            </div>
          </div>

          {/* Slider: CPU Overcommit Ratio */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#333] flex items-center gap-1">
                <span>vCPU-to-pCore Overcommit</span>
              </span>
              <span className="font-bold text-[#F27D26] font-mono px-1.5 bg-[#FFF2E8] border border-[#F27D26]/30">{overcommitRatio.toFixed(1)}:1 Ratio</span>
            </div>
            <input
              id="slider-overcommit"
              type="range"
              min={1.0}
              max={5.5}
              step={0.5}
              value={overcommitRatio}
              onChange={(e) => setOvercommitRatio(Number(e.target.value))}
              className="w-full accent-[#F27D26] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#999] font-mono">
              <span>1.0:1 (Dedicated)</span>
              <span>3.0:1 (Standard)</span>
              <span>5.5:1 (Aggressive)</span>
            </div>
          </div>

          {/* Slider: Memory Ballooning Efficiency */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#333] flex items-center gap-1">
                <span>Memory Ballooning Reclaim</span>
              </span>
              <span className="font-bold text-[#0066FF] font-mono px-1.5 bg-[#E6F3FF] border border-[#0066FF]/30">{ballooningEfficiency}% Reclaimed</span>
            </div>
            <input
              id="slider-ballooning"
              type="range"
              min={0}
              max={50}
              step={5}
              value={ballooningEfficiency}
              onChange={(e) => setBallooningEfficiency(Number(e.target.value))}
              className="w-full accent-[#0066FF] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#999] font-mono">
              <span>0% (Pinned)</span>
              <span>25% (Conservative)</span>
              <span>50% (High Trim)</span>
            </div>
          </div>

          {/* Financial Parameters */}
          <div className="pt-4 border-t border-[#EBEBEB] grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666] mb-1">
                Server CAPEX ($/unit)
              </label>
              <input
                id="input-server-capex"
                type="number"
                value={serverHardwareCost}
                onChange={(e) => setServerHardwareCost(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs bg-[#F9F9F9] border border-[#D1D1D1] focus:border-[#1A1A1A] font-mono text-[#1A1A1A] rounded-none outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666] mb-1">
                Annual OPEX ($/host/yr)
              </label>
              <input
                id="input-server-opex"
                type="number"
                value={annualOpexPerServer}
                onChange={(e) => setAnnualOpexPerServer(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs bg-[#F9F9F9] border border-[#D1D1D1] focus:border-[#1A1A1A] font-mono text-[#1A1A1A] rounded-none outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Live Comparison Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Key TCO & Consolidation Callouts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-white border border-[#D1D1D1] shadow-[4px_4px_0px_rgba(20,20,20,0.05)] p-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#666] block">
                Server Consolidation
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-serif italic text-[#1A1A1A]">
                  {consolidationRatio}x
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                  -{hostsConsolidated} hosts
                </span>
              </div>
              <p className="text-[11px] text-[#666] mt-1.5">
                From {staticHostsNeeded} down to {multiplexedHostsNeeded} physical hosts
              </p>
            </div>

            <div className="bg-white border border-[#D1D1D1] shadow-[4px_4px_0px_rgba(20,20,20,0.05)] p-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#666] block">
                3-Year TCO Savings
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-serif italic text-emerald-700">
                  ${(threeYearSavings / 1000).toFixed(0)}k
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 border border-emerald-300">
                  -{tcoSavingsPercent}%
                </span>
              </div>
              <p className="text-[11px] text-[#666] mt-1.5 font-mono text-[10px]">
                CAPEX: -${(capexSavings / 1000).toFixed(0)}k | OPEX: -${(annualOpexSavings / 1000).toFixed(0)}k/yr
              </p>
            </div>

            <div className="bg-white border border-[#D1D1D1] shadow-[4px_4px_0px_rgba(20,20,20,0.05)] p-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#666] block">
                Contention Risk Index
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-serif italic text-[#1A1A1A]">
                  {riskIndex}%
                </span>
              </div>
              <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 mt-1.5 border inline-block ${riskStatus.color}`}>
                {riskStatus.label}
              </div>
            </div>
          </div>

          {/* Comparative Cost Breakdown Table */}
          <div className="bg-white border border-[#1A1A1A] shadow-[6px_6px_0px_rgba(20,20,20,0.06)] overflow-hidden">
            <div className="px-5 py-3.5 bg-[#1A1A1A] text-white flex items-center justify-between border-b border-[#333]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Static Allocation vs Statistical Multiplexing Financial Model
              </h4>
              <span className="text-[10px] font-mono text-[#BBB] uppercase">
                {workloadCount} Workloads
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#2A2A2A] text-white font-bold uppercase tracking-wider text-[10px] border-b border-[#333]">
                  <tr>
                    <th className="px-4 py-3 border-r border-[#444]">Financial Dimension</th>
                    <th className="px-4 py-3 border-r border-[#444]">Static 1:1 Allocation</th>
                    <th className="px-4 py-3 border-r border-[#444] bg-[#333]">Statistical Multiplexing</th>
                    <th className="px-4 py-3 text-emerald-400">FinOps Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D1D1D1] text-[#1A1A1A]">
                  <tr className="hover:bg-[#F9F9F9]">
                    <td className="px-4 py-3 font-bold bg-[#F9F9F9] border-r border-[#D1D1D1]">Physical Servers Required</td>
                    <td className="px-4 py-3 font-mono border-r border-[#D1D1D1]">{staticHostsNeeded} hosts</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#0066FF] border-r border-[#D1D1D1]">{multiplexedHostsNeeded} hosts</td>
                    <td className="px-4 py-3 font-bold text-emerald-700 font-mono">-{hostsConsolidated} hosts ({tcoSavingsPercent}% reduction)</td>
                  </tr>
                  <tr className="hover:bg-[#F9F9F9]">
                    <td className="px-4 py-3 font-bold bg-[#F9F9F9] border-r border-[#D1D1D1]">Initial Server CAPEX</td>
                    <td className="px-4 py-3 font-mono border-r border-[#D1D1D1]">${(staticCapex / 1000).toFixed(0)}k</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#0066FF] border-r border-[#D1D1D1]">${(multiplexedCapex / 1000).toFixed(0)}k</td>
                    <td className="px-4 py-3 font-bold text-emerald-700 font-mono">-${(capexSavings / 1000).toFixed(0)}k upfront cash saved</td>
                  </tr>
                  <tr className="hover:bg-[#F9F9F9]">
                    <td className="px-4 py-3 font-bold bg-[#F9F9F9] border-r border-[#D1D1D1]">Annual Facility & Licensing OPEX</td>
                    <td className="px-4 py-3 font-mono border-r border-[#D1D1D1]">${(staticAnnualOpex / 1000).toFixed(0)}k/yr</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#0066FF] border-r border-[#D1D1D1]">${(multiplexedAnnualOpex / 1000).toFixed(0)}k/yr</td>
                    <td className="px-4 py-3 font-bold text-emerald-700 font-mono">-${(annualOpexSavings / 1000).toFixed(0)}k/yr recurring</td>
                  </tr>
                  <tr className="hover:bg-[#F9F9F9]">
                    <td className="px-4 py-3 font-bold bg-[#F9F9F9] border-r border-[#D1D1D1]">3-Year Cumulative TCO</td>
                    <td className="px-4 py-3 font-mono font-bold border-r border-[#D1D1D1]">${(static3YrTco / 1000).toFixed(0)}k</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#1A1A1A] bg-[#F2F2F2] border-r border-[#D1D1D1]">${(multiplexed3YrTco / 1000).toFixed(0)}k</td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-700">-${(threeYearSavings / 1000).toFixed(0)}k net profit yield</td>
                  </tr>
                  <tr className="hover:bg-[#F9F9F9]">
                    <td className="px-4 py-3 font-bold bg-[#F9F9F9] border-r border-[#D1D1D1]">Contention / Noisy Neighbor Risk</td>
                    <td className="px-4 py-3 text-emerald-700 font-bold border-r border-[#D1D1D1]">0% (Absolute isolation)</td>
                    <td className="px-4 py-3 font-bold text-amber-800 border-r border-[#D1D1D1]">
                      {riskIndex}% (Requires CPU QoS & ballooning limits)
                    </td>
                    <td className="px-4 py-3 text-[#666] text-[11px]">Mitigated via cgroups & hypervisor scheduler limits</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Educational FinOps Insight Card in Geometric Balance Style */}
          <div className="bg-[#E6F3FF] border-l-4 border-[#0066FF] p-5 shadow-[4px_4px_0px_rgba(20,20,20,0.04)]">
            <div className="flex items-center space-x-2 text-[#0066FF] font-bold text-[10px] uppercase tracking-widest mb-1.5">
              <Info className="w-4 h-4 text-[#0066FF]" />
              <span>Techno-Management Rule of Thumb for Cloud Leaders:</span>
            </div>
            <p className="text-[#1A1A1A] text-xs sm:text-[13px] leading-relaxed font-medium">
              When workloads have high Peak-to-Average Ratios (PAR &gt; 3.0), statically allocating 1:1 dedicated hardware forces your enterprise to buy servers that sit 
              <strong> 80% to 85% idle</strong> for 20+ hours a day. Statistical multiplexing leverages the mathematical certainty that independent workloads will not all spike simultaneously. 
              The resulting <strong>{consolidationRatio}x consolidation</strong> converts wasted idle hardware into gross operating margin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
