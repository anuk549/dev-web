/**
 * Constants and configuration for the Dev+ Quote Builder application
 */

import type { FeedbackItem, StepItem, ChoiceItem, FieldSpec, PageSpec } from "@/src/types/quote";

export const DEV_PHONE = normalizeWhatsAppNumber(
  process.env.NEXT_PUBLIC_DEV_WHATSAPP_NUMBER ||
    process.env.NEXT_PUBLIC_DEV_PHONE ||
    "",
);

export const LOGO_SRC = "/logo.jpg";

export const STEPS = 11;

export const FIELD_TYPES: FieldSpec["type"][] = [
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

export const INITIAL_PAGES: PageSpec[] = [
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

export const FEEDBACK_ITEMS: FeedbackItem[] = [
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

export const STEP_ITEMS: StepItem[] = [
  { idx: 1, label: "Quick Start", icon: "ti-rocket" },
  { idx: 2, label: "Frontend", icon: "ti-layout-dashboard" },
  { idx: 3, label: "Language", icon: "ti-code" },
  { idx: 4, label: "Backend", icon: "ti-server" },
  { idx: 5, label: "Database", icon: "ti-database" },
  { idx: 6, label: "Features", icon: "ti-shield-check" },
  { idx: 7, label: "Schema", icon: "ti-table" },
  { idx: 8, label: "Relations", icon: "ti-git-fork" },
  { idx: 9, label: "Preview", icon: "ti-eye" },
  { idx: 10, label: "Contact", icon: "ti-brand-whatsapp" },
];

export const FRONTEND_OPTIONS: ChoiceItem[] = [
  { name: "React", sub: "Fast SPA with a clean component system", icon: "ti-brand-react" },
  { name: "Next.js", sub: "SEO-ready App Router project", icon: "ti-brand-nextjs" },
  { name: "Vite", sub: "Lean frontend for compact projects", icon: "ti-bolt" },
  { name: "Vue", sub: "Friendly UI with Nuxt option", icon: "ti-brand-vue" },
];

export const LANGUAGE_OPTIONS: ChoiceItem[] = [
  { name: "TypeScript", sub: "Typed, maintainable, production-friendly", icon: "ti-brand-typescript" },
  { name: "JavaScript", sub: "Simple, quick, and familiar", icon: "ti-brand-javascript" },
];

export const BACKEND_OPTIONS: ChoiceItem[] = [
  { name: "Node/Express", sub: "Custom REST API service", icon: "ti-brand-nodejs" },
  { name: "Spring Boot", sub: "Structured Java backend", icon: "ti-leaf" },
];

export const DATABASE_OPTIONS: ChoiceItem[] = [
  { name: "Firebase", sub: "Auth and realtime data", icon: "ti-flame" },
  { name: "MongoDB", sub: "Flexible document storage", icon: "ti-database" },
  { name: "MySQL", sub: "Classic relational DB", icon: "ti-sql" },
  { name: "PostgreSQL", sub: "Advanced relational DB", icon: "ti-database-cog" },
];

export const RELATION_TYPES = [
  "Has Many (1:N)",
  "Belongs To (1:1)",
  "Many to Many (M:N)",
];

/**
 * Normalize a WhatsApp phone number by removing all non-digit characters
 */
function normalizeWhatsAppNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}