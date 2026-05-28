import { useState } from "react";

const f = { fontFamily: "'Inter', sans-serif" };

export const MILESTONES = [
  { id: "d7",    points: 70,   icon: "◆", name: "First Week",     desc: "7 days of showing up" },
  { id: "d30",   points: 300,  icon: "◇", name: "One Month",      desc: "30 days consistent" },
  { id: "p500",  points: 500,  icon: "△", name: "Halfway",        desc: "500 points earned" },
  { id: "p1000", points: 1000, icon: "★", name: "Level Unlock",   desc: "Level 2 now open" },
  { id: "d90",   points: 900,  icon: "◈", name: "90 Day Master",  desc: "90 days of Level 1" },
  { id: "s10",   stars: 10,    icon: "✦", name: "Star Collector", desc: "10 stars earned" },
  { id: "s100",  stars: 100,   icon: "⬡", name: "Golden Award",   desc: "100 stars — Golden Package!" },
];

export function getStars(points) { return Math.floor(points / 1000); }
export function getPointsToNextStar(points) { return 1000 - (points % 1000); }
export function getLevel(points) { return points >= 1000 ? 2 : 1; }
export function getRank(points) {
  if (points >= 5000) return { label: "Champion", color: "var(--p, #f47c5a)", icon: "◆", tier: 5 };
  if (points >= 3000) return { label: "Elite",    color: "var(--p2, #c85a38)", icon: "◇", tier: 4 };
  if (points >= 1500) return { label: "Advanced", color: "#134e4a", icon: "△", tier: 3 };
  if (points >= 500)  return { label: "Rising",   color: "#1a6060", icon: "○", tier: 2 };
  return { label: "Starter", color: "#8a6a60", icon: "·", tier: 1 };
}

