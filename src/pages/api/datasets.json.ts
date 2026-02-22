import datasets from '../../data/datasets.json';
import evidenceIndex from '../../data/evidence/index.json';

export function GET() {
  const body = {
    generatedAt: evidenceIndex.generatedAt,
    datasetCount: datasets.length,
    availableCount: datasets.filter(dataset => dataset.status === 'available').length,
    unavailableCount: datasets.filter(dataset => dataset.status !== 'available').length,
    items: datasets,
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  });
}

