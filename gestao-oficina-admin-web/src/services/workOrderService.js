import { DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { apiRequest } from './apiClient';
import { buildQuery, fetchAllPages, normalizePageResult } from './pageUtils';

export function normalizeWorkOrderItem(item) {
  if (!item) return item;
  return {
    ...item,
    type: item.type ?? item.itemTypeCode,
    itemTypeCode: item.itemTypeCode ?? item.type,
  };
}

export function normalizeWorkOrderSummary(order) {
  if (!order) return order;
  return {
    ...order,
    status: order.status ?? order.statusCode,
    statusCode: order.statusCode ?? order.status,
    paymentStatus: order.paymentStatus ?? order.paymentStatusCode,
    paymentStatusCode: order.paymentStatusCode ?? order.paymentStatus,
    items: (order.items || []).map(normalizeWorkOrderItem),
  };
}

export async function fetchWorkOrderPanorama(token) {
  const data = await apiRequest('/api/v1/work-orders/panorama', { method: 'GET' }, { token });
  return Array.isArray(data) ? data : [];
}

export async function fetchWorkOrders(
  token,
  {
    status = '',
    paymentStatus = '',
    search = '',
    customerId,
    page = 0,
    pageSize = DEFAULT_PAGE_SIZE,
  } = {},
) {
  const data = await apiRequest(
    `/api/v1/work-orders${buildQuery({
      status,
      paymentStatus,
      search,
      customerId,
      page,
      pageSize,
    })}`,
    { method: 'GET' },
    { token },
  );
  const pageResult = normalizePageResult(data);
  return {
    ...pageResult,
    items: pageResult.items.map(normalizeWorkOrderSummary),
  };
}

export async function fetchAllWorkOrders(
  token,
  { status = '', paymentStatus = '', search = '', customerId, pageSize = DEFAULT_PAGE_SIZE } = {},
) {
  return fetchAllPages(
    (page, size) =>
      fetchWorkOrders(token, {
        status,
        paymentStatus,
        search,
        customerId,
        page,
        pageSize: size,
      }),
    { pageSize },
  );
}

export async function fetchWorkOrder(token, id) {
  const data = await apiRequest(`/api/v1/work-orders/${id}`, { method: 'GET' }, { token });
  return normalizeWorkOrderSummary(data);
}

export async function fetchWorkOrdersForAnalytics(token) {
  const summaries = await fetchAllWorkOrders(token, { pageSize: 100 });
  const withItems = await Promise.all(
    summaries.map(async (summary) => {
      if (summary.total != null && Number(summary.total) > 0) {
        try {
          return await fetchWorkOrder(token, summary.id);
        } catch {
          return summary;
        }
      }
      return summary;
    }),
  );
  return withItems;
}

export async function createWorkOrder(token, payload) {
  const data = await apiRequest(
    '/api/v1/work-orders',
    { method: 'POST', body: JSON.stringify(payload) },
    { token },
  );
  return normalizeWorkOrderSummary(data);
}

export async function updateWorkOrderStatus(token, id, statusCode, note) {
  const data = await apiRequest(
    `/api/v1/work-orders/${id}/status`,
    {
      method: 'PUT',
      body: JSON.stringify({ statusCode, note: note || undefined }),
    },
    { token },
  );
  return normalizeWorkOrderSummary(data);
}

export async function updateWorkOrderPayment(token, id, paymentStatusCode) {
  const data = await apiRequest(
    `/api/v1/work-orders/${id}/payment`,
    {
      method: 'PUT',
      body: JSON.stringify({ paymentStatusCode }),
    },
    { token },
  );
  return normalizeWorkOrderSummary(data);
}

export async function assignWorkOrderMechanic(token, id, mechanicId) {
  const data = await apiRequest(
    `/api/v1/work-orders/${id}/mechanic`,
    {
      method: 'PUT',
      body: JSON.stringify({ mechanicId: mechanicId || null }),
    },
    { token },
  );
  return normalizeWorkOrderSummary(data);
}

export async function addWorkOrderItem(token, workOrderId, payload) {
  const data = await apiRequest(
    `/api/v1/work-orders/${workOrderId}/items`,
    { method: 'POST', body: JSON.stringify(payload) },
    { token },
  );
  return normalizeWorkOrderItem(data);
}

export async function updateWorkOrderItem(token, itemId, payload) {
  return apiRequest(
    `/api/v1/work-orders/items/${itemId}`,
    { method: 'PUT', body: JSON.stringify(payload) },
    { token },
  );
}

export async function removeWorkOrderItem(token, itemId) {
  return apiRequest(
    `/api/v1/work-orders/items/${itemId}`,
    { method: 'DELETE' },
    { token },
  );
}
