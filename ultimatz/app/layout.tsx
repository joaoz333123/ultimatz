import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tardivo Zanetti Engenharia - Engenharia Inteligente Personalizada",
  description: "Consultoria especializada em engenharia mecânica de alta performance para ativos complexos. Ferramentas digitais customizadas para HVAC, retrofit, perícia técnica e gestão de CAPEX.",
  keywords: "engenharia, HVAC, retrofit, perícia técnica, gestão CAPEX, ferramentas digitais",
  authors: [{ name: "João Paulo Tardivo Zanetti" }],
  openGraph: {
    title: "Tardivo Zanetti Engenharia",
    description: "Engenharia Inteligente Personalizada",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${poppins.variable} ${inter.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
