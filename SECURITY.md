# Security Policy

## Supported Scope

原則として、`main` ブランチの最新状態をサポート対象とします。

## Security Architecture

### 依存パッケージ管理

- `npm audit` を定期的に実行し、既知の脆弱性を修正します
- `package-lock.json` をコミットし、再現可能なビルドを保証します
- Dependabot や手動の `npm audit fix` で脆弱性パッチを適用します

### データ取得の安全性

- 取得先 URL は `scripts/fetch-data.mjs` 内にハードコードされており、外部入力による SSRF リスクはありません
- 外部コマンド実行は `execFile`（シェル経由でない）を使用し、コマンドインジェクションを防止しています
- HTTP リクエストには 30 秒のタイムアウトを設定しています

### XSS 対策

- Astro テンプレートはデフォルトで出力をエスケープします
- 地図ポップアップ等で `innerHTML` を使用する箇所は、専用の `sanitizeHtml` 関数で `&`, `<`, `>` をエスケープしています
- ユーザー入力を受け付けるフォームは存在しません（静的サイト）

### GitHub Actions

- ワークフローの `permissions` は最小権限の原則に基づいて設定しています
  - `deploy.yml`: `contents: read`, `pages: write`, `id-token: write`
  - `refresh-data.yml`: `contents: write`, `pull-requests: write`
- データ更新は自動マージせず、PR 作成のみ行います（人間レビューを介在）
- サードパーティ Action はメジャーバージョンタグ（`@v4`, `@v7`）で固定しています

### シークレット管理

- `.gitignore` で `.env` / `.env.production` を除外しています
- 本プロジェクトは API キーやトークンを使用しません（公開データのみ取得）

### 静的サイト配信

- GitHub Pages による HTTPS 配信です
- Leaflet ライブラリは CDN ではなく `public/` に同梱し、サプライチェーンリスクを軽減しています

## Reporting a Vulnerability

公開前に修正すべき脆弱性を見つけた場合、公開 Issue は作成しないでください。
まず GitHub の private な報告手段（Security Advisory の `Report a vulnerability`）を利用してください。

もし private 報告が利用できない場合は、メンテナーに直接連絡し、再現手順と影響範囲を共有してください。

報告時に含めてほしい情報:

- 影響範囲（どの機能、どのデータ）
- 再現手順
- 想定される攻撃シナリオ
- 暫定回避策（あれば）

## Response Targets

- 初回応答: 72 時間以内を目標
- 影響評価: 7 日以内を目標
- 修正と公開: 影響度に応じて調整

## Disclosure

修正完了後、必要に応じて以下を公開します。

- 影響範囲
- 修正コミットまたはリリース情報
- 利用者側の対応手順

