import { apiRequest } from './apiClient';

export async function login(email, password) {
  return apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchHome(token) {
  return apiRequest('/api/v1/home', { method: 'GET' }, { token, showError: false });
}

export async function fetchAdminPanel(token) {
  return apiRequest('/api/v1/admin/panel', { method: 'GET' }, { token, showError: false });
}

export async function createUser(token, payload) {
  return apiRequest('/api/v1/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, { token });
}

export async function fetchUserList(token, filters = {}) {
  return apiRequest('/api/v1/admin/users/list', {
    method: 'POST',
    body: JSON.stringify(filters),
  }, { token, showError: false });
}

export async function fetchMechanics(token) {
  const data = await fetchUserList(token, {
    role: 'MECHANIC',
    activeFilter: 'ACTIVE',
    page: 0,
    pageSize: 100,
  });
  return data?.items ?? [];
}
