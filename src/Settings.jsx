import { useState } from "react";
import { supabase } from "./supabase";

const f = { fontFamily: "'Inter', sans-serif" };

const T = {
  peach:      "#f47c5a",
  peachLight: "#fde8de",
  peachDark:  "#c85a38",
  white:      "#ffffff",
  offWhite:   "#fdf8f6",
  bg:         "#fdf8f6",
  border:     "#f5ddd4",
  text:       "#2d1f1a",
  muted:      "#8a6a60",
};

export default function Settings({ session, onClose, darkMode, setDarkMode, stats }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split("@")[0] || "Member";
  const email = session?.user?.email || "";
  const { level = 1, points = 0, stars = 0 } = stats || {};

  const handleSignOut = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    setLoggingOut(false);
    onClose();
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, maxWidth: 430, margin: "0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.bg}; -webkit-font-smoothing: antialiased; }
        button { -webkit-tap-highlight-color: transparent; }
      `}</style>

      {/* Header */}
      <div style={{ background: T.peach, padding: "48px 24px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 160, height: 160, background: "rgba(255,255,255,0.1)", borderRadius: "50%" }} />
        <button
          onClick={onClose}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "7px 14px", ...f, fontSize: 13, color: "white", cursor: "pointer", marginBottom: 20, fontWeight: 600 }}
        >
          ← Back
        </button>
        <h1 style={{ ...f, fontSize: 28, fontWeight: 800, color: "white", marginBottom: 4 }}>Settings</h1>
        <p style={{ ...f, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Account & preferences</p>
      </div>

      <div style={{ padding: "24px 22px 60px" }}>

        {/* Profile */}
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 18, padding: "20px", marginBottom: 14 }}>
          <p style={{ ...f, fontSize: 11, fontWeight: 700, color: T.peachDark, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Profile</p>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: T.peachLight, border: `1.5px solid ${T.peach}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ ...f, fontSize: 20, fontWeight: 800, color: T.peach }}>{userName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p style={{ ...f, fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 2 }}>{userName}</p>
              <p style={{ ...f, fontSize: 13, color: T.muted }}>{email}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 18, padding: "20px", marginBottom: 14 }}>
          <p style={{ ...f, fontSize: 11, fontWeight: 700, color: T.peachDark, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Your Progress</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Level", value: level },
              { label: "Points", value: points.toLocaleString() },
              { label: "Stars", value: `★ ${stars}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: T.offWhite, borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
                <p style={{ ...f, fontSize: 18, fontWeight: 800, color: T.peach, marginBottom: 3 }}>{value}</p>
                <p style={{ ...f, fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 18, padding: "20px", marginBottom: 14 }}>
          <p style={{ ...f, fontSize: 11, fontWeight: 700, color: T.peachDark, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Preferences</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
            <div>
              <p style={{ ...f, fontSize: 14, fontWeight: 600, color: T.text }}>Dark Mode</p>
              <p style={{ ...f, fontSize: 12, color: T.muted }}>Coming soon</p>
            </div>
            <div
              onClick={() => setDarkMode && setDarkMode(!darkMode)}
              style={{ width: 44, height: 26, borderRadius: 13, background: darkMode ? T.peach : T.border, cursor: "pointer", position: "relative", transition: "background 0.2s" }}
            >
              <div style={{ position: "absolute", top: 3, left: darkMode ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
            <div>
              <p style={{ ...f, fontSize: 14, fontWeight: 600, color: T.text }}>Notifications</p>
              <p style={{ ...f, fontSize: 12, color: T.muted }}>Coming soon</p>
            </div>
            <div style={{ width: 44, height: 26, borderRadius: 13, background: T.border, position: "relative" }}>
              <div style={{ position: "absolute", top: 3, left: 3, width: 20, height: 20, borderRadius: "50%", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
            </div>
          </div>
        </div>

        {/* About */}
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 18, padding: "20px", marginBottom: 20 }}>
          <p style={{ ...f, fontSize: 11, fontWeight: 700, color: T.peachDark, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>About</p>
          {[
            ["App", "MIA — Me In Action"],
            ["Website", "meinaction.com"],
            ["Contact", "kookwithkanch@gmail.com"],
            ["Version", "1.0.0"],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${T.border}` }}>
              <p style={{ ...f, fontSize: 13, color: T.muted }}>{label}</p>
              <p style={{ ...f, fontSize: 13, fontWeight: 500, color: T.text }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Sign out */}
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            style={{ width: "100%", padding: "15px", background: T.white, border: `1.5px solid #f5c0b0`, borderRadius: 14, ...f, fontSize: 15, fontWeight: 600, color: T.peachDark, cursor: "pointer" }}
          >
            Sign Out
          </button>
        ) : (
          <div style={{ background: T.white, border: `1.5px solid #f5c0b0`, borderRadius: 14, padding: "18px 20px" }}>
            <p style={{ ...f, fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 6 }}>Sign out of MIA?</p>
            <p style={{ ...f, fontSize: 13, color: T.muted, marginBottom: 16 }}>Your progress is saved and will be here when you return.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{ flex: 1, padding: "12px", background: T.offWhite, border: `1px solid ${T.border}`, borderRadius: 10, ...f, fontSize: 14, fontWeight: 600, color: T.muted, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                disabled={loggingOut}
                style={{ flex: 1, padding: "12px", background: T.peachDark, border: "none", borderRadius: 10, ...f, fontSize: 14, fontWeight: 600, color: "white", cursor: loggingOut ? "not-allowed" : "pointer", opacity: loggingOut ? 0.7 : 1 }}
              >
                {loggingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
