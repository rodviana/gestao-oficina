import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  ItemType,
  PaymentStatusLabel,
  PaymentStatusTone,
  WorkOrderStatusLabel,
  WorkOrderStatusTone,
  formatDateTime,
  formatMoney,
} from '../../constants/labels';
import { workOrderTotal } from '../../utils/workOrderUtils';
import { useAuth } from '../../context/AuthContext';
import { fetchWorkOrder } from '../../services/workOrderService';
import { StatusBadge } from '../PrototypeChrome';

/**
 * Modal de resumo da OS aberto ao clicar no card do kanban (padrão ecommerce):
 * mostra o essencial sem sair do quadro e oferece "abrir em nova aba".
 */
export default function WorkOrderSummaryModal({ order, onClose }) {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setDetail(null);
    setLoading(true);

    (async () => {
      try {
        const data = await fetchWorkOrder(session.token, order.id);
        if (!cancelled) setDetail(data);
      } catch {
        if (!cancelled) setDetail(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [order.id, session.token]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const wo = detail || order;
  const total = workOrderTotal(wo);
  const items = detail?.items || [];
  const history = detail?.history || [];
  const services = items.filter((i) => (i.type ?? i.itemTypeCode) === ItemType.SERVICE);
  const parts = items.filter((i) => (i.type ?? i.itemTypeCode) === ItemType.PART);

  function openInNewTab() {
    window.open(`/work-orders/${wo.id}`, '_blank', 'noopener');
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/60 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Resumo da ${wo.number}`}
    >
      <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-lift animate-fade-up sm:rounded-3xl">
        <header className="flex items-start justify-between gap-3 border-b border-ink-100 bg-ink-900 px-5 py-4 text-white">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-signal-muted">
              {wo.number}
            </p>
            <h2 className="mt-0.5 truncate font-display text-2xl font-bold">
              {wo.vehiclePlate || '—'}
            </h2>
            <p className="truncate text-sm text-ink-300">
              {[wo.vehicleBrand, wo.vehicleModel].filter(Boolean).join(' ') || 'Veículo'}
              {wo.vehicleYear ? ` · ${wo.vehicleYear}` : ''}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="rounded-lg p-1 text-ink-300 transition hover:bg-white/10 hover:text-white"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
            <div className="flex flex-wrap justify-end gap-1.5">
              <StatusBadge label={WorkOrderStatusLabel[wo.status]} tone={WorkOrderStatusTone[wo.status]} />
              <StatusBadge
                label={PaymentStatusLabel[wo.paymentStatus]}
                tone={PaymentStatusTone[wo.paymentStatus]}
              />
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <section className="grid grid-cols-2 gap-3 text-sm">
            <InfoCell label="Cliente" value={wo.customerName} />
            <InfoCell label="Telefone" value={detail?.customerPhone} />
            <InfoCell label="Mecânico" value={wo.mechanicName || 'Sem mecânico'} />
            <InfoCell label="Atualizada em" value={formatDateTime(wo.updatedAt)} />
          </section>

          <section className="rounded-2xl bg-ink-50 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink-400">Relato</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-700">{wo.description || '—'}</p>
          </section>

          {loading ? (
            <p className="py-2 text-center text-sm text-ink-400">Carregando itens…</p>
          ) : (
            <section>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wide text-ink-400">
                  Itens ({items.length})
                </p>
                <p className="font-display text-lg font-bold text-ink-900">{formatMoney(total)}</p>
              </div>
              {items.length === 0 ? (
                <p className="mt-2 rounded-xl border border-dashed border-ink-200 px-3 py-4 text-center text-xs text-ink-400">
                  Nenhum item lançado ainda.
                </p>
              ) : (
                <ul className="mt-2 divide-y divide-ink-100 rounded-xl border border-ink-100">
                  {[...services, ...parts].map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink-800">{item.description}</p>
                        <p className="text-[11px] text-ink-400">
                          {item.itemTypeLabel} · {Number(item.quantity)} × {formatMoney(item.unitPrice)}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold tabular-nums text-ink-900">
                        {formatMoney(item.lineTotal ?? Number(item.quantity) * Number(item.unitPrice))}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {history.length > 0 && (
            <section>
              <p className="text-[11px] font-bold uppercase tracking-wide text-ink-400">
                Últimas movimentações
              </p>
              <ul className="mt-2 space-y-1.5">
                {history.slice(0, 3).map((entry) => (
                  <li key={entry.id} className="flex items-center gap-2 text-xs text-ink-600">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                    <span className="font-semibold">{entry.statusLabel}</span>
                    <span className="text-ink-400">· {formatDateTime(entry.changedAt)}</span>
                    {entry.changedByName && (
                      <span className="truncate text-ink-400">· {entry.changedByName}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-ink-100 bg-ink-50/60 px-5 py-3">
          <button type="button" className="btn-ghost !px-3" onClick={onClose}>
            Fechar
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                onClose();
                navigate(`/work-orders/${wo.id}`);
              }}
            >
              Abrir aqui
            </button>
            <button type="button" className="btn-primary" onClick={openInNewTab}>
              Abrir em nova aba
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 5h5v5M19 5l-8 8M9 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

function InfoCell({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-0.5 truncate font-medium text-ink-800">{value || '—'}</p>
    </div>
  );
}
