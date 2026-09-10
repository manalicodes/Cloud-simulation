import { ModuleLesson, StackLayer } from "../types";

export const LESSON_MODULES: ModuleLesson[] = [
  {
    id: 1,
    title: "Virtualization Foundations (VMM & Hypervisors)",
    subtitle: "Hardware Abstraction, Ring Architecture & Virtual Machine Monitors",
    category: "Architecture & Low-Level Mechanics",
    concepts: [
      "Virtual Machine Monitor (VMM) role: intercepting privileged instructions and managing virtual CPU/memory states.",
      "Ring Architecture: Ring -1 (Hypervisor root mode / VMX), Ring 0 (OS Kernel), Ring 3 (User Applications).",
      "Type 1 (Bare-Metal): Hypervisor executes directly on physical server hardware without host OS mediation.",
      "Type 2 (Hosted): Hypervisor runs as an application atop an underlying host operating system.",
      "Hardware-assisted virtualization: Intel VT-x and AMD-V enabling direct hardware trap-and-emulate handling."
    ],
    keyQuestion: "Why does the removal of the host OS layer in Type 1 hypervisors dramatically reduce I/O jitter and context-switching overhead?",
    presetComparison: {
      optionA: "Type 1 Bare-Metal Hypervisor",
      optionB: "Type 2 Hosted Hypervisor"
    },
    executiveDilemma: {
      scenario: "Your financial trading desk demands sub-3 millisecond transaction execution for a high-frequency trading algorithm. The dev team wants to host it on a local multi-tenant developer server running Windows Server with VMware Workstation (Type 2) to save $90k in bare-metal hypervisor licensing. What is your call?",
      options: [
        {
          id: "opt1",
          label: "Approve Type 2 Hosted to save $90k CAPEX",
          impact: "Saves immediate software license cost, but double-scheduling and host OS context switching introduce 12-25ms latency spikes, resulting in missed algorithmic trades costing millions.",
          prompt: "Evaluate the risk of using a Type 2 hypervisor for high-frequency trading workloads where microsecond execution latency is critical."
        },
        {
          id: "opt2",
          label: "Mandate Type 1 Bare-Metal (e.g., KVM/vSphere/Nitro)",
          impact: "Direct VMX root execution with SR-IOV direct memory access guarantees deterministic low latency (<2ms) and hardware-enforced CPU pinning.",
          prompt: "Explain how Type 1 Hypervisors use Ring -1 and hardware-assisted virtualization (VT-x/AMD-V) to eliminate OS-level context switching."
        }
      ]
    }
  },
  {
    id: 2,
    title: "Resource Optimization & Statistical Multiplexing",
    subtitle: "Overcommit Yields, Peak-to-Average Ratios (PAR) & FinOps Economics",
    category: "FinOps & Capacity Engineering",
    concepts: [
      "Statistical Multiplexing: Pooling independent stochastic workloads so aggregate capacity approaches the average rather than sum of individual peaks.",
      "CPU Overcommit: Provisioning more virtual CPUs (vCPUs) than physical cores (e.g., 3:1 or 4:1 ratio) relying on asynchronous duty cycles.",
      "Memory Ballooning: Dynamically reclaiming guest VM memory via pseudo-device drivers without restarting virtual machines.",
      "Peak-to-Average Ratio (PAR): The multiplier between maximum instantaneous spike and baseline utilization.",
      "Under-provisioning vs. Over-provisioning: Balancing idle hardware depreciation against noisy-neighbor SLA breach fines."
    ],
    keyQuestion: "How does statistical multiplexing transform low server utilization (15%) into 70%+ gross profit margins for cloud providers?",
    presetComparison: {
      optionA: "Static Allocation (1:1 Dedicated)",
      optionB: "Statistical Multiplexing (Shared Dynamic)"
    },
    executiveDilemma: {
      scenario: "Your e-commerce platform has 50 microservices with an aggregate Peak-to-Average Ratio of 4:1. The infrastructure director insists on 1:1 dedicated physical core allocation for every service to guarantee zero contention, demanding a $1.2M budget for 80 physical rack servers. How do you respond?",
      options: [
        {
          id: "opt1",
          label: "Enforce a 3.5:1 CPU overcommit policy with hypervisor throttling",
          impact: "Reduces required physical servers from 80 to 24, saving $840k in CAPEX and power, while using hypervisor CPU quotas to protect tier-1 services.",
          prompt: "How does a 3.5:1 CPU overcommit ratio deliver 70% FinOps savings while mitigating noisy neighbor risks through hypervisor scheduling?"
        },
        {
          id: "opt2",
          label: "Accept Static 1:1 Allocation to avoid noisy neighbor risk completely",
          impact: "Guarantees zero jitter, but 75% of compute capacity sits idle 22 hours per day, destroying unit economics and inflating per-order cost.",
          prompt: "What are the financial and operational penalties of sizing static cloud infrastructure for extreme peak loads instead of statistical multiplexing?"
        }
      ]
    }
  },
  {
    id: 3,
    title: "Cloud Service Models (IaaS vs. PaaS vs. SaaS)",
    subtitle: "The Shared Responsibility Boundary, CAPEX-to-OPEX & Control vs. Speed",
    category: "Service Architecture & Governance",
    concepts: [
      "Shared Responsibility Model: Division of security, maintenance, and compliance obligations between tenant and cloud provider.",
      "IaaS (Infrastructure as a Service): Customer manages OS, runtime, middleware, application, and data; provider manages hypervisor and hardware.",
      "PaaS (Platform as a Service): Customer deploys application code and schema; provider manages OS patches, scaling, and runtime.",
      "SaaS (Software as a Service): Fully managed turnkey business software; customer governs identities, data classification, and access policies.",
      "Control vs. Convenience Trade-off: Higher abstraction reduces operational labor and time-to-market but restricts bespoke architectural optimizations."
    ],
    keyQuestion: "Why is an unpatched OS vulnerability in IaaS the customer's legal liability, while in PaaS it is the cloud provider's contractual SLA obligation?",
    presetComparison: {
      optionA: "IaaS (Virtual Machines)",
      optionB: "PaaS / Serverless Compute"
    },
    executiveDilemma: {
      scenario: "Your engineering team is building a greenfield customer onboarding portal. Senior engineers want to deploy custom Kubernetes on raw IaaS VMs for maximum kernel tuning, requiring 3 dedicated DevOps engineers. Product management wants managed Serverless PaaS to launch in 6 weeks. What is your executive direction?",
      options: [
        {
          id: "opt1",
          label: "Direct the team to Serverless PaaS to prioritize time-to-market",
          impact: "Shifts OS patching, auto-scaling, and runtime security to the provider; cuts time-to-market from 6 months to 6 weeks and avoids hiring 3 DevOps specialists.",
          prompt: "Contrast the total cost of ownership (TCO) including engineering labor between self-hosted Kubernetes on IaaS vs Serverless PaaS."
        },
        {
          id: "opt2",
          label: "Approve custom IaaS Kubernetes cluster for maximum architectural control",
          impact: "Gives complete networking and kernel control, but burdens the team with cluster upgrades, node patching, etcd backups, and 24/7 on-call firefighting.",
          prompt: "What hidden operational risks and labor costs emerge when engineering teams choose IaaS over PaaS for standard web applications?"
        }
      ]
    }
  },
  {
    id: 4,
    title: "Deployment Models & Multi-Cloud Economics",
    subtitle: "Data Sovereignty, Egress Tollbooths, Vendor Lock-in & Repatriation",
    category: "Global Strategy & Multi-Cloud",
    concepts: [
      "Deployment Models: Public Cloud (hyper-scale multi-tenancy), Private Cloud (dedicated sovereignty), Hybrid Cloud, Multi-Cloud.",
      "Data Sovereignty & Compliance: Legal requirements (GDPR, HIPAA, DORA, FedRAMP) mandating data residency inside national borders.",
      "The Egress Cost Trap: Cloud providers allow free data ingestion (ingress) but charge punitive fees ($0.05 - $0.09/GB) for outbound data egress.",
      "Multi-Cloud Fallacy vs. Reality: Multi-cloud redundancy can quadruple operational complexity and eliminate volume discount tiers without careful API abstraction.",
      "Cloud Repatriation: Moving predictable, steady-state high-I/O workloads from public cloud back to bare-metal colo to arrest soaring OPEX."
    ],
    keyQuestion: "How do egress fees create 'data gravity' that locks enterprise architectures into a single cloud provider?",
    presetComparison: {
      optionA: "Hybrid Cloud (On-Premises + Public)",
      optionB: "Multi-Cloud (AWS + GCP + Azure)"
    },
    executiveDilemma: {
      scenario: "The Board asks you to implement an active-active multi-cloud architecture split evenly across AWS and Azure to prevent vendor lock-in. Your current analytical database processes 120 Terabytes of daily cross-cloud queries. How do you advise the Board?",
      options: [
        {
          id: "opt1",
          label: "Warn the Board against active-active multi-cloud due to egress fees and complexity",
          impact: "Points out that 120TB daily cross-cloud egress will generate $320,000/month in bandwidth fees alone, and recommends a single primary cloud with cold DR instead.",
          prompt: "Analyze the FinOps hazards of active-active multi-cloud data synchronization, focusing on cross-cloud egress costs and distributed consensus latency."
        },
        {
          id: "opt2",
          label: "Approve the active-active multi-cloud mandate unconditionally",
          impact: "Eliminates single-provider outage risk, but introduces high latency across cloud boundaries, quadruples IAM complexity, and inflates annual cloud spend by $3.8M.",
          prompt: "Under what specific regulatory or operational conditions does an enterprise actually justify the high overhead of a multi-cloud deployment?"
        }
      ]
    }
  },
  {
    id: 5,
    title: "Executive Capstone Simulator: CIO Boardroom Presentation",
    subtitle: "Balancing Technical Debt, 4x Hypervisor Price Hikes & The 7 Rs of Cloud Migration",
    category: "Executive Strategy & Board Governance",
    concepts: [
      "The 7 Rs Migration Framework: Rehost (Lift & Shift), Replatform (Tinker), Refactor (Modernize/Cloud-Native), Repurchase (Drop & Shop to SaaS), Retain, Retire, Relocate.",
      "Hypervisor License Shock: Managing sudden vendor pricing changes (e.g. per-core subscription enforcement) through workload triage.",
      "Technical Debt Amortization: Quantifying the maintenance drag of legacy unpatched operating systems versus migration replatforming costs.",
      "Board Presentation Dynamics: Translating technical latency, IOPS, and hypervisor rings into Board-level KPIs: EBITDA margin, agility, and risk posture.",
      "FinOps Cloud Governance: Establishing automated budget guardrails, unit cost metrics, and tag-based showback/chargeback."
    ],
    keyQuestion: "How does an executive convince a skeptical CFO that Refactoring high-priority workloads yields a higher 3-year ROI than cheap Lift-and-Shift?",
    presetComparison: {
      optionA: "Rehost (Lift & Shift)",
      optionB: "Refactor (Cloud-Native Modernization)"
    },
    executiveDilemma: {
      scenario: "Your 15-year-old monolithic ERP handles $300M in annual transactions on 120 aging virtual machines. The Board gives you an $8M budget. The legacy vendor offers a quick Rehost migration in 3 months for $1.5M, but running costs will be $2M/year. Re-architecting (Refactoring) into event-driven microservices will take 18 months and cost $6M, but drops run costs to $300k/year and unlocks real-time mobile checkout. What is your Board pitch?",
      options: [
        {
          id: "opt1",
          label: "Propose a Two-Phase Strategy: Relocate/Rehost first to stop license bleeding, then Refactor core revenue modules",
          impact: "Pragmatic balance: Stops immediate data center lease expiration while modernizing only the high-ROI checkout modules, preserving capital and mitigating project failure risk.",
          prompt: "Formulate a two-phase cloud migration strategy presentation to the Board that balances urgent risk mitigation with long-term digital agility."
        },
        {
          id: "opt2",
          label: "Commit to a 100% Big-Bang Refactor right now",
          impact: "High potential long-term payoff, but 70% of big-bang legacy ERP rewrites suffer budget overruns and operational delays, risking executive termination if deadlines slip.",
          prompt: "Analyze the risks and executive governance controls required when proposing an enterprise refactoring project to the Board of Directors."
        }
      ]
    }
  }
];

