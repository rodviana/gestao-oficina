export const STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  WAITING_PARTS: 'WAITING_PARTS',
  READY: 'READY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const STATUS_LABEL = {
  OPEN: 'Recebida',
  IN_PROGRESS: 'Em andamento',
  WAITING_PARTS: 'Aguardando peça',
  READY: 'Pronta para retirada',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelada',
};

export const STATUS_HINT = {
  OPEN: 'Sua OS foi registrada na oficina.',
  IN_PROGRESS: 'A equipe está trabalhando no veículo.',
  WAITING_PARTS: 'O serviço depende de uma peça.',
  READY: 'Pode buscar o veículo na oficina.',
  DELIVERED: 'Serviço concluído e entregue.',
  CANCELLED: 'Esta OS foi cancelada.',
};

/** Ordem visual do acompanhamento (pipeline). */
export const STATUS_FLOW = [
  STATUS.OPEN,
  STATUS.IN_PROGRESS,
  STATUS.WAITING_PARTS,
  STATUS.READY,
  STATUS.DELIVERED,
];

export const PAYMENT_LABEL = {
  UNPAID: 'Em aberto',
  WAITING_PAYMENT: 'Aguardando pagamento',
  PAID: 'Pago',
};

export function formatMoney(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function normalizePlate(plate) {
  return String(plate || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

export function normalizePhone(phone) {
  return String(phone || '').replace(/\D/g, '');
}

export function workOrderTotal(order) {
  return (order.items || []).reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
    0,
  );
}
