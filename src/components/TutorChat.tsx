import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, ModuleLesson, NavigationTab } from "../types";
import { LESSON_MODULES } from "../data/modulesData";
import { MarkdownRenderer } from "./MarkdownRenderer";
import {
  Send,
  Sparkles,
  Scale,
  BookOpen,
  ChevronRight,
  RefreshCw,
  Award,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

interface TutorChatProps {
  onNavigateTab: (tab: NavigationTab) => void;
  onRunComparison: (optionA: string, optionB: string) => void;
}

export const TutorChat: React.FC<TutorChatProps> = ({
  onNavigateTab,
  onRunComparison,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      role: "model",
      content: `### Welcome to CloudExec ☁️🏛️
*Techno-Management Cloud Strategy Tutor & Comparison Engine*

I am **CloudExec**, your executive advisor and technical tutor. My purpose is to teach you how core virtualization mechanisms directly dictate boardroom business outcomes, unit economics, and enterprise risk.

Every architectural decision is evaluated across our **Three Pillars**:
1. **Technical Mechanics**: Latency, hypervisor rings, CPU scheduling, I/O isolation, and hardware abstraction.
2. **Business & Unit Economics**: CAPEX vs. OPEX, overcommit yields, peak-to-average ratios (PAR), and TCO.
3. **Operational Risk & Governance**: Blast radius, compliance alignment (SOC2/HIPAA), SLAs, and skills gap.

---
### Getting Started:
- 💡 **Choose a Lesson Module** from the curriculum panel on the right.
- ⚖️ **Activate Comparison Engine Mode** by typing \`Compare [Option A] vs [Option B]\` (e.g., \`Compare Type 1 vs Type 2\`).
- 🎯 **Tackle Executive Dilemmas** at the end of each lesson to test your strategic decision-making.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: "gemini"
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleLesson>(LESSON_MODULES[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (promptToSend?: string) => {
    const text = (promptToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    // Check if user is invoking compare mode
    const compareMatch = text.match(/compare\s+(.+?)\s+vs\s+(.+)/i);
    if (compareMatch && compareMatch[1] && compareMatch[2]) {
      const optA = compareMatch[1].trim();
      const optB = compareMatch[2].trim();
      onRunComparison(optA, optB);
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!promptToSend) setInputPrompt("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          userPrompt: text,
        }),
      });

      const data = await response.json();
      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        content: data.response || "No response generated.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "model",
        content: `### CloudExec Offline Evaluation
I was unable to connect to the server. Here is the core Techno-Management evaluation:

**Key Takeaway:** When evaluating cloud decisions, always cross-reference the **Technical Isolation Layer** against the **Cost/Unit Economics** and **Shared Responsibility SLA**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: "fallback_engine"
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectModuleLesson = (mod: ModuleLesson) => {
    setSelectedModule(mod);
    const modPrompt = `Teach me ${mod.title} (${mod.subtitle}). Break down the concepts step-by-step using the Techno-Management framework and present an interactive management dilemma.`;
    handleSendMessage(modPrompt);
  };

  const quickChips = [
    { label: "Compare Type 1 vs Type 2", prompt: "Compare Type 1 vs Type 2 Hypervisors" },
    { label: "Compare Static vs Multiplexed", prompt: "Compare Static Allocation vs Statistical Multiplexing" },
    { label: "Compare IaaS vs PaaS vs SaaS", prompt: "Compare IaaS vs PaaS vs SaaS" },
    { label: "Compare Serverless vs Containers", prompt: "Compare Serverless vs Provisioned Containers" },
    { label: "FinOps: CPU Overcommit", prompt: "Explain CPU overcommit and memory ballooning using the Techno-Management FinOps framework." },
    { label: "Board Presentation Scenario", prompt: "Give me an executive management dilemma for presenting a cloud migration to the Board of Directors." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chat Interface (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col h-[calc(100vh-12rem)] bg-white border border-[#1A1A1A] shadow-[8px_8px_0px_rgba(20,20,20,0.05)] overflow-hidden">
          {/* Tutor Control Bar */}
          <div className="px-5 py-3.5 bg-[#1A1A1A] text-white border-b border-[#333] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-[#F27D26] rounded-xs flex items-center justify-center text-white shadow-xs font-bold text-xs">
                CE
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white leading-tight">
                  CloudExec Interactive Strategy Tutor
                </h2>
                <p className="text-[10px] text-[#999] uppercase tracking-widest">
                  Techno-Management Strategy • Powered by Gemini AI
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                id="tutor-compare-trigger-btn"
                onClick={() => onNavigateTab("comparison")}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 bg-[#2A2A2A] hover:bg-[#333] border border-[#444] text-[#F27D26] hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-xs"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Open Matrix Studio</span>
              </button>
              <button
                id="tutor-reset-btn"
                onClick={() => {
                  setMessages([messages[0]]);
                }}
                title="Reset conversation"
                className="p-1.5 text-[#999] hover:text-white rounded-xs hover:bg-[#333] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F9F9F9]">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] px-5 py-4 ${
                      isUser
                        ? "bg-[#1A1A1A] text-white border border-[#1A1A1A] shadow-[4px_4px_0px_#F27D26]"
                        : "bg-white text-[#1A1A1A] border border-[#D1D1D1] shadow-[4px_4px_0px_rgba(20,20,20,0.05)]"
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#EBEBEB] text-[10px] font-bold uppercase tracking-widest text-[#666]">
                        <span className="flex items-center gap-1.5 text-[#0066FF]">
                          <Sparkles className="w-3 h-3 text-[#F27D26]" /> CloudExec Strategy Advisor
                        </span>
                        <span className="text-[#999] font-mono">{msg.timestamp}</span>
                      </div>
                    )}

                    {isUser ? (
                      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                        {msg.content}
                      </div>
                    ) : (
                      <MarkdownRenderer content={msg.content} />
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-white text-[#1A1A1A] border border-[#D1D1D1] px-4 py-3 shadow-[4px_4px_0px_rgba(20,20,20,0.05)] flex items-center space-x-3">
                  <div className="flex space-x-1.5">
                    <span className="w-2 h-2 rounded-none bg-[#F27D26] animate-bounce"></span>
                    <span className="w-2 h-2 rounded-none bg-[#F27D26] animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-none bg-[#F27D26] animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-xs text-[#666] font-mono uppercase tracking-wider">
                    CloudExec evaluating Techno-Management Pillars...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-4 py-2 bg-white border-t border-[#EBEBEB] overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                id={`quick-chip-${idx}`}
                onClick={() => handleSendMessage(chip.prompt)}
                disabled={isLoading}
                className="inline-flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-[#333] hover:text-white bg-[#F2F2F2] hover:bg-[#1A1A1A] px-2.5 py-1 transition-colors cursor-pointer border border-[#D1D1D1] rounded-xs disabled:opacity-50"
              >
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3.5 bg-white border-t border-[#1A1A1A]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2.5"
            >
              <input
                id="tutor-chat-input"
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask a cloud strategy question or enter 'Compare [Option A] vs [Option B]'..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-[#F9F9F9] border border-[#D1D1D1] focus:border-[#1A1A1A] focus:bg-white text-[#1A1A1A] placeholder:text-[#999] outline-hidden rounded-xs"
              />
              <button
                id="tutor-send-btn"
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                className="inline-flex items-center justify-center px-4 py-2.5 bg-[#F27D26] hover:bg-[#E06D1B] text-white font-bold uppercase text-xs tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer border border-[#F27D26] rounded-xs shadow-xs"
              >
                <Send className="w-4 h-4 mr-1 hidden sm:inline" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Curriculum & Interactive Dilemma Panel (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Active Module Card */}
          <div className="bg-white border border-[#1A1A1A] shadow-[6px_6px_0px_rgba(20,20,20,0.06)] p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-[#1A1A1A] text-white">
                Active Module {selectedModule.id} of 5
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#999]">
                Curriculum
              </span>
            </div>
            <h3 className="text-base font-serif italic text-[#141414] leading-snug mt-1">
              {selectedModule.title}
            </h3>
            <p className="text-xs text-[#666] mt-1 leading-relaxed">
              {selectedModule.subtitle}
            </p>

            {/* Concepts list */}
            <div className="mt-4 pt-3 border-t border-[#EBEBEB] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#333] block">
                Pillars & Key Mechanisms:
              </span>
              <ul className="text-xs text-[#444] space-y-1.5">
                {selectedModule.concepts.slice(0, 3).map((concept, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-[#F27D26] mt-1.5 shrink-0"></span>
                    <span className="line-clamp-2 leading-relaxed">{concept}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Compare button for this module */}
            <div className="mt-4 pt-3 border-t border-[#EBEBEB]">
              <button
                id="module-quick-compare-btn"
                onClick={() =>
                  onRunComparison(
                    selectedModule.presetComparison.optionA,
                    selectedModule.presetComparison.optionB
                  )
                }
                className="w-full inline-flex items-center justify-center space-x-2 py-2 px-3 bg-[#1A1A1A] hover:bg-[#333] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-xs"
              >
                <Scale className="w-3.5 h-3.5 text-[#F27D26]" />
                <span>
                  Compare: {selectedModule.presetComparison.optionA.split(" ")[0]} vs{" "}
                  {selectedModule.presetComparison.optionB.split(" ")[0]}
                </span>
              </button>
            </div>
          </div>

          {/* Interactive Executive Dilemma Card */}
          <div className="bg-[#FFF9F3] border border-[#F27D26] p-5 shadow-[4px_4px_0px_rgba(242,125,38,0.15)]">
            <div className="flex items-center space-x-2 text-[#F27D26] mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Executive Trade-Off Dilemma
              </span>
            </div>
            <p className="text-xs text-[#1A1A1A] leading-relaxed mb-4 font-medium">
              {selectedModule.executiveDilemma.scenario}
            </p>

            <div className="space-y-2.5">
              {selectedModule.executiveDilemma.options.map((opt) => (
                <button
                  key={opt.id}
                  id={`dilemma-opt-${opt.id}`}
                  onClick={() => handleSendMessage(opt.prompt)}
                  disabled={isLoading}
                  className="w-full text-left p-3 bg-white border border-[#D1D1D1] hover:border-[#1A1A1A] text-xs text-[#1A1A1A] transition-all cursor-pointer group shadow-xs"
                >
                  <div className="font-bold text-[#141414] flex items-center justify-between">
                    <span>{opt.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#999] group-hover:text-[#F27D26] transition-colors" />
                  </div>
                  <p className="text-[11px] text-[#666] mt-1 line-clamp-2 leading-normal">
                    {opt.impact}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Module Selector List */}
          <div className="bg-white border border-[#D1D1D1] shadow-[6px_6px_0px_rgba(20,20,20,0.06)] p-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#666] mb-3">
              Select Curriculum Module
            </h4>
            <div className="space-y-1.5">
              {LESSON_MODULES.map((mod) => {
                const isSelected = selectedModule.id === mod.id;
                return (
                  <button
                    key={mod.id}
                    id={`curriculum-mod-${mod.id}`}
                    onClick={() => handleSelectModuleLesson(mod)}
                    className={`w-full text-left p-2.5 text-xs transition-all cursor-pointer flex items-center justify-between border ${
                      isSelected
                        ? "bg-[#1A1A1A] text-white font-bold border-[#1A1A1A]"
                        : "bg-white text-[#333] hover:bg-[#F9F9F9] border-[#EBEBEB]"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <span
                        className={`w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold ${
                          isSelected
                            ? "bg-[#F27D26] text-white"
                            : "bg-[#EBEBEB] text-[#333]"
                        }`}
                      >
                        {mod.id}
                      </span>
                      <span className="truncate">{mod.title.split("(")[0]}</span>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected ? "text-[#F27D26]" : "text-[#999]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick links to Labs */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="goto-finops-lab-btn"
              onClick={() => onNavigateTab("finops-lab")}
              className="p-3 bg-white border border-[#D1D1D1] hover:border-[#1A1A1A] text-left transition-colors cursor-pointer group shadow-[3px_3px_0px_rgba(20,20,20,0.04)]"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] group-hover:text-[#F27D26]">
                FinOps Lab →
              </div>
              <p className="text-[10px] text-[#666] mt-0.5">
                Overcommit yield simulator
              </p>
            </button>
            <button
              id="goto-capstone-btn"
              onClick={() => onNavigateTab("capstone")}
              className="p-3 bg-white border border-[#D1D1D1] hover:border-[#1A1A1A] text-left transition-colors cursor-pointer group shadow-[3px_3px_0px_rgba(20,20,20,0.04)]"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] group-hover:text-[#F27D26]">
                Boardroom →
              </div>
              <p className="text-[10px] text-[#666] mt-0.5">
                Present 7 Rs to Directors
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
