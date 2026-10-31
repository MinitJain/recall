"use client";

import { useEffect, useState, type ReactNode } from "react";

// Sits flat on the page at the top; once the visitor scrolls it stays pinned with a light frosted glass
export default function StickyHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header data-scrolled={scrolled || undefined} className="site-header sticky top-0 z-40">
      {children}
    </header>
  );
}
