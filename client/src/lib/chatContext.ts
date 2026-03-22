import {
  getPageByPath,
  getManualById,
  getManualPages,
  getManualSections,
  getSectionPages,
  getNextPage,
  getPreviousPage,
  sections,
  type ManualId,
} from "./navigation";
import { searchIndex } from "./searchIndex";

export interface PageContext {
  path: string;
  title: string | null;
  manualId: ManualId | null;
  sectionId: string | null;
}

export interface EnrichedPageContext extends PageContext {
  manualTitle: string | null;
  sectionTitle: string | null;
  keywords: string[];
  step: number | null;
  totalSteps: number | null;
  nextPage: { path: string; title: string } | null;
  previousPage: { path: string; title: string } | null;
  sectionPages: { path: string; title: string }[];
  manualSections: { id: string; title: string }[];
}

export function getPageContext(path: string): PageContext {
  const page = getPageByPath(path);
  return {
    path,
    title: page?.title ?? null,
    manualId: page?.manualId ?? null,
    sectionId: page?.sectionId ?? null,
  };
}

export function getEnrichedPageContext(path: string): EnrichedPageContext {
  const page = getPageByPath(path);
  const base = getPageContext(path);

  if (!page) {
    return {
      ...base,
      manualTitle: null,
      sectionTitle: null,
      keywords: [],
      step: null,
      totalSteps: null,
      nextPage: null,
      previousPage: null,
      sectionPages: [],
      manualSections: [],
    };
  }

  const manual = getManualById(page.manualId);
  const section = sections.find((s) => s.id === page.sectionId);
  const manualPages = getManualPages(page.manualId);
  const next = getNextPage(path);
  const prev = getPreviousPage(path);
  const secPages = getSectionPages(page.sectionId);
  const manSections = getManualSections(page.manualId);

  return {
    ...base,
    manualTitle: manual?.title ?? null,
    sectionTitle: section?.title ?? null,
    keywords: searchIndex[path] ?? [],
    step: page.step,
    totalSteps: manualPages.length,
    nextPage: next ? { path: next.path, title: next.title } : null,
    previousPage: prev ? { path: prev.path, title: prev.title } : null,
    sectionPages: secPages.map((p) => ({ path: p.path, title: p.title })),
    manualSections: manSections.map((s) => ({ id: s.id, title: s.title })),
  };
}
