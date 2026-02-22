# Data Pipeline

## 概要

`scripts/fetch-data.mjs` は、行方市オープンデータを取得して以下を生成します。

- 元 CSV スナップショット
- UTF-8 JSON 変換結果
- エビデンス（取得・整形の証跡）
- 一覧用サマリー

実行コマンド:

```bash
npm run data:refresh
```

## 入力

- データソース定義: `DATASET_SOURCES`（`scripts/fetch-data.mjs`）
- 取得元 URL:
  - 詳細ページ: `opendata.php?mode=detail&code=...`
  - CSV: `opendata_download.php?code=...`

## 処理ステップ

1. 出力ディレクトリ作成
2. 既存生成ファイル削除
3. 各データセットを順次取得
4. CSV 文字コード判定（Shift_JIS/UTF-8）
5. CSV パースと JSON 化
6. SHA-256 計算
7. `raw` / `processed` / `evidence` を保存
8. `datasets.json` と `evidence/index.json` を更新

## 出力

- `public/data/raw/{id}.csv`
- `src/data/processed/{id}.json`
- `src/data/evidence/{id}.evidence.json`
- `src/data/datasets.json`
- `src/data/evidence/index.json`

## 失敗時挙動

個別データ取得が失敗しても処理は継続し、次を保存します。

- `status: "unavailable"`
- エラーメッセージ
- 対象 URL と取得時刻

これにより、全件失敗でない限りサイト全体は更新可能です。

## 自動化

`/.github/workflows/refresh-data.yml` により以下を実行します。

- 週次スケジュール実行
- `npm run data:refresh`
- 生成差分の PR 自動作成（`chore/data-refresh`）

## 変更時の注意

- ヘッダー正規化ロジック変更時は既存 JSON 互換性を確認する
- 取得先 URL パターン変更時は `DATASET_SOURCES` を更新する
- 生成物のパスを変える場合は UI 側の参照箇所も同時更新する

