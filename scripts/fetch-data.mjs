import { createHash } from 'node:crypto';
import { execFile as execFileCallback } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const BASE_URL = 'https://www.city.namegata.ibaraki.jp';
const LICENSE = 'CC BY 2.1 JP';
const AGENT = 'namegata-open-data/fetch-data v0.1.0';
const execFile = promisify(execFileCallback);

const DATASET_SOURCES = [
  {
    id: 'aed',
    title: 'AED設置箇所一覧',
    titleEn: 'AED Locations',
    description: '行方市内のAED（自動体外式除細動器）設置場所をまとめたデータです。',
    icon: '🫀',
    category: '防災・安全',
    categoryEn: 'SAFETY',
    updatedAt: '2020-06-25',
    detailCode: 4,
    csvCode: 16,
  },
  {
    id: 'care',
    title: '介護サービス事業所一覧',
    titleEn: 'Care Service Facilities',
    description: '介護サービス事業所の所在地や基本情報の一覧です。',
    icon: '🏥',
    category: '福祉',
    categoryEn: 'WELFARE',
    updatedAt: '2020-06-25',
    detailCode: 5,
    csvCode: 19,
  },
  {
    id: 'medical',
    title: '医療機関一覧',
    titleEn: 'Medical Facilities',
    description: '病院・診療所など医療機関の一覧です。',
    icon: '⚕️',
    category: '医療',
    categoryEn: 'MEDICAL',
    updatedAt: '2020-06-25',
    detailCode: 6,
    csvCode: 30,
  },
  {
    id: 'fire-water',
    title: '消防水利施設一覧',
    titleEn: 'Fire Water Facilities',
    description: '消防活動に使う水利施設の位置・種別を確認できます。',
    icon: '🚒',
    category: '防災・安全',
    categoryEn: 'SAFETY',
    updatedAt: '2020-06-25',
    detailCode: 7,
    csvCode: 21,
  },
  {
    id: 'shelters',
    title: '指定緊急避難場所一覧',
    titleEn: 'Emergency Shelters',
    description: '災害時の指定緊急避難場所をまとめたデータです。',
    icon: '🛟',
    category: '防災・安全',
    categoryEn: 'SAFETY',
    updatedAt: '2020-06-25',
    detailCode: 8,
    csvCode: 24,
  },
  {
    id: 'population',
    title: '地域・年齢別人口',
    titleEn: 'Population by Area and Age',
    description: '地域別・年齢別の人口構成を確認できます。',
    icon: '👥',
    category: '人口',
    categoryEn: 'POPULATION',
    updatedAt: '2021-03-02',
    detailCode: 9,
    csvCode: 26,
  },
  {
    id: 'childcare',
    title: '子育て施設一覧',
    titleEn: 'Childcare Facilities',
    description: '保育所・幼稚園など子育て関連施設の一覧です。',
    icon: '🧒',
    category: '子育て',
    categoryEn: 'CHILDCARE',
    updatedAt: '2020-06-25',
    detailCode: 10,
    csvCode: 28,
  },
  {
    id: 'wifi',
    title: '公衆無線LANアクセスポイント一覧',
    titleEn: 'Public Wi-Fi Access Points',
    description: '市内の公衆無線LANアクセスポイントの一覧です。',
    icon: '📶',
    category: 'ICT',
    categoryEn: 'ICT',
    updatedAt: '2021-02-26',
    detailCode: 12,
    csvCode: 32,
  },
  {
    id: 'tourism',
    title: '観光施設一覧',
    titleEn: 'Tourism Facilities',
    description: '観光施設の所在地や基本情報をまとめた一覧です。',
    icon: '🗺️',
    category: '観光',
    categoryEn: 'TOURISM',
    updatedAt: '2020-06-25',
    detailCode: 13,
    csvCode: 34,
  },
  {
    id: 'toilets',
    title: '公衆トイレ一覧',
    titleEn: 'Public Toilets',
    description: '市内公衆トイレの設置場所一覧です。',
    icon: '🚻',
    category: '生活',
    categoryEn: 'LIVING',
    updatedAt: '2020-06-25',
    detailCode: 14,
    csvCode: 36,
  },
  {
    id: 'public-facilities',
    title: '公共施設一覧',
    titleEn: 'Public Facilities',
    description: '市が管理する主な公共施設の一覧です。',
    icon: '🏛️',
    category: '行政',
    categoryEn: 'GOVERNMENT',
    updatedAt: '2020-06-25',
    detailCode: 15,
    csvCode: 51,
  },
  {
    id: 'open-data-catalog',
    title: 'オープンデータ一覧（メタ）',
    titleEn: 'Open Data Catalog',
    description: '公開中オープンデータのメタ情報一覧です。',
    icon: '🧾',
    category: 'メタデータ',
    categoryEn: 'METADATA',
    updatedAt: '2021-03-02',
    detailCode: 16,
    csvCode: 53,
  },
  {
    id: 'cultural-properties',
    title: '文化財一覧',
    titleEn: 'Cultural Properties',
    description: '市内の文化財情報（種別・所在地など）の一覧です。',
    icon: '🏺',
    category: '文化',
    categoryEn: 'CULTURE',
    updatedAt: '2020-06-25',
    detailCode: 17,
    csvCode: 42,
  },
  {
    id: 'shops',
    title: 'お店一覧',
    titleEn: 'Local Shops',
    description: '行方市内の店舗情報一覧です。',
    icon: '🏪',
    category: '商業',
    categoryEn: 'COMMERCE',
    updatedAt: '2020-07-03',
    detailCode: 18,
    csvCode: 55,
  },
  {
    id: 'schools',
    title: '行方市立幼稚園・小中学校（園児・児童生徒数）一覧',
    titleEn: 'Schools and Student Count',
    description: '行方市立幼稚園・小中学校の園児・児童生徒数一覧です。',
    icon: '🏫',
    category: '教育',
    categoryEn: 'EDUCATION',
    updatedAt: '2023-05-18',
    detailCode: 21,
    csvCode: 60,
  },
];

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rawDir = path.join(rootDir, 'public', 'data', 'raw');
const processedDir = path.join(rootDir, 'src', 'data', 'processed');
const publicProcessedDir = path.join(rootDir, 'public', 'data', 'processed');
const evidenceDir = path.join(rootDir, 'src', 'data', 'evidence');
const datasetsFile = path.join(rootDir, 'src', 'data', 'datasets.json');
const evidenceIndexFile = path.join(evidenceDir, 'index.json');

