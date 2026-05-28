import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";
import Auth from "./Auth";
import Settings from "./Settings";
import Onboarding from "./Onboarding";
import Landing from "./Landing";
import Trio from "./Trio";
import { PointsDashboard, Leaderboard, ShareStreak, MilestoneCelebration, MILESTONES, getStars, getLevel, getRank } from "./Badges";

// ─── QUOTES ───────────────────────────────────────────────────────────────────
const QUOTES = [
  "Be here. Right now. This moment is the only one that exists.",
  "You don't need more time. You need more presence.",
  "The morning belongs to you before it belongs to anyone else.",
  "Small rituals, practised daily, become the architecture of a beautiful life.",
  "What you do in your quiet moments defines everything else.",
  "Consistency is not a talent. It is a decision.",
  "One mindful minute is worth more than one distracted hour.",
  "Your body is listening to every thought you think.",
  "Peace is not found. It is practised.",
  "Do it gently. Do it consistently. Watch yourself transform.",
  "The most powerful thing you can do is show up for yourself.",
  "Discipline is the highest form of self-love.",
  "You are one routine away from a completely different life.",
  "Every morning is a fresh contract with yourself.",
  "Your habits are your biography.",
];

// ─── MORNING L1 ──────────────────────────────────────────────────────────────
const MORNING_L1 = [
  { id: "m1",  name: "Smile Before Opening Eyes",       desc: "Before your eyes open, smile. Hold it for 10 seconds. Signal joy to your entire nervous system." },
  { id: "m2",  name: "5 Gratitudes",                    desc: "Say: Thank you for another blessed day. I have 24 hours to live, love, celebrate life. I am enjoying every minute today. I love myself, my spouse, my kids, my parents, my siblings and I express my love to all of them. I do all my activities with excitement and energy." },
  { id: "m3",  name: "Head Scalp Massage & Tie Hair",   desc: "Dry scalp massage for 30 seconds to stimulate circulation and wake up the nervous system. Then tie your hair intentionally." },
  { id: "m4",  name: "Make Your Bed",                   desc: "Make your bed the moment you get up. One act of order that sets the tone for the entire day." },
  { id: "m5",  name: "Oral Care",                       desc: "5-step or 3-step oral care — oil pulling, brush, floss, tongue scraper, gargle. Complete, consistent, intentional." },
  { id: "m6",  name: "Face Wash with Ear & Neck Massage", desc: "Wash your face with presence. Follow with gentle ear massage and neck massage to release overnight tension." },
  { id: "m7",  name: "Lymph Drainage + UU AA OO + Neck", desc: "Gentle lymphatic drainage strokes. Sound UUU AAA OOO with full body stretches. Finish with a slow neck roll." },
  { id: "m8",  name: "Change Outfit",                   desc: "Change out of sleepwear. This single act signals to your mind and body: the day has officially begun." },
  { id: "m9",  name: "2 Glasses of Water in Malasana",  desc: "Drink 2 glasses of warm water while seated in Malasana. Hydrate and gently activate digestion." },
  { id: "m10", name: "Divine Time",                     desc: "Light the lamp, burn 1 incense stick, play divine chanting. Sit in silence for one minute." },
];

// ─── MORNING L2 ──────────────────────────────────────────────────────────────
const MORNING_L2 = [
  { id: "ml2_1", name: "3 Min Pranayama",          desc: "3 minutes of conscious breathwork." },
  { id: "ml2_2", name: "5 Min Stretches",          desc: "5 minutes of intentional full-body stretching." },
  { id: "ml2_3", name: "5 Min Meditation",         desc: "5 minutes of silent or guided meditation." },
  { id: "ml2_4", name: "Read & Write Intention",   desc: "5 minutes of reading followed by writing one clear intention for the day." },
];

// ─── NIGHT L1 ─────────────────────────────────────────────────────────────────
const NIGHT_L1 = [
  { id: "n1",  name: "6PM Dinner",                 desc: "Eat dinner by 6PM. Give your body time to digest before rest." },
  { id: "n2",  name: "6PM Divine Time",            desc: "Light the lamp at 6PM. A moment of stillness before the evening begins." },
  { id: "n3",  name: "Wind Up Kitchen",            desc: "Clean the kitchen, soak nuts, prep what is to be cooked tomorrow." },
  { id: "n4",  name: "Foot Soak & Wash",           desc: "Soak feet in warm water. Clean, dry, and oil each foot." },
  { id: "n5",  name: "Face Wash + Coconut Oil",    desc: "Wash your face. Apply warm coconut oil to eyebrows, navel, and anal area." },
  { id: "n6",  name: "Oral Care",                  desc: "Evening oral care routine — brush, floss, gargle." },
  { id: "n7",  name: "To-Do Task List",            desc: "Write 3–5 clear priorities for tomorrow. Empty your mind onto paper." },
  { id: "n8",  name: "Head Massage & Untie Hair",  desc: "Slow, loving head massage. Untie your hair. Release the weight of the day." },
  { id: "n9",  name: "Say 5 Gratitudes",           desc: "Name 5 things you are grateful for today." },
  { id: "n10", name: "Smile After Closing Eyes",   desc: "Close your eyes. Smile. End exactly as you began — in joy." },
];

