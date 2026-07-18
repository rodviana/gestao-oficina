const API_URL = import.meta.env.VITE_API_URL ?? '';

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Parses the server envelope and returns `data` or `dataList`. */
export function unwrapEnvelope(body) {
  if (body == null || typeof body !== 'object') {
    return null;
  }
  if (body.dataList !== undefined && body.dataList !== null) {
    return body.dataList;
  }
  if (body.data !== undefined) {
    return body.data;
  }
  return null;
}

/**
 * @param {string} path
 * @param {{ method?: string, body?: unknown, token?: string | null, auth?: boolean, headers?: Record<string, string> }} [options]
 */
export async function apiFetch(path, options = {}) {
  const { method = 'GET', body, token, auth = false, headers: extraHeaders = {} } = options;

  const headers = { ...extraHeaders };
  if (body !== undefined && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor.');
  }

  const envelope = await response.json().catch(() => ({}));

  if (!response.ok || envelope.success === false) {
    throw new ApiError(
      envelope.message || 'Erro na requisição.',
      envelope.status || response.status,
    );
  }

  return unwrapEnvelope(envelope);
}
