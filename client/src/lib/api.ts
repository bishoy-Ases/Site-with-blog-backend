/**
 * API Base URL for Lambda + API Gateway
 * Development: http://localhost:3000 (local Express)
 * Production: API Gateway endpoint (set via VITE_API_BASE_URL env var)
 */
export function apiUrl(path: string): string {
  // In production (Lambda), use API Gateway endpoint from env
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined;
  
  if (base) {
    // Ensure exactly one slash between base and path
    const normalizedBase = base.replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
  }

  // Local development (Express server)
  if (import.meta.env.DEV) {
    return path;
  }

  // Fallback to relative path
  return path;
}

/**
 * Fetch with automatic token injection for JWT auth
 */
export async function fetchAPI(
  endpoint: string,
  options?: RequestInit
) {
  const url = apiUrl(endpoint);
  const token = localStorage.getItem("authToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  // Add JWT token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid, clear it
    localStorage.removeItem("authToken");
    window.location.href = "/admin"; // Redirect to login
  }

  return response;
}