// ─── NIGHT L2 ─────────────────────────────────────────────────────────────────
const NIGHT_L2 = [
  { id: "nl2_1", name: "Family Circle",            desc: "Gather with family for 5 minutes. Connect with the people who matter most." },
  { id: "nl2_2", name: "Read 5 Minutes",           desc: "Read for 5 minutes. End the day with knowledge, not a screen." },
  { id: "nl2_3", name: "Visualise the Next Day",   desc: "Close your eyes and see tomorrow clearly." },
  { id: "nl2_4", name: "8PM Phone Outside Bedroom",desc: "Place your phone outside the bedroom by 8PM." },
];

// ─── TRIO MODULES ─────────────────────────────────────────────────────────────
const TRIO_MODULES = [
  { id: "declutter", icon: "◇", name: "Decluttering", tagline: "Clear the outside. Clear the inside.", desc: "A structured programme to declutter your home, digital life, and mind.", tasks: ["Identify one area to declutter today", "Remove 5 items you no longer need", "Clean and reset your workspace", "Digital declutter — clear inbox or phone", "Donate or discard completed items"] },
  { id: "mindfulness", icon: "○", name: "Mindfulness Exercises", tagline: "Presence is the greatest gift.", desc: "Daily mindfulness practices that train your attention and reduce stress.", tasks: ["5-minute mindful breathing", "Body scan — head to toe awareness", "Mindful eating — one meal without screens", "Gratitude pause — 3 things right now", "Single-tasking — one thing at a time"] },
  { id: "knowwhat", icon: "△", name: "Know What You Want", tagline: "Clarity precedes achievement.", desc: "A guided journey to discover your true desires and align your daily actions.", tasks: ["Write your 1-year vision", "Identify your top 3 values", "Define what success means to you", "Map your ideal day in detail", "Write your personal mission statement"] },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function toDay(d) { return d.toISOString().split("T")[0]; }
function todayStr() { return toDay(new Date()); }
function getLast7() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); return toDay(d);
  });
}
function getLast10Weeks() {
  return Array.from({ length: 10 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const dt = new Date(); dt.setDate(dt.getDate() - (9 - w) * 7 - (6 - d)); return toDay(dt);
    })
  );
}
function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}

// ─── THEME (PEACH + WHITE) ────────────────────────────────────────────────────
const T = {
  peach:      "#f47c5a",
  peachLight: "#fde8de",
  peachMid:   "#f9b89a",
  peachDark:  "#c85a38",
  teal:       "#2d6e6e",
  tealLight:  "#e8f4f4",
  white:      "#ffffff",
  offWhite:   "#fdf8f6",
  bg:         "#fdf8f6",
  card:       "#ffffff",
  border:     "#f5ddd4",
  text:       "#2d1f1a",
  muted:      "#8a6a60",
  dark:       "#1a0f0a",
};

const f = { fontFamily: "'Inter', sans-serif" };

function Label({ children, style = {} }) {
  return <p style={{ ...f, fontSize: 11, fontWeight: 600, color: T.peachDark, letterSpacing: 1.5, textTransform: "uppercase", margin: "22px 0 10px", ...style }}>{children}</p>;
}

