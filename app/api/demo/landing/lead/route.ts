import { NextResponse } from "next/server";
import { createLead, recordDemoEvent } from "@/lib/server/persistent-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (!body.name || !body.email) {
    return NextResponse.json({ error: "missing_lead_fields" }, { status: 400 });
  }

  const lead = await createLead({
    source: "landing_page_demo",
    locale: String(body.locale || "en"),
    name: String(body.name),
    email: String(body.email),
    phone: body.phone ? String(body.phone) : undefined,
    company: body.company ? String(body.company) : undefined,
    businessType: String(body.industry || "Landing page"),
    projectType: "Business landing page",
    budget: String(body.budget || "Not sure yet"),
    timeline: String(body.timeline || "This month"),
    preferredChannel: String(body.preferredChannel || "WhatsApp"),
    demoInterest: String(body.template || "landing-pages"),
    message: String(
      body.message ||
        `Landing page demo request for ${body.template || "selected template"}.`
    ),
    consentWhatsApp: Boolean(body.phone),
  });

  await recordDemoEvent("landing-pages", "lead_captured", {
    leadId: lead.id,
    template: body.template,
    industry: body.industry,
  });

  return NextResponse.json({ ok: true, leadId: lead.id });
}
