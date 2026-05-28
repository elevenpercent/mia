import { useState } from "react";

const f = { fontFamily: "'Inter', sans-serif" };

const T = {
  peach:      "#f47c5a",
  peachLight: "#fde8de",
  peachDark:  "#c85a38",
  white:      "#ffffff",
  bg:         "#fdf8f6",
  border:     "#f5ddd4",
  text:       "#2d1f1a",
  muted:      "#8a6a60",
};

const SLIDES = [
  {
    icon: "◆",
    title: "Welcome to MIA",
    subtitle: "Me In Action",
    body: "Your first and last moments of every day — structured, intentional, and transformative. Morning tasks. Night tasks. Under 1 minute each.",
  },
  {
    icon: "☀",
    title: "Morning Ritual",
    subtitle: "Level 1 · 10 tasks",
    body: "Begin with a smile before your eyes open. End with your lamp lit and your intention set. Own your morning before the world wakes up.",
  },
  {
    icon: "☽",
    title: "Night Ritual",
    subtitle: "Level 1 · 10 tasks",
    body: "Wind down with intention. Clean your kitchen, care for your body, and close with five gratitudes behind closed eyes.",
  },
  {
    icon: "★",
    title: "Points & Ranks",
    subtitle: "Earn · Rise · Win",
    body: "Every completed task earns a point. Reach 1,000 points to unlock Level 2. Accumulate stars and rise through the ranks.",
  },
  {
    icon: "◇",
    title: "TRIO Programme",
    subtitle: "3 Modules · Deeper Work",
    body: "Explore TRIO — Decluttering, Mindfulness, and Know What You Want. Three pillars of total transformation. By invitation only.",
  },
];

export default function Onboarding({ onComplete }) {
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.bg}; -webkit-font-smoothing: antialiased; }
        button { -webkit-tap-highlight-color: transparent; }
      `}</style>

      {/* Header bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "52px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, background: T.peach, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ ...f, fontSize: 14, fontWeight: 800, color: "white" }}>M</span>
          </div>
          <span style={{ ...f, fontSize: 14, fontWeight: 700, color: T.text, letterSpacing: 1 }}>MIA</span>
        </div>
        {!isLast && (
          <button
            onClick={onComplete}
            style={{ background: "none", border: "none", ...f, fontSize: 14, color: T.muted, cursor: "pointer", fontWeight: 500, padding: "6px 4px" }}
          >
            Skip
          </button>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px 20px", textAlign: "center" }}>

        {/* Icon */}
        <div style={{ width: 80, height: 80, borderRadius: 22, background: T.peachLight, border: `2px solid ${T.peach}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
          <span style={{ fontSize: 30, color: T.peach }}>{current.icon}</span>
        </div>

        {/* Text */}
        <p style={{ ...f, fontSize: 11, color: T.peach, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{current.subtitle}</p>
        <h1 style={{ ...f, fontSize: 30, fontWeight: 800, color: T.text, marginBottom: 16, lineHeight: 1.2 }}>{current.title}</h1>
        <p style={{ ...f, fontSize: 15, color: T.muted, lineHeight: 1.8, maxWidth: 320 }}>{current.body}</p>
      </div>

      {/* Bottom controls */}
      <div style={{ padding: "0 24px 52px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>

        {/* Dots */}
        <div style={{ display: "flex", gap: 6 }}>
          {SLIDES.map((_, i) => (
            <div
              key={i}
              onClick={() => setSlide(i)}
              style={{
                width: i === slide ? 24 : 7,
                height: 7,
                borderRadius: 4,
                background: i === slide ? T.peach : T.border,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>

        {/* Button */}
        <button
          onClick={() => isLast ? onComplete() : setSlide(s => s + 1)}
          style={{
            width: "100%", padding: "16px", border: "none", borderRadius: 14,
            background: T.peach, ...f, fontSize: 15, fontWeight: 700, color: "white",
            cursor: "pointer", letterSpacing: 0.3,
          }}
        >
          {isLast ? "Start My Journey" : "Next"}
        </button>

        {slide > 0 && !isLast && (
          <button
            onClick={() => setSlide(s => s - 1)}
            style={{ background: "none", border: "none", ...f, fontSize: 13, color: T.muted, cursor: "pointer" }}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
