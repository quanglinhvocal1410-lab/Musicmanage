import { useState, useEffect, useRef } from "react";
import {
  Home, Users, Calendar as CalIcon, Wallet, Settings, ChevronLeft, ChevronRight,
  Music2, Sparkles, Plus, Search, Eye, EyeOff, LogOut, GraduationCap, Target,
  FolderPlus, CheckCircle2, Circle, TrendingUp, Bell, Clock, Star, X, Save,
  ExternalLink, Link2, User, Mic2, Play, BookOpen, Youtube, Mic, Square, Trash2, Upload,
  Menu, PanelLeftClose, CheckSquare
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

/* ============================ RESPONSIVE ============================ */
function useIsMobile(bp = 768) {
  const [m, setM] = useState(typeof window !== "undefined" ? window.innerWidth < bp : true);
  useEffect(() => {
    const h = () => setM(window.innerWidth < bp);
    window.addEventListener("resize", h); return () => window.removeEventListener("resize", h);
  }, [bp]);
  return m;
}

/* ============================ THEME ============================ */
const T = {
  bg: "#051A0E", bg2: "#07150E", panel: "#0B2016", card: "#113625", cardHi: "#16452F",
  line: "rgba(163,177,138,.14)", line2: "rgba(163,177,138,.24)",
  gold: "#C5A059", goldSoft: "#A8894A", goldDeep: "#6E5A32",
  ink: "#F9FBF9", sub: "#A3B18A", tx3: "rgba(163,177,138,.55)",
  good: "#34d399", warn: "#C5A059", bad: "#E5686A", accent: "#34d399",
  r: 14, rSm: 10
};
const RANKS = { A: "#34d399", B: "#C5A059", C: "#A3B18A", D: "#E5686A" };
const CLASSES = ["TN11", "TN12", "TN13", "TNN"];
const GIONG = ["Soprano", "Mezzo", "Alto", "Tenor", "Baritone", "Bass"];
const KPI_CRIT = ["Cao độ", "Hơi thở", "Khẩu hình", "Tiết tấu", "Cảm xúc", "Thuộc bài"];
const avgOf = (kpi) => KPI_CRIT.reduce((a, k) => a + (kpi?.[k] === 1 ? 1 : 0), 0);
function sessionRank(v) {
  if (!v) return { t: "Chưa đánh giá", c: T.sub };
  if (v >= 6) return { t: "Xuất sắc", c: T.good };
  if (v >= 4) return { t: "Tốt", c: T.good };
  if (v >= 2) return { t: "Khá", c: T.gold };
  return { t: "Cần cải thiện", c: T.warn };
}
const fmtDMY = (iso) => { if (!iso) return ""; const d = new Date(iso); return isNaN(d) ? iso : `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`; };

/* ============================ STORAGE ============================ */
async function loadDB() {
  try {
    if (typeof window !== "undefined" && window.storage) {
      const r = await window.storage.get("mds_db");
      return r ? JSON.parse(r.value) : null;
    }
  } catch (e) {}
  return null;
}
async function saveDB(db) {
  try {
    if (typeof window !== "undefined" && window.storage)
      await window.storage.set("mds_db", JSON.stringify(db));
  } catch (e) {}
}

/* ============================ SEED ============================ */
const uid = () => Math.random().toString(36).slice(2, 9);
function seed() {
  const tA = { id: uid(), ten: "Cô Mai", gmail: "mai.gv@gmail.com", taiKhoan: "mai", matKhau: "", chuyenMon: "Thanh nhạc", lichTrong: "T2-T6 chiều" };
  const tB = { id: uid(), ten: "Thầy Long", gmail: "long.gv@gmail.com", taiKhoan: "long", matKhau: "", chuyenMon: "Piano", lichTrong: "T3-T7 sáng" };
  const mkS = (o) => ({
    id: uid(), matKhau: "", rankNote: "", driveFolder: "", sessions: [], lichHen: [], sdt: o.sdt || "",
    noteCaoBanDau: o.noteCaoBanDau || "", noteThapBanDau: o.noteThapBanDau || "", ...o,
  });
  return {
    admin: { taiKhoan: "admin", matKhau: "admin", ten: "Quang Linh" },
    settings: { geminiKey: "", ratePerSession: 250000, driveRoot: "My Drive / Tiệm Dạy Nhạc", classesCreated: [] },
    teachers: [tA, tB],
    baiTap: [
      { id: uid(), ten: "Rung môi (Lip trill)", loai: "Luyện thanh", moTa: "Khởi động 5 phút, rung môi theo thang âm đi lên C3–C5.", link: "", rank: "" },
      { id: uid(), ten: "Messa di voce", loai: "Luyện thanh", moTa: "Ngân một nốt: to dần rồi nhỏ dần, giữ hơi đều.", link: "", rank: "B" },
      { id: uid(), ten: "Staccato quãng 5", loai: "Kỹ thuật", moTa: "Bật âm nhẹ và gọn theo mẫu 1-3-5-3-1.", link: "", rank: "" },
      { id: uid(), ten: "Luyện passaggio", loai: "Kỹ thuật", moTa: "Chuyển giọng mượt qua vùng passaggio bằng nguyên âm 'i'.", link: "", rank: "A" },
      { id: uid(), ten: "Cảm âm quãng 3", loai: "Lý thuyết", moTa: "Nghe và lặp lại các quãng 3 trưởng/thứ để luyện tai.", link: "", rank: "" },
    ],
    students: [
      mkS({ ten: "Nguyễn An", namSinh: 2005, gmail: "an@gmail.com", taiKhoan: "an", mucTieu: "Hát nhạc trẻ tự tin", ngayBatDau: "2025-06-01", soBuoiDangKy: 12, ngayKhoaMoi: "2026-07-01", ngayHetHan: "2026-08-15", rank: "B", loaiGiong: "Tenor", passaggio: "E4–F#4", hocLop: "TN11", noteCaoBanDau: "G4", noteThapBanDau: "C3", teacherId: tA.id }),
      mkS({ ten: "Trần Bình", namSinh: 2008, gmail: "binh@gmail.com", taiKhoan: "binh", mucTieu: "Luyện quãng cao", ngayBatDau: "2025-09-01", soBuoiDangKy: 16, ngayKhoaMoi: "2026-06-20", ngayHetHan: "2026-08-05", rank: "C", loaiGiong: "Baritone", passaggio: "C4–D4", hocLop: "TN12", noteCaoBanDau: "E4", noteThapBanDau: "A2", teacherId: tA.id }),
      mkS({ ten: "Lê Chi", namSinh: 2003, gmail: "chi@gmail.com", taiKhoan: "chi", mucTieu: "Thi tuyển nhạc viện", ngayBatDau: "2025-03-10", soBuoiDangKy: 20, ngayKhoaMoi: "2026-07-10", ngayHetHan: "2026-09-01", rank: "A", loaiGiong: "Soprano", passaggio: "F#4–G4", hocLop: "TN13", noteCaoBanDau: "A4", noteThapBanDau: "F3", teacherId: tB.id }),
      mkS({ ten: "Phạm Duy", namSinh: 2010, gmail: "duy@gmail.com", taiKhoan: "duy", mucTieu: "Nền tảng cơ bản", ngayBatDau: "2026-05-01", soBuoiDangKy: 8, ngayKhoaMoi: "2026-05-01", ngayHetHan: "2026-08-02", rank: "D", loaiGiong: "Alto", passaggio: "A3–B3", hocLop: "TNN", noteCaoBanDau: "C4", noteThapBanDau: "G3", teacherId: tB.id }),
    ],
  };
}

/* ============================ HELPERS ============================ */
const daysTo = (d) => { if (!d) return null; return Math.ceil((new Date(d) - new Date()) / 86400000); };
const money = (n) => (n || 0).toLocaleString("vi-VN") + "đ";
function payState(s) {
  const d = daysTo(s.ngayHetHan);
  if (d === null) return { t: "—", c: T.sub, d };
  if (d < 0) return { t: "Quá hạn", c: T.bad, d };
  if (d <= 10) return { t: "Sắp hết hạn", c: T.warn, d };
  return { t: "Còn hạn", c: T.good, d };
}
function gcalUrl({ title, details, start, mins = 60 }) {
  const s = new Date(start), e = new Date(s.getTime() + mins * 60000);
  const f = (x) => x.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details || "")}&dates=${f(s)}/${f(e)}`;
}

/* ============================ AI ============================ */
async function callAI(prompt, key) {
  if (key) {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, responseMimeType: "application/json" },
      }),
    });
    const d = await r.json();
    if (d?.error) throw new Error(d.error.message || "Gemini error");
    return d?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 2000, messages: [{ role: "user", content: prompt }] }),
  });
  const d = await r.json();
  return (d.content || []).map((i) => i.text || "").join("\n");
}
function parseJSON(txt) {
  try { return JSON.parse(txt.replace(/```json|```/g, "").trim()); }
  catch (e) {
    const m = txt.match(/\{[\s\S]*\}/);
    if (m) { try { return JSON.parse(m[0]); } catch (_) {} }
    return null;
  }
}

/* ============================ MUSIC / YT / RECORD HELPERS ============================ */
function noteToMidi(s) {
  if (!s) return null;
  const m = String(s).trim().replace(/\s/g, "").match(/^([A-Ga-g])(#|b|B)?(-?\d+)$/);
  if (!m) return null;
  const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1].toUpperCase()];
  if (base == null) return null;
  const acc = m[2] === "#" ? 1 : (m[2] === "b" || m[2] === "B") ? -1 : 0;
  return base + acc + (parseInt(m[3], 10) + 1) * 12;
}
function transposeSuggest(songLow, songHigh, stuLow, stuHigh) {
  const sh = noteToMidi(songHigh), th = noteToMidi(stuHigh);
  if (sh == null || th == null) return null;
  const needLower = sh - th;
  if (needLower > 0) return { dir: "ha", n: needLower, t: `Hạ ${needLower} tone`, c: T.warn };
  const headroom = th - sh;
  if (headroom <= 1) return { dir: "ok", n: 0, t: "Phù hợp, không cần nâng/hạ", c: T.good };
  return { dir: "nang", n: headroom, t: `Có thể nâng ${headroom} tone`, c: T.accent };
}
function ytId(url) {
  const m = String(url || "").match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
async function ytTitle(url) {
  try {
    const r = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    if (r.ok) { const d = await r.json(); return d.title || null; }
  } catch (e) {}
  return null;
}
async function saveRec(id, dataUrl) { try { if (window.storage) await window.storage.set("rec_" + id, dataUrl); } catch (e) {} }
async function loadRec(id) { try { if (window.storage) { const r = await window.storage.get("rec_" + id); return r ? r.value : null; } } catch (e) {} return null; }
async function delRec(id) { try { if (window.storage) await window.storage.delete("rec_" + id); } catch (e) {} }
async function saveImg(id, dataUrl) { try { if (window.storage) await window.storage.set("img_" + id, dataUrl); } catch (e) {} }
async function loadImg(id) { try { if (window.storage) { const r = await window.storage.get("img_" + id); return r ? r.value : null; } } catch (e) {} return null; }
async function delImg(id) { try { if (window.storage) await window.storage.delete("img_" + id); } catch (e) {} }

/* ============================ UI PRIMITIVES ============================ */
const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: T.r, padding: 14, ...style }}>{children}</div>
);
const Btn = ({ children, onClick, kind = "solid", style, small }) => {
  const base = { border: "none", borderRadius: T.rSm, padding: small ? "8px 12px" : "10px 16px", fontWeight: 700, fontSize: small ? 13 : 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "inherit" };
  const kinds = {
    solid: { background: T.gold, color: "#0B2016" },
    ghost: { background: "transparent", color: T.gold, border: `1px solid ${T.goldSoft}` },
    dark: { background: T.cardHi, color: T.ink, border: `1px solid ${T.line2}` },
  };
  return <button onClick={onClick} style={{ ...base, ...kinds[kind], ...style }}>{children}</button>;
};
const Field = ({ label, value, onChange, type = "text", placeholder }) => (
  <label style={{ display: "block", marginBottom: 10 }}>
    <div style={{ fontSize: 11, color: T.sub, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
    <input type={type} value={value ?? ""} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "100%", boxSizing: "border-box", background: T.bg2, border: `1px solid ${T.line2}`, borderRadius: T.rSm, padding: "10px 12px", color: T.ink, fontSize: 14, fontFamily: "inherit" }} />
  </label>
);
const Pill = ({ children, c = T.gold }) => (
  <span style={{ fontSize: 11, fontWeight: 700, color: c, background: c + "1E", border: `1px solid ${c}44`, padding: "2px 9px", borderRadius: 999 }}>{children}</span>
);
const H = ({ children, style }) => (
  <div style={{ fontFamily: "'Playfair Display', serif", color: T.gold, fontWeight: 800, ...style }}>{children}</div>
);
const Empty = ({ icon, t }) => (
  <div style={{ textAlign: "center", padding: "34px 12px", color: T.sub }}>
    <div style={{ opacity: 0.5, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontSize: 13 }}>{t}</div>
  </div>
);
function Lightbox({ src, onClose }) {
  if (!src) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#000C", zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <img src={src} alt="" style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: T.r, border: `1px solid ${T.line2}` }} />
      <button onClick={onClose} style={{ position: "fixed", top: 16, right: 16, background: T.card, border: `1px solid ${T.line2}`, color: T.ink, borderRadius: 10, padding: 8, cursor: "pointer" }}><X size={20} /></button>
    </div>
  );
}
function NoteImage({ id, onOpen }) {
  const [src, setSrc] = useState(null);
  useEffect(() => { let on = true; loadImg(id).then((v) => { if (on) setSrc(v); }); return () => { on = false; }; }, [id]);
  if (!src) return <div style={{ width: 54, height: 54, borderRadius: 8, background: T.bg2, border: `1px solid ${T.line}` }} />;
  return <img src={src} alt="" onClick={() => onOpen(src)} style={{ width: 54, height: 54, objectFit: "cover", borderRadius: 8, border: `1px solid ${T.line2}`, cursor: "pointer" }} />;
}


/* ============================ APP ============================ */
const W_COLLAPSED = 64;
const W_EXPANDED = 260;

export default function App() {
  const [db, setDb] = useState(null);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("home");
  const [openStudent, setOpenStudent] = useState(null);
  const [toast, setToast] = useState("");
  const [sideOpen, setSideOpen] = useState(false);
  const first = useRef(true);
  const mobile = useIsMobile();

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:wght@700;800;900&display=swap";
    document.head.appendChild(l);
    (async () => { const d = await loadDB(); setDb(d || seed()); })();
  }, []);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (db) saveDB(db);
  }, [db]);
  useEffect(() => { if (mobile) setSideOpen(false); }, [tab]);
  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 1800); };

  if (!db) return <div style={{ background: T.bg, height: "100vh", display: "grid", placeItems: "center", color: T.gold, fontFamily: "'Be Vietnam Pro', sans-serif" }}>Đang tải…</div>;

  const rootS = { fontFamily: "'Be Vietnam Pro', sans-serif", background: T.bg, color: T.ink, minHeight: "100vh" };

  if (!user) return (
    <div style={rootS}>
      <div style={{ maxWidth: mobile ? 460 : 420, margin: "0 auto" }}>
        <Login db={db} setDb={setDb} onLogin={(u) => { setUser(u); setTab(u.role === "hv" ? "profile" : "home"); }} flash={flash} />
      </div>
      <Toast t={toast} />
    </div>
  );

  const me = user.role === "gv" ? db.teachers.find((x) => x.id === user.id)
    : user.role === "hv" ? db.students.find((x) => x.id === user.id)
      : db.admin;

  const navItems = {
    admin: [["home", "Tổng quan", Home], ["students", "Học viên", Users], ["cal", "Lịch", CalIcon], ["fin", "Tài chính", Wallet], ["set", "Cài đặt", Settings]],
    gv: [["home", "Tổng quan", Home], ["students", "Học viên", Users], ["cal", "Lịch", CalIcon]],
    hv: [["profile", "Hồ sơ", User], ["cal", "Lịch học", CalIcon], ["history", "Lịch sử", Clock], ["baitap", "Bài tập", BookOpen]],
  }[user.role];

  const content = (
    <>
      {openStudent ? (
        <StudentDetail db={db} setDb={setDb} sid={openStudent} back={() => setOpenStudent(null)} flash={flash} role={user.role} />
      ) : (
        <>
          {tab === "home" && user.role === "admin" && <AdminHome db={db} open={(id) => setOpenStudent(id)} go={setTab} />}
          {tab === "home" && user.role === "gv" && <GvHome db={db} me={me} open={(id) => setOpenStudent(id)} />}
          {tab === "profile" && user.role === "hv" && <HvProfile s={me} db={db} />}
          {tab === "history" && user.role === "hv" && (<div><H style={{ fontSize: 16, margin: "0 4px 12px" }}>Lịch sử buổi học</H><HistoryTab s={me} update={(patch) => setDb((d) => ({ ...d, students: d.students.map((x) => x.id === me.id ? { ...x, ...patch } : x) }))} flash={flash} /></div>)}
          {tab === "baitap" && user.role === "hv" && <ExerciseLibrary db={db} setDb={setDb} role="hv" flash={flash} s={me} />}
          {tab === "students" && <StudentList db={db} setDb={setDb} role={user.role} me={me} open={(id) => setOpenStudent(id)} flash={flash} />}
          {tab === "cal" && <Schedule db={db} setDb={setDb} user={user} me={me} flash={flash} />}
          {tab === "fin" && user.role === "admin" && <Finance db={db} setDb={setDb} flash={flash} />}
          {tab === "set" && user.role === "admin" && <SettingsView db={db} setDb={setDb} flash={flash} />}
        </>
      )}
    </>
  );

  const onLogout = () => { setUser(null); setTab("home"); setOpenStudent(null); setSideOpen(false); };
  const label = { admin: "Quản trị", gv: "Giảng viên", hv: "Học viên" }[user.role];

  return (
    <div style={rootS}>
      <Sidebar me={me} role={user.role} label={label} nav={navItems} tab={tab} setTab={setTab} onLogout={onLogout} open={sideOpen} setOpen={setSideOpen} mobile={mobile} />
      <div style={{ marginLeft: mobile ? 0 : W_COLLAPSED, transition: "margin-left .25s ease", minHeight: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: mobile ? "12px 14px" : "14px 28px", borderBottom: `1px solid ${T.line}`, background: T.bg, position: "sticky", top: 0, zIndex: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {mobile && <button onClick={() => setSideOpen(true)} style={{ background: "none", border: `1px solid ${T.line}`, borderRadius: T.rSm, padding: 7, color: T.sub, cursor: "pointer", display: "grid", placeItems: "center" }}><Menu size={19} /></button>}
            <div>
              <div style={{ fontSize: mobile ? 11 : 13, color: T.sub }}>Xin chào,</div>
              <H style={{ fontSize: mobile ? 17 : 20, lineHeight: 1.1 }}>{me?.ten}</H>
            </div>
          </div>
          <Pill>{label}</Pill>
        </div>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: mobile ? "12px 14px 28px" : "20px 28px 40px" }}>{content}</div>
      </div>
      <Toast t={toast} />
    </div>
  );
}

/* ============================ TOAST ============================ */
function Toast({ t }) {
  if (!t) return null;
  return <div style={{ position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)", background: T.gold, color: "#0B2016", padding: "10px 18px", borderRadius: 999, fontWeight: 700, fontSize: 13, zIndex: 70, boxShadow: "0 8px 24px #0008" }}>{t}</div>;
}

/* ============================ SIDEBAR (unified: collapse/expand) ============================ */
function Sidebar({ me, role, label, nav, tab, setTab, onLogout, open, setOpen, mobile }) {
  const [hover, setHover] = useState(false);
  const expanded = mobile ? open : (open || hover);
  const w = expanded ? W_EXPANDED : W_COLLAPSED;

  const sideStyle = {
    position: "fixed", left: 0, top: 0, bottom: 0, width: w,
    background: T.panel, borderRight: `1px solid ${T.line}`,
    display: "flex", flexDirection: "column", zIndex: 45,
    transition: "width .25s cubic-bezier(.4,0,.2,1), transform .25s cubic-bezier(.4,0,.2,1)",
    overflowX: "hidden", overflowY: "auto",
    ...(mobile && !open ? { width: 0, transform: "translateX(-100%)" } : {}),
    ...(mobile && open ? { width: W_EXPANDED, transform: "translateX(0)", boxShadow: `4px 0 30px ${T.bg}CC` } : {}),
  };

  const onNav = (k) => { setTab(k); if (mobile) setOpen(false); };

  return (
    <>
      {mobile && open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "#000A", zIndex: 44 }} />}
      <div style={sideStyle} onMouseEnter={() => { if (!mobile) setHover(true); }} onMouseLeave={() => { if (!mobile) setHover(false); }}>
        {/* Header */}
        <div style={{ padding: expanded ? "20px 16px 14px" : "20px 0 14px", borderBottom: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: expanded ? "space-between" : "center", minHeight: 70 }}>
          {expanded ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `radial-gradient(circle at 30% 30%, ${T.gold}, ${T.goldDeep})`, display: "grid", placeItems: "center", color: "#0B2016", flexShrink: 0 }}><Mic2 size={20} /></div>
                <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
                  <H style={{ fontSize: 17, lineHeight: 1 }}>Tiệm Dạy Nhạc</H>
                  <div style={{ fontSize: 11, color: T.sub, marginTop: 2 }}>Quản lý thanh nhạc</div>
                </div>
              </div>
              {mobile && <button onClick={() => setOpen(false)} style={{ background: "none", border: `1px solid ${T.line}`, borderRadius: 8, padding: 5, color: T.sub, cursor: "pointer" }}><PanelLeftClose size={17} /></button>}
            </>
          ) : (
            <div style={{ width: 38, height: 38, borderRadius: 11, background: `radial-gradient(circle at 30% 30%, ${T.gold}, ${T.goldDeep})`, display: "grid", placeItems: "center", color: "#0B2016", cursor: "pointer" }}><Mic2 size={19} /></div>
          )}
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: expanded ? "10px 8px" : "10px 6px" }}>
          {nav.map(([k, t, Icon]) => {
            const on = tab === k;
            return (
              <button key={k} onClick={() => onNav(k)} title={expanded ? undefined : t} style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: expanded ? 12 : 0,
                justifyContent: expanded ? "flex-start" : "center",
                padding: expanded ? "11px 14px" : "11px 0",
                marginBottom: 3,
                background: on ? T.gold + "1A" : "transparent",
                border: on ? `1px solid ${T.gold}33` : "1px solid transparent",
                borderRadius: T.rSm, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                color: on ? T.gold : T.sub, transition: "all .15s",
              }}>
                <Icon size={20} strokeWidth={on ? 2.4 : 1.8} style={{ flexShrink: 0 }} />
                {expanded && <span style={{ fontSize: 14, fontWeight: on ? 700 : 500, whiteSpace: "nowrap", overflow: "hidden" }}>{t}</span>}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: expanded ? "12px 12px" : "12px 0", borderTop: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: expanded ? "flex-start" : "center", gap: expanded ? 10 : 0 }}>
          {expanded ? (
            <>
              <div style={{ width: 34, height: 34, borderRadius: T.rSm, background: T.card, display: "grid", placeItems: "center", color: T.gold, border: `1px solid ${T.line}`, flexShrink: 0 }}><User size={16} /></div>
              <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{me?.ten}</div>
                <div style={{ fontSize: 11, color: T.sub }}>{label}</div>
              </div>
              <button onClick={onLogout} style={{ background: "transparent", border: `1px solid ${T.line}`, color: T.sub, borderRadius: 8, padding: 5, cursor: "pointer", flexShrink: 0 }}><LogOut size={15} /></button>
            </>
          ) : (
            <button onClick={onLogout} title="Đăng xuất" style={{ background: "transparent", border: `1px solid ${T.line}`, color: T.sub, borderRadius: 8, padding: 6, cursor: "pointer" }}><LogOut size={15} /></button>
          )}
        </div>
      </div>
    </>
  );
}

/* ============================ LOGIN ============================ */
function Login({ db, setDb, onLogin, flash }) {
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [show, setShow] = useState(false);
  const doLogin = () => {
    if (u === db.admin.taiKhoan && p === db.admin.matKhau) return onLogin({ role: "admin" });
    const gv = db.teachers.find((x) => x.taiKhoan === u);
    if (gv) return authOr(gv, "gv", "teachers");
    const hv = db.students.find((x) => x.taiKhoan === u);
    if (hv) return authOr(hv, "hv", "students");
    flash("Sai tài khoản");
  };
  const authOr = (acc, role, coll) => {
    if (!acc.matKhau) { // first login → lưu mật khẩu
      if (!p) return flash("Nhập mật khẩu để lưu");
      setDb((d) => ({ ...d, [coll]: d[coll].map((x) => x.id === acc.id ? { ...x, matKhau: p } : x) }));
      flash("Đã lưu mật khẩu");
      return onLogin({ role, id: acc.id });
    }
    if (acc.matKhau === p) return onLogin({ role, id: acc.id });
    flash("Sai mật khẩu");
  };
  const demo = (role) => {
    if (role === "admin") return onLogin({ role: "admin" });
    if (role === "gv") return onLogin({ role: "gv", id: db.teachers[0].id });
    return onLogin({ role: "hv", id: db.students[0].id });
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <div style={{ width: 66, height: 66, borderRadius: 20, margin: "0 auto 14px", background: `radial-gradient(circle at 30% 30%, ${T.gold}, ${T.goldDeep})`, display: "grid", placeItems: "center", color: "#0B2016", boxShadow: `0 10px 30px ${T.gold}33` }}><Mic2 size={34} /></div>
        <H style={{ fontSize: 28 }}>Tiệm Dạy Nhạc</H>
        <div style={{ color: T.sub, fontSize: 13, marginTop: 4 }}>Quản lý học viên · lộ trình · lịch học</div>
      </div>
      <Card style={{ padding: 18 }}>
        <Field label="Tài khoản" value={u} onChange={setU} placeholder="admin / mai / an…" />
        <div style={{ position: "relative" }}>
          <Field label="Mật khẩu" value={p} onChange={setP} type={show ? "text" : "password"} placeholder="lần đầu sẽ tự lưu" />
          <button onClick={() => setShow(!show)} style={{ position: "absolute", right: 10, top: 30, background: "none", border: "none", color: T.sub, cursor: "pointer" }}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
        </div>
        <Btn onClick={doLogin} style={{ width: "100%", justifyContent: "center", marginTop: 6 }}>Đăng nhập</Btn>
      </Card>
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: T.sub, marginBottom: 8 }}>Xem thử vai trò</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Btn small kind="ghost" onClick={() => demo("admin")}>Admin</Btn>
          <Btn small kind="ghost" onClick={() => demo("gv")}>Giảng viên</Btn>
          <Btn small kind="ghost" onClick={() => demo("hv")}>Học viên</Btn>
        </div>
      </div>
    </div>
  );
}

/* ============================ ADMIN HOME ============================ */
function Stat({ icon, n, t, c = T.gold }) {
  return (
    <Card style={{ flex: 1, padding: 12 }}>
      <div style={{ color: c, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800 }}>{n}</div>
      <div style={{ fontSize: 11, color: T.sub }}>{t}</div>
    </Card>
  );
}
function AdminHome({ db, open, go }) {
  const overdue = db.students.filter((s) => (payState(s).d ?? 99) <= 10);
  const revenue = db.students.reduce((a, s) => a + s.sessions.length * 0, 0);
  const totalSessions = db.students.reduce((a, s) => a + s.sessions.length, 0);
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <Stat icon={<Users size={18} />} n={db.students.length} t="Học viên" />
        <Stat icon={<GraduationCap size={18} />} n={db.teachers.length} t="Giảng viên" />
        <Stat icon={<Music2 size={18} />} n={totalSessions} t="Buổi đã dạy" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "18px 4px 10px" }}>
        <Bell size={16} color={T.warn} /><H style={{ fontSize: 15 }}>Nhắc học phí</H>
      </div>
      {overdue.length === 0 ? <Empty icon={<CheckCircle2 size={30} />} t="Không có khoản nào tới hạn" /> :
        overdue.map((s) => {
          const p = payState(s);
          return (
            <Card key={s.id} onClick={() => open(s.id)} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontWeight: 700 }}>{s.ten}</div><div style={{ fontSize: 11, color: T.sub }}>Hết hạn {s.ngayHetHan}</div></div>
              <Pill c={p.c}>{p.d < 0 ? `Trễ ${-p.d}n` : `Còn ${p.d}n`}</Pill>
            </Card>
          );
        })}
      <Btn kind="dark" onClick={() => go("students")} style={{ width: "100%", justifyContent: "center", marginTop: 8 }}><Users size={16} /> Xem tất cả học viên</Btn>
    </div>
  );
}

/* ============================ GV HOME ============================ */
function GvHome({ db, me, open }) {
  const mine = db.students.filter((s) => s.teacherId === me.id);
  return (
    <div>
      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: T.sub }}>Lịch trống của bạn</div>
        <div style={{ fontWeight: 700, marginTop: 2 }}>{me.lichTrong || "Chưa cập nhật"}</div>
        <div style={{ fontSize: 12, color: T.sub, marginTop: 6 }}>{me.chuyenMon} · {me.gmail}</div>
      </Card>
      <H style={{ fontSize: 15, margin: "4px 4px 10px" }}>Học viên của tôi ({mine.length})</H>
      {mine.map((s) => <StudentRow key={s.id} s={s} onClick={() => open(s.id)} />)}
    </div>
  );
}

/* ============================ STUDENT LIST ============================ */
function StudentRow({ s, onClick, selectMode, selected, onToggle, onDelete, canEdit }) {
  const left = s.soBuoiDangKy - s.sessions.length;
  const p = payState(s);
  return (
    <Card
      onClick={selectMode ? () => onToggle(s.id) : onClick}
      style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", border: `1px solid ${selectMode && selected ? T.gold : T.line}`, background: selectMode && selected ? T.gold + "12" : T.card }}
    >
      {selectMode && (
        <div style={{ flexShrink: 0, color: selected ? T.gold : T.sub }}>
          {selected ? <CheckSquare size={20} /> : <Square size={20} />}
        </div>
      )}
      <div style={{ width: 42, height: 42, borderRadius: 12, background: T.cardHi, display: "grid", placeItems: "center", color: RANKS[s.rank], fontWeight: 800, fontFamily: "'Playfair Display', serif", border: `1px solid ${RANKS[s.rank]}55`, flexShrink: 0 }}>{s.rank}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700 }}>{s.ten}</div>
        <div style={{ fontSize: 11.5, color: T.sub, display: "flex", gap: 8, marginTop: 2 }}>
          <span>{s.hocLop}</span><span>·</span><span>{s.loaiGiong}</span><span>·</span><span>Còn {left} buổi</span>
        </div>
      </div>
      {!selectMode && <Pill c={p.c}>{p.t}</Pill>}
      {!selectMode && canEdit && (
        <button onClick={(ev) => { ev.stopPropagation(); onDelete(s); }} style={{ background: "none", border: "none", color: T.bad, cursor: "pointer", flexShrink: 0, padding: 4 }}>
          <Trash2 size={16} />
        </button>
      )}
    </Card>
  );
}
function StudentList({ db, setDb, role, me, open, flash }) {
  const [q, setQ] = useState(""); const [cls, setCls] = useState("Tất cả"); const [add, setAdd] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [confirmTarget, setConfirmTarget] = useState(null); // { ids: [...], names: [...] } | null
  const canEdit = role === "admin";

  let list = role === "gv" ? db.students.filter((s) => s.teacherId === me.id) : db.students;
  if (cls !== "Tất cả") list = list.filter((s) => s.hocLop === cls);
  if (q) list = list.filter((s) => s.ten.toLowerCase().includes(q.toLowerCase()));

  const toggle = (id) => setSelected((a) => a.includes(id) ? a.filter((x) => x !== id) : [...a, id]);
  const toggleAll = () => setSelected(selected.length === list.length ? [] : list.map((s) => s.id));

  const doDelete = async (ids) => {
    for (const id of ids) {
      const st = db.students.find((s) => s.id === id);
      if (st) {
        for (const se of st.sessions || []) {
          for (const r of se.records || []) await delRec(r.id);
          for (const im of se.ghiChuImgs || []) await delImg(im.id);
        }
      }
    }
    setDb((d) => ({ ...d, students: d.students.filter((s) => !ids.includes(s.id)) }));
    flash(ids.length > 1 ? `Đã xoá ${ids.length} học viên` : "Đã xoá học viên");
    setSelected((a) => a.filter((x) => !ids.includes(x)));
    setConfirmTarget(null);
    setSelectMode(false);
  };

  const askDeleteOne = (s) => setConfirmTarget({ ids: [s.id], names: [s.ten] });
  const askDeleteSelected = () => {
    if (selected.length === 0) return flash("Chưa chọn học viên nào");
    setConfirmTarget({ ids: [...selected], names: list.filter((s) => selected.includes(s.id)).map((s) => s.ten) });
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={16} color={T.sub} style={{ position: "absolute", left: 11, top: 12 }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm học viên"
            style={{ width: "100%", boxSizing: "border-box", background: T.bg2, border: `1px solid ${T.line2}`, borderRadius: 12, padding: "10px 12px 10px 34px", color: T.ink, fontFamily: "inherit" }} />
        </div>
        {canEdit && (
          <Btn kind={selectMode ? "dark" : "ghost"} small onClick={() => { setSelectMode(!selectMode); setSelected([]); }}>
            <CheckSquare size={15} /> {selectMode ? "Huỷ chọn" : "Chọn"}
          </Btn>
        )}
        {!selectMode && role === "admin" && <Btn onClick={() => setAdd(true)}><Plus size={16} /></Btn>}
      </div>

      {selectMode && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, background: T.bg2, borderRadius: T.rSm, padding: "8px 12px" }}>
          <button onClick={toggleAll} style={{ background: "none", border: "none", color: T.gold, cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            <CheckSquare size={15} /> {selected.length === list.length && list.length > 0 ? "Bỏ chọn tất cả" : "Chọn tất cả"}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: T.sub }}>{selected.length} đã chọn</span>
            <Btn small onClick={askDeleteSelected} style={{ background: T.bad, color: T.ink }}><Trash2 size={14} /> Xoá</Btn>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto", paddingBottom: 2 }}>
        {["Tất cả", ...CLASSES].map((c) => (
          <button key={c} onClick={() => setCls(c)} style={{ whiteSpace: "nowrap", border: `1px solid ${cls === c ? T.gold : T.line}`, background: cls === c ? T.gold + "22" : "transparent", color: cls === c ? T.gold : T.sub, borderRadius: 999, padding: "6px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{c}</button>
        ))}
      </div>

      {list.length === 0 ? <Empty icon={<Users size={30} />} t="Chưa có học viên" /> : list.map((s) => (
        <StudentRow
          key={s.id} s={s}
          onClick={() => open(s.id)}
          selectMode={selectMode}
          selected={selected.includes(s.id)}
          onToggle={toggle}
          onDelete={askDeleteOne}
          canEdit={canEdit}
        />
      ))}

      {add && <AddStudent db={db} setDb={setDb} close={() => setAdd(false)} flash={flash} />}

      {confirmTarget && (
        <Sheet close={() => setConfirmTarget(null)} title="Xác nhận xoá">
          <div style={{ fontSize: 13.5, color: T.ink, lineHeight: 1.6, marginBottom: 6 }}>
            Bạn sắp xoá {confirmTarget.ids.length > 1 ? `${confirmTarget.ids.length} học viên` : "học viên"}:
          </div>
          <div style={{ background: T.bg2, borderRadius: T.rSm, padding: "10px 12px", marginBottom: 14, maxHeight: 180, overflowY: "auto" }}>
            {confirmTarget.names.map((n, i) => (
              <div key={i} style={{ fontSize: 13, fontWeight: 700, color: T.gold, padding: "3px 0" }}>{n}</div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: T.bad, marginBottom: 14 }}>
            Toàn bộ hồ sơ, lịch sử buổi học, ghi âm và ảnh ghi chú liên quan sẽ bị xoá vĩnh viễn và không thể khôi phục.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn kind="dark" onClick={() => setConfirmTarget(null)} style={{ flex: 1, justifyContent: "center" }}>Huỷ</Btn>
            <Btn onClick={() => doDelete(confirmTarget.ids)} style={{ flex: 1, justifyContent: "center", background: T.bad, color: T.ink }}><Trash2 size={15} /> Xoá vĩnh viễn</Btn>
          </div>
        </Sheet>
      )}
    </div>
  );
}
function AddStudent({ db, setDb, close, flash }) {
  const [f, setF] = useState({ ten: "", namSinh: "", gmail: "", sdt: "", taiKhoan: "", mucTieu: "", hocLop: "TN11", loaiGiong: "Tenor", rank: "C", soBuoiDangKy: 12, ngayBatDau: "", ngayHetHan: "", teacherId: db.teachers[0]?.id });
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const save = () => {
    if (!f.ten || !f.taiKhoan) return flash("Cần Tên & Tài khoản");
    const s = { id: uid(), matKhau: "", rankNote: "", driveFolder: "", sessions: [], lichHen: [], passaggio: "", noteCaoBanDau: "", noteThapBanDau: "", ngayKhoaMoi: f.ngayBatDau, ...f, namSinh: +f.namSinh, soBuoiDangKy: +f.soBuoiDangKy };
    setDb((d) => ({ ...d, students: [...d.students, s] })); flash("Đã thêm học viên"); close();
  };
  return (
    <Sheet close={close} title="Thêm học viên">
      <Field label="Họ tên" value={f.ten} onChange={set("ten")} />
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}><Field label="Năm sinh" value={f.namSinh} onChange={set("namSinh")} type="number" /></div>
        <div style={{ flex: 1 }}><Field label="Tài khoản" value={f.taiKhoan} onChange={set("taiKhoan")} /></div>
      </div>
      <Row2><Field label="Gmail" value={f.gmail} onChange={set("gmail")} /><Field label="SĐT" value={f.sdt} onChange={set("sdt")} /></Row2>
      <Field label="Mục tiêu học" value={f.mucTieu} onChange={set("mucTieu")} />
      <Row2><Select label="Lớp" v={f.hocLop} set={set("hocLop")} opts={CLASSES} /><Select label="Loại giọng" v={f.loaiGiong} set={set("loaiGiong")} opts={GIONG} /></Row2>
      <Row2><Select label="Rank" v={f.rank} set={set("rank")} opts={Object.keys(RANKS)} /><Field label="Số buổi ĐK" value={f.soBuoiDangKy} onChange={set("soBuoiDangKy")} type="number" /></Row2>
      <Row2><Field label="Ngày bắt đầu" value={f.ngayBatDau} onChange={set("ngayBatDau")} type="date" /><Field label="Ngày hết hạn" value={f.ngayHetHan} onChange={set("ngayHetHan")} type="date" /></Row2>
      <Select label="Giảng viên" v={f.teacherId} set={set("teacherId")} opts={db.teachers.map((t) => [t.id, t.ten])} />
      <Btn onClick={save} style={{ width: "100%", justifyContent: "center", marginTop: 8 }}><Save size={16} /> Lưu học viên</Btn>
    </Sheet>
  );
}

/* ============================ STUDENT DETAIL ============================ */
function StudentDetail({ db, setDb, sid, back, flash, role }) {
  const s = db.students.find((x) => x.id === sid);
  const [tab, setTab] = useState("profile");
  if (!s) return null;
  const update = (patch) => setDb((d) => ({ ...d, students: d.students.map((x) => x.id === sid ? { ...x, ...patch } : x) }));
  const teacher = db.teachers.find((t) => t.id === s.teacherId);
  const left = s.soBuoiDangKy - s.sessions.length;
  return (
    <div>
      <button onClick={back} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: T.gold, cursor: "pointer", marginBottom: 10, fontFamily: "inherit", fontWeight: 600 }}><ChevronLeft size={18} /> Danh sách</button>
      <Card style={{ marginBottom: 12, background: `linear-gradient(135deg, ${T.cardHi}, ${T.card})` }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: T.bg2, display: "grid", placeItems: "center", color: RANKS[s.rank], fontWeight: 800, fontSize: 22, fontFamily: "'Playfair Display', serif", border: `1px solid ${RANKS[s.rank]}66` }}>{s.rank}</div>
          <div style={{ flex: 1 }}>
            <H style={{ fontSize: 19 }}>{s.ten}</H>
            <div style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>{s.hocLop} · {s.loaiGiong} · GV {teacher?.ten}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <MiniStat n={s.sessions.length} t="Đã học" />
          <MiniStat n={left} t="Còn lại" c={left <= 2 ? T.bad : T.good} />
          <MiniStat n={(payState(s).d ?? 0) + "n"} t="Tới hạn" c={payState(s).c} />
        </div>
      </Card>
      {tab === "today" ? (
        <div>
          <button onClick={() => setTab("profile")} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: T.gold, cursor: "pointer", marginBottom: 10, fontFamily: "inherit", fontWeight: 600 }}><ChevronLeft size={16} /> Hồ sơ học viên</button>
          <TodayTab s={s} db={db} update={update} flash={flash} onSaved={() => setTab("profile")} />
        </div>
      ) : (
        <>
          <button onClick={() => setTab("today")} style={{ width: "100%", boxSizing: "border-box", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left", borderRadius: T.r, padding: "14px 16px", marginBottom: 12, background: `linear-gradient(120deg, ${T.gold}, ${T.goldSoft})`, color: "#0B2016", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: `0 8px 22px ${T.gold}22` }}>
            <span style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <span style={{ width: 40, height: 40, borderRadius: 12, background: "#0B2016", display: "grid", placeItems: "center", color: T.gold, flexShrink: 0 }}><Play size={20} /></span>
              <span><span style={{ fontWeight: 800, fontSize: 15.5, display: "block", fontFamily: "'Playfair Display', serif" }}>Bắt đầu buổi học hôm nay</span><span style={{ fontSize: 12, opacity: .85 }}>Dán link · tạo giáo trình · chấm KPI</span></span>
            </span>
            <ChevronRight size={22} />
          </button>
          <div style={{ display: "flex", gap: 6, marginBottom: 14, background: T.bg2, padding: 4, borderRadius: T.rSm }}>
            {[["profile", "Hồ sơ"], ["songs", "Bài hát"], ["history", "Lịch sử"], ["baitap", "Bài tập"]].map(([k, t]) => (
              <button key={k} onClick={() => setTab(k)} style={{ flex: 1, border: "none", borderRadius: 9, padding: "8px 4px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", background: tab === k ? T.gold : "transparent", color: tab === k ? "#0B2016" : T.sub, fontFamily: "inherit" }}>{t}</button>
            ))}
          </div>
          {tab === "profile" && <ProfileTab s={s} update={update} db={db} flash={flash} role={role} />}
          {tab === "songs" && <SongsTab s={s} />}
          {tab === "history" && <HistoryTab s={s} update={update} flash={flash} />}
          {tab === "baitap" && <ExerciseLibrary db={db} setDb={setDb} role={role} flash={flash} s={s} />}
        </>
      )}
    </div>
  );
}
const MiniStat = ({ n, t, c = T.ink }) => (
  <div style={{ flex: 1, background: T.bg2, borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
    <div style={{ fontWeight: 800, fontSize: 18, color: c, fontFamily: "'Playfair Display', serif" }}>{n}</div>
    <div style={{ fontSize: 10, color: T.sub }}>{t}</div>
  </div>
);

/* ---- TODAY: AI curriculum + KPI ---- */
function TodayTab({ s, db, update, flash, onSaved }) {
  const [songs, setSongs] = useState([{ id: uid(), link: "", ten: "", noteCao: "", noteThap: "", loading: false }]);
  const [exs, setExs] = useState([{ id: uid(), ten: "", link: "" }]);
  const [plan, setPlan] = useState(null); const [gLoading, setGLoading] = useState(false);
  const [kpi, setKpi] = useState({});
  const [ghiChu, setGhiChu] = useState(""); const [amVuc, setAmVuc] = useState(""); const [ktKho, setKtKho] = useState("");
  const [tier, setTier] = useState("T1");
  const [noteImgs, setNoteImgs] = useState([]); // {id, dataUrl}
  const [lb, setLb] = useState(null);
  const stuHigh = s.noteCaoBanDau, stuLow = s.noteThapBanDau;

  const onPaste = (e) => {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (const it of items) {
      if (it.type && it.type.startsWith("image/")) {
        const file = it.getAsFile(); if (!file) continue;
        const fr = new FileReader();
        fr.onload = () => setNoteImgs((a) => [...a, { id: uid(), dataUrl: fr.result }]);
        fr.readAsDataURL(file);
      }
    }
  };
  const rmImg = (id) => setNoteImgs((a) => a.filter((x) => x.id !== id));

  const setSong = (id, patch) => setSongs((a) => a.map((x) => x.id === id ? { ...x, ...patch } : x));
  const fetchTitle = async (id, link) => {
    if (!link) return;
    setSong(id, { loading: true });
    let title = await ytTitle(link);
    if (!title) { try { const r = await callAI(`Cho URL YouTube: ${link}. Trả về DUY NHẤT tên bài hát và ca sĩ, không giải thích.`, db.settings.geminiKey); title = (r || "").trim().split("\n")[0]; } catch (e) {} }
    setSong(id, { ten: title || "", loading: false });
    if (!title) flash("Không lấy được tên, hãy tự nhập");
  };
  const addSong = () => setSongs((a) => [...a, { id: uid(), link: "", ten: "", noteCao: "", noteThap: "", loading: false }]);
  const rmSong = (id) => setSongs((a) => a.length > 1 ? a.filter((x) => x.id !== id) : a);
  const setEx = (id, patch) => setExs((a) => a.map((x) => x.id === id ? { ...x, ...patch } : x));
  const addEx = () => setExs((a) => [...a, { id: uid(), ten: "", link: "" }]);
  const rmEx = (id) => setExs((a) => a.length > 1 ? a.filter((x) => x.id !== id) : a);

  const gen = async () => {
    const bai = songs.map((x) => x.ten || x.link).filter(Boolean).join("; ");
    if (!bai) return flash("Thêm ít nhất 1 bài hát");
    const yt = songs.map((x) => x.link).filter(Boolean).join(", ");
    const rank = s.rank;
    setGLoading(true); setPlan(null);
    const prompt = 'Bạn là trợ lý của một giáo viên thanh nhạc chuyên nghiệp tại Việt Nam. ' +
      'Hãy soạn giáo án cho MỘT buổi học 60 phút theo cấu trúc cố định: ' +
      '15 phút đầu giải thích cơ chế kỹ thuật + cho bài tập luyện thanh; ' +
      '45 phút sau sửa bài hát học viên chọn.\n\n' +
      'THÔNG TIN:\n' +
      '- Bài hát học viên chọn: ' + bai + '\n' +
      (yt ? '- Link YouTube bản mẫu: ' + yt + ' (hãy phân tích bản này nếu xem được)\n' : '') +
      '- Rank nền tảng của học viên: ' + rank + ' (A=sơ cấp → D=khá/tốt)\n' +
      '- Bậc tư duy xử lý bài: ' + tier + ' (T1→T4)\n' +
      '- Loại giọng: ' + s.loaiGiong + ', passaggio: ' + (s.passaggio || '?') + ', quãng hiện tại: ' + (stuLow || '?') + '–' + (stuHigh || '?') + '\n\n' +
      'Yêu cầu: phân tích quãng giọng/tessitura, chỗ khó, kỹ thuật trọng tâm; ' +
      'chọn bài luyện thanh phù hợp Rank; nêu các đoạn cần sửa theo thứ tự ưu tiên; ' +
      'ngôn ngữ TIẾNG VIỆT, thực tế, ngắn gọn, đúng trình độ học viên.\n\n' +
      'CHỈ trả về JSON đúng cấu trúc sau (không thêm chữ nào ngoài JSON):\n' +
      '{"phanTich":"phân tích trọng tâm cốt lõi (1-3 câu)","giaoAn":"nội dung 15 phút đầu","luyenThanh":[{"ten":"Tên bài tập 1 (VD: Khởi động Humming & Siren)","moTa":"Cách tập chi tiết"}],"suaBai":"kế hoạch 45 phút sửa bài (ví dụ điệp khúc, verse 1), nêu chi tiết cách xử lý","baiTapVeNha":"=== BÀI TẬP VỀ NHÀ ===\\n- Luyện tập...\\n- Ghi âm...","duKienBuoiSau":"dự kiến buổi sau sửa/tập phần nào"}';
    try { const j = parseJSON(await callAI(prompt, db.settings.geminiKey)); if (!j) throw new Error(); setPlan(j); }
    catch (e) { flash(db.settings.geminiKey ? "Gemini lỗi: kiểm tra API key" : "AI lỗi, thử lại"); }
    setGLoading(false);
  };

  const save = async () => {
    if (!songs.some((x) => x.ten || x.link)) return flash("Chưa có bài hát");
    const avg = avgOf(kpi);
    const imgRefs = [];
    for (const im of noteImgs) { await saveImg(im.id, im.dataUrl); imgRefs.push({ id: im.id }); }
    const rec = {
      id: uid(), date: new Date().toISOString().slice(0, 10),
      songs: songs.filter((x) => x.ten || x.link).map(({ loading, ...r }) => r),
      exercises: exs.filter((x) => x.ten || x.link),
      kpi, avg, ghiChu, ghiChuImgs: imgRefs, amVuc, ktKho, plan, records: [],
    };
    update({ sessions: [rec, ...s.sessions] });
    flash("Đã lưu · còn " + Math.max(0, (s.soBuoiDangKy || 0) - s.sessions.length - 1) + " buổi");
    setSongs([{ id: uid(), link: "", ten: "", noteCao: "", noteThap: "", loading: false }]);
    setExs([{ id: uid(), ten: "", link: "" }]); setPlan(null); setGhiChu(""); setAmVuc(""); setKtKho("");
    setKpi({}); setNoteImgs([]);
    if (onSaved) onSaved();
  };

  return (
    <div>
      {/* SONGS */}
      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}><Youtube size={17} color={T.gold} /><H style={{ fontSize: 14 }}>Bài hát trong buổi</H></div>
          <div style={{ fontSize: 11, color: T.sub }}>Quãng: {stuLow || "—"}–{stuHigh || "—"}</div>
        </div>
        {songs.map((sg, i) => {
          const tip = transposeSuggest(sg.noteThap, sg.noteCao, stuLow, stuHigh);
          return (
            <div key={sg.id} style={{ background: T.bg2, borderRadius: T.rSm, padding: 10, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: T.sub, fontWeight: 700 }}>Bài {i + 1}</span>
                {songs.length > 1 && <button onClick={() => rmSong(sg.id)} style={{ background: "none", border: "none", color: T.bad, cursor: "pointer", padding: 0 }}><X size={15} /></button>}
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <input value={sg.link} onChange={(e) => setSong(sg.id, { link: e.target.value })} onBlur={(e) => e.target.value && !sg.ten && fetchTitle(sg.id, e.target.value)} placeholder="Dán link YouTube…" style={inp} />
                <Btn small kind="dark" onClick={() => fetchTitle(sg.id, sg.link)}>{sg.loading ? "…" : "Lấy tên"}</Btn>
              </div>
              <input value={sg.ten} onChange={(e) => setSong(sg.id, { ten: e.target.value })} placeholder="Tên bài hát (tự điền/sửa)" style={{ ...inp, marginBottom: 6 }} />
              <div style={{ display: "flex", gap: 6 }}>
                <input value={sg.noteCao} onChange={(e) => setSong(sg.id, { noteCao: e.target.value })} placeholder="Note cao bài (VD: A4)" style={inp} />
                <input value={sg.noteThap} onChange={(e) => setSong(sg.id, { noteThap: e.target.value })} placeholder="Note thấp bài" style={inp} />
              </div>
              {tip && <div style={{ marginTop: 8, background: tip.c + "1E", border: `1px solid ${tip.c}44`, borderRadius: 8, padding: "6px 10px", fontSize: 12.5, fontWeight: 700, color: tip.c }}>🎚 {tip.t}</div>}
              {!tip && sg.noteCao && <div style={{ marginTop: 8, fontSize: 11.5, color: T.sub }}>Nhập quãng giọng học viên ở Hồ sơ để nhận gợi ý tone.</div>}
            </div>
          );
        })}
        <Btn small kind="ghost" onClick={addSong}><Plus size={15} /> Thêm bài hát</Btn>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, marginBottom: 2 }}>
          <span style={{ fontSize: 11.5, color: T.sub }}>Bậc xử lý bài</span>
          <div style={{ display: "flex", gap: 4 }}>
            {["T1", "T2", "T3", "T4"].map((tv) => (
              <button key={tv} onClick={() => setTier(tv)} style={{ border: `1px solid ${tier === tv ? T.gold : T.line2}`, background: tier === tv ? T.gold : "transparent", color: tier === tv ? "#0B2016" : T.sub, borderRadius: 8, padding: "5px 11px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{tv}</button>
            ))}
          </div>
          <Pill c={T.accent}>Rank {s.rank}</Pill>
        </div>
        <Btn onClick={gen} style={{ width: "100%", justifyContent: "center", marginTop: 10 }}>{gLoading ? "Đang soạn giáo án…" : <><Sparkles size={16} /> Tạo giáo án AI</>}</Btn>
      </Card>

      {plan && (
        <Card style={{ marginBottom: 12, borderColor: T.goldSoft }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}><Sparkles size={16} color={T.gold} /><H style={{ fontSize: 15 }}>Giáo án buổi học</H></div>

          {plan.phanTich && <PlanBlock label="Phân tích trọng tâm" body={plan.phanTich} />}

          {plan.giaoAn && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: T.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: 5, display: "flex", alignItems: "center", gap: 5 }}><Clock size={13} /> 15 phút đầu · Kỹ thuật</div>
              <div style={{ fontSize: 13, color: T.ink, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{plan.giaoAn}</div>
            </div>
          )}

          {Array.isArray(plan.luyenThanh) && plan.luyenThanh.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: T.sub, textTransform: "uppercase", marginBottom: 6 }}>Bài luyện thanh</div>
              {plan.luyenThanh.map((x, i) => (
                <div key={i} style={{ background: T.bg2, borderRadius: T.rSm, padding: "8px 10px", marginBottom: 6 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: T.gold, display: "flex", gap: 6, alignItems: "center" }}><Mic2 size={13} /> {typeof x === "string" ? x : x.ten}</div>
                  {x.moTa && <div style={{ fontSize: 12.5, color: T.ink, marginTop: 3, lineHeight: 1.5 }}>{x.moTa}</div>}
                </div>
              ))}
            </div>
          )}

          {plan.suaBai && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: T.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: 5, display: "flex", alignItems: "center", gap: 5 }}><Clock size={13} /> 45 phút sau · Sửa bài</div>
              <div style={{ fontSize: 13, color: T.ink, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{plan.suaBai}</div>
            </div>
          )}

          {plan.baiTapVeNha && (
            <div style={{ marginBottom: 10, background: T.warn + "14", border: `1px solid ${T.warn}33`, borderRadius: T.rSm, padding: "10px 12px" }}>
              <div style={{ fontSize: 12.5, color: T.ink, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{plan.baiTapVeNha}</div>
            </div>
          )}

          {plan.duKienBuoiSau && (
            <div style={{ fontSize: 12.5, color: T.sub, display: "flex", gap: 6, alignItems: "flex-start" }}>
              <ChevronRight size={14} color={T.gold} style={{ marginTop: 2, flexShrink: 0 }} /><span><b style={{ color: T.ink }}>Buổi sau:</b> {plan.duKienBuoiSau}</span>
            </div>
          )}
        </Card>
      )}

      {/* EXERCISES */}
      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}><BookOpen size={16} color={T.gold} /><H style={{ fontSize: 14 }}>Bài tập giao</H></div>
        {exs.map((ex, i) => (
          <div key={ex.id} style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "center" }}>
            <input value={ex.ten} onChange={(e) => setEx(ex.id, { ten: e.target.value })} placeholder={`Bài tập ${i + 1}`} style={{ ...inp, flex: 1 }} />
            <input value={ex.link} onChange={(e) => setEx(ex.id, { link: e.target.value })} placeholder="Link" style={{ ...inp, flex: 1 }} />
            {exs.length > 1 && <button onClick={() => rmEx(ex.id)} style={{ background: "none", border: "none", color: T.bad, cursor: "pointer" }}><X size={15} /></button>}
          </div>
        ))}
        <Btn small kind="ghost" onClick={addEx}><Plus size={15} /> Thêm bài tập</Btn>
      </Card>

      {/* KPI */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}><Target size={16} color={T.gold} /><H style={{ fontSize: 14 }}>Đánh giá KPI</H></div>
          <Pill c={sessionRank(avgOf(kpi)).c}>{avgOf(kpi)}/6 · {sessionRank(avgOf(kpi)).t}</Pill>
        </div>
        {KPI_CRIT.map((k) => (
          <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
            <span style={{ fontSize: 13 }}>{k}</span>
            <div style={{ display: "flex", gap: 6 }}>
              {[["Không tốt", 0, T.bad], ["Tốt", 1, T.good]].map(([t, val, col]) => {
                const on = kpi[k] === val;
                return (
                  <button key={val} onClick={() => setKpi({ ...kpi, [k]: val })} style={{ border: `1px solid ${on ? col : T.line2}`, background: on ? col + "22" : "transparent", color: on ? col : T.sub, borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{t}</button>
                );
              })}
            </div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <div style={{ flex: 1 }}><Field label="Âm vực buổi này" value={amVuc} onChange={setAmVuc} placeholder="VD: C3–A4" /></div>
          <div style={{ flex: 1 }}><Field label="Kỹ thuật khó" value={ktKho} onChange={setKtKho} placeholder="VD: mixed voice" /></div>
        </div>
        <Field label="Ghi chú của giáo viên" value={ghiChu} onChange={setGhiChu} placeholder="nhận xét ngắn…" />
        <div onPaste={onPaste} tabIndex={0} style={{ border: `1px dashed ${T.line2}`, borderRadius: T.rSm, padding: "10px 12px", marginBottom: 10, fontSize: 12, color: T.sub, cursor: "text", outline: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Upload size={13} /> Bấm vào đây rồi dán ảnh (Ctrl/⌘ + V)</div>
          {noteImgs.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
              {noteImgs.map((im) => (
                <div key={im.id} style={{ position: "relative" }}>
                  <img src={im.dataUrl} alt="" onClick={() => setLb(im.dataUrl)} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, border: `1px solid ${T.line2}`, cursor: "pointer" }} />
                  <button onClick={() => rmImg(im.id)} style={{ position: "absolute", top: -6, right: -6, background: T.bad, border: "none", borderRadius: 999, width: 20, height: 20, color: T.ink, cursor: "pointer", display: "grid", placeItems: "center" }}><X size={12} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
        <Btn onClick={save} style={{ width: "100%", justifyContent: "center", marginTop: 4 }}><Save size={16} /> Lưu buổi học</Btn>
      </Card>
      <Lightbox src={lb} onClose={() => setLb(null)} />
    </div>
  );
}
const inp = { width: "100%", boxSizing: "border-box", background: T.bg, border: `1px solid ${T.line2}`, borderRadius: 8, padding: "9px 11px", color: T.ink, fontSize: 13, fontFamily: "inherit" };
function PlanBlock({ label, body }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, color: T.sub, textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 13, color: T.ink, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{body}</div>
    </div>
  );
}
function SavedPlan({ plan }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 8 }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: T.bg2, border: `1px solid ${T.line2}`, borderRadius: T.rSm, padding: "9px 12px", color: T.gold, cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, fontWeight: 700 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Sparkles size={14} /> Giáo án AI của buổi</span>
        {open ? <ChevronLeft size={15} style={{ transform: "rotate(90deg)" }} /> : <ChevronRight size={15} style={{ transform: "rotate(90deg)" }} />}
      </button>
      {open && (
        <div style={{ padding: "10px 4px 2px" }}>
          {plan.phanTich && <PlanBlock label="Phân tích" body={plan.phanTich} />}
          {plan.giaoAn && <PlanBlock label="15 phút đầu · Kỹ thuật" body={plan.giaoAn} />}
          {Array.isArray(plan.luyenThanh) && plan.luyenThanh.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: T.sub, textTransform: "uppercase", marginBottom: 6 }}>Bài luyện thanh</div>
              {plan.luyenThanh.map((x, i) => (
                <div key={i} style={{ background: T.bg2, borderRadius: T.rSm, padding: "8px 10px", marginBottom: 6 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: T.gold }}>{typeof x === "string" ? x : x.ten}</div>
                  {x.moTa && <div style={{ fontSize: 12.5, color: T.ink, marginTop: 3, lineHeight: 1.5 }}>{x.moTa}</div>}
                </div>
              ))}
            </div>
          )}
          {plan.suaBai && <PlanBlock label="45 phút sau · Sửa bài" body={plan.suaBai} />}
          {plan.baiTapVeNha && <div style={{ marginBottom: 10, background: T.warn + "14", border: `1px solid ${T.warn}33`, borderRadius: T.rSm, padding: "10px 12px", fontSize: 12.5, color: T.ink, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{plan.baiTapVeNha}</div>}
          {plan.duKienBuoiSau && <div style={{ fontSize: 12.5, color: T.sub }}><b style={{ color: T.ink }}>Buổi sau:</b> {plan.duKienBuoiSau}</div>}
        </div>
      )}
    </div>
  );
}

/* ---- RECORDER ---- */
function Recorder({ onSave, flash }) {
  const [recording, setRecording] = useState(false);
  const [preview, setPreview] = useState(null); // {url, dataUrl, dur}
  const mr = useRef(null); const chunks = useRef([]); const startT = useRef(0);
  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const m = new MediaRecorder(stream); chunks.current = [];
      m.ondataavailable = (e) => chunks.current.push(e.data);
      m.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        const fr = new FileReader();
        fr.onload = () => setPreview({ url: URL.createObjectURL(blob), dataUrl: fr.result, dur: Math.round((Date.now() - startT.current) / 1000) });
        fr.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      m.start(); startT.current = Date.now(); mr.current = m; setRecording(true);
    } catch (e) { flash("Không truy cập được micro"); }
  };
  const stop = () => { mr.current && mr.current.stop(); setRecording(false); };
  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {!recording
          ? <Btn small kind="ghost" onClick={start}><Mic size={15} /> Thu âm bằng micro</Btn>
          : <>
              <Btn small onClick={stop} style={{ background: T.bad, color: T.ink }}><Square size={13} /> Dừng</Btn>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: T.bad, fontWeight: 700 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: T.bad, display: "inline-block" }} /> Đang thu…</span>
            </>}
      </div>
      {preview && (
        <div style={{ marginTop: 8, background: T.bg2, borderRadius: T.rSm, padding: 8 }}>
          <audio controls src={preview.url} style={{ width: "100%", height: 34 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <Btn small onClick={() => { onSave(preview.dataUrl, preview.dur); setPreview(null); }} style={{ flex: 1, justifyContent: "center" }}><Save size={14} /> Lưu bản thu</Btn>
            <Btn small kind="dark" onClick={() => setPreview(null)}><Trash2 size={14} /></Btn>
          </div>
        </div>
      )}
    </div>
  );
}
function RecordingItem({ r, onDelete }) {
  const [src, setSrc] = useState(null);
  useEffect(() => { let on = true; loadRec(r.id).then((v) => { if (on) setSrc(v); }); return () => { on = false; }; }, [r.id]);
  return (
    <div style={{ background: T.bg2, borderRadius: T.rSm, padding: 8, marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: T.sub }}>🎙 {r.ten}{r.dur ? ` · ${r.dur}s` : ""}</span>
        <button onClick={onDelete} style={{ background: "none", border: "none", color: T.bad, cursor: "pointer" }}><Trash2 size={15} /></button>
      </div>
      {src ? <audio controls src={src} style={{ width: "100%", height: 34 }} /> : <div style={{ fontSize: 11, color: T.sub }}>Đang tải…</div>}
    </div>
  );
}

/* ---- HISTORY ---- */
function HistoryTab({ s, update, flash }) {
  const [lb, setLb] = useState(null);
  if (!s.sessions.length) return <Empty icon={<Clock size={30} />} t="Chưa có buổi học nào" />;
  const list = [...s.sessions].reverse();
  const chart = list.map((x, i) => ({ n: `B${i + 1}`, avg: x.avg || 0 }));
  const total = s.soBuoiDangKy || 0;

  const addRecord = (sid) => async (dataUrl, dur, name) => {
    const id = uid(); await saveRec(id, dataUrl);
    update({ sessions: s.sessions.map((se) => se.id === sid ? { ...se, records: [...(se.records || []), { id, ten: name || ("Ghi âm " + new Date().toLocaleDateString("vi-VN")), date: new Date().toISOString().slice(0, 10), dur }] } : se) });
    flash("Đã lưu ghi âm vào thư mục Record");
  };
  const rmRecord = (sid, rid) => async () => {
    await delRec(rid);
    update({ sessions: s.sessions.map((se) => se.id === sid ? { ...se, records: (se.records || []).filter((r) => r.id !== rid) } : se) });
    flash("Đã xoá");
  };

  return (
    <div>
      {s.driveFolder && (
        <Card style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <FolderPlus size={18} color={T.gold} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10.5, color: T.sub, textTransform: "uppercase" }}>Thư mục Drive học viên</div>
            {/^https?:\/\//.test(s.driveFolder)
              ? <a href={s.driveFolder} target="_blank" rel="noreferrer" style={{ fontSize: 12.5, color: T.accent, wordBreak: "break-all" }}>{s.driveFolder}</a>
              : <div style={{ fontSize: 12.5, color: T.ink, wordBreak: "break-all" }}>{s.driveFolder}</div>}
          </div>
        </Card>
      )}
      {chart.length > 1 && (
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: T.sub, textTransform: "uppercase", marginBottom: 6 }}>Tiến trình cả khoá (điểm/6)</div>
          <div style={{ height: 130 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart} margin={{ top: 6, right: 6, left: -26, bottom: 0 }}>
                <XAxis dataKey="n" stroke={T.sub} fontSize={10} tickLine={false} />
                <YAxis stroke={T.sub} fontSize={10} tickLine={false} domain={[0, 6]} />
                <Tooltip contentStyle={{ background: T.bg2, border: `1px solid ${T.line2}`, borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="avg" stroke={T.gold} strokeWidth={2.4} dot={{ r: 3, fill: T.gold }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
      {list.map((x, i) => {
        const rk = sessionRank(x.avg);
        const radar = KPI_CRIT.map((k) => ({ k, v: x.kpi?.[k] === 1 ? 1 : 0 }));
        const hasKpi = (x.avg || 0) > 0 || Object.keys(x.kpi || {}).length > 0;
        const buoi = i + 1;
        const songNames = (x.songs || []).map((sg) => sg.ten || sg.link).filter(Boolean);
        const title = songNames.length ? songNames.join(", ") : "Buổi học";
        return (
          <Card key={x.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: T.bg2, border: `1px solid ${T.line2}`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                <div style={{ fontSize: 8, color: T.sub, lineHeight: 1 }}>BUỔI</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, color: T.gold, lineHeight: 1 }}>{buoi}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
                <div style={{ fontSize: 11.5, color: T.sub }}>{fmtDMY(x.date)}{total ? ` · Buổi ${buoi}/${total}` : ` · Buổi ${buoi}`}</div>
              </div>
              <Pill c={rk.c}>{x.avg || 0}/6 · {rk.t}</Pill>
            </div>

            {/* Radar + avg */}
            {hasKpi && (
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 96, background: T.bg2, borderRadius: T.rSm, display: "grid", placeItems: "center", padding: 8 }}>
                  <div style={{ fontSize: 10, color: T.sub }}>ĐIỂM</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 26, color: rk.c }}>{x.avg || 0}<span style={{ fontSize: 13, color: T.sub }}>/6</span></div>
                </div>
                <div style={{ flex: 1, height: 130, background: T.bg2, borderRadius: T.rSm }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radar} outerRadius="72%">
                      <PolarGrid stroke={T.line2} />
                      <PolarAngleAxis dataKey="k" tick={{ fill: T.sub, fontSize: 9 }} />
                      <Radar dataKey="v" stroke={T.gold} fill={T.gold} fillOpacity={0.35} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Songs */}
            {(x.songs || []).map((sg, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, background: T.bg2, borderRadius: T.rSm, padding: "8px 10px", marginBottom: 6 }}>
                <Music2 size={15} color={T.gold} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sg.ten || sg.link}</div>
                  {(sg.noteCao || sg.noteThap) && <div style={{ fontSize: 11, color: T.sub }}>↑{sg.noteCao || "—"} ↓{sg.noteThap || "—"}</div>}
                </div>
                {sg.link && <a href={sg.link} target="_blank" rel="noreferrer" style={{ textDecoration: "none", flexShrink: 0 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: T.bad + "22", color: T.bad, border: `1px solid ${T.bad}55`, borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}><Youtube size={13} /> YouTube</span></a>}
              </div>
            ))}

            {/* Exercises */}
            {(x.exercises || []).length > 0 && (
              <div style={{ marginBottom: 6 }}>
                {x.exercises.map((ex, j) => (
                  <div key={j} style={{ fontSize: 12, color: T.sub, display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                    <BookOpen size={12} color={T.gold} /> {ex.ten || "Bài tập"}
                    {ex.link && <a href={ex.link} target="_blank" rel="noreferrer" style={{ color: T.accent }}><ExternalLink size={11} /></a>}
                  </div>
                ))}
              </div>
            )}

            {/* Notes */}
            {(x.ghiChu || x.amVuc || x.ktKho || (x.ghiChuImgs || []).length > 0) && (
              <div style={{ background: T.bg2, borderRadius: T.rSm, padding: "8px 10px", marginBottom: 8, fontSize: 12.5 }}>
                {(x.amVuc || x.ktKho) && <div style={{ color: T.sub, marginBottom: (x.ghiChu || (x.ghiChuImgs || []).length) ? 4 : 0 }}>Âm vực: {x.amVuc || "—"} · Kỹ thuật: {x.ktKho || "—"}</div>}
                {x.ghiChu && <div>{x.ghiChu}</div>}
                {(x.ghiChuImgs || []).length > 0 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                    {x.ghiChuImgs.map((im) => <NoteImage key={im.id} id={im.id} onOpen={setLb} />)}
                  </div>
                )}
              </div>
            )}

            {/* Saved lesson plan */}
            {x.plan && (x.plan.giaoAn || x.plan.suaBai || x.plan.baiTapVeNha) && <SavedPlan plan={x.plan} />}

            {/* Recordings */}
            <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>
              <div style={{ fontSize: 11, color: T.sub, textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><Mic size={13} color={T.gold} /> Ghi âm luyện tập</div>
              {(x.records || []).map((r) => <RecordingItem key={r.id} r={r} onDelete={rmRecord(x.id, r.id)} />)}
              <Recorder onSave={addRecord(x.id)} flash={flash} />
              {s.driveFolder && <div style={{ fontSize: 10.5, color: T.tx3, marginTop: 6 }}>Lưu tại: {s.driveFolder} / Record</div>}
            </div>
          </Card>
        );
      })}
      <Lightbox src={lb} onClose={() => setLb(null)} />
    </div>
  );
}

/* ---- PROFILE (edit + rank hide/unhide + drive) ---- */
function SongsTab({ s }) {
  const rows = [];
  [...s.sessions].reverse().forEach((se, i) => (se.songs || []).forEach((sg) => rows.push({ ...sg, buoi: i + 1, date: se.date })));
  if (!rows.length) return <Empty icon={<Music2 size={30} />} t="Chưa học bài hát nào" />;
  return (
    <div>
      <H style={{ fontSize: 16, margin: "0 4px 12px" }}>Bài hát đã học ({rows.length})</H>
      {rows.slice().reverse().map((sg, i) => (
        <Card key={i} style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: T.bg2, border: `1px solid ${T.line2}`, display: "grid", placeItems: "center", flexShrink: 0, color: T.gold }}><Music2 size={17} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sg.ten || sg.link}</div>
            <div style={{ fontSize: 11, color: T.sub }}>Buổi {sg.buoi} · {fmtDMY(sg.date)}{(sg.noteCao || sg.noteThap) ? ` · ↑${sg.noteCao || "—"} ↓${sg.noteThap || "—"}` : ""}</div>
          </div>
          {sg.link && <a href={sg.link} target="_blank" rel="noreferrer" style={{ textDecoration: "none", flexShrink: 0 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: T.bad + "22", color: T.bad, border: `1px solid ${T.bad}55`, borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}><Youtube size={13} /> Mở</span></a>}
        </Card>
      ))}
    </div>
  );
}
function ProfileTab({ s, update, db, flash, role }) {
  const [showRank, setShowRank] = useState(false);
  const [e, setE] = useState(false);
  const [f, setF] = useState(s);
  useEffect(() => setF(s), [s.id]);
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const rankReview = () => {
    const lastCao = s.sessions.find((x) => x.noteCao)?.noteCao;
    const lastThap = s.sessions.find((x) => x.noteThap)?.noteThap;
    return { lastCao, lastThap };
  };
  const { lastCao, lastThap } = rankReview();
  const [driveLink, setDriveLink] = useState("");
  const folderName = `${s.rank}.${s.ten}.${s.hocLop}.${fmtDMY(s.ngayBatDau)}`;
  const saveFolderName = () => {
    update({ driveFolder: `${db.settings.driveRoot} / ${folderName}` });
    flash("Đã lưu tên thư mục");
  };
  const saveDriveLink = () => {
    if (!/^https?:\/\//.test(driveLink.trim())) return flash("Dán link Drive hợp lệ (https://...)");
    update({ driveFolder: driveLink.trim() });
    setDriveLink("");
    flash("Đã lưu link Drive");
  };
  const canEdit = role === "admin";

  if (e) {
    return (
      <div>
        <Field label="Họ tên" value={f.ten} onChange={set("ten")} />
        <Row2><Field label="Năm sinh" value={f.namSinh} onChange={set("namSinh")} type="number" /><Field label="SĐT" value={f.sdt} onChange={set("sdt")} /></Row2>
        <Field label="Gmail" value={f.gmail} onChange={set("gmail")} />
        <Field label="Mục tiêu học" value={f.mucTieu} onChange={set("mucTieu")} />
        <Row2><Select label="Lớp" v={f.hocLop} set={set("hocLop")} opts={CLASSES} /><Select label="Giọng" v={f.loaiGiong} set={set("loaiGiong")} opts={GIONG} /></Row2>
        <Row2><Field label="Passaggio" value={f.passaggio} onChange={set("passaggio")} /><Select label="Rank" v={f.rank} set={set("rank")} opts={Object.keys(RANKS)} /></Row2>
        <Row2><Field label="Note cao ban đầu" value={f.noteCaoBanDau} onChange={set("noteCaoBanDau")} /><Field label="Note thấp ban đầu" value={f.noteThapBanDau} onChange={set("noteThapBanDau")} /></Row2>
        <Row2><Field label="Số buổi ĐK" value={f.soBuoiDangKy} onChange={set("soBuoiDangKy")} type="number" /><Select label="Giảng viên" v={f.teacherId} set={set("teacherId")} opts={db.teachers.map((t) => [t.id, t.ten])} /></Row2>
        <Row2><Field label="Ngày khoá mới" value={f.ngayKhoaMoi} onChange={set("ngayKhoaMoi")} type="date" /><Field label="Ngày hết hạn" value={f.ngayHetHan} onChange={set("ngayHetHan")} type="date" /></Row2>
        <div><div style={{ fontSize: 11, color: T.sub, marginBottom: 4, textTransform: "uppercase" }}>Ghi chú rank (chi tiết)</div>
          <textarea value={f.rankNote} onChange={(ev) => set("rankNote")(ev.target.value)} rows={3} style={{ width: "100%", boxSizing: "border-box", background: T.bg2, border: `1px solid ${T.line2}`, borderRadius: 10, padding: 10, color: T.ink, fontFamily: "inherit", fontSize: 13 }} /></div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <Btn kind="dark" onClick={() => { setF(s); setE(false); }} style={{ flex: 1, justifyContent: "center" }}>Huỷ</Btn>
          <Btn onClick={() => { update({ ...f, namSinh: +f.namSinh, soBuoiDangKy: +f.soBuoiDangKy }); setE(false); flash("Đã lưu"); }} style={{ flex: 1, justifyContent: "center" }}><Save size={16} /> Lưu</Btn>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Card style={{ marginBottom: 10 }}>
        <InfoRow k="Năm sinh" v={s.namSinh} /><InfoRow k="Gmail" v={s.gmail} /><InfoRow k="SĐT" v={s.sdt || "—"} /><InfoRow k="Tài khoản" v={s.taiKhoan} />
        <InfoRow k="Mục tiêu" v={s.mucTieu} /><InfoRow k="Passaggio" v={s.passaggio || "—"} />
        <InfoRow k="Bắt đầu" v={s.ngayBatDau} /><InfoRow k="Khoá mới" v={s.ngayKhoaMoi} /><InfoRow k="Hết hạn" v={s.ngayHetHan} />
      </Card>

      <Card style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Star size={16} color={RANKS[s.rank]} /><span style={{ fontWeight: 700 }}>Rank {s.rank}</span></div>
          <button onClick={() => setShowRank(!showRank)} style={{ background: "none", border: "none", color: T.gold, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit", fontSize: 12.5, fontWeight: 600 }}>{showRank ? <EyeOff size={14} /> : <Eye size={14} />}{showRank ? "Ẩn" : "Chi tiết"}</button>
        </div>
        {showRank && <div style={{ marginTop: 10, fontSize: 13, color: T.ink, lineHeight: 1.5, background: T.bg2, borderRadius: 10, padding: 10 }}>{s.rankNote || "Chưa có ghi chú rank."}</div>}
      </Card>

      <Card style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: T.sub, textTransform: "uppercase", marginBottom: 8 }}>Quãng giọng · review</div>
        <div style={{ display: "flex", gap: 10 }}>
          <NoteCol label="Note cao" base={s.noteCaoBanDau} now={lastCao} up />
          <NoteCol label="Note thấp" base={s.noteThapBanDau} now={lastThap} />
        </div>
      </Card>

      <Card style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: T.sub, textTransform: "uppercase", marginBottom: 8 }}>Thư mục Drive</div>

        {s.driveFolder ? (
          <div style={{ marginBottom: canEdit ? 12 : 0 }}>
            <div style={{ fontSize: 10.5, color: T.sub, marginBottom: 3 }}>Đang lưu:</div>
            {/^https?:\/\//.test(s.driveFolder)
              ? <a href={s.driveFolder} target="_blank" rel="noreferrer" style={{ fontSize: 12.5, color: T.accent, wordBreak: "break-all", display: "inline-flex", gap: 6, alignItems: "flex-start" }}><FolderPlus size={14} style={{ flexShrink: 0, marginTop: 2 }} /> {s.driveFolder}</a>
              : <div style={{ fontSize: 12.5, color: T.ink, wordBreak: "break-all", display: "flex", gap: 6, alignItems: "flex-start" }}><FolderPlus size={14} style={{ flexShrink: 0, marginTop: 2 }} /> {s.driveFolder}</div>}
          </div>
        ) : null}

        {canEdit && (
          <>
            <div style={{ background: T.bg2, borderRadius: T.rSm, padding: "9px 11px", marginBottom: 10 }}>
              <div style={{ fontSize: 10.5, color: T.sub, marginBottom: 3 }}>Tên thư mục theo quy tắc</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.gold, wordBreak: "break-all" }}>{folderName}</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <Btn small kind="dark" onClick={saveFolderName}><Save size={14} /> Lưu tên này</Btn>
              <a href="https://drive.google.com/drive/my-drive" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                <Btn small kind="ghost"><ExternalLink size={14} /> Mở Google Drive</Btn>
              </a>
            </div>
            <div style={{ fontSize: 11, color: T.sub, marginBottom: 6, lineHeight: 1.5 }}>
              App chưa tự tạo được thư mục trong Drive. Bạn mở Drive tạo thư mục tên như trên, rồi dán link thư mục vào đây để bấm mở nhanh:
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={driveLink} onChange={(ev) => setDriveLink(ev.target.value)} placeholder="Dán link Google Drive…" style={{ flex: 1, boxSizing: "border-box", background: T.bg2, border: `1px solid ${T.line2}`, borderRadius: 8, padding: "9px 11px", color: T.ink, fontSize: 13, fontFamily: "inherit" }} />
              <Btn small onClick={saveDriveLink}><Save size={14} /></Btn>
            </div>
          </>
        )}
        {!canEdit && !s.driveFolder && <div style={{ fontSize: 12.5, color: T.sub }}>Chưa có</div>}
      </Card>

      {canEdit && <Btn onClick={() => setE(true)} style={{ width: "100%", justifyContent: "center" }}>Chỉnh sửa hồ sơ</Btn>}
    </div>
  );
}
const InfoRow = ({ k, v }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${T.line}`, fontSize: 13 }}>
    <span style={{ color: T.sub }}>{k}</span><span style={{ fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{v}</span>
  </div>
);
const NoteCol = ({ label, base, now, up }) => (
  <div style={{ flex: 1, background: T.bg2, borderRadius: 10, padding: 10, textAlign: "center" }}>
    <div style={{ fontSize: 10.5, color: T.sub }}>{label}</div>
    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 17, marginTop: 2 }}>{now || base || "—"}</div>
    <div style={{ fontSize: 10.5, color: T.sub, marginTop: 2 }}>ban đầu {base || "—"} {now && now !== base && <span style={{ color: T.good }}>{up ? "↑" : "↓"}</span>}</div>
  </div>
);

