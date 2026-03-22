import Fuse from "fuse.js";
import { faqEntries, type FaqEntry } from "@/data/chatFaq";
import type { ManualId } from "./navigation";

const fuse = new Fuse(faqEntries, {
  keys: [
    { name: "question", weight: 0.5 },
    { name: "keywords", weight: 0.4 },
    { name: "answer", weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
});

export interface FaqResult {
  entry: FaqEntry;
  score: number;
}

export function searchFaq(
  query: string,
  manualId?: ManualId | null,
): FaqResult | null {
  const results = fuse.search(query);
  if (results.length === 0) return null;

  // manualId が指定されている場合、そのマニュアルの結果を優先
  if (manualId) {
    const manualMatch = results.find(
      (r) => r.item.manualId === manualId || r.item.manualId === null,
    );
    if (manualMatch) {
      return { entry: manualMatch.item, score: manualMatch.score ?? 1 };
    }
  }

  const best = results[0];
  return { entry: best.item, score: best.score ?? 1 };
}

export function formatFaqResponse(result: FaqResult): string {
  const { entry } = result;
  let response = entry.answer;

  if (entry.relatedPages.length > 0) {
    response += "\n\n関連ページ:";
    for (const page of entry.relatedPages) {
      response += `\n- [${page}](${page})`;
    }
  }

  return response;
}
