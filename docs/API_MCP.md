# API and MCP Plan

## 提供 API

このリポジトリは静的配信で利用できる JSON API を提供します。

### `GET /namegata-open-data/api/datasets.json`

データセット一覧を返します。

レスポンス例:

```json
{
  "generatedAt": "2026-03-24T12:00:00.000Z",
  "datasetCount": 15,
  "availableCount": 15,
  "unavailableCount": 0,
  "items": [
    {
      "id": "aed",
      "title": "AED設置箇所一覧",
      "titleEn": "AED Locations",
      "description": "行方市内のAED（自動体外式除細動器）設置場所をまとめたデータです。",
      "icon": "...",
      "category": "防災・安全",
      "categoryEn": "SAFETY",
      "updatedAt": "2020-06-25",
      "format": "CSV",
      "url": "https://www.city.namegata.ibaraki.jp/opendata_download.php?code=16",
      "sourcePageUrl": "https://www.city.namegata.ibaraki.jp/opendata.php?mode=detail&code=4",
      "status": "available",
      "rowCount": 42,
      "columnCount": 8,
      "fileSizeBytes": 3200,
      "fetchedAt": "2026-03-24T12:00:00.000Z",
      "license": "CC BY 2.1 JP",
      "sha256": "abcdef1234567890..."
    }
  ]
}
```

### `GET /namegata-open-data/api/datasets/{id}.json`

指定データセットの詳細（summary / processed / evidence）を返します。

`{id}` は `aed`, `care`, `medical`, `fire-water`, `shelters`, `population`, `childcare`, `wifi`, `tourism`, `toilets`, `public-facilities`, `open-data-catalog`, `cultural-properties`, `shops`, `schools` のいずれかです。

レスポンス例 (`/api/datasets/aed.json`):

```json
{
  "dataset": {
    "id": "aed",
    "title": "AED設置箇所一覧",
    "status": "available",
    "rowCount": 42
  },
  "processed": {
    "datasetId": "aed",
    "headers": ["施設名", "住所", "緯度", "経度", "..."],
    "rowCount": 42,
    "records": [
      { "施設名": "行方市役所", "住所": "..." }
    ]
  },
  "evidence": {
    "dataset_id": "aed",
    "source": {
      "url": "https://www.city.namegata.ibaraki.jp/opendata_download.php?code=16",
      "publisher": "行方市",
      "license": "CC BY 2.1 JP"
    },
    "acquisition": {
      "timestamp": "2026-03-24T12:00:00.000Z",
      "method": "HTTP GET (fetch)"
    },
    "integrity": {
      "sha256": "abcdef1234567890...",
      "file_size_bytes": 3200,
      "row_count": 42,
      "column_count": 8
    }
  }
}
```

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

