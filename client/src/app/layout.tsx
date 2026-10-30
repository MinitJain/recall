import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

// Self-hosted (latin, variable) instead of next/font/google: fetching from Google at
// build time made Turbopack builds fail intermittently. Licences: ./fonts/*-OFL.txt
const geist = localFont({
  src: "./fonts/geist.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const syne = localFont({
  src: "./fonts/syne.woff2",
  variable: "--font-display",
  weight: "400 800",
});

const dmSans = localFont({
  src: "./fonts/dmsans.woff2",
  variable: "--font-sans",
  weight: "100 1000",
});

export const metadata: Metadata = {
  title: "Ritro | Save anything. Find everything. Nothing gets lost.",
  description:
    "The smart bookmarking app that saves anything from the internet, tags it automatically with AI, and resurfaces it back to you when you need it.",
  icons: {
    icon: "/favicon.svg",
  },
};

// Runs before React hydrates — prevents flash of wrong theme on load
const themeScript = `(function(){try{var t=localStorage.getItem('ritro-theme'),d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(t==='dark'||(!t&&d))document.documentElement.classList.add('dark')}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geist.variable} ${syne.variable} ${dmSans.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
