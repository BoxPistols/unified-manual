import CodeBlock from "@/components/CodeBlock";
import InfoBox from "@/components/InfoBox";
import PageNavigation from "@/components/PageNavigation";
import BookmarkButton from "@/components/BookmarkButton";
import StepIndicator from "@/components/StepIndicator";
import SectionBadge from "@/components/SectionBadge";

export default function DesignMd() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="flex justify-between items-center mb-4">
          <StepIndicator />
          <BookmarkButton />
        </div>

        <div className="mt-8 mb-12">
          <SectionBadge />

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            CLAUDE.md / AGENTS.md / DESIGN.md
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            AI エージェント向けメタドキュメントを 3 層に分ける。
            指示・共通・設計を別ファイルに置いて、それぞれを薄く保つ。
          </p>
        </div>

        <div className="space-y-12 mt-8">
          {/* ── 概要 ── */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              なぜ 3 層に分けるのか
            </h2>

            <p className="text-foreground mb-6 leading-relaxed">
              CLAUDE.md だけで全部書くと、すぐに肥大化する。
              ツール固有の指示・他 AI と共有したい指示・設計判断の記録は、
              性質が違うのに 1 ファイルに混ざりやすい。
            </p>

            <p className="text-foreground mb-6 leading-relaxed">
              2026 年に主流化した整理は、これを 3 ファイルに分ける手法。
              CLAUDE.md は Claude Code 用の指示、AGENTS.md は AI ツール共通、
              DESIGN.md は設計の事実、と役割をはっきりさせる。
            </p>

            <InfoBox type="info" title="まず CLAUDE.md だけで構わない">
              小さいプロジェクトでは CLAUDE.md 単体で十分。 「複数 AI
              ツールを混在させる」「設計判断が増えた」段階で AGENTS.md →
              DESIGN.md と段階的に分けると無理がない。
            </InfoBox>
          </section>

          {/* ── 比較表 ── */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              役割の比較
            </h2>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="p-3 text-left font-semibold text-foreground">
                      ファイル
                    </th>
                    <th className="p-3 text-left font-semibold text-foreground">
                      対象
                    </th>
                    <th className="p-3 text-left font-semibold text-foreground">
                      内容
                    </th>
                    <th className="p-3 text-left font-semibold text-foreground">
                      鮮度
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-3 font-semibold text-foreground">
                      CLAUDE.md
                    </td>
                    <td className="p-3 text-muted-foreground">
                      Claude Code 専用
                    </td>
                    <td className="p-3 text-muted-foreground">
                      ツール固有の指示・操作流儀
                    </td>
                    <td className="p-3 text-muted-foreground">
                      高（毎回読まれる）
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-semibold text-foreground">
                      AGENTS.md
                    </td>
                    <td className="p-3 text-muted-foreground">ツール非依存</td>
                    <td className="p-3 text-muted-foreground">
                      コーディング規約・テスト方針・PR ルール
                    </td>
                    <td className="p-3 text-muted-foreground">中</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-semibold text-foreground">
                      DESIGN.md
                    </td>
                    <td className="p-3 text-muted-foreground">
                      人間 + AI 共通
                    </td>
                    <td className="p-3 text-muted-foreground">
                      アーキテクチャ・意思決定・制約
                    </td>
                    <td className="p-3 text-muted-foreground">
                      低（変更時だけ更新）
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-foreground leading-relaxed">
              「鮮度」は更新頻度の目安。 CLAUDE.md は短く、AGENTS.md
              は中、DESIGN.md は事実が変わった時のみ。
              更新頻度が違うものを混ぜないことで、各ファイルが軽く保たれる。
            </p>
          </section>

          {/* ── CLAUDE.md ── */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              CLAUDE.md の例
            </h2>

            <p className="text-foreground mb-6 leading-relaxed">
              Claude Code がそのセッションで使う指示だけ。 他ツール（Cursor /
              OpenCode / Codex 等）と共有したい内容は AGENTS.md に逃がす。
            </p>

            <CodeBlock
              language="markdown"
              code={`# CLAUDE.md（Claude Code 専用）

共通規約は @AGENTS.md を参照。設計は @DESIGN.md を参照。

# Claude Code 固有の指示
- /compact 後は AGENTS.md と DESIGN.md を再読込
- Plan Mode を使う前に Repository Impact Map を作る
- subagent に渡す前に「メインで何を返してほしいか」を明示する

# このプロジェクト固有の小ネタ
- pnpm（npm ではない）
- テスト: pnpm test、型: pnpm check`}
            />
          </section>

          {/* ── AGENTS.md ── */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              AGENTS.md の例
            </h2>

            <p className="text-foreground mb-6 leading-relaxed">
              AI コーディングツール共通のルール。OpenAI Codex、OpenCode、
              Cursor、Zed、Claude Code が同じ AGENTS.md を読める前提で書く。
              ツール固有の構文や hook には触れない。
            </p>

            <CodeBlock
              language="markdown"
              code={`# AGENTS.md（AI ツール共通）

# コーディング規約
- TypeScript の any は使わない
- React コンポーネントは PascalCase
- hook は use プレフィックス

# テスト方針
- 単体テストは Vitest
- E2E は Playwright
- 新規実装には少なくとも 1 ケースのテストを添える

# PR ルール
- PR タイトルは日本語、簡潔に
- 1 PR = 1 関心事
- 自動生成コミットメッセージは使わない`}
            />

            <InfoBox type="info" title="互換性の波">
              AGENTS.md はオープン仕様（agents-md.org
              など）として整備が進んでいる。 Cursor / OpenCode / Zed / Codex
              は対応済み。 Claude Code も @AGENTS.md で取り込める。
            </InfoBox>
          </section>

          {/* ── DESIGN.md ── */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              DESIGN.md の例
            </h2>

            <p className="text-foreground mb-6 leading-relaxed">
              アーキテクチャ・意思決定・制約。コードを読めば分かることは書かない。
              「なぜこう作ったか」「何が前提か」だけを残す。 AI
              への指示というより「人間も含めた関係者全員のための事実集」。
            </p>

            <CodeBlock
              language="markdown"
              code={`# DESIGN.md

# アーキテクチャ
- フロントエンド: React 19 + Vite
- 状態管理: server state は TanStack Query、UI 状態は Zustand
- ルーティング: wouter
- 国際化: 現状なし（将来 i18next）

# 主要な制約
- ローカル LLM 用に Ollama 連携を残す（クラウドのみにしない）
- IE 非対応、Safari 16+

# 意思決定の記録（採用・不採用）
## 採用: pnpm
- 理由: monorepo の共有パッケージが多い、symlink ベースが軽い
## 不採用: tRPC
- 理由: GraphQL の既存資産があるため

# 既知の課題
- ビルド時間が長い（5 分超）→ 2026 Q3 に Turbopack 移行検討`}
            />

            <p className="text-foreground mt-6 leading-relaxed">
              DESIGN.md は人間が ADR（Architecture Decision
              Record）として書いてきた内容に近い。 AI
              に「過去の判断をひっくり返さない」と教える効果も大きい。
            </p>
          </section>

          {/* ── 運用例 ── */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              3 層を組み合わせる
            </h2>

            <p className="text-foreground mb-6 leading-relaxed">
              CLAUDE.md からは @AGENTS.md と @DESIGN.md を import する。
              これでセッション開始時に 3 層が一気に読まれる。 他ツールも
              AGENTS.md と DESIGN.md は共通で参照できる。
            </p>

            <CodeBlock
              language="markdown"
              code={`# CLAUDE.md（最小構成）

このプロジェクトの基本ルールは以下を参照:
- @AGENTS.md
- @DESIGN.md

# Claude Code 固有
- /compact 後はこの 3 ファイルを再読込
- Skills は .claude/skills/ 配下を参照`}
            />

            <p className="text-foreground mt-6 leading-relaxed">
              CLAUDE.md は数十行に保ち、 共通規約は AGENTS.md、 設計事実は
              DESIGN.md にそれぞれ厚く書く。
              この分割で、各ファイルの編集者・更新頻度・読者が明確になる。
            </p>
          </section>

          {/* ── 注意 ── */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">注意点</h2>

            <div className="space-y-4">
              <InfoBox type="info" title="ファイルを増やしすぎない">
                3 つで足りるのにメタドキュメントを 10 個に分けると、
                どこに何が書いてあるか追えなくなる。 3
                層を超える分割は、追加のたびに「なぜ既存ファイルに収まらないか」を説明できる時だけ。
              </InfoBox>

              <InfoBox type="info" title="重複を許さない">
                3
                ファイルで同じ事実が書かれていると、片方を更新し忘れて齟齬が出る。
                重複を見つけたら、どちらかを正にして、もう一方からは参照だけ残す。
              </InfoBox>

              <InfoBox type="info" title="AI に「これを書いて」と頼む">
                プロジェクト初期の DESIGN.md は、 Claude Code に{" "}
                <code className="text-primary">/init</code> 後に
                「このコードベースから設計判断を抽出して DESIGN.md
                にまとめて」と頼むと
                叩き台が作れる。人間がレビューして加筆する流れ。
              </InfoBox>
            </div>
          </section>
        </div>

        <PageNavigation />
      </div>
    </div>
  );
}
