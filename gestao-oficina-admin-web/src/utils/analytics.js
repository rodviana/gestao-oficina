import {
  ItemType,
  PaymentStatus,
  PaymentStatusLabel,
  WorkOrderStatus,
  WorkOrderStatusLabel,
  formatMoney,
} from '../constants/labels';
import { workOrderTotal } from './workOrderUtils';

const ACTIVE = new Set([
  WorkOrderStatus.OPEN,
  WorkOrderStatus.IN_PROGRESS,
  WorkOrderStatus.WAITING_PARTS,
  WorkOrderStatus.READY,
]);

const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function monthKey(iso) {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key) {
  const [y, m] = key.split('-');
  return `${MONTHS_PT[Number(m) - 1]}/${String(y).slice(2)}`;
}

function orderStatus(order) {
  return order.status ?? order.statusCode;
}

function orderPaymentStatus(order) {
  return order.paymentStatus ?? order.paymentStatusCode;
}

function itemType(item) {
  return item.type ?? item.itemTypeCode;
}

/**
 * Agrega métricas a partir de arrays carregados da API.
 */
export function buildWorkshopAnalytics({ orders = [], customers = [], vehicles = [], partsCatalog = [] } = {}) {
  const activeParts = partsCatalog.filter((p) => p.active !== false);
  const activeOrders = orders.filter((wo) => ACTIVE.has(orderStatus(wo)));
  const delivered = orders.filter((wo) => orderStatus(wo) === WorkOrderStatus.DELIVERED);
  const paid = orders.filter((wo) => orderPaymentStatus(wo) === PaymentStatus.PAID);
  const waitingPayment = orders.filter(
    (wo) => orderPaymentStatus(wo) === PaymentStatus.WAITING_PAYMENT,
  );

  const revenuePaid = paid.reduce((s, wo) => s + workOrderTotal(wo), 0);
  const revenueOpen = orders
    .filter(
      (wo) =>
        orderPaymentStatus(wo) !== PaymentStatus.PAID &&
        orderStatus(wo) !== WorkOrderStatus.CANCELLED,
    )
    .reduce((s, wo) => s + workOrderTotal(wo), 0);
  const ticketMedio = paid.length > 0 ? revenuePaid / paid.length : 0;

  const statusBreakdown = Object.values(WorkOrderStatus)
    .filter((s) => s !== WorkOrderStatus.CANCELLED && s !== WorkOrderStatus.DELIVERED)
    .map((code) => ({
      code,
      label: WorkOrderStatusLabel[code],
      count: orders.filter((wo) => orderStatus(wo) === code).length,
    }))
    .filter((row) => row.count > 0);

  const paymentBreakdown = Object.values(PaymentStatus).map((code) => ({
    code,
    label: PaymentStatusLabel[code],
    count: orders.filter((wo) => orderPaymentStatus(wo) === code).length,
    amount: orders
      .filter((wo) => orderPaymentStatus(wo) === code)
      .reduce((s, wo) => s + workOrderTotal(wo), 0),
  }));

  let serviceRevenue = 0;
  let partsRevenue = 0;
  const partTotals = new Map();
  const serviceTotals = new Map();
  const customerSpend = new Map();

  orders.forEach((wo) => {
    const total = workOrderTotal(wo);
    customerSpend.set(wo.customerId, (customerSpend.get(wo.customerId) || 0) + total);
    (wo.items || []).forEach((item) => {
      const line = Number(item.quantity) * Number(item.unitPrice);
      if (itemType(item) === ItemType.PART) {
        partsRevenue += line;
        partTotals.set(item.description, (partTotals.get(item.description) || 0) + line);
      } else {
        serviceRevenue += line;
        serviceTotals.set(item.description, (serviceTotals.get(item.description) || 0) + line);
      }
    });
  });

  const topParts = [...partTotals.entries()]
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const topServices = [...serviceTotals.entries()]
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const topCustomers = [...customerSpend.entries()]
    .map(([id, spend]) => {
      const c = customers.find((x) => x.id === id);
      return { id, name: c?.name || woCustomerName(orders, id) || String(id), spend };
    })
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 5);

  const monthMap = new Map();
  orders.forEach((wo) => {
    const key = monthKey(wo.createdAt);
    if (!monthMap.has(key)) {
      monthMap.set(key, { orders: 0, revenue: 0, paidRevenue: 0 });
    }
    const row = monthMap.get(key);
    row.orders += 1;
    row.revenue += workOrderTotal(wo);
    if (orderPaymentStatus(wo) === PaymentStatus.PAID) {
      row.paidRevenue += workOrderTotal(wo);
    }
  });

  const evolutionKeys = [...monthMap.keys()].sort();
  const evolution = {
    labels: evolutionKeys.map(monthLabel),
    ordersData: evolutionKeys.map((k) => monthMap.get(k).orders),
    revenueData: evolutionKeys.map((k) => monthMap.get(k).revenue),
    paidRevenueData: evolutionKeys.map((k) => monthMap.get(k).paidRevenue),
  };

  return {
    kpis: {
      activeOrders: activeOrders.length,
      totalOrders: orders.length,
      deliveredCount: delivered.length,
      customers: customers.length,
      vehicles: vehicles.length,
      partsCatalog: activeParts.length,
      revenuePaid,
      revenueOpen,
      ticketMedio,
      waitingPayment: waitingPayment.length,
    },
    statusBreakdown,
    paymentBreakdown,
    mix: { serviceRevenue, partsRevenue },
    topParts,
    topServices,
    topCustomers,
    evolution,
    formatMoney,
  };
}

function woCustomerName(orders, customerId) {
  const match = orders.find((wo) => wo.customerId === customerId);
  return match?.customerName;
}
