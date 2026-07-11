import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `تو «Easy AI» هستی؛ دستیار هوشمند نرم‌افزار مدیریت پروژه‌های آسانسور «Easy Lift ERP».
نقش تو: کمک به مدیران، فنی، بازرگانی، حسابداری و انباردار با پاسخ کوتاه، دقیق و عمل‌گرا.

قوانین:
- همیشه به فارسی پاسخ بده و از لحن حرفه‌ای و دوستانه استفاده کن.
- پاسخ‌ها را کوتاه و ساختاریافته نگه‌دار (بولت، شماره).
- اگر کاربر درباره پروژه/آسانسور خاصی می‌پرسد و اطلاعاتی نداری، فرض کن درباره «پروژه پارسیان» و «آسانسور A3» است.
- در حوزه‌های داشبورد، مخاطبین، پیش‌فاکتور، قرارداد، فنی، بازرگانی، حسابداری، انبار و تنظیمات راهنمایی کن.
- اعداد را به فارسی بنویس.
- هرگز تغییری را بدون تأیید کاربر ثبت نکن؛ فقط پیشنهاد بده.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as {
      messages?: { role: string; content: string }[];
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages is required" },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: (m.role === "assistant" ? "assistant" : "user") as
            | "user"
            | "assistant",
          content: m.content,
        })),
      ],
      temperature: 0.6,
      max_tokens: 800,
    });

    const reply =
      completion.choices?.[0]?.message?.content ??
      "متأسفم، پاسخی دریافت نشد. لطفاً دوباره تلاش کنید.";

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("[/api/ai] error:", err);
    return NextResponse.json(
      { error: err?.message ?? "AI request failed" },
      { status: 500 }
    );
  }
}
