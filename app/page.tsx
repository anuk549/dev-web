"use client";

import Image from "next/image";
import { useMemo, useState, useCallback } from "react";
import jsPDF from "jspdf";

const DEV_PHONE = normalizeWhatsAppNumber(
  process.env.NEXT_PUBLIC_DEV_WHATSAPP_NUMBER ||
    process.env.NEXT_PUBLIC_DEV_PHONE ||
    "",
);
const LOGO_SRC = "/logo.jpg";
const STEPS = 9;

type CrudKey = "create" | "read" | "update" | "delete" | "search";

interface FieldSpec {
  label: string;
  type: string;
}

interface PageSpec {
  topic: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  search: boolean;
  fields: FieldSpec[];
}

interface RelationSpec {
  sourceTable: string;
  relationType: string;
  targetTable: string;
}

const stepItems = [
  { idx: 1, label: "Frontend", icon: "ti-layout-dashboard" },
  { idx: 2, label: "Language", icon: "ti-code" },
  { idx: 3, label: "Backend", icon: "ti-server" },
  { idx: 4, label: "Database", icon: "ti-database" },
  { idx: 5, label: "Features", icon: "ti-shield-check" },
  { idx: 6, label: "Schema", icon: "ti-table" },
  { idx: 7, label: "Relations", icon: "ti-git-fork" },
  { idx: 8, label: "Contact", icon: "ti-brand-whatsapp" },
];

const fieldTypes = [
  "String",
  "Integer",
  "Float",
  "Date",
  "Boolean",
  "Image/File",
  "Email",
  "Phone",
  "Text",
];

const initialPages: PageSpec[] = [
  {
    topic: "Students",
    create: true,
    read: true,
    update: true,
    delete: true,
    search: false,
    fields: [
      { label: "id", type: "Integer" },
      { label: "name", type: "String" },
      { label: "email", type: "Email" },
    ],
  },
];

