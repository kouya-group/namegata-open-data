export const normalizeBasePath = (basePath: string): string => `${basePath.replace(/\/+$/, '')}/`;

export const buildBasePath = (basePath: string, relativePath = ''): string => {
  const normalizedBasePath = normalizeBasePath(basePath);
  const normalizedRelativePath = relativePath.replace(/^\/+/, '');

  return `${normalizedBasePath}${normalizedRelativePath}`;
};
