import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { customerOwnsOrder, getOrderById } from '../../../data/tracking';
import StatusTimeline from '../components/StatusTimeline';
import OrderItemsSection from '../components/OrderItemsSection';

function MessageScreen({ title, description, to, cta }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-semibold text-shop-900">{title}</h1>
      <p className="mt-2 text-shop-500">{description}</p>
      <Link to={to} className="btn-primary mt-6 inline-flex">
        {cta}
      </Link>
    </div>
  );
}

export default function TrackDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customer, isAuthenticated } = useAuth();
  const order = getOrderById(id);

  if (!order) {
    return (
      <MessageScreen
        title="OS não encontrada"
        description="O link pode estar incorreto ou expirado."
        to={isAuthenticated ? '/conta' : '/'}
        cta="Voltar"
      />
    );
  }

  if (isAuthenticated && !customerOwnsOrder(customer.id, order.id)) {
    return (
      <MessageScreen
        title="Acesso negado"
        description="Esta OS não pertence à sua conta."
        to="/conta"
        cta="Ir para minha conta"
      />
    );
  }

  const backLabel = isAuthenticated ? '← Minha conta' : '← Nova consulta';
  const backTo = isAuthenticated ? '/conta' : '/consulta';

  return (
    <div className="mx-auto max-w-lg px-4 py-6 sm:py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <button type="button" className="btn-ghost !px-0" onClick={() => navigate(backTo)}>
          {backLabel}
        </button>
        <p className="text-xs font-bold uppercase tracking-wider text-shop-500">Portal do cliente</p>
      </div>

      <header className="mb-6">
        <p className="text-sm font-semibold text-shop-500">{order.number}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-shop-900 sm:text-4xl">
          {order.vehicle?.plate}
        </h1>
        <p className="mt-1 text-shop-500">
          {order.vehicle?.brand} {order.vehicle?.model}
          {order.vehicle?.year ? ` · ${order.vehicle.year}` : ''}
        </p>
        <p className="mt-3 text-sm text-shop-700">
          Cliente: <strong>{order.customer?.name}</strong>
        </p>
      </header>

      <StatusTimeline
        status={order.status}
        paymentStatus={order.paymentStatus}
        timeline={order.timeline}
      />

      <section className="mt-8 rounded-3xl border border-sand-200 bg-white p-5 shadow-soft">
        <h2 className="font-display text-lg font-semibold text-shop-900">O que foi relatado</h2>
        <p className="mt-2 text-sm leading-relaxed text-shop-700">{order.description}</p>
      </section>

      <OrderItemsSection order={order} />

      <section className="mt-4 rounded-3xl bg-sand-100 px-5 py-4 text-sm text-shop-700">
        <p className="font-semibold text-shop-900">Dúvidas?</p>
        <p className="mt-1">
          Fale com a oficina pelo telefone cadastrado no balcão. Este portal é só para consulta.
        </p>
      </section>
    </div>
  );
}
