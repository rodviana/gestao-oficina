import { Link } from 'react-router-dom';
import WorkOrderCard from '../../tracking/components/WorkOrderCard';
import { useCustomerPortfolio } from '../hooks/useCustomerPortfolio';
import AccountStats from '../components/AccountStats';

export default function AccountHomePage() {
  const { active, history, vehicles, loading, error } = useCustomerPortfolio();

  if (loading) {
    return <p className="text-center text-sm text-shop-500">Carregando sua conta…</p>;
  }

  if (error) {
    return <p className="text-center text-sm text-red-700">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <AccountStats
        activeCount={active.length}
        historyCount={history.length}
        vehicleCount={vehicles.length}
      />

      <section>
        <div className="mb-3 flex items-end justify-between gap-2">
          <h2 className="font-display text-xl font-semibold text-shop-900">Agora na oficina</h2>
        </div>
        {active.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-sand-200 bg-white/60 px-5 py-8 text-center text-sm text-shop-500">
            Nenhuma OS em andamento no momento.
          </p>
        ) : (
          <ul className="space-y-3">
            {active.map((wo) => (
              <li key={wo.id}>
                <WorkOrderCard order={wo} emphasize />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-2">
          <h2 className="font-display text-xl font-semibold text-shop-900">Últimos serviços</h2>
          <Link
            to="/conta/historico"
            className="text-sm font-semibold text-shop-700 underline-offset-2 hover:underline"
          >
            Ver tudo
          </Link>
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-shop-500">Ainda sem histórico entregue.</p>
        ) : (
          <ul className="space-y-3">
            {history.slice(0, 3).map((wo) => (
              <li key={wo.id}>
                <WorkOrderCard order={wo} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
