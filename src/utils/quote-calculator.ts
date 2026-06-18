/**
 * Quote calculation utilities for the Dev+ Quote Builder
 */

import type { PageSpec, QuoteBreakdown, QuoteResult, CrudKey, RelationSpec, ModuleItem } from "@/src/types/quote";

/**
 * Calculate the price for a single page based on its CRUD operations
 */
function getPagePrice(page: PageSpec): number {
  let price = 0;
  if (page.read) price += 500;
  if (page.create) price += 400;
  if (page.update) price += 400;
  if (page.delete) price += 400;
  if (page.search) price += 300;
  return price;
}

/**
 * Calculate the total quote breakdown, total price, and delivery days
 */
export function calculateQuote(
  pages: PageSpec[],
  features: {
    login: boolean;
    encrypt: boolean;
    jwt: boolean;
    admin: boolean;
    email: boolean;
    upload: boolean;
    search: boolean;
    fk: boolean;
  },
  relations: RelationSpec[]
): QuoteResult {
  const breakdown: QuoteBreakdown[] = [];
  let total = 0;

  // Calculate page/model pricing
  const pageTotal = pages.reduce((sum, p) => sum + getPagePrice(p), 0);
  if (pageTotal > 0) {
    breakdown.push({
      label: `${pages.length} database table model${pages.length > 1 ? "s" : ""}`,
      val: pageTotal,
    });
    total += pageTotal;
  }

  // Calculate feature pricing
  const featurePricing: [boolean, string, number][] = [
    [features.login, "User authentication suite", 500],
    [features.encrypt, "Password encryption", 200],
    [features.jwt, "JWT token security", 300],
    [features.admin, "Admin dashboard", 1000],
    [features.email, "Automated email setup", 500],
    [features.upload, "Secure file uploads", 500],
    [features.search, "Application search", 500],
    [features.fk, "Database relationships", 500],
  ];

  featurePricing.forEach(([enabled, label, val]) => {
    if (enabled) {
      breakdown.push({ label, val });
      total += val;
    }
  });

  // Calculate delivery days
  let days = 0;
  pages.forEach((p) => {
    if (p.read) days += 1;
    if (p.create || p.update || p.delete) days += 1;
    if (p.search) days += 1;
  });
  if (features.admin) days += 2;
  if (features.jwt || features.email) days += 1;
  if (features.fk) days += 1;

  return {
    breakdown,
    total,
    days: Math.max(2, days),
  };
}

/**
 * Get the active modules based on feature flags
 */
export function getActiveModules(features: {
  login: boolean;
  encrypt: boolean;
  jwt: boolean;
  admin: boolean;
  email: boolean;
  upload: boolean;
  search: boolean;
}): ModuleItem[] {
  const modules: ModuleItem[] = [
    { label: "Auth", active: features.login, color: "sky" },
    { label: "Bcrypt", active: features.encrypt, color: "emerald" },
    { label: "JWT", active: features.jwt, color: "indigo" },
    { label: "Admin", active: features.admin, color: "amber" },
    { label: "Email", active: features.email, color: "rose" },
    { label: "Uploads", active: features.upload, color: "teal" },
    { label: "Search", active: features.search, color: "violet" },
  ];

  return modules.filter((item) => item.active);
}

/**
 * Format relationships as a descriptive string
 */
export function formatRelations(relations: RelationSpec[]): string {
  return relations
    .map((r) => `${r.sourceTable} --(${r.relationType})--> ${r.targetTable}`)
    .join(", ");
}

/**
 * Generate the WhatsApp message content for a completed quote
 */
export function generateWhatsAppMessage(params: {
  clientName: string;
  clientUni: string;
  clientEmail: string;
  clientWa: string;
  clientDesc: string;
  frontend: string | null;
  devLanguage: string | null;
  backend: string | null;
  database: string | null;
  features: {
    login: boolean;
    encrypt: boolean;
    jwt: boolean;
    admin: boolean;
    email: boolean;
    upload: boolean;
    search: boolean;
    fk: boolean;
  };
  pages: PageSpec[];
  relations: RelationSpec[];
  days: number;
}): string {
  const {
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
    days,
  } = params;

  const pagesText = pages
    .map((p, idx) => {
      const ops = (["create", "read", "update", "delete", "search"] as CrudKey[])
        .filter((key) => p[key])
        .map((key) => key.toUpperCase())
        .join("/");
      const fieldsList = p.fields
        .map((f) => `${f.label || "unnamed"}: ${f.type}`)
        .join(", ");
      return `Page ${idx + 1} (${p.topic || "Unnamed"}) [${ops}] - Fields: [${fieldsList || "No fields configured"}]`;
    })
    .join("\n- ");

  const authList =
    [
      features.login && "Login/Register",
      features.encrypt && "Password Encryption",
      features.jwt && "JWT Auth",
      features.admin && "Admin Dashboard",
    ].filter(Boolean).join(", ") || "None";

  const extrasList =
    [
      features.email && "Email Setup",
      features.upload && "File Upload",
      features.search && "Search",
      features.fk && "FK/PK Relations",
    ].filter(Boolean).join(", ") || "None";

  const fkDesc = formatRelations(relations);

  return (
    `Hi Dev+!\n\nI just configured my project:\n\n` +
    `Name: ${clientName}\n` +
    `Uni/Course: ${clientUni || "N/A"}\n` +
    `Email: ${clientEmail}\n` +
    `WhatsApp: ${clientWa || "N/A"}\n\n` +
    `Tech Stack:\n- Frontend: ${frontend}\n- Language: ${devLanguage}\n- Backend: ${backend}\n- Database: ${database}\n\n` +
    `Auth: ${authList}\nFeatures: ${extrasList}\n\n` +
    `Dynamic Pages & Schemas:\n- ${pagesText}\n\n` +
    (features.fk && fkDesc ? `Relationships: ${fkDesc}\n\n` : "") +
    `Pricing: Custom quote (will be confirmed)\n` +
    `Estimated Delivery: ${days}-${days + 2} days\n\n` +
    `Details/Topic: ${clientDesc || "None specified"}\n\n` +
    `📄 *Full project specification (JSON) will be downloaded automatically*\n\n` +
    `Please confirm and let's get started.`
  );
}