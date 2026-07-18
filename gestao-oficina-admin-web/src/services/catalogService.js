import { apiRequest } from './apiClient';
import { buildQuery } from './pageUtils';

export async function fetchServiceCatalog(token, { onlyActive = false } = {}) {
  const data = await apiRequest(
    `/api/v1/catalogs/services${buildQuery({ onlyActive: onlyActive ? true : undefined })}`,
    { method: 'GET' },
    { token },
  );
  return Array.isArray(data) ? data : [];
}

export async function createServiceCatalogItem(token, payload) {
  return apiRequest(
    '/api/v1/catalogs/services',
    { method: 'POST', body: JSON.stringify(payload) },
    { token },
  );
}

export async function updateServiceCatalogItem(token, id, payload) {
  return apiRequest(
    `/api/v1/catalogs/services/${id}`,
    { method: 'PUT', body: JSON.stringify(payload) },
    { token },
  );
}

export async function fetchPartCatalog(token, { onlyActive = false } = {}) {
  const data = await apiRequest(
    `/api/v1/catalogs/parts${buildQuery({ onlyActive: onlyActive ? true : undefined })}`,
    { method: 'GET' },
    { token },
  );
  return Array.isArray(data) ? data : [];
}

export async function createPartCatalogItem(token, payload) {
  return apiRequest(
    '/api/v1/catalogs/parts',
    { method: 'POST', body: JSON.stringify(payload) },
    { token },
  );
}

export async function updatePartCatalogItem(token, id, payload) {
  return apiRequest(
    `/api/v1/catalogs/parts/${id}`,
    { method: 'PUT', body: JSON.stringify(payload) },
    { token },
  );
}
