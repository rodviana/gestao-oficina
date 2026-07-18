import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMockStore } from '../../mock/MockStore';
import {
  PaymentStatusLabel,
  WorkOrderStatus,
  WorkOrderStatusColumn,
  WorkOrderStatusLabel,
  WorkOrderStatusTone,
  formatMoney,
} from '../../mock/labels';
import { workOrderTotal } from '../../mock/seed';
import { StatusBadge } from '../PrototypeChrome';
import { showSuccess } from '../../services/apiClient';

const DEFAULT_COLUMNS = [
  WorkOrderStatus.OPEN,
  WorkOrderStatus.IN_PROGRESS,
  WorkOrderStatus.WAITING_PARTS,
  WorkOrderStatus.READY,
];

export default function KanbanBoard({
  columns = DEFAULT_COLUMNS,
  includeDelivered = false,
  title = 'Quadro da oficina',
  canCreate = false,
  compactHeader = false,
}) {
  const store = useMockStore();
  const navigate = useNavigate();
  const [draggingId, setDraggingId] = useState(null);
  const [overStatus, setOverStatus] = useState(null);

  const columnList = useMemo(() => {
    const list = [...columns];
    if (includeDelivered && !list.includes(WorkOrderStatus.DELIVERED)) {
      list.push(WorkOrderStatus.DELIVERED);
    }
    return list;
  }, [columns, includeDelivered]);

  const orders = store.listWorkOrders().filter((wo) => columnList.includes(wo.status));

  const byStatus = useMemo(() => {
    const map = Object.fromEntries(columnList.map((s) => [s, []]));
    orders.forEach((wo) => {
      if (map[wo.status]) map[wo.status].push(wo);
    });
    return map;
  }, [orders, columnList]);

  function resolve(wo) {
    return {
      customer: store.getCustomer(wo.customerId),
      vehicle: store.getVehicle(wo.vehicleId),
      total: workOrderTotal(wo),
      mechanic: wo.mechanicId
        ? store.listUsers().find((u) => u.id === wo.mechanicId)
        : null,
    };
  }

  function onDragStart(event, id) {
    event.dataTransfer.setData('text/plain', id);
    event.dataTransfer.effectAllowed = 'move';
    setDraggingId(id);
  }

  function onDragEnd() {
    setDraggingId(null);
    setOverStatus(null);
  }

  function onDragOver(event, status) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setOverStatus(status);
  }

  function onDrop(event, status) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    setOverStatus(null);
    setDraggingId(null);
    if (!id) return;
    const wo = store.getWorkOrder(id);
    if (!wo || wo.status === status) return;
    store.updateWorkOrderStatus(id, status);
    showSuccess(`OS movida para “${WorkOrderStatusLabel[status]}”.`);
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
          {!compactHeader && (
            <p className="text-sm text-ink-300">
              Arraste pelo ⋮⋮ para mudar status · clique no card para abrir.
            </p>
          )}
          {compactHeader && (
            <p className="text-xs text-ink-400">Arraste ⋮⋮ · clique para abrir</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold tabular-nums">
            {orders.length} OS
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
            className={`flex min-h-[26rem] w-[min(100%,248px)] shrink-0 flex-col rounded-2xl border border-white/10 bg-ink-800/80 sm:w-[min(100%,260px)] ${
              overStatus === status ? 'ring-2 ring-signal bg-ink-700' : ''
            }`}
            onDragOver={(e) => onDragOver(e, status)}
            onDragLeave={() => setOverStatus((cur) => (cur === status ? null : cur))}
            onDrop={(e) => onDrop(e, status)}
          >
            <header
              className={`flex items-center justify-between gap-2 border-b border-white/10 border-t-4 px-3 py-2.5 ${WorkOrderStatusColumn[status]}`}
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
                byStatus[status].map((wo) => {
                  const { customer, vehicle, total, mechanic } = resolve(wo);
                  return (
                    <article
                      key={wo.id}
                      className={`group relative rounded-xl border border-white/10 bg-white p-3 text-ink-900 shadow-sm transition hover:border-signal/40 hover:shadow-lift ${
                        draggingId === wo.id ? 'opacity-40' : ''
                      }`}
                    >
                      <button
                        type="button"
                        draggable
                        aria-label="Arrastar OS"
                        title="Arrastar"
                        className="absolute left-1.5 top-1.5 cursor-grab rounded-md px-1 py-0.5 text-ink-300 hover:bg-ink-100 hover:text-ink-600 active:cursor-grabbing"
                        onDragStart={(e) => {
                          e.stopPropagation();
                          onDragStart(e, wo.id);
                        }}
                        onDragEnd={onDragEnd}
                        onClick={(e) => e.stopPropagation()}
                      >
                        ⋮⋮
                      </button>

                      <button
                        type="button"
                        className="w-full pl-5 text-left"
                        onClick={() => navigate(`/work-orders/${wo.id}`)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-display text-base font-bold leading-tight text-ink-900 group-hover:text-signal">
                              {vehicle?.plate || '—'}
                            </p>
                            <p className="mt-0.5 text-[11px] font-semibold text-ink-400">
                              {wo.number}
                            </p>
                          </div>
                          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                            {PaymentStatusLabel[wo.paymentStatus]}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-500">
                          {wo.description}
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-2 border-t border-ink-100 pt-2.5">
                          <p className="truncate text-xs font-medium text-ink-600">
                            {customer?.name}
                          </p>
                          <p className="shrink-0 text-xs font-bold">{formatMoney(total)}</p>
                        </div>
                        {mechanic && (
                          <p className="mt-1.5 text-[11px] text-ink-400">Mec.: {mechanic.name}</p>
                        )}
                      </button>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
