import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy · Ideal Intelligence",
  description:
    "How Ideal Intelligence (الأمثل للذكاء الاصطناعي) collects, uses, and protects data — including WhatsApp Business Platform messaging on behalf of our clients.",
};

const UPDATED = "27 June 2026";
const CONTACT = "idealailabs@gmail.com";

export default function PrivacyPage() {
  return (
    <main style={S.page}>
      <article style={S.card}>
        <header style={{ marginBottom: 28 }}>
          <div style={S.brand}>
            <span style={S.diamond} />
            <b>Ideal Intelligence</b>
            <span style={S.muted}>· الأمثل للذكاء الاصطناعي</span>
          </div>
          <h1 style={S.h1}>Privacy Policy</h1>
          <p style={S.muted}>Last updated: {UPDATED}</p>
        </header>

        <Section title="1. Who we are">
          <p style={S.p}>
            Ideal Intelligence (“الأمثل للذكاء الاصطناعي”, “we”, “us”) is a software studio based in
            Muscat, Oman. We build AI applications, automations, and WhatsApp chatbots for businesses.
            This policy explains what data we process and why, including data handled through the
            WhatsApp Business Platform on behalf of our business clients.
          </p>
        </Section>

        <Section title="2. Information we collect">
          <ul style={S.ul}>
            <li>
              <b>Contact &amp; enquiry data</b> — name, email, phone/WhatsApp number, company, and the
              details you submit through our website forms.
            </li>
            <li>
              <b>WhatsApp onboarding data</b> — when a business connects its WhatsApp Business account
              to our platform, we receive the WhatsApp Business Account ID, phone number ID, and an
              access token that lets us send and receive messages on that business’s behalf.
            </li>
            <li>
              <b>Conversation data</b> — messages exchanged between a connected business and its
              customers over WhatsApp, processed so our assistant can respond.
            </li>
            <li>
              <b>Technical data</b> — basic logs (timestamps, error logs) needed to operate and secure
              the service.
            </li>
          </ul>
        </Section>

        <Section title="3. How we use information">
          <ul style={S.ul}>
            <li>To provide and operate chatbot, automation, and messaging services.</li>
            <li>To respond to enquiries and deliver the services our clients request.</li>
            <li>To maintain, secure, debug, and improve our services.</li>
            <li>To comply with legal obligations and the platform terms below.</li>
          </ul>
        </Section>

        <Section title="4. WhatsApp Business Platform & Meta">
          <p style={S.p}>
            We use the WhatsApp Business Platform provided by Meta Platforms, Inc. When a business
            connects its number and exchanges messages with customers, that content is transmitted
            to and processed by Meta in accordance with the{" "}
            <a style={S.a} href="https://www.whatsapp.com/legal/business-policy/" target="_blank" rel="noreferrer">
              WhatsApp Business Messaging Policy
            </a>{" "}
            and{" "}
            <a style={S.a} href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noreferrer">
              Meta’s Privacy Policy
            </a>
            . We act as a technology provider for the connecting business; that business is the
            controller of its own customer conversations.
          </p>
        </Section>

        <Section title="5. Sharing">
          <p style={S.p}>
            We do not sell personal data. We share data only with: (a) Meta/WhatsApp to deliver
            messaging; (b) infrastructure and email providers that operate our service (e.g. hosting
            and transactional email); and (c) authorities where required by law.
          </p>
        </Section>

        <Section title="6. Retention">
          <p style={S.p}>
            We keep data only as long as needed to provide the service or as required by law. Access
            tokens and connection records are retained for the duration of the client engagement and
            deleted on request or termination.
          </p>
        </Section>

        <Section title="7. Security">
          <p style={S.p}>
            Access tokens and secrets are stored server-side only and are never exposed in the
            browser. We apply reasonable technical and organisational measures to protect data, though
            no method of transmission or storage is completely secure.
          </p>
        </Section>

        <Section title="8. Your rights & data deletion">
          <p style={S.p}>
            You may request access to, correction of, or deletion of your personal data, and you may
            ask a connected business to stop messaging you at any time by replying “STOP”. To request
            deletion of data we hold, email{" "}
            <a style={S.a} href={`mailto:${CONTACT}`}>{CONTACT}</a> with the subject “Data deletion”.
            We will action verified requests within 30 days.
          </p>
        </Section>

        <Section title="9. Children">
          <p style={S.p}>Our services are intended for businesses and are not directed at children under 16.</p>
        </Section>

        <Section title="10. Changes & contact">
          <p style={S.p}>
            We may update this policy and will revise the “last updated” date above. Questions or
            requests: <a style={S.a} href={`mailto:${CONTACT}`}>{CONTACT}</a>, Muscat, Oman.
          </p>
        </Section>

        <hr style={S.hr} />

        <section dir="rtl" style={{ textAlign: "right" }}>
          <h2 style={S.h2}>ملخص بالعربية</h2>
          <p style={S.p}>
            الأمثل للذكاء الاصطناعي شركة برمجيات في مسقط، عُمان، تقدم تطبيقات الذكاء الاصطناعي
            والأتمتة وروبوتات واتساب للأعمال. نجمع بيانات التواصل والرسائل اللازمة لتشغيل خدماتنا،
            ونعالج رسائل واتساب نيابة عن عملائنا من الأعمال عبر منصة واتساب للأعمال من Meta ووفقًا
            لسياساتها. لا نبيع بياناتك الشخصية. لطلب الوصول إلى بياناتك أو حذفها، راسلنا على{" "}
            <a style={S.a} href={`mailto:${CONTACT}`}>{CONTACT}</a> وسنستجيب خلال 30 يومًا.
          </p>
        </section>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 22 }}>
      <h2 style={S.h2}>{title}</h2>
      {children}
    </section>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0a1733",
    color: "#e8eefc",
    padding: "48px 20px",
    fontFamily: '"Segoe UI",Tahoma,system-ui,sans-serif',
  },
  card: { maxWidth: 820, margin: "0 auto", lineHeight: 1.7 },
  brand: { display: "flex", alignItems: "center", gap: 8, fontSize: 15, marginBottom: 18 },
  diamond: { width: 12, height: 12, background: "#22d3ee", transform: "rotate(45deg)", borderRadius: 2 },
  h1: { fontSize: 30, margin: "0 0 6px" },
  h2: { fontSize: 18, margin: "0 0 8px", color: "#bcd0f5" },
  p: { margin: "0 0 10px", color: "#cdd8f0", fontSize: 15 },
  ul: { margin: "0 0 10px", paddingInlineStart: 20, color: "#cdd8f0", fontSize: 15 },
  a: { color: "#22d3ee", textDecoration: "none" },
  muted: { color: "#9fb0d4", fontSize: 13 },
  hr: { border: 0, borderTop: "1px solid rgba(255,255,255,.12)", margin: "28px 0" },
};
