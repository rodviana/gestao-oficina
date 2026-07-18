import { TRACKING_DATA } from './mock';
import { STATUS, normalizePhone, normalizePlate } from './labels';

const ACTIVE = new Set([
  STATUS.OPEN,
  STATUS.IN_PROGRESS,
  STATUS.WAITING_PARTS,
  STATUS.READY,
]);

export function hydrate(order) {
  const customer = TRACKING_DATA.customers.find((c) => c.id === order.customerId);
  const vehicle = TRACKING_DATA.vehicles.find((v) => v.id === order.vehicleId);
  return { ...order, customer, vehicle };
}

export function findByNumberAndPlate(number, plate) {
  const n = String(number || '').trim().toUpperCase();
  const p = normalizePlate(plate);
  if (!n || !p) return null;

  const order = TRACKING_DATA.workOrders.find(
    (wo) =>
      wo.number.toUpperCase() === n ||
      wo.number.toUpperCase().endsWith(n.replace(/^OS-?/i, '')),
  );
  if (!order) return null;

  const vehicle = TRACKING_DATA.vehicles.find((v) => v.id === order.vehicleId);
  if (!vehicle || normalizePlate(vehicle.plate) !== p) return null;

  return hydrate(order);
}

export function findByPhone(phone) {
  const digits = normalizePhone(phone);
  if (digits.length < 8) return [];

  const customer = TRACKING_DATA.customers.find(
    (c) =>
      normalizePhone(c.phone).endsWith(digits.slice(-8)) ||
      normalizePhone(c.phone) === digits,
  );
  if (!customer) return [];

  return getOrdersByCustomerId(customer.id);
}

export function getOrderById(id) {
  const order = TRACKING_DATA.workOrders.find((wo) => wo.id === id);
  return order ? hydrate(order) : null;
}

export function getOrdersByCustomerId(customerId) {
  return TRACKING_DATA.workOrders
    .filter((wo) => wo.customerId === customerId)
    .map(hydrate)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

export function getVehiclesByCustomerId(customerId) {
  return TRACKING_DATA.vehicles
    .filter((v) => v.customerId === customerId)
    .map((vehicle) => {
      const orders = getOrdersByCustomerId(customerId).filter(
        (wo) => wo.vehicleId === vehicle.id,
      );
      return { ...vehicle, orderCount: orders.length, lastOrder: orders[0] || null };
    });
}

export function splitActiveAndHistory(orders) {
  const active = orders.filter((wo) => ACTIVE.has(wo.status));
  const history = orders.filter((wo) => !ACTIVE.has(wo.status));
  return { active, history };
}

export function customerOwnsOrder(customerId, orderId) {
  const order = TRACKING_DATA.workOrders.find((wo) => wo.id === orderId);
  return Boolean(order && order.customerId === customerId);
}
