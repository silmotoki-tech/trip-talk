# M1実装・設定・検証

更新: 2026-09-19

## 作業起点

指定ローカル `/Users/iridenmotoki/Cursor/silmotoki-tech/Tamoyan-app/TRIP TALK` のgit rootと一致。
main / origin=https://github.com/silmotoki-tech/trip-talk.git。
開始HEADは `6f7721025281dd7b95c37faab817b064c3e7b43c`。fetch後のorigin/mainとの差分0/0、未コミット変更なし。
`AGENTS.md`、`CLAUDE.md`、README、M0/M1仕様、script-design、decisionsとNext.js同梱の環境変数・静的export・Server/Client Components資料を確認。

## 実装

- ビルド時に `data/scripts/*.json` をLearningScriptとして検証・読み込み。正式教材は0件。
- フラット一覧、詳細、本文、日本語切替、重要表現。両利用者とも全台本を閲覧。
- 全文／質問練習。partnerを1つずつ提示し、直後のlearnerだけを回答例として任意表示。連続partnerなら「回答例なし」。最後で終了。履歴・周回は保存しない。
- 音読+1、最終音読日時、評価1〜4／nullを `progress/{userId}/scripts/{scriptId}` に保存。読込はサーバー確認後に表示し、未確定書込を保存完了扱いしない。
- Firestore transaction内で原子的incrementとserverTimestampを使用。評価変更は最終音読日時を維持。localStorageに進捗は保存しない。
- Anonymous Authを自動実行。未設定時・接続失敗時は状態を明示。保存は成功確認まで完了表示しない。
- 通常ロールプレイ／読み上げ指示書、コピー失敗時の手動コピー、ChatGPTリンク。読み上げは全文を順番どおり1回、同一Live内の「もう一回」による再読を初回指示書に含む。
- M2、音声API、Realtime、TTS、Liveログ、自動判定・自動進級は実装しない。

## Firebase: ユーザー側の設定

ローカルには実設定の.envファイルなし。GitHub Repository Variablesも照会時点では0件。Firebaseの実プロジェクトIDは未提供なので作成・推測していない。

1. 利用するFirebaseプロジェクトを選び、Webアプリを登録する。Firestoreのdefaultデータベースを作成する。
2. Authentication > Sign-in methodでAnonymousを有効化する。公開ホスト `silmotoki-tech.github.io` を必要な認証ドメイン設定へ登録する。開発で必要ならlocalhostも登録する。
3. プロジェクト設定のWebアプリの公開設定値を `.env.example` に示す次の4項目へ登録する。
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
4. ローカルでは `.env.local`、GitHubでは Settings > Secrets and variables > Actions > Variables のRepository variablesに同じ名前で設定する。Pagesのビルドはこの4変数を参照する。
5. 対象プロジェクトを確認したうえで `firebase deploy --only firestore:rules --project <実プロジェクトID>` でこのrepoのRulesを公開する。既存プロジェクトに他用途のRulesがある場合は上書き前に統合レビューが必要。今回Rulesの本番公開はしていない。
6. GitHub ActionsのDeploy Trip Talkを再実行する。公開設定値はビルド時埋込みなので、値変更後も必ず再ビルドする。
7. 承認済み教材追加後、実端末で音読+1、評価、リロード、利用者切替を確認する。

これらは公開クライアント設定であり秘密鍵ではない。Admin SDK、サービスアカウントJSON、秘密鍵、OpenAI APIキーは不要・保存禁止。

## 認証とRulesの範囲

未認証は拒否。利用者2名とMOTOKI/CHAMI形式の進捗パスだけを許可。getのみ読込可能、一覧クエリ・delete・その他パスは拒否。
4フィールドを必須かつ限定し、回数は整数0〜2147483647、評価は整数1〜4またはnull、日時はTimestamp/nullを検証。更新時刻はserverTimestampを要求。回数は1ずつ増やすか維持し、評価だけの変更では最終音読日時を変更しない。

**Anonymous Authとtamoyan/gonzaemonは強い本人認証で結び付いていない。認証済みの第三者も既知の進捗パスを読書き可能。** UI上の利用者分離は機密性の保証ではない。匿名UIDが変わっても固定利用者パスを使うため端末データ消去後に同じ進捗を参照できるが、重要情報を保存しない。
台本IDの形式を検証するだけで、Git教材の存在をRulesで照合しない。

App CheckはWeb向けプロバイダー登録・サイトキー・本番ドメインの確認が必要。設定が未提供のため今回未導入。後で導入する場合はメトリクス確認後に強制適用する。App Checkも本人認証の代替ではない。
参考: [Firebase公式フィールド検証](https://firebase.google.com/docs/firestore/security/rules-fields)、[トランザクション](https://firebase.google.com/docs/firestore/manage-data/transactions)。

## 検証

- `npm test`: スキーマ、質問と直後回答、全発話の指示書への包含、再読指示、進捗型・範囲。
- `npm run test:rules`: Firestore Emulatorで未認証拒否、パス・余分なフィールド・型・数値範囲・時刻・削除拒否、同時加算、評価1〜4/null、最終日時維持、利用者分離。
- Emulator実行例（Java 21+とFirebase CLIが必要）: `firebase emulators:exec --only firestore --project demo-trip-talk 'npm run test:rules'`。demoプロジェクトのみ。初期化はテスト専用ID `MOTOKI999999` の2利用者分だけ。
- `npm run test:ui`: ローカルChromeで320px/390px幅、空一覧、利用者切替、詳細、日本語、回答非表示→表示→次へ→終了、指示書、コピー、未設定時の保存無効、横はみ出しなし、pageerrorなしを確認。一時テストrouteは終了時削除。正式教材ディレクトリは変更しない。Chromeの実行パスは環境に合わせて調整する。
- `npm run lint` / `npm run build`: 両方成功。Firebaseの4値を空にし、GITHUB_ACTIONS=true（/trip-talk basePath）で静的export成功。公開routeは / と /_not-found のみ。
- 旧教材モデル・音声APIの参照がsrc/dataに復活していないこと、公開出力にfixtureがないことを検索確認済み（該当0件）。
- 依存監査で既存Next.js等の問題を検出し、互換範囲内の修正でNext.js 16.3.5へ更新。更新後npm auditは0件。

未検証: 実FirebaseプロジェクトでのAnonymous Auth、Rules本番適用、本番保存・再取得、iPhone実機Safari、外部ChatGPT Liveの実際の読み上げ。EmulatorとChromeの確認でこれらを代替済みとは扱わない。

## 失敗→原因→修正→再発防止

- UI生成失敗→一時Pythonスクリプトの日本語文字コード検出→UTF-8を明示→生成後のlint/buildで未生成ファイルを検出。
- UI確認で404→開発時はbasePathなし→ローカルURLを修正→Pages向けは別途GITHUB_ACTIONS=trueビルドで確認。
- 同時音読加算がRulesで拒否→読み取った回数の固定値書込と同時更新が競合→原子的incrementと変更項目だけのmergeへ変更→同時加算テストを保持。
- 再実行時にRulesテスト失敗→前回のEmulatorデータ残存→テスト専用2パスだけ初期化→本番・全消去を使わず再現可能にする。

- 一時UI route削除後に型検査失敗→Next devの生成型が削除済みrouteを参照→UIテスト終了時に生成型を除去→最終の静的ビルドで公開routeだけを再生成。
