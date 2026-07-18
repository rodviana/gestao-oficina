import { Link, useParams } from 'react-router-dom';
import { useMockStore } from '../mock/MockStore';
import {
  ItemTypeLabel,
  PaymentStatusLabel,
  WorkOrderStatusLabel,
  formatDateTime,
  formatMoney,
} from '../mock/labels';
import { workOrderTotal } from '../mock/seed';
import { EmptyState } from '../components/ui/PageElements';

export default function WorkOrderPrint() {
  const { id } = useParams();
  const store = useMockStore();
  const order = store.getWorkOrder(id);

  if (!order) {
    return <EmptyState title="OS não encontrada" />;
  }

  const customer = store.getCustomer(order.customerId);
  const vehicle = store.getVehicle(order.vehicleId);
  const total = workOrderTotal(order);

  return (
    <div className="mx-auto max-w-3xl space-y-6 bg-white p-6 print:max-w-none print:p-0">
      <div className="flex items-start justify-between gap-4 print:hidden">
        <Link to={`/work-orders/${id}`} className="btn-secondary">
          Voltar
        </Link>
        <button type="button" className="btn-primary" onClick={() => window.print()}>
          Imprimir
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 p-8 print:border-0 print:p-0">
        <header className="border-b border-slate-200 pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Gestão Oficina
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Ordem de serviço · {order.number}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Emitido em {formatDateTime(new Date().toISOString())} · RF-13
          </p>
        </header>

        <section className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <h2 className="font-semibold text-slate-900">Cliente</h2>
            <p>{customer?.name}</p>
            <p className="text-slate-600">Tel. {customer?.phone}</p>
            {customer?.document && <p className="text-slate-600">Doc. {customer.document}</p>}
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Veículo</h2>
            <p>
              {vehicle?.plate} — {vehicle?.brand} {vehicle?.model}{' '}
              {vehicle?.year ? `(${vehicle.year})` : ''}
            </p>
            <p className="text-slate-600">
              Status: {WorkOrderStatusLabel[order.status]} · Pagamento:{' '}
              {PaymentStatusLabel[order.paymentStatus]}
            </p>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold text-slate-900">Relato</h2>
          <p className="mt-1 text-sm text-slate-700">{order.description}</p>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 font-semibold text-slate-900">Itens</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="py-2">Tipo</th>
                <th className="py-2">Descrição</th>
                <th className="py-2 text-right">Qtd</th>
                <th className="py-2 text-right">Unit.</th>
                <th className="py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-2">{ItemTypeLabel[item.type]}</td>
                  <td className="py-2">{item.description}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">{formatMoney(item.unitPrice)}</td>
                  <td className="py-2 text-right">
                    {formatMoney(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
              {order.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-slate-500">
                    Sem itens lançados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <p className="mt-4 text-right text-lg font-bold text-slate-900">
            Total: {formatMoney(total)}
          </p>
        </section>

        <footer className="mt-10 grid gap-8 text-sm sm:grid-cols-2">
          <div className="border-t border-slate-300 pt-3">
            Assinatura do cliente
          </div>
          <div className="border-t border-slate-300 pt-3">
            Assinatura da oficina
          </div>
        </footer>
      </div>
    </div>
  );
}
