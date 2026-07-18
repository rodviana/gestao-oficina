import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PaymentStatusShortLabel,
  PaymentStatusTone,
  WorkOrderStatus,
  WorkOrderStatusAccent,
  WorkOrderStatusColumn,
  WorkOrderStatusLabel,
  WorkOrderStatusTone,
  formatMoney,
} from '../../constants/labels';
import { formatRelativeTime, workOrderTotal } from '../../utils/workOrderUtils';
import { StatusBadge } from '../PrototypeChrome';
import WorkOrderSummaryModal from './WorkOrderSummaryModal';

const DEFAULT_COLUMNS = [
  WorkOrderStatus.OPEN,
  WorkOrderStatus.IN_PROGRESS,
  WorkOrderStatus.WAITING_PARTS,
  WorkOrderStatus.READY,
];

export default function KanbanBoard({
  orders = [],
  onStatusChange,
  columns = DEFAULT_COLUMNS,
  includeDelivered = false,
  title = 'Quadro da oficina',
  canCreate = false,
  compactHeader = false,
}) {
  const [draggingId, setDraggingId] = useState(null);
  const [overStatus, setOverStatus] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  // Guarda clique-vs-arrasto: um drag não deve abrir o modal ao soltar.
  const didDragRef = useRef(false);

  const columnList = useMemo(() => {
    const list = [...columns];
    if (includeDelivered && !list.includes(WorkOrderStatus.DELIVERED)) {
      list.push(WorkOrderStatus.DELIVERED);
    }
    return list;
  }, [columns, includeDelivered]);

  const boardOrders = useMemo(
    () => orders.filter((wo) => columnList.includes(wo.status)),
    [orders, columnList],
  );

  const byStatus = useMemo(() => {
    const map = Object.fromEntries(columnList.map((s) => [s, []]));
    boardOrders.forEach((wo) => {
      if (map[wo.status]) map[wo.status].push(wo);
    });
    return map;
  }, [boardOrders, columnList]);

  function onDragStart(event, id) {
    event.dataTransfer.setData('text/plain', String(id));
    event.dataTransfer.effectAllowed = 'move';
    didDragRef.current = true;
    setDraggingId(id);
  }

  function onDragEnd() {
    setDraggingId(null);
    setOverStatus(null);
    // Deixa o click do mesmo gesto ser descartado antes de rearmar.
    setTimeout(() => {
      didDragRef.current = false;
    }, 0);
  }

  function onDragOver(event, status) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setOverStatus(status);
  }

  async function onDrop(event, status) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    setOverStatus(null);
    setDraggingId(null);
    if (!id) return;
    const wo = boardOrders.find((x) => String(x.id) === String(id));
    if (!wo || wo.status === status || !onStatusChange) return;
    await onStatusChange(wo.id, status);
  }

  function onCardClick(wo) {
    if (didDragRef.current) return;
    setSelectedOrder(wo);
  }

  return (
    <div className="space-y-3 rounded-3xl border border-ink-800/10 bg-ink-900 p-3 text-white shadow-lift sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="min-w-0">
          {!compactHeader && (
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-signal-muted">
              Quadro operacional
            </p>
          )}
          <h2 className={`font-display font-bold ${compactHeader ? 'text-lg' : 'text-xl'}`}>
            {title}
          </h2>
          <p className={compactHeader ? 'text-xs text-ink-400' : 'text-sm text-ink-300'}>
            Arraste para mudar status · clique para ver o resumo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold tabular-nums">
            {boardOrders.length} OS
          </span>
          {canCreate && (
            <Link
              to="/work-orders/new"
              className="inline-flex items-center gap-1.5 rounded-full bg-signal px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-signal-strong"
            >
              <span className="text-base leading-none">+</span>
              Nova OS
            </Link>
          )}
        </div>
      </div>

      <div className="-mx-0.5 flex gap-2.5 overflow-x-auto pb-1 pt-0.5 sm:gap-3">
        {columnList.map((status) => (
          <section
            key={status}
            className={`flex min-h-[26rem] w-[min(100%,260px)] shrink-0 flex-col rounded-2xl border bg-ink-800/80 transition-colors sm:w-[min(100%,276px)] ${
              overStatus === status
                ? 'border-signal/60 bg-ink-700 ring-2 ring-signal/50'
                : 'border-white/10'
            }`}
            onDragOver={(e) => onDragOver(e, status)}
            onDragLeave={() => setOverStatus((cur) => (cur === status ? null : cur))}
            onDrop={(e) => onDrop(e, status)}
          >
            <header
              className={`flex items-center justify-between gap-2 rounded-t-2xl border-b border-white/10 border-t-4 px-3 py-2.5 ${WorkOrderStatusColumn[status]}`}
            >
              <StatusBadge label={WorkOrderStatusLabel[status]} tone={WorkOrderStatusTone[status]} />
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/10 px-1.5 text-xs font-bold tabular-nums">
                {byStatus[status].length}
              </span>
            </header>

            <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
              {byStatus[status].length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 px-3 py-8 text-center">
                  <p className="text-xs text-ink-400">Nenhuma OS</p>
                  {canCreate && status === WorkOrderStatus.OPEN && (
                    <Link
                      to="/work-orders/new"
                      className="text-xs font-bold text-signal-muted hover:text-white"
                    >
                      + Criar OS
                    </Link>
                  )}
                </div>
              ) : (
                byStatus[status].map((wo) => (
                  <KanbanCard
                    key={wo.id}
                    order={wo}
                    dragging={draggingId === wo.id}
                    onDragStart={(e) => onDragStart(e, wo.id)}
                    onDragEnd={onDragEnd}
                    onClick={() => onCardClick(wo)}
                  />
                ))
              )}
            </div>
          </section>
        ))}
      </div>

      {selectedOrder && (
        <WorkOrderSummaryModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}

function KanbanCard({ order, dragging, onDragStart, onDragEnd, onClick }) {
  const total = workOrderTotal(order);

  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative cursor-grab overflow-hidden rounded-xl border border-white/10 bg-white pl-4 pr-3 pb-3 pt-3 text-left text-ink-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-signal/40 hover:shadow-lift active:cursor-grabbing ${
        dragging ? 'opacity-40 scale-95' : ''
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 ${WorkOrderStatusAccent[order.status] || 'bg-ink-300'}`}
      />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-display text-base font-bold leading-tight text-ink-900 group-hover:text-signal">
            {order.vehiclePlate || '—'}
          </p>
          <p className="mt-0.5 text-[11px] font-semibold text-ink-400">{order.number}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            PaymentStatusTone[order.paymentStatus] || 'bg-ink-100 text-ink-600'
          }`}
        >
          {PaymentStatusShortLabel[order.paymentStatus] || '—'}
        </span>
      </div>

      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-500">{order.description}</p>

      <div className="mt-3 space-y-1 border-t border-ink-100 pt-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs font-medium text-ink-700">{order.customerName}</p>
          <p className="shrink-0 font-display text-sm font-bold tabular-nums">{formatMoney(total)}</p>
        </div>
        <div className="flex items-center justify-between gap-2 text-[11px] text-ink-400">
          <p className="truncate">
            {order.mechanicName ? `Mec.: ${order.mechanicName}` : 'Sem mecânico'}
          </p>
          <p className="shrink-0" title={order.updatedAt}>
            {formatRelativeTime(order.updatedAt)}
          </p>
        </div>
      </div>
    </article>
  );
}
