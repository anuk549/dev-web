/**
 * ContactStep Component
 * Final step where users enter contact info and can send via WhatsApp or download PDF
 */

import type { QuoteBreakdown } from "@/src/types/quote";
import { TextInput } from "@/src/components/ui";

interface ContactStepProps {
  clientName: string;
  clientUni: string;
  clientEmail: string;
  clientWa: string;
  clientDesc: string;
  frontend: string | null;
  devLanguage: string | null;
  backend: string | null;
  database: string | null;
  setClientName: (value: string) => void;
  setClientUni: (value: string) => void;
  setClientEmail: (value: string) => void;
  setClientWa: (value: string) => void;
  setClientDesc: (value: string) => void;
  breakdown: QuoteBreakdown[];
  total: number;
  days: number;
  onWhatsApp: () => void;
  onDownloadPDF: () => void;
  onDownloadJSON: () => void;
  onDownloadJSONWithSave: () => void;
  onWhatsAppWithSave: () => void;
  onDownloadPDFWithSave: () => void;
  onShareWithDevWithSave: () => void;
  saveToDbLoading: boolean;
  saveToDbSuccess: boolean;
  successMsgVisible: boolean;
  hasBeenSubmitted: boolean;
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate WhatsApp number format (allows various formats)
 * Accepts: +94 7X XXX XXXX, 07X XXX XXXX, 947X XXX XXXX, etc.
 */
function isValidWhatsAppNumber(phone: string): boolean {
  // Remove all non-digit characters except + at the start
  const cleaned = phone.replace(/[^\d+]/g, "");
  // Should have at least 9 digits (excluding +)
  const digits = cleaned.replace(/\D/g, "");
  return digits.length >= 9;
}

export function ContactStep({
  clientName,
  clientUni,
  clientEmail,
  clientWa,
  clientDesc,
  frontend,
  devLanguage,
  backend,
  database,
  setClientName,
  setClientUni,
  setClientEmail,
  setClientWa,
  setClientDesc,
  days,
  onWhatsAppWithSave,
  onDownloadPDFWithSave,
  saveToDbLoading,
  successMsgVisible,
  hasBeenSubmitted,
}: ContactStepProps) {
  // Validation state
  const emailError = (() => {
    if (clientEmail.trim().length === 0) return "";
    if (!isValidEmail(clientEmail.trim())) {
      return "Please enter a valid email address (e.g., name@domain.com)";
    }
    return "";
  })();
  const waError = (() => {
    if (clientWa.trim().length === 0) return "";
    if (!isValidWhatsAppNumber(clientWa.trim())) {
      return "Please enter a valid phone number (at least 9 digits)";
    }
    return "";
  })();

  // Form validation: name is required, and at least email OR WhatsApp must be filled and valid
  const hasName = clientName.trim().length > 0;
  const hasEmail = clientEmail.trim().length > 0;
  const hasWa = clientWa.trim().length > 0;
  const emailValid = !hasEmail || isValidEmail(clientEmail.trim());
  const waValid = !hasWa || isValidWhatsAppNumber(clientWa.trim());
  const hasContactMethod = (hasEmail && emailValid) || (hasWa && waValid);
  
  // Form is valid when name is filled AND at least one valid contact method exists
  const isFormValid = hasName && hasContactMethod;
  // Disable buttons during loading or when form is invalid
  const areButtonsDisabled = !isFormValid || saveToDbLoading;
  return (
    <div className="mx-auto grid max-w-4xl gap-6 xl:max-w-none xl:grid-cols-1">
      {/* Contact Form */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Name field - full width on mobile */}
        <div>
          <TextInput
            label="Your name"
            required
            value={clientName}
            onChange={setClientName}
            placeholder="Kasun Perera"
            error={hasName ? undefined : "Name is required"}
          />
        </div>

        {/* University field - full width on mobile */}
        <div>
          <TextInput
            label="University / course"
            value={clientUni}
            onChange={setClientUni}
            placeholder="SLIIT - Software Engineering"
          />
        </div>

        {/* Email and WhatsApp - side by side on desktop */}
        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 lg:col-span-2 lg:grid-cols-2">
          <TextInput
            label="Email"
            required
            type="email"
            value={clientEmail}
            onChange={setClientEmail}
            placeholder="your@email.com"
            error={emailError || undefined}
          />
          <TextInput
            label="WhatsApp number"
            value={clientWa}
            onChange={setClientWa}
            placeholder="+94 7X XXX XXXX"
            error={waError || undefined}
          />
        </div>
        
        {/* Validation hint */}
        {(!hasEmail && !hasWa) && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 lg:col-span-2">
            <div className="flex items-start gap-2">
              <i className="ti ti-info-circle mt-0.5 text-amber-600" />
              <p className="text-xs font-bold text-amber-700 leading-relaxed">
                Please enter at least your email OR WhatsApp number so we can contact you.
              </p>
            </div>
          </div>
        )}

        {/* Topic description - full width */}
        <label className="block lg:col-span-2">
          <span className="form-label">Topic details and deadlines</span>
          <textarea
            value={clientDesc}
            onChange={(e) => setClientDesc(e.target.value)}
            rows={5}
            className="form-input mt-2 resize-none"
            placeholder="Briefly describe the project topic, deadline, and special requirements."
          />
        </label>

        {/* Success message after submission */}
        {hasBeenSubmitted && !saveToDbLoading && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 lg:col-span-2">
            <div className="flex items-start gap-2">
              <i className="ti ti-check mt-0.5 text-emerald-600" />
              <p className="text-xs font-bold text-emerald-700 leading-relaxed">
                Your project has been saved successfully. You can still download PDF, or send via WhatsApp.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons - Visible on lg+ below form, hidden in summary card on xl */}
        <div className="hidden gap-3 lg:col-span-2 lg:grid lg:grid-cols-2">
          {/* <button
            type="button"
            onClick={onDownloadJSONWithSave}
            disabled={areButtonsDisabled}
            className="flex-1 justify-center rounded-2xl bg-teal-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-500 hover:shadow-teal-600/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg inline-flex items-center min-w-[150px]"
          >
            <i className="ti ti-file-code mr-2" /> Download JSON
          </button> */}
          <button
            type="button"
            onClick={onWhatsAppWithSave}
            disabled={areButtonsDisabled}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-emerald-600/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
          >
            <i className="ti ti-brand-whatsapp mr-2" /> Send on WhatsApp
          </button>
          <button
            type="button"
            onClick={onDownloadPDFWithSave}
            disabled={areButtonsDisabled}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border-2 border-slate-950 px-5 py-3 text-sm font-black text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <i className="ti ti-file-download mr-2" /> Download PDF Quote
          </button>
          {/* Share the request with Dev+ button */}
          {/* <button
            type="button"
            onClick={onShareWithDevWithSave}
            disabled={isShareButtonDisabled}
            className="flex-1 justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-950/20 transition-all hover:bg-slate-800 hover:shadow-slate-950/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 inline-flex items-center min-w-[150px]"
          >
            <i className="ti ti-share mr-2" /> Share with Dev+
          </button> */}
        </div>
      </div>

      {/* Summary Card - Visible on mobile/tablet, hidden on lg+ (SummaryPanel shown in sidebar) */}
      <div className="block xl:hidden lg:sticky lg:top-24">
        <div className="surface-panel p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Project summary
          </p>

          {/* Delivery Timeline */}
          <div className="mt-4 rounded-3xl bg-slate-950 p-5 text-white">
            <p className="text-xl font-black">Custom Quote</p>
            <p className="mt-1 text-sm font-bold text-teal-200">
              {days}-{days + 2} working days
            </p>
          </div>

          {/* Tech Stack Summary */}
          <div className="mt-4 grid gap-2.5">
            {[
              ["Frontend", frontend || "Not selected"],
              ["Language", devLanguage || "Not selected"],
              ["Backend", backend || "Not selected"],
              ["Database", database || "Not selected"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  {label}
                </p>
                <p className="mt-0.5 text-sm font-black text-slate-950">{value}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-5 grid gap-2.5">
            {/* <button
              type="button"
              onClick={onDownloadJSONWithSave}
              disabled={areButtonsDisabled}
              className="w-full justify-center rounded-2xl bg-teal-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-500 hover:shadow-teal-600/30 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              <i className="ti ti-file-code mr-2" /> Download JSON
            </button> */}
            <button
              type="button"
              onClick={onWhatsAppWithSave}
              disabled={areButtonsDisabled}
              className="w-full justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-600/30 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              <i className="ti ti-brand-whatsapp mr-2" /> Send on WhatsApp
            </button>
            <button
              type="button"
              onClick={onDownloadPDFWithSave}
              disabled={areButtonsDisabled}
              className="w-full justify-center rounded-2xl border-2 border-slate-950 px-4 py-3 text-sm font-black text-slate-950 transition-all hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              <i className="ti ti-file-download mr-2" /> Download PDF Quote
            </button>
            {/* <button
              type="button"
              onClick={onShareWithDevWithSave}
              disabled={isShareButtonDisabled}
              className="w-full justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg shadow-slate-950/20 transition-all hover:bg-slate-800 hover:shadow-slate-950/30 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              <i className="ti ti-share mr-2" /> Share with Dev+
            </button> */}
          </div>

          {successMsgVisible && (
            <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-center">
              <p className="text-sm font-bold text-emerald-700">
                <i className="ti ti-check mr-1" />
                Request opened in WhatsApp.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}