export const SHARED_RESPONSIBILITY_LAYERS: StackLayer[] = [
  {
    id: "data",
    name: "Data Classification & Governance",
    description: "Customer data assets, encryption at rest/transit, regulatory classification, retention policies.",
    ownership: {
      "on-prem": "customer",
      "iaas": "customer",
      "paas": "customer",
      "saas": "customer",
      "serverless": "customer"
    },
    keyThreats: "Ransomware, accidental public bucket exposure, unauthorized insider access, GDPR non-compliance."
  },
  {
    id: "iam",
    name: "Identity & Access Management (IAM)",
    description: "User authentication, multi-factor authentication (MFA), role-based permissions, service principals.",
    ownership: {
      "on-prem": "customer",
      "iaas": "customer",
      "paas": "customer",
      "saas": "customer",
      "serverless": "customer"
    },
    keyThreats: "Over-privileged service keys, credential stuffing, lack of MFA, leaked API tokens in public repos."
  },
  {
    id: "app",
    name: "Application Code & Logic",
    description: "Source code, business logic, API integrations, third-party libraries, SQL query construction.",
    ownership: {
      "on-prem": "customer",
      "iaas": "customer",
      "paas": "customer",
      "saas": "provider",
      "serverless": "customer"
    },
    keyThreats: "SQL injection, cross-site scripting (XSS), software supply chain vulnerabilities (Log4j), memory leaks."
  },
  {
    id: "runtime",
    name: "Runtime & Middleware",
    description: "Language runtimes (Node.js, JVM, Python), container engines, message queues, managed web servers.",
    ownership: {
      "on-prem": "customer",
      "iaas": "customer",
      "paas": "provider",
      "saas": "provider",
      "serverless": "provider"
    },
    keyThreats: "Runtime zero-days, unpatched Java versions, container escape vulnerabilities, memory exhaustion."
  },
  {
    id: "os",
    name: "Operating System (Guest OS)",
    description: "Kernel patching, user account management, OS-level firewall (iptables), daemon services.",
    ownership: {
      "on-prem": "customer",
      "iaas": "customer",
      "paas": "provider",
      "saas": "provider",
      "serverless": "provider"
    },
    keyThreats: "Unpatched kernel exploits (Dirty COW), rootkit installations, unhardened default services."
  },
  {
    id: "virtualization",
    name: "Hypervisor & Virtualization Layer",
    description: "VMM software (KVM, ESXi, Nitro), vCPU scheduling, hardware abstraction, virtual switches.",
    ownership: {
      "on-prem": "customer",
      "iaas": "provider",
      "paas": "provider",
      "saas": "provider",
      "serverless": "provider"
    },
    keyThreats: "Hypervisor escape vulnerabilities (Venom, Spectre/Meltdown cross-VM leak), noisy neighbor resource starvation."
  },
  {
    id: "hardware",
    name: "Physical Hardware & Compute Servers",
    description: "Blade chassis, Xeon/EPYC processors, ECC RAM modules, NVMe storage arrays, top-of-rack switches.",
    ownership: {
      "on-prem": "customer",
      "iaas": "provider",
      "paas": "provider",
      "saas": "provider",
      "serverless": "provider"
    },
    keyThreats: "Hardware memory corruption, thermal throttling, supply chain firmware tampering, power supply failure."
  },
  {
    id: "facilities",
    name: "Physical Data Center & Environmental Controls",
    description: "Physical perimeter security, biometric access, dual UPS power grids, HVAC cooling, fire suppression.",
    ownership: {
      "on-prem": "customer",
      "iaas": "provider",
      "paas": "provider",
      "saas": "provider",
      "serverless": "provider"
    },
    keyThreats: "Power grid failure, physical facility break-in, natural disasters (floods, earthquakes), cooling failure."
  }
];

