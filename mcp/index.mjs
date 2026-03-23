import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, '..', 'src', 'data');

async function readJson(filePath) {
  const content = await readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

const server = new Server(
  { name: 'namegata-open-data', version: '0.1.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'list_datasets',
      description:
        '行方市オープンデータのデータセット一覧を返します。オプションでカテゴリフィルタが可能です。',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description:
              'カテゴリ名でフィルタ（例: "SAFETY", "MEDICAL", "POPULATION"）。省略時は全件返却。',
          },
        },
      },
    },
    {
      name: 'get_dataset',
      description:
        '指定IDのデータセットの全レコード（ヘッダー、行データ）を返します。',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description:
              'データセットID（例: "aed", "shelters", "population"）',
          },
        },
        required: ['id'],
      },
    },
    {
      name: 'get_evidence',
      description:
        '指定IDのデータセットのエビデンス情報（取得元URL、SHA-256、取得日時、変換記録）を返します。',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description:
              'データセットID（例: "aed", "shelters", "population"）',
          },
        },
        required: ['id'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_datasets': {
        const datasets = await readJson(resolve(dataDir, 'datasets.json'));
        const filtered = args?.category
          ? datasets.filter(
              (d) =>
                d.categoryEn?.toLowerCase() === args.category.toLowerCase(),
            )
          : datasets;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  datasetCount: filtered.length,
                  datasets: filtered.map((d) => ({
                    id: d.id,
                    title: d.title,
                    titleEn: d.titleEn,
                    category: d.category,
                    categoryEn: d.categoryEn,
                    status: d.status,
                    rowCount: d.rowCount,
                    updatedAt: d.updatedAt,
                  })),
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case 'get_dataset': {
        if (!args?.id) {
          return {
            content: [{ type: 'text', text: 'Error: id is required' }],
            isError: true,
          };
        }

        const filePath = resolve(dataDir, 'processed', `${args.id}.json`);
        const data = await readJson(filePath);

        return {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        };
      }

      case 'get_evidence': {
        if (!args?.id) {
          return {
            content: [{ type: 'text', text: 'Error: id is required' }],
            isError: true,
          };
        }

        const filePath = resolve(
          dataDir,
          'evidence',
          `${args.id}.evidence.json`,
        );
        const evidence = await readJson(filePath);

        return {
          content: [
            { type: 'text', text: JSON.stringify(evidence, null, 2) },
          ],
        };
      }

      default:
        return {
          content: [
            { type: 'text', text: `Error: Unknown tool "${name}"` },
          ],
          isError: true,
        };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error: ${message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('MCP server failed to start:', error);
  process.exit(1);
});
