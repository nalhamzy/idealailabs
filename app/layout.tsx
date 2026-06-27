import type { Metadata } from "next";
import type React from "react";
import { Inter, Space_Grotesk, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://idealailabs.com"),
  title: {
    default: "IdealAI Labs - Software, Websites, Stores, WhatsApp Automation",
    template: "%s | IdealAI Labs",
  },
  description:
    "IdealAI Labs builds websites, ecommerce stores, WhatsApp automation, appointment systems, custom software, and AI document tools for Oman and the Gulf.",
  keywords: [
    "AI Oman",
    "websites Oman",
    "online store Oman",
    "Thawani ecommerce integration",
    "WhatsApp chatbot Oman",
    "appointment system Oman",
    "business software Muscat",
    "document AI",
    "IdealAI Labs",
  ],
  openGraph: {
    title: "IdealAI Labs",
    description:
      "Software, websites, stores, WhatsApp automation, appointments, and AI systems built in Muscat.",
    url: "https://idealailabs.com",
    siteName: "IdealAI Labs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IdealAI Labs",
    description:
      "Software, websites, stores, WhatsApp automation, and AI systems built in Muscat.",
  },
  robots: { index: true, follow: true },
};

const themeScript = `
(function(){try{var s=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s||(m?'dark':'light');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${display.variable} ${arabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