const feedbackItems = [
  {
    name: "නිපුන් දිල්ෂාන්",
    role: "IT Undergraduate",
    feedback:
      "මගේ web project එක deadline එකට කලින් complete කරලා දුන්නා. UI එක clean, database part එකත් හොඳට වැඩ කළා.",
  },
  {
    name: "කවීෂා පෙරේරා",
    role: "Software Engineering",
    feedback:
      "Assignment එකේ requirements explain කරලා, අවශ්‍ය features ටික professional විදිහට build කරලා දුන්නා. Communication එකත් හොඳයි.",
  },
  {
    name: "රවිඳු මධුෂාන්",
    role: "Final Year Student",
    feedback:
      "Login system, admin dashboard, database tables හැම එකම demo එකට ready විදිහට හදලා දුන්නා. Presentation එකට confidence එකක් ආවා.",
  },
  {
    name: "Amaya Silva",
    role: "Business Management",
    feedback:
      "Dev+ turned my idea into a polished web app. The quote flow was clear, delivery was fast, and the final UI looked professional.",
  },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);

  const [frontend, setFrontend] = useState<string | null>(null);
  const [language, setLanguage] = useState<string | null>(null);
  const [backend, setBackend] = useState<string | null>(null);
  const [database, setDatabase] = useState<string | null>(null);

  const [login, setLogin] = useState(true);
  const [encrypt, setEncrypt] = useState(true);
  const [jwt, setJwt] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [email, setEmail] = useState(false);
  const [upload, setUpload] = useState(false);
  const [search, setSearch] = useState(false);

  const [pages, setPages] = useState<PageSpec[]>(initialPages);
  const [activePageIdx, setActivePageIdx] = useState(0);

  const [fk, setFk] = useState(false);
  const [relations, setRelations] = useState<RelationSpec[]>([]);
  const [sourceTable, setSourceTable] = useState("Students");
  const [relationType, setRelationType] = useState("Has Many (1:N)");
  const [targetTable, setTargetTable] = useState("Students");

  const [clientName, setClientName] = useState("");
  const [clientUni, setClientUni] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientWa, setClientWa] = useState("");
  const [clientDesc, setClientDesc] = useState("");

  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMsgVisible, setSuccessMsgVisible] = useState(false);
  const [compilationStep, setCompilationStep] = useState<number | null>(null);
  const [compilationLogs, setCompilationLogs] = useState<string[]>([]);
  const [compilationProgress, setCompilationProgress] = useState(0);
  const [summaryDrawerOpen, setSummaryDrawerOpen] = useState(false);

  const clampedActivePageIdx = Math.min(activePageIdx, Math.max(0, pages.length - 1));
  const activePage = pages[clampedActivePageIdx] || null;
  const fkDesc = relations
    .map((r) => `${r.sourceTable} --(${r.relationType})--> ${r.targetTable}`)
    .join(", ");

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setMaxStepReached((prev) => Math.max(prev, step));
  };

  const quote = useMemo(() => {
    const getPagePrice = (p: PageSpec) => {
      let price = 0;
      if (p.read) price += 500;
      if (p.create) price += 400;
      if (p.update) price += 400;
      if (p.delete) price += 400;
      if (p.search) price += 300;
      return price;
    };

    const breakdown: { label: string; val: number }[] = [];
    let total = 0;
    const pageTotal = pages.reduce((sum, p) => sum + getPagePrice(p), 0);
    if (pageTotal > 0) {
      breakdown.push({ label: `${pages.length} database table model${pages.length > 1 ? "s" : ""}`, val: pageTotal });
      total += pageTotal;
    }

    [
      [login, "User authentication suite", 500],
      [encrypt, "Password encryption", 200],
      [jwt, "JWT token security", 300],
      [admin, "Admin dashboard", 1000],
      [email, "Automated email setup", 500],
      [upload, "Secure file uploads", 500],
      [search, "Application search", 500],
      [fk, "Database relationships", 500],
    ].forEach(([enabled, label, val]) => {
      if (enabled) {
        breakdown.push({ label: label as string, val: val as number });
        total += val as number;
      }
    });

    let days = 0;
    pages.forEach((p) => {
      if (p.read) days += 1;
      if (p.create || p.update || p.delete) days += 1;
      if (p.search) days += 1;
    });
    if (admin) days += 2;
    if (jwt || email) days += 1;
    if (fk) days += 1;

    return { breakdown, total, days: Math.max(2, days) };
  }, [admin, email, encrypt, fk, jwt, login, pages, search, upload]);

  const modules = [
    { label: "Auth", active: login, color: "sky" },
    { label: "Bcrypt", active: encrypt, color: "emerald" },
    { label: "JWT", active: jwt, color: "indigo" },
    { label: "Admin", active: admin, color: "amber" },
    { label: "Email", active: email, color: "rose" },
    { label: "Uploads", active: upload, color: "teal" },
    { label: "Search", active: search, color: "violet" },
  ].filter((item) => item.active);

  const selectedStack = [frontend, language, backend, database].filter(Boolean).join(" / ");
  const progressPercent = Math.round((Math.max(currentStep, 1) / (STEPS - 1)) * 100);

  const validateStep = (step: number) => {
    if (step === 1 && !frontend) return "Choose a frontend framework to continue.";
    if (step === 2 && !language) return "Choose a programming language to continue.";
    if (step === 3 && !backend) return "Choose a backend option to continue.";
    if (step === 4 && !database) return "Choose a database engine to continue.";
    if (step === 8) {
      if (!clientName.trim()) return "Please enter your name.";
      if (!clientEmail.trim()) return "Please enter your email.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim())) return "Please enter a valid email address.";
    }
    return null;
  };

  const handleNext = () => {
    setValidationError(null);
    const error = validateStep(currentStep);
    if (error) {
      setValidationError(error);
      return;
    }
    if (currentStep < STEPS - 1) {
      const nextStep = currentStep + 1;
      goToStep(nextStep);
      return;
    }
    triggerQuoteGeneration();
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleCrudToggle = (pageIdx: number, key: CrudKey) => {
    setPages((prev) => {
      const copy = [...prev];
      copy[pageIdx] = { ...copy[pageIdx], [key]: !copy[pageIdx][key] };
      return copy;
    });
  };

  const handleAddPage = () => {
    setPages((prev) => [
      ...prev,
      {
        topic: `Table${prev.length + 1}`,
        create: true,
        read: true,
        update: true,
        delete: true,
        search: false,
        fields: [{ label: "id", type: "Integer" }],
      },
    ]);
    setActivePageIdx(pages.length);
  };

  const handleRemovePage = (idx: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (pages.length <= 1) return;
    setPages((prev) => prev.filter((_, pageIdx) => pageIdx !== idx));
    setActivePageIdx((prev) => {
      if (prev === idx) return Math.max(0, idx - 1);
      if (prev > idx) return prev - 1;
      return prev;
    });
  };

  const updatePage = (idx: number, patch: Partial<PageSpec>) => {
    setPages((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });
  };

  const updateField = (pageIdx: number, fieldIdx: number, patch: Partial<FieldSpec>) => {
    setPages((prev) => {
      const copy = [...prev];
      const fields = [...copy[pageIdx].fields];
      fields[fieldIdx] = { ...fields[fieldIdx], ...patch };
      copy[pageIdx] = { ...copy[pageIdx], fields };
      return copy;
    });
  };

  const handleAddField = (pageIdx: number) => {
    setPages((prev) => {
      const copy = [...prev];
      copy[pageIdx] = {
        ...copy[pageIdx],
        fields: [...copy[pageIdx].fields, { label: "", type: "String" }],
      };
      return copy;
    });
  };

  const handleRemoveField = (pageIdx: number, fieldIdx: number) => {
    setPages((prev) => {
      const copy = [...prev];
      copy[pageIdx] = {
        ...copy[pageIdx],
        fields: copy[pageIdx].fields.filter((_, idx) => idx !== fieldIdx),
      };
      return copy;
    });
  };

  const getWhatsAppMessage = () => {
    const pagesText = pages
      .map((p, idx) => {
        const ops = (["create", "read", "update", "delete", "search"] as CrudKey[])
          .filter((key) => p[key])
          .map((key) => key.toUpperCase())
          .join("/");
        const fieldsList = p.fields.map((f) => `${f.label || "unnamed"}: ${f.type}`).join(", ");
        return `Page ${idx + 1} (${p.topic || "Unnamed"}) [${ops}] - Fields: [${fieldsList || "No fields configured"}]`;
      })
      .join("\n- ");

    const authList = [
      login && "Login/Register",
      encrypt && "Password Encryption",
      jwt && "JWT Auth",
      admin && "Admin Dashboard",
    ].filter(Boolean).join(", ") || "None";

    const extrasList = [
      email && "Email Setup",
      upload && "File Upload",
      search && "Search",
      fk && "FK/PK Relations",
    ].filter(Boolean).join(", ") || "None";

    return (
      `Hi Dev+!\n\nI just configured my project:\n\n` +
      `Name: ${clientName}\n` +
      `Uni/Course: ${clientUni || "N/A"}\n` +
      `Email: ${clientEmail}\n` +
      `WhatsApp: ${clientWa || "N/A"}\n\n` +
      `Tech Stack:\n- Frontend: ${frontend}\n- Language: ${language}\n- Backend: ${backend}\n- Database: ${database}\n\n` +
      `Auth: ${authList}\nFeatures: ${extrasList}\n\n` +
      `Dynamic Pages & Schemas:\n- ${pagesText}\n\n` +
      (fk && fkDesc ? `Relationships: ${fkDesc}\n\n` : "") +
      `Total Cost: ${quote.total.toLocaleString()} LKR\n` +
      `Estimated Delivery: ${quote.days}-${quote.days + 2} days\n\n` +
      `Details/Topic: ${clientDesc || "None specified"}\n\nPlease confirm and let's get started.`
    );
  };

  const openWhatsApp = () => {
    if (!DEV_PHONE) {
      showMissingWhatsAppNumber();
      return;
    }

    const msg = encodeURIComponent(getWhatsAppMessage());
    window.open(`https://wa.me/${DEV_PHONE}?text=${msg}`, "_blank");
  };

  const showMissingWhatsAppNumber = () => {
    window.alert("WhatsApp number is not configured. Set NEXT_PUBLIC_DEV_WHATSAPP_NUMBER and redeploy.");
  };

  const triggerQuoteGeneration = () => {
    setValidationError(null);
    setCompilationStep(0);
    setCompilationLogs([]);
    setCompilationProgress(0);

    const logs = [
      `Preparing ${frontend} project shell with ${language}...`,
      `Mapping ${backend} services to ${database} storage...`,
      `Packing selected modules: ${modules.map((m) => m.label).join(", ") || "Core only"}...`,
      `Compiling schema models: ${pages.map((p) => p.topic).join(", ")}...`,
      "Quote package ready. Opening WhatsApp...",
    ];

    let logIndex = 0;
    const timer = window.setInterval(() => {
      setCompilationLogs((prev) => [...prev, logs[logIndex]]);
      logIndex += 1;
      setCompilationProgress(Math.min(100, Math.floor((logIndex / logs.length) * 100)));
      setCompilationStep(logIndex);

      if (logIndex >= logs.length) {
        window.clearInterval(timer);
        window.setTimeout(() => {
          setCompilationStep(null);
          setSuccessMsgVisible(true);
          openWhatsApp();
        }, 700);
      }
    }, 520);
  };

  const generatePDF = useCallback(async () => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let y = 15;

      // Helper function to add text
      const addText = (text: string, x: number, yPos: number, size: number, bold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
        pdf.setFontSize(size);
        if (bold) pdf.setFont("helvetica", "bold");
        else pdf.setFont("helvetica", "normal");
        pdf.setTextColor(color[0], color[1], color[2]);
        pdf.text(text, x, yPos);
      };

      // Helper to add a filled rectangle
      const addBox = (x: number, y: number, w: number, h: number, color: [number, number, number]) => {
        pdf.setFillColor(color[0], color[1], color[2]);
        pdf.rect(x, y, w, h, "F");
      };

      // Header
      addBox(margin, y - 5, contentWidth, 25, [15, 23, 42]);
      addText("Dev+ Project Quote", margin + 5, y + 8, 18, true, [255, 255, 255]);
      addText(`Date: ${new Date().toLocaleDateString()}`, margin + 5, y + 16, 8, false, [200, 200, 200]);
      y += 28;

      // Client info (if available)
      if (clientName || clientEmail) {
        addText("Client Information", margin, y, 12, true);
        y += 8;
        if (clientName) {
          addText(`Name: ${clientName}`, margin + 5, y, 10);
          y += 6;
        }
        if (clientEmail) {
          addText(`Email: ${clientEmail}`, margin + 5, y, 10);
          y += 6;
        }
        if (clientUni) {
          addText(`University/Course: ${clientUni}`, margin + 5, y, 10);
          y += 6;
        }
        y += 4;
      }

      // Tech Stack
      addText("Technology Stack", margin, y, 12, true);
      y += 8;
      const stackItems = [
        ["Frontend", frontend || "Not selected"],
        ["Language", language || "Not selected"],
        ["Backend", backend || "Not selected"],
        ["Database", database || "Not selected"],
      ];
      stackItems.forEach(([label, value]) => {
        addText(`${label}:`, margin + 5, y, 10, true);
        addText(value, margin + 40, y, 10, false);
        y += 6;
      });
      y += 4;

      // Modules/Features
      const activeModules = modules.filter(m => m.active);
      if (activeModules.length > 0) {
        addText("Features & Modules", margin, y, 12, true);
        y += 8;
        activeModules.forEach(mod => {
          addText(`• ${mod.label}`, margin + 5, y, 10);
          y += 6;
        });
        y += 4;
      }

      // Pages/Tables
      addText("Database Tables", margin, y, 12, true);
      y += 8;
      pages.forEach((page, idx) => {
        const crudKeys: CrudKey[] = ["create", "read", "update", "delete", "search"];
        const ops = crudKeys
          .filter(key => page[key])
          .map(key => key.toUpperCase())
          .join("/");
        addText(`${idx + 1}. ${page.topic || `Table ${idx + 1}`} [${ops || "None"}]`, margin + 5, y, 10);
        y += 6;
        page.fields.forEach(field => {
          addText(`   - ${field.label || "unnamed"}: ${field.type}`, margin + 10, y, 9);
          y += 5;
        });
        y += 2;
      });
      y += 4;

      // Relationships
      if (fk && relations.length > 0) {
        addText("Database Relationships", margin, y, 12, true);
        y += 8;
        relations.forEach(rel => {
          addText(`• ${rel.sourceTable} ${rel.relationType} ${rel.targetTable}`, margin + 5, y, 10);
          y += 6;
        });
        y += 4;
      }

      // Pricing
      y += 5;
      addBox(margin, y, contentWidth, 30, [241, 245, 249]);
      addText("Pricing Summary", margin + 5, y + 8, 12, true);
      y += 14;
      quote.breakdown.forEach(item => {
        addText(item.label, margin + 5, y, 10);
        addText(`${item.val.toLocaleString()} LKR`, pageWidth - margin - 30, y, 10, true);
        y += 6;
      });
      y += 4;

      // Total
      addBox(margin, y, contentWidth, 12, [15, 23, 42]);
      addText("Total Estimate", margin + 5, y + 8, 12, true, [255, 255, 255]);
      addText(`${quote.total.toLocaleString()} LKR`, pageWidth - margin - 30, y + 8, 14, true, [255, 255, 255]);
      y += 16;

      // Delivery
      addText(`Estimated Delivery: ${quote.days}-${quote.days + 2} working days`, margin, y, 10, false, [45, 212, 191]);

      // Footer
      const footerY = 280;
      addBox(margin, footerY, contentWidth, 10, [241, 245, 249]);
      addText("Thank you for choosing Dev+!", margin + 5, footerY + 7, 9, false, [100, 116, 139]);

      pdf.save(`DevPlus-Quote-${clientName.replace(/\s+/g, "-") || "Project"}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      window.alert("Failed to generate PDF. Please try again.");
    }
  }, [clientName, frontend, language, backend, database, modules, pages, fk, relations, quote]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-app-shell text-slate-950 selection:bg-teal-200/70">
      {compilationStep !== null && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-slate-950 p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-300" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                Dev+ quote builder
              </span>
            </div>
            <div className="min-h-40 space-y-3 font-mono text-sm text-slate-300">
              {compilationLogs.map((log) => (
                <p key={log} className="leading-relaxed">
                  <span className="text-teal-300">$</span> {log}
                </p>
              ))}
              <span className="terminal-cursor text-teal-300" />
            </div>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                <span>Building request</span>
                <span>{compilationProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-teal-300 via-sky-400 to-amber-300 transition-all" style={{ width: `${compilationProgress}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-30 border-b border-slate-900/10 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <button type="button" onClick={() => setCurrentStep(0)} className="flex items-center gap-3" aria-label="Go to Dev+ welcome page">
            <Image src={LOGO_SRC} alt="Dev+ logo" width={112} height={40} className="h-9 w-auto object-contain" priority />
            <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 sm:inline-flex">
              Project Studio
            </span>
          </button>
          <div className="flex items-center gap-2">
            <a href={DEV_PHONE ? `https://wa.me/${DEV_PHONE}` : "#"} onClick={(event) => {
              if (!DEV_PHONE) {
                event.preventDefault();
                showMissingWhatsAppNumber();
              }
            }} target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm sm:inline-flex">
              <i className="ti ti-brand-whatsapp text-base" /> WhatsApp
            </a>
            {currentStep > 0 ? (
              <button type="button" onClick={() => setSummaryDrawerOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm lg:hidden">
                <i className="ti ti-receipt" /> {quote.total.toLocaleString()} LKR
              </button>
            ) : (
              <button type="button" onClick={() => goToStep(1)} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm lg:hidden">
                Start <i className="ti ti-arrow-right" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className={`mx-auto max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:py-7 ${currentStep === 0 ? "block" : "grid lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)_300px]"}`}>
        {currentStep > 0 && (
        <aside className="hidden lg:block">
          <div className="surface-panel sticky top-24 p-4">
            <div className="mb-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Progress</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-sky-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            <nav className="space-y-2">
              {stepItems.map((item) => {
                const active = currentStep === item.idx;
                const done = currentStep > item.idx;
                const accessible = item.idx <= maxStepReached;
                return (
                  <button
                    key={item.idx}
                    type="button"
                    disabled={!accessible}
                    onClick={() => {
                      setValidationError(null);
                      setCurrentStep(item.idx);
                    }}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${active ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/10" : accessible ? "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50" : "border-transparent bg-slate-50 text-slate-300"}`}
                  >
                    <span className={`grid h-9 w-9 place-items-center rounded-xl ${active ? "bg-white/10" : done ? "bg-emerald-50 text-emerald-600" : "bg-slate-100"}`}>
                      <i className={`ti ${done ? "ti-check" : item.icon}`} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-extrabold">{item.label}</span>
                      <span className={`block text-xs ${active ? "text-white/55" : "text-slate-400"}`}>Step {item.idx}</span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>
        )}

        <section className="min-w-0">
          {currentStep === 0 ? (
            <WelcomeScreen quoteTotal={quote.total} days={quote.days} onStart={() => goToStep(1)} />
          ) : (
            <div className="surface-panel overflow-hidden">
              <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-teal-700">
                    Step {currentStep} of {STEPS - 1}
                  </span>
                  <span className="text-sm font-bold text-slate-500">{selectedStack || "Configure your stack"}</span>
                </div>
                <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{getStepTitle(currentStep)}</h1>
              </div>

              <div className="min-h-[560px] p-4 sm:p-6 lg:p-7">
                {validationError && (
                  <div className="mb-4 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                    <i className="ti ti-alert-circle text-lg" />
                    <span>{validationError}</span>
                  </div>
                )}

                {currentStep === 1 && (
                  <ChoiceGrid
                    cols="sm:grid-cols-2"
                    items={[
                      { name: "React", sub: "Fast SPA with a clean component system", icon: "ti-brand-react" },
                      { name: "Next.js", sub: "SEO-ready App Router project", icon: "ti-brand-nextjs" },
                      { name: "Vite", sub: "Lean frontend for compact projects", icon: "ti-bolt" },
                      { name: "Vue", sub: "Friendly UI with Nuxt option", icon: "ti-brand-vue" },
                    ]}
                    value={frontend}
                    onSelect={setFrontend}
                    clearError={() => setValidationError(null)}
                  />
                )}

                {currentStep === 2 && (
                  <ChoiceGrid
                    cols="sm:grid-cols-2"
                    items={[
                      { name: "TypeScript", sub: "Typed, maintainable, production-friendly", icon: "ti-brand-typescript" },
                      { name: "JavaScript", sub: "Simple, quick, and familiar", icon: "ti-brand-javascript" },
                    ]}
                    value={language}
                    onSelect={setLanguage}
                    clearError={() => setValidationError(null)}
                  />
                )}

                {currentStep === 3 && (
                  <ChoiceGrid
                    cols="sm:grid-cols-3"
                    items={[
                      { name: "Next.js API", sub: "One project with built-in route handlers", icon: "ti-brand-nextjs" },
                      { name: "Node/Express", sub: "Custom REST API service", icon: "ti-brand-nodejs" },
                      { name: "Spring Boot", sub: "Structured Java backend", icon: "ti-leaf" },
                    ]}
                    value={backend}
                    onSelect={setBackend}
                    clearError={() => setValidationError(null)}
                  />
                )}

                {currentStep === 4 && (
                  <ChoiceGrid
                    cols="sm:grid-cols-4"
                    items={[
                      { name: "Firebase", sub: "Auth and realtime data", icon: "ti-flame" },
                      { name: "MongoDB", sub: "Flexible document storage", icon: "ti-database" },
                      { name: "MySQL", sub: "Classic relational DB", icon: "ti-sql" },
                      { name: "PostgreSQL", sub: "Advanced relational DB", icon: "ti-database-cog" },
                    ]}
                    value={database}
                    onSelect={setDatabase}
                    clearError={() => setValidationError(null)}
                  />
                )}

                {currentStep === 5 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { label: "Login & register", desc: "+500 LKR", active: login, set: setLogin, icon: "ti-user-check" },
                      { label: "Password encryption", desc: "+200 LKR", active: encrypt, set: setEncrypt, icon: "ti-shield-lock" },
                      { label: "JWT tokens", desc: "+300 LKR", active: jwt, set: setJwt, icon: "ti-key" },
                      { label: "Admin dashboard", desc: "+1,000 LKR", active: admin, set: setAdmin, icon: "ti-dashboard" },
                      { label: "Email automation", desc: "+500 LKR", active: email, set: setEmail, icon: "ti-mail" },
                      { label: "File uploads", desc: "+500 LKR", active: upload, set: setUpload, icon: "ti-cloud-upload" },
                      { label: "Search feature", desc: "+500 LKR", active: search, set: setSearch, icon: "ti-search" },
                    ].map((item) => (
                      <ToggleCard key={item.label} {...item} />
                    ))}
                  </div>
                )}

                {currentStep === 6 && activePage && (
                  <SchemaEditor
                    pages={pages}
                    activePageIdx={clampedActivePageIdx}
                    activePage={activePage}
                    setActivePageIdx={setActivePageIdx}
                    handleAddPage={handleAddPage}
                    handleRemovePage={handleRemovePage}
                    updatePage={updatePage}
                    handleCrudToggle={handleCrudToggle}
                    handleAddField={handleAddField}
                    handleRemoveField={handleRemoveField}
                    updateField={updateField}
                  />
                )}

                {currentStep === 7 && (
                  <RelationsEditor
                    fk={fk}
                    setFk={setFk}
                    pages={pages}
                    relations={relations}
                    sourceTable={sourceTable}
                    targetTable={targetTable}
                    relationType={relationType}
                    setSourceTable={setSourceTable}
                    setTargetTable={setTargetTable}
                    setRelationType={setRelationType}
                    setValidationError={setValidationError}
                    setRelations={setRelations}
                  />
                )}

                {currentStep === 8 && (
                  <ContactStep
                    clientName={clientName}
                    clientUni={clientUni}
                    clientEmail={clientEmail}
                    clientWa={clientWa}
                    clientDesc={clientDesc}
                    setClientName={setClientName}
                    setClientUni={setClientUni}
                    setClientEmail={setClientEmail}
                    setClientWa={setClientWa}
                    setClientDesc={setClientDesc}
                    breakdown={quote.breakdown}
                    total={quote.total}
                    days={quote.days}
                    onWhatsApp={openWhatsApp}
                    onDownloadPDF={generatePDF}
                    successMsgVisible={successMsgVisible}
                  />
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
                <button type="button" onClick={handleBack} className="btn-secondary">
                  <i className="ti ti-arrow-left" /> Back
                </button>
                <button type="button" onClick={handleNext} className="btn-primary">
                  {currentStep === STEPS - 1 ? (
                    <>
                      <i className="ti ti-file-invoice" /> Compile Quote
                    </>
                  ) : (
                    <>
                      Next <i className="ti ti-arrow-right" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>

        {currentStep > 0 && (
        <aside className="hidden xl:block">
          <SummaryPanel
            frontend={frontend}
            language={language}
            backend={backend}
            database={database}
            modules={modules}
            pages={pages}
            fk={fk}
            relations={relations}
            total={quote.total}
            days={quote.days}
          />
        </aside>
        )}
      </main>

      {summaryDrawerOpen && currentStep > 0 && (
        <div className="fixed inset-0 z-40 flex items-end bg-slate-950/60 p-3 backdrop-blur-sm lg:hidden">
          <div className="max-h-[82vh] w-full overflow-y-auto rounded-[28px] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-950">Project summary</h2>
              <button type="button" onClick={() => setSummaryDrawerOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600">
                <i className="ti ti-x" />
              </button>
            </div>
            <SummaryPanel
              frontend={frontend}
              language={language}
              backend={backend}
              database={database}
              modules={modules}
              pages={pages}
              fk={fk}
              relations={relations}
              total={quote.total}
              days={quote.days}
              compact
            />
          </div>
        </div>
      )}
    </div>
  );
}

function getStepTitle(step: number) {
  return [
    "Build a professional web project quote",
    "Choose the frontend experience",
    "Select the development language",
    "Pick your backend architecture",
    "Choose the database layer",
    "Add the features your project needs",
    "Model your pages and data",
    "Connect your database tables",
    "Share the request with Dev+",
  ][step];
}

function normalizeWhatsAppNumber(phone: string) {
  return phone.replace(/\D/g, "");
}

function WelcomeScreen({ quoteTotal, days, onStart }: { quoteTotal: number; days: number; onStart: () => void }) {
  return (
    <div className="space-y-5">
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
      <div className="grid min-h-[calc(100vh-118px)] lg:grid-cols-[1.04fr_0.96fr]">
        <div className="flex flex-col justify-between p-5 sm:p-8 lg:p-10">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-black text-teal-800">
              <i className="ti ti-sparkles text-base" /> Student and business web projects
            </div>
            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Plan your web project with confidence
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Build a clear quote by choosing your stack, features, pages, database models, and delivery details. No guessing, no messy back-and-forth.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={onStart} className="btn-primary px-6 py-3 text-sm">
                Start configuration <i className="ti ti-arrow-right" />
              </button>
              <a href="mailto:anuk200101@gmail.com" className="btn-secondary px-6 py-3 text-sm">
                <i className="ti ti-mail" /> Email Dev+
              </a>
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ["Live estimate", `${quoteTotal.toLocaleString()} LKR`],
              ["Delivery window", `${days}-${days + 2} days`],
              ["Support", "WhatsApp ready"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
                <p className="mt-2 text-lg font-black text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[420px] bg-slate-950 p-6 text-white sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(45,212,191,0.28),transparent_35%),radial-gradient(circle_at_70%_0%,rgba(251,191,36,0.18),transparent_28%),linear-gradient(135deg,#0f172a,#111827_55%,#022c22)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <Image src={LOGO_SRC} alt="Dev+ app mark" width={92} height={92} className="rounded-3xl border border-white/15 bg-white p-2 shadow-2xl" priority />
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/70">
                Quote OS
              </span>
            </div>
            <div className="mt-10 space-y-4">
              {[
                ["Choose stack", "Frontend, backend, language, database"],
                ["Design schema", "Tables, attributes, CRUD actions"],
                ["Confirm price", "Instant LKR estimate and timeline"],
              ].map(([item, desc], idx) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <div className="flex items-center gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-sm font-black text-slate-950">{idx + 1}</span>
                    <div>
                      <p className="font-black">{item}</p>
                      <p className="text-sm text-white/55">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-lg shadow-slate-200/60 sm:p-7">
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">Feedback</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">What students say</h2>
        </div>
        <p className="max-w-md text-sm font-semibold leading-6 text-slate-500">
          Sample project feedback shown to make the start page feel trustworthy before users begin the quote flow.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {feedbackItems.map((item) => (
          <article key={item.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-950">{item.name}</h3>
                <p className="mt-1 text-xs font-bold text-slate-500">{item.role}</p>
              </div>
              <div className="flex text-amber-400" aria-label="5 star feedback">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i key={star} className="ti ti-star-filled text-sm" />
                ))}
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-700">&ldquo;{item.feedback}&rdquo;</p>
          </article>
        ))}
      </div>
    </section>
    </div>
  );
}

function ChoiceGrid({
  items,
  value,
  onSelect,
  clearError,
  cols,
}: {
  items: { name: string; sub: string; icon: string }[];
  value: string | null;
  onSelect: (value: string) => void;
  clearError: () => void;
  cols: string;
}) {
  return (
    <div className={`grid gap-4 ${cols}`}>
      {items.map((item) => {
        const active = value === item.name;
        return (
          <button
            key={item.name}
            type="button"
            onClick={() => {
              onSelect(item.name);
              clearError();
            }}
            className={`option-card text-left ${active ? "is-active" : ""}`}
          >
            <span className="flex items-start justify-between gap-3">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${active ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500"}`}>
                <i className={`ti ${item.icon}`} />
              </span>
              <span className={`grid h-7 w-7 place-items-center rounded-full border ${active ? "border-teal-500 bg-teal-500 text-white" : "border-slate-200 text-transparent"}`}>
                <i className="ti ti-check text-sm" />
              </span>
            </span>
            <span className="mt-6 block text-lg font-black text-slate-950">{item.name}</span>
            <span className="mt-2 block text-sm leading-6 text-slate-500">{item.sub}</span>
          </button>
        );
      })}
    </div>
  );
}

function ToggleCard({ label, desc, active, set, icon }: { label: string; desc: string; active: boolean; set: (value: boolean) => void; icon: string }) {
  return (
    <button type="button" onClick={() => set(!active)} className={`option-card flex items-center justify-between gap-4 text-left ${active ? "is-active" : ""}`}>
      <span className="flex items-center gap-4">
        <span className={`grid h-12 w-12 place-items-center rounded-2xl text-xl ${active ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500"}`}>
          <i className={`ti ${icon}`} />
        </span>
        <span>
          <span className="block font-black text-slate-950">{label}</span>
          <span className="mt-1 block text-sm font-bold text-slate-400">{desc}</span>
        </span>
      </span>
      <span className={`relative h-7 w-12 rounded-full transition ${active ? "bg-teal-500" : "bg-slate-200"}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${active ? "left-6" : "left-1"}`} />
      </span>
    </button>
  );
}

function SchemaEditor(props: {
  pages: PageSpec[];
  activePageIdx: number;
  activePage: PageSpec;
  setActivePageIdx: (idx: number) => void;
  handleAddPage: () => void;
  handleRemovePage: (idx: number, event: React.MouseEvent) => void;
  updatePage: (idx: number, patch: Partial<PageSpec>) => void;
  handleCrudToggle: (pageIdx: number, key: CrudKey) => void;
  handleAddField: (pageIdx: number) => void;
  handleRemoveField: (pageIdx: number, fieldIdx: number) => void;
  updateField: (pageIdx: number, fieldIdx: number, patch: Partial<FieldSpec>) => void;
}) {
  const { pages, activePageIdx, activePage } = props;
  return (
    <div className="grid gap-4 xl:grid-cols-[190px_minmax(0,1fr)]">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Tables</p>
          <button type="button" onClick={props.handleAddPage} className="grid h-8 w-8 place-items-center rounded-full bg-slate-950 text-white">
            <i className="ti ti-plus" />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto xl:block xl:space-y-2">
          {pages.map((page, idx) => (
            <div key={`${page.topic}-${idx}`} className={`min-w-40 rounded-2xl border bg-white/60 p-2 xl:w-full ${activePageIdx === idx ? "border-teal-300 bg-white shadow-sm" : "border-slate-200"}`}>
              <div className="flex items-start justify-between gap-2">
                <button type="button" onClick={() => props.setActivePageIdx(idx)} className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-black text-slate-950">{page.topic || `Table ${idx + 1}`}</span>
                  <span className="mt-2 block text-xs font-bold text-slate-400">{page.fields.length} attributes</span>
                </button>
                {pages.length > 1 && (
                  <button type="button" onClick={(event) => props.handleRemovePage(idx, event)} aria-label={`Remove ${page.topic || `Table ${idx + 1}`}`} className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                    <i className="ti ti-x text-xs" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="block">
            <span className="form-label">Table name</span>
            <input value={activePage.topic} onChange={(e) => props.updatePage(activePageIdx, { topic: e.target.value })} className="form-input mt-2" placeholder="Products" />
          </label>
          <div>
            <span className="form-label">Actions</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["create", "read", "update", "delete", "search"] as CrudKey[]).map((key) => (
                <button key={key} type="button" onClick={() => props.handleCrudToggle(activePageIdx, key)} className={`rounded-full border px-3 py-2 text-xs font-black uppercase ${activePage[key] ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-500"}`}>
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Attributes</p>
            <button type="button" onClick={() => props.handleAddField(activePageIdx)} className="btn-secondary px-3 py-2 text-xs">
              <i className="ti ti-plus" /> Attribute
            </button>
          </div>
          <div className="space-y-2">
            {activePage.fields.map((field, idx) => (
              <div key={idx} className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-2 md:grid-cols-[minmax(0,1fr)_160px_44px]">
                <input value={field.label} onChange={(e) => props.updateField(activePageIdx, idx, { label: e.target.value })} className="form-input" placeholder="field_name" />
                <select value={field.type} onChange={(e) => props.updateField(activePageIdx, idx, { type: e.target.value })} className="form-input">
                  {fieldTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <button type="button" onClick={() => props.handleRemoveField(activePageIdx, idx)} className="grid h-11 w-full place-items-center rounded-xl text-rose-500 hover:bg-rose-50">
                  <i className="ti ti-trash" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RelationsEditor(props: {
  fk: boolean;
  setFk: (value: boolean) => void;
  pages: PageSpec[];
  relations: RelationSpec[];
  sourceTable: string;
  targetTable: string;
  relationType: string;
  setSourceTable: (value: string) => void;
  setTargetTable: (value: string) => void;
  setRelationType: (value: string) => void;
  setValidationError: (value: string | null) => void;
  setRelations: React.Dispatch<React.SetStateAction<RelationSpec[]>>;
}) {
  const tableOptions = props.pages.map((p) => p.topic || "Untitled");
  const selectedSource = tableOptions.includes(props.sourceTable) ? props.sourceTable : tableOptions[0] || "";
  const selectedTarget = tableOptions.includes(props.targetTable)
    ? props.targetTable
    : tableOptions[Math.min(1, tableOptions.length - 1)] || "";

  return (
    <div className="space-y-4">
      <ToggleCard label="Enable table relationships" desc="+500 LKR" active={props.fk} set={props.setFk} icon="ti-git-fork" />
      {props.fk && (
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <SelectBox label="Source model" value={selectedSource} onChange={props.setSourceTable} options={tableOptions} />
            <SelectBox label="Relation" value={props.relationType} onChange={props.setRelationType} options={["Has Many (1:N)", "Belongs To (1:1)", "Many to Many (M:N)"]} />
            <SelectBox label="Target model" value={selectedTarget} onChange={props.setTargetTable} options={tableOptions} />
          </div>
          <button
            type="button"
            onClick={() => {
              if (selectedSource === selectedTarget) {
                props.setValidationError("A table cannot relate to itself in this basic setup.");
                return;
              }
              const exists = props.relations.some(
                (relation) =>
                  relation.sourceTable === selectedSource &&
                  relation.targetTable === selectedTarget &&
                  relation.relationType === props.relationType
              );
              if (exists) {
                props.setValidationError("This relationship is already added.");
                return;
              }
              props.setValidationError(null);
              props.setRelations((prev) => [...prev, { sourceTable: selectedSource, relationType: props.relationType, targetTable: selectedTarget }]);
            }}
            className="btn-primary"
          >
            <i className="ti ti-plus" /> Add relationship
          </button>
          <div className="space-y-2">
            {props.relations.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-bold text-slate-400">
                No relationships added yet.
              </div>
            ) : (
              props.relations.map((relation, idx) => (
                <div key={`${relation.sourceTable}-${idx}`} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-black text-slate-800">
                    {relation.sourceTable} <span className="text-teal-600">{relation.relationType}</span> {relation.targetTable}
                  </p>
                  <button type="button" onClick={() => props.setRelations((prev) => prev.filter((_, relIdx) => relIdx !== idx))} className="grid h-9 w-9 place-items-center rounded-full text-rose-500 hover:bg-rose-50">
                    <i className="ti ti-trash" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SelectBox({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="form-label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="form-input mt-2">
        {options.map((option, idx) => (
          <option key={`${option}-${idx}`} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function ContactStep(props: {
  clientName: string;
  clientUni: string;
  clientEmail: string;
  clientWa: string;
  clientDesc: string;
  setClientName: (value: string) => void;
  setClientUni: (value: string) => void;
  setClientEmail: (value: string) => void;
  setClientWa: (value: string) => void;
  setClientDesc: (value: string) => void;
  breakdown: { label: string; val: number }[];
  total: number;
  days: number;
  onWhatsApp: () => void;
  onDownloadPDF: () => void;
  successMsgVisible: boolean;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <TextInput label="Your name" required value={props.clientName} onChange={props.setClientName} placeholder="Kasun Perera" />
        <TextInput label="University / course" value={props.clientUni} onChange={props.setClientUni} placeholder="SLIIT - Software Engineering" />
        <TextInput label="Email" required value={props.clientEmail} onChange={props.setClientEmail} placeholder="your@email.com" type="email" />
        <TextInput label="WhatsApp number" value={props.clientWa} onChange={props.setClientWa} placeholder="+94 7X XXX XXXX" />
        <label className="block">
          <span className="form-label">Topic details and deadlines</span>
          <textarea value={props.clientDesc} onChange={(e) => props.setClientDesc(e.target.value)} rows={5} className="form-input mt-2 resize-none" placeholder="Briefly describe the project topic, deadline, and special requirements." />
        </label>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 lg:sticky lg:top-24">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Pricing summary</p>
        <div className="mt-4 space-y-2">
          {props.breakdown.map((item) => (
            <div key={item.label} className="flex justify-between gap-3 border-b border-slate-200 pb-2 text-sm">
              <span className="font-bold text-slate-600">{item.label}</span>
              <span className="font-black text-slate-950">{item.val.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-3xl bg-slate-950 p-5 text-white">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/45">Total estimate</p>
          <p className="mt-2 text-3xl font-black">{props.total.toLocaleString()} LKR</p>
          <p className="mt-1 text-sm font-bold text-teal-200">{props.days}-{props.days + 2} working days</p>
        </div>
        <button type="button" onClick={props.onWhatsApp} className="mt-4 w-full justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500">
          <i className="ti ti-brand-whatsapp mr-2" /> Send on WhatsApp
        </button>
        <button type="button" onClick={props.onDownloadPDF} className="mt-3 w-full justify-center rounded-2xl border-2 border-slate-950 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100">
          <i className="ti ti-file-download mr-2" /> Download PDF Quote
        </button>
        {props.successMsgVisible && <p className="mt-3 rounded-2xl bg-emerald-50 p-3 text-center text-sm font-bold text-emerald-700">Request opened in WhatsApp.</p>}
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, required = false, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; required?: boolean; type?: string }) {
  return (
    <label className="block">
      <span className="form-label">{label} {required && <span className="text-rose-500">*</span>}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="form-input mt-2" placeholder={placeholder} required={required} />
    </label>
  );
}

function SummaryPanel(props: {
  frontend: string | null;
  language: string | null;
  backend: string | null;
  database: string | null;
  modules: { label: string; active: boolean; color: string }[];
  pages: PageSpec[];
  fk: boolean;
  relations: RelationSpec[];
  total: number;
  days: number;
  compact?: boolean;
}) {
  return (
    <div className={`${props.compact ? "" : "surface-panel sticky top-24"} p-4`}>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Live estimate</p>
      <div className="mt-3 rounded-3xl bg-slate-950 p-5 text-white">
        <p className="text-3xl font-black">{props.total.toLocaleString()} LKR</p>
        <p className="mt-1 text-sm font-bold text-teal-200">{props.days}-{props.days + 2} working days</p>
      </div>
      <div className="mt-4 grid gap-3">
        {[
          ["Frontend", props.frontend || "Not selected"],
          ["Language", props.language || "Not selected"],
          ["Backend", props.backend || "Not selected"],
          ["Database", props.database || "Not selected"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
            <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Modules</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {props.modules.length ? props.modules.map((module) => (
            <span key={module.label} className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">{module.label}</span>
          )) : <span className="text-sm font-bold text-slate-400">None selected</span>}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Tables</p>
          <p className="mt-1 text-xl font-black text-slate-950">{props.pages.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Joins</p>
          <p className="mt-1 text-xl font-black text-slate-950">{props.fk ? props.relations.length : 0}</p>
        </div>
      </div>
    </div>
  );
}
