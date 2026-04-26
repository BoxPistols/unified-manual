import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Wrench,
  Bug,
  Tag,
} from "lucide-react";
import {
  ANNOUNCEMENTS,
  type Announcement,
  type AnnouncementCategory,
} from "@/data/announcements";

const categoryMeta: Record<
  AnnouncementCategory,
  { label: string; icon: React.ReactNode }
> = {
  feature: { label: "新機能", icon: <Sparkles size={14} /> },
  update: { label: "更新", icon: <Wrench size={14} /> },
  fix: { label: "修正", icon: <Bug size={14} /> },
  release: { label: "リリース", icon: <Tag size={14} /> },
};

type FilterValue = AnnouncementCategory | "all";

const filterOptions: { value: FilterValue; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "feature", label: "新機能" },
  { value: "update", label: "更新" },
  { value: "fix", label: "修正" },
  { value: "release", label: "リリース" },
];

// 年月（YYYY-MM）でグルーピング
function groupByMonth(items: Announcement[]): [string, Announcement[]][] {
  const groups = new Map<string, Announcement[]>();
  for (const a of items) {
    const month = a.date.slice(0, 7);
    if (!groups.has(month)) groups.set(month, []);
    groups.get(month)!.push(a);
  }
  return Array.from(groups.entries());
}

export default function Announcements() {
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return ANNOUNCEMENTS;
    return ANNOUNCEMENTS.filter((a) => a.category === filter);
  }, [filter]);

  const grouped = useMemo(() => groupByMonth(filtered), [filtered]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          TOP に戻る
        </Link>

        <div className="mb-10">
          <p className="text-xs font-mono tracking-[0.15em] uppercase text-muted-foreground mb-2">
            What's New
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            お知らせ一覧
          </h1>
          <p className="text-muted-foreground">
            教材ページの追加・更新・修正をすべて時系列で記録しています。
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {filterOptions.map((opt) => {
            const active = filter === opt.value;
            const count =
              opt.value === "all"
                ? ANNOUNCEMENTS.length
                : ANNOUNCEMENTS.filter((a) => a.category === opt.value).length;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFilter(opt.value)}
                className={`text-sm px-3 py-1.5 rounded border transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {opt.label}
                <span
                  className={`ml-1.5 text-xs ${
                    active ? "opacity-80" : "text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8">
            該当するお知らせはありません。
          </p>
        ) : (
          <div className="space-y-10">
            {grouped.map(([month, items]) => (
              <section key={month}>
                <h2 className="text-sm font-mono text-muted-foreground mb-3 pb-2 border-b border-border">
                  {month}
                </h2>
                <div className="space-y-3">
                  {items.map((a) => {
                    const meta = categoryMeta[a.category];
                    const card = (
                      <div className="bg-card rounded border border-border hover:border-primary/50 transition-colors p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-0.5">
                            <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded bg-muted text-foreground">
                              {meta.icon}
                              {meta.label}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                              <h3 className="text-base font-semibold text-foreground">
                                {a.title}
                              </h3>
                              <time className="text-xs font-mono text-muted-foreground">
                                {a.date}
                              </time>
                            </div>
                            {a.description && (
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {a.description}
                              </p>
                            )}
                          </div>
                          {a.link && (
                            <ArrowRight
                              size={16}
                              className="text-muted-foreground flex-shrink-0 mt-1"
                            />
                          )}
                        </div>
                      </div>
                    );
                    return a.link ? (
                      <Link key={a.id} href={a.link} className="block">
                        {card}
                      </Link>
                    ) : (
                      <div key={a.id}>{card}</div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
