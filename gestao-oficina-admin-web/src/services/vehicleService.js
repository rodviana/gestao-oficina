import { apiRequest } from './apiClient';
import { buildQuery, normalizePageResult } from './pageUtils';
import { normalizeWorkOrderSummary } from './workOrderService';

export async function fetchVehicles(token, { search = '', page = 0, pageSize = 50 } = {}) {
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

export async function fetchVehiclesByCustomer(token, customerId) {
  const data = await apiRequest(
    `/api/v1/vehicles/by-customer/${customerId}`,
    { method: 'GET' },
    { token },
  );
  return Array.isArray(data) ? data : [];
}

export async function fetchVehicleHistory(token, vehicleId) {
  const data = await apiRequest(
    `/api/v1/vehicles/${vehicleId}/history`,
    { method: 'GET' },
    { token },
  );
  return (Array.isArray(data) ? data : []).map(normalizeWorkOrderSummary);
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
