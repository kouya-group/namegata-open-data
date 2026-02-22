# API and MCP Plan

## 提供 API

このリポジトリは静的配信で利用できる JSON API を提供します。

- `GET /namegata-open-data/api/datasets.json`
  - データセット一覧、件数、生成時刻
- `GET /namegata-open-data/api/datasets/{id}.json`
  - 指定データセットの summary / processed / evidence

ローカル開発時は `base` が `/` になるため、以下で確認します。

- `/api/datasets.json`
- `/api/datasets/{id}.json`

## MCP 対応方針

MCP サーバーは、上記 API を情報源として以下のツールを提供する設計とします。

- `list_datasets`
  - 一覧を返す
- `get_dataset`
  - dataset `id` 指定で詳細を返す
- `get_evidence`
  - dataset `id` 指定で取得元・ハッシュ・取得日時を返す

## 最小実装仕様

- Transport: stdio
- Tool input: JSON Schema で `id` を定義
- Tool output: API レスポンスをそのまま JSON で返却

## 運用上の注意

- MCP サーバーはデータ更新を直接実行しない
- 更新は既存の `npm run data:refresh` と GitHub Actions に集約する
- MCP は参照専用に限定し、責務を分離する

