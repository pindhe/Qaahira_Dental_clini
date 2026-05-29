export async function fetchJson<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T | null; error: string | null }> {
  const res = await fetch(input, init);
  const contentType = res.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const text = await res.text();
    const isHtml = text.trimStart().startsWith("<!");
    return {
      ok: false,
      status: res.status,
      data: null,
      error: isHtml
        ? "Server API unavailable. Stop and restart with: npm run dev"
        : text.slice(0, 120) || `Request failed (${res.status})`,
    };
  }

  const data = (await res.json()) as T;
  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data
        ? String((data as { error: unknown }).error)
        : `Request failed (${res.status})`;
    return { ok: false, status: res.status, data, error: message };
  }

  return { ok: true, status: res.status, data, error: null };
}
