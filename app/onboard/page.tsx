"use client";

import { useEffect, useState } from "react";

// Standalone client-onboarding page for WhatsApp Embedded Signup.
// A client (e.g. a coffee shop) opens idealailabs.com/onboard, clicks the button,
// logs in with their own Facebook business account, and connects their WhatsApp
// number to our "Ideal Intelligence" Meta app — in under 3 minutes.
//
// Required env (NEXT_PUBLIC_* are exposed to the browser, which is fine — these
// are not secrets):
//   NEXT_PUBLIC_WA_APP_ID      = 1666901441099073
//   NEXT_PUBLIC_WA_CONFIG_ID   = <the ES Configuration ID you created>
// Server-only secret (used by /api/whatsapp/onboard): WHATSAPP_APP_SECRET.

const APP_ID = process.env.NEXT_PUBLIC_WA_APP_ID || "1666901441099073";
const CONFIG_ID = process.env.NEXT_PUBLIC_WA_CONFIG_ID || "";
const GRAPH_VERSION = "v23.0";

declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

type Status = { msg: string; kind?: "ok" | "err" };

export default function OnboardPage() {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<Status>({ msg: "" });
  const [session, setSession] = useState<{ waba_id?: string; phone_number_id?: string }>({});

  useEffect(() => {
    // Load the Facebook JS SDK once.
    window.fbAsyncInit = function () {
      window.FB?.init({ appId: APP_ID, cookie: true, xfbml: false, version: GRAPH_VERSION });
      setReady(true);
    };
    if (!document.getElementById("facebook-jssdk")) {
      const js = document.createElement("script");
      js.id = "facebook-jssdk";
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.async = true;
      js.defer = true;
      js.crossOrigin = "anonymous";
      document.body.appendChild(js);
    } else if (window.FB) {
      setReady(true);
    }

    // The Embedded Signup iframe posts the WABA + phone-number ids back to us.
    const onMessage = (event: MessageEvent) => {
      let host = "";
      try {
        host = new URL(event.origin).hostname;
      } catch {
        return;
      }
      if (!/facebook\.com$/.test(host)) return;
      try {
        const data = JSON.parse(event.data);
        if (data.type === "WA_EMBEDDED_SIGNUP") {
          if (data.event === "FINISH") {
            setSession({ waba_id: data.data?.waba_id, phone_number_id: data.data?.phone_number_id });
          } else if (data.event === "CANCEL") {
            setStatus({ msg: "تم إلغاء الربط. / Connection cancelled.", kind: "err" });
          }
        }
      } catch {
        /* non-JSON postMessage — ignore */
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  function connect() {
    if (!CONFIG_ID) {
      setStatus({ msg: "⚠️ NEXT_PUBLIC_WA_CONFIG_ID is not set yet.", kind: "err" });
      return;
    }
    setStatus({ msg: "" });
    window.FB?.login(
      (response: any) => {
        const code = response?.authResponse?.code;
        if (!code) {
          setStatus({ msg: "لم يكتمل تسجيل الدخول. / Sign-in not completed.", kind: "err" });
          return;
        }
        setStatus({ msg: "جارٍ إكمال الربط… / Finalizing…" });
        fetch("/api/whatsapp/onboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, ...session }),
        })
          .then((r) =>
            r.ok
              ? setStatus({
                  msg: "تم ربط واتساب بنجاح ✅ سنتواصل معك قريبًا. / WhatsApp connected — we'll be in touch shortly.",
                  kind: "ok",
                })
              : setStatus({ msg: "تعذّر إكمال الربط، حاول مجددًا. / Couldn't finalize, please retry.", kind: "err" })
          )
          .catch(() => setStatus({ msg: "خطأ في الشبكة. / Network error.", kind: "err" }));
      },
      {
        config_id: CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        extras: { setup: {}, featureType: "", sessionInfoVersion: "3" },
      }
    );
  }

  return (
    <main dir="rtl" style={S.body}>
      <section style={S.card}>
        <div style={S.brand}>
          <span style={S.diamond} />
          <b style={{ fontSize: 15, letterSpacing: 0.3 }}>IdealIntelligence</b>
        </div>

        <h1 style={S.h1}>
          اربط حساب واتساب الخاص بك
          <span style={S.en}>Connect your WhatsApp Business number</span>
        </h1>
        <p style={S.sub}>
          اربط رقم عملك في أقل من 3 دقائق لتفعيل المساعد الآلي.
          <span style={S.en}>Link your business number in under 3 minutes to activate your AI assistant.</span>
        </p>

        <ol style={S.steps}>
          {[
            ["1", "سجّل الدخول بحساب فيسبوك الخاص بعملك", "Log in with your business Facebook account"],
            ["2", "اختر أو أنشئ حساب واتساب للأعمال", "Select or create your WhatsApp Business account"],
            ["3", "أدخل رقم هاتفك وتحقق منه برمز SMS", "Enter your phone number & verify via SMS code"],
          ].map(([n, ar, en]) => (
            <li key={n} style={S.step}>
              <span style={S.num}>{n}</span>
              <div>
                {ar}
                <span style={S.en}>{en}</span>
              </div>
            </li>
          ))}
        </ol>

        <button onClick={connect} disabled={!ready} style={{ ...S.btn, ...(ready ? {} : S.btnDisabled) }}>
          {ready ? "ربط واتساب الآن · Connect WhatsApp" : "جارٍ التحميل… / Loading…"}
        </button>

        {status.msg ? (
          <p style={{ ...S.status, ...(status.kind === "ok" ? S.ok : status.kind === "err" ? S.err : {}) }}>
            {status.msg}
          </p>
        ) : null}

        <p style={S.foot}>Powered by Meta WhatsApp Business Platform · idealailabs.com</p>
      </section>
    </main>
  );
}

const S: Record<string, React.CSSProperties> = {
  body: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    color: "#e8eefc",
    fontFamily: '"Segoe UI",Tahoma,system-ui,sans-serif',
    background: "radial-gradient(1200px 600px at 50% -10%, #0f2150, #0a1733 60%)",
  },
  card: {
    width: "100%",
    maxWidth: 460,
    background: "rgba(255,255,255,.04)",
    border: "1px solid rgba(255,255,255,.10)",
    borderRadius: 20,
    padding: "32px 28px",
    boxShadow: "0 24px 60px rgba(0,0,0,.45)",
  },
  brand: { display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 18 },
  diamond: {
    width: 14,
    height: 14,
    background: "#22d3ee",
    transform: "rotate(45deg)",
    borderRadius: 2,
    boxShadow: "0 0 16px #22d3ee",
  },
  h1: { fontSize: 22, margin: "6px 0 4px", textAlign: "center" },
  sub: { color: "#9fb0d4", fontSize: 14, textAlign: "center", margin: "0 0 22px", lineHeight: 1.7 },
  en: { direction: "ltr", display: "block", color: "#9fb0d4", fontSize: 12.5, marginTop: 4 },
  steps: { listStyle: "none", padding: 0, margin: "0 0 24px" },
  step: { display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", fontSize: 13.5, color: "#9fb0d4" },
  num: {
    flex: "0 0 22px",
    height: 22,
    borderRadius: "50%",
    background: "rgba(34,211,238,.15)",
    color: "#22d3ee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
  },
  btn: {
    width: "100%",
    border: 0,
    cursor: "pointer",
    borderRadius: 12,
    padding: "15px 18px",
    fontSize: 15.5,
    fontWeight: 700,
    color: "#031018",
    background: "linear-gradient(90deg,#22d3ee,#06b6d4)",
    boxShadow: "0 10px 30px rgba(34,211,238,.30)",
  },
  btnDisabled: { opacity: 0.55, cursor: "not-allowed", boxShadow: "none" },
  status: { marginTop: 18, fontSize: 13, textAlign: "center", lineHeight: 1.6 },
  ok: { color: "#34d399" },
  err: { color: "#f87171" },
  foot: { marginTop: 22, textAlign: "center", color: "#9fb0d4", fontSize: 11.5, direction: "ltr" },
};
