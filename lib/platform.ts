import type { Locale } from "@/lib/i18n";

export type DemoKey = "store" | "spa" | "whatsapp" | "landing-pages" | "documents";

export type Localized<T> = Record<Locale, T>;

export type DemoDefinition = {
  key: DemoKey;
  subdomain: string;
  accent: string;
  image: string;
  title: Localized<string>;
  eyebrow: Localized<string>;
  summary: Localized<string>;
  proof: Localized<string[]>;
};

export const demoDefinitions: DemoDefinition[] = [
  {
    key: "store",
    subdomain: "store.idealailabs.com",
    accent: "from-emerald-500 to-teal-600",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    title: {
      en: "Omani Accessories Store",
      ar: "متجر إكسسوارات عماني",
    },
    eyebrow: {
      en: "Ecommerce + Thawani",
      ar: "تجارة إلكترونية + ثواني",
    },
    summary: {
      en: "Arabic-first store with catalog, cart, OMR checkout, Thawani-ready payment sessions, order tables, and fulfillment controls.",
      ar: "متجر عربي أولاً مع كتالوج وسلة دفع بالريال العماني وتكامل ثواني وجداول طلبات وإدارة شحن.",
    },
    proof: {
      en: ["Catalog", "Cart", "Orders", "Payment adapter"],
      ar: ["كتالوج", "سلة", "طلبات", "بوابة دفع"],
    },
  },
  {
    key: "spa",
    subdomain: "spa.idealailabs.com",
    accent: "from-rose-500 to-pink-600",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    title: {
      en: "Spa Appointment System",
      ar: "نظام مواعيد سبا",
    },
    eyebrow: {
      en: "Bookings + WhatsApp preview",
      ar: "حجوزات + عرض واتساب",
    },
    summary: {
      en: "Service menu, staff availability, booking flow, admin schedule, and WhatsApp-style confirmations and reminders inside the web demo.",
      ar: "قائمة خدمات وتوفر موظفين وحجز مواعيد ولوحة جدول ورسائل تأكيد وتذكير بشكل واتساب داخل الويب.",
    },
    proof: {
      en: ["Calendar", "Staff", "Reminders", "No double booking"],
      ar: ["تقويم", "فريق", "تذكيرات", "منع التعارض"],
    },
  },
  {
    key: "whatsapp",
    subdomain: "bots.idealailabs.com",
    accent: "from-lime-500 to-emerald-600",
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1200&q=80",
    title: {
      en: "WhatsApp Chatbot Lab",
      ar: "مختبر روبوتات واتساب",
    },
    eyebrow: {
      en: "Restaurant, retail, services",
      ar: "مطاعم، تجزئة، خدمات",
    },
    summary: {
      en: "Three testable web chatbots with intent detection, extracted slots, business-side trace, handoff, and lead capture.",
      ar: "ثلاثة روبوتات قابلة للتجربة مع فهم نية العميل واستخراج البيانات ولوحة تتبع وتحويل لموظف.",
    },
    proof: {
      en: ["Intents", "Tool traces", "Lead capture", "Human handoff"],
      ar: ["نوايا", "تتبع أدوات", "عملاء محتملون", "تحويل بشري"],
    },
  },
  {
    key: "landing-pages",
    subdomain: "pages.idealailabs.com",
    accent: "from-sky-500 to-indigo-600",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    title: {
      en: "Business Landing Pages",
      ar: "صفحات هبوط للشركات",
    },
    eyebrow: {
      en: "Lead pages + live editor",
      ar: "صفحات عملاء + محرر مباشر",
    },
    summary: {
      en: "Pick an industry, customize the offer, preview a polished page, and capture calls, WhatsApp clicks, and form leads.",
      ar: "اختر مجال العمل وعدل العرض وشاهد صفحة جاهزة تجمع الاتصالات ونقرات واتساب وطلبات العملاء.",
    },
    proof: {
      en: ["Templates", "Live editor", "Analytics", "Lead forms"],
      ar: ["قوالب", "تحرير مباشر", "تحليلات", "نماذج"],
    },
  },
  {
    key: "documents",
    subdomain: "docs.idealailabs.com",
    accent: "from-amber-500 to-orange-600",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    title: {
      en: "Document Intelligence Suite",
      ar: "منصة ذكاء المستندات",
    },
    eyebrow: {
      en: "Files, spreadsheets, analytics",
      ar: "ملفات، جداول، تحليلات",
    },
    summary: {
      en: "Upload files, profile tables, ask cited questions, build charts, compare evidence, and turn insights into reports.",
      ar: "ارفع الملفات وحلل الجداول واسأل بإجابات موثقة وأنشئ رسوماً وقارن الأدلة وحول النتائج لتقارير.",
    },
    proof: {
      en: ["Upload", "Query", "Charts", "Reports"],
      ar: ["رفع", "أسئلة", "رسوم", "تقارير"],
    },
  },
];

