/**
 * Type definitions for the Dev+ Quote Builder application
 */

export type CrudKey = "create" | "read" | "update" | "delete" | "search";

export interface FieldSpec {
  label: string;
  type: string;
}

export interface PageSpec {
  topic: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  search: boolean;
  fields: FieldSpec[];
}

export interface RelationSpec {
  sourceTable: string;
  relationType: string;
  targetTable: string;
}

export interface QuoteBreakdown {
  label: string;
  val: number;
}

export interface QuoteResult {
  breakdown: QuoteBreakdown[];
  total: number;
  days: number;
}

export interface FeedbackItem {
  name: string;
  role: string;
  feedback: string;
}

export interface StepItem {
  idx: number;
  label: string;
  icon: string;
}

export interface ChoiceItem {
  name: string;
  sub: string;
  icon: string;
}

export interface ModuleItem {
  label: string;
  active: boolean;
  color: string;
}