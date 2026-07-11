import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Easy Lift — SaaS ERP آسانسور",
  description:
    "نرم‌افزار مدیریت یکپارچه فرآیند فروش، طراحی، اجرا، انبار، خرید و حسابداری پروژه‌های آسانسور.",
  keywords: ["Easy Lift", "آسانسور", "ERP", "SaaS", "مدیریت پروژه"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${vazirmatn.variable} font-sans antialiased bg-[#F4F7FE] text-slate-800`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