async function ensureDirectories() {
  await Promise.all([
    fs.mkdir(rawDir, { recursive: true }),
    fs.mkdir(processedDir, { recursive: true }),
    fs.mkdir(evidenceDir, { recursive: true }),
    fs.mkdir(publicProcessedDir, { recursive: true }),
  ]);
}

async function clearDirectoryFiles(directoryPath) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  await Promise.all(
    entries
      .filter(entry => entry.isFile())
      .map(entry => fs.unlink(path.join(directoryPath, entry.name))),
  );
}

async function writeJson(filePath, payload) {
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function parseContentDisposition(value) {
  if (!value) {
    return null;
  }

  const utf8Match = value.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match) {
    return decodeURIComponent(utf8Match[1]);
  }

  const basicMatch = value.match(/filename="?([^";]+)"?/i);
  return basicMatch ? basicMatch[1] : null;
}

function decodeCsv(bytes) {
  const candidates = [
    { encoding: 'shift_jis', fatal: true },
    { encoding: 'utf-8', fatal: true },
    { encoding: 'utf-8', fatal: false },
  ];

  for (const candidate of candidates) {
    try {
      const decoder = new TextDecoder(candidate.encoding, { fatal: candidate.fatal });
      return { text: decoder.decode(bytes), encoding: candidate.encoding };
    } catch {
      // try next encoding
    }
  }

  return { text: bytes.toString('utf8'), encoding: 'utf-8' };
}

function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === ',') {
      row.push(value);
      value = '';
      continue;
    }

    if (!inQuotes && (char === '\n' || char === '\r')) {
      if (char === '\r' && text[i + 1] === '\n') {
        i += 1;
      }
      row.push(value);
      value = '';
      rows.push(row);
      row = [];
      continue;
    }

    value += char;
  }

  row.push(value);
  rows.push(row);

  while (rows.length > 0 && rows[rows.length - 1].every(cell => cell.trim() === '')) {
    rows.pop();
  }

  if (rows.length > 0 && rows[0].length > 0) {
    rows[0][0] = rows[0][0].replace(/^\uFEFF/, '');
  }

  return rows;
}

