"use client";

import Image from "next/image";
import { useState } from "react";
import { translations } from "@/src/constants/translations";
import { LOGO_SRC, STEPS, DEV_PHONE } from "@/src/constants";
import { useQuoteBuilder } from "@/src/hooks/useQuoteBuilder";
import {
  CompilationOverlay,
  WelcomeScreen,
  ChoiceGrid,
  ToggleCard,
  SchemaEditor,
  RelationsEditor,
  ContactStep,
  SummaryPanel,
  Sidebar,
  PreviewPanel,
} from "@/src/components";
import {
  FRONTEND_OPTIONS,
  LANGUAGE_OPTIONS,
  BACKEND_OPTIONS,
  DATABASE_OPTIONS,
} from "@/src/constants";

function getStepTitle(step: number, t: typeof translations.en) {
  return t.stepTitles[step] || "";
}

export default function Home() {
  const [appLanguage, setAppLanguage] = useState<"en" | "si">("en");
  const [setupMode, setSetupMode] = useState<"quick" | "custom">("quick");
  const t = translations[appLanguage];

  const quoteBuilder = useQuoteBuilder({ translations: t });

  const {
    currentStep,
    maxStepReached,
    validationError,
    frontend,
    devLanguage,
    backend,
    database,
    features,
    pages,
    clampedActivePageIdx,
    activePage,
    relations,
    fk,
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
    setSummaryDrawerOpen,
    setValidationError,
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
    openWhatsApp,
    handleDownloadPDF,
    handleDownloadJSON,
    handleDownloadJSONWithSave,
    handleWhatsAppWithSave,
    handleDownloadPDFWithSave,
    handleShareWithDevWithSave,
    saveToDbLoading,
    saveToDbSuccess,
    hasBeenSubmitted,
  } = quoteBuilder;

  const handleWizardNext = () => {
    if (currentStep === 1) {
      if (setupMode === "quick") {
        setFrontend("Next.js");
        setDevLanguage("TypeScript");
        setBackend("Next.js API");
        setDatabase("MongoDB");
        goToStep(6);
        return;
      }

      goToStep(2);
      return;
    }

    handleNext();
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-app-shell text-slate-950 selection:bg-teal-200/70">
      {/* Compilation Overlay */}
      <CompilationOverlay
        visible={compilationStep !== null}
        logs={compilationLogs}
        progress={compilationProgress}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-900/10 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => goToStep(0)}
            className="flex items-center gap-3"
            aria-label="Go to Dev+ welcome page"
          >
            <Image
              src={LOGO_SRC}
              alt="Dev+ logo"
              width={112}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
            <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 sm:inline-flex">
              {t.projectStudio}
            </span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAppLanguage(appLanguage === "en" ? "si" : "en")}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm hover:border-teal-300 hover:bg-teal-50"
              title={appLanguage === "en" ? "Switch to Sinhala" : "Switch to English"}
            >
              {appLanguage === "en" ? "සිංහල" : "EN"}
            </button>
            <a
              href={DEV_PHONE ? `https://wa.me/${DEV_PHONE}` : "#"}
              onClick={(event) => {
                if (!DEV_PHONE) {
                  event.preventDefault();
                }
              }}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm sm:inline-flex"
            >
              <i className="ti ti-brand-whatsapp text-base" /> WhatsApp
            </a>
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={() => setSummaryDrawerOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm lg:hidden"
              >
                <i className="ti ti-receipt" /> Summary
              </button>
            ) : (
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm lg:hidden"
              >
                Start <i className="ti ti-arrow-right" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`mx-auto max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:py-7 ${
          currentStep === 0 ? "block" : "grid lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)_280px]"
        }`}
      >
        {/* Sidebar (Desktop) */}
        {currentStep > 0 && (
          <Sidebar
            currentStep={currentStep}
            maxStepReached={maxStepReached}
            progressPercent={progressPercent}
            onStepClick={goToStep}
          />
        )}

        {/* Main Section */}
        <section className="min-w-0">
          {currentStep === 0 ? (
            <WelcomeScreen
              days={quote.days}
              onStart={() => goToStep(1)}
            />
          ) : (
            <div className="surface-panel overflow-hidden">
              <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-teal-700">
                    Step {currentStep} of {STEPS - 1}
                  </span>
                  <span className="text-sm font-bold text-slate-500">
                    {selectedStack || "Configure your stack"}
                  </span>
                </div>
                <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {getStepTitle(currentStep, t)}
                </h1>
              </div>

              <div className="min-h-[560px] p-4 sm:p-6 lg:p-7">
                {/* Validation Error */}
                {validationError && (
                  <div className="mb-4 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                    <i className="ti ti-alert-circle text-lg" />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Step 1: Quick Start */}
                {currentStep === 1 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setSetupMode("quick")}
                      className={`option-card text-left ${setupMode === "quick" ? "is-active" : ""}`}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span
                          className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${
                            setupMode === "quick"
                              ? "bg-slate-950 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <i className="ti ti-rocket" />
                        </span>
                        <span
                          className={`grid h-7 w-7 place-items-center rounded-full border ${
                            setupMode === "quick"
                              ? "border-teal-500 bg-teal-500 text-white"
                              : "border-slate-200 text-transparent"
                          }`}
                        >
                          <i className="ti ti-check text-sm" />
                        </span>
                      </span>
                      <span className="mt-6 block text-lg font-black text-slate-950">
                        Quick Start
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-slate-500">
                        Next.js + TypeScript + Next.js API + MongoDB
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSetupMode("custom")}
                      className={`option-card text-left ${setupMode === "custom" ? "is-active" : ""}`}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span
                          className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${
                            setupMode === "custom"
                              ? "bg-slate-950 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <i className="ti ti-settings" />
                        </span>
                        <span
                          className={`grid h-7 w-7 place-items-center rounded-full border ${
                            setupMode === "custom"
                              ? "border-teal-500 bg-teal-500 text-white"
                              : "border-slate-200 text-transparent"
                          }`}
                        >
                          <i className="ti ti-check text-sm" />
                        </span>
                      </span>
                      <span className="mt-6 block text-lg font-black text-slate-950">
                        Custom Setup
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-slate-500">
                        Choose your own technologies
                      </span>
                    </button>
                    <div className="sm:col-span-2 text-center pt-2">
                      <p className="text-sm text-slate-500">
                        Not sure? Contact us on{" "}
                        <a
                          href={DEV_PHONE ? `https://wa.me/${DEV_PHONE}` : "#"}
                          onClick={(event) => {
                            if (!DEV_PHONE) {
                              event.preventDefault();
                            }
                          }}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-emerald-600 hover:text-emerald-700"
                        >
                          WhatsApp
                        </a>{" "}
                        or{" "}
                        <a
                          href="mailto:hello@example.com"
                          className="font-bold text-slate-700 hover:text-slate-900"
                        >
                          Email
                        </a>
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2: Frontend */}
                {currentStep === 2 && (
                  <ChoiceGrid
                    cols="sm:grid-cols-2"
                    items={FRONTEND_OPTIONS}
                    value={frontend || FRONTEND_OPTIONS[0].name}
                    onSelect={setFrontend}
                    clearError={() => setValidationError(null)}
                  />
                )}

                {/* Step 3: Language */}
                {currentStep === 3 && (
                  <ChoiceGrid
                    cols="sm:grid-cols-2"
                    items={LANGUAGE_OPTIONS}
                    value={devLanguage || LANGUAGE_OPTIONS[0].name}
                    onSelect={setDevLanguage}
                    clearError={() => setValidationError(null)}
                  />
                )}

                {/* Step 4: Backend */}
                {currentStep === 4 && (
                  <ChoiceGrid
                    cols="sm:grid-cols-3"
                    items={BACKEND_OPTIONS}
                    value={backend || BACKEND_OPTIONS[0].name}
                    onSelect={setBackend}
                    clearError={() => setValidationError(null)}
                  />
                )}

                {/* Step 5: Database */}
                {currentStep === 5 && (
                  <ChoiceGrid
                    cols="sm:grid-cols-4"
                    items={DATABASE_OPTIONS}
                    value={database || DATABASE_OPTIONS[0].name}
                    onSelect={setDatabase}
                    clearError={() => setValidationError(null)}
                  />
                )}

                {/* Step 6: Features */}
                {currentStep === 6 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ToggleCard
                      label={t.loginRegister as string}
                      desc="Secure user authentication"
                      active={features.login}
                      set={() => toggleFeature("login")}
                      icon="ti-user-check"
                    />
                    <ToggleCard
                      label={t.passwordEncryption as string}
                      desc="Bcrypt hashing security"
                      active={features.encrypt}
                      set={() => toggleFeature("encrypt")}
                      icon="ti-shield-lock"
                    />
                    {backend === "Spring Boot" && (
                      <ToggleCard
                        label={t.jwtTokens as string}
                        desc="Token-based authentication"
                        active={features.jwt}
                        set={() => toggleFeature("jwt")}
                        icon="ti-key"
                      />
                    )}
                    <ToggleCard
                      label={t.adminDashboard as string}
                      desc="Management control panel"
                      active={features.admin}
                      set={() => toggleFeature("admin")}
                      icon="ti-dashboard"
                    />
                    <ToggleCard
                      label={t.emailAutomation as string}
                      desc="Automated email system"
                      active={features.email}
                      set={() => toggleFeature("email")}
                      icon="ti-mail"
                    />
                  </div>
                )}

                {/* Step 7: Schema */}
                {currentStep === 7 && activePage && (
                  <div className="max-w-5xl mx-auto">
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
                  </div>
                )}

                {/* Step 8: Relations */}
                {currentStep === 8 && (
                  <RelationsEditor
                    fk={fk}
                    setFk={() => toggleFeature("fk")}
                    pages={pages}
                    relations={relations}
                    sourceTable={quoteBuilder.sourceTable}
                    targetTable={quoteBuilder.targetTable}
                    relationType={quoteBuilder.relationType}
                    setSourceTable={quoteBuilder.setSourceTable}
                    setTargetTable={quoteBuilder.setTargetTable}
                    setRelationType={quoteBuilder.setRelationType}
                    setValidationError={quoteBuilder.setValidationError}
                    setRelations={quoteBuilder.setRelations}
                  />
                )}

                {/* Step 9: Preview */}
                {currentStep === 9 && (
                  <PreviewPanel
                    frontend={frontend}
                    devLanguage={devLanguage}
                    backend={backend}
                    database={database}
                    features={features}
                    modules={modules}
                    pages={pages}
                    relations={relations}
                    total={quote.total}
                    days={quote.days}
                  />
                )}

                {/* Step 10: Contact */}
                {currentStep === 10 && (
                  <ContactStep
                    clientName={clientName}
                    clientUni={clientUni}
                    clientEmail={clientEmail}
                    clientWa={clientWa}
                    clientDesc={clientDesc}
                    frontend={frontend}
                    devLanguage={devLanguage}
                    backend={backend}
                    database={database}
                    setClientName={setClientName}
                    setClientUni={setClientUni}
                    setClientEmail={setClientEmail}
                    setClientWa={setClientWa}
                    setClientDesc={setClientDesc}
                    breakdown={quote.breakdown}
                    total={quote.total}
                    days={quote.days}
                    onWhatsApp={openWhatsApp}
                    onDownloadPDF={handleDownloadPDF}
                    onDownloadJSON={handleDownloadJSON}
                    onDownloadJSONWithSave={handleDownloadJSONWithSave}
                    onWhatsAppWithSave={handleWhatsAppWithSave}
                    onDownloadPDFWithSave={handleDownloadPDFWithSave}
                    onShareWithDevWithSave={handleShareWithDevWithSave}
                    saveToDbLoading={saveToDbLoading}
                    saveToDbSuccess={saveToDbSuccess}
                    successMsgVisible={successMsgVisible}
                    hasBeenSubmitted={hasBeenSubmitted}
                  />
                )}
              </div>

              {/* Navigation Buttons */}
              {currentStep < 10 && (
                <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
                  <button type="button" onClick={handleBack} className="btn-secondary">
                    <i className="ti ti-arrow-left" /> {t.back}
                  </button>
                  {currentStep === 8 ? (
                    <button type="button" onClick={handleWizardNext} className="btn-primary">
                      <i className="ti ti-rocket" /> {t.compileQuote} <i className="ti ti-arrow-right" />
                    </button>
                  ) : (
                    <button type="button" onClick={handleWizardNext} className="btn-primary">
                      {t.next} <i className="ti ti-arrow-right" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Summary Panel (Desktop) */}
        {currentStep > 0 && (
          <aside className="hidden xl:block">
            <SummaryPanel
              frontend={frontend}
              devLanguage={devLanguage}
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

      {/* Summary Drawer (Mobile) */}
      {summaryDrawerOpen && currentStep > 0 && (
        <div className="fixed inset-0 z-40 flex items-end bg-slate-950/60 p-3 backdrop-blur-sm lg:hidden">
          <div className="max-h-[82vh] w-full overflow-y-auto rounded-[28px] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-950">{t.projectSummary}</h2>
              <button
                type="button"
                onClick={() => setSummaryDrawerOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <SummaryPanel
              frontend={frontend}
              devLanguage={devLanguage}
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
