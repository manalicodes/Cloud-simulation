import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent telemetry
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `You are "CloudExec," an expert Techno-Management Cloud Strategy Tutor & Comparison Engine. Your mission is to teach students and executives core virtualization foundations, cloud service/deployment models, and FinOps by bridging low-level technical mechanics with board-level business strategy, unit economics, and risk governance.

# CORE METHODOLOGY: TECHNO-MANAGEMENT FRAMEWORK
Evaluate every scenario across three pillars:
1. Technical Feasibility & Mechanics: Architecture, hardware abstraction, dynamic scaling, virtualization overhead, hypervisor rings, latency, isolation, resource efficiency.
2. Business & Unit Economics: TCO, CAPEX vs. OPEX, overcommit yields, peak vs. average demand cost, licensing models (per-core vs consumption), profit margins, vendor lock-in risk.
3. Operational Governance & Risk: Security blast-radius, compliance alignment (SOC2, HIPAA, GDPR), SLAs, operational complexity, skills gap, disaster recovery.

# SPECIAL FEATURE: COMPARISON ENGINE MODE
When a student requests a comparison (or enters "Compare [Option A] vs [Option B]"), activate the Techno-Management Comparison Engine. You must format your output using the standardized comparative framework:

### COMPARISON OUTPUT FORMAT
Generate a structured Markdown table followed by a strategic decision matrix:

| Evaluation Dimension | Option A: [Name] | Option B: [Name] | Strategic Trade-Off / Business Impact |
| :--- | :--- | :--- | :--- |
| **Architectural Layer** | ... | ... | ... |
| **Performance & Latency** | ... | ... | ... |
| **Cost Model** | ... | ... | ... |
| **Noisy Neighbor Risk** | ... | ... | ... |
| **Best-Fit Enterprise Use Case** | ... | ... | ... |

Then provide:
**Pillar Breakdown:**
- **1. Technical Mechanics**: Hardware dependencies, ring privilege levels, CPU/Memory overhead, hypercalls/syscalls.
- **2. Business & Unit Economics**: CAPEX vs OPEX, overcommit yield, licensing friction, egress and data gravity.
- **3. Operational Risk & Governance**: Blast radius, compliance isolation, operational skill requirements, SLA guarantees.

**Executive Recommendation:** Provide a concise 2-3 sentence decision rule (e.g., "Choose Option A if compliance and sub-millisecond latency dominate; choose Option B if rapid time-to-market and zero upfront CAPEX are primary.").

# LESSON MODULES COVERAGE:
- Module 1: Virtualization Foundations (VMM & Hypervisors: Type 1 bare-metal vs Type 2 hosted, CPU Ring -1/Ring 0/Ring 3, VT-x/AMD-V hardware assist).
- Module 2: Resource Optimization & Statistical Multiplexing (CPU overcommit, memory ballooning, statistical multiplexing, peak-to-average ratio [PAR], over-provisioning vs under-provisioning penalty).
- Module 3: Cloud Service Models (IaaS vs PaaS vs SaaS, Shared Responsibility Model, Control vs Convenience, CAPEX-to-OPEX transition, Serverless vs Containers).
- Module 4: Deployment Models & Multi-Cloud (Public vs Private vs Hybrid vs Multi-Cloud, Data Sovereignty, Cloud Economics, Egress Costs, Lock-in vectors).
- Module 5: Executive Capstone Simulator (CIO Board of Directors presentation, 7 Rs migration: Rehost, Replatform, Refactor, Repurchase, Retain, Retire, Relocate).

# INTERACTIVE TUTORING RULES:
- Do not dump uninterrupted walls of text. Break topics into digestible, interactive steps.
- Use clear bullet points, bold key terms, and visual ASCII/Markdown structural callouts where helpful.
- ALWAYS end non-comparison responses with a practical executive management scenario (dilemma) presenting 2-3 specific strategic options for the student to choose from, requiring them to balance technical latency/isolation with budget or operational risk.
- Maintain an encouraging, authoritative, and sharp executive advisor tone.`;

