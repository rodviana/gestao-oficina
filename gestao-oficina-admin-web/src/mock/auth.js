import { MOCK_USERS } from './seed';

export function mockLogin(email, password) {
  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === String(email).trim().toLowerCase() && u.password === password,
  );
  if (!user) {
    const error = new Error('E-mail ou senha inválidos.');
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }
  return {
    token: `mock-token-${user.id}`,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export const MOCK_LOGIN_PRESETS = [
  { label: 'Administrador', email: 'admin@oficina.com', password: 'admin123' },
  { label: 'Atendente', email: 'atendente@oficina.com', password: 'attn123' },
  { label: 'Mecânico', email: 'mecanico@oficina.com', password: 'mech123' },
];
