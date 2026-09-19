# 承認済み台本の追加

正式教材はまだ0件です。M1は教材を自動生成しません。
ユーザー承認後に `MOTOKI0.json` / `CHAMI0.json` のように1台本1ファイルで追加し、再ビルドします。

- スキーマ正本: `docs/handover/m0-m1-implementation-spec.md` 第5章。
- `src/lib/load-scripts.ts` がビルド時にこのフォルダのJSONを読み、スキーマとファイル名＝IDを検証します。
- MOTOKIは `targetUserId: "tamoyan"`、CHAMIは `"gonzaemon"`。両者とも全教材を閲覧できます。
- 不正なデータはビルドエラーにします。IDを保持すれば本文修正で進捗を消しません。
- `tests/fixtures/sample.json` は検証専用。ここへコピーせず、正式教材として扱わないでください。
- 横断表現DBの生成はM2。M1では触りません。
