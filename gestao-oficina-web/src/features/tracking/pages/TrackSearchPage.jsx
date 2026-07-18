import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { findByPhone } from '../../../data/tracking';
import WorkOrderCard from '../components/WorkOrderCard';

export default function TrackSearchPage() {
  const [params] = useSearchParams();
  const phone = params.get('phone') || '';
  const navigate = useNavigate();
  const orders = findByPhone(phone);

  if (!phone || orders.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <p className="text-shop-500">Nenhuma OS encontrada.</p>
        <Link to="/consulta" className="btn-ghost mt-4 inline-flex">
          Voltar
        </Link>
      </div>
    );
  }

  const customer = orders[0].customer;

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <button type="button" className="btn-ghost mb-4 !px-0" onClick={() => navigate('/consulta')}>
        ← Nova consulta
      </button>
      <h1 className="font-display text-3xl font-semibold text-shop-900">Olá, {customer?.name}</h1>
      <p className="mt-1 text-shop-500">Selecione a ordem que deseja acompanhar.</p>

      <ul className="mt-6 space-y-3">
        {orders.map((wo) => (
          <li key={wo.id}>
            <WorkOrderCard order={wo} />
          </li>
        ))}
      </ul>
    </div>
  );
}
