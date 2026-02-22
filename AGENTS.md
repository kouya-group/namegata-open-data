# AGENTS.md

このファイルは、人間と AI エージェントが同じ品質基準で変更を行うための運用ガイドです。

## Scope

適用範囲はリポジトリ全体です。

## 原則

- 生成物の由来を追跡できる変更を行う
- データライセンス境界を壊さない
- `main` を常にデプロイ可能に保つ

## 変更時の必須チェック

- 実装変更後に `npm run build` を実行する
- データ取得処理変更時は `npm run data:refresh` を実行して生成物整合性を確認する
- 変更意図を PR 説明に明記する

## データ関連ルール

- `public/data/raw/**` は一次スナップショットとして扱う
- `src/data/processed/**` と `src/data/evidence/**` は `scripts/fetch-data.mjs` で生成する
- 取得失敗時の `status: unavailable` を削除しない
- ハッシュや取得時刻を手動で捏造しない

## UI / ルーティングルール

- `astro.config.mjs` の `base` は GitHub Pages 前提（`/namegata-open-data`）
- 内部リンクは `src/utils/base-path.ts` のヘルパーを優先利用する

## AI エージェント向け追加指針

- 事実確認なしに運用仕様を断定しない
- 未確認情報は「推定」と明記する
- 変更対象外ファイルを無断で整形しない
- 大きな変更は段階的に分け、レビューしやすくする

