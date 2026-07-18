import { notifyToast } from '../components/ToastProvider';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export class ApiError extends Error {
  constructor(message, errors = [], status = 400) {
    super(message);
    this.name = 'ApiError';
    this.errors = errors;
    this.status = status;
  }
}

export function showApiError(error) {
  const message = error?.message || 'Erro na requisição';
  const errors = error?.errors || [];
  notifyToast({
    type: 'error',
    title: 'Atenção',
    message: errors.length ? undefined : message,
    errors: errors.length ? errors : undefined,
    duration: 6000,
  });
}

export function showSuccess(message, title = 'Sucesso') {
  notifyToast({
    type: 'success',
    title,
    message,
    duration: 4000,
  });
}

export async function apiRequest(path, options = {}, config = {}) {
  const { showError = true, token } = config;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    const networkError = new ApiError('Não foi possível conectar ao servidor.');
    if (showError) showApiError(networkError);
    throw networkError;
  }

  let body = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }

  if (!response.ok || body.success === false) {
    const apiError = new ApiError(
      body.message || 'Erro na requisição',
      body.errors || [],
      body.status || response.status,
    );
    if (showError) showApiError(apiError);
    throw apiError;
  }

  return body.data;
}
