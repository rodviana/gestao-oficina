const SESSION_KEY = 'gestao-oficina-portal-session';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export async function login(loginId, password) {
  const id = String(loginId || '').trim();
  const pw = String(password || '');
  if (!id || !pw) {
    return { ok: false, error: 'Informe e-mail (ou telefone) e senha.' };
  }

  let response;
  let body = {};
  try {
    response = await fetch(`${API_URL}/api/v1/web/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: id, password: pw }),
    });
    body = await response.json().catch(() => ({}));
  } catch {
    return { ok: false, error: 'Não foi possível conectar ao servidor.' };
  }

  if (!response.ok || body.success === false) {
    return { ok: false, error: body.message || 'E-mail/telefone ou senha incorretos.' };
  }

  const data = body.data || {};
  const customer = {
    // Orders/vehicles still come from mock data keyed by 'c-<n>'; the seed
    // order matches the mock customers, so we bridge the id here for now.
    id: `c-${data.customerId}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
  };

  const session = { token: data.token, customer, at: new Date().toISOString() };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, customer };
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getSessionCustomer() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session.customer || null;
  } catch {
    return null;
  }
}

export function getSessionToken() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw).token || null;
  } catch {
    return null;
  }
}
