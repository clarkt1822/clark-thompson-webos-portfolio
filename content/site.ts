const resumePath = "/resume/Clark-Thompson-Resume.pdf";

export const siteContent = {
  resumePath,
  hero: {
    name: "Clark Thompson",
    eyebrow: "System Profile",
    headline: "Building practical systems across data, software, automation, and applied AI.",
    subheadline:
      "Background in analytics, reporting, and workflow problem-solving across business systems. Now building software, automation, and AI tools while continuing to apply that foundation.",
    focus: "RAG, workflow automation, backend fundamentals, productized internal tools",
    status: "Always Learning",
    availability: "Open to data, software, automation, and AI-focused roles —including analyst positions— as well as freelance/contract work and web design engagements.",
    ctas: [
      { label: "Open Projects", href: "#projects", variant: "primary" as const },
      {
        label: "View Resume",
        href: resumePath,
        variant: "secondary" as const
      },
      { label: "Contact", href: "#contact", variant: "ghost" as const }
    ],
    metrics: [
      { label: "Current mode", value: "Builder / Analyst / Systems thinker" },
      { label: "Bias", value: "Useful > flashy" },
      { label: "Trajectory", value: "Analytics -> software -> AI systems" }
    ]
  },
  about: {
    intro:
      "I started where a lot of real business problems live: analytics, reporting, process friction, bad handoffs, and unclear decision-making.",
    body: [
      "That foundation shaped how I approach systems. I care about things that are actually useful in practice. Tools that make work clearer, faster, and more reliable, not just systems that sound impressive in a demo.",
      "Now I build on top of that foundation using software, automation, and applied AI, continuously sharpening the engineering side while keeping the same practical lens. Better workflows, clearer decisions, fewer repetitive steps, and more leverage.",
      "I’m most interested in work at the intersection of data, product thinking, and implementation. Internal tools, automation, and AI-assisted systems that solve real operational problems."
    ],
    principles: [
      "Consistent learning and growth beat any single project or role.",
      "Reliable systems, built on sound foundations, beat hype every time.",
      "Build, test, refine, repeat — progress comes from shipping and improving, not waiting to be “ready.”"
    ]
  },
  projects: [
    {
      title: "RAG Knowledge Assistant",
      summary: "Internal search and answer layer for messy docs, SOPs, and operational context.",
      problem:
        "Teams lose time hunting through fragmented documents, repeat the same questions, and make decisions with incomplete context.",
      built:
        "Built a retrieval pipeline with chunking, embeddings, structured metadata, citation-aware responses, and a focused interface for quick operational lookup.",
      stack: ["Next.js", "TypeScript", "Python", "OpenAI API", "Vector store"],
      impact:
        "Shows how I think about AI as workflow infrastructure, not novelty. The value is faster answers, better context, and fewer repeated interruptions.",
      links: {
        github: "#",
        demo: "#",
        caseStudy: "#"
      },
      accent: "signal" as const
    },
    {
      title: "AI Workflow Automation System",
      summary: "Automation layer for repeatable intake, triage, enrichment, and follow-up work.",
      problem:
        "A lot of team time disappears into predictable manual steps across forms, spreadsheets, CRM updates, and status handoffs.",
      built:
        "Designed a workflow that combines validation, enrichment, conditional routing, and AI-assisted drafting so repetitive process work moves faster with human review where it matters.",
      stack: ["Node.js", "TypeScript", "n8n", "Postgres", "Webhooks"],
      impact:
        "Positions me well for operations-heavy technical roles because it ties software, automation, and business process thinking together.",
      links: {
        github: "#",
        demo: "#",
        caseStudy: "#"
      },
      accent: "glow" as const
    },
    {
      title: "KPI Analytics Dashboard",
      summary: "Decision-focused dashboard for revenue, pipeline, and operating metrics.",
      problem:
        "Leaders often get reporting that is technically correct but hard to interpret, delayed, or disconnected from action.",
      built:
        "Built a dashboard layer with cleaned metrics, trend views, drill-downs, and narrative framing so the output is usable in weekly operating conversations.",
      stack: ["SQL", "Power BI", "dbt", "Excel", "Stakeholder discovery"],
      impact:
        "Grounds the portfolio in real analytics experience and shows that I know how to translate data into decisions, not just charts.",
      links: {
        github: "#",
        demo: "#",
        caseStudy: "#"
      },
      accent: "ember" as const
    },
    {
      title: "Document Classification Pipeline",
      summary: "Practical intake pipeline for sorting, labeling, and routing semi-structured documents.",
      problem:
        "Document-heavy workflows create bottlenecks when teams rely on manual sorting, inconsistent labels, and inbox triage.",
      built:
        "Created a lightweight pipeline for extraction, classification, confidence scoring, and exception handling with a review loop instead of pretending the model is always right.",
      stack: ["Python", "FastAPI", "OCR tooling", "LLM prompts", "Postgres"],
      impact:
        "Shows a grounded approach to AI implementation: narrow scope, measurable usefulness, and explicit handling for uncertainty.",
      links: {
        github: "#",
        demo: "#",
        caseStudy: "#"
      },
      accent: "signal" as const
    },
    {
      title: "Agentic Workflow Experiment",
      summary: "Small-scale agent workflow exploring task decomposition after solid retrieval foundations.",
      problem:
        "Agentic systems are easy to oversell and easy to make brittle when the task design is vague.",
      built:
        "Tested a constrained workflow where a planning agent delegates bounded tasks, checks outputs against rules, and returns structured summaries instead of pretending to be fully autonomous.",
      stack: ["TypeScript", "LLM orchestration", "Tool calling", "Evaluation logs"],
      impact:
        "Communicates curiosity and forward motion while still showing judgment about where agents are actually useful.",
      links: {
        github: "#",
        demo: "#",
        caseStudy: "#"
      },
      accent: "glow" as const
    }
  ],
  experience: [
    {
      period: "Current",
      role: "Independent Builder",
      company: "Personal portfolio of work",
      summary:
        "Building practical software, automation, and AI projects in public while deepening backend, product, and systems skills."
    },
    {
      period: "Recent",
      role: "Analytics / Reporting / Operations-Facing Technical Work",
      company: "Business systems and decision support",
      summary:
        "Worked across reporting, KPI visibility, workflow improvement, stakeholder requests, and operational problem-solving tied to real business outcomes."
    },
    {
      period: "Foundation",
      role: "Data and Workflow Problem Solver",
      company: "Cross-functional business environments",
      summary:
        "Built the habit of translating messy business needs into cleaner processes, useful reporting, and better decision support."
    }
  ],
  skills: [
    {
      title: "AI / LLM",
      items: ["RAG pipelines", "Prompt design", "Evaluation thinking", "Tool calling", "Applied AI UX"]
    },
    {
      title: "Data",
      items: ["SQL", "Analytics design", "Data modeling", "KPI reporting", "Business analysis"]
    },
    {
      title: "Automation",
      items: ["Workflow design", "Webhook orchestration", "System handoffs", "n8n", "Operational tooling"]
    },
    {
      title: "Backend / App",
      items: ["Next.js", "TypeScript", "Python", "API design", "Postgres"]
    },
    {
      title: "BI / Visualization",
      items: ["Power BI", "Dashboard storytelling", "Decision support", "Metric framing"]
    },
    {
      title: "Platforms / Tools",
      items: ["GitHub", "Vercel", "Supabase", "Excel", "Documentation systems"]
    }
  ],
  contact: {
    prompt: "Open to conversations around data, software, automation, and applied AI work.",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/clark-thompson-2267a9239/" },
      { label: "Email", href: "mailto:clarkt1822@gmail.com" },
      { label: "GitHub", href: "https://github.com/clarkt1822" }
    ]
  },
  terminal: {
    commands: ["help", "about", "projects", "stack", "resume", "contact", "clear"]
  }
} as const;

export type SiteContent = typeof siteContent;