function normalizeHeaders(headers) {
  const seen = new Map();

  return headers.map((header, index) => {
    const base = (header?.trim() || `column_${index + 1}`).replace(/\s+/g, '_');
    const current = seen.get(base) || 0;
    seen.set(base, current + 1);

    if (current === 0) {
      return base;
    }

    return `${base}_${current + 1}`;
  });
}

function rowsToRecords(headers, rows) {
  const headerKeys = normalizeHeaders(headers);

  return rows.map(values => {
    const record = {};
    headerKeys.forEach((headerKey, index) => {
      record[headerKey] = values[index] ?? '';
    });
    return record;
  });
}

function buildUrls(detailCode, csvCode) {
  return {
    sourcePageUrl: `${BASE_URL}/opendata.php?mode=detail&code=${detailCode}`,
    sourceUrl: `${BASE_URL}/opendata_download.php?code=${csvCode}`,
  };
}

function parseRawHeaders(rawHeaders) {
  const blocks = rawHeaders.trim().split(/\r?\n\r?\n/);
  const finalBlock = blocks.at(-1) || '';
  const map = new Map();

  for (const line of finalBlock.split(/\r?\n/)) {
    const index = line.indexOf(':');
    if (index <= 0) {
      continue;
    }
    const key = line.slice(0, index).trim().toLowerCase();
    const value = line.slice(index + 1).trim();
    map.set(key, value);
  }

  return map;
}

async function fetchBinaryViaNativeFetch(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': AGENT },
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const headers = new Map();
  response.headers.forEach((value, key) => {
    headers.set(key.toLowerCase(), value);
  });

  return {
    bytes: Buffer.from(await response.arrayBuffer()),
    headers,
    acquisitionMethod: 'HTTP GET (fetch)',
  };
}

async function fetchBinaryViaCurl(url) {
  const bodyResult = await execFile(
    'curl',
    ['-sS', '-L', '--fail', '--max-time', '30', '--user-agent', AGENT, url],
    {
      encoding: 'buffer',
      maxBuffer: 20 * 1024 * 1024,
    },
  );

  let headers = new Map();
  try {
    const headResult = await execFile(
      'curl',
      ['-sS', '-I', '-L', '--max-time', '30', '--user-agent', AGENT, url],
      {
        encoding: 'utf8',
        maxBuffer: 1024 * 1024,
      },
    );
    headers = parseRawHeaders(headResult.stdout);
  } catch {
    // continue without header metadata
  }

  return {
    bytes: Buffer.from(bodyResult.stdout),
    headers,
    acquisitionMethod: 'HTTP GET (curl fallback)',
  };
}

