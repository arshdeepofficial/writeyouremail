"use client";

import React, { useMemo, useState } from "react";
import {
  Copy,
  Check,
  Mail,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  BarChart3,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";

interface OutputPanelProps {
  content?: any;
  result?: any;
  loading?: boolean;
  isGenerating?: boolean;
  genError?: string | null;
  error?: string | null;
}

function normalizeContent(content: any) {
  if (!content) return null;

  // Rich object from API
  if (typeof content === "object" && (content.body || content.subject)) {
    return {
      subject: content.subject || "",
      subjectVariations: Array.isArray(content.subjectVariations) ? content.subjectVariations : [],
      body: content.body || "",
      spamScore: typeof content.spamScore === "number" ? content.spamScore : null,
      spamTriggers: Array.isArray(content.spamTriggers) ? content.spamTriggers : [],
      sanitizedBody: content.sanitizedBody || "",
      deliverabilityAdvice: content.deliverabilityAdvice || "",
      plainText: content.plainText || content.body || "",
    };
  }

  // Legacy string or plaintext
  if (typeof content === "string") {
    const subjectMatch = content.match(/^Subject:\s*(.*)$/im);
    const subject = subjectMatch ? subjectMatch[1].trim() : "";
    const body = content.replace(/^Subject:.*\n+/im, "").trim();
    return {
      subject,
      subjectVariations: subject ? [subject] : [],
      body: body || content,
      spamScore: null,
      spamTriggers: [],
      sanitizedBody: "",
      deliverabilityAdvice: "",
      plainText: body || content,
    };
  }

  return null;
}

export default function OutputPanel({
  content,
  result,
  loading = false,
  isGenerating = false,
  genError = null,
  error = null,
}: OutputPanelProps) {
  const [copied, setCopied] = useState<"all" | "sanitized" | "plain" | null>(null);
  const [showAB, setShowAB] = useState(true);
  const [showSanitized, setShowSanitized] = useState(false);

  // Fallback prop aliasing for compatibility with page.tsx
  const activeContent = result !== undefined ? result : content;
  const isLoading = Boolean(isGenerating || loading);
  const activeError = error || genError;

  const data = useMemo(() => normalizeContent(activeContent), [activeContent]);
  const score = data?.spamScore;

  const copyText = async (text: string, key: "all" | "sanitized" | "plain") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Silent copy fallback
    }
  };

  const openInGmail = () => {
    if (!data) return;
    const url = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
      data.subject || ""
    )}&body=${encodeURIComponent(data.body || "")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openInOutlook = () => {
    if (!data) return;
    const url = `https://outlook.office.com/mail/deeplink/compose?subject=${encodeURIComponent(
      data.subject || ""
    )}&body=${encodeURIComponent(data.body || "")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-[#0a0a0a] flex items-center justify-center border-l border-[#1c1c1e]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0a84ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#86868b] font-medium">
            Crafting high-deliverability copy…
          </p>
        </div>
      </div>
    );
  }

  if (activeError) {
    return (
      <div className="flex-1 bg-[#0a0a0a] flex items-center justify-center border-l border-[#1c1c1e] p-6">
        <div className="max-w-md w-full p-5 rounded-2xl border border-[#ff453a40] bg-[#ff453a10]">
          <div className="flex items-center gap-2 text-[#ff453a] font-semibold mb-2">
            <ShieldAlert size={18} />
            Generation failed
          </div>
          <p className="text-[#d1d1d6] text-sm leading-relaxed">{activeError}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 bg-[#0a0a0a] flex items-center justify-center border-l border-[#1c1c1e] text-[#424245]">
        <div className="text-center">
          <Mail size={48} className="mx-auto mb-4 opacity-20" />
          <p>Your AI-generated outreach will appear here.</p>
        </div>
      </div>
    );
  }

  const fullCopy = data.subject
    ? `Subject: ${data.subject}\n\n${data.body}`
    : data.body;

  const scoreColor =
    score == null
      ? "border-[#424245] text-[#86868b]"
      : score > 80
      ? "border-[#30d158] text-[#30d158]"
      : score > 50
      ? "border-[#ffd60a] text-[#ffd60a]"
      : "border-[#ff453a] text-[#ff453a]";

  return (
    <div className="flex-1 bg-[#0a0a0a] overflow-y-auto border-l border-[#1c1c1e] p-6 lg:p-10 custom-scrollbar">
      {/* Deliverability Scorecard */}
      <div className="mb-8 p-5 bg-[#141415] rounded-2xl border border-[#2c2c2e] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-xl ${scoreColor}`}
          >
            {score == null ? "—" : score}
          </div>
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2">
              Deliverability Score
              {score != null && score > 80 ? (
                <ShieldCheck size={16} className="text-[#30d158]" />
              ) : score != null ? (
                <ShieldAlert size={16} className="text-[#ff453a]" />
              ) : null}
            </h3>
            <p className="text-[#86868b] text-sm">
              {data.deliverabilityAdvice || "Optimized for inbox placement."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openInGmail}
            className="flex items-center gap-2 px-4 py-2 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white rounded-full text-sm font-medium transition-all"
          >
            <ExternalLink size={14} /> Gmail
          </button>
          <button
            type="button"
            onClick={openInOutlook}
            className="flex items-center gap-2 px-4 py-2 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white rounded-full text-sm font-medium transition-all"
          >
            <ExternalLink size={14} /> Outlook
          </button>
          <button
            type="button"
            onClick={() => copyText(fullCopy, "all")}
            className="flex items-center gap-2 px-4 py-2 bg-[#0a84ff] hover:bg-[#007aff] text-white rounded-full text-sm font-medium transition-all"
          >
            {copied === "all" ? <Check size={14} /> : <Copy size={14} />}
            {copied === "all" ? "Copied" : "Copy All"}
          </button>
        </div>
      </div>

      {/* Spam Triggers */}
      {data.spamTriggers?.length > 0 && (
        <div className="mb-8 p-4 bg-[#ff453a10] border border-[#ff453a30] rounded-xl">
          <h4 className="text-[#ff453a] text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <ShieldAlert size={14} /> Spam triggers detected
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.spamTriggers.map((word: string, i: number) => (
              <span
                key={`${word}-${i}`}
                className="px-2 py-1 bg-[#ff453a20] text-[#ff453a] text-xs rounded border border-[#ff453a30]"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* A/B Subject Line Variations */}
      {data.subjectVariations?.length > 0 && (
        <div className="mb-8 border border-[#1c1c1e] rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAB((v) => !v)}
            className="w-full flex items-center justify-between p-4 bg-[#141415] text-white text-sm font-semibold"
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-[#bf5af2]" />
              Subject line A/B variations ({data.subjectVariations.length})
            </div>
            {showAB ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showAB && (
            <div className="p-4 bg-[#0a0a0a] space-y-3">
              {data.subjectVariations.map((sub: string, i: number) => (
                <div
                  key={`${sub}-${i}`}
                  className="flex items-center justify-between gap-3 p-3 bg-[#141415] rounded-lg border border-[#1c1c1e] group"
                >
                  <span className="text-white text-sm">{sub}</span>
                  <button
                    type="button"
                    onClick={() => copyText(sub, "all")}
                    className="shrink-0 text-[#0a84ff] text-xs opacity-70 group-hover:opacity-100 transition-opacity"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Primary Output Content */}
      <div className="space-y-6">
        {data.subject ? (
          <div>
            <label className="text-[#86868b] text-xs font-bold uppercase tracking-widest mb-2 block">
              Primary subject
            </label>
            <div className="text-xl font-semibold text-white tracking-tight">
              {data.subject}
            </div>
          </div>
        ) : null}

        <div>
          <label className="text-[#86868b] text-xs font-bold uppercase tracking-widest mb-2 block">
            Message body
          </label>
          <div className="text-[#d1d1d6] leading-relaxed whitespace-pre-wrap text-[17px] font-normal">
            {data.body}
          </div>
        </div>

        {/* Plain Text Button */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={() => copyText(data.plainText || data.body, "plain")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-[#1c1c1e] text-[#d1d1d6] hover:bg-[#2c2c2e] transition-all"
          >
            <FileText size={12} />
            {copied === "plain" ? "Plain copied" : "Copy plain text"}
          </button>
        </div>

        {/* Sanitized Version (Spam-Free) */}
        {data.sanitizedBody ? (
          <div className="mt-6 pt-6 border-t border-[#1c1c1e]">
            <button
              type="button"
              onClick={() => setShowSanitized((v) => !v)}
              className="w-full flex items-center justify-between text-left"
            >
              <label className="text-[#30d158] text-xs font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer">
                <ShieldCheck size={14} /> Sanitized version (spam-light)
              </label>
              {showSanitized ? (
                <ChevronUp size={16} className="text-[#86868b]" />
              ) : (
                <ChevronDown size={16} className="text-[#86868b]" />
              )}
            </button>
            {showSanitized && (
              <div className="mt-3">
                <div className="text-[#86868b] leading-relaxed whitespace-pre-wrap text-[15px]">
                  {data.sanitizedBody}
                </div>
                <button
                  type="button"
                  onClick={() => copyText(data.sanitizedBody, "sanitized")}
                  className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-[#1c1c1e] text-[#30d158] hover:bg-[#2c2c2e] transition-all"
                >
                  {copied === "sanitized" ? <Check size={12} /> : <Copy size={12} />}
                  {copied === "sanitized" ? "Copied" : "Copy sanitized"}
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}