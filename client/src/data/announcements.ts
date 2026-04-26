// 教材の更新履歴・お知らせ。新しいものを配列の先頭に追加する。

export type AnnouncementCategory =
  | "feature" // 新機能・新ページ追加
  | "update" // 既存ページの内容更新
  | "fix" // バグ修正・誤記訂正
  | "release"; // バージョンリリース・大型変更

export interface Announcement {
  // YYYY-MM-DD-kebab-case-slug 形式
  id: string;
  // YYYY-MM-DD
  date: string;
  title: string;
  description?: string;
  category: AnnouncementCategory;
  // 関連ページへの内部リンク（任意、wouter の path）
  link?: string;
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "2026-04-27-cmux-fact-check",
    date: "2026-04-27",
    title: "cmux 教材を実機検証で更新",
    description:
      "全 5 ページに VerifiedBox（バージョン・検証日）を追加。settings.json 改変の副作用警告と browser API の脅威モデル TL;DR、期待出力ブロックも追加。",
    category: "update",
    link: "/claude-mux/cmux/cmux-intro",
  },
  {
    id: "2026-04-26-cmux-pages-added",
    date: "2026-04-26",
    title: "cmux 教材を 5 ページ追加",
    description:
      "Intro / Setup / AgentTeams / BrowserAPI / Worktrees。cmux と tmux の使い分け、Claude Code との連携、git worktree との組み合わせを扱う。",
    category: "feature",
    link: "/claude-mux/cmux/cmux-intro",
  },
  {
    id: "2026-04-26-harness-context-design",
    date: "2026-04-26",
    title: "ハーネス・コンテキストエンジニアリング・DESIGN.md を追加",
    description:
      "Claude Code 公式の最新情報を反映。Welcome / SSOT / AgentOrchestration の既存ページもリプレイス。",
    category: "feature",
    link: "/claude-mux",
  },
];
