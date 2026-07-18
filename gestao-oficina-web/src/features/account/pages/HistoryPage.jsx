import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import WorkOrderCard from '../../tracking/components/WorkOrderCard';
import { useCustomerPortfolio } from '../hooks/useCustomerPortfolio';
import HistoryFilters from '../components/HistoryFilters';

export default function HistoryPage() {
  const { orders, active, history, vehicles, loading, error } = useCustomerPortfolio();
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState('all');
  const [vehicleId, setVehicleId] = useState(() => params.get('veiculo') || 'all');

  useEffect(() => {
    setVehicleId(params.get('veiculo') || 'all');
  }, [params]);

  const list = useMemo(() => {
    let base = orders;
    if (filter === 'active') base = active;
    if (filter === 'history') base = history;
    if (vehicleId !== 'all') {
      base = base.filter((wo) => String(wo.vehicleId) === String(vehicleId));
    }
    return base;
  }, [orders, active, history, filter, vehicleId]);

  function onVehicleChange(next) {
    setVehicleId(next);
    if (next === 'all') {
      params.delete('veiculo');
    } else {
      params.set('veiculo', next);
    }
    setParams(params, { replace: true });
  }

  if (loading) {
    return <p className="text-center text-sm text-shop-500">Carregando histórico…</p>;
  }

  if (error) {
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
        onFilterChange={setFilter}
        vehicles={vehicles}
        vehicleId={vehicleId}
        onVehicleChange={onVehicleChange}
      />

      {list.length === 0 ? (
        <p className="mt-8 text-center text-sm text-shop-500">Nenhuma OS neste filtro.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {list.map((wo) => (
            <li key={wo.id}>
              <WorkOrderCard
                order={wo}
                emphasize={filter !== 'history' && wo.status !== 'DELIVERED'}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
