import datasets from '../../../data/datasets.json';

const processedModules = import.meta.glob('../../../data/processed/*.json', { eager: true });
const evidenceModules = import.meta.glob('../../../data/evidence/*.evidence.json', { eager: true });

const unwrapModule = <T,>(mod: unknown): T | null => {
  if (!mod) {
    return null;
  }

  if (typeof mod === 'object' && mod !== null && 'default' in mod) {
    return (mod as { default: T }).default;
  }

  return mod as T;
};

export function getStaticPaths() {
  return datasets.map(dataset => ({
    params: { id: dataset.id },
    props: { dataset },
  }));
}

export function GET({ props }: { props: { dataset: (typeof datasets)[number] } }) {
  const { dataset } = props;

  const processed = unwrapModule<unknown>(processedModules[`../../../data/processed/${dataset.id}.json`]);
  const evidence = unwrapModule<unknown>(
    evidenceModules[`../../../data/evidence/${dataset.id}.evidence.json`],
  );

  const body = {
    dataset,
    processed,
    evidence,
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  });
}

