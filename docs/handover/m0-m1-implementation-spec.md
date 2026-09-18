# Trip Talk — M0/M1 実装仕様書

更新日：2026-09-19

## 0. この仕様書の位置づけ

この文書は、M0（旧教材除去・新しい器の整備）とM1（新台本スキーマ・個人進捗の土台）の実装仕様を確定する。

現行方針の優先順位は次のとおり。

1. 最新の `docs/handover/decisions.md`
2. 本仕様書
3. `script-design.md`
4. `roadmap.md`
5. 過去資料

Trip Talk と Tamoyan-English を混同しない。対象リポジトリは必ず `silmotoki-tech/trip-talk`。

---

## 1. 全体アーキテクチャ

### 利用環境

- iPhone専用
- タモヤンポータルから通常のページ遷移でTrip Talkを開く
- iframe埋め込みは前提にしない
- Next.js / React / TypeScript / GitHub Pages の静的Webアプリを維持する

### 役割分担

- **GitHub**：確定台本、教材メタデータ、将来の横断表現DBの正本
- **Firestore**：個人進捗の正本
- **localStorage**：消えても困らないUI設定だけ
- **ChatGPT専用プロジェクト**：台本作成会議、台本設計、確定
- **外部ChatGPT Live**：ロールプレイ実戦、台本読み上げ

Trip Talk自身にRealtime API、音声API、ブラウザTTSを実装しない。

---

## 2. ユーザー

内部IDは互換性のため次を維持する。

```ts
type UserId = "tamoyan" | "gonzaemon";
```

表示名：

- `tamoyan` → タモやん
- `gonzaemon` → ちゃみ

教材は双方が閲覧・練習できる。
ただし「誰向けに設計した台本か」は台本IDと `targetUserId` に残す。

---

## 3. 台本ID

- タモやん向け：`MOTOKI0`, `MOTOKI1`, ...
- ちゃみ向け：`CHAMI0`, `CHAMI1`, ...

台本IDは作成後に原則変更しない。
他方のユーザーも自由に練習できる。

---

## 4. 教材ファイル構造

M0完了後の方向性：

```text
data/
  scripts/
    MOTOKI0.json
    MOTOKI1.json
    CHAMI0.json
    ...
  generated/
    expression-db.json
```

M0時点では旧教材をMOTOKI0へ流用しない。新しい台本は空の構造から開始する。

`expression-db.json` は派生データであり、手編集を正本にしない。

---

## 5. 台本スキーマ

M1で次を正本スキーマとする。

```ts
type DialogueRole = "partner" | "learner";

type ExpressionFunction =
  | "question"
  | "answer"
  | "request"
  | "reaction"
  | "clarification"
  | "confirmation"
  | "repair"
  | "other";

type ExpressionLearningStatus = "new" | "reused";

interface DialogueTurn {
  role: DialogueRole;
  english: string;
  japanese: string;
}

interface ScriptExpression {
  english: string;
  japanese: string;
  functions: ExpressionFunction[];
  learningStatus: ExpressionLearningStatus;
}

interface LearningScript {
  id: string;
  targetUserId: UserId;

  scene: string;
  situation: string;
  summary: string;
  goal: string;

  dialogue: DialogueTurn[];
  expressions: ScriptExpression[];
}
```

### 設計原則

- **1台本 = 1学習単位**
- `dialogue` を会話本文の正本とする
- 旧 `story / preview / reactions / vocabulary` を別々の正本として持たない
- 重要表現は `expressions` に集約する
- 質問・リアクション・聞き返し等は `functions` で分類する
- 既習表現か新規表現かは `learningStatus` で台本単位に明示する
- 日本語訳は予習UIのため保持する
- 読み上げ用プロンプトやロールプレイ用プロンプトそのものは台本JSONに保存せず、共通テンプレートから動的生成する

不要なメタデータ、スコア、Liveログ、細かな弱点タグはMVPに追加しない。

---

## 6. 個人進捗スキーマ

Firestoreへ保存する最小単位：

```ts
interface ScriptProgress {
  readAloudCount: number;
  lastReadAt: Timestamp | null;
  selfRating: 1 | 2 | 3 | 4 | null;
  updatedAt: Timestamp;
}
```

論理パス：

```text
progress/{userId}/scripts/{scriptId}
```

例：

```text
progress/tamoyan/scripts/MOTOKI0
progress/gonzaemon/scripts/MOTOKI0
```

同じ台本でも進捗はユーザー別。

### 進捗ルール

- 音読1回ごとに手動 `+1`
- `+1` 時に `lastReadAt` を更新
- `selfRating` は本人がいつでも1〜4で変更可能
- 未評価は `null`
- 台本本文を後から修正しても進捗はリセットしない
- 高評価でも台本を一覧から消さない
- Live視聴回数、読み上げ再生回数は保存しない
- Liveの失敗ログ、会話全文、細かな弱点履歴はMVPでは保存しない

---

## 7. Firebase Authentication / Security

### MVP方針

- Firebase Anonymous Authenticationを自動で行い、画面上にログイン操作を要求しない
- Firestoreは未認証アクセスを拒否する
- 書き込み可能なパスを進捗データだけに限定する
- 書き込みフィールド、型、数値範囲をSecurity Rulesで検証する
- 台本・教材はFirestoreに置かない
- 可能ならApp Checkも導入対象とする

### セキュリティ上の限界

Anonymous Authだけでは、`tamoyan` と `gonzaemon` を強い本人認証で隔離できない。
したがってMVPでは「非公開の重要情報を守る認証」ではなく、**公開書き込みを避け、低機密な学習進捗だけを保存するための軽量保護**として扱う。