/* ============================ SCHEDULE ============================ */
function Schedule({ db, setDb, user, me, flash }) {
  const [add, setAdd] = useState(false);
  let items = [];
  if (user.role === "admin") db.students.forEach((s) => s.lichHen.forEach((l) => items.push({ ...l, sName: s.ten, tName: db.teachers.find((t) => t.id === s.teacherId)?.ten })));
  else if (user.role === "gv") db.students.filter((s) => s.teacherId === me.id).forEach((s) => s.lichHen.forEach((l) => items.push({ ...l, sName: s.ten })));
  else me.lichHen?.forEach((l) => items.push({ ...l, sName: me.ten })); // hv sees only own
  items.sort((a, b) => new Date(a.when) - new Date(b.when));
  const upcoming = items.filter((i) => new Date(i.when) >= new Date(new Date().toDateString()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <H style={{ fontSize: 16 }}>{user.role === "hv" ? "Lịch của tôi" : "Lịch học"}</H>
        {user.role !== "hv" && <Btn small onClick={() => setAdd(true)}><Plus size={15} /> Xếp lịch</Btn>}
      </div>
      {upcoming.length === 0 ? <Empty icon={<CalIcon size={30} />} t="Chưa có lịch sắp tới" /> :
        upcoming.map((i, k) => (
          <Card key={k} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{new Date(i.when).toLocaleString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</div>
                <div style={{ fontSize: 12.5, color: T.sub, marginTop: 3 }}>{user.role !== "hv" && <>👤 {i.sName} · </>}{i.tName && <>🎓 {i.tName} · </>}⏱ {i.mins}p</div>
              </div>
              <a href={gcalUrl({ title: `Buổi học · ${i.sName}`, details: "Tiệm Dạy Nhạc", start: i.when, mins: i.mins })} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                <Btn small kind="ghost"><CalIcon size={14} /> Calendar</Btn>
              </a>
            </div>
          </Card>
        ))}
      {add && <AddSchedule db={db} setDb={setDb} me={me} role={user.role} close={() => setAdd(false)} flash={flash} />}
    </div>
  );
}
function AddSchedule({ db, setDb, me, role, close, flash }) {
  const pool = role === "gv" ? db.students.filter((s) => s.teacherId === me.id) : db.students;
  const [sid, setSid] = useState(pool[0]?.id || ""); const [when, setWhen] = useState(""); const [mins, setMins] = useState(60);
  const save = () => {
    if (!sid || !when) return flash("Chọn học viên & thời gian");
    const l = { id: uid(), when, mins: +mins };
    setDb((d) => ({ ...d, students: d.students.map((s) => s.id === sid ? { ...s, lichHen: [...s.lichHen, l] } : s) }));
    flash("Đã xếp lịch"); close();
  };
  return (
    <Sheet close={close} title="Xếp lịch học">
      <Select label="Học viên" v={sid} set={setSid} opts={pool.map((s) => [s.id, s.ten])} />
      <Field label="Thời gian" value={when} onChange={setWhen} type="datetime-local" />
      <Field label="Số phút" value={mins} onChange={setMins} type="number" />
      <Btn onClick={save} style={{ width: "100%", justifyContent: "center", marginTop: 6 }}><Save size={16} /> Lưu lịch</Btn>
    </Sheet>
  );
}

/* ============================ FINANCE (admin) ============================ */
function Finance({ db, setDb, flash }) {
  const [rate, setRate] = useState(db.settings.ratePerSession);
  const saveRate = () => { setDb((d) => ({ ...d, settings: { ...d.settings, ratePerSession: +rate } })); flash("Đã cập nhật đơn giá"); };
  const payouts = db.teachers.map((t) => {
    const cnt = db.students.filter((s) => s.teacherId === t.id).reduce((a, s) => a + s.sessions.length, 0);
    return { ...t, cnt, pay: cnt * db.settings.ratePerSession };
  });
  const totalPay = payouts.reduce((a, t) => a + t.pay, 0);
  const overdue = db.students.filter((s) => (payState(s).d ?? 99) <= 10);
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <Stat icon={<Wallet size={18} />} n={money(totalPay)} t="Chi giảng viên" c={T.warn} />
        <Stat icon={<Bell size={18} />} n={overdue.length} t="HV tới hạn" c={T.bad} />
      </div>
      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: T.sub, textTransform: "uppercase", marginBottom: 8 }}>Đơn giá / buổi cho giảng viên</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={rate} onChange={(e) => setRate(e.target.value)} type="number" style={{ flex: 1, background: T.bg2, border: `1px solid ${T.line2}`, borderRadius: 10, padding: "10px 12px", color: T.ink, fontFamily: "inherit" }} />
          <Btn onClick={saveRate}><Save size={16} /></Btn>
        </div>
      </Card>
      <H style={{ fontSize: 15, margin: "4px 4px 10px" }}>Chi trả giảng viên</H>
      {payouts.map((t) => (
        <Card key={t.id} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontWeight: 700 }}>{t.ten}</div><div style={{ fontSize: 11.5, color: T.sub }}>{t.cnt} buổi × {money(db.settings.ratePerSession)}</div></div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, color: T.gold }}>{money(t.pay)}</div>
        </Card>
      ))}
      <H style={{ fontSize: 15, margin: "16px 4px 10px" }}>Học phí cần thu</H>
      {overdue.length === 0 ? <Empty icon={<CheckCircle2 size={28} />} t="Không có khoản tới hạn" /> :
        overdue.map((s) => { const p = payState(s); return (
          <Card key={s.id} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontWeight: 700 }}>{s.ten}</div><div style={{ fontSize: 11.5, color: T.sub }}>Hết hạn {s.ngayHetHan}</div></div>
            <Pill c={p.c}>{p.d < 0 ? `Trễ ${-p.d}n` : `${p.d}n`}</Pill>
          </Card>
        ); })}
    </div>
  );
}

