export type Locale = "en" | "ar";

export const locales: Locale[] = ["en", "ar"];
export const defaultLocale: Locale = "en";

export const dictionaries = {
  en: {
    dir: "ltr",
    nav: {
      services: "Services",
      products: "Products",
      about: "About",
      contact: "Contact",
      quote: "Get a Quote",
    },
    hero: {
      badge: "AI • NLP • Conversational Automation",
      title: "Build smarter with",
      titleAccent: "Ideal Intelligence",
      subtitle:
        "We design and ship production-grade AI applications, advanced NLP systems, and WhatsApp automation for businesses across the Gulf and beyond.",
      ctaPrimary: "Start a Project",
      ctaSecondary: "See Our Work",
      metricClients: "Live products",
      metricReq: "Conversations handled",
      metricCountries: "Markets served",
    },
    services: {
      kicker: "What we build",
      title: "AI that ships. Automation that scales.",
      subtitle:
        "From strategy to deployment, we partner with teams to design intelligent systems that deliver measurable impact.",
      items: [
        {
          title: "AI Web & Mobile Apps",
          desc: "Full-stack AI products — Next.js, FastAPI, vector databases, agentic workflows. Deployed and monitored end-to-end.",
        },
        {
          title: "Conversational AI",
          desc: "LLM-powered assistants with tool use, memory, and grounded retrieval. Handle real customer intent, not just FAQs.",
        },
        {
          title: "WhatsApp Chatbots & Automation",
          desc: "Production WhatsApp Business API bots with multi-language support, payments, CRM sync, and intelligent routing.",
        },
        {
          title: "Advanced NLP",
          desc: "Custom pipelines for Arabic + English: classification, extraction, re-ranking, semantic search, and RAG.",
        },
        {
          title: "AI Consultancy",
          desc: "Strategy, architecture review, model selection, cost optimization, and team enablement. Vendor-neutral.",
        },
        {
          title: "Agent & Workflow Systems",
          desc: "Multi-step autonomous agents with guardrails, observability, and human-in-the-loop controls.",
        },
      ],
    },
    products: {
      kicker: "Our products",
      title: "Proven platforms, running in production.",
      subtitle:
        "Two of our flagship AI products serving thousands of users across the region.",
      careers: {
        name: "CareersAgent",
        tag: "Job Search Platform",
        desc: "An AI career copilot that scrapes, summarizes, and matches jobs across the Gulf — with a WhatsApp assistant, smart alerts, and Arabic-first UX.",
        features: [
          "Multi-country job aggregation",
          "LLM-powered smart matching",
          "WhatsApp job alerts",
          "Premium tier with resume review",
        ],
      },
      recruit: {
        name: "RecruitMind AI",
        tag: "AI Hiring Suite",
        desc: "An advanced recruiter workbench: CV parsing, semantic candidate search, automated outreach, and conversational screening at scale.",
        features: [
          "Bulk CV ingestion & parsing",
          "Semantic talent search",
          "Automated candidate outreach",
          "AI screening conversations",
        ],
      },
      cta: "Learn more",
    },
    approach: {
      kicker: "How we work",
      title: "A pragmatic, ship-first approach.",
      steps: [
        {
          n: "01",
          title: "Discover",
          desc: "We map your workflow, data, and constraints. No AI theater — we only recommend what measurably helps.",
        },
        {
          n: "02",
          title: "Prototype",
          desc: "A working prototype in weeks, not months. Real data, real users, real feedback loops.",
        },
        {
          n: "03",
          title: "Ship",
          desc: "Production deploy with monitoring, cost controls, and documented handover. We optimize as you scale.",
        },
      ],
    },
    contact: {
      kicker: "Let's talk",
      title: "Describe your project. Get a quote.",
      subtitle:
        "Tell us what you're building. We'll respond within 1 business day with a tailored plan.",
      name: "Your name",
      email: "Work email",
      company: "Company",
      projectType: "Project type",
      budget: "Estimated budget",
      message: "Describe your project",
      messagePlaceholder:
        "What problem are you solving? Any deadlines, data, or systems we should know about?",
      submit: "Request Quote",
      submitting: "Sending...",
      success: "Thanks — we'll be in touch within 1 business day.",
      error: "Something went wrong. Please try again or email us directly.",
      projectTypes: [
        "WhatsApp Chatbot",
        "AI Web App",
        "NLP / RAG System",
        "Agent / Automation",
        "Consultancy",
        "Other",
      ],
      budgets: [
        "Under $5k",
        "$5k – $15k",
        "$15k – $50k",
        "$50k+",
        "Not sure yet",
      ],
    },
    footer: {
      tagline:
        "Ideal Intelligence — an AI studio in Muscat, Oman, building intelligent systems for a smarter region.",
      rights: "All rights reserved.",
      company: "Company",
      resources: "Resources",
      legal: "Legal",
      privacy: "Privacy",
      terms: "Terms",
    },
    company: {
      name: "Ideal Intelligence",
      shortName: "Ideal Intelligence",
      location: "Muscat, Oman",
    },
  },
  ar: {
    dir: "rtl",
    nav: {
      services: "خدماتنا",
      products: "منتجاتنا",
      about: "من نحن",
      contact: "تواصل معنا",
      quote: "اطلب عرض سعر",
    },
    hero: {
      badge: "ذكاء اصطناعي • معالجة لغة • أتمتة محادثات",
      title: "ابنِ بذكاء مع",
      titleAccent: "الأمثل للذكاء الاصطناعي",
      subtitle:
        "نصمّم ونطلق تطبيقات ذكاء اصطناعي جاهزة للإنتاج، وأنظمة معالجة لغة متقدمة، وأتمتة واتساب للشركات في الخليج وخارجه.",
      ctaPrimary: "ابدأ مشروعك",
      ctaSecondary: "شاهد أعمالنا",
      metricClients: "منتجات فعّالة",
      metricReq: "محادثات تمت معالجتها",
      metricCountries: "أسواق نخدمها",
    },
    services: {
      kicker: "ما نقدمه",
      title: "ذكاء اصطناعي ينجز. أتمتة تنمو.",
      subtitle:
        "من الاستراتيجية إلى النشر، نعمل مع فريقك لتصميم أنظمة ذكية تحقّق أثرًا قابلًا للقياس.",
      items: [
        {
          title: "تطبيقات ذكاء اصطناعي",
          desc: "منتجات متكاملة: Next.js وFastAPI وقواعد بيانات متجهية وتدفقات وكلاء، مع نشر ومراقبة شاملين.",
        },
        {
          title: "الذكاء الاصطناعي الحواري",
          desc: "مساعدون يعملون بنماذج لغوية كبيرة، مع استخدام أدوات وذاكرة واسترجاع موثّق. يفهمون القصد، لا مجرد أسئلة شائعة.",
        },
        {
          title: "روبوتات وأتمتة واتساب",
          desc: "روبوتات واتساب إنتاجية متعددة اللغات، مع مدفوعات وتكامل CRM وتوجيه ذكي.",
        },
        {
          title: "معالجة لغة متقدمة",
          desc: "خطوط معالجة مخصّصة للعربية والإنجليزية: تصنيف، استخراج، إعادة ترتيب، بحث دلالي، وRAG.",
        },
        {
          title: "استشارات ذكاء اصطناعي",
          desc: "استراتيجية، مراجعة معمارية، اختيار نماذج، تحسين التكلفة، وتمكين الفِرَق — بحياد تام.",
        },
        {
          title: "أنظمة وكلاء وسير عمل",
          desc: "وكلاء مستقلون متعدّدو الخطوات مع حواجز أمان ومراقبة وتدخّل بشري عند الحاجة.",
        },
      ],
    },
    products: {
      kicker: "منتجاتنا",
      title: "منصّات مجرّبة وتعمل في الإنتاج.",
      subtitle: "اثنان من منتجاتنا الرائدة يخدمان آلاف المستخدمين في المنطقة.",
      careers: {
        name: "كاريرز إيجنت",
        tag: "منصة البحث عن وظيفة",
        desc: "مساعد مهني ذكي يجمع الوظائف ويلخّصها ويطابقها في دول الخليج — مع مساعد واتساب وتنبيهات ذكية وتجربة عربية أولًا.",
        features: [
          "تجميع وظائف من عدة دول",
          "مطابقة ذكية بالنماذج اللغوية",
          "تنبيهات وظائف عبر واتساب",
          "اشتراك مميّز مع مراجعة السيرة",
        ],
      },
      recruit: {
        name: "ريكروت مايند AI",
        tag: "منظومة توظيف بالذكاء الاصطناعي",
        desc: "طاولة عمل متقدّمة للمجنّدين: قراءة السير الذاتية، بحث دلالي عن المرشحين، تواصل آلي، ومقابلات حوارية بحجم واسع.",
        features: [
          "استيعاب السير الذاتية بكميات كبيرة",
          "بحث دلالي عن المواهب",
          "تواصل آلي مع المرشحين",
          "محادثات فرز بالذكاء الاصطناعي",
        ],
      },
      cta: "اعرف المزيد",
    },
    approach: {
      kicker: "كيف نعمل",
      title: "منهج عملي يركّز على الإطلاق.",
      steps: [
        {
          n: "٠١",
          title: "الاستكشاف",
          desc: "نحلّل سير عملك وبياناتك وقيودك. لا استعراض — نوصي فقط بما يفيد قياسيًا.",
        },
        {
          n: "٠٢",
          title: "النموذج الأولي",
          desc: "نموذج عامل خلال أسابيع، لا أشهر. بيانات حقيقية ومستخدمون حقيقيون وتغذية راجعة حقيقية.",
        },
        {
          n: "٠٣",
          title: "الإطلاق",
          desc: "نشر إنتاجي مع مراقبة وضبط للتكاليف وتسليم موثّق. نحسّن معك مع نموّك.",
        },
      ],
    },
    contact: {
      kicker: "لنتحدث",
      title: "صف مشروعك. احصل على عرض سعر.",
      subtitle: "أخبرنا بما تبنيه. سنردّ خلال يوم عمل بخطة مصمّمة لك.",
      name: "اسمك",
      email: "البريد الإلكتروني",
      company: "الشركة",
      projectType: "نوع المشروع",
      budget: "الميزانية المقدّرة",
      message: "صف مشروعك",
      messagePlaceholder:
        "ما المشكلة التي تحلّها؟ هل هناك مواعيد أو بيانات أو أنظمة نحتاج لمعرفتها؟",
      submit: "اطلب عرض سعر",
      submitting: "جارٍ الإرسال...",
      success: "شكرًا — سنتواصل خلال يوم عمل.",
      error: "حدث خطأ. حاول مجددًا أو راسلنا مباشرةً.",
      projectTypes: [
        "روبوت واتساب",
        "تطبيق ويب بالذكاء الاصطناعي",
        "نظام NLP / RAG",
        "وكيل / أتمتة",
        "استشارات",
        "أخرى",
      ],
      budgets: [
        "أقل من 5 آلاف دولار",
        "5 – 15 ألف دولار",
        "15 – 50 ألف دولار",
        "أكثر من 50 ألف",
        "لستُ متأكدًا بعد",
      ],
    },
    footer: {
      tagline:
        "آيديال إنتليجنس — استوديو ذكاء اصطناعي في مسقط، عُمان، نبني أنظمة ذكية لمنطقة أكثر ذكاءً.",
      rights: "جميع الحقوق محفوظة.",
      company: "الشركة",
      resources: "مصادر",
      legal: "قانوني",
      privacy: "الخصوصية",
      terms: "الشروط",
    },
    company: {
      name: "الأمثل للذكاء الاصطناعي",
      shortName: "الأمثل",
      location: "مسقط، عُمان",
    },
  },
} as const;

export type Dict = (typeof dictionaries)["en"];

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] as unknown as Dict;
}