より強い保護が必要になった場合は、後から固定アカウント認証へ移行する。

この制約を隠して「完全に安全」とは扱わない。

---

## 8. localStorage

localStorageに残してよいもの：

- 最後に選択したユーザー
- UI表示設定
- 一時的な難易度等、消えても学習履歴を失わないもの

localStorageに正本として置かないもの：

- 音読回数
- 最終音読日時
- 4段階自己評価

---

## 9. 台本作成フロー

「台本作成」「次の台本」等では、完成台本を即生成しない。

```text
最新GitHub教材確認
→ 現在地確認
→ 台本作成会議
→ 学習設計整理
→ 台本作成
→ 品質チェック
→ ユーザー承認
→ GitHubへ確定台本保存
→ 横断表現DB再生成（M2以降）
```

MOTOKI0もこの手順で新規作成する。旧教材は流用しない。

---

## 10. ChatGPT Live — 通常ロールプレイ

- 外部ChatGPT Liveを使用
- Trip Talkは指示書を生成するだけ
- API連携しない
- Liveの詳細ログをTrip Talkへ取り込まない
- Liveでうまく出なかった表現があっても、自動で次台本へ送らない
- 同じ台本を反復するか次へ進むかは本人が決める

---

## 11. ChatGPT Live — 読み上げモード

各台本から読み上げ指示書を生成できる。

指示書の必須要件：

- 質問→答えの台本を記載順に最初から最後まで読む
- 内容を変更・要約・省略・追加しない
- ユーザーの返答を待たない
- 会話を広げない
- 1回読み切ったら停止する
- 同じLive会話内でユーザーが「もう一回」と言ったら、同じ台本を同じルールで最初から最後まで再読する

反復時にTrip Talkへ戻って指示書を再生成しない。

---

## 12. 質問だけで練習モード

M1から実装する。

目的は、全文を見ながら読む練習とは別に、相手の発話だけを見て自分の返答を思い出して言う retrieval practice を行うこと。

### 基本動作

- `dialogue` から `partner` 発話を順番に表示する
- 1画面に原則1つの相手発話だけを表示する
- ユーザーは画面を見て、自分の返答を声に出す
- **「次へ」** で次の `partner` 発話へ進む
- **「答えを見る」** で、その `partner` 発話の直後にある `learner` 発話を回答例として表示する
- 回答例を見ても進捗や評価を自動変更しない
- 最後まで進んだら終了表示にする
- この練習の周回数や正誤履歴はMVPでは保存しない

### UI

台本詳細画面には最低限、次の2つの学習導線を用意する。

- **全文を見る**
- **質問だけで練習**

このモード用の新しい教材DBは作らず、既存の `dialogue` をそのまま利用する。

---

## 13. 台本一覧UI

基本はフラット一覧。

各カードに最低限表示：

- 台本ID
- 場面ラベル（scene / situation）
- 短いsummary
- 現在ユーザーの音読回数
- 最終音読日時
- 4段階自己評価

例：

```text
MOTOKI7
ホテル ＞ 受付
アーリーチェックインできるか尋ねる

音読 64回
最終 2026/09/18
評価 3/4
```

深いフォルダー階層をUIの中心にしない。

---

## 14. M0 実装内容

### 削除 / 廃止

- 既存ホテル・空港教材
- 既存 `story`
- 既存 `preview`
- 既存 `reactions`
- 既存 `vocabulary`
- 旧教材前提のUI文言
- 旧SessionRecord / transcript / review等、現行MVPで使わない履歴モデル
- Realtime API内蔵を前提にするコード経路

### 維持

- Next.js / React / TypeScript
- GitHub Pages静的export
- iPhone向けUI基盤
- 利用者切替
- ChatGPTを開く導線
- localStorageの軽量設定保存

### 新設

- 新 `LearningScript` 型
- 空の新教材データ構造
- 新教材が0件でも壊れない一覧画面
- タモやん / ちゃみ表示
- 台本一覧の基本カード

### M0完了条件

- 旧教材が画面に表示されない
- 旧教材データを新教材として参照しない
- 新スキーマで教材を追加できる
- 新教材0件でも正常表示
- lint成功
- build成功

---

## 15. M1 実装内容

- 台本JSON読み込み
- 台本一覧表示
- 台本詳細表示
- dialogue表示
- 日本語表示切替
- expressions表示
- 「全文を見る」モード
- 「質問だけで練習」モード
- 「答えを見る」
- 「次へ」
- 音読 `+1`
- Firestoreから進捗読み込み
- Firestoreへ進捗保存
- 4段階自己評価
- 最終音読日時表示
- ロールプレイ指示書生成
- 読み上げ指示書生成
- ChatGPTへの導線
- Firebase Auth初期化
- Firestore Security Rules
- 必要ならApp Check導入可否確認

### M1ではやらない

- MOTOKI0の教材内容を自動生成
- Live API統合
- 音声再生
- Liveログ保存
- AIによる習得判定
- 横断表現DB生成（M2）
- 自動で次教材へ進む機能

---

## 16. 実装時の安全確認

実装前：

1. ローカルrepoが `silmotoki-tech/trip-talk` であること
2. `main` と `origin/main` の差分確認
3. 未コミット変更確認
4. `AGENTS.md` / `CLAUDE.md` 確認
5. Next.js 16で変更箇所に関係する同梱docs確認

実装後：

1. `npm run lint`
2. `npm run build`
3. 旧教材文字列が残っていないか検索
4. iPhone幅で主要画面確認
5. Firestore Rulesの未認証拒否・型検証確認
6. Git diff確認
7. commit / push
8. SHA記録
