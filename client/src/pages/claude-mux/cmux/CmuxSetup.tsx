import CodeBlock from "@/components/CodeBlock";
import InfoBox from "@/components/InfoBox";
import PageNavigation from "@/components/PageNavigation";
import BookmarkButton from "@/components/BookmarkButton";
import StepIndicator from "@/components/StepIndicator";
import SectionBadge from "@/components/SectionBadge";

export default function CmuxSetup() {
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
            cmux のセットアップと活用
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            インストールから Claude Code 連携、マルチエージェント運用まで。
          </p>
        </div>

        <div className="space-y-12 mt-8">
          {/* ── インストール ── */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              インストール
            </h2>

            <p className="text-foreground mb-6 leading-relaxed">
              cmux は Homebrew の cask として配布されている。
              インストール時に CLI も自動で PATH に通るため、手動の symlink 作業は不要。
            </p>

            <CodeBlock
              language="bash"
              code={`# Homebrew でインストール（macOS 専用キャスク）
brew install --cask cmux

# Homebrew が自動で CLI をリンクする
# Apple Silicon: /opt/homebrew/bin/cmux
# Intel Mac:     /usr/local/bin/cmux

# 確認
which cmux           # → /opt/homebrew/bin/cmux
cmux --version       # → cmux 0.63.x

# 起動
cmux                       # カレントディレクトリで新規 workspace を開く
cmux ~/projects/my-app     # 指定パスで開く`}
            />

            <div className="mt-6">
              <InfoBox type="info" title="初回起動時の注意">
                初回起動時に macOS
                のセキュリティ確認が表示される場合は「開く」をクリック。
                以降は <code className="text-primary">cmux</code> コマンドだけでアプリが立ち上がる。
              </InfoBox>
            </div>
          </section>

          {/* ── 基本操作 ── */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              基本操作
            </h2>

            <p className="text-foreground mb-8 leading-relaxed">
              cmux は macOS
              標準のキーボードショートカット体系に沿って設計されている。tmux
              のようなプレフィックスキーは不要で、Cmd
              ベースのショートカットで操作する。
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="p-3 text-left font-semibold text-foreground">
                      操作
                    </th>
                    <th className="p-3 text-left font-semibold text-foreground">
                      ショートカット
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground">新規ワークスペース</td>
                    <td className="p-3 text-muted-foreground">
                      <code className="text-primary">Cmd+Shift+N</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground">右ペイン分割</td>
                    <td className="p-3 text-muted-foreground">
                      <code className="text-primary">Cmd+Shift+D</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground">下ペイン分割</td>
                    <td className="p-3 text-muted-foreground">
                      <code className="text-primary">Cmd+Shift+J</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground">未読通知にジャンプ</td>
                    <td className="p-3 text-muted-foreground">
                      <code className="text-primary">Cmd+Shift+U</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground">通知パネル</td>
                    <td className="p-3 text-muted-foreground">
                      <code className="text-primary">Cmd+Shift+I</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground">ビルトインブラウザ</td>
                    <td className="p-3 text-muted-foreground">
                      <code className="text-primary">Opt+Cmd+D</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground">ワークスペース切替</td>
                    <td className="p-3 text-muted-foreground">
                      <code className="text-primary">Cmd+1</code> 〜{" "}
                      <code className="text-primary">Cmd+9</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-foreground leading-relaxed">
              tmux
              と異なり、プレフィックスキーを押してからコマンドキーを入力する二段階操作が不要。macOS
              のネイティブアプリとして、他のアプリケーションと同じ感覚で操作できる。
            </p>
          </section>

          {/* ── 実際の使い方 ── */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              実際の使い方
            </h2>

            <p className="text-foreground mb-6 leading-relaxed">
              cmux を起動してから Claude Code で作業を始めるまでの具体的な手順を紹介する。
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-4">
              1. 起動とワークスペース作成
            </h3>

            <p className="text-foreground mb-4 leading-relaxed">
              cmux を起動すると、デフォルトのワークスペースが開く。左サイドバーにワークスペース一覧が表示される。
            </p>

            <CodeBlock
              language="bash"
              code={`# アプリケーションから起動、または CLI から起動
cmux

# 新しいワークスペースを追加
# Cmd+Shift+N

# ワークスペースの切り替え
# Cmd+1, Cmd+2, ... Cmd+9`}
            />

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
              2. Claude Code の起動と作業
            </h3>

            <p className="text-foreground mb-4 leading-relaxed">
              各ワークスペースで Claude Code を起動する。ペインを分割して dev サーバーを横に表示するのが典型的な構成。
            </p>

            <CodeBlock
              language="bash"
              code={`# ワークスペース 1 で Claude Code を起動
cd ~/projects/my-app
claude

# 右ペインに分割して dev サーバーを起動（Cmd+Shift+D で分割後）
npm run dev

# 左ペインに戻る（Cmd+[ または Cmd+] でペイン間を移動）`}
            />

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
              3. 複数エージェントの並行運用
            </h3>

            <p className="text-foreground mb-4 leading-relaxed">
              別のワークスペースに切り替えて、2つ目の Claude Code セッションを起動する。
            </p>

            <CodeBlock
              language="bash"
              code={`# Cmd+Shift+N で新しいワークスペースを作成
cd ~/projects/my-app

# 別のタスクで Claude Code を起動
claude

# WS 1 のエージェントが入力待ちになると、サイドバーのタブに
# 青い通知リングが点灯する
# Cmd+Shift+U で未読のワークスペースに即ジャンプ`}
            />

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
              4. ビルトインブラウザの活用
            </h3>

            <p className="text-foreground mb-4 leading-relaxed">
              GitHub Issue やドキュメントを参照しながら作業する場合、ウィンドウを切り替えずにブラウザを表示できる。
            </p>

            <CodeBlock
              language="bash"
              code={`# Opt+Cmd+D でビルトインブラウザを表示
# ターミナルとブラウザが左右に並ぶ

# GitHub Issue を開きながら Claude Code に指示を出す
# 例: 「Issue #42 の内容を確認して修正してください」

# ブラウザを閉じる: もう一度 Opt+Cmd+D`}
            />

            <div className="mt-6">
              <InfoBox type="info" title="Ghostty 設定の流用">
                既に Ghostty を使っている場合、cmux は Ghostty の設定ファイルをそのまま読み込む。フォント、カラースキーム、キーバインドなどを再設定する必要はない。
              </InfoBox>
            </div>
          </section>

          {/* ── Claude Code との連携 ── */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Claude Code との連携
            </h2>

            <p className="text-foreground mb-6 leading-relaxed">
              cmux には Claude Code 用の専用コマンド <code className="text-primary">cmux claude-hook</code> が
              用意されている。<code className="text-primary">~/.claude/settings.json</code> の hooks に直接登録するだけで、
              タスク完了・通知・プロンプト送信が cmux サイドバーと連動する。個別のシェルスクリプトを書く必要はない。
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-4">
              cmux claude-hook のサブコマンド
            </h3>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="p-3 text-left font-semibold text-foreground">サブコマンド</th>
                    <th className="p-3 text-left font-semibold text-foreground">対応する Claude Code Hook</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-3 font-mono text-foreground">session-start</td>
                    <td className="p-3 text-muted-foreground">SessionStart（セッション開始）</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-mono text-foreground">stop</td>
                    <td className="p-3 text-muted-foreground">Stop（タスク完了 → 通知リング点灯）</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-mono text-foreground">notification</td>
                    <td className="p-3 text-muted-foreground">Notification（権限確認等の通知転送）</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-mono text-foreground">prompt-submit</td>
                    <td className="p-3 text-muted-foreground">UserPromptSubmit（入力時に通知をクリア）</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
              settings.json への登録
            </h3>

            <p className="text-foreground mb-4 leading-relaxed">
              <code className="text-primary">~/.claude/settings.json</code> の <code>hooks</code> に追記する。
              <code className="text-primary">$CMUX_SURFACE_ID</code> は cmux 内ターミナルでのみ自動設定されるため、
              <code className="text-primary">[ -n "$CMUX_SURFACE_ID" ]</code> ガードを入れておけば cmux 外のセッションでは無害（hook がスキップされる）。
            </p>

            <CodeBlock
              language="json"
              code={`{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "[ -n \\"$CMUX_SURFACE_ID\\" ] && command -v cmux >/dev/null 2>&1 && cmux claude-hook stop || true"
          }
        ]
      }
    ],
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "[ -n \\"$CMUX_SURFACE_ID\\" ] && command -v cmux >/dev/null 2>&1 && cmux claude-hook notification || true"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "[ -n \\"$CMUX_SURFACE_ID\\" ] && command -v cmux >/dev/null 2>&1 && cmux claude-hook prompt-submit || true"
          }
        ]
      }
    ]
  }
}`}
            />

            <div className="mt-6">
              <InfoBox type="info" title="既存 hook と並列実行する場合">
                memory-sync など他の hook がすでにある場合は、上書きせず同じ <code>hooks</code> 配列に並べて追加する。
                配列内の hook は並列実行されるので、cmux 連携は「追加」する形で安全に共存できる。
              </InfoBox>
            </div>

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
              連携で起こること
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="font-semibold text-foreground mb-1">タスク完了で通知リングが点灯</p>
                <p className="text-sm text-muted-foreground">
                  Stop イベントで <code className="text-primary">cmux claude-hook stop</code> が呼ばれ、
                  サイドバーに青いリングと未読バッジが表示される。<code className="text-primary">Cmd+Shift+U</code> で即ジャンプできる。
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="font-semibold text-foreground mb-1">プロンプト送信でリングが消える</p>
                <p className="text-sm text-muted-foreground">
                  ユーザーが入力すると <code className="text-primary">prompt-submit</code> が発火し、Running 状態に戻る。
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="font-semibold text-foreground mb-1">macOS デスクトップ通知</p>
                <p className="text-sm text-muted-foreground">
                  cmux アプリが裏に回っていてもシステム通知センターでタスク完了が告知される。
                </p>
              </div>
            </div>
          </section>

          {/* ── マルチエージェント運用パターン ── */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              マルチエージェント運用パターン
            </h2>

            <p className="text-foreground mb-8 leading-relaxed">
              cmux の「1 エージェント = 1
              ワークスペース」設計を活かした実践的な運用例を紹介する。
            </p>

            <div className="p-6 rounded-lg border border-border bg-card mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                フロントエンド + バックエンドの並行開発
              </h3>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-primary font-bold min-w-fit">WS 1</div>
                  <div>
                    <p className="font-semibold text-foreground">
                      フロントエンド開発（Claude Code）
                    </p>
                    <p className="text-muted-foreground">
                      React コンポーネントの実装を指示。dev
                      サーバーをペイン分割で表示
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-primary font-bold min-w-fit">WS 2</div>
                  <div>
                    <p className="font-semibold text-foreground">
                      バックエンド API（Claude Code --resume）
                    </p>
                    <p className="text-muted-foreground">
                      API エンドポイントの実装。別セッションで並行して作業
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-primary font-bold min-w-fit">WS 3</div>
                  <div>
                    <p className="font-semibold text-foreground">
                      テスト実行（手動操作）
                    </p>
                    <p className="text-muted-foreground">
                      テストの実行と結果確認。必要に応じてデバッグ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-foreground leading-relaxed">
              通知リングにより、各ワークスペースのエージェント状態を一目で把握できる。WS
              1 のエージェントが入力待ちになったら通知リングが点灯し、
              <code className="text-primary">Cmd+Shift+U</code>{" "}
              で即座にジャンプして対応できる。
            </p>
          </section>

          {/* ── Tips: クリップボード画像の貼付 ── */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Tips: クリップボード画像の貼付
            </h2>

            <p className="text-foreground mb-6 leading-relaxed">
              cmux は libghostty ベースのため、クリップボードに保持した画像（スクリーンショット等）を Claude Code のプロンプト欄に
              <code className="text-primary mx-1">Cmd+V</code>
              で直接貼り付けることができない。iTerm2 では OSC 1337 などの独自プロトコルで画像転送が可能だが、Ghostty 系はテキスト中心の設計でこれをサポートしていない。
            </p>

            <div className="mb-6">
              <InfoBox type="warning" title="現象">
                スクショを撮影してクリップボードに保持した状態で
                <code className="text-primary mx-1">Cmd+V</code>
                を押しても、Claude Code に画像が渡らない。iTerm2 では同じ操作で画像が添付される。
              </InfoBox>
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-4">
              回避策
            </h3>

            <p className="text-foreground mb-6 leading-relaxed">
              いったんファイルとして保存し、ファイルパスを
              <code className="text-primary mx-1">@パス</code>
              形式で渡すのが基本方針。手段は 3 つある。
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="p-3 text-left font-semibold text-foreground">
                      手段
                    </th>
                    <th className="p-3 text-left font-semibold text-foreground">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground">
                      Finder からドラッグ&ドロップ
                    </td>
                    <td className="p-3 text-muted-foreground">
                      画像ファイルを cmux のプロンプト欄にドロップ → 絶対パスが入力される
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground">
                      スクショを直接ファイル保存
                    </td>
                    <td className="p-3 text-muted-foreground">
                      <code className="text-primary">Cmd+Shift+4</code> で範囲撮影 → デスクトップに保存 →{" "}
                      <code className="text-primary">@~/Desktop/...</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground">
                      シェル関数で自動化（推奨）
                    </td>
                    <td className="p-3 text-muted-foreground">
                      <code className="text-primary">Cmd+Shift+Ctrl+4</code> でクリップボードに撮影 →{" "}
                      <code className="text-primary">pbimg</code> 実行 →{" "}
                      <code className="text-primary">Cmd+V</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-4">
              pbimg シェル関数
            </h3>

            <p className="text-foreground mb-4 leading-relaxed">
              クリップボードの画像を <code className="text-primary mx-1">~/tmp</code>
              に PNG 保存し、
              <code className="text-primary mx-1">@パス</code>
              の形でクリップボードに書き戻す関数。依存ライブラリは不要（macOS 標準の osascript と pbcopy のみ使用）。
            </p>

            <CodeBlock
              language="bash"
              code={`# ~/.zshrc に追記
# クリップボードの画像を ~/tmp に PNG 保存し、@パスをクリップボードへ
pbimg() {
  local f="$HOME/tmp/clip-$(date +%Y%m%d-%H%M%S).png"
  mkdir -p "$HOME/tmp"
  if osascript -e "tell application \\"System Events\\" to write (the clipboard as «class PNGf») to (open for access POSIX file \\"$f\\" with write permission)" 2>/dev/null; then
    printf "@%s" "$f" | pbcopy
    echo "保存: $f"
    echo "クリップボードに @パス をコピー済み（Cmd+V で貼付）"
  else
    echo "クリップボードに画像がありません" >&2
    return 1
  fi
}`}
            />

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
              使い方
            </h3>

            <CodeBlock
              language="bash"
              code={`# 1. 設定を反映
source ~/.zshrc

# 2. スクショを撮影（クリップボードへ）
#    Cmd+Shift+Ctrl+4 で範囲選択

# 3. cmux のプロンプト欄で関数を実行
pbimg
# → 保存: /Users/you/tmp/clip-20260426-153012.png
# → クリップボードに @パス をコピー済み（Cmd+V で貼付）

# 4. プロンプト欄に戻って Cmd+V
#    → @/Users/you/tmp/clip-20260426-153012.png が貼付される

# 5. Enter で送信。Claude Code が画像を読み取る`}
            />

            <div className="mt-6">
              <InfoBox type="info" title="代替手段: pngpaste">
                <code className="text-primary mx-1">brew install pngpaste</code>
                で導入できる CLI ツール。
                <code className="text-primary mx-1">pngpaste image.png</code>
                でクリップボードを PNG 化できる。pbimg と同じことを Homebrew パッケージで済ませたい場合に便利。
              </InfoBox>
            </div>
          </section>

          {/* ── 参考リンク ── */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              参考リンク
            </h2>

            <div className="space-y-3 mb-6">
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="font-semibold text-foreground">
                  GitHub リポジトリ
                </p>
                <p className="text-sm text-muted-foreground">
                  manaflow-ai/cmux
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="font-semibold text-foreground">公式サイト</p>
                <p className="text-sm text-muted-foreground">cmux.com</p>
              </div>
            </div>

            <InfoBox type="info" title="オープンソース">
              cmux は無料・オープンソース。Ghostty
              の設定ファイルがそのまま利用できる。
            </InfoBox>
          </section>
        </div>

        <PageNavigation />
      </div>
    </div>
  );
}
