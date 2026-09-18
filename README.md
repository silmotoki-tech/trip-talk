# Trip Talk

確定した台本で旅行英会話を予習し、外部のChatGPT Liveで実戦練習するiPhone向けWebアプリです。

## 現在地

M0では旧教材を外し、新しい教材構造と空状態の一覧画面を整備しています。実教材、個人進捗、台本詳細、質問だけで練習、読み上げ指示書はM1以降で実装します。

表示名は「タモやん」「ちゃみ」、互換性のため内部IDは `tamoyan` / `gonzaemon` を維持しています。教材は `data/scripts/` に1台本1JSONで保存し、`dialogue` と `expressions` を正本にします。

## 開発を引き継ぐAI・開発者へ

[引き継ぎREADME](docs/handover/README.md)と[M0/M1実装仕様書](docs/handover/m0-m1-implementation-spec.md)を最初に確認してください。

## ローカル起動

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。現行MVPにOpenAI APIキーは不要です。

## 確認コマンド

```bash
npm run lint
npm run build
```

GitHub Pages向けの静的exportを維持しています。秘密情報、会話ログ、個人の学習履歴を教材JSONへ保存しないでください。
