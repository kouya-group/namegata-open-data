# Namegata Open Data MCP Server

行方市オープンデータを AI エージェントから参照するための MCP (Model Context Protocol) サーバーです。

## セットアップ

```bash
cd mcp
npm install
```

## 起動

```bash
npm start
```

## Claude Desktop での設定

`claude_desktop_config.json` に以下を追加してください。

```json
{
  "mcpServers": {
    "namegata-open-data": {
      "command": "node",
      "args": ["/path/to/namegata-open-data/mcp/index.mjs"]
    }
  }
}
```

## 提供ツール

### list_datasets

データセット一覧を返します。

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| category | string | No | カテゴリでフィルタ（例: "SAFETY", "MEDICAL"） |

### get_dataset

指定IDのデータセット全レコードを返します。

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| id | string | Yes | データセットID（例: "aed", "shelters"） |

### get_evidence

指定IDのエビデンス情報を返します。

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| id | string | Yes | データセットID（例: "aed", "shelters"） |

## 利用可能なデータセットID

`aed`, `care`, `medical`, `fire-water`, `shelters`, `population`, `childcare`, `wifi`, `tourism`, `toilets`, `public-facilities`, `open-data-catalog`, `cultural-properties`, `shops`, `schools`
