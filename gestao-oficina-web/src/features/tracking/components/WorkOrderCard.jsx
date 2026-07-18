import { useNavigate } from 'react-router-dom';
import { STATUS_LABEL, formatDate, formatMoney, workOrderTotal } from '../../../data/labels';

export default function WorkOrderCard({ order, emphasize = false }) {
  const navigate = useNavigate();
  const total = workOrderTotal(order);

  return (
    <button
      type="button"
      onClick={() => navigate(`/os/${order.id}`)}
      className={`w-full rounded-3xl border p-5 text-left shadow-soft transition hover:border-shop-500/40 ${
        emphasize
          ? 'border-shop-500/30 bg-white ring-1 ring-shop-500/10'
          : 'border-sand-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-xl font-semibold text-shop-900">{order.number}</p>
          <p className="mt-1 text-sm text-shop-500">
            {order.vehicle?.plate} · {order.vehicle?.brand} {order.vehicle?.model}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-shop-100 px-2.5 py-1 text-xs font-bold text-shop-700">
          {STATUS_LABEL[order.status]}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-shop-700">{order.description}</p>
      <div className="mt-3 flex justify-between text-xs text-shop-500">
        <span>{formatDate(order.updatedAt)}</span>
        <span className="font-semibold text-shop-900">{formatMoney(total)}</span>
      </div>
    </button>
  );
}
