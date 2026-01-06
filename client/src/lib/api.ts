export function apiUrl(path: string): string {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!base) return path;

  // Ensure exactly one slash between base and path
  const normalizedBase = base.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}
