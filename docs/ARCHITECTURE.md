# Architecture

## 概要

このプロジェクトは、行方市オープンデータの CSV を定期取得し、静的サイトとして配信する構成です。

- フロントエンド: Astro
- 可視化: Leaflet（地図）
- 配信: GitHub Pages
- データ更新: Node.js スクリプト + GitHub Actions

## 主要ルート

- `src/pages/index.astro`
  - データセット一覧、利用ガイド、市情報などのトップページ
- `src/pages/datasets/[id].astro`
  - 各データセットの詳細ページ（表、エビデンス、地図、統計）
- `src/pages/api/datasets.json.ts`
  - 一覧 API（件数と datasets 配列）
- `src/pages/api/datasets/[id].json.ts`
  - dataset 単位 API（summary / processed / evidence）

## データ配置

- `public/data/raw/*.csv`
  - 元データのスナップショット（配信対象）
- `src/data/processed/*.json`
  - 表示・分析向け JSON
- `src/data/evidence/*.evidence.json`
  - 取得・変換の証跡
- `src/data/datasets.json`
  - 一覧表示用メタデータ

## パス設計

GitHub Pages 配信のため、`astro.config.mjs` で以下を固定しています。

- `site: https://kouya-group.github.io`
- `base: /namegata-open-data`

リンク生成は `src/utils/base-path.ts` のヘルパーを通して行い、`base` 変更時の影響を局所化しています。

## コンポーネント責務

- `DatasetGrid` / `DatasetCard`
  - 一覧とカード UI
- `UsageGuide`
  - ライセンス・データ形式・免責の表示
- `CityInfo` / `Hero` / `StatsBar`
  - イントロダクションと補助情報

## 非機能要件

- 追跡可能性
  - evidence JSON に取得方法、日時、ハッシュを保存
- 障害許容
  - 取得失敗データを `unavailable` として残し、全体処理を継続
- 再現性
  - `npm run data:refresh` で生成物を再作成可能
