import { NextResponse } from "next/server";
import { createLead, recordDemoEvent } from "@/lib/server/persistent-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function detectIntent(persona: string, message: string) {
  const text = message.toLowerCase();

  if (/human|agent|manager|person|موظف|إنسان|شخص|مدير/.test(text)) {
    return "human_handoff";
  }
  if (/book|reserve|appointment|table|موعد|حجز|طاولة/.test(text)) {
    return persona === "restaurant" ? "reservation" : "booking";
  }
  if (/price|cost|quote|how much|كم|سعر|تكلفة/.test(text)) {
    return "quote";
  }
  if (/stock|available|gift|recommend|return|exchange|متوفر|هدية|استبدال|ترشيح/.test(text)) {
    return "retail_assist";
  }
  if (/allerg|gluten|menu|order|pickup|قائمة|حساسية|طلب|استلام/.test(text)) {
    return "food_order";
  }
  if (/location|area|urgent|leak|maintenance|موقع|منطقة|عاجل|يسرب|صيانة/.test(text)) {
    return "service_request";
  }
  return "general_question";
}

function extractSlots(message: string) {
  const slots: Record<string, string> = {};
  const timeMatch = message.match(/\b(\d{1,2}(:\d{2})?\s?(am|pm)?)\b/i);
  const peopleMatch = message.match(/\b(for|لـ|ل)\s?(\d+|one|two|three|four|five|six|سبعة|ستة|خمسة|أربعة|اربعة|ثلاثة|اثنين)\b/i);
  const areaMatch = message.match(/\b(al khuwair|muscat|nizwa|seeb|الخوير|مسقط|نزوى|السيب)\b/i);
  if (timeMatch) slots.time = timeMatch[0];
  if (peopleMatch) slots.partySize = peopleMatch[2];
  if (areaMatch) slots.area = areaMatch[0];
  if (/tomorrow|غداً|غدا/.test(message.toLowerCase())) slots.date = "tomorrow";
  if (/tonight|الليلة/.test(message.toLowerCase())) slots.date = "tonight";
  return slots;
}

function responseFor(persona: string, intent: string, slots: Record<string, string>) {
  if (persona === "restaurant") {
    if (intent === "reservation") {
      return {
        text: `I can hold a table${slots.partySize ? ` for ${slots.partySize}` : ""}${slots.date ? ` ${slots.date}` : ""}. Please share your name and phone number to confirm.`,
        action: "create_reservation_hold",
      };
    }
    if (intent === "food_order") {
      return {
        text: "Our popular pickup bundle is grilled prawns, saffron rice, fattoush, and laban. I can also filter for gluten-free or nut-free items.",
        action: "show_menu_recommendations",
      };
    }
  }

  if (persona === "retail") {
    if (intent === "retail_assist") {
      return {
        text: "For a gift under 25 OMR, I recommend the Oud Essence Bracelet or Pearl Hair Clips. Both are in stock and can be gift-wrapped.",
        action: "recommend_products",
      };
    }
  }

  if (persona === "services") {
    if (intent === "service_request") {
      return {
        text: `I can create a priority service request${slots.area ? ` for ${slots.area}` : ""}. Please share a photo, building type, and preferred visit time.`,
        action: "create_service_ticket",
      };
    }
    if (intent === "quote") {
      return {
        text: "For websites, we usually qualify pages, integrations, content, and timeline first. I can collect those details and send a quote request to the team.",
        action: "qualify_quote",
      };
    }
  }

  if (intent === "human_handoff") {
    return {
      text: "Sure. I can hand this to a human with the conversation summary, customer details, and recommended next action.",
      action: "handoff_to_human",
    };
  }

  return {
    text: "I understood the request and can continue collecting the missing details. Try asking for booking, price, availability, order status, or handoff.",
    action: "continue_qualification",
  };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const persona = String(body.persona || "restaurant");
  const message = String(body.message || "").trim();
  const locale = String(body.locale || "en");

  if (!message) {
    return NextResponse.json({ error: "missing_message" }, { status: 400 });
  }

  const intent = detectIntent(persona, message);
  const slots = extractSlots(message);
  const reply = responseFor(persona, intent, slots);

  await recordDemoEvent("whatsapp", "bot_message", {
    persona,
    message,
    intent,
    slots,
    action: reply.action,
  });

  if (/build|similar|contact|quote|demo|ابني|مشابه|تواصل|عرض/.test(message.toLowerCase())) {
    await createLead({
      source: "whatsapp_bot_demo",
      locale,
      name: "Chatbot demo visitor",
      email: "chatbot-demo@idealailabs.com",
      businessType: "WhatsApp automation",
      projectType: "WhatsApp Chatbot",
      budget: "Not sure yet",
      timeline: "Demo chat",
      preferredChannel: "WhatsApp",
      demoInterest: persona,
      message: `Visitor asked in ${persona} bot: ${message}`,
      consentWhatsApp: false,
    });
  }

  return NextResponse.json({
    ok: true,
    reply: reply.text,
    trace: {
      intent,
      slots,
      tool: reply.action,
      confidence: intent === "general_question" ? 0.68 : 0.91,
      nextAction:
        intent === "human_handoff"
          ? "Create handoff packet"
          : "Ask for missing customer details",
    },
  });
}
