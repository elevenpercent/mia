import { useState } from "react";

const f = { fontFamily: "'Inter', sans-serif" };

const T = {
  peach:      "#f47c5a",
  peachLight: "#fde8de",
  peachMid:   "#f9b89a",
  peachDark:  "#c85a38",
  white:      "#ffffff",
  offWhite:   "#fdf8f6",
  bg:         "#fdf8f6",
  dark:       "#1a0f0a",
  darker:     "#0f0704",
  border:     "#f5ddd4",
  text:       "#2d1f1a",
  muted:      "#8a6a60",
};

const FEATURES = [
  { icon: "◆", title: "Morning Ritual", desc: "10 micro-tasks. Under 1 minute each. Own your morning before the world wakes up." },
  { icon: "◇", title: "Night Ritual", desc: "10 wind-down tasks. Clear your mind, prep for tomorrow, close with gratitude." },
  { icon: "★", title: "Points & Levels", desc: "Earn 1 point per task. Reach 1,000 to unlock Level 2. Collect stars. Win awards." },
  { icon: "△", title: "TRIO Programme", desc: "Decluttering, Mindfulness, Know What You Want. Three pillars of total transformation." },
  { icon: "○", title: "Live Leaderboard", desc: "See where you stand among all members in real time. Rise through the ranks." },
];

const STATS = [
  { value: "30", label: "Daily tasks" },
  { value: "2",  label: "Levels" },
  { value: "8",  label: "Badges" },
  { value: "3",  label: "TRIO modules" },
];

export default function Landing({ onGetStarted }) {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: T.darker, maxWidth: 430, margin: "0 auto", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.darker}; }
        .cta-btn:active { transform: scale(0.98); }
      `}</style>

      {/* Hero */}
      <div style={{ padding: "64px 28px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", border: "1px solid rgba(244,124,90,0.15)" }} />
        <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", border: "1px solid rgba(244,124,90,0.1)" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
          <div style={{ width: 40, height: 40, background: T.peach, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ ...f, fontSize: 18, fontWeight: 800, color: "white" }}>M</span>
          </div>
          <div>
            <p style={{ ...f, fontSize: 18, fontWeight: 800, color: "white", letterSpacing: 2 }}>MIA</p>
            <p style={{ ...f, fontSize: 9, color: T.peachMid, letterSpacing: 3, textTransform: "uppercase" }}>Me In Action</p>
          </div>
        </div>

        {/* Headline */}
        <p style={{ ...f, fontSize: 11, color: T.peachMid, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>Your daily transformation system</p>
        <h1 style={{ ...f, fontSize: 40, fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 20 }}>
          Your first 15.<br />
          Your last 15.<br />
          <span style={{ color: T.peach }}>Every single day.</span>
        </h1>
        <p style={{ ...f, fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: 36 }}>
          MIA gives you a structured morning and night routine — 30 micro-tasks, each under 1 minute. Track your progress, earn points, rise through the ranks, and unlock new levels.
        </p>

        {/* CTA */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button className="cta-btn" onClick={() => onGetStarted("signup")} style={{
            width: "100%", padding: "17px", background: T.peach, border: "none", borderRadius: 16,
            ...f, fontSize: 16, fontWeight: 700, color: "white", cursor: "pointer", letterSpacing: 0.5,
          }}>Start My Journey — Free</button>
          <button className="cta-btn" onClick={() => onGetStarted("login")} style={{
            width: "100%", padding: "17px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
            ...f, fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.7)", cursor: "pointer",
          }}>Sign In</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: "rgba(244,124,90,0.12)", margin: "0 20px", borderRadius: 18, padding: "20px 16px", display: "flex", justifyContent: "space-around", marginBottom: 40, border: "1px solid rgba(244,124,90,0.2)" }}>
        {STATS.map(s => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <p style={{ ...f, fontSize: 26, fontWeight: 800, color: T.peach, marginBottom: 3 }}>{s.value}</p>
            <p style={{ ...f, fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ padding: "0 20px", marginBottom: 40 }}>
        <p style={{ ...f, fontSize: 11, color: T.peachMid, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>What's inside MIA</p>
        {FEATURES.map((feat, i) => (
          <div
            key={feat.title}
            onMouseEnter={() => setHoveredFeature(i)}
            onMouseLeave={() => setHoveredFeature(null)}
            style={{
              display: "flex", gap: 16, padding: "16px", borderRadius: 16, marginBottom: 8,
              background: hoveredFeature === i ? "rgba(244,124,90,0.1)" : "rgba(255,255,255,0.03)",
              border: "1px solid rgba(244,124,90,0.15)",
              transition: "background 0.2s",
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(244,124,90,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 18, color: T.peach }}>{feat.icon}</span>
            </div>
            <div>
              <p style={{ ...f, fontSize: 15, fontWeight: 700, color: "white", marginBottom: 4 }}>{feat.title}</p>
              <p style={{ ...f, fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ padding: "0 20px", marginBottom: 40 }}>
        <p style={{ ...f, fontSize: 11, color: T.peachMid, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>How it works</p>
        {[
          ["01", "Sign up free", "Create your account in 30 seconds"],
          ["02", "Follow your routine", "Tick off morning and night tasks daily"],
          ["03", "Earn points & stars", "1 point per task · 1 star per 1,000 points"],
          ["04", "Rise through levels", "1,000 points unlocks Level 2 practices"],
          ["05", "Win season awards", "Top 3 on the leaderboard win real prizes"],
        ].map(([num, title, desc]) => (
          <div key={num} style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(244,124,90,0.12)", border: "1px solid rgba(244,124,90,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ ...f, fontSize: 11, color: T.peach, fontWeight: 700 }}>{num}</span>
            </div>
            <div>
              <p style={{ ...f, fontSize: 14, fontWeight: 600, color: "white", marginBottom: 2 }}>{title}</p>
              <p style={{ ...f, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div style={{ margin: "0 20px", background: "rgba(244,124,90,0.1)", borderRadius: 20, padding: "24px 22px", marginBottom: 40, border: "1px solid rgba(244,124,90,0.2)" }}>
        <p style={{ ...f, fontSize: 16, color: "white", lineHeight: 1.8, fontStyle: "italic", marginBottom: 12 }}>
          "Small rituals, practised daily, become the architecture of a beautiful life."
        </p>
        <p style={{ ...f, fontSize: 12, color: T.peach, fontWeight: 600, letterSpacing: 2 }}>— MIA</p>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: "0 20px 60px" }}>
        <button className="cta-btn" onClick={() => onGetStarted("signup")} style={{
          width: "100%", padding: "17px", background: T.peach, border: "none", borderRadius: 16,
          ...f, fontSize: 16, fontWeight: 700, color: "white", cursor: "pointer",
        }}>Join MIA — It's Free</button>
        <p style={{ ...f, fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 14 }}>
          meinaction.com · Your data is private and secure
        </p>
      </div>
    </div>
  );
}
