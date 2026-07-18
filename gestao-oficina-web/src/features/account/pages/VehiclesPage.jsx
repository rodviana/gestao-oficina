import { useCustomerPortfolio } from '../hooks/useCustomerPortfolio';
import VehicleCard from '../components/VehicleCard';

export default function VehiclesPage() {
  const { vehicles } = useCustomerPortfolio();

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
