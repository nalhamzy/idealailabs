"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  FileSearch,
  FileText,
  Network,
  Save,
  Upload,
  Download,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";

type ParsedFile = {
  name: string;
  kind: "table" | "text";
  rows: Record<string, string>[];
  text: string;
};

const sampleCsv = `Month,Revenue,Orders,Channel,Region
January,4200,84,WhatsApp,Muscat
February,5100,101,Website,Muscat
March,6900,138,WhatsApp,Nizwa
April,7600,141,Website,Sohar
May,9300,188,WhatsApp,Muscat
June,11800,221,Website,Salalah`;

const copy = {
  en: {
    title: "Document Intelligence Suite",
    subtitle: "Upload spreadsheets or documents, profile the data, query it in modes, visualize answers, and keep the evidence connected to rows and source text.",
    upload: "Upload CSV/TXT/PDF/DOC",
    sample: "Load sample revenue sheet",
    ask: "Ask",
    analyze: "Analyze",
    compare: "Compare",
    simulate: "Simulate",
    brief: "Brief",
    question: "Ask about this workspace",
    run: "Run query",
    profile: "Auto profile",
    graph: "Evidence graph",
    chart: "Generated visualization",
    answer: "Answer workspace",
    save: "Save insight",
    report: "Report builder",
    export: "Export report",
    dataTable: "Source table",
  },
  ar: {
    title: "منصة ذكاء المستندات والجداول",
    subtitle: "ارفع الجداول والمستندات، افهم البيانات تلقائياً، اسأل بعدة أوضاع، شاهد الرسوم، واربط كل إجابة بالمصدر والصفوف.",
    upload: "ارفع CSV/TXT/PDF/DOC",
    sample: "تحميل جدول إيرادات تجريبي",
    ask: "سؤال",
    analyze: "تحليل",
    compare: "مقارنة",
    simulate: "محاكاة",
    brief: "ملخص",
    question: "اسأل عن مساحة العمل",
    run: "تشغيل السؤال",
    profile: "تحليل تلقائي",
    graph: "خريطة الأدلة",
    chart: "رسم مولد",
    answer: "مساحة الإجابة",
    save: "حفظ النتيجة",
    report: "بناء التقرير",
    export: "تصدير التقرير",
    dataTable: "جدول المصدر",
  },
} as const;

const modes = ["ask", "analyze", "compare", "simulate", "brief"] as const;

function parseCsv(text: string) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const headers = lines[0]?.split(",").map((item) => item.trim()) ?? [];
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((item) => item.trim());
    return headers.reduce<Record<string, string>>((row, header, index) => {
      row[header] = values[index] ?? "";
      return row;
    }, {});
  });
}

function isNumeric(value: string) {
  return value !== "" && !Number.isNaN(Number(value));
}

function profileRows(rows: Record<string, string>[]) {
  const columns = Object.keys(rows[0] ?? {});
  return columns.map((column) => {
    const values = rows.map((row) => row[column]).filter(Boolean);
    const numeric = values.filter(isNumeric).map(Number);
    return {
      column,
      count: values.length,
      numeric: numeric.length > 0,
      sum: numeric.reduce((sum, value) => sum + value, 0),
      avg: numeric.length ? numeric.reduce((sum, value) => sum + value, 0) / numeric.length : 0,
      unique: new Set(values).size,
    };
  });
}

