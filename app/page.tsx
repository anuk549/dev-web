"use client";

import { useState, useEffect } from "react";

const DEV_PHONE = "94771234567";
const STEPS = 9; // 1 (Intro Welcome) + 8 (Configurator Steps)

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

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);

  // Stack state
  const [frontend, setFrontend] = useState<string | null>(null);
  const [language, setLanguage] = useState<string | null>(null);
  const [backend, setBackend] = useState<string | null>(null);
  const [database, setDatabase] = useState<string | null>(null);

  // Features state
  const [login, setLogin] = useState(true);
  const [encrypt, setEncrypt] = useState(true);
  const [jwt, setJwt] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [email, setEmail] = useState(false);
  const [upload, setUpload] = useState(false);
  const [search, setSearch] = useState(false);

  // Pages & Fields state
  const [pages, setPages] = useState<PageSpec[]>([
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
  ]);
  const [activePageIdx, setActivePageIdx] = useState(0);

  // DB Relations state
  const [fk, setFk] = useState(false);
  const [fkDesc, setFkDesc] = useState("");
  const [relations, setRelations] = useState<{ sourceTable: string; relationType: string; targetTable: string }[]>([]);
  const [sourceTable, setSourceTable] = useState("");
  const [relationType, setRelationType] = useState("Has Many (1:N)");
  const [targetTable, setTargetTable] = useState("");

  // Contact details state
  const [clientName, setClientName] = useState("");
  const [clientUni, setClientUni] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientWa, setClientWa] = useState("");
  const [clientDesc, setClientDesc] = useState("");

  // UI Feedback state
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMsgVisible, setSuccessMsgVisible] = useState(false);

  // Compilation Simulator state
  const [compilationStep, setCompilationStep] = useState<number | null>(null);
  const [compilationLogs, setCompilationLogs] = useState<string[]>([]);
  const [compilationProgress, setCompilationProgress] = useState(0);

  // Mobile drawer state
  const [summaryDrawerOpen, setSummaryDrawerOpen] = useState(false);

  // Furthest step reached for timeline safety
  useEffect(() => {
    if (currentStep > maxStepReached) {
      setMaxStepReached(currentStep);
    }
  }, [currentStep, maxStepReached]);

  // Sync relation builder select dropdown defaults
  useEffect(() => {
    if (pages.length > 0) {
      if (!sourceTable || !pages.some((p) => p.topic === sourceTable)) {
        setSourceTable(pages[0].topic);
      }
      if (!targetTable || !pages.some((p) => p.topic === targetTable)) {
        setTargetTable(pages[Math.min(1, pages.length - 1)].topic);
      }
    }
  }, [pages, sourceTable, targetTable]);

  // Maintain fkDesc backward compatibility from interactive relationships list
  useEffect(() => {
    const desc = relations
      .map((r) => `${r.sourceTable} ──(${r.relationType})──> ${r.targetTable}`)
      .join(", ");
    setFkDesc(desc);
  }, [relations]);

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

  // Auto-correct activePageIdx if pages list size shrinks
  useEffect(() => {
    if (activePageIdx >= pages.length) {
      setActivePageIdx(Math.max(0, pages.length - 1));
    }
  }, [pages.length, activePageIdx]);

  function getPagePrice(p: PageSpec) {
    let price = 0;
    if (p.read) price += 500;
    if (p.create) price += 400;
    if (p.update) price += 400;
    if (p.delete) price += 400;
    if (p.search) price += 300;
    return price;
  }

  // Cost and Days calculations
  const calculateQuote = () => {
    const breakdown: { label: string; val: number }[] = [];
    let total = 0;

    const pageTotal = pages.reduce((s, p) => s + getPagePrice(p), 0);
    if (pageTotal > 0) {
      breakdown.push({ label: `${pages.length} Database Schema Tables`, val: pageTotal });
      total += pageTotal;
    }

    if (login) {
      breakdown.push({ label: "User Authentication Suite", val: 500 });
      total += 500;
    }
    if (encrypt) {
      breakdown.push({ label: "Password Cryptography (bcrypt)", val: 200 });
      total += 200;
    }
    if (jwt) {
      breakdown.push({ label: "Stateless Auth Tokens (JWT)", val: 300 });
      total += 300;
    }
    if (admin) {
      breakdown.push({ label: "Admin Console Panel", val: 1000 });
      total += 1000;
    }
    if (email) {
      breakdown.push({ label: "SMTP / Automated Email integration", val: 500 });
      total += 500;
    }
    if (upload) {
      breakdown.push({ label: "Secure Cloud File Uploads", val: 500 });
      total += 500;
    }
    if (search) {
      breakdown.push({ label: "High-performance Search Engine", val: 500 });
      total += 500;
    }
    if (fk) {
      breakdown.push({ label: "Relational Table Foreign Keys", val: 500 });
      total += 500;
    }

    // Days calculation
    let calculatedDays = 0;
    pages.forEach((p) => {
      if (p.read) calculatedDays += 1;
      if (p.create || p.update || p.delete) calculatedDays += 1;
      if (p.search) calculatedDays += 1;
    });

    if (admin) calculatedDays += 2;
    if (jwt || email) calculatedDays += 1;
    if (fk) calculatedDays += 1;
    calculatedDays = Math.max(2, calculatedDays);

    return { breakdown, total, days: calculatedDays };
  };

  const { breakdown, total, days } = calculateQuote();

  // Pages & Fields schema operations
  const handlePageTopicChange = (idx: number, topic: string) => {
    setPages((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], topic };
      return copy;
    });
  };

  const handleCrudToggle = (
    pageIdx: number,
    key: "create" | "read" | "update" | "delete" | "search"
  ) => {
    setPages((prev) => {
      const copy = [...prev];
      copy[pageIdx] = { ...copy[pageIdx], [key]: !copy[pageIdx][key] };
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
      const fieldsCopy = [...copy[pageIdx].fields];
      fieldsCopy.splice(fieldIdx, 1);
      copy[pageIdx] = {
        ...copy[pageIdx],
        fields: fieldsCopy,
      };
      return copy;
    });
  };

  const handleFieldLabelChange = (
    pageIdx: number,
    fieldIdx: number,
    label: string
  ) => {
    setPages((prev) => {
      const copy = [...prev];
      const fieldsCopy = [...copy[pageIdx].fields];
      fieldsCopy[fieldIdx] = { ...fieldsCopy[fieldIdx], label };
      copy[pageIdx] = { ...copy[pageIdx], fields: fieldsCopy };
      return copy;
    });
  };

  const handleFieldTypeChange = (
    pageIdx: number,
    fieldIdx: number,
    type: string
  ) => {
    setPages((prev) => {
      const copy = [...prev];
      const fieldsCopy = [...copy[pageIdx].fields];
      fieldsCopy[fieldIdx] = { ...fieldsCopy[fieldIdx], type };
      copy[pageIdx] = { ...copy[pageIdx], fields: fieldsCopy };
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

  const handleRemovePage = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (pages.length <= 1) return;
    setPages((prev) => {
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
    setActivePageIdx((prev) => Math.max(0, prev - 1));
  };

  const validateStep = (step: number) => {
    if (step === 1 && !frontend) return "Please select a frontend framework.";
    if (step === 2 && !language) return "Please select a language.";
    if (step === 3 && !backend) return "Please select a backend framework.";
    if (step === 4 && !database) return "Please select a database.";
    if (step === 8) {
      if (!clientName.trim()) return "Please enter your name.";
      if (!clientEmail.trim()) return "Please enter your email.";
    }
    return null;
  };

  const handleNext = () => {
    setValidationError(null);
    const err = validateStep(currentStep);
    if (err) {
      setValidationError(err);
      return;
    }

    if (currentStep < STEPS - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      triggerQuoteGeneration();
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const getWhatsAppMessage = () => {
    const pagesText = pages
      .map((p, i) => {
        const ops = [
          p.create && "CREATE",
          p.read && "READ",
          p.update && "UPDATE",
          p.delete && "DELETE",
          p.search && "SEARCH",
        ]
          .filter(Boolean)
          .join("/");

        const fieldsList = p.fields
          .map((f) => `${f.label || "unnamed"}: ${f.type}`)
          .join(", ");

        return `Page ${i + 1} (${p.topic || "Unnamed"}) [${ops}] — Fields: [${
          fieldsList || "No fields configured"
        }]`;
      })
      .join("\n- ");

    const authList = [
      login && "Login/Register",
      encrypt && "Password Encryption",
      jwt && "JWT Auth",
      admin && "Admin Dashboard",
    ]
      .filter(Boolean)
      .join(", ") || "None";
    const extrasList = [
      email && "Email Setup",
      upload && "File Upload",
      search && "Search",
      fk && "FK/PK Relations",
    ]
      .filter(Boolean)
      .join(", ") || "None";

    return (
      `Hi Dev+! 👋\n\nI just configured my project:\n\n` +
      `👤 Name: ${clientName}\n` +
      `🎓 Uni/Course: ${clientUni || "N/A"}\n` +
      `📧 Email: ${clientEmail}\n` +
      `💬 WhatsApp: ${clientWa || "N/A"}\n\n` +
      `🛠️ Tech Stack:\n` +
      `- Frontend: ${frontend}\n` +
      `- Language: ${language}\n` +
      `- Backend: ${backend}\n` +
      `- Database: ${database}\n\n` +
      `🔒 Auth: ${authList}\n` +
      `⚙️ Features: ${extrasList}\n\n` +
      `📄 Dynamic Pages & Schemas:\n- ${pagesText}\n\n` +
      (fk && fkDesc ? `🔗 Relationships: ${fkDesc}\n\n` : "") +
      `💰 Total Cost: ${total.toLocaleString()} LKR\n` +
      `⏱️ Est. Delivery: ${days}–${days + 2} days\n\n` +
      `📝 Details/Topic: ${clientDesc || "None specified"}\n\n` +
      `Please confirm and let's get started!`
    );
  };

  const triggerQuoteGeneration = () => {
    setValidationError(null);
    setCompilationStep(0);
    setCompilationLogs([]);
    setCompilationProgress(0);

    const logs = [
      `[1/5] Bootstrapping template configuration with ${frontend} and ${language}...`,
      `[2/5] Synthesizing backend router logic for ${backend}...`,
      `[3/5] Syncing database connectors for ${database} database...`,
      `[4/5] Injecting core security features: ${[
        login && "LoginSessions",
        encrypt && "bcryptHash",
        jwt && "jwtVerify",
        admin && "AdminConsole",
        email && "SMTPNotifier",
        upload && "CloudinaryUpload",
        search && "ElasticIndexes",
      ]
        .filter(Boolean)
        .join(", ") || "No modules selected"}...`,
      `[5/5] Compiling DB relational models: ${pages.map((p) => p.topic).join(", ")}...`,
      `[SUCCESS] Configuration package compiled successfully! Redirecting...`,
    ];

    let logIndex = 0;
    const intervalTime = 600;

    const timer = setInterval(() => {
      setCompilationLogs((prev) => [...prev, logs[logIndex]]);
      logIndex++;
      setCompilationProgress(
        Math.min(100, Math.floor((logIndex / logs.length) * 100))
      );

      if (logIndex >= logs.length) {
        clearInterval(timer);
        setTimeout(() => {
          setCompilationStep(null);
          setSuccessMsgVisible(true);
          const msg = encodeURIComponent(getWhatsAppMessage());
          window.open(`https://wa.me/${DEV_PHONE}?text=${msg}`, "_blank");
        }, 850);
      }
    }, intervalTime);
  };

  const handleOpenWhatsAppManual = () => {
    const msg = encodeURIComponent(getWhatsAppMessage());
    window.open(`https://wa.me/${DEV_PHONE}?text=${msg}`, "_blank");
  };

  // Step Summaries Helper
  const getStepSummaryText = () => {
    const stepNames = [
      "Welcome Screen",
      "Frontend Framework",
      "Programming Language",
      "Backend Architecture",
      "Database Layer",
      "Security & Authentication",
      "Database Schema Modeler",
      "Relational Joins",
      "Generate Quotation",
    ];
    const parts = [
      frontend && `Frontend: ${frontend}`,
      language && `Language: ${language}`,
      backend && `Backend: ${backend}`,
      database && `Database: ${database}`,
    ].filter(Boolean);

    const summary = parts.length
      ? parts.join(" · ")
      : "Configure your setup step by step.";
    return {
      currentStepName: stepNames[currentStep],
      summaryLine: `${summary} · Est: ${total.toLocaleString()} LKR`,
    };
  };

  const { currentStepName, summaryLine } = getStepSummaryText();

  // Safe active page definition
  const activePage = pages[activePageIdx] || pages[0] || null;

  // Custom data-type tag styling helper (Prisma Data Browser theme)
  const getDataTypeBadgeClass = (type: string) => {
    switch (type) {
      case "String":
      case "Text":
        return "bg-emerald-950/45 text-emerald-400 border border-emerald-500/20";
      case "Integer":
      case "Float":
        return "bg-blue-950/45 text-blue-400 border border-blue-500/20";
      case "Date":
        return "bg-amber-950/45 text-amber-400 border border-amber-500/20";
      case "Boolean":
        return "bg-purple-950/45 text-purple-400 border border-purple-500/20";
      case "Email":
      case "Phone":
        return "bg-cyan-950/45 text-cyan-400 border border-cyan-500/20";
      case "Image/File":
        return "bg-rose-950/45 text-rose-400 border border-rose-500/20";
      default:
        return "bg-zinc-800 text-zinc-300 border border-zinc-700/50";
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-grid-pattern relative text-[#f0f5ff] font-sans antialiased selection:bg-blue-500/30">
      
      {/* Ambient background glows */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-blue-500/10 to-transparent blur-[130px] pointer-events-none z-0 animate-pulseGlow" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[450px] h-[450px] bg-blue-600/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[350px] h-[350px] bg-indigo-600/3 blur-[100px] pointer-events-none z-0" />

      {/* Compiler logs simulation overlay screen */}
      {compilationStep !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#030712]/95 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-xl bg-[#090d16] border border-[#1d2d5c]/60 rounded-2xl p-6 shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col font-mono text-xs text-blue-300">
            <div className="flex items-center justify-between border-b border-[#1d2d5c]/35 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[#6b6890] text-[10px] font-bold">DEV+ COMPILER TERMINAL</span>
            </div>
            
            <div className="flex-grow space-y-2.5 min-h-[160px] overflow-y-auto pr-1">
              {compilationLogs.map((log, idx) => (
                <div 
                  key={idx} 
                  className={`leading-relaxed ${
                    log.startsWith("[SUCCESS]") 
                      ? "text-emerald-400 font-bold" 
                      : log.startsWith("[1/") || log.startsWith("[2/") || log.startsWith("[3/") || log.startsWith("[4/") || log.startsWith("[5/") 
                      ? "text-blue-400" 
                      : "text-blue-200/80"
                  }`}
                >
                  {log}
                </div>
              ))}
              <div className="terminal-cursor text-blue-500 font-bold text-xs" />
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-[10px] text-[#6b6890] mb-2 font-bold uppercase tracking-wider">
                <span>Compiling setup...</span>
                <span>{compilationProgress}%</span>
              </div>
              <div className="w-full bg-[#121835] rounded-full h-2 overflow-hidden border border-[#1d2d5c]/50">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(0,102,255,0.5)]" 
                  style={{ width: `${compilationProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header bar */}
      {currentStep > 0 && (
        <header className="flex-shrink-0 w-full border-b border-[#1d2d5c]/35 bg-[#070c20]/50 py-3 px-6 flex items-center justify-between z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Dev+ Logo"
              className="h-9 sm:h-11 w-auto object-contain rounded-md"
            />
            <span className="text-xs font-semibold text-[#6b6890] hidden sm:inline">/ Project Configurator</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-blue-500/15 bg-blue-950/20 px-3.5 py-1 text-xs font-semibold text-blue-300">
              <i className="ti ti-mail text-[13px] text-blue-400 animate-pulse" /> anuk200101@gmail.com
            </span>
          </div>
        </header>
      )}

      {/* Main content grid area */}
      <main className="flex-grow w-full overflow-hidden flex items-center justify-center p-3 sm:p-5 z-10">
        {currentStep === 0 ? (
          <div className="w-full max-w-2xl flex flex-col items-center justify-center text-center p-6 sm:p-12 border border-[#1d2d5c]/50 bg-[#0c122c]/50 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.12)] backdrop-blur-xl animate-fadeIn relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-blue-500/5 blur-3xl pointer-events-none" />
            
            <div className="relative group animate-float">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 opacity-30 blur-lg group-hover:opacity-75 transition duration-500" />
              <img
                src="/logo-square.jpg"
                alt="Dev+ Banner"
                className="relative h-24 w-24 sm:h-32 sm:w-32 object-contain rounded-3xl border border-blue-500/20 bg-white p-1.5 shadow-md"
              />
            </div>

            <h1 className="mt-6 text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Dev<span className="text-[#f472b6]">+</span>
            </h1>

            <p className="mt-3 text-xs sm:text-base text-blue-200/80 max-w-md leading-relaxed font-medium">
              We focus exclusively on web-based project development, delivering modern and scalable solutions.
            </p>

            <div className="mt-8 w-full max-w-md bg-[#0e1430]/70 border border-blue-500/15 rounded-2xl p-5 shadow-[inset_0_0_15px_rgba(59,130,246,0.06)]">
              <h3 className="text-xs sm:text-sm font-black text-blue-300 flex items-center justify-center gap-1.5 uppercase tracking-wider">
                🎓 Struggling with Assignments or Projects?
              </h3>
              <p className="mt-1 text-xs text-[#c0bdd8]/70 font-medium">
                Don’t worry — Dev+ is here to help! 🚀
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 text-xs font-bold text-blue-400">
                <i className="ti ti-brand-whatsapp text-sm text-emerald-400" /> Call / WhatsApp Support: +94 77 123 4567
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 py-3 px-8 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-500/10 active:scale-98 hover:scale-[1.01] transition-all duration-200 cursor-pointer"
            >
              Configure Your Project <i className="ti ti-arrow-right" />
            </button>
          </div>
        ) : (
          <div className="w-full h-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch overflow-hidden">
            
            {/* Timeline Sidebar (Desktop only) */}
            <div className="hidden lg:flex lg:col-span-3 flex-col glass-panel rounded-2xl p-4 overflow-y-auto">
              <span className="text-[10px] font-black text-[#6b6890] uppercase tracking-widest mb-4 border-b border-[#1d2d5c]/25 pb-2 block">
                Configuration Progress
              </span>
              
              <div className="space-y-1">
                {[
                  { idx: 1, label: "Frontend Framework", icon: "ti-brand-react" },
                  { idx: 2, label: "Programming Language", icon: "ti-brand-typescript" },
                  { idx: 3, label: "Backend Server", icon: "ti-brand-nodejs" },
                  { idx: 4, label: "Database Layer", icon: "ti-database" },
                  { idx: 5, label: "Security & Modules", icon: "ti-shield" },
                  { idx: 6, label: "Database Schema", icon: "ti-server" },
                  { idx: 7, label: "Table Relations", icon: "ti-git-fork" },
                  { idx: 8, label: "Submit & WhatsApp", icon: "ti-brand-whatsapp" },
                ].map((s) => {
                  const isCompleted = currentStep > s.idx;
                  const isActive = currentStep === s.idx;
                  const isAccessible = s.idx <= maxStepReached;
                  
                  return (
                    <div
                      key={s.idx}
                      onClick={() => {
                        if (isAccessible) {
                          setValidationError(null);
                          setCurrentStep(s.idx);
                        }
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 select-none ${
                        isActive 
                          ? "bg-blue-600/10 border-blue-500/50 text-blue-300 font-bold shadow-[0_0_12px_rgba(59,130,246,0.06)]"
                          : isAccessible
                          ? "bg-[#121835]/15 border-[#1d2d5c]/30 text-[#9ca3c0] hover:border-blue-500/20 cursor-pointer"
                          : "border-transparent text-[#6b6890]/40 cursor-not-allowed"
                      }`}
                    >
                      <div className={`h-6 w-6 rounded-lg flex items-center justify-center border transition-all ${
                        isActive 
                          ? "bg-blue-500/20 border-blue-500 text-blue-400" 
                          : isCompleted 
                          ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-400" 
                          : "bg-[#121835]/30 border-transparent text-[#6b6890]/50"
                      }`}>
                        {isCompleted ? (
                          <i className="ti ti-check text-xs font-bold" />
                        ) : (
                          <i className={`ti ${s.icon} text-xs`} />
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <span className="block text-xs truncate">{s.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Form Panel */}
            <div className="col-span-1 lg:col-span-6 flex flex-col glass-panel rounded-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-blue-500/5 blur-3xl pointer-events-none" />

              <div className="p-4 sm:p-5 border-b border-[#1d2d5c]/35 flex-shrink-0 bg-[#070c20]/30">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 bg-blue-950/30 border border-blue-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                    <i className="ti ti-settings-2 text-[10px]" /> STEP {currentStep} OF {STEPS - 1}
                  </span>
                  <span className="text-xs font-bold text-blue-300">
                    {currentStepName}
                  </span>
                </div>
                <h2 className="mt-2.5 text-sm sm:text-base font-bold text-[#f0f5ff] tracking-wide">
                  {currentStep === 1 && "Select Frontend Framework"}
                  {currentStep === 2 && "Choose Development Language"}
                  {currentStep === 3 && "Configure Backend Server"}
                  {currentStep === 4 && "Select Database Engine"}
                  {currentStep === 5 && "Configure Authentication & Core Modules"}
                  {currentStep === 6 && "Define Application Pages & Data Schema"}
                  {currentStep === 7 && "Design Table Relationships"}
                  {currentStep === 8 && "Generate WhatsApp Quote"}
                </h2>
              </div>

              <div key={currentStep} className="p-4 sm:p-5 overflow-y-auto flex-grow text-xs sm:text-sm animate-slideIn">
                {validationError && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-950/15 px-4 py-2.5 text-xs text-red-400 font-semibold animate-fadeIn">
                    <i className="ti ti-alert-circle text-sm" />
                    <span>{validationError}</span>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="grid grid-cols-2 gap-3.5">
                    {[
                      { name: "React", sub: "Vite + SPA Router", icon: "ti-brand-react" },
                      { name: "Next.js", sub: "App Router + SSR", icon: "ti-brand-nextjs" },
                      { name: "Vite", sub: "Vanilla SPA Template", icon: "ti-bolt" },
                      { name: "Vue", sub: "Nuxt Framework", icon: "ti-brand-vue" },
                    ].map((item) => {
                      const isActive = frontend === item.name;
                      return (
                        <div
                          key={item.name}
                          onClick={() => {
                            setFrontend(item.name);
                            setValidationError(null);
                          }}
                          className={`glass-panel-interactive rounded-2xl p-4 text-center cursor-pointer select-none relative ${
                            isActive ? "glow-active border-blue-500 bg-blue-600/5" : ""
                          }`}
                        >
                          <div className={`absolute top-2.5 right-2.5 h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                            isActive ? "border-blue-500 bg-blue-500 text-white" : "border-[#1d2d5c] bg-[#121835]/30"
                          }`}>
                            {isActive && <i className="ti ti-check text-[9px] font-bold" />}
                          </div>
                          
                          <i className={`ti ${item.icon} block text-3xl mb-2 transition-colors ${
                            isActive ? "text-blue-400" : "text-[#6b6890]/50"
                          }`} />
                          <span className={`block text-xs sm:text-sm font-bold tracking-wide ${
                            isActive ? "text-[#f0f5ff]" : "text-[#9ca3c0]"
                          }`}>{item.name}</span>
                          <span className="block text-[10px] text-[#6b6890] mt-1 font-medium">{item.sub}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      { name: "TypeScript", sub: "Strict type safety & production scalable configuration", icon: "ti-brand-typescript" },
                      { name: "JavaScript", sub: "Quick scripting style configuration & dynamic loading", icon: "ti-brand-javascript" },
                    ].map((item) => {
                      const isActive = language === item.name;
                      return (
                        <div
                          key={item.name}
                          onClick={() => {
                            setLanguage(item.name);
                            setValidationError(null);
                          }}
                          className={`glass-panel-interactive rounded-2xl p-4.5 flex items-center gap-4.5 cursor-pointer select-none relative ${
                            isActive ? "glow-active border-blue-500 bg-blue-600/5" : ""
                          }`}
                        >
                          <div className={`absolute top-3 right-3 h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                            isActive ? "border-blue-500 bg-blue-500 text-white" : "border-[#1d2d5c]"
                          }`}>
                            {isActive && <i className="ti ti-check text-[9px]" />}
                          </div>
                          
                          <i className={`ti ${item.icon} text-3xl ${
                            isActive ? "text-blue-400" : "text-[#6b6890]/50"
                          }`} />
                          <div>
                            <span className={`block text-xs sm:text-sm font-bold tracking-wide ${
                              isActive ? "text-[#f0f5ff]" : "text-[#9ca3c0]"
                            }`}>{item.name}</span>
                            <span className="block text-[10px] text-[#6b6890] mt-0.5 font-medium leading-normal">{item.sub}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {[
                      { name: "Next.js API", sub: "Built-in serverless route handlers", icon: "ti-brand-nextjs" },
                      { name: "Node/Express", sub: "Custom standalone Node REST backend", icon: "ti-brand-nodejs" },
                      { name: "Spring Boot", sub: "Robust compiles enterprise Java", icon: "ti-leaf" },
                    ].map((item) => {
                      const isActive = backend === item.name;
                      return (
                        <div
                          key={item.name}
                          onClick={() => {
                            setBackend(item.name);
                            setValidationError(null);
                          }}
                          className={`glass-panel-interactive rounded-2xl p-4 text-center cursor-pointer select-none relative ${
                            isActive ? "glow-active border-blue-500 bg-blue-600/5" : ""
                          }`}
                        >
                          <div className={`absolute top-2.5 right-2.5 h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                            isActive ? "border-blue-500 bg-blue-500 text-white" : "border-[#1d2d5c]"
                          }`}>
                            {isActive && <i className="ti ti-check text-[9px]" />}
                          </div>
                          
                          <i className={`ti ${item.icon} block text-3xl mb-2.5 ${
                            isActive ? "text-blue-400" : "text-[#6b6890]/50"
                          }`} />
                          <span className={`block text-xs font-bold tracking-wide ${
                            isActive ? "text-[#f0f5ff]" : "text-[#9ca3c0]"
                          }`}>{item.name}</span>
                          <span className="block text-[10px] text-[#6b6890] mt-1.5 font-medium leading-normal">{item.sub}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { name: "Firebase", sub: "Auth & DB Combo", icon: "ti-flame" },
                      { name: "MongoDB", sub: "Atlas NoSQL", icon: "ti-database" },
                      { name: "MySQL", sub: "Classic relational", icon: "ti-sql" },
                      { name: "PostgreSQL", sub: "Advanced relational", icon: "ti-database-cog" },
                    ].map((item) => {
                      const isActive = database === item.name;
                      return (
                        <div
                          key={item.name}
                          onClick={() => {
                            setDatabase(item.name);
                            setValidationError(null);
                          }}
                          className={`glass-panel-interactive rounded-2xl p-3 text-center cursor-pointer select-none relative ${
                            isActive ? "glow-active border-blue-500 bg-blue-600/5" : ""
                          }`}
                        >
                          <div className={`absolute top-2 right-2 h-3.5 w-3.5 rounded-full border flex items-center justify-center transition-all ${
                            isActive ? "border-blue-500 bg-blue-500 text-white" : "border-[#1d2d5c]"
                          }`}>
                            {isActive && <i className="ti ti-check text-[8px]" />}
                          </div>
                          
                          <i className={`ti ${item.icon} block text-2xl mb-2 ${
                            isActive ? "text-blue-400" : "text-[#6b6890]/50"
                          }`} />
                          <span className={`block text-xs font-bold tracking-wide ${
                            isActive ? "text-[#f0f5ff]" : "text-[#9ca3c0]"
                          }`}>{item.name}</span>
                          <span className="block text-[9px] text-[#6b6890] mt-1 font-medium">{item.sub}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[300px] sm:max-h-[350px] overflow-y-auto pr-1">
                    {[
                      { id: "login", label: "Login & Register UI", desc: "Interactive auth pages (+500 LKR)", val: login, set: setLogin, icon: "ti-user-check" },
                      { id: "encrypt", label: "Password Cryptography", desc: "Bcrypt hash storage (+200 LKR)", val: encrypt, set: setEncrypt, icon: "ti-shield-lock" },
                      { id: "jwt", label: "JWT Stateless Tokens", desc: "Secure endpoint auth (+300 LKR)", val: jwt, set: setJwt, icon: "ti-key" },
                      { id: "admin", label: "Admin Console Dashboard", desc: "Manage rows & tables (+1,000 LKR)", val: admin, set: setAdmin, icon: "ti-dashboard" },
                      { id: "email", label: "SMTP Auto Emailer", desc: "Transactional email alerts (+500 LKR)", val: email, set: setEmail, icon: "ti-mail" },
                      { id: "upload", label: "Cloud Upload integration", desc: "Store images securely (+500 LKR)", val: upload, set: setUpload, icon: "ti-cloud-upload" },
                      { id: "search", label: "Optimized Search Index", desc: "Fast textual lookups (+500 LKR)", val: search, set: setSearch, icon: "ti-search" },
                    ].map((item) => (
                      <div
                        key={item.id}
                        onClick={() => item.set(!item.val)}
                        className={`glass-panel-interactive rounded-2xl p-3.5 flex items-center justify-between cursor-pointer select-none relative ${
                          item.val ? "border-blue-500/60 bg-blue-600/5 shadow-[0_0_12px_rgba(59,130,246,0.06)]" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-xl flex items-center justify-center border ${
                            item.val ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-[#121835]/20 border-[#1d2d5c]/50 text-[#6b6890]/65"
                          }`}>
                            <i className={`ti ${item.icon} text-base`} />
                          </div>
                          <div>
                            <span className={`block text-xs font-bold ${item.val ? "text-[#f0f5ff]" : "text-[#c0bdd8]"}`}>{item.label}</span>
                            <span className="block text-[9px] text-[#6b6890] mt-0.5 font-medium">{item.desc}</span>
                          </div>
                        </div>
                        
                        <div className="relative inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={item.val}
                            readOnly
                            className="sr-only"
                          />
                          <div className={`w-8 h-4.5 rounded-full transition-all duration-200 relative ${
                            item.val ? "bg-blue-500" : "bg-[#121835]"
                          }`}>
                            <div className={`absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full bg-white transition-all duration-200 ${
                              item.val ? "translate-x-3.5 bg-blue-100" : "bg-[#6b6890]"
                            }`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="flex flex-col sm:flex-row gap-4 h-[350px] overflow-hidden">
                    
                    <div className="flex-shrink-0 w-full sm:w-[170px] flex sm:flex-col border-b sm:border-b-0 sm:border-r border-[#1d2d5c]/35 pb-3 sm:pb-0 sm:pr-3 overflow-x-auto sm:overflow-x-hidden sm:overflow-y-auto gap-2">
                      <span className="hidden sm:block text-[9px] font-black text-[#6b6890] uppercase tracking-wider mb-2">
                        Schemas / Tables
                      </span>
                      
                      <div className="flex sm:flex-col gap-1.5 w-full">
                        {pages.map((p, idx) => (
                          <div
                            key={idx}
                            onClick={() => setActivePageIdx(idx)}
                            className={`flex flex-col gap-1 px-3 py-2 rounded-xl border cursor-pointer transition-all duration-150 select-none ${
                              activePageIdx === idx
                                ? "bg-blue-600/10 border-blue-500/50 text-blue-300"
                                : "bg-[#121835]/15 border-[#1d2d5c]/30 text-[#9ca3c0] hover:border-blue-500/10"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 text-xs font-bold">
                              <span className="truncate flex-grow">
                                <i className="ti ti-table mr-1 text-blue-400" />
                                {p.topic || `Table ${idx + 1}`}
                              </span>
                              {pages.length > 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => handleRemovePage(idx, e)}
                                  className="text-[#6b6890] hover:text-red-400 p-0.5 rounded transition-all"
                                >
                                  <i className="ti ti-x text-[10px]" />
                                </button>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {[
                                { key: "create", char: "C", color: "text-emerald-400 bg-emerald-950/20 border-emerald-500/10" },
                                { key: "read", char: "R", color: "text-blue-400 bg-blue-950/20 border-blue-500/10" },
                                { key: "update", char: "U", color: "text-amber-400 bg-amber-950/20 border-amber-500/10" },
                                { key: "delete", char: "D", color: "text-rose-400 bg-rose-950/20 border-rose-500/10" },
                                { key: "search", char: "S", color: "text-purple-400 bg-purple-950/20 border-purple-500/10" },
                              ].map((tag) => {
                                const active = p[tag.key as keyof PageSpec] as boolean;
                                if (!active) return null;
                                return (
                                  <span
                                    key={tag.key}
                                    className={`text-[8px] font-black h-3.5 w-3.5 flex items-center justify-center rounded border ${tag.color}`}
                                  >
                                    {tag.char}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleAddPage}
                        className="flex-shrink-0 sm:w-full mt-2 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#1d2d5c] hover:border-blue-500/50 bg-[#070c20]/20 py-2 px-3 text-[10px] font-extrabold text-blue-400 hover:bg-[#121835]/15 transition-all cursor-pointer whitespace-nowrap"
                      >
                        + Add Page Table
                      </button>
                    </div>

                    {activePage && (
                      <div className="flex-grow flex flex-col overflow-hidden space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                          <div>
                            <label className="block text-[9px] text-[#6b6890] font-black uppercase tracking-wider">
                              Table Name
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Products"
                              value={activePage.topic}
                              onChange={(e) =>
                                handlePageTopicChange(activePageIdx, e.target.value)
                              }
                              className="mt-1 w-full bg-[#121835]/30 border border-[#1d2d5c]/60 focus:border-blue-500 focus:outline-none rounded-lg py-1.5 px-3 text-xs text-[#f0f5ff] font-bold"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[9px] text-[#6b6890] font-black uppercase tracking-wider">
                              CRUD endpoints
                            </label>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {[
                                { key: "create", label: "CREATE", color: "hover:border-emerald-500/50 text-emerald-400 border-emerald-500/15" },
                                { key: "read", label: "READ", color: "hover:border-blue-500/50 text-blue-400 border-blue-500/15" },
                                { key: "update", label: "UPDATE", color: "hover:border-amber-500/50 text-amber-400 border-amber-500/15" },
                                { key: "delete", label: "DELETE", color: "hover:border-rose-500/50 text-rose-400 border-rose-500/15" },
                                { key: "search", label: "SEARCH", color: "hover:border-purple-500/50 text-purple-400 border-purple-500/15" },
                              ].map((op) => {
                                const isChecked = activePage[op.key as keyof PageSpec] as boolean;
                                return (
                                  <button
                                    key={op.key}
                                    type="button"
                                    onClick={() =>
                                      handleCrudToggle(activePageIdx, op.key as any)
                                    }
                                    className={`px-2 py-0.5 rounded-md border text-[9px] font-black transition-all flex items-center justify-center select-none ${
                                      isChecked
                                        ? "bg-blue-600/15 border-blue-500 text-blue-300"
                                        : `bg-[#121835]/15 border-[#1d2d5c]/40 text-[#6b6890] ${op.color}`
                                    }`}
                                  >
                                    {op.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex-grow flex flex-col overflow-hidden border border-[#1d2d5c]/30 rounded-xl bg-[#070c20]/20 p-3">
                          <div className="flex items-center justify-between border-b border-[#1d2d5c]/20 pb-2 mb-2 flex-shrink-0">
                            <span className="text-[9px] text-[#6b6890] font-black uppercase tracking-wider flex items-center gap-1.5">
                              <i className="ti ti-list text-blue-400" /> Model attributes
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddField(activePageIdx)}
                              className="text-[9px] font-black text-blue-400 hover:text-blue-300 bg-blue-950/20 border border-blue-500/20 px-2.5 py-0.5 rounded-lg transition-all"
                            >
                              + Add Attribute
                            </button>
                          </div>

                          <div className="flex-grow overflow-y-auto pr-1 space-y-1.5">
                            {activePage.fields.length === 0 ? (
                              <div className="text-center py-6 text-xs text-[#6b6890] italic">
                                No attributes declared. Click "+ Add Attribute".
                              </div>
                            ) : (
                              activePage.fields.map((fld, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="flex items-center gap-2 bg-[#121835]/10 px-2 py-1 rounded-lg border border-[#1d2d5c]/20 hover:border-blue-500/10 transition-all"
                                >
                                  <span className="text-[8px] font-black text-[#6b6890] min-w-[15px]">
                                    #{fIdx + 1}
                                  </span>

                                  <input
                                    type="text"
                                    placeholder="e.g. name"
                                    value={fld.label}
                                    onChange={(e) =>
                                      handleFieldLabelChange(activePageIdx, fIdx, e.target.value)
                                    }
                                    className="flex-grow min-w-[70px] bg-[#070c20]/40 border border-[#1d2d5c]/50 focus:border-blue-500 focus:outline-none rounded py-0.5 px-2 text-xs text-[#f0f5ff] font-semibold"
                                  />

                                  <div className="relative flex-shrink-0 flex items-center">
                                    <select
                                      value={fld.type}
                                      onChange={(e) =>
                                        handleFieldTypeChange(activePageIdx, fIdx, e.target.value)
                                      }
                                      className={`appearance-none bg-transparent pr-4 pl-2 py-0.5 text-[9px] font-black rounded cursor-pointer outline-none ${getDataTypeBadgeClass(
                                        fld.type
                                      )}`}
                                    >
                                      {fieldTypes.map((t) => (
                                        <option key={t} value={t} className="bg-[#0c122c] text-[#f0f5ff]">
                                          {t}
                                        </option>
                                      ))}
                                    </select>
                                    <i className="ti ti-chevron-down absolute right-1 pointer-events-none text-[8px] text-[#6b6890]" />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleRemoveField(activePageIdx, fIdx)}
                                    className="text-red-400/40 hover:text-red-400 p-1 rounded transition-all"
                                  >
                                    <i className="ti ti-trash text-xs" />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 7 && (
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                    <div className="flex items-center justify-between pb-3 border-b border-[#1d2d5c]/35">
                      <div>
                        <span className="block text-xs sm:text-sm font-semibold text-[#f0f5ff] tracking-wide">
                          Table Joins &amp; Relationships
                        </span>
                        <span className="block text-xs text-[#6b6890] mt-0.5">
                          Configure relational joins to link records between tables.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={fk}
                          onChange={(e) => setFk(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4.5 rounded-full transition-all duration-200 relative bg-[#121835] peer-checked:bg-blue-500">
                          <div className={`absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full bg-[#6b6890] transition-all duration-200 ${
                            fk ? "translate-x-3.5 bg-blue-100" : ""
                          }`} />
                        </div>
                      </label>
                    </div>

                    {fk && (
                      <div className="animate-fadeIn space-y-4">
                        
                        <div className="bg-[#0e1430]/30 border border-[#1d2d5c]/40 rounded-xl p-3.5 flex flex-col sm:flex-row items-end gap-3">
                          <div className="flex-grow w-full">
                            <label className="block text-[9px] text-[#6b6890] font-black uppercase tracking-wider mb-1">
                              Source Model
                            </label>
                            <select
                              value={sourceTable}
                              onChange={(e) => setSourceTable(e.target.value)}
                              className="w-full bg-[#070c20]/60 border border-[#1d2d5c]/60 focus:border-blue-500 rounded-lg py-1.5 px-3 text-xs text-[#f0f5ff] outline-none font-bold"
                            >
                              {pages.map((p) => (
                                <option key={p.topic} value={p.topic} className="bg-[#0c122c]">
                                  {p.topic}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex-grow w-full">
                            <label className="block text-[9px] text-[#6b6890] font-black uppercase tracking-wider mb-1">
                              Relation Type
                            </label>
                            <select
                              value={relationType}
                              onChange={(e) => setRelationType(e.target.value)}
                              className="w-full bg-[#070c20]/60 border border-[#1d2d5c]/60 focus:border-blue-500 rounded-lg py-1.5 px-3 text-xs text-blue-300 outline-none font-bold"
                            >
                              <option value="Has Many (1:N)" className="bg-[#0c122c]">Has Many (1:N)</option>
                              <option value="Belongs To (1:1)" className="bg-[#0c122c]">Belongs To (1:1)</option>
                              <option value="Many to Many (M:N)" className="bg-[#0c122c]">Many to Many (M:N)</option>
                            </select>
                          </div>

                          <div className="flex-grow w-full">
                            <label className="block text-[9px] text-[#6b6890] font-black uppercase tracking-wider mb-1">
                              Target Model
                            </label>
                            <select
                              value={targetTable}
                              onChange={(e) => setTargetTable(e.target.value)}
                              className="w-full bg-[#070c20]/60 border border-[#1d2d5c]/60 focus:border-blue-500 rounded-lg py-1.5 px-3 text-xs text-[#f0f5ff] outline-none font-bold"
                            >
                              {pages.map((p) => (
                                <option key={p.topic} value={p.topic} className="bg-[#0c122c]">
                                  {p.topic}
                                </option>
                              ))}
                            </select>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (!sourceTable || !targetTable) return;
                              if (sourceTable === targetTable) {
                                setValidationError("A table cannot relate to itself in this basic scheme.");
                                return;
                              }
                              setValidationError(null);
                              setRelations(prev => [
                                ...prev,
                                { sourceTable, relationType, targetTable }
                              ]);
                            }}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 py-1.5 px-4 text-xs font-bold text-white rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer animate-fadeIn"
                          >
                            <i className="ti ti-plus" /> Add Join
                          </button>
                        </div>

                        <div className="space-y-2">
                          <span className="block text-[9px] text-[#6b6890] font-black uppercase tracking-wider">
                            Configured Database Joins
                          </span>
                          
                          {relations.length === 0 ? (
                            <div className="text-center py-5 border border-dashed border-[#1d2d5c]/35 rounded-xl text-xs text-[#6b6890] italic">
                              No joins modeled yet. Add one above.
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              {relations.map((r, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between bg-blue-950/10 border border-blue-500/10 rounded-xl px-4 py-2 text-xs"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="font-bold text-[#f0f5ff]">{r.sourceTable}</span>
                                    <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-400 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                      {r.relationType}
                                    </span>
                                    <span className="font-bold text-[#f0f5ff]">{r.targetTable}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRelations(prev => {
                                        const copy = [...prev];
                                        copy.splice(idx, 1);
                                        return copy;
                                      });
                                    }}
                                    className="text-red-400/50 hover:text-red-400 p-0.5 rounded"
                                  >
                                    <i className="ti ti-trash text-xs" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 8 && (
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] text-[#6b6890] mb-1 font-black uppercase tracking-wider">
                          Your Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Kasun Perera"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full bg-[#121835]/30 border border-[#1d2d5c]/60 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 focus:outline-none rounded-lg p-2 text-xs text-[#f0f5ff] font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] text-[#6b6890] mb-1 font-black uppercase tracking-wider">
                          University / Course
                        </label>
                        <input
                          type="text"
                          placeholder="SLIIT - Software Engineering"
                          value={clientUni}
                          onChange={(e) => setClientUni(e.target.value)}
                          className="w-full bg-[#121835]/30 border border-[#1d2d5c]/60 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 focus:outline-none rounded-lg p-2 text-xs text-[#f0f5ff] font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] text-[#6b6890] mb-1 font-black uppercase tracking-wider">
                          Your Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          className="w-full bg-[#121835]/30 border border-[#1d2d5c]/60 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 focus:outline-none rounded-lg p-2 text-xs text-[#f0f5ff] font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] text-[#6b6890] mb-1 font-black uppercase tracking-wider">
                          WhatsApp Number
                        </label>
                        <input
                          type="text"
                          placeholder="+94 77 123 4567"
                          value={clientWa}
                          onChange={(e) => setClientWa(e.target.value)}
                          className="w-full bg-[#121835]/30 border border-[#1d2d5c]/60 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 focus:outline-none rounded-lg p-2 text-xs text-[#f0f5ff] font-medium"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[9px] text-[#6b6890] mb-1 font-black uppercase tracking-wider">
                          Topic Details &amp; Deadlines
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Briefly describe any special deadlines or design features you need..."
                          value={clientDesc}
                          onChange={(e) => setClientDesc(e.target.value)}
                          className="w-full bg-[#121835]/30 border border-[#1d2d5c]/60 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 focus:outline-none rounded-lg p-2 text-xs text-[#f0f5ff] resize-none font-medium"
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border border-blue-900/30 bg-[#070c20]/40 p-3.5">
                      <span className="block text-[9px] font-black uppercase tracking-widest text-blue-400 mb-2">
                        Pricing Summary
                      </span>

                      <div className="space-y-1 max-h-[80px] overflow-y-auto pr-1">
                        {breakdown.map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center justify-between border-b border-blue-900/10 pb-1 text-xs"
                          >
                            <span className="text-[#c0bdd8] font-medium">{item.label}</span>
                            <span className="font-bold text-blue-300">
                              {item.val.toLocaleString()} LKR
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-2.5 flex items-baseline justify-between border-t border-blue-900/30 pt-2">
                        <span className="text-xs font-bold text-[#f0f5ff]">Total Est</span>
                        <span className="text-base font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                          {total.toLocaleString()} LKR
                        </span>
                      </div>

                      <div className="mt-1 text-right text-[9px] text-[#6b6890] font-medium">
                        Timeline: {days}–{days + 2} working days
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleOpenWhatsAppManual}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600/55 bg-emerald-900/70 hover:bg-emerald-800/80 py-2.5 text-xs sm:text-sm font-bold text-emerald-200 transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.1)] active:scale-98"
                      >
                        <i className="ti ti-brand-whatsapp text-sm" /> Send Project Configuration to Dev+
                      </button>

                      {successMsgVisible && (
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/15 py-2 text-center text-xs text-emerald-400 font-semibold animate-fadeIn">
                          Project details sent successfully! Dev+ will message you back shortly.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 border-t border-[#1d2d5c]/35 bg-[#070c20]/80 px-4 py-3 flex items-center justify-between z-10">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 rounded-lg border border-[#1d2d5c]/60 bg-[#121835]/35 py-1.5 px-3 text-xs font-bold text-[#c0bdd8] hover:border-blue-500/40 hover:bg-[#121835]/50 active:scale-95 transition-all cursor-pointer"
                >
                  <i className="ti ti-arrow-left" /> Back
                </button>
                
                <button
                  type="button"
                  onClick={() => setSummaryDrawerOpen(true)}
                  className="lg:hidden flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/25 px-3 py-1 text-[10px] font-black text-blue-400 active:scale-95 transition-all"
                >
                  <i className="ti ti-receipt text-xs" /> {total.toLocaleString()} LKR
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 py-1.5 px-4 text-xs font-bold text-white active:scale-95 transition-all cursor-pointer shadow-md shadow-blue-950/30"
                >
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

            {/* Sidebar summary (Desktop only) */}
            <div className="hidden lg:flex lg:col-span-3 flex-col glass-panel rounded-2xl p-4 overflow-y-auto relative">
              <span className="text-[10px] font-black text-[#6b6890] uppercase tracking-widest mb-3 border-b border-[#1d2d5c]/25 pb-2 block">
                Active Setup Summary
              </span>

              <div className="space-y-3.5 flex-grow">
                <div className="space-y-1">
                  <span className="text-[9px] text-[#6b6890] font-black uppercase tracking-wider block">Framework &amp; Language</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      frontend ? "bg-blue-500/10 border-blue-500/30 text-blue-300" : "bg-[#121835]/30 border-transparent text-[#6b6890]/40"
                    }`}>
                      {frontend || "No Frontend"}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      language ? "bg-violet-500/10 border-violet-500/30 text-violet-300" : "bg-[#121835]/30 border-transparent text-[#6b6890]/40"
                    }`}>
                      {language || "No Language"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-[#6b6890] font-black uppercase tracking-wider block">Backend &amp; DB Layer</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      backend ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300" : "bg-[#121835]/30 border-transparent text-[#6b6890]/40"
                    }`}>
                      {backend || "No Backend"}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      database ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-[#121835]/30 border-transparent text-[#6b6890]/40"
                    }`}>
                      {database || "No DB Engine"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-[#6b6890] font-black uppercase tracking-wider block">Enabled Modules</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { show: login, text: "Auth UI", color: "bg-blue-950/45 text-blue-400 border border-blue-500/20" },
                      { show: encrypt, text: "Bcrypt Hashing", color: "bg-emerald-950/45 text-emerald-400 border border-emerald-500/20" },
                      { show: jwt, text: "Stateless JWT", color: "bg-cyan-950/45 text-cyan-400 border border-cyan-500/20" },
                      { show: admin, text: "Admin Panel", color: "bg-amber-950/45 text-amber-400 border border-amber-500/20" },
                      { show: email, text: "SMTP Email", color: "bg-rose-950/45 text-rose-400 border border-rose-500/20" },
                      { show: upload, text: "Cloud Uploads", color: "bg-purple-950/45 text-purple-400 border border-purple-500/20" },
                      { show: search, text: "Search Index", color: "bg-teal-950/45 text-teal-400 border border-teal-500/20" },
                    ].filter(x => x.show).map((module, idx) => (
                      <span key={idx} className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${module.color}`}>
                        {module.text}
                      </span>
                    ))}
                    {!login && !encrypt && !jwt && !admin && !email && !upload && !search && (
                      <span className="text-[10px] text-[#6b6890] italic">None selected</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-[#6b6890] font-black uppercase tracking-wider block">Database Schema</span>
                  <span className="text-xs text-[#c0bdd8] font-bold">
                    <i className="ti ti-table text-blue-400 mr-1" />
                    {pages.length} Table Models ({pages.reduce((acc, p) => acc + p.fields.length, 0)} Attributes)
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-[#6b6890] font-black uppercase tracking-wider block">Relational Connections</span>
                  <span className="text-xs text-[#c0bdd8] font-bold">
                    <i className="ti ti-git-fork text-blue-400 mr-1" />
                    {fk ? `${relations.length} Active Joins` : "Disabled"}
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t border-[#1d2d5c]/35 pt-3">
                <span className="text-[9px] text-[#6b6890] font-black uppercase tracking-wider block mb-1">Live Estimate</span>
                <div className="text-xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {total.toLocaleString()} LKR
                </div>
                <div className="text-[9px] text-[#6b6890] font-semibold mt-0.5">
                  Est. Delivery: {days}–{days + 2} days
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Mobile drawer overlay */}
      {summaryDrawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex items-end justify-center bg-[#030712]/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full bg-[#0a0f20] border-t border-[#1d2d5c]/60 rounded-t-3xl p-5 shadow-[0_-10px_30px_rgba(0,102,255,0.15)] max-h-[75vh] flex flex-col overflow-hidden animate-slideIn">
            <div className="flex items-center justify-between border-b border-[#1d2d5c]/25 pb-3 mb-4">
              <span className="text-xs font-black text-[#6b6890] uppercase tracking-wider flex items-center gap-1.5">
                <i className="ti ti-receipt text-blue-400 text-sm" /> Current Setup Config
              </span>
              <button
                type="button"
                onClick={() => setSummaryDrawerOpen(false)}
                className="text-[#6b6890] hover:text-[#f0f5ff] p-1 bg-[#121835]/30 rounded-full"
              >
                <i className="ti ti-x text-sm" />
              </button>
            </div>

            <div className="flex-grow space-y-4 overflow-y-auto pr-1 pb-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#121835]/15 border border-[#1d2d5c]/30 p-2.5 rounded-xl">
                  <span className="block text-[8px] text-[#6b6890] font-black uppercase tracking-wider mb-1">Frontend</span>
                  <span className="text-xs font-bold text-blue-300">{frontend || "None selected"}</span>
                </div>
                <div className="bg-[#121835]/15 border border-[#1d2d5c]/30 p-2.5 rounded-xl">
                  <span className="block text-[8px] text-[#6b6890] font-black uppercase tracking-wider mb-1">Language</span>
                  <span className="text-xs font-bold text-violet-300">{language || "None selected"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#121835]/15 border border-[#1d2d5c]/30 p-2.5 rounded-xl">
                  <span className="block text-[8px] text-[#6b6890] font-black uppercase tracking-wider mb-1">Backend</span>
                  <span className="text-xs font-bold text-cyan-300">{backend || "None selected"}</span>
                </div>
                <div className="bg-[#121835]/15 border border-[#1d2d5c]/30 p-2.5 rounded-xl">
                  <span className="block text-[8px] text-[#6b6890] font-black uppercase tracking-wider mb-1">Database</span>
                  <span className="text-xs font-bold text-emerald-300">{database || "None selected"}</span>
                </div>
              </div>

              <div className="bg-[#121835]/15 border border-[#1d2d5c]/30 p-3 rounded-xl space-y-1.5">
                <span className="block text-[8px] text-[#6b6890] font-black uppercase tracking-wider">Active Modules</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { show: login, text: "Auth UI", color: "bg-blue-950/45 text-blue-400 border border-blue-500/15" },
                    { show: encrypt, text: "Bcrypt", color: "bg-emerald-950/45 text-emerald-400 border border-emerald-500/15" },
                    { show: jwt, text: "JWT Stateless", color: "bg-cyan-950/45 text-cyan-400 border border-cyan-500/15" },
                    { show: admin, text: "Admin Panel", color: "bg-amber-950/45 text-amber-400 border border-amber-500/15" },
                    { show: email, text: "SMTP Email", color: "bg-rose-950/45 text-rose-400 border border-rose-500/15" },
                    { show: upload, text: "Cloud Uploads", color: "bg-purple-950/45 text-purple-400 border border-purple-500/15" },
                    { show: search, text: "Search Index", color: "bg-teal-950/45 text-teal-400 border border-teal-500/15" },
                  ].filter(x => x.show).map((module, idx) => (
                    <span key={idx} className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${module.color}`}>
                      {module.text}
                    </span>
                  ))}
                  {!login && !encrypt && !jwt && !admin && !email && !upload && !search && (
                    <span className="text-[10px] text-[#6b6890] italic">None selected</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#121835]/15 border border-[#1d2d5c]/30 p-2.5 rounded-xl flex items-center gap-2">
                  <i className="ti ti-table text-blue-400 text-base" />
                  <div>
                    <span className="block text-[8px] text-[#6b6890] font-black uppercase tracking-wider">Tables</span>
                    <span className="text-xs font-bold text-[#f0f5ff]">{pages.length} Models</span>
                  </div>
                </div>
                <div className="bg-[#121835]/15 border border-[#1d2d5c]/30 p-2.5 rounded-xl flex items-center gap-2">
                  <i className="ti ti-git-fork text-blue-400 text-base" />
                  <div>
                    <span className="block text-[8px] text-[#6b6890] font-black uppercase tracking-wider">Joins</span>
                    <span className="text-xs font-bold text-[#f0f5ff]">{fk ? relations.length : 0} Joins</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#1d2d5c]/25 pt-4 bg-[#0a0f20] flex items-center justify-between">
              <div>
                <span className="block text-[8px] text-[#6b6890] font-black uppercase tracking-wider">Total Est</span>
                <span className="text-lg font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {total.toLocaleString()} LKR
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSummaryDrawerOpen(false)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-6 rounded-xl cursor-pointer"
              >
                Continue Setup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
