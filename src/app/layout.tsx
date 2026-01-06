import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Noise from "@/components/Noise";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edward Magejo | Technical Consultant & Systems Specialist",
  description: "Portfolio of Edward Magejo, a Technical Consultant and Systems Support Specialist based in Harare, Zimbabwe. Expert in Network Security and Infrastructure.",
  keywords: ["Edward Magejo", "Technical Consultant", "Systems Support", "Network Security", "IT Infrastructure", "Harare", "Zimbabwe"],
  openGraph: {
    title: "Edward Magejo | Portfolio",
    description: "Technical Consultant & Systems Support Specialist based in Harare.",
    url: "https://edwardmagejo.com", // Placeholder
    siteName: "Edward Magejo Portfolio",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} antialiased relative`}
      >
        <Noise />
        {children}
      </body>
    </html>
  );
}
