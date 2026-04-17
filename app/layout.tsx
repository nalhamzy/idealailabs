import type { Metadata } from "next";
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
    default: "Ideal Intelligence — AI, NLP & WhatsApp Automation Studio",
    template: "%s | Ideal Intelligence",
  },
  description:
    "An AI studio in Muscat, Oman — building production AI apps, advanced NLP systems, WhatsApp chatbots, and agentic automation for the Gulf and beyond.",
  keywords: [
    "AI Oman",
    "WhatsApp chatbot",
    "NLP Arabic",
    "AI consultancy Muscat",
    "conversational AI",
    "agentic AI",
    "Ideal Intelligence",
  ],
  openGraph: {
    title: "Ideal Intelligence",
    description:
      "AI apps, NLP, WhatsApp automation, and agentic systems — built in Muscat, shipped globally.",
    url: "https://idealailabs.com",
    siteName: "Ideal Intelligence",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ideal Intelligence",
    description:
      "AI apps, NLP, WhatsApp automation, and agentic systems — built in Muscat.",
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