export default function DocumentSuiteDemo({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [file, setFile] = useState<ParsedFile>(() => ({
    name: "sample-revenue.csv",
    kind: "table",
    rows: parseCsv(sampleCsv),
    text: sampleCsv,
  }));
  const [mode, setMode] = useState<(typeof modes)[number]>("analyze");
  const [question, setQuestion] = useState("Which channel is growing fastest and what should we do next?");
  const [answer, setAnswer] = useState("");
  const [savedInsights, setSavedInsights] = useState<string[]>([]);

  const profile = useMemo(() => profileRows(file.rows), [file]);
  const numericColumn = profile.find((item) => item.numeric)?.column;
  const labelColumn = profile.find((item) => !item.numeric)?.column ?? Object.keys(file.rows[0] ?? {})[0];
  const chartRows = numericColumn
    ? file.rows.map((row) => ({
        label: row[labelColumn] || "Row",
        value: Number(row[numericColumn]) || 0,
      }))
    : [];
  const max = Math.max(...chartRows.map((row) => row.value), 1);

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    const text = await selected.text().catch(() => "");
    const tableLike = selected.name.endsWith(".csv") || text.includes(",");
    setFile({
      name: selected.name,
      kind: tableLike ? "table" : "text",
      rows: tableLike ? parseCsv(text || sampleCsv) : [],
      text: text || `Uploaded ${selected.name}. Binary parsing is delegated to the production worker.`,
    });
  }

  function loadSample() {
    setFile({
      name: "sample-revenue.csv",
      kind: "table",
      rows: parseCsv(sampleCsv),
      text: sampleCsv,
    });
  }

  function runQuery() {
    const revenue = profile.find((item) => item.column.toLowerCase().includes("revenue"));
    const orders = profile.find((item) => item.column.toLowerCase().includes("orders"));
    const top = chartRows.reduce((best, row) => (row.value > best.value ? row : best), chartRows[0] ?? { label: "-", value: 0 });
    const responseByMode = {
      ask: `Answer: ${top.label} has the strongest ${numericColumn || "metric"} at ${top.value}. Evidence is linked to the table row and the ${numericColumn || "numeric"} column.`,
      analyze: `Analysis: revenue totals ${Math.round(revenue?.sum ?? 0)} and orders total ${Math.round(orders?.sum ?? 0)}. The highest row is ${top.label}. The next action is to compare WhatsApp and Website channels by conversion source.`,
      compare: "Comparison: WhatsApp rows show stronger assisted buying behavior, while Website rows carry larger self-serve volume. The suite keeps both the row evidence and source notes visible.",
      simulate: "Simulation: if the best channel improves by 12%, the forecast panel would update revenue, order count, and confidence bands while preserving the original source evidence.",
      brief: "Brief: the workspace shows rising demand, strong WhatsApp contribution, and a clear opportunity to automate follow-up, cart recovery, and monthly executive reporting.",
    } as const;
    setAnswer(`${responseByMode[mode]}\n\nQuestion: ${question}`);
    fetch("/api/demo-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        demoKey: "documents",
        type: "query_run",
        payload: { mode, question, file: file.name },
      }),
    }).catch(() => undefined);
  }

  function saveInsight() {
    if (!answer.trim()) return;
    setSavedInsights((current) => [answer, ...current].slice(0, 6));
  }

  function exportReport() {
    const body = [
      `IdealAI Labs Document Intelligence Report`,
      `File: ${file.name}`,
      `Mode: ${mode}`,
      ``,
      ...savedInsights.map((item, index) => `Insight ${index + 1}\n${item}`),
    ].join("\n\n");
    const blob = new Blob([body], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ideal-doc-intelligence-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[340px_1fr_360px]">
      <aside className="min-w-0 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
        <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-amber-600 dark:text-amber-300">
          <FileSearch className="h-4 w-4" />
          Multimodal workspace
        </div>
        <h2 className="mt-2 font-display text-3xl font-bold">{t.title}</h2>
        <p className="mt-3 text-sm leading-6 text-[rgb(var(--text-muted))]">
          {t.subtitle}
        </p>

        <div className="mt-6 space-y-3">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-4 py-6 text-center text-sm font-semibold">
            <Upload className="h-5 w-5 text-amber-500" />
            {t.upload}
            <input
              type="file"
              accept=".csv,.txt,.pdf,.doc,.docx,.xlsx"
              onChange={onFile}
              className="hidden"
            />
          </label>
          <button
            onClick={loadSample}
            className="w-full rounded-full bg-amber-600 px-4 py-3 text-sm font-semibold text-white"
          >
            {t.sample}
          </button>
        </div>

        <div className="mt-6 rounded-lg bg-[rgb(var(--surface-2))] p-4">
          <div className="flex items-center gap-2 font-semibold">
            <FileText className="h-4 w-4 text-amber-500" />
            {file.name}
          </div>
          <div className="mt-2 text-sm text-[rgb(var(--text-muted))]">
            {file.kind === "table"
              ? `${file.rows.length} rows, ${Object.keys(file.rows[0] ?? {}).length} columns`
              : `${file.text.length} text characters`}
          </div>
        </div>
      </aside>

      <main className="min-w-0 space-y-6">
        <section className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
          <div className="flex flex-wrap gap-2">
            {modes.map((item) => (
              <button
                key={item}
                onClick={() => setMode(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  mode === item
                    ? "bg-amber-600 text-white"
                    : "border border-[rgb(var(--border))]"
                }`}
              >
                {t[item]}
              </button>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3 md:flex-row">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={t.question}
              className="min-w-0 flex-1 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3"
            />
            <button
              onClick={runQuery}
              className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white"
            >
              {t.run}
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
          <div className="flex items-center gap-2">
            <AreaChart className="h-5 w-5 text-amber-500" />
            <h3 className="font-display text-2xl font-bold">{t.chart}</h3>
          </div>
          <div className="mt-5 space-y-3">
            {chartRows.map((row) => (
              <div key={row.label} className="grid grid-cols-[90px_1fr_80px] items-center gap-3 text-sm">
                <div className="truncate">{row.label}</div>
                <div className="h-8 rounded-full bg-[rgb(var(--surface-2))]">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${Math.max(8, (row.value / max) * 100)}%` }}
                  />
                </div>
                <div className="text-end font-semibold">{row.value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
          <h3 className="font-display text-2xl font-bold">{t.answer}</h3>
          <div className="mt-4 min-h-36 whitespace-pre-wrap rounded-lg bg-[rgb(var(--surface-2))] p-4 text-sm leading-7">
            {answer || "Run a query to generate an answer with evidence, chart context, and a recommended next step."}
          </div>
          <button
            onClick={saveInsight}
            disabled={!answer}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {t.save}
          </button>
        </section>

        {file.rows.length > 0 && (
          <section className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
            <h3 className="font-display text-2xl font-bold">{t.dataTable}</h3>
            <div className="mt-4 max-h-72 overflow-auto">
              <table className="w-full min-w-[720px] text-left text-sm rtl:text-right">
                <thead>
                  <tr>
                    {Object.keys(file.rows[0] ?? {}).map((column) => (
                      <th key={column} className="border-b border-[rgb(var(--border))] py-3">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {file.rows.map((row, index) => (
                    <tr key={index}>
                      {Object.keys(file.rows[0] ?? {}).map((column) => (
                        <td key={column} className="border-b border-[rgb(var(--border))] py-3">
                          {row[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      <aside className="min-w-0 space-y-6">
        <section className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
          <h3 className="font-display text-2xl font-bold">{t.profile}</h3>
          <div className="mt-4 space-y-3">
            {profile.map((item) => (
              <div key={item.column} className="rounded-lg bg-[rgb(var(--surface-2))] p-4">
                <div className="flex justify-between gap-3">
                  <span className="font-semibold">{item.column}</span>
                  <span className="text-xs text-[rgb(var(--text-muted))]">
                    {item.numeric ? "metric" : "dimension"}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-[rgb(var(--text-muted))]">
                  <span>Count {item.count}</span>
                  <span>Unique {item.unique}</span>
                  <span>Avg {item.numeric ? Math.round(item.avg) : "-"}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-amber-500" />
            <h3 className="font-display text-2xl font-bold">{t.graph}</h3>
          </div>
          <div className="mt-5 grid gap-3 text-sm">
            {[
              ["File", file.name],
              ["Metric", numericColumn || "Detected after upload"],
              ["Dimension", labelColumn || "Detected after upload"],
              ["Insight", "Generated answer links back to rows"],
            ].map(([left, right]) => (
              <div key={left} className="rounded-lg border border-[rgb(var(--border))] p-4">
                <div className="text-xs font-semibold uppercase text-[rgb(var(--text-muted))]">
                  {left}
                </div>
                <div className="mt-1 font-medium">{right}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
          <h3 className="font-display text-2xl font-bold">{t.report}</h3>
          <div className="mt-4 space-y-3">
            {savedInsights.length === 0 && (
              <div className="rounded-lg bg-[rgb(var(--surface-2))] p-4 text-sm text-[rgb(var(--text-muted))]">
                Save query results to build a report.
              </div>
            )}
            {savedInsights.map((item, index) => (
              <div key={`${item}-${index}`} className="rounded-lg bg-[rgb(var(--surface-2))] p-4 text-sm leading-6">
                {item.split("\n")[0]}
              </div>
            ))}
            <button
              onClick={exportReport}
              disabled={!savedInsights.length}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {t.export}
            </button>
          </div>
        </section>
      </aside>
    </section>
  );
}
