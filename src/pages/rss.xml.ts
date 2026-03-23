import datasets from '../data/datasets.json';
import { buildBasePath } from '../utils/base-path';

const SITE = 'https://kouya-group.github.io';
const BASE = '/namegata-open-data';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(iso: string): string {
  try {
    return new Date(iso).toUTCString();
  } catch {
    return '';
  }
}

export function GET() {
  const sortedDatasets = [...datasets]
    .filter((d) => d.status === 'available')
    .sort((a, b) => (b.fetchedAt ?? '').localeCompare(a.fetchedAt ?? ''));

  const items = sortedDatasets
    .map((d) => {
      const link = `${SITE}${buildBasePath(BASE, `datasets/${d.id}/`)}`;
      const pubDate = d.fetchedAt ? `<pubDate>${toRfc822(d.fetchedAt)}</pubDate>` : '';

      return `    <item>
      <title>${escapeXml(d.title)}</title>
      <link>${escapeXml(link)}</link>
      <description>${escapeXml(d.description)}</description>
      <category>${escapeXml(d.category)}</category>
      <guid isPermaLink="false">${escapeXml(d.id)}</guid>
      ${pubDate}
    </item>`;
    })
    .join('\n');

  const lastBuildDate = sortedDatasets[0]?.fetchedAt
    ? toRfc822(sortedDatasets[0].fetchedAt)
    : '';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NAMEGATA OPEN DATA</title>
    <link>${SITE}${BASE}/</link>
    <description>行方市のオープンデータを、誰もが使える形に</description>
    <language>ja</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE}${BASE}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
