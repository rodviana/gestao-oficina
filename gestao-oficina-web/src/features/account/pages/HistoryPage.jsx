import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import WorkOrderCard from '../../tracking/components/WorkOrderCard';
import HistoryFilters from '../components/HistoryFilters';
import { Pagination } from '../../../components/ui/Pagination';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../../../constants/pagination';
import { getOrdersByCustomerId, getVehiclesPage } from '../../../data/tracking';
import { useAuth } from '../../auth/AuthContext';

export default function HistoryPage() {
  const { customer } = useAuth();
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState('all');
  const [vehicleId, setVehicleId] = useState(() => params.get('veiculo') || 'all');
  const [page, setPage] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageMaxNumber, setPageMaxNumber] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setVehicleId(params.get('veiculo') || 'all');
  }, [params]);

  useEffect(() => {
    setPage(0);
  }, [filter, vehicleId]);

  useEffect(() => {
    if (!customer) {
      setVehicles([]);
      return undefined;
    }

    let cancelled = false;
    async function loadVehicles() {
      try {
        const result = await getVehiclesPage({ page: 0, pageSize: MAX_PAGE_SIZE });
        if (!cancelled) setVehicles(result.items);
      } catch {
        if (!cancelled) setVehicles([]);
      }
    }
    loadVehicles();
    return () => {
      cancelled = true;
    };
  }, [customer]);

  useEffect(() => {
    if (!customer) {
      setOrders([]);
      setTotal(0);
      setPageMaxNumber(0);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    async function loadOrders() {
      setLoading(true);
      setError(null);
      try {
        const result = await getOrdersByCustomerId({
          statusGroup: filter,
          vehicleId: vehicleId === 'all' ? undefined : vehicleId,
          page,
          pageSize: DEFAULT_PAGE_SIZE,
        });
        if (cancelled) return;
        setOrders(result.items);
        setTotal(result.total);
        setPageMaxNumber(result.pageMaxNumber);
        setPageSize(result.pageSize);
        if (result.page !== page) {
          setPage(result.page);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Erro ao carregar histórico.');
          setOrders([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      cancelled = true;
    };
  }, [customer, filter, vehicleId, page]);

  function onFilterChange(next) {
    setFilter(next);
  }

  function onVehicleChange(next) {
    setVehicleId(next);
    if (next === 'all') {
      params.delete('veiculo');
    } else {
      params.set('veiculo', next);
    }
    setParams(params, { replace: true });
  }

  if (error && orders.length === 0 && !loading) {
    return <p className="text-center text-sm text-red-700">{error}</p>;
  }

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-shop-900">Histórico completo</h2>
      <p className="mt-1 text-sm text-shop-500">
        Todos os atendimentos vinculados à sua conta, do mais recente ao mais antigo.
      </p>

      <HistoryFilters
        filter={filter}
        onFilterChange={onFilterChange}
        vehicles={vehicles}
        vehicleId={vehicleId}
        onVehicleChange={onVehicleChange}
      />

      {loading ? (
        <p className="mt-8 text-center text-sm text-shop-500">Carregando histórico…</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-center text-sm text-shop-500">Nenhuma OS neste filtro.</p>
      ) : (
        <>
          <ul className="mt-5 space-y-3">
            {orders.map((wo) => (
              <li key={wo.id}>
                <WorkOrderCard
                  order={wo}
                  emphasize={filter !== 'history' && wo.status !== 'DELIVERED'}
                />
              </li>
            ))}
          </ul>
          <Pagination
            page={page}
            pageMaxNumber={pageMaxNumber}
            totalNumber={total}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
