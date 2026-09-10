import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-slate max-w-none text-[#1A1A1A] text-sm leading-relaxed space-y-3">
      <ReactMarkdown
        components={{
          table: ({ children }) => (
            <div className="my-5 overflow-x-auto border border-[#1A1A1A] bg-white shadow-[6px_6px_0px_rgba(20,20,20,0.06)]">
              <table className="w-full text-left text-xs border-collapse divide-y divide-[#D1D1D1]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#1A1A1A] text-white font-bold uppercase tracking-wider text-[11px]">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3.5 font-bold border-r border-[#333] last:border-r-0 tracking-wide text-white">
              {children}
            </th>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-[#D1D1D1] bg-white text-[#1A1A1A]">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-[#F9F9F9] transition-colors">
              {children}
            </tr>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 align-top text-[#1A1A1A] leading-normal border-r border-[#D1D1D1] last:border-r-0 first:font-bold first:bg-[#F9F9F9]/60">
              {children}
            </td>
          ),
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-serif italic text-[#141414] tracking-tight mt-5 mb-3 pb-2 border-b border-[#D1D1D1]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-serif italic text-[#141414] tracking-tight mt-4 mb-2 pb-1 border-b border-[#EBEBEB]">
              {children}
            </h2>
          ),
          h3: ({ children }) => {
            const headingStr = String(children);
            const isExecutive = headingStr.toLowerCase().includes("executive recommendation");
            return (
              <h3 className={`text-base font-bold mt-4 mb-2 flex items-center gap-2 ${
                isExecutive ? "text-[#0066FF] uppercase tracking-wider text-xs" : "text-[#1A1A1A]"
              }`}>
                <span className={`inline-block w-2 h-3.5 ${isExecutive ? "bg-[#0066FF]" : "bg-[#F27D26]"}`}></span>
                {children}
              </h3>
            );
          },
          h4: ({ children }) => (
            <h4 className="text-xs font-bold text-[#666] uppercase tracking-wider mt-3 mb-1">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-2.5 text-[#2A2A2A] last:mb-0 leading-relaxed text-[13px] sm:text-sm">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-square pl-5 mb-3 space-y-1.5 text-[#2A2A2A] text-xs sm:text-sm">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-3 space-y-1.5 text-[#2A2A2A] text-xs sm:text-sm">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-[#2A2A2A] pl-0.5">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 pl-4 py-3 border-l-4 border-[#0066FF] bg-[#E6F3FF] text-[#1A1A1A] font-medium text-xs sm:text-sm leading-relaxed">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0066FF] block mb-1">
                Strategic Synthesis
              </span>
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-[#EBEBEB] text-[#1A1A1A] font-mono text-xs px-1.5 py-0.5 border border-[#D1D1D1] rounded-none">
                {children}
              </code>
            ) : (
              <div className="my-3 border border-[#1A1A1A] bg-[#1A1A1A] p-3.5 text-xs text-[#F2F2F2] font-mono overflow-x-auto shadow-[4px_4px_0px_rgba(20,20,20,0.1)]">
                <code>{children}</code>
              </div>
            );
          },
          strong: ({ children }) => {
            const str = String(children);
            if (str.includes("Executive Recommendation")) {
              return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#E6F3FF] text-[#0066FF] font-bold text-xs uppercase tracking-wider border-l-2 border-[#0066FF] mr-1.5">
                  ⭐ {children}
                </span>
              );
            }
            if (str.includes("Option A") || str.includes("Option B")) {
              return (
                <span className="inline-block px-1.5 py-0.5 bg-[#1A1A1A] text-white text-[11px] font-bold uppercase font-mono mr-1">
                  {children}
                </span>
              );
            }
            return <strong className="font-bold text-[#141414]">{children}</strong>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

