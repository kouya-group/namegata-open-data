# OSS Checklist

## 必須

以下は、公開 OSS として最低限揃えるべき項目です。

- `README.md`
  - プロジェクト概要、セットアップ、主要コマンド、ライセンス境界
- `LICENSE`
  - コード配布条件
- `CONTRIBUTING.md`
  - Issue / PR / レビュー運用
- `CODE_OF_CONDUCT.md`
  - コミュニティ行動規範
- `SECURITY.md`
  - 脆弱性報告ルートと対応ポリシー

## 強く推奨

- Issue / PR テンプレート
- ドキュメント索引（`docs/README.md`）
- アーキテクチャ説明（`docs/ARCHITECTURE.md`）
- データパイプライン説明（`docs/DATA_PIPELINE.md`）
- 運用ランブック（`docs/OPERATIONS.md`）
- ガバナンス定義（`docs/GOVERNANCE.md`）
- API 利用仕様（`docs/API_MCP.md`）
- AI コントリビューション規約（`docs/AI_CONTRIBUTING.md`）

## このリポジトリで重要な追加観点

- データライセンス境界の明示
  - コードは MIT
  - 元データは行方市オープンデータ（CC BY 2.1 JP）
- 自動生成データの追跡可能性
  - `source URL`、`timestamp`、`sha256` を evidence として保持
- 失敗時の明示
  - 取得失敗時も `status: unavailable` とエラー情報を残す