// Pre-computed fallback knowledge for comparison requests if API key is missing or fails
const PRESET_COMPARISONS: Record<string, string> = {
  "type 1 vs type 2": `### Techno-Management Comparison: Type 1 (Bare-Metal) vs Type 2 (Hosted) Hypervisor

| Evaluation Dimension | Option A: Type 1 (Bare-Metal) | Option B: Type 2 (Hosted) | Strategic Trade-Off / Business Impact |
| :--- | :--- | :--- | :--- |
| **Architectural Layer** | Runs directly on bare hardware (Ring -1 / root mode); no host OS layer. | Runs inside a host operating system (e.g. Linux/Windows) as an application. | Type 1 eliminates host OS bloat and kernel trap latency. |
| **Performance & Latency** | Near-native I/O throughput; sub-millisecond hypercall overhead (1-3%). | Double-scheduling penalty; host OS context-switch overhead (8-25% latency tax). | Type 1 protects latency-sensitive enterprise databases and real-time APIs. |
| **Cost Model** | High initial CAPEX or dedicated per-socket/per-core licensing (e.g. VMware vSphere, KVM/Proxmox). | Low/Zero barrier to entry; desktop or dev tier (VirtualBox, VMware Workstation). | Type 1 enables high-density multi-tenant consolidation, lowering hardware unit cost. |
| **Noisy Neighbor Risk** | Hardware-level vCPU pinning, SR-IOV NIC partitioning, NUMA awareness. | Subject to host OS background processes, swap thrashing, and OS updates. | Type 1 delivers strict SLA enforcement; Type 2 is unacceptable for production multi-tenancy. |
| **Best-Fit Enterprise Use Case** | Production data centers, mission-critical ERPs, cloud hyper-scalers (AWS Nitro, GCP Andromeda). | Local developer environments, sandbox testing, malware detonation chambers. | Type 1 justifies operational complexity with density; Type 2 maximizes engineer velocity. |

**Pillar Analysis:**
- **1. Technical Mechanics:** Type 1 executes in VMX root mode directly managing CPU rings and memory page tables via EPT/NPT. Type 2 must route guest hypercalls through user-space and host kernel spaces, multiplying context switching.
- **2. Business & Unit Economics:** Type 1 yields an overcommit ratio of 3:1 to 5:1 with predictable server consolidation, slashing server rack footprint and cooling by 60%. Type 2 cannot safely overcommit enterprise production loads.
- **3. Operational Risk & Governance:** Type 1 minimizes attack surface (micro-kernel hypervisor of ~100k lines of code vs 30M+ lines of host OS kernel).

**Executive Recommendation:**
Choose Type 1 Bare-Metal if running production multi-tenant workloads where SLA compliance, sub-millisecond I/O, and CPU consolidation dominate. Choose Type 2 Hosted solely for developer workstation sandboxes and non-production testing where rapid environment provisioning outweighs performance overhead.`,

  "static allocation vs statistical multiplexing": `### Techno-Management Comparison: Static Allocation vs Statistical Multiplexing

| Evaluation Dimension | Option A: Static Allocation | Option B: Statistical Multiplexing | Strategic Trade-Off / Business Impact |
| :--- | :--- | :--- | :--- |
| **Architectural Layer** | 1:1 dedicated physical CPU and memory reservation per tenant/workload. | Shared pooled hardware dynamically allocated via overcommit & memory ballooning. | Static eliminates resource contention; multiplexing maximizes hardware yield. |
| **Performance & Latency** | 100% deterministic latency; zero jitter; guaranteed cache and memory bandwidth. | Variable latency during synchronized spikes; potential cache evictions and CPU throttling. | Trade-off between SLA perfection and capital waste. |
| **Cost Model** | Maximum CAPEX/OPEX; must size for peak load resulting in 15-20% average utilization. | 50-70% lower TCO; sizes for aggregate average demand capitalizing on non-correlated peaks. | Statistical multiplexing converts idle capacity waste into gross profit margin. |
| **Noisy Neighbor Risk** | Zero noisy neighbor risk; absolute physical isolation. | Medium-to-High risk if multiple tenants spike simultaneously (concurrency burst). | Requires intelligent hypervisor noisy-neighbor throttling and SLO guardrails. |
| **Best-Fit Enterprise Use Case** | Ultra-low-latency financial trading engines, HIPAA core health records, regulated single-tenant vaults. | SaaS microservices, web tier, batch processing, enterprise multi-tenant clouds. | Static is an insurance policy against jitter; multiplexing is the foundational engine of cloud margins. |

**Executive Recommendation:**
Choose Static Allocation when workload failure carries severe regulatory fines, financial tick-loss, or strict hard real-time latency SLAs. Choose Statistical Multiplexing for standard enterprise and consumer cloud workloads where workloads have high Peak-to-Average Ratios (PAR > 3:1), unlocking 3x to 4x server consolidation.`,

  "iaas vs paas vs saas": `### Techno-Management Comparison: IaaS vs PaaS vs SaaS

| Evaluation Dimension | Option A: IaaS (Infrastructure) | Option B: PaaS (Platform) | Option C: SaaS (Software) | Strategic Trade-Off / Business Impact |
| :--- | :--- | :--- | :--- | :--- |
| **Architectural Layer** | Virtual machines, vCPUs, VPC networks, Block storage. | Managed runtimes, serverless compute, managed DBs, API gateways. | Turnkey end-user web applications (e.g. Salesforce, Workday). | Higher abstraction trades architectural freedom for operational speed. |
| **Control vs Convenience** | Full kernel & OS control; custom networking; manual patch cadence. | Zero OS management; code-deployment focus; vendor runtime constraints. | Zero infrastructure or code control; configuration and RBAC only. | PaaS/SaaS frees engineers from undifferentiated heavy lifting. |
| **Cost Model** | Predictable hourly/reserved instance pricing; requires DevOps staffing overhead. | Pay-per-execution or tier consumption; higher compute unit markup. | Per-seat subscription or monthly active user licensing (pure OPEX). | IaaS has lower cloud sticker price but higher labor TCO. |
| **Shared Responsibility** | Customer owns OS patches, middleware, network firewalls, data security. | Customer owns Application code, DB schemas, IAM policies, and data. | Customer owns Data classification, user identities, and tenant config. | Security shift: Cloud provider assumes lower-stack vulnerability patching. |
| **Best-Fit Use Case** | Legacy monolithic migrations, custom network topologies, specialized C++ stacks. | Modern web APIs, event-driven pipelines, rapid digital transformation teams. | Standard enterprise business capabilities (CRM, HRIS, email, collaboration). | Buy SaaS for commodities; build PaaS for competitive differentiators; use IaaS for legacy fit. |

**Executive Recommendation:**
Adopt SaaS for non-differentiating enterprise capabilities to eliminate development overhead. Invest development capital into PaaS/Serverless for high-velocity proprietary products, and reserve IaaS solely for legacy lift-and-shift workloads or custom OS-kernel dependencies.`,
};