// ── Milestone Celebration ────────────────────────────────────────────────────
export function MilestoneCelebration({ milestone, onClose }) {
  if (!milestone) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,46,46,0.85)", backdropFilter: "blur(8px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "white", borderRadius: 24, padding: "40px 28px", maxWidth: 340, width: "100%", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: 18, background: "#fde8de", border: "2px solid var(--p, #f47c5a)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 32, color: "var(--p, #f47c5a)" }}>{milestone.icon}</div>
        <p style={{ ...f, fontSize: 11, letterSpacing: 3, color: "var(--p, #f47c5a)", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Milestone Unlocked</p>
        <h2 style={{ ...f, fontSize: 26, fontWeight: 700, color: "var(--d, #2d1f1a)", marginBottom: 8 }}>{milestone.name}</h2>
        <p style={{ ...f, fontSize: 14, color: "#8a6a60", lineHeight: 1.7, marginBottom: 28 }}>{milestone.desc}</p>
        <button onClick={onClose} style={{ width: "100%", padding: "14px", background: "var(--p, #f47c5a)", border: "none", borderRadius: 12, ...f, fontSize: 15, color: "white", cursor: "pointer", fontWeight: 600 }}>Continue</button>
      </div>
    </div>
  );
}

// ── Points Dashboard ─────────────────────────────────────────────────────────
export function PointsDashboard({ points, rank, theme = {} }) {
  const stars = getStars(points);
  const toNextStar = getPointsToNextStar(points);
  const level = getLevel(points);
  const pctToNextStar = Math.round((points % 1000) / 10);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[["Points", points.toLocaleString(), "var(--p, #f47c5a)"], ["Stars", stars + " ★", "var(--p2, #c85a38)"], ["Level", level, "#134e4a"]].map(([l, v, c]) => (
          <div key={l} style={{ background: "white", border: "1px solid #f5ddd4", borderRadius: 14, padding: "14px 10px", textAlign: "center" }}>
            <p style={{ ...f, fontSize: 20, fontWeight: 700, color: c, marginBottom: 4 }}>{v}</p>
            <p style={{ ...f, fontSize: 10, color: "#8a6a60", letterSpacing: 1.5, textTransform: "uppercase" }}>{l}</p>
          </div>
        ))}
      </div>
      <div style={{ background: rank.color, borderRadius: 14, padding: "16px 18px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ ...f, fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Current Rank</p>
          <p style={{ ...f, fontSize: 22, fontWeight: 700, color: "white" }}>{rank.icon} {rank.label}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ ...f, fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>{toNextStar} pts to next ★</p>
          <div style={{ width: 80, height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pctToNextStar}%`, background: "white", borderRadius: 10, transition: "width 0.6s" }} />
          </div>
        </div>
      </div>
      <div style={{ background: "white", border: "1px solid #f5ddd4", borderRadius: 14, padding: "16px 18px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ ...f, fontSize: 13, fontWeight: 600, color: "var(--d, #2d1f1a)" }}>★ Stars Progress</p>
          <p style={{ ...f, fontSize: 12, color: "var(--p, #f47c5a)" }}>{stars} / 100</p>
        </div>
        <div style={{ height: 8, background: "#fdf8f6", borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ height: "100%", width: `${Math.min(stars, 100)}%`, background: "linear-gradient(90deg,var(--p, #f47c5a),var(--p2, #c85a38))", borderRadius: 10, transition: "width 0.6s" }} />
        </div>
        <p style={{ ...f, fontSize: 11, color: "#8a6a60" }}>{100 - stars} more stars to Golden Award Package</p>
      </div>
      <p style={{ ...f, fontSize: 11, fontWeight: 600, color: "var(--d, #2d1f1a)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Milestones</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {MILESTONES.map(m => {
          const earned = m.points ? points >= m.points : getStars(points) >= m.stars;
          return (
            <div key={m.id} style={{ background: earned ? "#fde8de" : "white", border: `1px solid ${earned ? "var(--p, #f47c5a)" : "#f5ddd4"}`, borderRadius: 14, padding: "14px", textAlign: "center", opacity: earned ? 1 : 0.5 }}>
              <p style={{ fontSize: 24, color: earned ? "var(--p, #f47c5a)" : "#aaa", marginBottom: 6 }}>{m.icon}</p>
              <p style={{ ...f, fontSize: 12, fontWeight: 600, color: "var(--d, #2d1f1a)", marginBottom: 2 }}>{m.name}</p>
              <p style={{ ...f, fontSize: 10, color: "#8a6a60" }}>{m.desc}</p>
              {earned && <p style={{ ...f, fontSize: 9, color: "var(--p, #f47c5a)", marginTop: 4, fontWeight: 600 }}>EARNED ✓</p>}
              {!earned && <p style={{ ...f, fontSize: 9, color: "#aaa", marginTop: 4 }}>{m.points ? m.points + " pts" : m.stars + " ★"} needed</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── PACER-STYLE LIVE LEADERBOARD ─────────────────────────────────────────────
export function Leaderboard({ entries, currentUserId, theme = {} }) {
  const sorted = [...entries].sort((a, b) => b.points - a.points);
  const medals = ["🥇", "🥈", "🥉"];
  const myIndex = sorted.findIndex(e => e.id === currentUserId);
  const myEntry = sorted[myIndex];
  const ahead = myIndex > 0 ? sorted[myIndex - 1] : null;
  const behind = myIndex < sorted.length - 1 ? sorted[myIndex + 1] : null;
  const maxPoints = sorted[0]?.points || 1;

  return (
    <div>
      {/* My position callout */}
      {myEntry && (
        <div style={{ background: "var(--d, #2d1f1a)", borderRadius: 16, padding: "16px 18px", marginBottom: 16 }}>
          <p style={{ ...f, fontSize: 11, color: "var(--p, #f47c5a)", letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>Your Position</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <p style={{ ...f, fontSize: 28, fontWeight: 800, color: "white" }}>#{myIndex + 1}</p>
              <p style={{ ...f, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>of {sorted.length} members</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ ...f, fontSize: 22, fontWeight: 700, color: "var(--p, #f47c5a)" }}>{myEntry.points.toLocaleString()}</p>
              <p style={{ ...f, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>points</p>
            </div>
          </div>
          {ahead && (
            <div style={{ background: "rgba(13,148,136,0.15)", borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ ...f, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                  <span style={{ color: "var(--p, #f47c5a)", fontWeight: 700 }}>↑ {ahead.name}</span> is ahead
                </p>
                <p style={{ ...f, fontSize: 13, fontWeight: 700, color: "var(--p, #f47c5a)" }}>+{(ahead.points - myEntry.points).toLocaleString()} pts</p>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden", marginTop: 8 }}>
                <div style={{ height: "100%", width: `${Math.min((myEntry.points / ahead.points) * 100, 100)}%`, background: "var(--p, #f47c5a)", borderRadius: 10, transition: "width 0.6s" }} />
              </div>
              <p style={{ ...f, fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Complete {Math.ceil((ahead.points - myEntry.points))} more tasks to overtake</p>
            </div>
          )}
          {behind && (
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ ...f, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                  {behind.name} is {(myEntry.points - behind.points).toLocaleString()} pts behind you
                </p>
                <p style={{ ...f, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>↓ #{myIndex + 2}</p>
              </div>
            </div>
          )}
          {!ahead && myIndex === 0 && (
            <div style={{ background: "rgba(13,148,136,0.2)", borderRadius: 10, padding: "10px 14px" }}>
              <p style={{ ...f, fontSize: 13, color: "var(--p, #f47c5a)", fontWeight: 700, textAlign: "center" }}>◆ You are leading the season!</p>
            </div>
          )}
        </div>
      )}

      {/* Full leaderboard */}
      <p style={{ ...f, fontSize: 11, fontWeight: 600, color: "var(--d, #2d1f1a)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>All Members</p>
      {sorted.map((entry, i) => {
        const isMe = entry.id === currentUserId;
        const rank = getRank(entry.points);
        const barPct = Math.round((entry.points / maxPoints) * 100);
        return (
          <div key={entry.id} style={{
            background: isMe ? "#fde8de" : "white",
            border: `1.5px solid ${isMe ? "var(--p, #f47c5a)" : "#f5ddd4"}`,
            borderRadius: 14, padding: "14px 16px", marginBottom: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 32, textAlign: "center", flexShrink: 0 }}>
                {i < 3
                  ? <span style={{ fontSize: 20 }}>{medals[i]}</span>
                  : <span style={{ ...f, fontSize: 14, fontWeight: 700, color: "#8a6a60" }}>#{i + 1}</span>
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ ...f, fontSize: 14, fontWeight: 600, color: "var(--d, #2d1f1a)" }}>
                    {entry.name}{isMe ? " ← You" : ""}
                  </p>
                  <p style={{ ...f, fontSize: 16, fontWeight: 800, color: isMe ? "var(--p, #f47c5a)" : "var(--d, #2d1f1a)" }}>{entry.points.toLocaleString()}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                  <p style={{ ...f, fontSize: 11, color: rank.color, fontWeight: 500 }}>{rank.icon} {rank.label}</p>
                  <p style={{ ...f, fontSize: 11, color: "#8a6a60" }}>{getStars(entry.points)} ★</p>
                </div>
              </div>
            </div>
            {/* Progress bar relative to leader */}
            <div style={{ height: 4, background: "#fdf8f6", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${barPct}%`, background: isMe ? "var(--p, #f47c5a)" : "#f5ddd4", borderRadius: 10, transition: "width 0.6s" }} />
            </div>
          </div>
        );
      })}

      {sorted.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ ...f, fontSize: 14, color: "#8a6a60" }}>Be the first on the leaderboard!</p>
        </div>
      )}

      {/* Season awards */}
      <div style={{ background: "var(--d, #2d1f1a)", borderRadius: 16, padding: "18px 20px", marginTop: 8 }}>
        <p style={{ ...f, fontSize: 12, color: "var(--p, #f47c5a)", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Season Awards</p>
        {[["🥇 1st Place", "Cash award + Next programme membership"], ["🥈 2nd Place", "Cash award + Next programme membership"], ["🥉 3rd Place", "Next programme membership"]].map(([title, desc]) => (
          <div key={title} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(13,148,136,0.15)" }}>
            <p style={{ ...f, fontSize: 13, fontWeight: 600, color: "white" }}>{title}</p>
            <p style={{ ...f, fontSize: 11, color: "rgba(255,255,255,0.4)", maxWidth: 160, textAlign: "right" }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Share Card ────────────────────────────────────────────────────────────────
export function ShareStreak({ points, userName, onClose }) {
  const [copied, setCopied] = useState(false);
  const stars = getStars(points);
  const rank = getRank(points);
  const text = `I have ${points.toLocaleString()} points on MIA!\n${rank.icon} Rank: ${rank.label} · ${stars} stars\n\nJoin me at meinaction.com`;

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "MIA — Me In Action", text, url: "https://meinaction.com" }); } catch {}
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,46,46,0.7)", backdropFilter: "blur(8px)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: "24px 24px 0 0", padding: "28px 24px 44px", width: "100%", maxWidth: 430 }}>
        <p style={{ ...f, fontSize: 18, fontWeight: 700, color: "var(--d, #2d1f1a)", marginBottom: 18 }}>Share Your Progress</p>
        <div style={{ background: "var(--d, #2d1f1a)", borderRadius: 18, padding: "24px 22px", marginBottom: 20 }}>
          <p style={{ ...f, fontSize: 13, color: "var(--p, #f47c5a)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>MIA — Me In Action</p>
          <p style={{ ...f, fontSize: 36, fontWeight: 800, color: "white", marginBottom: 4 }}>{points.toLocaleString()}</p>
          <p style={{ ...f, fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>points earned</p>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ background: "rgba(13,148,136,0.2)", borderRadius: 10, padding: "7px 14px" }}>
              <p style={{ ...f, fontSize: 12, color: "var(--p, #f47c5a)", fontWeight: 600 }}>{rank.icon} {rank.label}</p>
            </div>
            <div style={{ background: "rgba(13,148,136,0.2)", borderRadius: 10, padding: "7px 14px" }}>
              <p style={{ ...f, fontSize: 12, color: "var(--p, #f47c5a)", fontWeight: 600 }}>{stars} ★ Stars</p>
            </div>
          </div>
          <p style={{ ...f, fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 14 }}>meinaction.com</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "13px", background: "#fdf8f6", border: "1px solid #f5ddd4", borderRadius: 12, ...f, fontSize: 14, color: "#8a6a60", cursor: "pointer" }}>Cancel</button>
          <button onClick={handleShare} style={{ flex: 2, padding: "13px", background: "var(--p, #f47c5a)", border: "none", borderRadius: 12, ...f, fontSize: 14, color: "white", cursor: "pointer", fontWeight: 600 }}>
            {copied ? "Copied ✓" : navigator.share ? "Share" : "Copy Text"}
          </button>
        </div>
      </div>
    </div>
  );
}
