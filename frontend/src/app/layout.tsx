import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "AI Engineering Academy — Відкрита платформа практичного навчання AI/ML",
  description: "Практична підготовка AI Engineer, ML Engineer, Deep Learning/LLM Engineer, MLOps Engineer на відкритих технологіях без платних API.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-cloud text-navy dark:bg-dark-bg dark:text-dark-text antialiased selection:bg-tangerine selection:text-white">
        <Header />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