// ─── TASK ROW ─────────────────────────────────────────────────────────────────
function TaskRow({ task, index, date, allLogs, onToggle }) {
  const [open, setOpen] = useState(false);
  const done = (allLogs[date] || []).includes(task.id);
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        display: "flex", alignItems: "flex-start", padding: "14px 16px", borderRadius: 14,
        background: done ? T.peachLight : T.white,
        border: `1.5px solid ${done ? T.peach : T.border}`,
        transition: "all 0.2s",
      }}>
        <div onClick={() => onToggle(task.id, date)} style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginTop: 1,
          background: done ? T.peach : "transparent",
          border: `2px solid ${done ? T.peach : T.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontSize: 14, cursor: "pointer", transition: "all 0.2s", marginRight: 12,
        }}>{done ? "✓" : ""}</div>
        <div style={{ flex: 1 }} onClick={() => setOpen(!open)}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ ...f, fontSize: 14, fontWeight: 500, color: T.text }}>
              <span style={{ color: T.peach, marginRight: 8, fontSize: 11, fontWeight: 700 }}>{String(index + 1).padStart(2, "0")}</span>
              {task.name}
            </p>
            <span style={{ fontSize: 11, color: T.muted, marginLeft: 8, cursor: "pointer" }}>{open ? "▲" : "▼"}</span>
          </div>
          {open && <p style={{ ...f, fontSize: 13, color: T.muted, marginTop: 8, lineHeight: 1.7 }}>{task.desc}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null);
  const [appReady, setAppReady] = useState(false);
  const [tab, setTab] = useState("home");
  const [subTab, setSubTab] = useState("morning");
  const [allLogs, setAllLogs] = useState({});      // { "2025-04-01": ["m1","m2",...] }
  const [waterHistory, setWaterHistory] = useState({}); // { "2025-04-01": 3 }
  const [points, setPoints] = useState(0);
  const [water, setWaterRaw] = useState(0);
  const [saving, setSaving] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [userLevel, setUserLevel] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [authMode, setAuthMode] = useState("signup");
  const [darkMode, setDarkMode] = useState(() => load("mia_dark", false));
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [newMilestone, setNewMilestone] = useState(null);
  const [prevPoints, setPrevPoints] = useState(0);
  const [trioModule, setTrioModule] = useState(null);
  const [showTrio, setShowTrio] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [dataError, setDataError] = useState(null);

  const today = todayStr();
  const last7 = getLast7();
  const weeks = getLast10Weeks();
  const quote = QUOTES[new Date().getDate() % QUOTES.length];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const currentMorningTasks = userLevel >= 2 ? [...MORNING_L1, ...MORNING_L2] : MORNING_L1;
  const currentNightTasks = userLevel >= 2 ? [...NIGHT_L1, ...NIGHT_L2] : NIGHT_L1;
  const allTasks = [...currentMorningTasks, ...currentNightTasks];

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAppReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "SIGNED_OUT") {
        setSession(null); setAllLogs({}); setWaterHistory({});
        setPoints(0); setUserLevel(1); setProfileId(null);
      } else if (s) {
        setSession(s);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) { loadUserData(); loadLeaderboard(); }
  }, [session]);

  useEffect(() => {
    try { localStorage.setItem("mia_dark", JSON.stringify(darkMode)); } catch {}
  }, [darkMode]);

  // Milestone detection
  useEffect(() => {
    if (points > prevPoints && prevPoints >= 0) {
      const hit = MILESTONES.slice().reverse().find(m => m.points && points >= m.points && prevPoints < m.points);
      if (hit) setNewMilestone(hit);
    }
    setPrevPoints(points);
  }, [points]);

  // ── Load User Data ────────────────────────────────────────────────────────
  const loadUserData = async () => {
    try {
      const uid = session.user.id;
      const userName = session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Member";

      // 1. Load or create profile
      let { data: profile, error: profileError } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", uid)
        .single();

      if (profileError && profileError.code === "PGRST116") {
        // No profile yet — create one
        const { data: newProfile, error: createError } = await supabase
          .from("habits")
          .insert({ user_id: uid, display_name: userName, points: 0, level: 1 })
          .select()
          .single();

        if (createError) {
          setDataError("Could not create profile: " + createError.message);
          return;
        }
        profile = newProfile;
        const seen = load("mia_onboarded_v3", false);
        if (!seen) setShowOnboarding(true);
      } else if (profileError) {
        setDataError("Profile error: " + profileError.message);
        return;
      }

      if (profile) {
        setProfileId(profile.id);
        setPoints(profile.points || 0);
        setUserLevel(profile.level || 1);
        // Update display name if changed
        if (profile.display_name !== userName) {
          await supabase.from("habits").update({ display_name: userName }).eq("user_id", uid);
        }
      }

      // 2. Load last 90 days of daily logs
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const { data: dailyData, error: logsError } = await supabase
        .from("daily_logs")
        .select("log_date, completed_tasks, water")
        .eq("user_id", uid)
        .gte("log_date", toDay(ninetyDaysAgo))
        .order("log_date", { ascending: false });

      if (logsError) {
        setDataError("Logs error: " + logsError.message);
        return;
      }

      const logsMap = {};
      const waterMap = {};
      if (dailyData) {
        dailyData.forEach(row => {
          logsMap[row.log_date] = Array.isArray(row.completed_tasks) ? row.completed_tasks : [];
          waterMap[row.log_date] = row.water || 0;
        });
      }
      // Merge with any local data saved during offline/slow periods
      const localLogs = load("mia_logs_" + uid, {});
      const localWater = load("mia_water_" + uid, {});
      const mergedLogs = { ...localLogs, ...logsMap };
      const mergedWater = { ...localWater, ...waterMap };
      setAllLogs(mergedLogs);
      setWaterHistory(mergedWater);
      setWaterRaw(mergedWater[today] || 0);
      // Save to local as backup
      try { localStorage.setItem("mia_logs_" + uid, JSON.stringify(mergedLogs)); } catch {}
      try { localStorage.setItem("mia_water_" + uid, JSON.stringify(mergedWater)); } catch {}
      setDataError(null);

    } catch (err) {
      setDataError("Unexpected error: " + err.message);
    }
  };

  // ── Load Leaderboard (real user names) ────────────────────────────────────
  const loadLeaderboard = async () => {
    const { data, error } = await supabase
      .from("habits")
      .select("user_id, display_name, points, level")
      .order("points", { ascending: false })
      .limit(50);

    if (!error && data) {
      const entries = data.map(r => ({
        id: r.user_id,
        name: r.display_name || "Member",
        points: r.points || 0,
        level: r.level || 1,
        isMe: r.user_id === session?.user?.id,
      }));
      setLeaderboard(entries);
    }
  };

  // ── Save to Supabase ──────────────────────────────────────────────────────
  const persistToSupabase = useCallback(async (logsMap, newWater, newPoints, newLevel) => {
    if (!session) return;
    const uid = session.user.id;
    setSaving(true);
    setDataError(null);

    const todayTasks = logsMap[today] || [];

    // Upsert daily log for today
    const { error: logErr } = await supabase
      .from("daily_logs")
      .upsert(
        { user_id: uid, log_date: today, completed_tasks: todayTasks, water: newWater, updated_at: new Date().toISOString() },
        { onConflict: "user_id,log_date" }
      );

    if (logErr) {
      console.error("daily_logs upsert failed:", logErr);
      setDataError("Save failed — " + logErr.message);
      setSaving(false);
      return;
    }

    // Update profile points and level
    const { error: profileErr } = await supabase
      .from("habits")
      .update({ points: newPoints, level: newLevel, updated_at: new Date().toISOString() })
      .eq("user_id", uid);

    if (profileErr) {
      console.error("habits update failed:", profileErr);
      setDataError("Profile save failed — " + profileErr.message);
    }

    setSaving(false);
  }, [session, today]);

  // ── Toggle Task ───────────────────────────────────────────────────────────
  const toggle = (taskId, date) => {
    const dayTasks = allLogs[date] || [];
    const wasOn = dayTasks.includes(taskId);
    const newDayTasks = wasOn ? dayTasks.filter(t => t !== taskId) : [...dayTasks, taskId];
    const newLogsMap = { ...allLogs, [date]: newDayTasks };

    // Calculate total points from ALL logged days
    const totalPoints = Object.values(newLogsMap).reduce((sum, tasks) => sum + (Array.isArray(tasks) ? tasks.length : 0), 0);
    const newLevel = getLevel(totalPoints);

    setAllLogs(newLogsMap);
    setPoints(totalPoints);
    setUserLevel(newLevel);
    // Save locally as backup in case Supabase is slow
    if (session) {
      try { localStorage.setItem("mia_logs_" + session.user.id, JSON.stringify(newLogsMap)); } catch {}
    }
    persistToSupabase(newLogsMap, water, totalPoints, newLevel);
  };

  // ── Set Water ─────────────────────────────────────────────────────────────
  const handleSetWater = (n) => {
    const nw = water === n ? n - 1 : n;
    setWaterRaw(nw);
    setWaterHistory(prev => ({ ...prev, [today]: nw }));
    persistToSupabase(allLogs, nw, points, userLevel);
  };

  // ── Computed ──────────────────────────────────────────────────────────────
  const isDone = (taskId, date) => (allLogs[date] || []).includes(taskId);
  const morningDone = currentMorningTasks.filter(t => isDone(t.id, today)).length;
  const nightDone = currentNightTasks.filter(t => isDone(t.id, today)).length;
  const totalDone = morningDone + nightDone;
  const overallPct = allTasks.length ? Math.round(totalDone / allTasks.length * 100) : 0;
  const morningPct = currentMorningTasks.length ? Math.round(morningDone / currentMorningTasks.length * 100) : 0;
  const nightPct = currentNightTasks.length ? Math.round(nightDone / currentNightTasks.length * 100) : 0;
  const stars = getStars(points);
  const rank = getRank(points);
  const userName = session?.user?.user_metadata?.full_name?.split(" ")[0] || session?.user?.email?.split("@")[0] || "there";

  // ── Loading ───────────────────────────────────────────────────────────────
  if (!appReady) return (
    <div style={{ minHeight: "100vh", background: T.dark, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ width: 56, height: 56, background: T.peach, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ ...f, fontSize: 22, fontWeight: 800, color: "white" }}>M</span>
      </div>
      <p style={{ ...f, fontSize: 16, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Loading...</p>
    </div>
  );

  // ── Auth gates ────────────────────────────────────────────────────────────
  if (!session) {
    if (showLanding) return <Landing onGetStarted={(mode) => { setAuthMode(mode); setShowLanding(false); }} />;
    return <Auth defaultMode={authMode} />;
  }

  if (showOnboarding) return (
    <Onboarding onComplete={() => {
      try { localStorage.setItem("mia_onboarded_v3", JSON.stringify(true)); } catch {}
      setShowOnboarding(false);
    }} />
  );

  if (showTrio) return <Trio session={session} onBack={() => { setShowTrio(false); setTab("home"); }} />;

  if (showSettings) return (
    <Settings session={session} onClose={() => { setShowSettings(false); loadLeaderboard(); }}
      darkMode={darkMode} setDarkMode={setDarkMode}
      stats={{ level: userLevel, points, stars }} />
  );

  if (trioModule) return (
    <div style={{ minHeight: "100vh", background: T.bg, maxWidth: 430, margin: "0 auto", padding: "52px 22px 40px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <button onClick={() => setTrioModule(null)} style={{ background: T.peachLight, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 16px", ...f, fontSize: 13, color: T.peachDark, cursor: "pointer", marginBottom: 24, fontWeight: 600 }}>← Back</button>
      <div style={{ background: T.peach, borderRadius: 20, padding: "24px 22px", marginBottom: 24 }}>
        <p style={{ fontSize: 32, color: "rgba(255,255,255,0.8)", marginBottom: 12 }}>{trioModule.icon}</p>
        <p style={{ ...f, fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>TRIO Module</p>
        <h2 style={{ ...f, fontSize: 26, fontWeight: 700, color: "white", marginBottom: 8 }}>{trioModule.name}</h2>
        <p style={{ ...f, fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>{trioModule.desc}</p>
      </div>
      <Label>Today's Practices</Label>
      {trioModule.tasks.map((task, i) => (
        <div key={i} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: T.peachLight, border: `1px solid ${T.peach}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ ...f, fontSize: 11, color: T.peachDark, fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}</span>
          </div>
          <p style={{ ...f, fontSize: 14, fontWeight: 500, color: T.text }}>{task}</p>
        </div>
      ))}
    </div>
  );

  // ── Tab Bar ───────────────────────────────────────────────────────────────
  const TabBar = () => (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      background: "rgba(253,248,246,0.97)", backdropFilter: "blur(16px)",
      borderTop: `1px solid ${T.border}`,
      display: "flex", justifyContent: "space-around",
      padding: "8px 0 calc(8px + env(safe-area-inset-bottom))", zIndex: 100,
    }}>
      {[
        { id: "home",     icon: "⌂",  label: "Home" },
        { id: "routines", icon: "◆",  label: "Routines" },
        { id: "progress", icon: "▣",  label: "Progress" },
        { id: "ranks",    icon: "★",  label: "Ranks" },
        { id: "trio",     icon: "◇",  label: "TRIO" },
      ].map(({ id, icon, label }) => (
        <button key={id} onClick={() => { if (id === "trio") { setShowTrio(true); } else { setTab(id); } }} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          padding: "2px 10px", WebkitTapHighlightColor: "transparent",
        }}>
          <span style={{ fontSize: (id === "trio" ? showTrio : tab === id) ? 19 : 17, color: (id === "trio" ? showTrio : tab === id) ? T.peach : T.muted, transition: "all 0.2s" }}>{icon}</span>
          <span style={{ ...f, fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: (id === "trio" ? showTrio : tab === id) ? T.peach : T.muted, fontWeight: (id === "trio" ? showTrio : tab === id) ? 700 : 400 }}>{label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: T.bg, maxWidth: 430, margin: "0 auto", paddingBottom: 90 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.bg}; -webkit-font-smoothing: antialiased; }
        input:focus { outline: none; }
        button { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: ${T.peachMid}; border-radius: 3px; }
      `}</style>

      {/* Error banner */}
      {dataError && (
        <div style={{ background: "#fff0f0", border: `1px solid #ffc0c0`, padding: "10px 16px", textAlign: "center" }}>
          <p style={{ ...f, fontSize: 12, color: "#cc3333" }}>⚠ {dataError}</p>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ HOME */}
      {tab === "home" && (
        <div>
          {/* Header */}
          <div style={{ background: T.peach, padding: "48px 24px 28px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, background: "rgba(255,255,255,0.1)", borderRadius: "50%" }} />
            <button onClick={() => setShowSettings(true)} style={{ position: "absolute", top: 16, right: 20, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: "white" }}>⚙</button>
            {saving && <p style={{ position: "absolute", top: 20, left: 20, ...f, fontSize: 10, color: "rgba(255,255,255,0.7)" }}>saving...</p>}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <p style={{ ...f, fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>{greeting}</p>
                <h1 style={{ ...f, fontSize: 28, fontWeight: 800, color: "white", marginBottom: 4 }}>{userName}</h1>
                <p style={{ ...f, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
                <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "5px 12px" }}>
                    <span style={{ ...f, fontSize: 12, color: "white", fontWeight: 600 }}>{rank.icon} {rank.label}</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "5px 12px" }}>
                    <span style={{ ...f, fontSize: 12, color: "white", fontWeight: 600 }}>Level {userLevel}</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "5px 12px" }}>
                    <span style={{ ...f, fontSize: 12, color: "white", fontWeight: 600 }}>{points.toLocaleString()} pts</span>
                  </div>
                </div>
              </div>
              <svg width="72" height="72" style={{ flexShrink: 0, marginTop: 4 }}>
                <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
                <circle cx="36" cy="36" r="28" fill="none" stroke="white" strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 28}`} strokeDashoffset={`${2 * Math.PI * 28 * (1 - overallPct / 100)}`}
                  strokeLinecap="round" transform="rotate(-90 36 36)" style={{ transition: "stroke-dashoffset 0.6s" }} />
                <text x="36" y="41" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="14" fill="white" fontWeight="700">{overallPct}%</text>
              </svg>
            </div>
          </div>

          <div style={{ padding: "0 22px" }}>
            {/* Quote */}
            <div style={{ background: T.peachLight, border: `1px solid ${T.border}`, borderRadius: 16, padding: "18px 20px", marginTop: 20 }}>
              <p style={{ ...f, fontSize: 11, color: T.peach, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Daily Reflection</p>
              <p style={{ ...f, fontSize: 15, color: T.text, lineHeight: 1.7, fontStyle: "italic" }}>"{quote}"</p>
            </div>

            {/* Today's progress */}
            <Label>Today's Progress</Label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[["Morning", morningPct, morningDone, currentMorningTasks.length, "morning"], ["Night", nightPct, nightDone, currentNightTasks.length, "night"]].map(([label, pct, done, total, st]) => (
                <div key={label} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, padding: "16px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <p style={{ ...f, fontSize: 12, fontWeight: 600, color: T.text }}>{label}</p>
                    <p style={{ ...f, fontSize: 18, fontWeight: 800, color: T.peach }}>{pct}%</p>
                  </div>
                  <div style={{ height: 5, background: T.peachLight, borderRadius: 10, overflow: "hidden", marginBottom: 6 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: T.peach, borderRadius: 10, transition: "width 0.5s" }} />
                  </div>
                  <p style={{ ...f, fontSize: 11, color: T.muted }}>{done}/{total} tasks</p>
                  <p onClick={() => { setTab("routines"); setSubTab(st); }} style={{ ...f, fontSize: 11, color: T.peach, marginTop: 8, cursor: "pointer", fontWeight: 600 }}>Open →</p>
                </div>
              ))}
            </div>

            {/* Points banner */}
            <div style={{ background: T.peach, borderRadius: 16, padding: "18px 20px", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <p style={{ ...f, fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4, fontWeight: 600 }}>Today</p>
                  <p style={{ ...f, fontSize: 28, fontWeight: 800, color: "white" }}>{totalDone} <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", fontWeight: 400 }}>tasks done</span></p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ ...f, fontSize: 26, fontWeight: 800, color: "white" }}>{points.toLocaleString()}</p>
                  <p style={{ ...f, fontSize: 11, color: "rgba(255,255,255,0.6)" }}>total points</p>
                </div>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(points % 1000) / 10}%`, background: "white", borderRadius: 10, transition: "width 0.5s" }} />
              </div>
              <p style={{ ...f, fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>{1000 - (points % 1000)} pts to next ★ star</p>
            </div>

            {/* Water */}
            <Label>Water Intake</Label>
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, padding: "16px 16px 14px", marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} onClick={() => handleSetWater(i + 1)} style={{
                    width: 36, height: 36, borderRadius: 10, cursor: "pointer",
                    background: i < water ? T.peach : T.peachLight,
                    border: `1.5px solid ${i < water ? T.peach : T.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "all 0.2s",
                  }}>💧</div>
                ))}
              </div>
              <div style={{ height: 5, background: T.peachLight, borderRadius: 10, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ height: "100%", width: `${water / 8 * 100}%`, background: T.peach, borderRadius: 10, transition: "width 0.4s" }} />
              </div>
              <p style={{ ...f, fontSize: 12, color: T.muted }}>{water} of 8 glasses · {water * 250}ml</p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ ROUTINES */}
      {tab === "routines" && (
        <div style={{ padding: "44px 22px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ ...f, fontSize: 24, fontWeight: 800, color: T.text }}>Routines</h2>
            <div style={{ background: T.peach, borderRadius: 10, padding: "5px 12px" }}>
              <span style={{ ...f, fontSize: 12, color: "white", fontWeight: 700 }}>Level {userLevel}</span>
            </div>
          </div>
          <div style={{ display: "flex", background: T.peachLight, borderRadius: 14, padding: 3, marginBottom: 22 }}>
            {[["morning", "☀ Morning"], ["night", "☽ Night"]].map(([id, label]) => (
              <button key={id} onClick={() => setSubTab(id)} style={{
                flex: 1, padding: "10px", border: "none", borderRadius: 11, cursor: "pointer",
                background: subTab === id ? T.peach : "transparent",
                ...f, fontSize: 13, color: subTab === id ? "white" : T.muted,
                fontWeight: subTab === id ? 700 : 400, transition: "all 0.2s",
              }}>{label}</button>
            ))}
          </div>

          {["morning", "night"].map(rt => rt === subTab && (
            <div key={rt}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <p style={{ ...f, fontSize: 13, fontWeight: 600, color: T.text }}>Level 1 — {rt === "morning" ? MORNING_L1.length : NIGHT_L1.length} tasks</p>
                <p style={{ ...f, fontSize: 15, color: T.peach, fontWeight: 800 }}>{rt === "morning" ? morningPct : nightPct}%</p>
              </div>
              <div style={{ height: 4, background: T.peachLight, borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ height: "100%", width: `${rt === "morning" ? morningPct : nightPct}%`, background: T.peach, borderRadius: 10 }} />
              </div>
              {(rt === "morning" ? MORNING_L1 : NIGHT_L1).map((task, i) => (
                <TaskRow key={task.id} task={task} index={i} date={today} allLogs={allLogs} onToggle={toggle} />
              ))}
              {userLevel >= 2 && (
                <>
                  <div style={{ margin: "20px 0 12px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1, height: 1, background: T.border }} />
                    <p style={{ ...f, fontSize: 11, color: T.peach, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Level 2</p>
                    <div style={{ flex: 1, height: 1, background: T.border }} />
                  </div>
                  {(rt === "morning" ? MORNING_L2 : NIGHT_L2).map((task, i) => (
                    <TaskRow key={task.id} task={task} index={i + (rt === "morning" ? MORNING_L1.length : NIGHT_L1.length)} date={today} allLogs={allLogs} onToggle={toggle} />
                  ))}
                </>
              )}
              {userLevel < 2 && (
                <div style={{ background: T.peachLight, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px", marginTop: 16, textAlign: "center" }}>
                  <p style={{ ...f, fontSize: 13, fontWeight: 700, color: T.peachDark, marginBottom: 4 }}>🔒 Level 2 — Locked</p>
                  <p style={{ ...f, fontSize: 12, color: T.muted }}>Reach 1,000 points to unlock</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ PROGRESS */}
      {tab === "progress" && (
        <div style={{ padding: "44px 22px 0" }}>
          <h2 style={{ ...f, fontSize: 24, fontWeight: 800, color: T.text, marginBottom: 4 }}>Progress</h2>
          <p style={{ ...f, fontSize: 13, color: T.muted, marginBottom: 20 }}>90-day habit heatmap</p>

          <div style={{ display: "flex", background: T.peachLight, borderRadius: 14, padding: 3, marginBottom: 22 }}>
            {[["morning", "☀ Morning"], ["night", "☽ Night"]].map(([id, label]) => (
              <button key={id} onClick={() => setSubTab(id)} style={{
                flex: 1, padding: "10px", border: "none", borderRadius: 11, cursor: "pointer",
                background: subTab === id ? T.peach : "transparent",
                ...f, fontSize: 13, color: subTab === id ? "white" : T.muted, fontWeight: subTab === id ? 700 : 400,
              }}>{label}</button>
            ))}
          </div>

          {(subTab === "morning" ? currentMorningTasks : currentNightTasks).map((task, i) => {
            const wPct = Math.round(last7.filter(d => isDone(task.id, d)).length / 7 * 100);
            return (
              <div key={task.id} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <p style={{ ...f, fontSize: 12, fontWeight: 600, color: T.text }}>
                    <span style={{ color: T.peach, marginRight: 6, fontSize: 11, fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}</span>{task.name}
                  </p>
                  <p style={{ ...f, fontSize: 11, color: T.peach, fontWeight: 700 }}>{wPct}%</p>
                </div>
                <div style={{ display: "flex", gap: 3 }}>
                  {weeks.map((week, wi) => (
                    <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {week.map((day, di) => (
                        <div key={di} onClick={() => toggle(task.id, day)} style={{
                          width: 10, height: 10, borderRadius: 3, cursor: "pointer",
                          background: isDone(task.id, day) ? T.peach : T.peachLight,
                          border: `1px solid ${isDone(task.id, day) ? T.peachDark : T.border}`,
                          transition: "all 0.15s",
                        }} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* 7-day bars */}
          <Label>Daily completion — last 7 days</Label>
          <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, padding: "18px 16px 14px", marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
              {last7.map((d, i) => {
                const cnt = allTasks.filter(t => isDone(t.id, d)).length;
                const barH = allTasks.length > 0 ? Math.max(Math.round(cnt / allTasks.length * 72), 3) : 3;
                const isT = d === today;
                const days = ["M","T","W","T","F","S","S"];
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: "100%", height: barH, borderRadius: 4, background: isT ? T.peach : T.peachLight, transition: "height 0.5s" }} />
                    <p style={{ ...f, fontSize: 9, color: isT ? T.peach : T.muted }}>{days[new Date(d).getDay() === 0 ? 6 : new Date(d).getDay() - 1]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ RANKS */}
      {tab === "ranks" && (
        <div style={{ padding: "44px 22px 0" }}>
          <h2 style={{ ...f, fontSize: 24, fontWeight: 800, color: T.text, marginBottom: 4 }}>Ranks & Awards</h2>
          <p style={{ ...f, fontSize: 13, color: T.muted, marginBottom: 20 }}>Points · Stars · Live leaderboard</p>
          <PointsDashboard points={points} rank={rank} theme={T} />
          <button onClick={() => setShowShare(true)} style={{ width: "100%", padding: "14px", background: T.peach, border: "none", borderRadius: 14, ...f, fontSize: 14, color: "white", cursor: "pointer", fontWeight: 700, marginBottom: 24 }}>Share My Progress</button>
          <Label>Live Leaderboard</Label>
          <Leaderboard entries={leaderboard} currentUserId={session?.user?.id} theme={T} />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ TRIO */}
      {tab === "trio" && (
        <div style={{ padding: "44px 22px 0" }}>
          {/* TRIO hero card */}
          <div style={{ background: T.peach, borderRadius: 20, padding: "28px 24px", marginBottom: 20 }}>
            <p style={{ ...f, fontSize: 10, color: "rgba(255,255,255,0.65)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Private Programme</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, fontStyle: "italic", fontWeight: 300, color: "white", marginBottom: 8, lineHeight: 1.1 }}>TRIO</h2>
            <p style={{ ...f, fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 20 }}>
              Six months · Three modules · 25 weeks each.<br/>
              Decluttering · Mindfulness · Know What You Want.
            </p>
            <button onClick={() => setShowTrio(true)} style={{
              background: "white", border: "none", borderRadius: 12,
              padding: "13px 24px", ...f, fontSize: 14, fontWeight: 800,
              color: T.peach, cursor: "pointer", letterSpacing: 0.5,
            }}>Enter TRIO →</button>
          </div>

          {/* Module previews */}
          {[
            { icon: "◇", name: "Decluttering", desc: "Clear the outside. Clear the inside." },
            { icon: "○", name: "Mindfulness",  desc: "Presence is the greatest gift." },
            { icon: "△", name: "Know What You Want", desc: "Clarity precedes everything." },
          ].map((mod, i) => (
            <div key={mod.name} onClick={() => setShowTrio(true)} style={{
              background: T.white, border: `1px solid ${T.border}`, borderRadius: 16,
              padding: "16px 18px", marginBottom: 10, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: T.peachLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 20, color: T.peach }}>{mod.icon}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ ...f, fontSize: 15, fontWeight: 700, color: T.text }}>{mod.name}</p>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontStyle: "italic", color: T.muted }}>{mod.desc}</p>
              </div>
              <span style={{ color: T.muted }}>›</span>
            </div>
          ))}

          <p style={{ ...f, fontSize: 12, color: T.muted, textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
            Access restricted to invited participants.<br/>
            Contact kookwithkanch@gmail.com for access.
          </p>
        </div>
      )}

      {newMilestone && <MilestoneCelebration milestone={newMilestone} onClose={() => setNewMilestone(null)} />}
      {showShare && <ShareStreak points={points} userName={userName} onClose={() => setShowShare(false)} />}
      <TabBar />
    </div>
  );
}
