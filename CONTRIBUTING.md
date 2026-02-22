# Contributing Guide

このプロジェクトへの貢献を歓迎します。  
将来的な OSS 運用を前提に、変更の透明性と再現性を重視しています。

## 前提環境

- Node.js 20 以上
- npm 10 以上

## ローカル開発

```bash
npm ci
npm run dev
```

検証コマンド:

```bash
npm run build
```

## ブランチ運用

以下のプレフィックスを推奨します。

- `feature/...`: 新機能
- `fix/...`: バグ修正
- `docs/...`: ドキュメント更新
- `chore/...`: 雑務・メンテナンス

## コミットメッセージ

Conventional Commits 形式を推奨します。

- `feat: add dataset detail chart`
- `fix: handle missing lat/lon values`
- `docs: clarify data license boundary`
- `chore(data): refresh open data snapshots`

## PR 作成時のルール

- 変更理由を PR 本文で明示する
- UI 変更はスクリーンショットを添付する
- データ処理変更は、影響範囲（どの JSON / evidence が変わるか）を明記する
- 可能な限り小さい単位で PR を分ける

## データ更新変更の扱い

`npm run data:refresh` 実行で生成されるファイルは次のとおりです。

- `public/data/raw/**`
- `src/data/processed/**`
- `src/data/evidence/**`
- `src/data/datasets.json`

データ取得ロジックを変更した PR では、上記生成物の整合性確認を行ってください。

## レビュー観点

- 仕様意図がコードと PR 説明で一致しているか
- データライセンス境界が明確か
- 取得失敗時の挙動（`status: unavailable`）が維持されているか
- GitHub Pages の `base` パス（`/namegata-open-data`）前提を壊していないか

## Issue の使い分け

- バグ: 再現手順と期待値/実結果を記載
- 機能提案: 背景、利用者、非目標を明記
- ドキュメント: 現状の不足点と改善案を記載

## AI 支援での貢献

AI を使って変更する場合、`AGENTS.md` と `docs/AI_CONTRIBUTING.md` を参照してください。

## 行動規範

このリポジトリでは `CODE_OF_CONDUCT.md` を適用します。
