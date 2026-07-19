import { useEffect, useState } from 'react';
import VehicleCard from '../components/VehicleCard';
import { Pagination } from '../../../components/ui/Pagination';
import { DEFAULT_PAGE_SIZE } from '../../../constants/pagination';
import { getVehiclesPage } from '../../../data/tracking';
import { useAuth } from '../../auth/AuthContext';

export default function VehiclesPage() {
  const { customer } = useAuth();
  const [page, setPage] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageMaxNumber, setPageMaxNumber] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customer) {
      setVehicles([]);
      setTotal(0);
      setPageMaxNumber(0);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await getVehiclesPage({ page, pageSize: DEFAULT_PAGE_SIZE });
        if (cancelled) return;
        setVehicles(result.items);
        setTotal(result.total);
        setPageMaxNumber(result.pageMaxNumber);
        setPageSize(result.pageSize);
        if (result.page !== page) {
          setPage(result.page);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Erro ao carregar veículos.');
          setVehicles([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [customer, page]);

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

      {vehicles.length === 0 ? (
        <p className="mt-8 text-center text-sm text-shop-500">Nenhum veículo cadastrado.</p>
      ) : (
        <>
          <ul className="mt-5 space-y-3">
            {vehicles.map((vehicle) => (
              <li key={vehicle.id}>
                <VehicleCard vehicle={vehicle} />
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
