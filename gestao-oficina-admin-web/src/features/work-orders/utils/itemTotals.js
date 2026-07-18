import { ItemType } from '../../../mock/labels';

export function computeItemTotals(order) {
  if (!order) return { services: 0, parts: 0, total: 0 };

  const services = order.items
    .filter((i) => i.type === ItemType.SERVICE)
    .reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  const parts = order.items
    .filter((i) => i.type === ItemType.PART)
    .reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  return { services, parts, total: services + parts };
}