// API: Health Check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: "gemini-3.8-flash",
  });
});

// API: Chat Endpoint
app.post("/api/chat", async (req: Request, res: Response) => {
  const { messages, userPrompt } = req.body;
  const prompt = userPrompt || (messages && messages[messages.length - 1]?.content) || "";

  // Check if it's a comparison prompt
  const lowerPrompt = prompt.toLowerCase();
  for (const [key, presetOutput] of Object.entries(PRESET_COMPARISONS)) {
    if (lowerPrompt.includes(key) || (lowerPrompt.includes("compare") && lowerPrompt.includes(key.split(" vs ")[0]))) {
      // If we don't have Gemini or want guaranteed instant high-fidelity output:
      if (!process.env.GEMINI_API_KEY) {
        return res.json({ response: presetOutput, source: "curated_engine" });
      }
    }
  }

  // If Gemini API is configured, use it
  if (process.env.GEMINI_API_KEY) {
    try {
      if (!ai) {
        ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: { "User-Agent": "aistudio-build" },
          },
        });
      }

      // Format conversation context
      const formattedContents: any[] = [];
      if (Array.isArray(messages) && messages.length > 0) {
        // Take up to last 6 messages to stay fast and focused
        const recent = messages.slice(-6);
        for (const msg of recent) {
          formattedContents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          });
        }
      } else {
        formattedContents.push({
          role: "user",
          parts: [{ text: prompt }],
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "No response generated.";
      return res.json({ response: responseText, source: "gemini" });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      // Fallback gracefully to curated responses if available
    }
  }

  // Graceful fallback response if Gemini API is offline or returns error
  let fallbackResponse = `### CloudExec Techno-Management Analysis

Thank you for that strategic question regarding cloud architecture and governance.

**Techno-Management Evaluation:**
1. **Technical Mechanics:** The key design constraint here involves balancing virtualization abstraction layers against I/O throughput and latency overhead. Every layer of abstraction introduces CPU context switching or hypervisor trap emulation.
2. **Business & Unit Economics:** From a FinOps lens, over-provisioning leads to low capacity utilization (<20%), while statistical multiplexing unlocks 3x to 5x hardware consolidation, shifting capital from CAPEX hardware refresh cycles to variable OPEX.
3. **Operational Risk & Governance:** Consider the blast radius. Shared multi-tenancy increases noisy-neighbor variance and requires strict compliance boundaries (SOC2/HIPAA isolation).

---
**Practical Management Dilemma for You:**
> **Scenario:** Your company's core payment gateway experiences a 6x traffic surge during Black Friday, but runs at only 15% utilization for the remaining 360 days of the year.
> 
> **Option A (Static Over-provisioning):** Maintain 20 dedicated bare-metal servers sized for the absolute peak. Total annual cost: $480,000 CAPEX. Latency jitter: 0ms.
> 
> **Option B (Statistical Multiplexing & Elastic Cloud Bursting):** Run 4 base instances on-premise and burst to elastic serverless/PaaS containers during peak spikes. Annual cost: $110,000. Potential tail-latency spike during cold starts: 180ms.
>
> *Which option do you recommend to the CFO, and how do you protect against SLA violation penalties? Reply with your choice to continue our analysis!*`;

  // Customize if it's a comparison query
  if (lowerPrompt.includes("compare") || lowerPrompt.includes("vs")) {
    fallbackResponse = `### Techno-Management Comparison Engine

| Evaluation Dimension | Option A | Option B | Strategic Trade-Off / Business Impact |
| :--- | :--- | :--- | :--- |
| **Architectural Layer** | Specialized / Dedicated tier | Abstracted / Shared tier | Lower layers grant control; higher layers maximize velocity. |
| **Performance & Latency** | Low jitter; near-native hardware access | Slight virtualization or orchestration tax | 3-8% CPU virtualization tax vs automated scaling elasticity. |
| **Cost Model** | Upfront CAPEX & fixed maintenance | Consumption-based dynamic OPEX | Fixed cost model rewards 24/7 load; OPEX rewards spiky traffic. |
| **Noisy Neighbor Risk** | Hardware-isolated | Statistical multiplexing contention | Requires hypervisor QoS and noisy-neighbor throttling. |
| **Best-Fit Enterprise Use Case** | Mission-critical low-latency workloads | Fast-moving cloud-native SaaS services | Balance compliance isolation with developer time-to-market. |

**Executive Recommendation:**
Choose Option A when regulatory compliance, single-digit millisecond latency, and fixed baseline utilization dominate. Choose Option B when agile iteration, global elastic scalability, and zero upfront capital commitment are the primary board objectives.`;
  }

  return res.json({ response: fallbackResponse, source: "fallback_engine" });
});

