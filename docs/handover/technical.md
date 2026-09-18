# 現在の実装・技術構成

[引き継ぎの入口へ戻る](README.md)

更新日：2026-09-19。現行コードの確認基準は `6a5a8c8`。2026-09-07のDrive原資料では「今回」「目標」は原資料作成時を指す。目標仕様・コード確認・過去の報告・未確認を区別する。

## 2026-09-19 現行設計の上書き事項

以下を現行方針として優先する。後半に残るRealtime API＋分析＋Firebaseの「目標アーキテクチャ」は過去構想であり、現行実装方針ではない。

- **iPhone専用**。タモヤンポータルからTrip TalkのURLへ通常のページ遷移で開く。
- GitHub Pages上の独立Webアプリとして扱い、iframe埋め込みは前提にしない。
- GitHubは確定台本・教材・将来の横断表現DBの正本。
- Firebase/Firestoreは **音読回数・最終音読日時・4段階自己評価など個人進捗の永続保存だけ** に使う。
- SafariのlocalStorageだけを個人進捗の正本にしない。
- ChatGPT Liveは外部機能として使う。アプリ内Realtime APIは使わない。
- 台本読み上げもAPI/TTS実装を行わず、Trip Talkが読み上げ指示書を生成して外部ChatGPT Liveへ渡すだけ。
- 読み上げ指示書には「ユーザーがLive内で『もう一回』と言ったら、同じ台本を同じルールで最初から最後まで再読する」を含める。反復時の再生成は不要。
- Liveの詳細失敗ログや会話ログをMVPでFirestoreへ保存しない。

### 現在地（2026-09-08確認・歴史的コード確認）
- 文書追加前のGitHub main：`6a5a8c886693dff5cb84d9e2765518d0067d7061`（Shorten ChatGPT project instructions）。GitHubから直接取得した。
- ソースtree：`bb4a295df178b387a82b9dbd38b763ea5ce6ff8d`。読取調査に使った2026-09-07バックアップcheckoutのHEAD・treeが一致し、未コミット差分なしを確認した。これはバックアップcheckoutであり、全端末の正本や未push作業まで調査した意味ではない。
- 現行アプリは、iPhone向けの旅行英会話予習・会話例・ChatGPTへ渡す指示書作成アプリ。アプリ内の有料RealtimeはREADMEで凍結され、主要フローにAPIキーは不要。
- 2人・2テーマ・10場面。ホテル5場面、空港5場面。既存READMEの「空港3場面」はコードと不一致。
- UIの画面状態はhome／preview。Live／Review等の型が存在しても、アプリ内音声会話・分析・履歴保存の実働経路が完成しているとは扱わない。
- Firebase SDK・Firebase設定・サーバーAPIルートは確認した現行treeにない。FirebaseのプロジェクトID、Auth、Rules、DBが運用中だと推測しない。
- 今回は文書の追加のみ。アプリのlint／build／iPhone実機試験は再実施していない。

---

### 実装の地図
| パス | 役割 |
|---|---|
| `src/app/page.tsx` | 利用者・場面・難易度・モード選択、予習、日本語表示、回答例、指示書コピー |
| `src/lib/scenarios.ts` | USERS・SCENARIOS、英日会話例・語彙、語彙整合チェック、プロンプト生成 |
| `src/lib/storage.ts` | `english-mvp:<userId>:<suffix>` のlocalStorage |
| `src/lib/types.ts` | Difficulty／PracticeMode／Scene／Review／SessionRecord等 |
| `src/app/globals.css` | iPhoneを意識したUI |
| `next.config.ts` | 静的export、trailingSlash、PagesのbasePath |
| `.github/workflows/deploy-pages.yml` | main push・手動実行のPagesビルド／公開 |
| `AGENTS.md`、`CLAUDE.md` | 開発時の指示。Next.jsの該当バージョンの同梱docsを確認してからコード変更 |

Next.js 16系、React 19系、TypeScript。正確な解決バージョンはpackage-lock.jsonを見る。ワークフローはNode 22、npm ci、npm run build、outを公開。GITHUB_ACTIONS=trueではbasePath=/trip-talk。静的PagesにサーバーAPIがあると考えない。API構想を実装する場合はホスティング境界の再設計が必要。

### 保存とプロンプトの注意
難易度とモードはUIから保存・読み込みされる。saveSession／loadLatestはあるが、現在のpage.tsxから会話セッションを保存する呼出しはない。利用者切替は認証ではなく、localStorageの名前空間分離である。

