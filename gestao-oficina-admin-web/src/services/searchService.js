import { apiRequest } from './apiClient';
import { buildQuery } from './pageUtils';

/**
 * Normaliza resultados da API para o formato usado na busca rápida da pista.
 */
export function normalizeQuickSearchResults(results = []) {
  const customerMap = new Map();
  const vehicles = [];

  for (const row of results) {
    if (row.resultType === 'CUSTOMER') {
      customerMap.set(row.id, {
        id: row.id,
        name: row.label,
        phone: row.subtitle,
        vehicles: [],
      });
    }
  }

  for (const row of results) {
    if (row.resultType !== 'VEHICLE') continue;

    const subtitleParts = String(row.subtitle || '').split(' — ');
    const vehicleMeta = subtitleParts[0] || '';
    const [brand = '', ...modelParts] = vehicleMeta.split(' ');
    const model = modelParts.join(' ');

    const vehicle = {
      id: row.id,
      plate: row.label,
      customerId: row.customerId,
      brand,
      model,
    };
    vehicles.push(vehicle);

    if (!customerMap.has(row.customerId)) {
      customerMap.set(row.customerId, {
        id: row.customerId,
        name: subtitleParts[1] || 'Cliente',
        phone: '',
        vehicles: [],
      });
    }
    customerMap.get(row.customerId).vehicles.push(vehicle);
  }

  return {
    customers: [...customerMap.values()],
    vehicles,
  };
}

export async function quickSearch(token, query) {
  const data = await apiRequest(
    `/api/v1/search${buildQuery({ q: query })}`,
    { method: 'GET' },
    { token },
  );
  return normalizeQuickSearchResults(Array.isArray(data) ? data : []);
}
