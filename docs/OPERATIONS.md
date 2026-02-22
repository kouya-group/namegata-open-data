# Operations Runbook

## 定常運用

### 1. 開発確認

```bash
npm ci
npm run build
```

### 2. データ更新

```bash
npm run data:refresh
npm run build
```

更新後は、生成物の差分を確認してください。

- `public/data/raw/**`
- `src/data/processed/**`
- `src/data/evidence/**`
- `src/data/datasets.json`

### 3. デプロイ

`main` へマージ後、`deploy.yml` が GitHub Pages へ自動デプロイします。

## 障害時対応

### ケースA: データ更新ジョブ失敗

- `refresh-data.yml` のログを確認
- 行方市側の一時障害か、CSV 仕様変更かを切り分ける
- 一時障害なら再実行
- 仕様変更なら `scripts/fetch-data.mjs` を修正して PR 作成

### ケースB: 取得は成功するが画面表示が崩れる

- `src/data/processed/*.json` のヘッダー差分を確認
- `src/pages/datasets/[id].astro` の列参照ロジックを確認
- 可能であればヘッダー同義語判定を追加

### ケースC: GitHub Pages でリンク切れ

- `astro.config.mjs` の `base` と `site` を確認
- `buildBasePath` 経由でリンクが生成されているか確認

### ケースD: 一部データのみ unavailable

- evidence の `error` 内容を確認
- URL やレスポンスコードを再確認
- 他データに影響がなければ継続運用可能

## 運用メトリクス

最低限、以下を定点観測します。

- `availableCount / datasetCount`
- 週次更新 PR の作成成功率
- デプロイ失敗率
