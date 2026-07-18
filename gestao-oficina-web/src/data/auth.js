import { TRACKING_DATA } from './mock';
import { normalizePhone } from './labels';

const SESSION_KEY = 'gestao-oficina-portal-session';

function publicCustomer(customer) {
  if (!customer) return null;
  const { password: _pw, ...safe } = customer;
  return safe;
}

export function login(loginId, password) {
  const id = String(loginId || '').trim().toLowerCase();
  const pw = String(password || '');
  if (!id || !pw) {
    return { ok: false, error: 'Informe e-mail (ou telefone) e senha.' };
  }

  const digits = normalizePhone(id);
  const customer = TRACKING_DATA.customers.find((c) => {
    const emailMatch = c.email.toLowerCase() === id;
    const phoneMatch =
      digits.length >= 8 &&
      (normalizePhone(c.phone) === digits ||
        normalizePhone(c.phone).endsWith(digits.slice(-8)));
    return emailMatch || phoneMatch;
  });

  if (!customer || customer.password !== pw) {
    return { ok: false, error: 'E-mail/telefone ou senha incorretos.' };
  }

  const session = { customerId: customer.id, at: new Date().toISOString() };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, customer: publicCustomer(customer) };
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getSessionCustomer() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    const customer = TRACKING_DATA.customers.find((c) => c.id === session.customerId);
    return publicCustomer(customer);
  } catch {
    return null;
  }
}
