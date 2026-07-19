import { DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { apiRequest } from './apiClient';
import { buildQuery, fetchAllPages, normalizePageResult } from './pageUtils';
import { normalizeWorkOrderSummary } from './workOrderService';

export async function fetchVehicles(
  token,
  { search = '', page = 0, pageSize = DEFAULT_PAGE_SIZE } = {},
) {
  const data = await apiRequest(
    `/api/v1/vehicles${buildQuery({ search, page, pageSize })}`,
    { method: 'GET' },
    { token },
  );
  return normalizePageResult(data);
}

export async function fetchVehicle(token, id) {
  return apiRequest(`/api/v1/vehicles/${id}`, { method: 'GET' }, { token });
}

export async function fetchVehicleByPlate(token, plate) {
  return apiRequest(
    `/api/v1/vehicles/by-plate${buildQuery({ plate })}`,
    { method: 'GET' },
    { token },
  );
}

export async function fetchVehiclesByCustomer(
  token,
  customerId,
  { page = 0, pageSize = DEFAULT_PAGE_SIZE } = {},
) {
  const data = await apiRequest(
    `/api/v1/vehicles/by-customer/${customerId}${buildQuery({ page, pageSize })}`,
    { method: 'GET' },
    { token },
  );
  return normalizePageResult(data);
}

export async function fetchAllVehiclesByCustomer(token, customerId) {
  return fetchAllPages(
    (page, size) => fetchVehiclesByCustomer(token, customerId, { page, pageSize: size }),
    { pageSize: DEFAULT_PAGE_SIZE },
  );
}

export async function fetchVehicleHistory(
  token,
  vehicleId,
  { page = 0, pageSize = DEFAULT_PAGE_SIZE } = {},
) {
  const data = await apiRequest(
    `/api/v1/vehicles/${vehicleId}/history${buildQuery({ page, pageSize })}`,
    { method: 'GET' },
    { token },
  );
  const pageResult = normalizePageResult(data);
  return {
    ...pageResult,
    items: pageResult.items.map(normalizeWorkOrderSummary),
  };
}

export async function createVehicle(token, payload) {
  return apiRequest(
    '/api/v1/vehicles',
    { method: 'POST', body: JSON.stringify(payload) },
    { token },
  );
}

export async function updateVehicle(token, id, payload) {
  return apiRequest(
    `/api/v1/vehicles/${id}`,
    { method: 'PUT', body: JSON.stringify(payload) },
    { token },
  );
}