/* ============================ SETTINGS (admin) ============================ */
function SettingsView({ db, setDb, flash }) {
  const [key, setKey] = useState(db.settings.geminiKey);
  const [root, setRoot] = useState(db.settings.driveRoot);
  const [tab, setTab] = useState("gv");
  const save = () => { setDb((d) => ({ ...d, settings: { ...d.settings, geminiKey: key, driveRoot: root } })); flash("Đã lưu cài đặt"); };
  return (
    <div>
      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}><Sparkles size={16} color={T.gold} /><H style={{ fontSize: 14 }}>AI Gemini</H></div>
        <Field label="Gemini API Key" value={key} onChange={setKey} placeholder="để trống = dùng engine AI sẵn" type="password" />
        <div style={{ fontSize: 11.5, color: T.sub, marginTop: -4, marginBottom: 8 }}>Chưa có key, app vẫn tạo giáo trình bằng engine AI tích hợp.</div>
        <Field label="Thư mục gốc Drive" value={root} onChange={setRoot} />
        <Btn onClick={save} style={{ width: "100%", justifyContent: "center" }}><Save size={16} /> Lưu cài đặt</Btn>
      </Card>

      <div style={{ display: "flex", gap: 6, marginBottom: 12, background: T.bg2, padding: 4, borderRadius: 12 }}>
        {[["gv", "Giảng viên"], ["cls", "Lớp / Drive"]].map(([k, t]) => (
          <button key={k} onClick={() => setTab(k)} style={{ flex: 1, border: "none", borderRadius: 9, padding: "8px", fontSize: 13, fontWeight: 700, cursor: "pointer", background: tab === k ? T.gold : "transparent", color: tab === k ? "#0B2016" : T.sub, fontFamily: "inherit" }}>{t}</button>
        ))}
      </div>

      {tab === "gv" && <TeacherManager db={db} setDb={setDb} flash={flash} />}
      {tab === "cls" && (
        <div>
          {CLASSES.map((c) => {
            const made = db.settings.classesCreated?.includes(c);
            const cnt = db.students.filter((s) => s.hocLop === c).length;
            return (
              <Card key={c} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontWeight: 700 }}>{c}</div><div style={{ fontSize: 11.5, color: T.sub }}>{cnt} học viên</div></div>
                {made ? <Pill c={T.good}>Đã đánh dấu</Pill> : <Btn small kind="ghost" onClick={() => { setDb((d) => ({ ...d, settings: { ...d.settings, classesCreated: [...new Set([...(d.settings.classesCreated || []), c])] } })); flash(`Đã đánh dấu lớp ${c}`); }}><CheckCircle2 size={14} /> Đánh dấu</Btn>}
              </Card>
            );
          })}
          <a href="https://drive.google.com/drive/my-drive" target="_blank" rel="noreferrer" style={{ textDecoration: "none", display: "block", marginTop: 8 }}>
            <Btn kind="ghost" small style={{ width: "100%", justifyContent: "center" }}><ExternalLink size={14} /> Mở Google Drive để tạo thư mục</Btn>
          </a>
          <div style={{ fontSize: 11, color: T.sub, textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
            App chỉ đánh dấu trạng thái, chưa tự tạo thư mục trong Drive. Bạn tự tạo trong "{db.settings.driveRoot}" và đặt tên theo lớp.
          </div>
        </div>
      )}
    </div>
  );
}
function TeacherManager({ db, setDb, flash }) {
  const [add, setAdd] = useState(false);
  const [f, setF] = useState({ ten: "", gmail: "", taiKhoan: "", chuyenMon: "Thanh nhạc", lichTrong: "" });
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const save = () => {
    if (!f.ten || !f.taiKhoan) return flash("Cần Tên & Tài khoản");
    setDb((d) => ({ ...d, teachers: [...d.teachers, { id: uid(), matKhau: "", ...f }] }));
    flash("Đã thêm giảng viên"); setAdd(false); setF({ ten: "", gmail: "", taiKhoan: "", chuyenMon: "Thanh nhạc", lichTrong: "" });
  };
  return (
    <div>
      <Btn small onClick={() => setAdd(!add)} style={{ marginBottom: 10 }}><Plus size={15} /> Thêm giảng viên</Btn>
      {add && (
        <Card style={{ marginBottom: 10 }}>
          <Field label="Họ tên" value={f.ten} onChange={set("ten")} />
          <Row2><Field label="Tài khoản" value={f.taiKhoan} onChange={set("taiKhoan")} /><Field label="Gmail" value={f.gmail} onChange={set("gmail")} /></Row2>
          <Row2><Field label="Chuyên môn" value={f.chuyenMon} onChange={set("chuyenMon")} /><Field label="Lịch trống" value={f.lichTrong} onChange={set("lichTrong")} /></Row2>
          <Btn onClick={save} style={{ width: "100%", justifyContent: "center" }}><Save size={16} /> Lưu</Btn>
        </Card>
      )}
      {db.teachers.map((t) => {
        const cnt = db.students.filter((s) => s.teacherId === t.id).length;
        return (
          <Card key={t.id} style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: T.cardHi, display: "grid", placeItems: "center", color: T.gold }}><User size={19} /></div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>{t.ten}</div><div style={{ fontSize: 11.5, color: T.sub }}>{t.chuyenMon} · {cnt} HV · {t.gmail}</div></div>
          </Card>
        );
      })}
    </div>
  );
}

