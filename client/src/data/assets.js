// API uploads were copied into client/public/uploads for static deployment.
export function localAsset(path) {
  if (!path) return '';
  if (path.startsWith('/uploads/')) return path;
  return path;
}
