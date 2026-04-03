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
      summary: "AI-powered system for querying structured knowledge using retrieval-augmented generation.",
      problem:
        "Built a low-cost RAG pipeline to retrieve and generate context-aware responses over structured data.",
      built:
        "Designed the system using OpenAI and Supabase pgvector to enable semantic search and efficient document retrieval.",
      description:
        "Built a low-cost RAG pipeline to retrieve and generate context-aware responses over structured data. Designed the system using OpenAI and Supabase pgvector to enable semantic search and efficient document retrieval.",
      highlights: [
        "Implemented vector-based retrieval using Supabase pgvector",
        "Built full query pipeline with context injection and response generation",
        "Designed for low-cost, scalable deployment",
        "Focused on practical internal knowledge use cases"
      ],
      stack: ["TypeScript", "Next.js", "OpenAI API", "Supabase", "pgvector"],
      techLine: "TypeScript, Next.js, OpenAI API, Supabase, pgvector",
      impact:
        "Focused on practical internal knowledge use cases and scalable deployment for grounded retrieval workflows.",
      links: {
        github: "https://github.com/clarkt1822/rag-knowledge-assistant",
        demo: "#",
        caseStudy: "#"
      },
      primaryLink: {
        label: "GitHub",
        href: "https://github.com/clarkt1822/rag-knowledge-assistant"
      },
      accent: "signal" as const
    },
    {
      title: "Stock Trend Scanner",
      summary: "Web-first stock scanning system evolved from an earlier Python desktop tool, focused on structured scan logic, ranked outputs, and repeatable workflows.",
      problem:
        "Running repeatable market scans and reviewing results was tied to a local desktop workflow, limiting flexibility, iteration speed, and the ability to extend or surface outputs beyond a single environment.",
      built:
        "Refactored an existing Python desktop scanner into a modular system with a backend API and web-based interface, preserving core scan logic while improving how scans are executed, reviewed, and extended.",
      description:
         "Re-architected a desktop-based scanning tool into a backend-driven system with clearer separation between scan logic, execution, and presentation, making the workflow easier to maintain and evolve.",
      highlights: [
        "Built a desktop GUI for running scans and reviewing ranked outputs",
        "Structured workflows around universe selection, scan modes, and repeatable execution",
        "Combined data processing, filtering, and export functionality",
        "Focused on usability alongside market analysis workflows"
      ],
      stack: ["Python", "FastAPI", "TypeScript", "Next.js", "pandas", "numpy", "yfinance"],
      techLine: "Python, FastAPI, TypeScript, Next.js, pandas, numpy, yfinance",
      impact:
        "Combines operational workflow design with data processing and a usable desktop interface.",
      links: {
        github: "https://github.com/clarkt1822/stock-trend-scanner-portfolio-v3-",
        demo: "#",
        caseStudy: "#"
      },
      primaryLink: {
        label: "GitHub",
        href: "https://github.com/clarkt1822/stock-trend-scanner-portfolio-v3-"
      },
      accent: "glow" as const
    },
    {
      title: "SimWorld League Operations System",
      summary: "Supported and improved an internal operations system used to manage league workflows, scheduling, and simulation support.",
      problem:
        "Worked within an existing internal system used to support league operations, scheduling logic, and simulation workflows across an 84-team environment.",
      built:
        "Contributed to system upkeep, operational improvements, and backend process support in a logic-heavy no-code environment.",
      description:
        "Worked within an existing internal system used to support league operations, scheduling logic, and simulation workflows across an 84-team environment. Contributed to system upkeep, operational improvements, and backend process support in a logic-heavy no-code environment.",
      highlights: [
        "Helped maintain and improve a system managing teams, rosters, scheduling, and simulation workflows",
        "Supported updates to scheduling logic, operational flows, and backend coordination",
        "Worked with structured, relational league data inside a no-code environment",
        "Contributed to real-time operational support across daily simulation workflows"
      ],
      stack: ["Google Sheets", "Workflow Logic", "Operations Support", "Data Structuring", "No-Code Systems"],
      techLine: "Google Sheets, Workflow Logic, Operations Support, Data Structuring, No-Code Systems",
      impact:
        "Experience centered on support, improvement, and coordination inside a live operational system rather than greenfield ownership.",
      links: {
        github: "#",
        demo: "#",
        caseStudy: "#"
      },
      primaryLink: {
        label: "Internal system",
        href: "#"
      },
      accent: "ember" as const
    },
    {
      title: "CT/OS — Portfolio System",
      summary: "System-style portfolio exploring interaction patterns beyond traditional web layouts.",
      problem:
        "Designed and built a desktop-inspired interface to present work through a multi-window system.",
      built:
        "Focused on layout behavior, state management, and interaction quality using modern frontend tools.",
      description:
        "Designed and built a desktop-inspired interface to present work through a multi-window system. Focused on layout behavior, state management, and interaction quality using modern frontend tools.",
      highlights: [
        "Implemented window system with open, focus, minimize, and drag behavior",
        "Built shared content architecture across components",
        "Designed interaction patterns and motion behavior",
        "Prioritized system feel over static layouts"
      ],
      stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      techLine: "Next.js, React, TypeScript, Tailwind CSS",
      impact:
        "Demonstrates frontend systems thinking through interaction design, UI state, and shared content architecture.",
      links: {
        github: "https://github.com/clarkt1822/clark-thompson-webos-portfolio",
        demo: "#",
        caseStudy: "#"
      },
      primaryLink: {
        label: "GitHub",
        href: "https://github.com/clarkt1822/clark-thompson-webos-portfolio"
      },
      accent: "signal" as const
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
      title: "AI / LLM Systems",
      items: [
        "RAG pipelines",
        "Agentic workflows",
        "Prompt & context engineering",
        "Tool calling / function calling",
        "LLM evaluation & iteration",
        "Structured outputs",
        "Applied AI UX",
        "Semantic search & embeddings"
      ]
    },
    {
      title: "Data Systems",
      items: [
        "SQL",
        "Data modeling",
        "ETL pipeline design",
        "KPI architecture",
        "Analytics design",
        "Data validation & QA",
        "Forecasting"
      ]
    },
    {
      title: "Automation & Integrations",
      items: [
        "Workflow design",
        "API integrations (REST)",
        "Webhooks",
        "n8n / Make",
        "System orchestration",
        "Cloud deployments (Vercel)"
      ]
    },
    {
      title: "Business Execution",
      items: [
        "Translating business problems into AI systems",
        "Technical discovery (data, workflows, integrations)",
        "Solution architecture for real-world use cases",
        "AI workflow design tied to business outcomes",
        "Rapid prototyping -> production iteration",
        "Working directly with ops/sales teams to deploy usable systems",
        "System debugging in live environments"
      ]
    },
    {
      title: "Backend / Engineering",
      items: [
        "Python",
        "TypeScript",
        "API design",
        "Postgres / SQL",
        "MongoDB",
        "Next.js",
        "Logging & monitoring"
      ]
    },
    {
      title: "Analytics & Decision Support",
      items: [
        "Power BI / Tableau",
        "Dashboard design",
        "Forecasting",
        "Metric framing",
        "Decision systems"
      ]
    },
    {
      title: "Systems & Architecture",
      items: [
        "End-to-end system design",
        "Integration architecture",
        "Scalable architecture",
        "Debugging complex systems",
        "Translating business -> technical"
      ]
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
