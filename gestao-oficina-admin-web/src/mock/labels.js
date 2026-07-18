export const WorkOrderStatus = Object.freeze({
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  WAITING_PARTS: 'WAITING_PARTS',
  READY: 'READY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
});

export const WorkOrderStatusLabel = Object.freeze({
  OPEN: 'Aberta',
  IN_PROGRESS: 'Em andamento',
  WAITING_PARTS: 'Aguardando peça',
  READY: 'Pronta',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelada',
});

export const WorkOrderStatusTone = Object.freeze({
  OPEN: 'bg-ink-100 text-ink-700',
  IN_PROGRESS: 'bg-sky-100 text-sky-800',
  WAITING_PARTS: 'bg-amber-100 text-amber-900',
  READY: 'bg-emerald-100 text-emerald-800',
  DELIVERED: 'bg-ink-200 text-ink-600',
  CANCELLED: 'bg-red-100 text-red-700',
});

export const WorkOrderStatusColumn = Object.freeze({
  OPEN: 'border-t-ink-400',
  IN_PROGRESS: 'border-t-sky-500',
  WAITING_PARTS: 'border-t-amber-500',
  READY: 'border-t-emerald-500',
  DELIVERED: 'border-t-ink-300',
  CANCELLED: 'border-t-red-400',
});

export const PaymentStatus = Object.freeze({
  UNPAID: 'UNPAID',
  WAITING_PAYMENT: 'WAITING_PAYMENT',
  PAID: 'PAID',
});

export const PaymentStatusLabel = Object.freeze({
  UNPAID: 'Não pago',
  WAITING_PAYMENT: 'Aguardando pagamento',
  PAID: 'Pago',
});

export const ItemType = Object.freeze({
  SERVICE: 'SERVICE',
  PART: 'PART',
});

export const ItemTypeLabel = Object.freeze({
  SERVICE: 'Serviço',
  PART: 'Peça',
});

export function formatMoney(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR');
}

export function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR');
}
