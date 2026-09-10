import React, { useState } from "react";
import { SHARED_RESPONSIBILITY_LAYERS } from "../data/modulesData";
import { CloudModel, StackLayer, ResponsibilityOwner } from "../types";
import {
  ShieldAlert,
  ShieldCheck,
  Server,
  Layers,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Lock,
  Flame,
  ArrowRight
} from "lucide-react";

interface SharedResponsibilityExplorerProps {
  onCompareTrigger: (optionA: string, optionB: string) => void;
}

const INCIDENT_SCENARIOS = [
  {
    id: "inc-log4j",
    title: "Application Library Zero-Day (e.g. Log4j RCE)",
    layerId: "app",
    description: "An open-source logging library in the web application allows remote attackers to execute arbitrary shell commands.",
    customerLiability: "100% Customer Liability in IaaS, PaaS, and Serverless. In SaaS, it is the SaaS vendor's responsibility.",
    mitigation: "Software Bill of Materials (SBOM) scanner, dependency firewalls, runtime application self-protection (RASP)."
  },
  {
    id: "inc-os-patch",
    title: "Unpatched OS Kernel Vulnerability (Dirty COW / PwnKit)",
    layerId: "os",
    description: "Privilege escalation vulnerability in the Linux kernel allowing non-root user accounts to gain root permissions.",
    customerLiability: "In IaaS: 100% Customer Liability. The customer owns guest OS patch cadence. In PaaS, Serverless, and SaaS: 100% Cloud Provider responsibility.",
    mitigation: "Automated golden AMI baking, live kernel patching (kpatch), or migrating to PaaS/Serverless to transfer OS liability."
  },
  {
    id: "inc-hypervisor-escape",
    title: "Hypervisor Microarchitectural Leak (Spectre / Meltdown / Venom)",
    layerId: "virtualization",
    description: "Flaw in hardware branch prediction or VMM device emulation allowing code inside Guest VM to read memory from other VMs.",
    customerLiability: "Cloud Provider's legal and operational responsibility. The provider must patch hypervisors and firmware without customer downtime.",
    mitigation: "Cloud providers isolate workloads on custom hypervisor chips (e.g. AWS Nitro, GCP Titanium) to eliminate host OS trap surface."
  },
  {
    id: "inc-s3-leak",
    title: "Accidental Public Cloud Storage Bucket Exposure",
    layerId: "data",
    description: "A DevOps engineer sets an S3/Blob storage access policy to public read, leaking 4 million unencrypted customer records.",
    customerLiability: "100% Customer Liability across ALL cloud models (IaaS, PaaS, SaaS, Serverless). The cloud provider secures the cloud; the customer secures what they put in the cloud.",
    mitigation: "Cloud Security Posture Management (CSPM), organizational SCPs forbidding public buckets, default client-side KMS encryption."
  },
  {
    id: "inc-datacenter-cut",
    title: "Physical Datacenter Power Grid Collapse",
    layerId: "facilities",
    description: "Regional blackout knocks out main grid and secondary generator transfer switch fails in Availability Zone 1.",
    customerLiability: "Hardware & facility is the Provider's responsibility; however, Multi-AZ and Multi-Region high availability architecture remains the Customer's architectural design choice.",
    mitigation: "Architect multi-AZ active-active failover with automated health check routing."
  }
];

