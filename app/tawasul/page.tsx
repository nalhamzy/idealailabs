import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tawasul · تواصل — WhatsApp AI Assistant for your business",
  description:
    "Tawasul by Ideal Intelligence — connect your WhatsApp number and let an AI assistant answer your customers instantly, 24/7, in Arabic and English.",
};

const WA_CONTACT = "https://wa.me/96890944196"; // update to the studio's sales number if different

export default function TawasulPage() {
  return (
    <main style={S.page}>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={S.hero}>
        <div style={S.brand}>
          <span style={S.diamond} />
          <b>Tawasul</b>
          <span style={S.brandAr}>· تواصل</span>
        </div>
        <h1 style={S.h1}>
          مساعد واتساب ذكي لأعمالك
          <span style={S.h1en}>An AI assistant that answers your customers on WhatsApp</span>
        </h1>
        <p style={S.lead}>
          اربط رقم واتساب الخاص بعملك ودع الذكاء الاصطناعي يرد على عملائك فورًا، على مدار الساعة،
          بالعربية والإنجليزية.
          <span style={S.leadEn}>
            Connect your business number and let AI reply instantly — 24/7, in Arabic &amp; English.
          </span>
        </p>
        <div style={S.ctaRow}>
          <Link href="/onboard" style={S.ctaPrimary}>
            ابدأ الآن · Connect WhatsApp
          </Link>
          <a href={WA_CONTACT} target="_blank" rel="noreferrer" style={S.ctaGhost}>
            تحدّث إلينا · Talk to us
          </a>
        </div>
        <p style={S.micro}>إعداد في أقل من 3 دقائق · Setup in under 3 minutes</p>
      </section>

      {/* ── Value props ────────────────────────────────────── */}
      <section style={S.section}>
        <div style={S.grid}>
          {VALUES.map((v) => (
            <div key={v.t} style={S.card}>
              <div style={S.ic}>{v.ic}</div>
              <div style={S.cardT}>{v.t}</div>
              <div style={S.cardEn}>{v.en}</div>
              <p style={S.cardP}>{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section style={S.section}>
        <h2 style={S.h2}>
          كيف يعمل؟ <span style={S.h2en}>How it works</span>
        </h2>
        <div style={S.steps}>
          {STEPS.map((s, i) => (
            <div key={s.t} style={S.step}>
              <div style={S.stepNum}>{i + 1}</div>
              <div>
                <div style={S.cardT}>{s.t}</div>
                <div style={S.cardEn}>{s.en}</div>
                <p style={S.cardP}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA band ───────────────────────────────────────── */}
      <section style={S.band}>
        <h2 style={{ ...S.h2, margin: "0 0 6px" }}>جاهز للبدء؟ · Ready to start?</h2>
        <p style={{ ...S.lead, margin: "0 0 18px" }}>
          اربط واتساب عملك اليوم.
          <span style={S.leadEn}>Connect your business WhatsApp today.</span>
        </p>
        <Link href="/onboard" style={S.ctaPrimary}>
          ابدأ الآن · Connect WhatsApp
        </Link>
      </section>

      <footer style={S.foot}>
        Tawasul · تواصل — by <b>Ideal Intelligence</b> · الأمثل للذكاء الاصطناعي · Muscat, Oman ·{" "}
        <a href="mailto:idealailabs@gmail.com" style={S.a}>idealailabs@gmail.com</a>
        <br />
        <a href="/privacy" style={S.a}>Privacy Policy</a>
      </footer>
    </main>
  );
}

const VALUES = [
  { ic: "⚡", t: "ردود فورية 24/7", en: "Instant 24/7 replies", d: "لا تفوّت أي عميل — يرد المساعد في أي وقت من اليوم." },
  { ic: "🌍", t: "عربي وإنجليزي", en: "Arabic & English", d: "يفهم ويرد بلغة عميلك بطلاقة." },
  { ic: "🔗", t: "رقمك يبقى لك", en: "Keep your number", d: "نربط رقم واتساب عملك الحالي أو رقمًا جديدًا." },
  { ic: "🤖", t: "مخصّص لنشاطك", en: "Tailored to you", d: "نُدرّب المساعد على خدماتك وأسئلتك المتكررة." },
];

const STEPS = [
  { t: "اربط واتساب", en: "Connect WhatsApp", d: "اضغط زر الربط وسجّل دخولك وتحقق من رقمك — أقل من 3 دقائق." },
  { t: "نبني مساعدك", en: "We build your bot", d: "نُعدّ المساعد بمعلومات نشاطك ونبرة صوت علامتك." },
  { t: "يرد على عملائك", en: "It answers customers", d: "يبدأ المساعد بالرد تلقائيًا على رسائل عملائك فورًا." },
];

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    color: "#e8eefc",
    fontFamily: '"Segoe UI",Tahoma,system-ui,sans-serif',
    background: "radial-gradient(1100px 600px at 50% -120px,#0f2150,#0a1733 55%)",
    textAlign: "center",
  },
  hero: { maxWidth: 760, margin: "0 auto", padding: "72px 22px 28px" },
  brand: { display: "inline-flex", alignItems: "center", gap: 9, fontSize: 18, marginBottom: 22 },
  diamond: { width: 15, height: 15, background: "#22d3ee", transform: "rotate(45deg)", borderRadius: 3, boxShadow: "0 0 18px #22d3ee" },
  brandAr: { color: "#9fb0d4", fontSize: 16 },
  h1: { fontSize: 34, lineHeight: 1.25, margin: "0 0 14px", fontWeight: 800 },
  h1en: { display: "block", fontSize: 17, fontWeight: 500, color: "#bcd0f5", marginTop: 8 },
  lead: { fontSize: 16, color: "#cdd8f0", lineHeight: 1.8, margin: "0 0 26px" },
  leadEn: { display: "block", fontSize: 14, color: "#9fb0d4", marginTop: 6 },
  ctaRow: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },
  ctaPrimary: {
    display: "inline-block", textDecoration: "none", borderRadius: 12, padding: "14px 26px",
    fontSize: 15.5, fontWeight: 800, color: "#031018",
    background: "linear-gradient(90deg,#22d3ee,#06b6d4)", boxShadow: "0 12px 32px rgba(34,211,238,.32)",
  },
  ctaGhost: {
    display: "inline-block", textDecoration: "none", borderRadius: 12, padding: "14px 24px",
    fontSize: 15.5, fontWeight: 700, color: "#e8eefc", border: "1px solid rgba(255,255,255,.18)",
  },
  micro: { marginTop: 16, fontSize: 12.5, color: "#9fb0d4" },
  section: { maxWidth: 960, margin: "0 auto", padding: "26px 22px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 },
  card: {
    background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.10)",
    borderRadius: 16, padding: "22px 18px", textAlign: "center",
  },
  ic: { fontSize: 28 },
  cardT: { fontWeight: 800, fontSize: 16, marginTop: 8 },
  cardEn: { color: "#9fb0d4", fontSize: 12.5, marginTop: 2 },
  cardP: { color: "#cdd8f0", fontSize: 13.5, lineHeight: 1.7, marginTop: 8 },
  h2: { fontSize: 24, fontWeight: 800, margin: "0 0 20px" },
  h2en: { color: "#9fb0d4", fontSize: 16, fontWeight: 600 },
  steps: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 },
  step: {
    display: "flex", gap: 14, alignItems: "flex-start", textAlign: "start",
    background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.10)",
    borderRadius: 16, padding: 18,
  },
  stepNum: {
    flex: "0 0 34px", height: 34, borderRadius: "50%", color: "#031018", fontWeight: 800,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg,#22d3ee,#06b6d4)",
  },
  band: {
    maxWidth: 760, margin: "20px auto 0", padding: "40px 22px",
    borderTop: "1px solid rgba(255,255,255,.10)",
  },
  foot: { color: "#9fb0d4", fontSize: 12, padding: "34px 22px 56px", lineHeight: 1.9 },
  a: { color: "#22d3ee", textDecoration: "none" },
};
