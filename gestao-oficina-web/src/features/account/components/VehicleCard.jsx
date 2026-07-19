import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../data/labels';

export default function VehicleCard({ vehicle }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/conta/historico?veiculo=${vehicle.id}`)}
      className="w-full rounded-3xl border border-sand-200 bg-white p-5 text-left shadow-soft transition hover:border-shop-500/40"
    >
      <p className="font-display text-2xl font-semibold text-shop-900">{vehicle.plate}</p>
      <p className="mt-1 text-sm text-shop-500">
        {vehicle.brand} {vehicle.model}
        {vehicle.year ? ` · ${vehicle.year}` : ''}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-shop-500">
        <span className="font-semibold text-shop-700">
          {vehicle.orderCount} atendimento{vehicle.orderCount === 1 ? '' : 's'}
        </span>
        {vehicle.lastOrder && (
          <span>
            Último: {vehicle.lastOrder.number || 'OS'}
            {vehicle.lastOrder.updatedAt ? ` · ${formatDate(vehicle.lastOrder.updatedAt)}` : ''}
          </span>
        )}
      </div>
    </button>
  );
}
