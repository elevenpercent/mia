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

export default function Auth({ defaultMode = "login" }) {
  const [mode, setMode] = useState(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const reset = () => { setError(""); setSuccess(""); };

  const handleSubmit = async () => {
    reset();
    if (mode === "forgot") {
      if (!email) { setError("Please enter your email"); return; }
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/?reset=true",
      });
      setLoading(false);
      if (error) setError(error.message);
      else setSuccess("Reset link sent — check your email ✓");
      return;
    }
    if (!email || !password) { setError("Please fill in all fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
        if (error) throw error;
        setSuccess("Account created! Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", maxWidth: 430, margin: "0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.bg}; -webkit-font-smoothing: antialiased; }
        input:focus { outline: none; border-color: ${T.peach} !important; }
        button { -webkit-tap-highlight-color: transparent; }
      `}</style>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ width: 56, height: 56, background: T.peach, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <span style={{ ...f, fontSize: 22, fontWeight: 800, color: "white" }}>M</span>
        </div>
        <h1 style={{ ...f, fontSize: 26, fontWeight: 800, color: T.text, letterSpacing: 2, marginBottom: 4 }}>MIA</h1>
        <p style={{ ...f, fontSize: 11, color: T.muted, letterSpacing: 3, textTransform: "uppercase" }}>Me In Action</p>
      </div>

      <div style={{ width: "100%", background: T.white, borderRadius: 20, padding: "28px 24px", border: `1px solid ${T.border}` }}>
        <h2 style={{ ...f, fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 4 }}>
          {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Reset Password"}
        </h2>
        <p style={{ ...f, fontSize: 13, color: T.muted, marginBottom: 22 }}>
          {mode === "login" ? "Welcome back" : mode === "signup" ? "Begin your journey" : "We'll send you a reset link"}
        </p>

        {/* Mode toggle */}
        {mode !== "forgot" && (
          <div style={{ display: "flex", background: T.offWhite, borderRadius: 12, padding: 4, marginBottom: 22, border: `1px solid ${T.border}` }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); reset(); }} style={{
                flex: 1, padding: "9px", border: "none", borderRadius: 9, cursor: "pointer",
                background: mode === m ? T.peach : "transparent",
                ...f, fontSize: 13, color: mode === m ? "white" : T.muted,
                fontWeight: mode === m ? 700 : 400, transition: "all 0.2s",
              }}>{m === "login" ? "Sign In" : "Sign Up"}</button>
            ))}
          </div>
        )}

        {/* Name field */}
        {mode === "signup" && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ ...f, fontSize: 11, fontWeight: 600, color: T.text, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Full Name</p>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              style={{ width: "100%", background: T.offWhite, border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "13px 16px", ...f, fontSize: 15, color: T.text }}
            />
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <p style={{ ...f, fontSize: 11, fontWeight: 600, color: T.text, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Email</p>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: "100%", background: T.offWhite, border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "13px 16px", ...f, fontSize: 15, color: T.text }}
          />
        </div>

        {/* Password */}
        {mode !== "forgot" && (
          <div style={{ marginBottom: mode === "login" ? 8 : 22 }}>
            <p style={{ ...f, fontSize: 11, fontWeight: 600, color: T.text, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Password</p>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{ width: "100%", background: T.offWhite, border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "13px 16px", ...f, fontSize: 15, color: T.text }}
            />
          </div>
        )}

        {/* Forgot password link */}
        {mode === "login" && (
          <p
            onClick={() => { setMode("forgot"); reset(); }}
            style={{ ...f, fontSize: 12, color: T.peach, textAlign: "right", marginBottom: 18, cursor: "pointer", fontWeight: 600 }}
          >
            Forgot password?
          </p>
        )}

        {/* Error / success */}
        {error && (
          <div style={{ background: "#fff0f0", border: "1px solid #ffc8c8", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
            <p style={{ ...f, fontSize: 13, color: "#cc3333" }}>{error}</p>
          </div>
        )}
        {success && (
          <div style={{ background: T.peachLight, border: `1px solid ${T.peach}`, borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
            <p style={{ ...f, fontSize: 13, color: T.peachDark }}>{success}</p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", padding: "15px", border: "none", borderRadius: 14,
            cursor: loading ? "not-allowed" : "pointer",
            background: loading ? "#f9b89a" : T.peach,
            ...f, fontSize: 15, fontWeight: 700, color: "white", transition: "all 0.2s", letterSpacing: 0.3,
          }}
        >
          {loading ? "Please wait..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
        </button>

        {mode === "forgot" && (
          <p
            onClick={() => { setMode("login"); reset(); }}
            style={{ ...f, fontSize: 13, color: T.muted, textAlign: "center", marginTop: 16, cursor: "pointer" }}
          >
            ← Back to sign in
          </p>
        )}
      </div>

      <p style={{ ...f, fontSize: 11, color: T.muted, marginTop: 20, textAlign: "center" }}>
        meinaction.com · Your data is private and secure
      </p>
    </div>
  );
}