export const platformCopy = {
  en: {
    navDemos: "Demos",
    navAdmin: "Admin",
    openDemo: "Open demo",
    requestSystemCta: "Request this system",
    demoHubEyebrow: "Live demo systems",
    demoHubTitle: "Five demos that show the whole IdealAI Labs offer.",
    demoHubSubtitle:
      "Each one is designed like a client starter kit: bilingual UX, seeded data, lead capture, admin visibility, and realistic business flows.",
    homepageDemosTitle: "Test the systems before you buy them.",
    homepageDemosSubtitle:
      "Stores, appointments, WhatsApp bots, landing pages, and document analytics are all available as working demos.",
    contactDirect: "Request a build like this",
    demoStatus: "Live test system",
    backToDemos: "Back to demos",
  },
  ar: {
    navDemos: "العروض",
    navAdmin: "الإدارة",
    openDemo: "افتح العرض",
    requestSystemCta: "أريد هذا النظام",
    demoHubEyebrow: "أنظمة تجريبية مباشرة",
    demoHubTitle: "خمسة عروض تشرح خدمات IdealAI Labs عملياً.",
    demoHubSubtitle:
      "كل عرض مبني كقالب مشروع للعميل: تجربة عربية وإنجليزية، بيانات جاهزة، جمع طلبات، لوحة إدارة، وسير عمل واقعي.",
    homepageDemosTitle: "جرّب الأنظمة قبل أن تطلبها.",
    homepageDemosSubtitle:
      "المتاجر والمواعيد وروبوتات واتساب وصفحات الهبوط وتحليلات المستندات تعمل كعروض تفاعلية.",
    contactDirect: "اطلب بناء نظام مشابه",
    demoStatus: "نظام تجريبي مباشر",
    backToDemos: "العودة للعروض",
  },
} as const;

export const storeProducts = [
  {
    id: "oud-essence",
    category: "Fragrance",
    name: { en: "Oud Essence Bracelet", ar: "سوار عود فاخر" },
    description: {
      en: "Gift-ready bracelet with a warm oud-inspired presentation box.",
      ar: "سوار جاهز للإهداء مع علبة أنيقة بطابع العود.",
    },
    price: 24.9,
    stock: 18,
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "muscat-tote",
    category: "Bags",
    name: { en: "Muscat Market Tote", ar: "حقيبة سوق مسقط" },
    description: {
      en: "Structured daily tote with gold hardware and woven interior.",
      ar: "حقيبة يومية بهيكل ثابت ولمسات ذهبية وبطانة منسوجة.",
    },
    price: 39.5,
    stock: 11,
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "date-palm-watch",
    category: "Watches",
    name: { en: "Date Palm Watch", ar: "ساعة نخلة" },
    description: {
      en: "Minimal watch with a date-palm dial motif and leather strap.",
      ar: "ساعة بسيطة بلمسة نخيل وسوار جلدي.",
    },
    price: 58,
    stock: 7,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "pearl-clips",
    category: "Jewelry",
    name: { en: "Pearl Hair Clips", ar: "مشابك شعر لؤلؤية" },
    description: {
      en: "Set of four pearl clips for evening and bridal styling.",
      ar: "طقم من أربعة مشابك لؤلؤية للمناسبات والتجهيزات.",
    },
    price: 12.75,
    stock: 34,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "saffron-case",
    category: "Phone",
    name: { en: "Saffron Phone Case", ar: "غطاء هاتف زعفران" },
    description: {
      en: "Drop-protected case with saffron colorway and soft-touch finish.",
      ar: "غطاء حماية بلون الزعفران وملمس ناعم.",
    },
    price: 8.9,
    stock: 42,
    image:
      "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "silver-frankincense",
    category: "Jewelry",
    name: { en: "Frankincense Silver Ring", ar: "خاتم فضة لبان" },
    description: {
      en: "Adjustable silver ring inspired by frankincense resin shapes.",
      ar: "خاتم فضة قابل للتعديل مستوحى من شكل اللبان.",
    },
    price: 21.4,
    stock: 16,
    image:
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80",
  },
];

