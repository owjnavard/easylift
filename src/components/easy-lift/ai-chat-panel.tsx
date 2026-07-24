"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  X,
  Loader2,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNav } from "@/lib/nav-store";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "وضعیت پروژه پارسیان چطور است؟",
  "کدام کالاها به نقطه سفارش رسیده‌اند؟",
  "هزینه آسانسور A3 را محاسبه کن",
  "بهترین تأمین‌کننده ریل T90 کیست؟",
];

const WELCOME: Msg = {
  role: "assistant",
  content:
    "سلام! من Easy AI هستم 👋\n۳ درخواست خرید نیاز به تأیید دارند و قیمت موتور گیرلس ۷٪ کاهش یافته است.\n\nسؤالی درباره پروژه‌ها، انبار، بازرگانی یا حسابداری دارید؟",
};

function ChatBody({
  messages,
  loading,
  send,
  input,
  setInput,
  compact = false,
}: {
  messages: Msg[];
  loading: boolean;
  send: (t: string) => void;
  input: string;
  setInput: (v: string) => void;
  compact?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <>
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2",
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            {m.role === "assistant" ? (
              <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-emerald-500/15 text-emerald-500">
                <Bot className="size-4" />
              </div>
            ) : null}
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                m.role === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-700"
              )}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading ? (
          <div className="flex items-center gap-2 px-2 text-xs text-slate-400">
            <Loader2 className="size-3.5 animate-spin" />
            در حال تفکر...
          </div>
        ) : null}
      </div>

      {messages.length <= 1 ? (
        <div className="flex flex-wrap gap-1.5 px-3 pb-2">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            >
              {q}
            </button>
          ))}
        </div>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-slate-100 p-3"
      >
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="سؤال خود را بنویسید..."
            className="flex-1 bg-transparent py-1.5 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:opacity-40"
            aria-label="ارسال"
          >
            <Send className="size-4" />
          </button>
        </div>
      </form>
    </>
  );
}

export function AiChatPanel() {
  const { aiCollapsed, toggleAI, mobileAiOpen, setMobileAiOpen } = useNav();
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((cur) => [
        ...cur,
        {
          role: "assistant",
          content:
            data?.reply ?? "خطایی رخ داد. لطفاً مجدداً تلاش کنید.",
        },
      ]);
    } catch {
      setMessages((cur) => [
        ...cur,
        {
          role: "assistant",
          content: "ارتباط با سرور برقرار نشد. کمی بعد تلاش کنید.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Desktop: collapsed icon rail
  if (aiCollapsed) {
    return (
      <div className="flex h-full w-14 flex-col items-center border-s border-slate-200 bg-white py-3">
        <button
          onClick={toggleAI}
          className="grid size-10 place-items-center rounded-xl text-emerald-600 transition hover:bg-emerald-50"
          aria-label="باز کردن پنل هوش مصنوعی"
        >
          <Bot className="size-6" />
        </button>
        <span className="mt-1 text-[10px] font-semibold text-slate-400">
          AI
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Desktop panel (xl+) */}
      <aside className="hidden h-full w-[330px] shrink-0 flex-col border-s border-slate-200 bg-white xl:flex">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <span className="grid size-7 place-items-center rounded-lg bg-emerald-500/15 text-emerald-600">
              <Sparkles className="size-4" />
            </span>
            Easy AI
          </h3>
          <button
            onClick={toggleAI}
            className="grid size-7 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="جمع کردن پنل"
          >
            <Maximize2 className="size-4" />
          </button>
        </div>
        <ChatBody
          messages={messages}
          loading={loading}
          send={send}
          input={input}
          setInput={setInput}
        />
      </aside>

      {/* Mobile sheet (below xl) */}
      {mobileAiOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileAiOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <span className="grid size-7 place-items-center rounded-lg bg-emerald-500/15 text-emerald-600">
                  <Sparkles className="size-4" />
                </span>
                Easy AI
              </h3>
              <button
                onClick={() => setMobileAiOpen(false)}
                className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100"
                aria-label="بستن"
              >
                <X className="size-5" />
              </button>
            </div>
            <ChatBody
              messages={messages}
              loading={loading}
              send={send}
              input={input}
              setInput={setInput}
              compact
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
