import { apiFetch } from './api';
import { getSessionToken } from './auth';
import { STATUS, normalizePlate } from './labels';
import { DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { buildQuery, emptyPageResult, normalizePageResult } from './pageUtils';

const PUBLIC_ORDER_KEY = 'gestao-oficina-public-order';

const ACTIVE = new Set([
  STATUS.OPEN,
  STATUS.IN_PROGRESS,
  STATUS.WAITING_PARTS,
  STATUS.READY,
]);

const STATUS_GROUP_MAP = {
  all: 'ALL',
  ALL: 'ALL',
  active: 'ACTIVE',
  ACTIVE: 'ACTIVE',
  history: 'HISTORY',
  HISTORY: 'HISTORY',
};

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

function mapVehicle(vehicle) {
  if (!vehicle) return null;
  return {
    id: vehicle.id,
    plate: vehicle.plate,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    active: vehicle.active,
    createdAt: vehicle.createdAt,
    orderCount: Number(vehicle.orderCount ?? 0),
    lastOrder:
      vehicle.lastOrderNumber || vehicle.lastOrderAt
        ? {
            number: vehicle.lastOrderNumber,
            updatedAt: vehicle.lastOrderAt,
          }
        : null,
  };
}

function normalizeStatusGroup(statusGroup) {
  if (statusGroup == null || statusGroup === '') return 'ALL';
  return STATUS_GROUP_MAP[statusGroup] || 'ALL';
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

/**
 * Lista paginada de OS do cliente autenticado.
 * @param {{ statusGroup?: string, vehicleId?: string|number|null, page?: number, pageSize?: number }} [opts]
 */
export async function getOrdersByCustomerId({
  statusGroup = 'ALL',
  vehicleId,
  page = 0,
  pageSize = DEFAULT_PAGE_SIZE,
} = {}) {
  const token = getSessionToken();
  if (!token) return emptyPageResult(pageSize);

  const qs = buildQuery({
    statusGroup: normalizeStatusGroup(statusGroup),
    vehicleId: vehicleId === 'all' || vehicleId == null || vehicleId === '' ? undefined : vehicleId,
    page,
    pageSize,
  });
  const data = await apiFetch(`/api/v1/web/me/orders${qs}`, { auth: true, token });
  const pageResult = normalizePageResult(data);
  return {
    ...pageResult,
    items: (pageResult.items || []).map(mapOrder).filter(Boolean),
  };
}

/** Lista paginada de veículos do cliente autenticado. */
export async function getVehiclesPage({ page = 0, pageSize = DEFAULT_PAGE_SIZE } = {}) {
  const token = getSessionToken();
  if (!token) return emptyPageResult(pageSize);

  const qs = buildQuery({ page, pageSize });
  const data = await apiFetch(`/api/v1/web/me/vehicles${qs}`, { auth: true, token });
  const pageResult = normalizePageResult(data);
  return {
    ...pageResult,
    items: (pageResult.items || []).map(mapVehicle).filter(Boolean),
  };
}

/** Contadores do portfólio do cliente autenticado. */
export async function getCustomerSummary() {
  const token = getSessionToken();
  if (!token) {
    return {
      vehicleCount: 0,
      activeOrderCount: 0,
      historyOrderCount: 0,
      totalOrderCount: 0,
    };
  }

  const data = await apiFetch('/api/v1/web/me/summary', { auth: true, token });
  return {
    vehicleCount: Number(data?.vehicleCount ?? 0),
    activeOrderCount: Number(data?.activeOrderCount ?? 0),
    historyOrderCount: Number(data?.historyOrderCount ?? 0),
    totalOrderCount: Number(data?.totalOrderCount ?? 0),
  };
}

export function splitActiveAndHistory(orders) {
  const list = Array.isArray(orders) ? orders : [];
  const active = list.filter((wo) => ACTIVE.has(wo.status));
  const history = list.filter((wo) => !ACTIVE.has(wo.status));
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