/* ============================ STUDENT (hv) VIEWS ============================ */
function HvProgress({ s }) {
  const chart = [...s.sessions].reverse().map((x, i) => ({ n: `B${i + 1}`, avg: x.avg || 0 }));
  const left = s.soBuoiDangKy - s.sessions.length;
  return (
    <div>
      <Card style={{ marginBottom: 12, background: `linear-gradient(135deg, ${T.cardHi}, ${T.card})` }}>
        <H style={{ fontSize: 20 }}>Chào {s.ten} 👋</H>
        <div style={{ fontSize: 12.5, color: T.sub, marginTop: 4 }}>Mục tiêu: {s.mucTieu}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <MiniStat n={s.sessions.length} t="Đã học" />
          <MiniStat n={left} t="Còn lại" c={left <= 2 ? T.bad : T.good} />
          <MiniStat n={s.rank} t="Rank" c={RANKS[s.rank]} />
        </div>
      </Card>
      {chart.length > 1 && (
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: T.sub, textTransform: "uppercase", marginBottom: 6 }}>Tiến bộ của tôi</div>
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
                <XAxis dataKey="n" stroke={T.sub} fontSize={10} tickLine={false} /><YAxis stroke={T.sub} fontSize={10} domain={[0, 6]} tickLine={false} />
                <Tooltip contentStyle={{ background: T.bg2, border: `1px solid ${T.line2}`, borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="avg" stroke={T.gold} strokeWidth={2.4} dot={{ r: 3, fill: T.gold }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
      <Card>
        <div style={{ fontSize: 11, color: T.sub, textTransform: "uppercase", marginBottom: 8 }}>Quãng giọng</div>
        <div style={{ display: "flex", gap: 10 }}>
          <NoteCol label="Note cao" base={s.noteCaoBanDau} now={s.sessions.find((x) => x.noteCao)?.noteCao} up />
          <NoteCol label="Note thấp" base={s.noteThapBanDau} now={s.sessions.find((x) => x.noteThap)?.noteThap} />
        </div>
      </Card>
    </div>
  );
}
function HvProfile({ s, db }) {
  const teacher = db.teachers.find((t) => t.id === s.teacherId);
  return (
    <div>
      <HvProgress s={s} />
      <Card style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, color: T.sub, textTransform: "uppercase", marginBottom: 8 }}>Thông tin học viên</div>
        <InfoRow k="Năm sinh" v={s.namSinh} />
        <InfoRow k="Gmail" v={s.gmail} />
        <InfoRow k="SĐT" v={s.sdt || "—"} />
        <InfoRow k="Mục tiêu" v={s.mucTieu} />
        <InfoRow k="Loại giọng" v={s.loaiGiong} />
        <InfoRow k="Passaggio" v={s.passaggio || "—"} />
        <InfoRow k="Lớp" v={s.hocLop} />
        <InfoRow k="Giảng viên" v={teacher?.ten} />
        <InfoRow k="Bắt đầu" v={s.ngayBatDau} />
        <InfoRow k="Hết hạn" v={s.ngayHetHan} />
      </Card>
    </div>
  );
}

function ExerciseLibrary({ db, setDb, role, flash, s }) {
  const [add, setAdd] = useState(false);
  const canEdit = role === "admin" || role === "gv";
  const lib = db.baiTap || [];
  const personal = [];
  if (s) s.sessions.forEach((se) => (se.plan?.luyenThanh || []).forEach((l) => personal.push({ text: typeof l === "string" ? l : (l.moTa ? `${l.ten}: ${l.moTa}` : l.ten), song: (se.songs && se.songs[0] && (se.songs[0].ten || se.songs[0].link)) || "", date: se.date })));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <H style={{ fontSize: 16 }}>Kho bài tập</H>
        {canEdit && <Btn small onClick={() => setAdd(true)}><Plus size={15} /> Thêm</Btn>}
      </div>

      {s && personal.length > 0 && (
        <Card style={{ marginBottom: 12, borderColor: T.goldSoft }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: T.sub, textTransform: "uppercase" }}>Bài tập của tôi (từ buổi học)</div>
            {canEdit && <Btn small kind="ghost" onClick={() => setAdd(true)}><Youtube size={14} /> Gắn link</Btn>}
          </div>
          {personal.slice(0, 8).map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 7 }}>
              <Mic2 size={14} color={T.gold} style={{ marginTop: 2, flexShrink: 0 }} />
              <div><div style={{ fontSize: 13 }}>{p.text}</div><div style={{ fontSize: 11, color: T.sub }}>🎵 {p.song} · {fmtDMY(p.date)}</div></div>
            </div>
          ))}
        </Card>
      )}

      <div style={{ fontSize: 11, color: T.sub, textTransform: "uppercase", margin: "0 4px 8px" }}>Tất cả bài tập</div>
      {lib.length === 0 ? <Empty icon={<BookOpen size={30} />} t="Chưa có bài tập" /> :
        lib.map((b) => {
          const inner = (
            <Card style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 10, cursor: b.link ? "pointer" : "default" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: T.bg2, border: `1px solid ${T.line2}`, display: "grid", placeItems: "center", color: b.link ? T.bad : T.gold, flexShrink: 0 }}>{b.link ? <Youtube size={17} /> : <BookOpen size={16} />}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{b.ten}</div>
                {b.moTa && <div style={{ fontSize: 12, color: T.sub, lineHeight: 1.4 }}>{b.moTa}</div>}
              </div>
              {b.link && <ExternalLink size={15} color={T.sub} style={{ flexShrink: 0 }} />}
              {canEdit && <button onClick={(ev) => { ev.preventDefault(); ev.stopPropagation(); setDb((d) => ({ ...d, baiTap: (d.baiTap || []).filter((x) => x.id !== b.id) })); flash("Đã xoá"); }} style={{ background: "none", border: "none", color: T.bad, cursor: "pointer", flexShrink: 0 }}><Trash2 size={15} /></button>}
            </Card>
          );
          return b.link
            ? <a key={b.id} href={b.link} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "inherit" }}>{inner}</a>
            : <div key={b.id}>{inner}</div>;
        })}
      {add && <AddExercise db={db} setDb={setDb} close={() => setAdd(false)} flash={flash} />}
    </div>
  );
}
function AddExercise({ db, setDb, close, flash }) {
  const [f, setF] = useState({ ten: "", link: "", moTa: "" });
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const save = () => {
    if (!f.ten) return flash("Nhập tên bài tập");
    setDb((d) => ({ ...d, baiTap: [{ id: uid(), ...f }, ...(d.baiTap || [])] }));
    flash("Đã thêm bài tập"); close();
  };
  return (
    <Sheet close={close} title="Thêm bài tập">
      <Field label="Tên bài tập" value={f.ten} onChange={set("ten")} placeholder="VD: Luyện passaggio quãng 5" />
      <Field label="Link YouTube" value={f.link} onChange={set("link")} placeholder="dán link… (bấm vào bài sẽ mở link này)" />
      <Field label="Mô tả (tuỳ chọn)" value={f.moTa} onChange={set("moTa")} placeholder="cách tập, số lần…" />
      <Btn onClick={save} style={{ width: "100%", justifyContent: "center", marginTop: 6 }}><Save size={16} /> Lưu bài tập</Btn>
    </Sheet>
  );
}

