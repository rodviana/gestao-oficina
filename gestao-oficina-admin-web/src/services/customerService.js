import { DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { apiRequest } from './apiClient';
import { buildQuery, normalizePageResult } from './pageUtils';

export async function fetchCustomers(
  token,
  { search = '', page = 0, pageSize = DEFAULT_PAGE_SIZE } = {},
) {
  const data = await apiRequest(
    `/api/v1/customers${buildQuery({ search, page, pageSize })}`,
    { method: 'GET' },
    { token },
  );
  return normalizePageResult(data);
}

export async function fetchCustomer(token, id) {
  return apiRequest(`/api/v1/customers/${id}`, { method: 'GET' }, { token });
}

export async function fetchCustomersByPhone(token, phone) {
  const data = await apiRequest(
    `/api/v1/customers/by-phone${buildQuery({ phone })}`,
    { method: 'GET' },
    { token },
  );
  return Array.isArray(data) ? data : [];
}

export async function createCustomer(token, payload) {
  return apiRequest(
    '/api/v1/customers',
    { method: 'POST', body: JSON.stringify(payload) },
    { token },
  );
}

export async function updateCustomer(token, id, payload) {
  return apiRequest(
    `/api/v1/customers/${id}`,
    { method: 'PUT', body: JSON.stringify(payload) },
    { token },
  );
}
