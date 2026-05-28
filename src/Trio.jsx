import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

// ─── TRIO ACCESS LIST ──────────────────────────────────────────────────────────
const TRIO_EMAILS = [
  "doraclotilda@gmail.com",
  "kavee30@gmail.com",
  "priyadharshini4gv@gmail.com",
  "nagatcemca@gmail.com",
  "kgeethanaidu@gmail.com",
  "kookwithkanch@gmail.com", // admin
];
const ADMIN_EMAIL = "kookwithkanch@gmail.com";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  peach:      "#f47c5a",
  peachLight: "#fde8de",
  peachMid:   "#f9b89a",
  peachDark:  "#c85a38",
  white:      "#ffffff",
  bg:         "#fdf8f6",
  card:       "#ffffff",
  border:     "#f5ddd4",
  text:       "#2d1f1a",
  muted:      "#8a6a60",
  dark:       "#2d1f1a",
};

const f = { fontFamily: "'Inter', sans-serif" };

// ─── PLACEHOLDER WEEK TASKS ───────────────────────────────────────────────────
// Each week has 3–5 tasks. You can replace these with real content anytime.
function getWeekTasks(moduleId, week) {
  const base = {
    declutter: [
      { id: "t1", text: "Identify one area in your home that feels heavy or stuck" },
      { id: "t2", text: "Remove 5 items you no longer need, use, or love" },
      { id: "t3", text: "Journal: What does this space say about my inner world?" },
      { id: "t4", text: "Take a before photo of the space you are working on" },
    ],
    mindfulness: [
      { id: "t1", text: "5-minute morning breath awareness — just observe, do not control" },
      { id: "t2", text: "Single-tasking practice — complete one task with full attention today" },
      { id: "t3", text: "Journal: Where did my mind go today? What was I resisting?" },
      { id: "t4", text: "Evening body scan — 3 minutes head to toe before sleep" },
    ],
    knowwhat: [
      { id: "t1", text: "Write freely for 10 minutes: What do I truly want from my life?" },
      { id: "t2", text: "Identify one belief that has been limiting you" },
      { id: "t3", text: "Journal: What would I do if I knew I could not fail?" },
      { id: "t4", text: "Write 3 values that feel most essential to who you are" },
    ],
  };

  // Week 0 is intro week
  if (week === 0) {
    return [
      { id: "t1", text: "Read the TRIO welcome letter fully and sit with it" },
      { id: "t2", text: "Buy your journal — this is your Life Book for 6 months" },
      { id: "t3", text: "Write your intention: Why am I here? What do I want to change?" },
      { id: "t4", text: "Register on meinaction.com and explore the app" },
    ];
  }

  const tasks = base[moduleId] || base.declutter;
  // Rotate tasks slightly each week to give variation
  return tasks.map((t, i) => ({
    ...t,
    id: `t${i + 1}`,
    text: week <= 8
      ? t.text
      : week <= 16
      ? `[Week ${week}] ${t.text}`
      : `[Advanced · Week ${week}] ${t.text}`,
  }));
}

const MODULES = [
  {
    id: "declutter",
    name: "Decluttering",
    tagline: "Clear the outside. Clear the inside.",
    icon: "◇",
    desc: "We investigate the physical, digital, and mental clutter around us. Every object we release creates space for something new to arrive.",
    color: "#f47c5a",
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    tagline: "Presence is the greatest gift.",
    icon: "○",
    desc: "Daily practices that train your attention, soften your reactions, and bring you back to the only moment that exists — this one.",
    color: "#e06840",
  },
  {
    id: "knowwhat",
    name: "Know What You Want",
    tagline: "Clarity precedes everything.",
    icon: "△",
    desc: "A guided investigation into your desires, values, and vision. When you know what you want, the how begins to appear.",
    color: "#c85a38",
  },
];

