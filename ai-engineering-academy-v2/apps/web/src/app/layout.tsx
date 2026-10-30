import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

export const metadata: Metadata = {
  title: "AI Engineering Academy 2.0 | Інтерактивна Open-Source Платформа",
  description: "Професійна підготовка AI Engineers: реальні експерименти, навчання моделей, RAG, Fine-tuning та AI-агенти без обов'язкових платних API.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className="min-h-screen flex flex-col bg-[#EDF5FE] text-[#0D2238]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