export const SharedResponsibilityExplorer: React.FC<SharedResponsibilityExplorerProps> = ({
  onCompareTrigger,
}) => {
  const [selectedModel, setSelectedModel] = useState<CloudModel>("iaas");
  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(null);

  const modelLabels: Record<CloudModel, { title: string; subtitle: string }> = {
    "on-prem": { title: "On-Premises", subtitle: "Customer Owns 100% of Stack" },
    "iaas": { title: "IaaS", subtitle: "Infrastructure as a Service (VMs & VPC)" },
    "paas": { title: "PaaS", subtitle: "Platform as a Service (App Service, Managed DB)" },
    "serverless": { title: "Serverless (FaaS)", subtitle: "Event-driven scale-to-zero compute" },
    "saas": { title: "SaaS", subtitle: "Software as a Service (Turnkey business app)" },
  };

  const activeIncident = INCIDENT_SCENARIOS.find((i) => i.id === activeIncidentId);

  const getOwnerBadge = (owner: ResponsibilityOwner) => {
    switch (owner) {
      case "customer":
        return {
          text: "Customer Responsible",
          bgColor: "bg-[#E6F3FF] text-[#0066FF] border-[#0066FF]/30",
          icon: ShieldAlert,
        };
      case "provider":
        return {
          text: "Cloud Provider SLA",
          bgColor: "bg-emerald-50 text-emerald-800 border-emerald-300",
          icon: ShieldCheck,
        };
      case "shared":
        return {
          text: "Shared / Co-Managed",
          bgColor: "bg-[#FFF2E8] text-[#F27D26] border-[#F27D26]/40",
          icon: AlertTriangle,
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-[#1A1A1A] text-white border border-[#333] shadow-[6px_6px_0px_rgba(20,20,20,0.1)] p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#F27D26] mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Module 4 • Governance & Blast-Radius Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif italic tracking-tight text-white">
              Shared Responsibility Stack & Incident Simulator
            </h1>
            <p className="text-xs sm:text-sm text-[#BBB] mt-1.5 max-w-3xl leading-relaxed">
              "The cloud provider is responsible for the security <strong>OF</strong> the cloud; the customer is responsible for security <strong>IN</strong> the cloud."
              Explore how your governance, liability, and operational blast-radius shift as you move up the abstraction ladder.
            </p>
          </div>

          <button
            id="shared-compare-btn"
            onClick={() => onCompareTrigger("IaaS (Virtual Machines)", "PaaS / Serverless Compute")}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#F27D26] hover:bg-[#E06D1B] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-[#F27D26] rounded-xs shadow-xs"
          >
            <span>Compare IaaS vs PaaS →</span>
          </button>
        </div>
      </div>

      {/* Model Selector Tabs */}
      <div className="bg-white p-3 border border-[#1A1A1A] shadow-[6px_6px_0px_rgba(20,20,20,0.06)] flex flex-wrap gap-2.5">
        {(Object.keys(modelLabels) as CloudModel[]).map((modelKey) => {
          const isSelected = selectedModel === modelKey;
          const info = modelLabels[modelKey];
          return (
            <button
              key={modelKey}
              id={`model-tab-${modelKey}`}
              onClick={() => setSelectedModel(modelKey)}
              className={`flex-1 min-w-[150px] p-3 text-left transition-all border cursor-pointer ${
                isSelected
                  ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-[3px_3px_0px_#F27D26]"
                  : "bg-white hover:bg-[#F9F9F9] text-[#333] border-[#D1D1D1]"
              }`}
            >
              <div className="font-bold text-xs uppercase tracking-wider">{info.title}</div>
              <div className={`text-[10px] mt-0.5 truncate ${isSelected ? "text-[#BBB]" : "text-[#777]"}`}>
                {info.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content: Stack Layers (7 cols) + Incident Blast Radius Simulator (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Layer Stack */}
        <div className="lg:col-span-7 bg-white border border-[#1A1A1A] shadow-[6px_6px_0px_rgba(20,20,20,0.06)] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EBEBEB] pb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
              {modelLabels[selectedModel].title} Architectural Stack Layers
            </h3>
            <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-wider">
              <span className="inline-flex items-center gap-1.5 text-[#0066FF]">
                <span className="w-2 h-2 bg-[#0066FF]"></span> Customer
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-700">
                <span className="w-2 h-2 bg-emerald-600"></span> Provider SLA
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            {SHARED_RESPONSIBILITY_LAYERS.map((layer, index) => {
              const owner = layer.ownership[selectedModel];
              const badge = getOwnerBadge(owner);
              const BadgeIcon = badge.icon;
              const isTargetedByIncident = activeIncident?.layerId === layer.id;

              return (
                <div
                  key={layer.id}
                  className={`p-3.5 border transition-all ${
                    isTargetedByIncident
                      ? "ring-2 ring-red-500 bg-red-50/80 border-red-500 shadow-[4px_4px_0px_rgba(239,68,68,0.2)]"
                      : owner === "customer"
                      ? "bg-[#F7FAFD] border-[#CCE0F5]"
                      : "bg-[#F7FBF9] border-[#D1E7DD]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-[10px] font-mono text-[#999] font-bold w-4">
                        0{SHARED_RESPONSIBILITY_LAYERS.length - index}
                      </span>
                      <span className="text-xs font-bold text-[#1A1A1A]">
                        {layer.name}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${badge.bgColor}`}
                    >
                      <BadgeIcon className="w-3 h-3" />
                      <span>{badge.text}</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-[#555] mt-1 pl-6 leading-relaxed">
                    {layer.description}
                  </p>

                  <div className="mt-1.5 pl-6 flex items-center text-[10px] text-[#777] gap-1">
                    <span className="font-bold text-[#444] uppercase tracking-wider">Key Threat:</span>
                    <span className="italic">{layer.keyThreats}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Incident Blast-Radius Simulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#1A1A1A] shadow-[6px_6px_0px_rgba(20,20,20,0.06)] p-6">
            <div className="flex items-center space-x-2 text-[#1A1A1A] mb-2">
              <Flame className="w-4 h-4 text-[#F27D26]" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Incident Liability Simulator</h3>
            </div>
            <p className="text-xs text-[#666] mb-3 leading-relaxed">
              Trigger simulated cybersecurity or infrastructure outages to evaluate contractual responsibility and legal blast radius under <strong>{modelLabels[selectedModel].title}</strong>:
            </p>

            <div className="space-y-2">
              {INCIDENT_SCENARIOS.map((inc) => {
                const isSelected = activeIncidentId === inc.id;
                return (
                  <button
                    key={inc.id}
                    id={`incident-btn-${inc.id}`}
                    onClick={() => setActiveIncidentId(isSelected ? null : inc.id)}
                    className={`w-full text-left p-3 border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-[3px_3px_0px_#F27D26]"
                        : "bg-[#F9F9F9] hover:bg-white text-[#1A1A1A] border-[#D1D1D1] hover:border-[#1A1A1A]"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{inc.title}</span>
                      <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-mono ${isSelected ? "bg-[#F27D26] text-white" : "bg-[#EBEBEB] text-[#555]"}`}>
                        Test
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Incident Deep-Dive */}
            {activeIncident && (
              <div className="mt-4 p-4.5 bg-[#FFF9F3] border border-[#F27D26] shadow-[4px_4px_0px_rgba(242,125,38,0.15)] text-xs space-y-2.5">
                <div className="flex items-center gap-1.5 text-[#F27D26] font-bold text-[10px] uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-[#F27D26]" />
                  <span>Liability Verdict: {activeIncident.title}</span>
                </div>
                <p className="text-[#1A1A1A] leading-relaxed font-medium">
                  {activeIncident.description}
                </p>

                <div className="pt-2 border-t border-[#F27D26]/20 text-[#1A1A1A]">
                  <strong className="text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider block mb-0.5">Who Pays / Who is Accountable?</strong>
                  <p className="text-[11px] leading-relaxed text-[#333]">
                    {activeIncident.customerLiability}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F27D26]/20 text-[#1A1A1A]">
                  <strong className="text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider block mb-0.5">Executive Governance Mitigation:</strong>
                  <p className="text-[11px] leading-relaxed text-[#555]">
                    {activeIncident.mitigation}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Strategic Insight */}
          <div className="bg-[#1A1A1A] text-white p-5 border border-[#333] text-xs space-y-2 shadow-[4px_4px_0px_rgba(20,20,20,0.05)]">
            <span className="font-bold text-[#F27D26] block uppercase tracking-widest text-[10px]">
              Boardroom Takeaway
            </span>
            <p className="text-[#BBB] leading-relaxed text-[11px]">
              Moving from IaaS to Serverless or SaaS transfers up to <strong>70% of the operational attack surface</strong> (hypervisors, kernel patching, physical hardware) to hyper-scale cloud security teams.
              However, <strong>Data and Identity (IAM)</strong> NEVER leave the customer's purview. Over 80% of cloud breaches stem from customer IAM misconfiguration, not hypervisor exploits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
