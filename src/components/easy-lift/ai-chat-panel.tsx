"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, ChevronLeft, Loader2 } from "lucide-react";
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

const INITIAL_INSIGHTS: Msg[] = [
  {
    role: "assistant",
    content:
      "سلام! من Easy AI هستم 👋\nسه درخواست خرید نیاز به تأیید دارند. قیمت موتور گیرلس ۷٪ کاهش یافته است.\n\nسؤالی درباره پروژه‌ها، انبار، بازرگانی یا حسابداری داری؟",
  },
];

export function AiChatPanel() {
  const { aiCollapsed, toggleAI } = useNav();
  const [messages, setMessages] = useState<Msg[]>(INITIAL_INSIGHTS);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

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
      const reply: string =
        data?.reply ??
        "خطایی رخ داد. لطفاً مجدداً تلاش کنید.";
      setMessages((cur) => [...cur, { role: "assistant", content: reply }]);
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

  // Collapsed → icon-only bar
  if (aiCollapsed) {
    return (
      <div className="flex h-full w-14 flex-col items-center border-r border-slate-200 bg-white">
        <button
          onClick={toggleAI}
          className="mt-4 grid size-10 place-items-center rounded-2xl text-purple-600 transition hover:bg-slate-100"
          aria-label="باز کردن پنل هوش مصنوعی"
        >
          <Bot className="size-6" />
        </button>
        <div className="mt-2 text-[10px] font-semibold text-slate-400">AI</div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col border-r border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h3 className="flex items-center gap-2 font-bold">
          <Sparkles className="size-5 text-purple-500" />
          Easy AI
        </h3>
        <button
          onClick={toggleAI}
          className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="جمع کردن پنل"
        >
          <ChevronLeft className="size-5" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto px-3 py-4"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2",
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            {m.role === "assistant" ? (
              <div className="mt-1 grid size-7 shrink-0 place-items-center rounded-lg bg-purple-100 text-purple-600">
                <Bot className="size-4" />
              </div>
            ) : null}
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              )}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading ? (
          <div className="flex items-center gap-2 px-2 text-sm text-slate-400">
            <Loader2 className="size-4 animate-spin" />
            در حال تفکر...
          </div>
        ) : null}
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 ? (
        <div className="flex flex-wrap gap-1.5 px-3 pb-2">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              {q}
            </button>
          ))}
        </div>
      ) : null}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-slate-200 p-3"
      >
        <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-200">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="سؤال خود را بنویسید..."
            className="flex-1 bg-transparent py-1.5 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="grid size-9 place-items-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-40"
            aria-label="ارسال"
          >
            <Send className="size-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
