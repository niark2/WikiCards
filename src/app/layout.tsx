import type { Metadata } from "next";
import { Outfit, Cinzel } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WikiCards",
  description: "Collect Wikipedia knowledge as trading cards.",
};

import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/hooks/useToast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${cinzel.variable} antialiased font-sans bg-slate-950 text-slate-50 min-h-screen flex flex-col pt-16`}
      >
        <ToastProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}

