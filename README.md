# Namegata Open Data Portal

行方市オープンデータを取得し、閲覧しやすい形で公開する Astro ベースの静的サイトです。

- 公開先: `https://kouya-group.github.io/namegata-open-data/`
- 配信方式: GitHub Pages
- データ件数: 15 datasets（`src/data/datasets.json` 参照）

## 目的

- 行方市オープンデータの再利用ハードルを下げる
- CSV と同時に JSON とエビデンス情報を提供する
- 将来的な OSS コントリビューションを受け入れられる運用基盤を整える

## 主な機能

- データセット一覧表示と詳細ページ
- 生 CSV / 市公式ページ / ローカルスナップショットへの導線
- 取得日時、SHA-256、変換内容を含むエビデンス表示
- 緯度経度カラムがあるデータの地図可視化
- JSON API エンドポイント（一覧 / dataset 詳細）
- GitHub Actions による定期データ更新 PR 作成

## 技術スタック

- Node.js 20
- Astro 5
- Leaflet 1.9（配布ファイルを `public/` 配下に同梱）

## セットアップ

```bash
npm ci
npm run dev
```

サンドボックス環境などで `localhost` バインド制約がある場合は以下を使用します。

```bash
npm run dev -- --host 127.0.0.1 --port 4310
```

## よく使うコマンド

- `npm run dev`: 開発サーバー起動
- `npm run build`: 本番ビルド
- `npm run preview`: ビルド成果物確認
- `npm run data:refresh`: 行方市サイトから CSV を再取得し、JSON とエビデンスを再生成

## データフロー

`npm run data:refresh` 実行時に以下を更新します。

| Path | 内容 |
| --- | --- |
| `public/data/raw/*.csv` | 元 CSV のスナップショット |
| `src/data/processed/*.json` | UTF-8 で整形した JSON |
| `src/data/evidence/*.evidence.json` | 取得元、取得方法、ハッシュ、変換記録 |
| `src/data/datasets.json` | 一覧表示用のサマリー |
| `src/data/evidence/index.json` | エビデンス全体のインデックス |

詳細は `docs/DATA_PIPELINE.md` を参照してください。

## API

配信環境（GitHub Pages）:

- `GET /namegata-open-data/api/datasets.json`
- `GET /namegata-open-data/api/datasets/{id}.json`

ローカル開発:

- `GET /api/datasets.json`
- `GET /api/datasets/{id}.json`

## CI / CD

- `deploy.yml`
  - `main` への push でビルドし GitHub Pages へデプロイ
- `refresh-data.yml`
  - 毎週 `0 21 * * 0`（UTC、JST では月曜 06:00）にデータ更新ジョブを実行
  - 更新差分を `chore/data-refresh` ブランチの PR として自動作成

## ディレクトリ構成

```text
.
├── .github/workflows/        # deploy / data refresh automation
├── public/
│   ├── data/raw/             # raw CSV snapshots
│   ├── leaflet.css
│   └── leaflet.js
├── scripts/
│   └── fetch-data.mjs        # data acquisition and transformation
├── src/
│   ├── components/           # UI components
│   ├── data/
│   │   ├── processed/        # generated JSON per dataset
│   │   ├── evidence/         # generated evidence JSON
│   │   └── datasets.json     # generated dataset summary
│   ├── pages/                # Astro routes
│   └── utils/
└── docs/                     # operation and OSS docs
```

## ライセンス

- ソースコード: `MIT`（`LICENSE`）
- 行方市由来データ: `CC BY 2.1 JP`

このリポジトリのコードライセンス（MIT）と、配布データのライセンス（CC BY 2.1 JP）は別です。  
データ再利用時は、行方市オープンデータ由来である旨の出典明記を行ってください。

推奨表記例:

```text
出典: 行方市オープンデータ（CC BY 2.1 JP）
```

## OSS ドキュメント

- コントリビューション: `CONTRIBUTING.md`
- 行動規範: `CODE_OF_CONDUCT.md`
- セキュリティ報告: `SECURITY.md`
- AI 協業ルール: `AGENTS.md` / `docs/AI_CONTRIBUTING.md`
- API / MCP 方針: `docs/API_MCP.md`
- 技術運用ドキュメント一覧: `docs/README.md`
