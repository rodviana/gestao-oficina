import { useCustomerPortfolio } from '../hooks/useCustomerPortfolio';
import VehicleCard from '../components/VehicleCard';

export default function VehiclesPage() {
  const { vehicles, loading, error } = useCustomerPortfolio();

  if (loading) {
    return <p className="text-center text-sm text-shop-500">Carregando veículos…</p>;
  }

  if (error) {
    return <p className="text-center text-sm text-red-700">{error}</p>;
  }

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-shop-900">Seus veículos</h2>
      <p className="mt-1 text-sm text-shop-500">
        Toque em um veículo para ver o histórico filtrado.
      </p>

      <ul className="mt-5 space-y-3">
        {vehicles.map((vehicle) => (
          <li key={vehicle.id}>
            <VehicleCard vehicle={vehicle} />
          </li>
        ))}
      </ul>
    </div>
  );
}
