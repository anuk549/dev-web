/**
 * Custom hook for managing quote builder state and logic
 */

import { useState, useMemo, useCallback } from "react";
import type {
  PageSpec,
  FieldSpec,
  RelationSpec,
  CrudKey,
  ModuleItem,
  QuoteResult,
} from "@/src/types/quote";
import {
  INITIAL_PAGES,
  RELATION_TYPES,
  FRONTEND_OPTIONS,
  LANGUAGE_OPTIONS,
  BACKEND_OPTIONS,
  DATABASE_OPTIONS,
} from "@/src/constants";
import { calculateQuote, getActiveModules, generateWhatsAppMessage } from "@/src/utils/quote-calculator";
import { generatePDF } from "@/src/utils/pdf-generator";
import { generateProjectSpecification, downloadJSON } from "@/src/utils/quote-json-exporter";
import { DEV_PHONE } from "@/src/constants";

interface UseQuoteBuilderOptions {
  translations: Record<string, string | string[]>;
}

interface FeatureFlags {
  login: boolean;
  encrypt: boolean;
  jwt: boolean;
  admin: boolean;
  email: boolean;
  upload: boolean;
  search: boolean;
  fk: boolean;
}

/**
 * Custom hook that manages all state and logic for the quote builder
 */
export function useQuoteBuilder(options: UseQuoteBuilderOptions) {
  const { translations } = options;

  // Step navigation state
  const [currentStep, setCurrentStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Tech stack selections (default to first option)
  const [frontend, setFrontend] = useState<string>(FRONTEND_OPTIONS[0].name);
  const [devLanguage, setDevLanguage] = useState<string>(LANGUAGE_OPTIONS[0].name);
  const [backend, setBackend] = useState<string>(BACKEND_OPTIONS[0].name);
  const [database, setDatabase] = useState<string>(DATABASE_OPTIONS[0].name);

  // Feature flags
  const [features, setFeatures] = useState<FeatureFlags>({
    login: true,
    encrypt: true,
    jwt: false,
    admin: false,
    email: false,
    upload: false,
    search: false,
    fk: false,
  });

  // Pages/Tables state
  const [pages, setPages] = useState<PageSpec[]>(INITIAL_PAGES);
  const [activePageIdx, setActivePageIdx] = useState(0);

  // Relations state
  const [relations, setRelations] = useState<RelationSpec[]>([]);
  const [sourceTable, setSourceTable] = useState("Students");
  const [relationType, setRelationType] = useState(RELATION_TYPES[0]);
  const [targetTable, setTargetTable] = useState("Students");

  // Client contact info
  const [clientName, setClientName] = useState("");
  const [clientUni, setClientUni] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientWa, setClientWa] = useState("");
  const [clientDesc, setClientDesc] = useState("");

  // UI state
  const [successMsgVisible, setSuccessMsgVisible] = useState(false);
  const [saveToDbLoading, setSaveToDbLoading] = useState(false);
  const [saveToDbSuccess, setSaveToDbSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);
  const [compilationStep, setCompilationStep] = useState<number | null>(null);
  const [compilationLogs, setCompilationLogs] = useState<string[]>([]);
  const [compilationProgress, setCompilationProgress] = useState(0);
  const [summaryDrawerOpen, setSummaryDrawerOpen] = useState(false);

  // Computed values
  const clampedActivePageIdx = Math.min(activePageIdx, Math.max(0, pages.length - 1));
  const activePage = pages[clampedActivePageIdx] || null;

  // Calculate quote
  const quote: QuoteResult = useMemo(() => {
    return calculateQuote(pages, features, relations);
  }, [pages, features, relations]);

  // Get active modules
  const modules: ModuleItem[] = useMemo(() => {
    return getActiveModules(features);
  }, [features]);

  // Selected stack display string
  const selectedStack = useMemo(() => {
    return [frontend, devLanguage, backend, database].filter(Boolean).join(" / ");
  }, [frontend, devLanguage, backend, database]);

  // Progress percentage
  const progressPercent = useMemo(() => {
    return Math.round((Math.max(currentStep, 1) / 9) * 100);
  }, [currentStep]);

  // Navigation functions
  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
    setMaxStepReached((prev) => Math.max(prev, step));
  }, []);

  // Validation
  const validateStep = useCallback(
    (step: number): string | null => {
      if (step === 1 && !frontend) return translations.chooseFrontend as string;
      if (step === 2 && !devLanguage) return translations.chooseLanguage as string;
      if (step === 3 && !backend) return translations.chooseBackend as string;
      if (step === 4 && !database) return translations.chooseDatabase as string;
      if (step === 9) {
        if (!clientName.trim()) return translations.enterName as string;
        if (!clientEmail.trim()) return translations.enterEmail as string;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim())) {
          return translations.validEmail as string;
        }
      }
      return null;
    },
    [frontend, devLanguage, backend, database, clientName, clientEmail, translations]
  );

  // Feature toggle
  const toggleFeature = useCallback(<K extends keyof FeatureFlags>(key: K) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // CRUD operations for pages
  const handleCrudToggle = useCallback((pageIdx: number, key: CrudKey) => {
    setPages((prev) => {
      const copy = [...prev];
      copy[pageIdx] = { ...copy[pageIdx], [key]: !copy[pageIdx][key] };
      return copy;
    });
  }, []);

  // Page management
  const handleAddPage = useCallback(() => {
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
  }, [pages.length]);

  const handleRemovePage = useCallback(
    (idx: number, event: React.MouseEvent) => {
      event.stopPropagation();
      if (pages.length <= 1) return;
      setPages((prev) => prev.filter((_, pageIdx) => pageIdx !== idx));
      setActivePageIdx((prev) => {
        if (prev === idx) return Math.max(0, idx - 1);
        if (prev > idx) return prev - 1;
        return prev;
      });
    },
    [pages.length]
  );

  const updatePage = useCallback((idx: number, patch: Partial<PageSpec>) => {
    setPages((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });
  }, []);

  // Field management
  const handleAddField = useCallback((pageIdx: number) => {
    setPages((prev) => {
      const copy = [...prev];
      copy[pageIdx] = {
        ...copy[pageIdx],
        fields: [...copy[pageIdx].fields, { label: "", type: "String" }],
      };
      return copy;
    });
  }, []);

  const handleRemoveField = useCallback((pageIdx: number, fieldIdx: number) => {
    setPages((prev) => {
      const copy = [...prev];
      copy[pageIdx] = {
        ...copy[pageIdx],
        fields: copy[pageIdx].fields.filter((_, idx) => idx !== fieldIdx),
      };
      return copy;
    });
  }, []);

  const updateField = useCallback(
    (pageIdx: number, fieldIdx: number, patch: Partial<FieldSpec>) => {
      setPages((prev) => {
        const copy = [...prev];
        const fields = [...copy[pageIdx].fields];
        fields[fieldIdx] = { ...fields[fieldIdx], ...patch };
        copy[pageIdx] = { ...copy[pageIdx], fields };
        return copy;
      });
    },
    []
  );

  // Relations management
  const handleAddRelation = useCallback(() => {
    const tableOptions = pages.map((p) => p.topic || "Untitled");
    const selectedSource = tableOptions.includes(sourceTable)
      ? sourceTable
      : tableOptions[0] || "";
    const selectedTarget = tableOptions.includes(targetTable)
      ? targetTable
      : tableOptions[Math.min(1, tableOptions.length - 1)] || "";

    if (selectedSource === selectedTarget) {
      setValidationError("A table cannot relate to itself in this basic setup.");
      return false;
    }

    const exists = relations.some(
      (relation) =>
        relation.sourceTable === selectedSource &&
        relation.targetTable === selectedTarget &&
        relation.relationType === relationType
    );

    if (exists) {
      setValidationError("This relationship is already added.");
      return false;
    }

    setValidationError(null);
    setRelations((prev) => [
      ...prev,
      { sourceTable: selectedSource, relationType, targetTable: selectedTarget },
    ]);
    return true;
  }, [pages, sourceTable, targetTable, relationType, relations]);

  const handleRemoveRelation = useCallback((idx: number) => {
    setRelations((prev) => prev.filter((_, relIdx) => relIdx !== idx));
  }, []);

  // WhatsApp functions
  const getWhatsAppMessage = useCallback(() => {
    return generateWhatsAppMessage({
      clientName,
      clientUni,
      clientEmail,
      clientWa,
      clientDesc,
      frontend,
      devLanguage,
      backend,
      database,
      features,
      pages,
      relations,
      days: quote.days,
    });
  }, [
    clientName,
    clientUni,
    clientEmail,
    clientWa,
    clientDesc,
    frontend,
    devLanguage,
    backend,
    database,
    features,
    pages,
    relations,
    quote.days,
  ]);

  const showMissingWhatsAppNumber = useCallback(() => {
    window.alert(translations.whatsappNotConfigured as string);
  }, [translations]);

  const openWhatsApp = useCallback(() => {
    if (!DEV_PHONE) {
      showMissingWhatsAppNumber();
      return;
    }
    const msg = encodeURIComponent(getWhatsAppMessage());
    window.open(`https://wa.me/${DEV_PHONE}?text=${msg}`, "_blank");
  }, [getWhatsAppMessage, showMissingWhatsAppNumber]);

  // Quote generation
  const triggerQuoteGeneration = useCallback(() => {
    setValidationError(null);
    setCompilationStep(0);
    setCompilationLogs([]);
    setCompilationProgress(0);

    const logs = [
      `Preparing ${frontend} project shell with ${devLanguage}...`,
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
  }, [frontend, devLanguage, backend, database, modules, pages, openWhatsApp]);

  const handleNext = useCallback(() => {
    setValidationError(null);
    const error = validateStep(currentStep);
    if (error) {
      setValidationError(error);
      return;
    }
    if (currentStep < 9) {
      goToStep(currentStep + 1);
      return;
    }
    triggerQuoteGeneration();
  }, [currentStep, goToStep, triggerQuoteGeneration, validateStep]);

  const handleBack = useCallback(() => {
    setValidationError(null);
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // PDF generation
  const handleDownloadPDF = useCallback(async () => {
    try {
      await generatePDF({
        clientName,
        clientEmail,
        clientUni,
        clientWa,
        frontend,
        devLanguage,
        backend,
        database,
        modules,
        pages,
        fk: features.fk,
        relations,
        breakdown: quote.breakdown,
        days: quote.days,
      });
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  }, [
    clientName,
    clientEmail,
    clientUni,
    clientWa,
    frontend,
    devLanguage,
    backend,
    database,
    modules,
    pages,
    features.fk,
    relations,
    quote.breakdown,
    quote.days,
  ]);

  // JSON specification generation
  const handleDownloadJSON = useCallback(() => {
    try {
      const spec = generateProjectSpecification({
        clientName,
        clientEmail,
        clientUni,
        clientWa,
        clientDesc,
        frontend,
        devLanguage,
        backend,
        database,
        features,
        pages,
        relations,
        days: quote.days,
        breakdown: quote.breakdown,
        total: quote.total,
      });
      const filename = `project-spec-${clientName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.json`;
      downloadJSON(spec, filename);
    } catch (error) {
      console.error("JSON generation failed:", error);
    }
  }, [
    clientName,
    clientEmail,
    clientUni,
    clientWa,
    clientDesc,
    frontend,
    devLanguage,
    backend,
    database,
    features,
    pages,
    relations,
    quote.breakdown,
    quote.days,
    quote.total,
  ]);

  // Internal helper: Save to database (shared by all button handlers)
  const saveToDatabase = useCallback(async (): Promise<boolean> => {
    // Prevent duplicate submissions
    if (isSubmitting) {
      console.warn('Submission already in progress, ignoring duplicate request');
      return false;
    }
    
    setIsSubmitting(true);
    setSaveToDbLoading(true);
    try {
      const spec = generateProjectSpecification({
        clientName,
        clientEmail,
        clientUni,
        clientWa,
        clientDesc,
        frontend,
        devLanguage,
        backend,
        database,
        features,
        pages,
        relations,
        days: quote.days,
        breakdown: quote.breakdown,
        total: quote.total,
      });

      const response = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'quotes',
          document: {
            ...spec,
            status: 'pending',
            submittedAt: new Date().toISOString(),
          },
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to save');
      }

      setSaveToDbSuccess(true);
      setHasBeenSubmitted(true);
      setTimeout(() => setSaveToDbSuccess(false), 3000);
      return true;
    } catch (error) {
      console.error('Save to DB failed:', error);
      window.alert('Failed to save to database. Please try again.');
      return false;
    } finally {
      setSaveToDbLoading(false);
      setIsSubmitting(false);
    }
  }, [
    clientName, clientEmail, clientUni, clientWa, clientDesc,
    frontend, devLanguage, backend, database,
    features, pages, relations,
    quote.days, quote.breakdown, quote.total,
    isSubmitting,
  ]);

  // Download JSON with save to database first (only POST once, then just download)
  const handleDownloadJSONWithSave = useCallback(async () => {
    // If not yet submitted, save first
    if (!hasBeenSubmitted) {
      const saved = await saveToDatabase();
      if (!saved) return;
    }
    // Always download (whether just saved or already saved)
    handleDownloadJSON();
  }, [saveToDatabase, handleDownloadJSON, hasBeenSubmitted]);

  // Send on WhatsApp with save to database first (only POST once, then just send)
  const handleWhatsAppWithSave = useCallback(async () => {
    // If not yet submitted, save first
    if (!hasBeenSubmitted) {
      const saved = await saveToDatabase();
      if (!saved) return;
    }
    // Always open WhatsApp (whether just saved or already saved)
    openWhatsApp();
  }, [saveToDatabase, openWhatsApp, hasBeenSubmitted]);

  // Download PDF with save to database first (only POST once, then just download)
  const handleDownloadPDFWithSave = useCallback(async () => {
    // If not yet submitted, save first
    if (!hasBeenSubmitted) {
      const saved = await saveToDatabase();
      if (!saved) return;
    }
    // Always download PDF (whether just saved or already saved)
    handleDownloadPDF();
  }, [saveToDatabase, handleDownloadPDF, hasBeenSubmitted]);

  // Share with Dev+ with save to database first (only POST once, then just share)
  const handleShareWithDevWithSave = useCallback(async () => {
    // If not yet submitted, save first
    if (!hasBeenSubmitted) {
      const saved = await saveToDatabase();
      if (!saved) return;
    }
    // Always open WhatsApp (whether just saved or already saved)
    if (DEV_PHONE) {
      window.open(`https://wa.me/${DEV_PHONE}`, "_blank");
    }
  }, [saveToDatabase, hasBeenSubmitted]);

  // Reset function
  const resetQuoteBuilder = useCallback(() => {
    setCurrentStep(0);
    setMaxStepReached(0);
    setFrontend(FRONTEND_OPTIONS[0].name);
    setDevLanguage(LANGUAGE_OPTIONS[0].name);
    setBackend(BACKEND_OPTIONS[0].name);
    setDatabase(DATABASE_OPTIONS[0].name);
    setFeatures({
      login: true,
      encrypt: true,
      jwt: false,
      admin: false,
      email: false,
      upload: false,
      search: false,
      fk: false,
    });
    setPages(INITIAL_PAGES);
    setActivePageIdx(0);
    setRelations([]);
    setSourceTable("Students");
    setRelationType(RELATION_TYPES[0]);
    setTargetTable("Students");
    setClientName("");
    setClientUni("");
    setClientEmail("");
    setClientWa("");
    setClientDesc("");
    setValidationError(null);
    setSuccessMsgVisible(false);
    setSaveToDbLoading(false);
    setSaveToDbSuccess(false);
    setIsSubmitting(false);
    setHasBeenSubmitted(false);
    setCompilationStep(null);
    setCompilationLogs([]);
    setCompilationProgress(0);
    setSummaryDrawerOpen(false);
  }, []);

  return {
    // State
    currentStep,
    maxStepReached,
    validationError,
    frontend,
    devLanguage,
    backend,
    database,
    features,
    fk: features.fk,
    pages,
    activePageIdx,
    clampedActivePageIdx,
    activePage,
    relations,
    sourceTable,
    relationType,
    targetTable,
    clientName,
    clientUni,
    clientEmail,
    clientWa,
    clientDesc,
    successMsgVisible,
    compilationStep,
    compilationLogs,
    compilationProgress,
    summaryDrawerOpen,
    quote,
    modules,
    selectedStack,
    progressPercent,

    // Setters
    setFrontend,
    setDevLanguage,
    setBackend,
    setDatabase,
    setClientName,
    setClientUni,
    setClientEmail,
    setClientWa,
    setClientDesc,
    setActivePageIdx,
    setSourceTable,
    setTargetTable,
    setRelationType,
    setSummaryDrawerOpen,
    setValidationError,
    setRelations,

    // Actions
    goToStep,
    handleNext,
    handleBack,
    toggleFeature,
    handleCrudToggle,
    handleAddPage,
    handleRemovePage,
    updatePage,
    handleAddField,
    handleRemoveField,
    updateField,
    handleAddRelation,
    handleRemoveRelation,
    openWhatsApp,
    handleDownloadPDF,
    handleDownloadJSON,
    handleDownloadJSONWithSave,
    handleWhatsAppWithSave,
    handleDownloadPDFWithSave,
    handleShareWithDevWithSave,
    saveToDbLoading,
    saveToDbSuccess,
    isSubmitting,
    hasBeenSubmitted,
    resetQuoteBuilder,
  };
}
