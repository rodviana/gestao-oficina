import { DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { apiRequest } from './apiClient';
import { buildQuery, fetchAllPages, normalizePageResult } from './pageUtils';

export async function fetchServiceCatalog(
  token,
  { onlyActive = false, search = '', page = 0, pageSize = DEFAULT_PAGE_SIZE } = {},
) {
  const data = await apiRequest(
    `/api/v1/catalogs/services${buildQuery({
      onlyActive: onlyActive ? true : undefined,
      search,
      page,
      pageSize,
    })}`,
    { method: 'GET' },
    { token },
  );
  return normalizePageResult(data);
}

export async function fetchAllServiceCatalog(token, { onlyActive = false } = {}) {
  return fetchAllPages(
    (page, size) =>
      fetchServiceCatalog(token, { onlyActive, page, pageSize: size }),
    { pageSize: DEFAULT_PAGE_SIZE },
  );
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

export async function fetchPartCatalog(
  token,
  { onlyActive = false, search = '', page = 0, pageSize = DEFAULT_PAGE_SIZE } = {},
) {
  const data = await apiRequest(
    `/api/v1/catalogs/parts${buildQuery({
      onlyActive: onlyActive ? true : undefined,
      search,
      page,
      pageSize,
    })}`,
    { method: 'GET' },
    { token },
  );
  return normalizePageResult(data);
}

export async function fetchAllPartCatalog(token, { onlyActive = false } = {}) {
  return fetchAllPages(
    (page, size) => fetchPartCatalog(token, { onlyActive, page, pageSize: size }),
    { pageSize: DEFAULT_PAGE_SIZE },
  );
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
