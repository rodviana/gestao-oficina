import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { WorkOrderStatus } from '../constants/labels';
import { EmptyState, TextInput } from '../components/ui/PageElements';
import KanbanBoard from '../components/kanban/KanbanBoard';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../constants/userRole';
import { quickSearch } from '../services/searchService';
import { DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { fetchAllWorkOrders, updateWorkOrderStatus } from '../services/workOrderService';
import { fetchAllVehiclesByCustomer } from '../services/vehicleService';
import { showSuccess } from '../services/apiClient';
import { Pagination } from '../components/ui/Pagination';
import { useClientPagination } from '../hooks/useClientPagination';

const ACTIVE = [
  WorkOrderStatus.OPEN,
  WorkOrderStatus.IN_PROGRESS,
  WorkOrderStatus.WAITING_PARTS,
  WorkOrderStatus.READY,
];

export default function Home() {
  const { session } = useAuth();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchPage, setSearchPage] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [customerVehicles, setCustomerVehicles] = useState({});

  useEffect(() => {
    if (!session?.token) return undefined;
    let cancelled = false;

    (async () => {
      setLoadingOrders(true);
      try {
        const all = await fetchAllWorkOrders(session.token, { pageSize: DEFAULT_PAGE_SIZE });
        if (!cancelled) setOrders(all);
      } catch {
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setLoadingOrders(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.token]);

  useEffect(() => {
    if (!session?.token || !searched?.customers?.length) return undefined;
    let cancelled = false;

    (async () => {
      const entries = await Promise.all(
        searched.customers.map(async (customer) => {
          if (customer.vehicles?.length) {
            return [customer.id, customer.vehicles];
          }
          try {
            const vehicles = await fetchAllVehiclesByCustomer(session.token, customer.id);
            return [customer.id, vehicles];
          } catch {
            return [customer.id, []];
          }
        }),
      );
      if (!cancelled) setCustomerVehicles(Object.fromEntries(entries));
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.token, searched]);

  const activeOrders = useMemo(
    () => orders.filter((wo) => ACTIVE.includes(wo.status)),
    [orders],
  );
  const kanbanPage = useClientPagination(activeOrders, {
    pageSize: DEFAULT_PAGE_SIZE,
    resetKey: activeOrders.length,
  });

  const canCreate = session?.role === UserRole.ADMIN || session?.role === UserRole.ATTENDANT;
  const readyCount = activeOrders.filter((w) => w.status === WorkOrderStatus.READY).length;
  const waitingCount = activeOrders.filter((w) => w.status === WorkOrderStatus.WAITING_PARTS).length;
  const inProgressCount = activeOrders.filter((w) => w.status === WorkOrderStatus.IN_PROGRESS).length;
  const openCount = activeOrders.filter((w) => w.status === WorkOrderStatus.OPEN).length;
  const firstName = session?.name?.split(' ')[0] || 'equipe';

  async function handleSearch(event) {
    event.preventDefault();
    const q = query.trim();
    if (!q) {
      setSearched(null);
      return;
    }
    try {
      const results = await quickSearch(session.token, q, { page: 0, pageSize: DEFAULT_PAGE_SIZE });
      setSearched(results);
      setSearchPage(0);
      setSearchOpen(true);
    } catch {
      setSearched({ customers: [], vehicles: [], total: 0, pageMaxNumber: 0, pageSize: DEFAULT_PAGE_SIZE });
      setSearchOpen(true);
    }
  }

  async function changeSearchPage(nextPage) {
    const q = query.trim();
    if (!q) return;
    try {
      const results = await quickSearch(session.token, q, {
        page: nextPage,
        pageSize: DEFAULT_PAGE_SIZE,
      });
      setSearched(results);
      setSearchPage(results.page);
    } catch {
      /* toast via apiClient */
    }
  }

  function clearSearch() {
    setQuery('');
    setSearched(null);
    setSearchPage(0);
    setSearchOpen(false);
    setCustomerVehicles({});
  }

  async function handleStatusChange(id, status) {
    await updateWorkOrderStatus(session.token, id, status);
    setOrders((prev) => prev.map((wo) => (wo.id === id ? { ...wo, status, statusCode: status } : wo)));
    showSuccess('Status atualizado.');
  }

  return (
    <div className="page-shell !space-y-4">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-400">
            Operação · {firstName}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            OS em andamento
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {activeOrders.length} no quadro agora
            {readyCount > 0 ? ` · ${readyCount} pronta${readyCount === 1 ? '' : 's'} p/ entrega` : ''}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link to="/work-orders" className="btn-secondary">
            Lista completa
          </Link>
          {canCreate && (
            <Link to="/work-orders/new" className="btn-primary !hidden !px-5 !py-3 text-base shadow-lift sm:!inline-flex">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              Nova OS
            </Link>
          )}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <StatusPill label="Abertas" value={openCount} tone="bg-ink-100 text-ink-700" />
        <StatusPill label="Em andamento" value={inProgressCount} tone="bg-sky-100 text-sky-800" />
        <StatusPill label="Aguard. peça" value={waitingCount} tone="bg-amber-100 text-amber-900" />
        <StatusPill label="Prontas" value={readyCount} tone="bg-emerald-100 text-emerald-800" />
      </div>

      <section className="rounded-2xl border border-ink-200/70 bg-white/90 p-3 shadow-soft sm:p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3-3" strokeLinecap="round" />
              </svg>
            </span>
            <TextInput
              id="quick-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => searched && setSearchOpen(true)}
              placeholder="Buscar placa, telefone ou cliente…"
              className="!py-3 !pl-10 !text-base"
              aria-label="Busca rápida"
            />
          </div>
          <button type="submit" className="btn-secondary !px-4">
            Buscar
          </button>
          {(searched || query) && (
            <button type="button" className="btn-ghost !px-3" onClick={clearSearch}>
              Limpar
            </button>
          )}
        </form>

        {searchOpen && searched && (
          <div className="mt-3 max-h-72 space-y-2 overflow-y-auto border-t border-ink-100 pt-3 animate-fade-up">
            {searched.customers.length === 0 && searched.vehicles.length === 0 ? (
              <EmptyState
                title="Nenhum resultado"
                description="Tente outra placa, telefone ou nome."
              />
            ) : (
              <>
                {searched.customers.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-ink-200/80 bg-ink-50/50 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <Link
                          to={`/customers/${c.id}`}
                          className="font-display text-base font-bold text-ink-900 hover:text-signal"
                        >
                          {c.name}
                        </Link>
                        <p className="text-xs text-ink-500">Tel. {c.phone || '—'}</p>
                      </div>
                      {canCreate && (
                        <Link
                          to={`/work-orders/new?customerId=${c.id}`}
                          className="btn-primary !px-3 !py-1.5 !text-xs"
                        >
                          Nova OS
                        </Link>
                      )}
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {(customerVehicles[c.id] || c.vehicles || []).map((v) => (
                        <li
                          key={v.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-2.5 py-2 text-sm ring-1 ring-ink-100"
                        >
                          <Link to={`/vehicles/${v.id}`} className="hover:text-signal">
                            <strong className="font-display">{v.plate}</strong>
                            <span className="text-ink-500">
                              {' '}
                              — {v.brand} {v.model}
                            </span>
                          </Link>
                          {canCreate && (
                            <Link
                              to={`/work-orders/new?customerId=${c.id}&vehicleId=${v.id}`}
                              className="text-xs font-bold text-signal hover:underline"
                            >
                              Abrir OS
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Pagination
                  page={searchPage}
                  pageMaxNumber={searched.pageMaxNumber ?? 0}
                  totalNumber={searched.total ?? 0}
                  pageSize={searched.pageSize ?? DEFAULT_PAGE_SIZE}
                  onPageChange={changeSearchPage}
                />
              </>
            )}
          </div>
        )}
      </section>

      {loadingOrders ? (
        <p className="text-sm text-ink-500">Carregando quadro…</p>
      ) : (
        <>
          <KanbanBoard
            title="Quadro da pista"
            canCreate={canCreate}
            compactHeader
            orders={kanbanPage.items}
            onStatusChange={handleStatusChange}
          />
          <Pagination
            page={kanbanPage.page}
            pageMaxNumber={kanbanPage.pageMaxNumber}
            totalNumber={kanbanPage.total}
            pageSize={kanbanPage.pageSize}
            onPageChange={kanbanPage.setPage}
          />
        </>
      )}
    </div>
  );
}

function StatusPill({ label, value, tone }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${tone}`}>
      <span className="font-display text-sm tabular-nums">{value}</span>
      {label}
    </span>
  );
}