/* ============================ SHARED SMALL COMPONENTS ============================ */
function Sheet({ children, close, title }) {
  const mobile = useIsMobile();
  return (
    <div onClick={close} style={{ position: "fixed", inset: 0, background: "#000A", zIndex: 60, display: "flex", alignItems: mobile ? "flex-end" : "center", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: T.bg2, borderRadius: mobile ? "22px 22px 0 0" : T.r, padding: 20, width: "100%", maxWidth: mobile ? 460 : 520, maxHeight: "88vh", overflowY: "auto", border: `1px solid ${T.line}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <H style={{ fontSize: 18 }}>{title}</H>
          <button onClick={close} style={{ background: T.card, border: "none", borderRadius: 10, padding: 6, color: T.sub, cursor: "pointer" }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
const Row2 = ({ children }) => <div style={{ display: "flex", gap: 10 }}>{Array.isArray(children) ? children.map((c, i) => <div key={i} style={{ flex: 1 }}>{c}</div>) : children}</div>;
function Select({ label, v, set, opts }) {
  return (
    <label style={{ display: "block", marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: T.sub, marginBottom: 4, textTransform: "uppercase" }}>{label}</div>
      <select value={v} onChange={(e) => set(e.target.value)} style={{ width: "100%", background: T.bg2, border: `1px solid ${T.line2}`, borderRadius: T.rSm, padding: "10px 12px", color: T.ink, fontFamily: "inherit", fontSize: 14 }}>
        {opts.map((o) => Array.isArray(o) ? <option key={o[0]} value={o[0]}>{o[1]}</option> : <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
