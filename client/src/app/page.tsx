import AnimateOnScroll from "@/components/AnimateOnScroll";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
if (user) redirect("/app");
  return (
    <div
      className="landing-page"
      style={{ background: "var(--lp-bg-primary)", color: "var(--lp-text-primary)", fontFamily: "var(--font-sans, system-ui)" }}
    >
      <AnimateOnScroll />

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,10,8,0.8)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--lp-border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: "60px",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <img src="/logo.svg" alt="" width={22} height={22} style={{ display: "block", flexShrink: 0 }} />
          <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "var(--lp-text-primary)" }}>
            Recall
          </span>
        </Link>
        <div className="nav-buttons" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/auth" className="nav-signin">
            Sign in
          </Link>
          <Link href="/auth" className="nav-cta">
            Get started free
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "80px 24px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        {/* Background blobs */}
        <div style={{
          position: "absolute", top: "-100px", left: "-100px",
          width: 600, height: 600, borderRadius: "50%",
          background: "rgba(240,165,0,0.08)", filter: "blur(120px)",
          pointerEvents: "none", willChange: "transform",
          animation: "blobDrift 50s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "-80px", right: "-120px",
          width: 500, height: 500, borderRadius: "50%",
          background: "rgba(139,92,246,0.06)", filter: "blur(120px)",
          pointerEvents: "none", willChange: "transform",
          animation: "blobDrift 65s ease-in-out infinite reverse",
        }} />
        <div style={{
          position: "absolute", bottom: "-100px", left: "50%", transform: "translateX(-50%)",
          width: 400, height: 400, borderRadius: "50%",
          background: "rgba(20,184,166,0.05)", filter: "blur(120px)",
          pointerEvents: "none", willChange: "transform",
          animation: "blobDrift 45s ease-in-out infinite 10s",
        }} />

        <div style={{ maxWidth: 800, width: "100%", position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            animation: "fadeUp 0.5s ease both 0ms",
            display: "inline-flex", alignItems: "center", gap: 6,
            marginBottom: 32,
          }}>
            <span style={{
              fontSize: 13, fontWeight: 500, color: "var(--lp-accent)",
              padding: "6px 14px", borderRadius: 20,
              border: "1px solid var(--lp-accent)",
              background: "var(--lp-accent-soft)",
              letterSpacing: "0.01em",
            }}>
              ✦ AI-powered bookmarking
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display" style={{
            animation: "fadeUp 0.5s ease both 60ms",
            fontSize: "clamp(32px, 5.5vw, 64px)",
            fontWeight: 800, lineHeight: 1.05,
            margin: "0 0 24px",
          }}>
            <span style={{ color: "var(--lp-text-primary)", display: "block" }}>Save anything.</span>
            <span style={{
              color: "var(--lp-accent)", display: "block",
              textShadow: "0 0 40px rgba(240,165,0,0.4)",
            }}>Find everything.</span>
            <span style={{ color: "var(--lp-text-primary)", display: "block" }}>Nothing gets lost.</span>
          </h1>

          {/* Subheadline */}
          <p style={{
            animation: "fadeUp 0.5s ease both 120ms",
            fontSize: "clamp(16px, 2.5vw, 20px)", lineHeight: 1.6,
            color: "var(--lp-text-secondary)", maxWidth: 560, margin: "0 auto 36px",
          }}>
            The internet moves fast. Your saves shouldn&apos;t disappear with it. Recall bookmarks anything, tags it automatically, and brings it back when you need it — even when you&apos;ve forgotten what you saved.
          </p>

          {/* CTAs */}
          <div style={{
            animation: "fadeUp 0.5s ease both 180ms",
            display: "flex", gap: 12, justifyContent: "center",
            flexWrap: "wrap", marginBottom: 20,
          }}>
            <Link href="/auth" style={{
              fontSize: 15, fontWeight: 600, color: "#0A0A08",
              textDecoration: "none", padding: "14px 28px",
              background: "var(--lp-accent)", borderRadius: 12,
              boxShadow: "var(--lp-shadow-glow)",
              transition: "background 0.15s, transform 0.15s",
              display: "inline-block",
            }}>
              Start saving for free
            </Link>
            <a href="#how" style={{
              fontSize: 15, fontWeight: 500, color: "var(--lp-text-primary)",
              textDecoration: "none", padding: "14px 28px",
              border: "1px solid var(--lp-border-strong)", borderRadius: 12,
              transition: "border-color 0.15s",
              display: "inline-block",
            }}>
              See how it works
            </a>
          </div>

          <p style={{ fontSize: 12, color: "var(--lp-text-muted)", animation: "fadeUp 0.5s ease both 200ms" }}>
            No account needed to try · Works with any URL · Free forever for basics
          </p>

          {/* Hero mockup */}
          <div style={{
            animation: "fadeUp 0.6s ease both 350ms",
            marginTop: 56,
          }}>
            <div style={{
              background: "var(--lp-bg-elevated)",
              border: "1px solid var(--lp-border-strong)",
              borderRadius: 16, overflow: "hidden",
              boxShadow: "var(--lp-shadow-lg), var(--lp-shadow-glow)",
              animation: "float 6s ease-in-out infinite",
              maxWidth: 720, margin: "0 auto",
            }}>
              {/* Browser chrome */}
              <div style={{
                background: "var(--lp-bg-card)",
                padding: "12px 16px",
                borderBottom: "1px solid var(--lp-border)",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["#FF5F57", "#FFBD2E", "#28C840"].map((c, i) => (
                    <span key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c, display: "block" }} />
                  ))}
                </div>
                <div style={{
                  flex: 1, background: "var(--lp-bg-primary)",
                  borderRadius: 6, padding: "5px 12px",
                  fontSize: 11, color: "var(--lp-text-muted)",
                  fontFamily: "var(--font-mono, monospace)",
                  textAlign: "left",
                }}>
                  recall.app/bookmarks
                </div>
              </div>

              {/* Bookmark grid */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1,
                background: "var(--lp-border)", padding: 1,
              }}>
                {MOCK_BOOKMARKS.map((b, i) => (
                  <div key={i} style={{
                    background: "var(--lp-bg-card)",
                    padding: 16, display: "flex", flexDirection: "column", gap: 8,
                  }}>
                    <div style={{
                      height: 80, borderRadius: 8,
                      background: b.gradient, flexShrink: 0,
                    }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: b.dot, flexShrink: 0 }} />
                      <span className="font-mono-lp" style={{ fontSize: 11, color: "var(--lp-text-muted)" }}>{b.domain}</span>
                    </div>
                    <p style={{
                      fontSize: 12, fontWeight: 500, color: "var(--lp-text-primary)",
                      margin: 0, lineHeight: 1.4,
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>{b.title}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {b.tags.map((t, j) => (
                        <span key={j} style={{
                          fontSize: 10, padding: "2px 8px", borderRadius: 20,
                          background: "var(--lp-accent-soft)", color: "var(--lp-accent)",
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ────────────────────────────────────────────────── */}
      <div style={{
        background: "var(--lp-bg-secondary)",
        borderTop: "1px solid var(--lp-border)",
        borderBottom: "1px solid var(--lp-border)",
        padding: "40px 24px",
      }}>
        <div style={{
          maxWidth: 900, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 0, textAlign: "center", alignItems: "stretch",
        }} className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: "0 24px",
              borderRight: i < 2 ? "1px solid var(--lp-border)" : "none",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              <p className="font-display" style={{
                fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800,
                color: "var(--lp-accent)", margin: "0 0 8px",
                lineHeight: 1.1, textAlign: "center",
              }}>{s.value}</p>
              <p style={{ fontSize: 14, color: "var(--lp-text-secondary)", margin: 0, textAlign: "center" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROBLEM SECTION ───────────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="problem-grid">
          {/* Quote */}
          <div data-animate style={{ position: "relative" }}>
            <span className="font-display" style={{
              fontSize: 120, lineHeight: 0.8,
              color: "var(--lp-accent)", opacity: 0.3,
              position: "absolute", top: -20, left: -10,
              fontWeight: 800, userSelect: "none",
            }}>&ldquo;</span>
            <blockquote style={{
              fontSize: "clamp(18px, 2.5vw, 24px)", lineHeight: 1.55,
              color: "var(--lp-text-primary)", fontStyle: "italic",
              paddingTop: 60, margin: 0,
            }}>
              I save 50 links a week. I read maybe 3. The rest just sit there, forgotten, useless. I knew I saved that article about <em>[thing]</em> but I can never find it. So I save it again. And again.
            </blockquote>
            <p style={{ marginTop: 20, fontSize: 14, color: "var(--lp-text-muted)" }}>— Everyone who uses the internet</p>
          </div>

          {/* Pain points */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {PAIN_POINTS.map((p, i) => (
              <div key={i} data-animate style={{
                background: "var(--lp-bg-card)",
                border: "1px solid var(--lp-border)",
                borderRadius: 16, padding: "20px 24px",
                display: "flex", gap: 16, alignItems: "flex-start",
              }}>
                <span style={{
                  fontSize: 20, width: 40, height: 40, borderRadius: 10,
                  background: p.bg, display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0,
                }}>{p.icon}</span>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "var(--lp-text-primary)", margin: "0 0 4px" }}>{p.title}</p>
                  <p style={{ fontSize: 13, color: "var(--lp-text-secondary)", margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", background: "var(--lp-bg-secondary)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div data-animate style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 className="font-display" style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, margin: "0 0 12px", color: "var(--lp-text-primary)" }}>
              Everything your bookmarks should do
            </h2>
            <p style={{ fontSize: 18, color: "var(--lp-text-secondary)", margin: 0 }}>Not just save. Actually work.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} data-animate className="feature-card" style={{
                background: "var(--lp-bg-card)",
                border: "1px solid var(--lp-border)",
                borderRadius: 20, padding: 28,
                display: "flex", flexDirection: "column", gap: 12,
                transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
                cursor: "default",
              }}>
                <span style={{ fontSize: 28 }}>{f.icon}</span>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "var(--lp-text-primary)", margin: "0 0 6px" }}>{f.title}</p>
                  <p style={{ fontSize: 13, color: "var(--lp-text-secondary)", margin: 0, lineHeight: 1.55 }}>{f.desc}</p>
                </div>
                <span style={{
                  marginTop: "auto", fontSize: 11, fontWeight: 500,
                  color: "var(--lp-accent)", padding: "3px 10px",
                  background: "var(--lp-accent-soft)", borderRadius: 20,
                  alignSelf: "flex-start",
                }}>{f.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section id="how" style={{ padding: "100px 24px", background: "var(--lp-bg-primary)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div data-animate style={{ textAlign: "center", marginBottom: 72 }}>
            <h2 className="font-display" style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, color: "var(--lp-text-primary)", margin: 0 }}>
              How it works
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, position: "relative" }} className="steps-grid">
            {/* Dashed connecting line */}
            <div className="steps-line" style={{
              position: "absolute", top: 40, left: "16.5%", right: "16.5%",
              borderTop: "1px dashed var(--lp-border-strong)",
              pointerEvents: "none",
            }} />
            {HOW_STEPS.map((s, i) => (
              <div key={i} data-animate style={{ padding: "0 32px", textAlign: "center", position: "relative" }}>
                {/* Ghost number */}
                <div className="font-display" style={{
                  fontSize: 140, fontWeight: 800, lineHeight: 1,
                  color: "var(--lp-accent)", opacity: 0.06,
                  position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)",
                  userSelect: "none", pointerEvents: "none", zIndex: 0,
                }}>{s.num}</div>
                {/* Step content */}
                <div style={{ position: "relative", zIndex: 1, paddingTop: 20 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: "var(--lp-bg-card)",
                    border: "2px solid var(--lp-accent)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 20px", fontSize: 22,
                  }}>{s.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--lp-text-primary)", margin: "0 0 8px" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--lp-text-secondary)", margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESURFACING CALLOUT ────────────────────────────────────────── */}
      <section style={{
        padding: "100px 24px",
        background: "linear-gradient(135deg, var(--lp-bg-elevated) 0%, var(--lp-bg-card) 100%)",
        borderTop: "1px solid var(--lp-border)",
        borderBottom: "1px solid var(--lp-border)",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <div data-animate style={{ marginBottom: 60 }}>
            <h2 className="font-display" style={{ fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 800, lineHeight: 1.1, margin: 0 }}>
              <span style={{ color: "var(--lp-text-primary)", display: "block" }}>The internet gave it to you once.</span>
              <span style={{ color: "var(--lp-accent)", display: "block" }}>Recall gives it back.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="resurface-grid">
            {RESURFACE_MODES.map((m, i) => (
              <div key={i} data-animate style={{
                background: "var(--lp-bg-card)",
                borderLeft: "3px solid var(--lp-accent)",
                borderRadius: 12, padding: "20px 24px", textAlign: "left",
              }}>
                <span style={{ fontSize: 24, display: "block", marginBottom: 10 }}>{m.icon}</span>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--lp-text-primary)", margin: "0 0 6px" }}>{m.title}</p>
                <p style={{ fontSize: 13, color: "var(--lp-text-secondary)", margin: 0, lineHeight: 1.55 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
      <section style={{ padding: "120px 24px", textAlign: "center", background: "var(--lp-bg-primary)" }}>
        <div data-animate>
          <h2 className="font-display" style={{ fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 800, color: "var(--lp-text-primary)", margin: "0 0 16px", lineHeight: 1.1 }}>
            Stop losing what matters.
          </h2>
          <p style={{ fontSize: 18, color: "var(--lp-text-secondary)", marginBottom: 40 }}>
            Everything you save on the internet, finally working for you.
          </p>
          <Link href="/auth" style={{
            fontSize: 16, fontWeight: 700, color: "#0A0A08",
            textDecoration: "none", padding: "16px 36px",
            background: "var(--lp-accent)", borderRadius: 14,
            boxShadow: "var(--lp-shadow-glow)",
            display: "inline-block",
          }}>
            Start saving for free →
          </Link>
          <p style={{ fontSize: 13, color: "var(--lp-text-muted)", marginTop: 20 }}>
            Free to start · No credit card · Works with any browser
          </p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer style={{
        background: "var(--lp-bg-secondary)",
        borderTop: "1px solid var(--lp-border)",
        padding: "28px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 16, height: 16, borderRadius: 4, background: "var(--lp-accent)", display: "inline-block" }} />
          <span style={{ fontSize: 13, color: "var(--lp-text-muted)" }}>
            <span className="font-display" style={{ fontWeight: 700, color: "var(--lp-text-primary)", marginRight: 6 }}>Recall</span>
            © 2025. All rights reserved.
          </span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {[["Privacy", "#"], ["Terms", "#"], ["GitHub", "https://github.com/MinitJain/recall"]].map(([label, href]) => (
            <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
              style={{ fontSize: 13, color: "var(--lp-text-muted)", textDecoration: "none" }}>
              {label}
            </a>
          ))}
        </div>
        <p style={{ fontSize: 13, color: "var(--lp-text-muted)", margin: 0 }}>
          Built with ❤️ for everyone who saves things
        </p>
      </footer>

      {/* ── RESPONSIVE STYLES ─────────────────────────────────────────── */}
      <style>{`
        .stats-grid { grid-template-columns: repeat(3, 1fr); }
        .nav-buttons { display: flex; align-items: center; gap: 12px; }
        .nav-signin {
          font-size: 14px; font-weight: 500; color: var(--lp-text-secondary);
          text-decoration: none; padding: 8px 16px;
          border: 1px solid var(--lp-border-strong); border-radius: 10px;
          transition: color 0.15s, border-color 0.15s;
        }
        .nav-signin:hover { color: var(--lp-text-primary); border-color: var(--lp-accent); }
        .nav-cta {
          font-size: 14px; font-weight: 600; color: #0A0A08;
          text-decoration: none; padding: 8px 18px;
          background: var(--lp-accent); border-radius: 10px;
          box-shadow: var(--lp-shadow-glow);
          transition: background 0.15s, transform 0.15s;
        }
        .nav-cta:hover { background: var(--lp-accent-warm); transform: scale(1.02); }
        .problem-grid { grid-template-columns: 1fr 1fr; }
        .features-grid { grid-template-columns: repeat(3, 1fr); }
        .steps-grid { grid-template-columns: repeat(3, 1fr); }
        .resurface-grid { grid-template-columns: repeat(3, 1fr); }
        .steps-line { display: block; }
        .feature-card:hover {
          border-color: var(--lp-accent) !important;
          box-shadow: var(--lp-shadow-glow) !important;
          transform: translateY(-2px) !important;
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .nav-buttons { display: none; }
          .problem-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .resurface-grid { grid-template-columns: 1fr !important; }
          .steps-line { display: none !important; }
        }
        @media (max-width: 480px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Static data ──────────────────────────────────────────────────────────── */

const MOCK_BOOKMARKS = [
  {
    gradient: "linear-gradient(135deg, #F0A500 0%, #E8820A 100%)",
    dot: "#F0A500", domain: "paulgraham.com",
    title: "How to Do Great Work",
    tags: ["writing", "startups"],
  },
  {
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
    dot: "#8B5CF6", domain: "youtube.com",
    title: "The Art of Focus — Andrew Huberman",
    tags: ["productivity", "science"],
  },
  {
    gradient: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
    dot: "#14B8A6", domain: "vercel.com",
    title: "Introducing the AI SDK 4.0",
    tags: ["dev", "AI"],
  },
  {
    gradient: "linear-gradient(135deg, #475569 0%, #1E293B 100%)",
    dot: "#94A3B8", domain: "twitter.com",
    title: "Thread: 20 mental models that changed how I think",
    tags: ["mental models"],
  },
  {
    gradient: "linear-gradient(135deg, #EC4899 0%, #9333EA 100%)",
    dot: "#EC4899", domain: "figma.com",
    title: "Design tokens that actually scale",
    tags: ["design", "systems"],
  },
  {
    gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    dot: "#F59E0B", domain: "substack.com",
    title: "Why you should read more slowly",
    tags: ["reading", "focus"],
  },
];

const STATS = [
  { value: "Any URL", label: "Tweet, video, article, Reddit thread — if it has a link, Recall saves it" },
  { value: "< 3 sec", label: "Average time for AI to tag and preview a new bookmark" },
  { value: "0 manual tags", label: "Required — AI handles it automatically, you can always add more" },
];

const PAIN_POINTS = [
  {
    icon: "📥", title: "The black hole",
    desc: "You save it. You never see it again. Your bookmarks become a graveyard.",
    bg: "rgba(220,38,38,0.12)",
  },
  {
    icon: "🔍", title: "The search problem",
    desc: "You remember saving something but not what it was called. Normal search is useless.",
    bg: "rgba(245,158,11,0.12)",
  },
  {
    icon: "🔁", title: "The resurfacing gap",
    desc: "No tool brings things back to you. You have to go find them — and you never do.",
    bg: "rgba(139,92,246,0.12)",
  },
];

const FEATURES = [
  { icon: "🔖", title: "Save anything", desc: "Tweet, blog, video, image, Reddit thread, product page. If it has a URL, Recall saves it.", tag: "Any URL" },
  { icon: "🤖", title: "AI auto-tagging", desc: "The moment you save, AI reads the content and adds relevant tags. No manual work.", tag: "Instant" },
  { icon: "🔍", title: "Fuzzy AI search", desc: "Can't remember the title? Search by feeling. 'that article about focus and music' actually works.", tag: "Natural language" },
  { icon: "📁", title: "Collections", desc: "Group bookmarks into collections manually or let AI suggest groupings based on your saves.", tag: "Organized" },
  { icon: "✨", title: "Resurfacing", desc: "Recall brings things back to you — daily digest, random rediscovery, 'you saved this a year ago'.", tag: "Never forget" },
  { icon: "🖼️", title: "Rich previews", desc: "Every bookmark shows title, description, and preview image — fetched automatically from OG tags.", tag: "Beautiful" },
];

const HOW_STEPS = [
  { num: "01", icon: "🔗", title: "Paste any URL", desc: "Copy a link from anywhere on the internet. Paste it into Recall." },
  { num: "02", icon: "🤖", title: "AI does the rest", desc: "Title, tags, preview image, smart categorization — all automatic." },
  { num: "03", icon: "✨", title: "Find it when you need it", desc: "Search naturally, browse collections, or let Recall surface it back to you." },
];

const RESURFACE_MODES = [
  { icon: "🌅", title: "Daily digest", desc: "Every morning, 5 things you saved that are worth revisiting." },
  { icon: "🎲", title: "Random rediscovery", desc: "Hit a button. See something you forgot you saved. Always surprising." },
  { icon: "⏰", title: "Time capsule", desc: "'You saved this exactly one year ago.' Recall remembers so you don't have to." },
];