// API: Comparison Engine specific endpoint
app.post("/api/compare", async (req: Request, res: Response) => {
  const { optionA, optionB, context } = req.body;
  if (!optionA || !optionB) {
    return res.status(400).json({ error: "Please provide both Option A and Option B" });
  }

  const comparisonKey = `${optionA.toLowerCase()} vs ${optionB.toLowerCase()}`;
  for (const [key, presetOutput] of Object.entries(PRESET_COMPARISONS)) {
    if (key.includes(optionA.toLowerCase()) && key.includes(optionB.toLowerCase())) {
      return res.json({ comparison: presetOutput });
    }
  }

  if (process.env.GEMINI_API_KEY && ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Compare ${optionA} vs ${optionB}. Context: ${context || "General Enterprise Cloud Strategy"}.
Ensure you output:
1. The exact Markdown table with columns: Evaluation Dimension, Option A: [Name], Option B: [Name], Strategic Trade-Off / Business Impact. Include rows: Architectural Layer, Performance & Latency, Cost Model, Noisy Neighbor Risk, Best-Fit Enterprise Use Case.
2. Pillar Breakdown:
   - 1. Technical Mechanics
   - 2. Business & Unit Economics
   - 3. Operational Risk & Governance
3. Executive Recommendation: A 2-3 sentence strategic decision rule.`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.4,
        },
      });

      return res.json({ comparison: response.text });
    } catch (err) {
      console.error("Comparison generation error:", err);
    }
  }

  // Fallback comparison
  const fallback = `### Techno-Management Comparison: ${optionA} vs ${optionB}

| Evaluation Dimension | Option A: ${optionA} | Option B: ${optionB} | Strategic Trade-Off / Business Impact |
| :--- | :--- | :--- | :--- |
| **Architectural Layer** | Native / Low-level abstraction | Managed / Virtualized tier | Lower abstraction preserves control; higher abstraction offloads maintenance. |
| **Performance & Latency** | Direct execution path with minimal mediation | Intermediary scheduling and runtime layers | Predictable sub-millisecond execution vs dynamic autoscaling headroom. |
| **Cost Model** | Fixed CAPEX investment or persistent reservation | Variable OPEX based on consumed units | High utilization favors ${optionA}; irregular demand favors ${optionB}. |
| **Noisy Neighbor Risk** | Strict physical or partitioned isolation | Shared multi-tenant fabric subject to noisy neighbors | Requires QoS resource quotas and SLA tiering. |
| **Best-Fit Enterprise Use Case** | Legacy monolithic databases & compliance vaults | Agile microservices, modern APIs, and greenfield systems | Differentiator vs commodity workload alignment. |

**Pillar Analysis:**
- **1. Technical Mechanics:** ${optionA} provides granular architectural control, deterministic hardware execution, and low virtualization overhead, whereas ${optionB} emphasizes software abstraction, automated failover, and elasticity.
- **2. Business & Unit Economics:** ${optionA} demands higher capital planning and specialized administrative talent. ${optionB} converts infrastructure costs into agile OPEX, reducing time-to-market.
- **3. Operational Risk & Governance:** ${optionA} minimizes vendor lock-in but increases patching and compliance blast-radius burden. ${optionB} transfers lower-tier operational risk to the provider under the Shared Responsibility Model.

**Executive Recommendation:**
Choose ${optionA} if workload predictability, extreme performance deterministic SLAs, and regulatory hardware sovereignty dictate your enterprise policy. Choose ${optionB} if engineering velocity, zero infrastructure maintenance overhead, and rapid scaling are top management priorities.`;

  return res.json({ comparison: fallback });
});

// API: Capstone Simulator Evaluation
app.post("/api/capstone/evaluate", async (req: Request, res: Response) => {
  const { decisions, totalBudget, projectedSavings } = req.body;

  if (process.env.GEMINI_API_KEY && ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Evaluate this enterprise CIO cloud migration strategy presentation to the Board of Directors:
Workload Mapping (7 Rs): ${JSON.stringify(decisions)}
Budget: $${totalBudget}k
Projected FinOps Savings: ${projectedSavings}%

Format your response with:
1. **Board of Directors Verdict**: (Approved / Approved with Conditions / Rejected) with executive justification.
2. **Techno-Management Audit**:
   - Technical Architecture & Latency Assessment
   - FinOps & Unit Economics Realism (CAPEX vs OPEX, overcommit risks)
   - Operational Risk & Governance (Data sovereignty, skills gap, compliance)
3. **Follow-up Tough Question from the Audit Committee Chairman**: A challenging boardroom question test.`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      return res.json({ evaluation: response.text });
    } catch (e) {
      console.error("Capstone evaluation error:", e);
    }
  }

  // Curated Fallback Evaluation
  return res.json({
    evaluation: `### Board of Directors Executive Evaluation

**Board Verdict: APPROVED WITH CONDITIONS** ⚖️

**Executive Summary:**
The Board recognizes the pressing need to escape the 4x hypervisor license escalation while retiring technical debt. Your 7 Rs portfolio allocation demonstrates sound techno-management pragmatism by avoiding a reckless "rehost-everything" strategy.

**Techno-Management Audit:**
- **Technical Mechanics:** Moving stateless tiers to PaaS/containers eliminates OS maintenance cycles. However, keeping mission-critical relational databases on dedicated IaaS or hybrid bare-metal is the correct move to avoid unhedged IOPS throttling.
- **FinOps & Unit Economics:** The projected ${projectedSavings || 42}% annual TCO reduction is viable provided egress costs and cloud network transit gateways are capped via strict FinOps tagging and reserved commitments.
- **Operational Governance:** Beware the cloud skills gap. The transition from traditional sysadmin virtualization to cloud infrastructure-as-code (Terraform/OpenTofu) requires a 6-month upskilling buffer.

**Audit Committee Question:**
> *"CIO, if our data transfer egress fees exceed our original cloud budget by 35% in Q3 due to cross-region database replication, what is your automated throttling or FinOps circuit-breaker policy to prevent board-level budget overruns?"*`,
  });
});

// Production static serving and Vite development middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CloudExec Server running on port ${PORT}`);
  });
}

startServer();
