"use client";

import { useState } from "react";
import { Bot, BrainCircuit, Send, UserRound } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { botPersonas } from "@/lib/platform";

type Message = {
  role: "user" | "assistant";
  body: string;
};

type Trace = {
  intent: string;
  slots: Record<string, string>;
  tool: string;
  confidence: number;
  nextAction: string;
};

const copy = {
  en: {
    title: "WhatsApp Chatbot Lab",
    subtitle: "Test three web-based WhatsApp bot prototypes. The right panel shows the business-side trace: intent, slots, tool call, confidence, and next action.",
    trace: "Business trace",
    message: "Type a customer message",
    send: "Send",
    quick: "Try",
  },
  ar: {
    title: "مختبر روبوتات واتساب",
    subtitle: "جرّب ثلاثة روبوتات واتساب داخل الويب. اللوحة الجانبية تعرض ما يراه العمل: النية، البيانات المستخرجة، الأداة، الثقة، والخطوة التالية.",
    trace: "تتبع العمل",
    message: "اكتب رسالة عميل",
    send: "إرسال",
    quick: "جرّب",
  },
} as const;

export default function WhatsAppBotsDemo({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [personaId, setPersonaId] = useState(botPersonas[0].id);
  const persona = botPersonas.find((item) => item.id === personaId) ?? botPersonas[0];
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", body: persona.starter[locale] },
  ]);
  const [input, setInput] = useState("");
  const [trace, setTrace] = useState<Trace>({
    intent: "welcome",
    slots: {},
    tool: "load_persona_playbook",
    confidence: 1,
    nextAction: "Wait for customer message",
  });
  const [loading, setLoading] = useState(false);

  function switchPersona(id: string) {
    const next = botPersonas.find((item) => item.id === id) ?? botPersonas[0];
    setPersonaId(id);
    setMessages([{ role: "assistant", body: next.starter[locale] }]);
    setTrace({
      intent: "welcome",
      slots: {},
      tool: "load_persona_playbook",
      confidence: 1,
      nextAction: "Wait for customer message",
    });
  }

  async function sendMessage(value = input) {
    const body = value.trim();
    if (!body) return;
    setInput("");
    setMessages((current) => [...current, { role: "user", body }]);
    setLoading(true);
    const res = await fetch("/api/demo/chatbot/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona: personaId, message: body, locale }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok) {
      setMessages((current) => [...current, { role: "assistant", body: data.reply }]);
      setTrace(data.trace);
    } else {
      setMessages((current) => [
        ...current,
        { role: "assistant", body: "I could not process that message. Please try again." },
      ]);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.72fr_1fr_0.72fr]">
      <aside className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
        <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-emerald-600 dark:text-emerald-300">
          <Bot className="h-4 w-4" />
          Web WhatsApp simulation
        </div>
        <h2 className="mt-2 font-display text-3xl font-bold">{t.title}</h2>
        <p className="mt-3 text-sm leading-6 text-[rgb(var(--text-muted))]">
          {t.subtitle}
        </p>
        <div className="mt-6 space-y-3">
          {botPersonas.map((item) => (
            <button
              key={item.id}
              onClick={() => switchPersona(item.id)}
              className={`w-full rounded-lg border px-4 py-3 text-start transition ${
                item.id === personaId
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-[rgb(var(--border))] hover:bg-[rgb(var(--surface-2))]"
              }`}
            >
              <div className="font-semibold">{item.name[locale]}</div>
              <div className="text-sm text-[rgb(var(--text-muted))]">
                {item.business[locale]}
              </div>
            </button>
          ))}
        </div>
        <div className="mt-6">
          <div className="text-sm font-semibold">{t.quick}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {persona.quick[locale].map((item) => (
              <button
                key={item}
                onClick={() => sendMessage(item)}
                className="rounded-full border border-[rgb(var(--border))] px-3 py-1.5 text-xs hover:bg-[rgb(var(--surface-2))]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="overflow-hidden rounded-lg border border-[rgb(var(--border))] bg-[#0b141a] text-white">
        <div className="border-b border-white/10 bg-[#202c33] px-5 py-4">
          <div className="font-display text-xl font-bold">{persona.business[locale]}</div>
          <div className="text-sm text-white/60">online</div>
        </div>
        <div className="h-[560px] space-y-3 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.14),_transparent_35%)] p-5">
          {messages.map((message, index) => (
            <div
              key={`${message.body}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 shadow ${
                  message.role === "user" ? "bg-[#005c4b]" : "bg-[#202c33]"
                }`}
              >
                {message.body}
              </div>
            </div>
          ))}
          {loading && (
            <div className="inline-flex rounded-lg bg-[#202c33] px-4 py-3 text-sm">
              typing...
            </div>
          )}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }}
          className="flex gap-3 border-t border-white/10 bg-[#202c33] p-4"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t.message}
            className="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50"
          />
          <button
            type="submit"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600"
            aria-label={t.send}
          >
            <Send className="h-4 w-4 rtl:rotate-180" />
          </button>
        </form>
      </section>

      <aside className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-emerald-500" />
          <h3 className="font-display text-2xl font-bold">{t.trace}</h3>
        </div>
        <div className="mt-5 space-y-4">
          <TraceRow label="Intent" value={trace.intent} />
          <TraceRow label="Tool" value={trace.tool} />
          <TraceRow label="Confidence" value={`${Math.round(trace.confidence * 100)}%`} />
          <TraceRow label="Next" value={trace.nextAction} />
          <div className="rounded-lg bg-[rgb(var(--surface-2))] p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <UserRound className="h-4 w-4" />
              Slots
            </div>
            {Object.keys(trace.slots || {}).length ? (
              <div className="space-y-2">
                {Object.entries(trace.slots).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-3 text-sm">
                    <span className="text-[rgb(var(--text-muted))]">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-[rgb(var(--text-muted))]">No slots yet</div>
            )}
          </div>
        </div>
      </aside>
    </section>
  );
}

function TraceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[rgb(var(--surface-2))] p-4">
      <div className="text-xs font-semibold uppercase text-[rgb(var(--text-muted))]">
        {label}
      </div>
      <div className="mt-1 break-words font-medium">{value}</div>
    </div>
  );
}