async function fetchBinary(url) {
  try {
    return await fetchBinaryViaNativeFetch(url);
  } catch (nativeError) {
    try {
      return await fetchBinaryViaCurl(url);
    } catch (curlError) {
      const nativeMessage = nativeError instanceof Error ? nativeError.message : String(nativeError);
      const curlMessage = curlError instanceof Error ? curlError.message : String(curlError);
      throw new Error(`native-fetch: ${nativeMessage}; curl-fallback: ${curlMessage}`);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchDataset(source) {
  const { sourcePageUrl, sourceUrl } = buildUrls(source.detailCode, source.csvCode);
  const acquiredAt = new Date().toISOString();

  const download = await fetchBinary(sourceUrl);
  const { bytes, headers: responseHeaders, acquisitionMethod } = download;
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const filename = parseContentDisposition(responseHeaders.get('content-disposition'));
  const { text, encoding } = decodeCsv(bytes);

  const rows = parseCsvRows(text);
  const headers = rows[0] || [];
  const bodyRows = rows.slice(1).filter(row => row.some(value => value.trim() !== ''));
  const records = rowsToRecords(headers, bodyRows);

  const rowCount = records.length;
  const columnCount = headers.length;

  await fs.writeFile(path.join(rawDir, `${source.id}.csv`), bytes);

  await writeJson(path.join(processedDir, `${source.id}.json`), {
    datasetId: source.id,
    title: source.title,
    acquiredAt,
    sourceUrl,
    sourcePageUrl,
    encoding,
    headers,
    rowCount,
    columnCount,
    records,
  });

  await writeJson(path.join(publicProcessedDir, `${source.id}.json`), {
    datasetId: source.id,
    title: source.title,
    acquiredAt,
    sourceUrl,
    sourcePageUrl,
    encoding,
    headers,
    rowCount,
    columnCount,
    records,
  });

  const evidence = {
    dataset_id: source.id,
    title: source.title,
    source: {
      url: sourceUrl,
      detail_page_url: sourcePageUrl,
      publisher: '行方市',
      license: LICENSE,
      original_filename: filename,
    },
    acquisition: {
      timestamp: acquiredAt,
      method: acquisitionMethod,
      agent: AGENT,
    },
    integrity: {
      sha256,
      file_size_bytes: bytes.length,
      row_count: rowCount,
      column_count: columnCount,
    },
    transformation: {
      description: 'CSV (Shift_JIS/UTF-8) を UTF-8 で読み込み、JSONへ変換。',
      columns_added: [],
      columns_removed: [],
      rows_filtered: 0,
    },
    artifacts: {
      raw_csv_path: `public/data/raw/${source.id}.csv`,
      processed_json_path: `src/data/processed/${source.id}.json`,
    },
  };

  await writeJson(path.join(evidenceDir, `${source.id}.evidence.json`), evidence);

  const datasetSummary = {
    id: source.id,
    title: source.title,
    titleEn: source.titleEn,
    description: source.description,
    icon: source.icon,
    category: source.category,
    categoryEn: source.categoryEn,
    updatedAt: source.updatedAt,
    format: 'CSV',
    url: sourceUrl,
    sourcePageUrl,
    status: 'available',
    rowCount,
    columnCount,
    fileSizeBytes: bytes.length,
    fetchedAt: acquiredAt,
    license: LICENSE,
    sha256,
  };

  return {
    datasetSummary,
    evidence,
  };
}

async function main() {
  await ensureDirectories();
  await Promise.all([
    clearDirectoryFiles(rawDir),
    clearDirectoryFiles(processedDir),
    clearDirectoryFiles(evidenceDir),
    clearDirectoryFiles(publicProcessedDir),
  ]);

  const datasetSummaries = [];
  const evidenceItems = [];

  for (const source of DATASET_SOURCES) {
    const label = `${source.id} (code:${source.csvCode})`;

    try {
      const { datasetSummary, evidence } = await fetchDataset(source);
      datasetSummaries.push(datasetSummary);
      evidenceItems.push(evidence);
      console.log(`OK  ${label}`);
    } catch (error) {
      const { sourcePageUrl, sourceUrl } = buildUrls(source.detailCode, source.csvCode);
      const acquiredAt = new Date().toISOString();
      const errorMessage = error instanceof Error ? error.message : String(error);

      const failedSummary = {
        id: source.id,
        title: source.title,
        titleEn: source.titleEn,
        description: source.description,
        icon: source.icon,
        category: source.category,
        categoryEn: source.categoryEn,
        updatedAt: source.updatedAt,
        format: 'CSV',
        url: sourceUrl,
        sourcePageUrl,
        status: 'unavailable',
        fetchedAt: acquiredAt,
        license: LICENSE,
        error: errorMessage,
      };

      const failedEvidence = {
        dataset_id: source.id,
        title: source.title,
        source: {
          url: sourceUrl,
          detail_page_url: sourcePageUrl,
          publisher: '行方市',
          license: LICENSE,
        },
        acquisition: {
          timestamp: acquiredAt,
          method: 'HTTP GET',
          agent: AGENT,
        },
        error: errorMessage,
      };

      datasetSummaries.push(failedSummary);
      evidenceItems.push(failedEvidence);
      await writeJson(path.join(evidenceDir, `${source.id}.evidence.json`), failedEvidence);
      console.warn(`NG  ${label}: ${errorMessage}`);
    }

    await sleep(300);
  }

  const generatedAt = new Date().toISOString();

  await writeJson(datasetsFile, datasetSummaries);
  await writeJson(evidenceIndexFile, {
    generatedAt,
    agent: AGENT,
    license: LICENSE,
    datasetCount: datasetSummaries.length,
    availableCount: datasetSummaries.filter(dataset => dataset.status === 'available').length,
    unavailableCount: datasetSummaries.filter(dataset => dataset.status !== 'available').length,
    datasets: evidenceItems,
  });

  console.log(`\nGenerated ${datasetSummaries.length} datasets (${datasetSummaries.filter(dataset => dataset.status === 'available').length} available).`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
