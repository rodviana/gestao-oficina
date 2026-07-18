import { apiFetch } from './api';
import { getSessionToken } from './auth';
import { STATUS, normalizePlate } from './labels';

const PUBLIC_ORDER_KEY = 'gestao-oficina-public-order';

const ACTIVE = new Set([
  STATUS.OPEN,
  STATUS.IN_PROGRESS,
  STATUS.WAITING_PARTS,
  STATUS.READY,
]);

function mapItem(item) {
  return {
    id: item.id,
    type: item.type,
    typeLabel: item.typeLabel,
    description: item.description,
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitPrice),
    lineTotal: item.lineTotal != null ? Number(item.lineTotal) : undefined,
  };
}

function mapTimelineEntry(entry) {
  return {
    id: entry.id,
    status: entry.status,
    statusLabel: entry.statusLabel,
    note: entry.note,
    at: entry.at,
  };
}

/** Maps WorkOrderSummaryDto / WorkOrderDetailDto to the UI order shape. */
export function mapOrder(dto) {
  if (!dto) return null;

  const vehicle =
    dto.vehicleId != null || dto.vehiclePlate
      ? {
          id: dto.vehicleId,
          plate: dto.vehiclePlate,
          brand: dto.vehicleBrand,
          model: dto.vehicleModel,
          year: dto.vehicleYear,
        }
      : null;

  const customer =
    dto.customerId != null || dto.customerName
      ? {
          id: dto.customerId,
          name: dto.customerName,
        }
      : null;

  return {
    id: dto.id,
    number: dto.number,
    customerId: dto.customerId,
    vehicleId: dto.vehicleId,
    description: dto.description,
    status: dto.status,
    statusLabel: dto.statusLabel,
    paymentStatus: dto.paymentStatus,
    paymentStatusLabel: dto.paymentStatusLabel,
    total: dto.total != null ? Number(dto.total) : undefined,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    customer,
    vehicle,
    items: (dto.items || []).map(mapItem),
    timeline: (dto.timeline || []).map(mapTimelineEntry),
  };
}

function cachePublicOrder(order) {
  if (!order?.id) return;
  sessionStorage.setItem(`${PUBLIC_ORDER_KEY}-${order.id}`, JSON.stringify(order));
}

function readCachedPublicOrder(id) {
  try {
    const raw = sessionStorage.getItem(`${PUBLIC_ORDER_KEY}-${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function findByNumberAndPlate(number, plate) {
  const n = String(number || '').trim();
  const p = normalizePlate(plate);
  if (!n || !p) return null;

  const params = new URLSearchParams({ number: n, plate: p });
  const dto = await apiFetch(`/api/v1/web/tracking?${params.toString()}`);
  const order = mapOrder(dto);
  if (order) cachePublicOrder(order);
  return order;
}

/** Public phone lookup is not available on the API — returns empty. */
export async function findByPhone() {
  return [];
}

export async function getOrderById(id, { token = getSessionToken() } = {}) {
  const orderId = String(id || '').trim();
  if (!orderId) return null;

  if (token) {
    const dto = await apiFetch(`/api/v1/web/me/orders/${orderId}`, { auth: true, token });
    return mapOrder(dto);
  }

  return readCachedPublicOrder(orderId);
}

export async function getOrdersByCustomerId() {
  const token = getSessionToken();
  if (!token) return [];

  const list = await apiFetch('/api/v1/web/me/orders', { auth: true, token });
  return (list || [])
    .map(mapOrder)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

export async function getVehiclesByCustomerId(orders = null) {
  const token = getSessionToken();
  if (!token) return [];

  const list = await apiFetch('/api/v1/web/me/vehicles', { auth: true, token });
  const orderList = orders || (await getOrdersByCustomerId());

  return (list || []).map((vehicle) => {
    const vehicleOrders = orderList.filter((wo) => wo.vehicleId === vehicle.id);
    return {
      ...vehicle,
      orderCount: vehicleOrders.length,
      lastOrder: vehicleOrders[0] || null,
    };
  });
}

export function splitActiveAndHistory(orders) {
  const active = orders.filter((wo) => ACTIVE.has(wo.status));
  const history = orders.filter((wo) => !ACTIVE.has(wo.status));
  return { active, history };
}

export function customerOwnsOrder(customerId, orderId, order) {
  if (order?.customerId != null && customerId != null) {
    return String(order.customerId) === String(customerId);
  }
  // Sem customerId no payload (ex.: tracking público, que omite o dado),
  // confiamos no servidor: /me/orders/{id} já retorna 403 se a OS não for do cliente.
  return true;
}
