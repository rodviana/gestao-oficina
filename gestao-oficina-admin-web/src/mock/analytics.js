import {
  ItemType,
  PaymentStatus,
  PaymentStatusLabel,
  WorkOrderStatus,
  WorkOrderStatusLabel,
  formatMoney,
} from './labels';
import { workOrderTotal } from './seed';

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

/**
 * Agrega métricas do MockStore no formato do dashboard (inspirado no ecommerce-admin).
 */
export function buildWorkshopAnalytics(store) {
  const orders = store.listWorkOrders();
  const customers = store.listCustomers();
  const vehicles = store.listVehicles();
  const partsCatalog = store.listPartCatalog().filter((p) => p.active);

  const activeOrders = orders.filter((wo) => ACTIVE.has(wo.status));
  const delivered = orders.filter((wo) => wo.status === WorkOrderStatus.DELIVERED);
  const paid = orders.filter((wo) => wo.paymentStatus === PaymentStatus.PAID);
  const waitingPayment = orders.filter(
    (wo) => wo.paymentStatus === PaymentStatus.WAITING_PAYMENT,
  );

  const revenuePaid = paid.reduce((s, wo) => s + workOrderTotal(wo), 0);
  const revenueOpen = orders
    .filter((wo) => wo.paymentStatus !== PaymentStatus.PAID && wo.status !== WorkOrderStatus.CANCELLED)
    .reduce((s, wo) => s + workOrderTotal(wo), 0);
  const ticketMedio = paid.length > 0 ? revenuePaid / paid.length : 0;

  const statusBreakdown = Object.values(WorkOrderStatus)
    .filter((s) => s !== WorkOrderStatus.CANCELLED)
    .map((code) => ({
      code,
      label: WorkOrderStatusLabel[code],
      count: orders.filter((wo) => wo.status === code).length,
    }))
    .filter((row) => row.count > 0);

  const paymentBreakdown = Object.values(PaymentStatus).map((code) => ({
    code,
    label: PaymentStatusLabel[code],
    count: orders.filter((wo) => wo.paymentStatus === code).length,
    amount: orders
      .filter((wo) => wo.paymentStatus === code)
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
      if (item.type === ItemType.PART) {
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
      return { id, name: c?.name || id, spend };
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
    if (wo.paymentStatus === PaymentStatus.PAID) {
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

  const now = new Date();
  const thisMonthKey = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
  const thisMonth = monthMap.get(thisMonthKey) || { orders: 0, revenue: 0, paidRevenue: 0 };
  const monthlyGoal = 8000;
  const goalProgress = Math.min(100, Math.round((thisMonth.paidRevenue / monthlyGoal) * 100));

  return {
    kpis: {
      activeOrders: activeOrders.length,
      totalOrders: orders.length,
      deliveredCount: delivered.length,
      customers: customers.length,
      vehicles: vehicles.length,
      partsCatalog: partsCatalog.length,
      revenuePaid,
      revenueOpen,
      ticketMedio,
      waitingPayment: waitingPayment.length,
      thisMonthOrders: thisMonth.orders,
      thisMonthPaid: thisMonth.paidRevenue,
      monthlyGoal,
      goalProgress,
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