export const CAPSTONE_WORKLOADS = [
  {
    id: "wl1",
    name: "Core Financial Transaction Database",
    currentTech: "Oracle RAC on 16 bare-metal on-prem hosts, 8TB NVMe storage",
    characteristics: "Sub-millisecond write latency, strict ACID guarantees, PCI-DSS Level 1 compliance.",
    businessPriority: "Critical" as const,
    annualRunCost: 850,
    selectedStrategy: "Replatform" as const,
    strategyRationale: "Migrate to managed cloud database engine with read replicas and automated multi-AZ failover to preserve ACID compliance while eliminating manual hardware maintenance."
  },
  {
    id: "wl2",
    name: "Customer Mobile Checkout API",
    currentTech: "Java Spring Boot on 60 on-prem VMware VMs",
    characteristics: "Extreme 8:1 Peak-to-Average Ratio during marketing campaigns, stateless, microservice architecture.",
    businessPriority: "Critical" as const,
    annualRunCost: 420,
    selectedStrategy: "Refactor" as const,
    strategyRationale: "Containerize and deploy to managed Kubernetes/Serverless with horizontal pod autoscaling to dynamically match seasonal spikes and reduce idle server waste."
  },
  {
    id: "wl3",
    name: "Legacy Windows 2008 Reporting Engine",
    currentTech: "Windows Server 2008 R2, proprietary 32-bit compiled binaries",
    characteristics: "Vendor defunct, cannot modify source code, runs monthly audit batch jobs only.",
    businessPriority: "Low" as const,
    annualRunCost: 180,
    selectedStrategy: "Retain" as const,
    strategyRationale: "Air-gap in secure isolated VLAN on minimal local hardware or evaluate retirement in Q4 once accounting finishes data archive extraction."
  },
  {
    id: "wl4",
    name: "Employee HR & Benefits Portal",
    currentTech: "Heavily customized commercial off-the-shelf software on 12 VMs",
    characteristics: "High administrative maintenance burden, requires 2 full-time DBAs, non-differentiating.",
    businessPriority: "Medium" as const,
    annualRunCost: 310,
    selectedStrategy: "Repurchase" as const,
    strategyRationale: "Replace with enterprise SaaS (e.g. Workday/BambooHR) to eliminate infrastructure overhead, transfer compliance liability, and free internal engineering talent."
  },
  {
    id: "wl5",
    name: "Non-Production Dev / Staging Clusters",
    currentTech: "180 developer VMs provisioned statically, running 24/7",
    characteristics: "Average utilization <12% outside office hours, frequent orphaned zombie instances.",
    businessPriority: "Medium" as const,
    annualRunCost: 540,
    selectedStrategy: "Replatform" as const,
    strategyRationale: "Migrate to on-demand ephemeral cloud dev environments with automated shutdown policies at 7 PM and weekend dormancy, slashing compute burn by 65%."
  }
];
