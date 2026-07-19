import { formatDate, formatMoney, workOrderTotal } from '../../../data/labels';
import { Pagination } from '../../../components/ui/Pagination';
import { useClientPagination } from '../../../hooks/useClientPagination';

export default function OrderItemsSection({ order }) {
  const total = workOrderTotal(order);
  const items = order.items || [];
  const paged = useClientPagination(items, { resetKey: order.id });

  return (
    <section className="mt-4 rounded-3xl border border-sand-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-semibold text-shop-900">Serviços e peças</h2>
        <p className="font-display text-xl font-semibold text-shop-900">{formatMoney(total)}</p>
      </div>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-shop-500">Ainda sem itens lançados nesta OS.</p>
      ) : (
        <>
          <ul className="mt-4 divide-y divide-sand-100">
            {paged.items.map((item, index) => (
              <li
                key={item.id ?? `${paged.page}-${index}`}
                className="flex items-start justify-between gap-3 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-shop-900">{item.description}</p>
                  <p className="text-shop-500">
                    {item.quantity} × {formatMoney(item.unitPrice)}
                  </p>
                </div>
                <p className="font-semibold text-shop-900">
                  {formatMoney(item.quantity * item.unitPrice)}
                </p>
              </li>
            ))}
          </ul>
          <Pagination
            page={paged.page}
            pageMaxNumber={paged.pageMaxNumber}
            totalNumber={paged.total}
            pageSize={paged.pageSize}
            onPageChange={paged.setPage}
          />
        </>
      )}
      <p className="mt-3 text-xs text-shop-500">
        Aberta em {formatDate(order.createdAt)} · Atualizada em {formatDate(order.updatedAt)}
      </p>
    </section>
  );
}
