import { Link, useParams } from 'react-router-dom';
import { useMockStore } from '../mock/MockStore';
import {
  PaymentStatusLabel,
  WorkOrderStatusLabel,
  WorkOrderStatusTone,
  formatDate,
  formatMoney,
} from '../mock/labels';
import { workOrderTotal } from '../mock/seed';
import { Card, EmptyState, PageHeader } from '../components/ui/PageElements';
import { PrototypeBanner, StatusBadge } from '../components/PrototypeChrome';

export default function VehicleHistory() {
  const { id } = useParams();
  const store = useMockStore();
  const vehicle = store.getVehicle(id);
  const customer = vehicle ? store.getCustomer(vehicle.customerId) : null;
  const orders = vehicle ? store.listWorkOrders({ vehicleId: vehicle.id }) : [];

  if (!vehicle) {
    return (
      <div className="space-y-6">
        <PrototypeBanner />
        <EmptyState title="Veículo não encontrado" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PrototypeBanner />
      <PageHeader
        eyebrow="RF-11"
        title={`Histórico · ${vehicle.plate}`}
        description={`${vehicle.brand} ${vehicle.model} · Cliente: ${customer?.name || '—'}`}
        backTo="/vehicles"
      />

      <Card padding={false}>
        {orders.length === 0 ? (
          <EmptyState title="Sem atendimentos" description="Este veículo ainda não tem OS." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">OS</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Pagamento</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((wo) => (
                  <tr key={wo.id}>
                    <td className="px-4 py-3">
                      <Link to={`/work-orders/${wo.id}`} className="font-medium text-blue-600 hover:underline">
                        {wo.number}
                      </Link>
                      <p className="text-xs text-slate-400 line-clamp-1">{wo.description}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(wo.createdAt)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        label={WorkOrderStatusLabel[wo.status]}
                        tone={WorkOrderStatusTone[wo.status]}
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {PaymentStatusLabel[wo.paymentStatus]}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatMoney(workOrderTotal(wo))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