export const spaServices = [
  { id: "signature", name: { en: "Signature Massage", ar: "مساج فاخر" }, duration: 60, price: 32 },
  { id: "facial", name: { en: "Hydra Facial", ar: "تنظيف بشرة هيدرا" }, duration: 45, price: 28 },
  { id: "moroccan", name: { en: "Moroccan Bath", ar: "حمام مغربي" }, duration: 75, price: 38 },
  { id: "nails", name: { en: "Nail Care", ar: "عناية بالأظافر" }, duration: 40, price: 16 },
];

export const spaStaff = [
  { id: "mira", name: "Mira", specialty: { en: "Massage therapy", ar: "علاج واسترخاء" } },
  { id: "salma", name: "Salma", specialty: { en: "Skin care", ar: "عناية بالبشرة" } },
  { id: "huda", name: "Huda", specialty: { en: "Bath and nails", ar: "حمام وأظافر" } },
];

export const spaSlots = ["09:30", "10:30", "12:00", "14:00", "16:30", "18:00"];

export const botPersonas = [
  {
    id: "restaurant",
    name: { en: "Restaurant", ar: "مطعم" },
    business: { en: "Bait Al Bahar", ar: "بيت البحر" },
    starter: {
      en: "Ask about menu, allergies, reservations, or pickup orders.",
      ar: "اسأل عن القائمة أو الحساسية أو الحجز أو طلب استلام.",
    },
    quick: {
      en: ["Book a table for four tonight", "Do you have gluten-free options?", "I want a pickup order"],
      ar: ["أريد حجز طاولة لأربعة الليلة", "هل يوجد خيارات بدون جلوتين؟", "أريد طلب استلام"],
    },
  },
  {
    id: "retail",
    name: { en: "Retail", ar: "تجزئة" },
    business: { en: "Nizwa Style", ar: "نزوى ستايل" },
    starter: {
      en: "Test stock checks, product recommendations, order tracking, or returns.",
      ar: "جرّب توفر المنتجات أو الترشيحات أو تتبع الطلبات أو الاستبدال.",
    },
    quick: {
      en: ["Recommend a gift under 25 OMR", "Is the saffron case in stock?", "I need to exchange an item"],
      ar: ["اقترح هدية أقل من ٢٥ ريال", "هل غطاء الزعفران متوفر؟", "أريد استبدال منتج"],
    },
  },
  {
    id: "services",
    name: { en: "Services", ar: "خدمات" },
    business: { en: "Muscat Fix Pro", ar: "مسقط فكس برو" },
    starter: {
      en: "Qualify service requests, urgency, location, quotes, and booking.",
      ar: "تأهيل طلبات الخدمة والسرعة والموقع والسعر والحجز.",
    },
    quick: {
      en: ["My AC is leaking in Al Khuwair", "How much for a website?", "Can I book maintenance tomorrow?"],
      ar: ["المكيف يسرب في الخوير", "كم تكلفة موقع إلكتروني؟", "هل يمكن حجز صيانة غداً؟"],
    },
  },
];

export const landingTemplates = [
  {
    id: "restaurant",
    name: { en: "Restaurant Launch", ar: "افتتاح مطعم" },
    offer: { en: "Reserve tonight and get a chef tasting bite.", ar: "احجز الليلة واحصل على ضيافة من الشيف." },
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "clinic",
    name: { en: "Clinic Appointments", ar: "مواعيد عيادة" },
    offer: { en: "Book a consultation in under one minute.", ar: "احجز استشارة خلال أقل من دقيقة." },
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "contractor",
    name: { en: "Home Services", ar: "خدمات منزلية" },
    offer: { en: "Get a same-day inspection quote.", ar: "احصل على معاينة وسعر في نفس اليوم." },
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "retail",
    name: { en: "Retail Campaign", ar: "حملة متجر" },
    offer: { en: "New collection live with WhatsApp ordering.", ar: "تشكيلة جديدة مع طلب عبر واتساب." },
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  },
];

export function getDemo(key: string): DemoDefinition | undefined {
  return demoDefinitions.find((demo) => demo.key === key);
}

export function formatOmr(value: number, locale: Locale = "en") {
  return new Intl.NumberFormat(locale === "ar" ? "ar-OM" : "en-OM", {
    style: "currency",
    currency: "OMR",
    maximumFractionDigits: 3,
  }).format(value);
}
