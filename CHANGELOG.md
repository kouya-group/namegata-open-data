# Changelog

変更履歴を新しい順に記載します。形式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に準拠します。

## [Unreleased]

### Security

- 依存パッケージの脆弱性修正（h3, rollup, svgo, devalue）
- `SECURITY.md` にセキュリティアーキテクチャのドキュメントを追加

### Documentation

- `README.md` に CI/CD バッジとセキュリティセクションを追加
- `docs/API_MCP.md` にリクエスト/レスポンス例を追加
- `CHANGELOG.md` を新規作成

## [0.0.1] - 2026-03-24

### Added

- Astro ベースの静的サイト構築
- 行方市オープンデータ 15 データセットの取得・変換パイプライン
- データセット一覧ページと詳細ページ
- 緯度経度データの Leaflet 地図可視化
- JSON API エンドポイント（一覧 / 個別詳細）
- エビデンス（取得元 URL、SHA-256、取得日時、変換記録）の自動生成
- GitHub Actions による自動デプロイ（`deploy.yml`）
- GitHub Actions による週次データ更新 PR 作成（`refresh-data.yml`）
- OSS 運用ドキュメント一式（CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, AGENTS, docs/）