projectInstructionsは共通の一往復ルール、chatGptInstructionsは今回の場面・モード・難易度・終了方法を担当する。scriptedはスタッフ側の発話だけを順番に渡し、利用者の台詞を代読しない。variationは台本を渡さず、質問の言い方・順序・簡単な条件や数値のうち1種類だけを変え、予習外の話題を増やさない。Startを待ち、一度の短い発言・質問1つの後は実際の返答まで停止する。
realtimeInstructions／realtimeSpeechSpeedが残っていてもAPI接続の証拠ではない。

語彙の全項目は会話例に含める。enforceVocabularyInDialogueが小文字化した文字列の包含で検査し、漏れがあると例外を投げる。これは意味の自然さを評価する試験ではないため、語彙を埋め込むだけで不自然な会話にしない。

---

## 04 技術設計
更新日: 2026-09-07 / 版: 1.0

### 過去の目標アーキテクチャ【歴史資料・現行方針ではない】
iPhoneのUI → Realtime APIによるLive → 会話ログ → 通常GPT APIによる終了後分析 → ユーザー別保存 → 次巡に重点課題を渡す。
Firebase等は2人の履歴分離のための候補。Firebaseプロジェクト、認証方式、データベース、Rules、稼働環境は未確認。

### 保存する情報【会話復元】
利用者ID、現在のテーマと範囲、難易度、各巡のログ、言えなかった表現、日本語を使った箇所、パス、重大ミス、うまく使えた表現、次巡の重点課題、本人の次巡選択。
詳細な表現ファミリー・累積スコアは将来構想。音声そのものを保存するか、文字ログだけかは未決定。

### 実装境界の再開案（未実装）
- 永続APIキーはサーバー側の秘密情報として管理し、クライアント公開コードやDrive文書へ値を記載しない。
- サーバー側で利用者を確認してLive接続資格を発行する。利用できる方式は実装時の公式API仕様で再確認する。
- 分析の入出力を固定スキーマにし、強み/全改善点/重点課題/次回表現と根拠ログを対応させる。
- sessionIdで保存・再試行を区別し、分析失敗でも会話ログを保持する。
- ユーザー切替と認証を区別し、DBの読書き権限で分離を検証する。
以上はこのバックアップで整理した案。動作確認済みAPI手順・確定DBスキーマではない。

### 現存trip-talk【コード確認】
リポジトリ: https://github.com/silmotoki-tech/trip-talk
確認HEAD: 6a5a8c886693dff5cb84d9e2765518d0067d7061
Next.js 16系 / React 19系 / TypeScript、package-lock.jsonを収録。GitHub ActionsはNode 22とnpm ciでビルドする。静的export、GITHUB_ACTIONS=true時のbasePathは/trip-talk、出力はout。
主要ファイル:
- src/app/page.tsx: 利用者・場面・モード・難易度・予習・指示書コピー。
- src/lib/scenarios.ts: 2人/2テーマ/10場面、語彙と会話例、指示書生成。
- src/lib/storage.ts: english-mvp:<userId>:<suffix> のlocalStorage。
- src/lib/types.ts: Difficulty、Scene、Review、SessionRecord等。
- .github/workflows/deploy-pages.yml: main push時のPagesワークフロー。
保存関数が存在しても画面から呼ばれないsession保存は「利用履歴保存済み」としない。公開ワークフローの存在は実際の最新デプロイ成功の証拠ではない。

### 現存Tamoyan-English【コード確認】
リポジトリ: https://github.com/silmotoki-tech/Tamoyan-English
確認HEAD: 4688025361c079cb6ec37e5c754ae6e24732e76d
素のHTML/CSS/JavaScript、window.EST名前空間、Nodeのbuild.jsでindex.htmlへ結合。SPEC v3.20を収録。
IndexedDB est-db、設定のlocalStorageミラー、内蔵TTS、音量検知、台本/語彙/進捗/書く練習。Firebase・Realtime統合アプリと同一視しない。
台本原本はdata/topics/*.json。publish.jsがdata/scripts.jsonを生成。build.jsと台本配信は別系統。
src/js/07-backup.jsは全体または自分の進捗の書出しに対応。audioキャッシュは対象外。端末にしかない学習記録はGitに含まれない。

### API運用の確認範囲
現在のAPI残高・モデル・単価・稼働設定は未確認。過去の入金記録や工数の概算を現行の残高・費用・納期の保証として扱わない。
