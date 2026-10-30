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

const serif = localFont({
  src: [
    { path: "./fonts/sourceserif4.woff2", style: "normal" },
    { path: "./fonts/sourceserif4-italic.woff2", style: "italic" },
  ],
  variable: "--font-serif",
  weight: "200 900",
});

const mono = localFont({
  src: "./fonts/geistmono.woff2",
  variable: "--font-mono",
  weight: "100 900",
  // Only used for small data labels, so don't compete with the body font for bandwidth
  preload: false,
});

export const metadata: Metadata = {
  title: "Ritro | Save anything. Find everything.",
  description:
    "Ritro saves anything with a link, tags it for you, and brings it back when you've forgotten it. A personal archive that returns things.",
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
        className={`${geist.variable} ${serif.variable} ${mono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