// ─── MAIN TRIO COMPONENT ──────────────────────────────────────────────────────
export default function Trio({ session, onBack }) {
  const [hasAccess, setHasAccess] = useState(null); // null=checking, true, false
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [activeWeek, setActiveWeek] = useState(null);
  const [progress, setProgress] = useState({}); // { "declutter_0_t1": true, ... }
  const [uploads, setUploads] = useState({}); // { "declutter_0": [...files] }
  const [uploading, setUploading] = useState(false);
  const [view, setView] = useState("modules"); // modules | weeks | week-detail
  const fileRef = useRef();

  const userEmail = session?.user?.email?.toLowerCase();

  // ── Check access ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userEmail) { setHasAccess(false); return; }
    const allowed = TRIO_EMAILS.map(e => e.toLowerCase());
    const access = allowed.includes(userEmail);
    setHasAccess(access);
    setIsAdmin(userEmail === ADMIN_EMAIL.toLowerCase());
    if (access) { loadProgress(); loadUploads(); }
  }, [userEmail]);

  // ── Load progress ─────────────────────────────────────────────────────────
  const loadProgress = async () => {
    const { data, error } = await supabase
      .from("trio_progress")
      .select("module_id, week_number, task_id, completed")
      .eq("user_id", session.user.id);

    if (!error && data) {
      const map = {};
      data.forEach(r => {
        if (r.completed) map[`${r.module_id}_${r.week_number}_${r.task_id}`] = true;
      });
      setProgress(map);
    }
  };

  // ── Load uploads ──────────────────────────────────────────────────────────
  const loadUploads = async () => {
    const { data, error } = await supabase
      .from("trio_uploads")
      .select("module_id, week_number, file_name, caption, uploaded_at, file_path")
      .eq("user_id", session.user.id)
      .order("uploaded_at", { ascending: false });

    if (!error && data) {
      const map = {};
      data.forEach(r => {
        const key = `${r.module_id}_${r.week_number}`;
        if (!map[key]) map[key] = [];
        map[key].push(r);
      });
      setUploads(map);
    }
  };

  // ── Toggle task ───────────────────────────────────────────────────────────
  const toggleTask = async (moduleId, week, taskId) => {
    const key = `${moduleId}_${week}_${taskId}`;
    const wasOn = !!progress[key];
    const newProgress = { ...progress, [key]: !wasOn };
    setProgress(newProgress);

    await supabase.from("trio_progress").upsert({
      user_id: session.user.id,
      module_id: moduleId,
      week_number: week,
      task_id: taskId,
      completed: !wasOn,
      completed_at: !wasOn ? new Date().toISOString() : null,
    }, { onConflict: "user_id,module_id,week_number,task_id" });
  };

  // ── Upload photo ──────────────────────────────────────────────────────────
  const handleUpload = async (e) => {
    if (!activeModule || activeWeek === null) return;
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const fileName = `${session.user.id}/${activeModule.id}/week-${activeWeek}/${Date.now()}-${file.name}`;

    // Try Supabase Storage (bucket must exist)
    const { error: storageErr } = await supabase.storage
      .from("trio-uploads")
      .upload(fileName, file, { upsert: false });

    if (storageErr) {
      // Storage bucket may not exist — save metadata only
      console.warn("Storage error:", storageErr.message, "— saving metadata only");
    }

    // Save upload record regardless
    await supabase.from("trio_uploads").insert({
      user_id: session.user.id,
      module_id: activeModule.id,
      week_number: activeWeek,
      file_path: storageErr ? "pending" : fileName,
      file_name: file.name,
      caption: "",
    });

    await loadUploads();
    setUploading(false);
  };

  // ── Week unlock logic ─────────────────────────────────────────────────────
  const isWeekUnlocked = (moduleId, week) => {
    if (week === 0) return true;
    const prevTasks = getWeekTasks(moduleId, week - 1);
    const allDone = prevTasks.every(t => !!progress[`${moduleId}_${week - 1}_${t.id}`]);
    return allDone;
  };

  const weekProgress = (moduleId, week) => {
    const tasks = getWeekTasks(moduleId, week);
    const done = tasks.filter(t => !!progress[`${moduleId}_${week}_${t.id}`]).length;
    return { done, total: tasks.length, pct: Math.round(done / tasks.length * 100) };
  };

  const moduleProgress = (moduleId) => {
    let totalDone = 0, totalTasks = 0;
    for (let w = 0; w <= 24; w++) {
      const tasks = getWeekTasks(moduleId, w);
      totalTasks += tasks.length;
      totalDone += tasks.filter(t => !!progress[`${moduleId}_${w}_${t.id}`]).length;
    }
    return { done: totalDone, total: totalTasks, pct: Math.round(totalDone / totalTasks * 100) };
  };

  // ── Render: access denied ─────────────────────────────────────────────────
  if (hasAccess === null) return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ ...f, color: T.muted }}>Checking access...</p>
    </div>
  );

  if (hasAccess === false) return (
    <div style={{ minHeight: "100vh", background: T.bg, maxWidth: 430, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: T.peachLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>◇</div>
      <h2 style={{ ...f, fontSize: 22, fontWeight: 800, color: T.text, marginBottom: 10 }}>TRIO is a Private Programme</h2>
      <p style={{ ...f, fontSize: 14, color: T.muted, lineHeight: 1.7, marginBottom: 24 }}>
        Access to TRIO is by invitation only. If you believe you should have access, please contact <strong>kookwithkanch@gmail.com</strong>.
      </p>
      <button onClick={onBack} style={{ background: T.peach, border: "none", borderRadius: 14, padding: "13px 28px", ...f, fontSize: 14, color: "white", cursor: "pointer", fontWeight: 700 }}>← Back to MIA</button>
    </div>
  );

  // ── Render: module list ───────────────────────────────────────────────────
  if (view === "modules") return (
    <div style={{ minHeight: "100vh", background: T.bg, maxWidth: 430, margin: "0 auto" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Inter:wght@300;400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}input:focus{outline:none;}::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:${T.peachMid};border-radius:3px;}`}</style>

      {/* Header */}
      <div style={{ background: T.peach, padding: "48px 24px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "7px 14px", ...f, fontSize: 12, color: "white", cursor: "pointer", marginBottom: 20, fontWeight: 600 }}>← MIA</button>
        <p style={{ ...f, fontSize: 10, color: "rgba(255,255,255,0.65)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Private Programme</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontStyle: "italic", fontWeight: 300, color: "white", lineHeight: 1.1, marginBottom: 8 }}>TRIO</h1>
        <p style={{ ...f, fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>Six months · Three modules · 25 weeks each</p>
        {isAdmin && (
          <div style={{ marginTop: 12, background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "6px 14px", display: "inline-block" }}>
            <p style={{ ...f, fontSize: 11, color: "white", fontWeight: 700, letterSpacing: 1 }}>◆ ADMIN VIEW</p>
          </div>
        )}
      </div>

      <div style={{ padding: "24px 22px 90px" }}>
        {/* Overall progress */}
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, padding: "16px 18px", marginBottom: 22 }}>
          <p style={{ ...f, fontSize: 11, fontWeight: 700, color: T.peachDark, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Overall Progress</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {MODULES.map(mod => {
              const mp = moduleProgress(mod.id);
              return (
                <div key={mod.id} style={{ textAlign: "center" }}>
                  <p style={{ ...f, fontSize: 18, fontWeight: 800, color: T.peach, marginBottom: 3 }}>{mp.pct}%</p>
                  <div style={{ height: 4, background: T.peachLight, borderRadius: 10, overflow: "hidden", marginBottom: 4 }}>
                    <div style={{ height: "100%", width: `${mp.pct}%`, background: T.peach, borderRadius: 10 }} />
                  </div>
                  <p style={{ ...f, fontSize: 9, color: T.muted, letterSpacing: 1, textTransform: "uppercase" }}>{mod.name}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module cards */}
        {MODULES.map((mod, mi) => {
          const mp = moduleProgress(mod.id);
          const nextUnlocked = Array.from({ length: 25 }, (_, w) => w).find(w => isWeekUnlocked(mod.id, w) && weekProgress(mod.id, w).done < weekProgress(mod.id, w).total);
          return (
            <div key={mod.id} onClick={() => { setActiveModule(mod); setView("weeks"); }} style={{
              background: T.white, border: `1px solid ${T.border}`, borderRadius: 20,
              marginBottom: 14, cursor: "pointer", overflow: "hidden",
            }}>
              <div style={{ background: mod.color, padding: "20px 20px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ ...f, fontSize: 10, color: "rgba(255,255,255,0.65)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>Module {mi + 1}</p>
                    <h3 style={{ ...f, fontSize: 22, fontWeight: 800, color: "white", marginBottom: 4 }}>{mod.name}</h3>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontStyle: "italic", color: "rgba(255,255,255,0.75)" }}>{mod.tagline}</p>
                  </div>
                  <div style={{ fontSize: 28, color: "rgba(255,255,255,0.4)" }}>{mod.icon}</div>
                </div>
              </div>
              <div style={{ padding: "16px 20px" }}>
                <p style={{ ...f, fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 12 }}>{mod.desc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <p style={{ ...f, fontSize: 12, color: T.text, fontWeight: 600 }}>{mp.done}/{mp.total} tasks · {mp.pct}% complete</p>
                  {nextUnlocked !== undefined && (
                    <p style={{ ...f, fontSize: 11, color: T.peach, fontWeight: 700 }}>Week {nextUnlocked} active →</p>
                  )}
                </div>
                <div style={{ height: 5, background: T.peachLight, borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${mp.pct}%`, background: mod.color, borderRadius: 10, transition: "width 0.5s" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── Render: week list ─────────────────────────────────────────────────────
  if (view === "weeks" && activeModule) return (
    <div style={{ minHeight: "100vh", background: T.bg, maxWidth: 430, margin: "0 auto" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Inter:wght@300;400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>

      <div style={{ background: activeModule.color, padding: "48px 24px 28px" }}>
        <button onClick={() => setView("modules")} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "7px 14px", ...f, fontSize: 12, color: "white", cursor: "pointer", marginBottom: 20, fontWeight: 600 }}>← Modules</button>
        <p style={{ ...f, fontSize: 10, color: "rgba(255,255,255,0.65)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>TRIO · {activeModule.name}</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontStyle: "italic", fontWeight: 300, color: "white", lineHeight: 1.1, marginBottom: 6 }}>{activeModule.name}</h1>
        <p style={{ ...f, fontSize: 12, color: "rgba(255,255,255,0.65)" }}>Week 0 → Week 24 · complete each week to unlock the next</p>
      </div>

      <div style={{ padding: "20px 22px 90px" }}>
        {Array.from({ length: 25 }, (_, w) => {
          const unlocked = isWeekUnlocked(activeModule.id, w);
          const wp = weekProgress(activeModule.id, w);
          const completed = wp.done === wp.total;
          const weekUploads = uploads[`${activeModule.id}_${w}`] || [];

          return (
            <div key={w} onClick={() => { if (!unlocked) return; setActiveWeek(w); setView("week-detail"); }} style={{
              background: completed ? T.peachLight : T.white,
              border: `1.5px solid ${completed ? T.peach : unlocked ? T.border : "#f0e8e4"}`,
              borderRadius: 14, padding: "14px 16px", marginBottom: 8,
              cursor: unlocked ? "pointer" : "not-allowed",
              opacity: unlocked ? 1 : 0.45,
              display: "flex", alignItems: "center", gap: 14,
            }}>
              {/* Week number */}
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: completed ? T.peach : unlocked ? T.peachLight : "#f0e8e4",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${completed ? T.peachDark : T.border}`,
              }}>
                {completed
                  ? <span style={{ color: "white", fontSize: 16 }}>✓</span>
                  : unlocked
                  ? <span style={{ ...f, fontSize: 12, fontWeight: 800, color: T.peach }}>W{w}</span>
                  : <span style={{ fontSize: 14 }}>🔒</span>
                }
              </div>

              {/* Week info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ ...f, fontSize: 14, fontWeight: 700, color: T.text }}>
                    {w === 0 ? "Week 0 — Introduction" : `Week ${w}`}
                  </p>
                  <p style={{ ...f, fontSize: 11, color: T.peach, fontWeight: 700 }}>{wp.done}/{wp.total}</p>
                </div>
                {unlocked && (
                  <>
                    <div style={{ height: 3, background: "#f5ddd4", borderRadius: 10, overflow: "hidden", marginTop: 6 }}>
                      <div style={{ height: "100%", width: `${wp.pct}%`, background: T.peach, borderRadius: 10 }} />
                    </div>
                    {weekUploads.length > 0 && (
                      <p style={{ ...f, fontSize: 10, color: T.muted, marginTop: 4 }}>📎 {weekUploads.length} photo{weekUploads.length > 1 ? "s" : ""} uploaded</p>
                    )}
                  </>
                )}
              </div>
              {unlocked && <span style={{ color: T.muted, fontSize: 14 }}>›</span>}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── Render: week detail ───────────────────────────────────────────────────
  if (view === "week-detail" && activeModule && activeWeek !== null) {
    const tasks = getWeekTasks(activeModule.id, activeWeek);
    const wp = weekProgress(activeModule.id, activeWeek);
    const weekUploads = uploads[`${activeModule.id}_${activeWeek}`] || [];

    return (
      <div style={{ minHeight: "100vh", background: T.bg, maxWidth: 430, margin: "0 auto", paddingBottom: 40 }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Inter:wght@300;400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}input:focus{outline:none;}`}</style>

        {/* Header */}
        <div style={{ background: activeModule.color, padding: "48px 24px 28px" }}>
          <button onClick={() => setView("weeks")} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "7px 14px", ...f, fontSize: 12, color: "white", cursor: "pointer", marginBottom: 20, fontWeight: 600 }}>← Weeks</button>
          <p style={{ ...f, fontSize: 10, color: "rgba(255,255,255,0.65)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>{activeModule.name}</p>
          <h1 style={{ ...f, fontSize: 28, fontWeight: 800, color: "white", marginBottom: 4 }}>
            {activeWeek === 0 ? "Week 0 — Introduction" : `Week ${activeWeek}`}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
            <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${wp.pct}%`, background: "white", borderRadius: 10, transition: "width 0.4s" }} />
            </div>
            <p style={{ ...f, fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 700, flexShrink: 0 }}>{wp.done}/{wp.total}</p>
          </div>
        </div>

        <div style={{ padding: "22px 22px 0" }}>

          {/* Tasks */}
          <p style={{ ...f, fontSize: 11, fontWeight: 700, color: T.peachDark, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>This Week's Tasks</p>
          {tasks.map((task, i) => {
            const key = `${activeModule.id}_${activeWeek}_${task.id}`;
            const done = !!progress[key];
            return (
              <div key={task.id} onClick={() => toggleTask(activeModule.id, activeWeek, task.id)} style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                background: done ? T.peachLight : T.white,
                border: `1.5px solid ${done ? T.peach : T.border}`,
                borderRadius: 14, padding: "14px 16px", marginBottom: 8, cursor: "pointer",
                transition: "all 0.2s",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: done ? T.peach : "transparent",
                  border: `2px solid ${done ? T.peach : T.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontSize: 14, transition: "all 0.2s",
                }}>{done ? "✓" : ""}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ ...f, fontSize: 11, color: T.peach, fontWeight: 700, marginBottom: 3 }}>Task {i + 1}</p>
                  <p style={{ ...f, fontSize: 14, fontWeight: 500, color: T.text, lineHeight: 1.6 }}>{task.text}</p>
                </div>
              </div>
            );
          })}

          {/* Completion banner */}
          {wp.done === wp.total && (
            <div style={{ background: T.peach, borderRadius: 16, padding: "18px 20px", marginBottom: 20, textAlign: "center" }}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontStyle: "italic", color: "white", marginBottom: 4 }}>Week {activeWeek} complete ✦</p>
              <p style={{ ...f, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
                {activeWeek < 24 ? `Week ${activeWeek + 1} is now unlocked` : "You have completed this module!"}
              </p>
            </div>
          )}

          {/* Photo uploads */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <p style={{ ...f, fontSize: 11, fontWeight: 700, color: T.peachDark, letterSpacing: 1.5, textTransform: "uppercase" }}>Homework Photos</p>
              <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
                background: T.peach, border: "none", borderRadius: 10, padding: "7px 14px",
                ...f, fontSize: 12, color: "white", cursor: uploading ? "not-allowed" : "pointer",
                fontWeight: 700, opacity: uploading ? 0.6 : 1,
              }}>{uploading ? "Uploading..." : "+ Upload"}</button>
            </div>
            <input ref={fileRef} type="file" accept="image/*,video/*,.pdf" onChange={handleUpload} style={{ display: "none" }} />

            {weekUploads.length === 0 ? (
              <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, padding: "24px", textAlign: "center" }}>
                <p style={{ ...f, fontSize: 13, color: T.muted, lineHeight: 1.7 }}>No uploads yet for this week.<br/>Tap Upload to share your homework photo.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {weekUploads.map((upload, i) => (
                  <div key={i} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px", position: "relative" }}>
                    <div style={{ background: T.peachLight, borderRadius: 8, height: 80, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, fontSize: 28 }}>📎</div>
                    <p style={{ ...f, fontSize: 11, color: T.text, fontWeight: 600, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{upload.file_name}</p>
                    <p style={{ ...f, fontSize: 10, color: T.muted }}>{new Date(upload.uploaded_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Journal prompt */}
          <div style={{ background: T.peachLight, border: `1px solid ${T.border}`, borderRadius: 16, padding: "18px 20px", marginTop: 20 }}>
            <p style={{ ...f, fontSize: 11, fontWeight: 700, color: T.peachDark, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>This Week's Journal Prompt</p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontStyle: "italic", color: T.text, lineHeight: 1.7 }}>
              {activeWeek === 0
                ? '"Why am I here? What do I want to change in the next six months?"'
                : `"What did Week ${activeWeek} reveal about me that I did not see before?"`
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
