import { Link } from 'react-router-dom';
import {
  PaymentStatusLabel,
  WorkOrderStatusLabel,
  WorkOrderStatusTone,
  formatDateTime,
} from '../../../constants/labels';
import { Card } from '../../../components/ui/PageElements';
import { StatusBadge } from '../../../components/PrototypeChrome';

export default function WorkOrderSummaryCard({ order }) {
  const customer = {
    id: order.customerId,
    name: order.customerName,
    phone: order.customerPhone,
  };
  const vehicle = {
    id: order.vehicleId,
    plate: order.vehiclePlate,
    brand: order.vehicleBrand,
    model: order.vehicleModel,
  };

  return (
    <Card className="lg:col-span-2 space-y-3">
      <div className="flex flex-wrap gap-2">
        <StatusBadge
          label={WorkOrderStatusLabel[order.status]}
          tone={WorkOrderStatusTone[order.status]}
        />
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
          {PaymentStatusLabel[order.paymentStatus]}
        </span>
      </div>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Cliente</dt>
          <dd className="font-medium text-slate-900">
            {customer.id ? (
              <Link to={`/customers/${customer.id}`} className="text-signal hover:underline">
                {customer.name}
              </Link>
            ) : (
              '—'
            )}
          </dd>
          <dd className="text-slate-500">{customer.phone}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Veículo</dt>
          <dd className="font-medium text-slate-900">
            {vehicle.id ? (
              <Link to={`/vehicles/${vehicle.id}`} className="text-signal hover:underline">
                {vehicle.plate} — {vehicle.brand} {vehicle.model}
              </Link>
            ) : (
              '—'
            )}
          </dd>
          <dd>
            {vehicle.id && (
              <Link to={`/vehicles/${vehicle.id}`} className="text-blue-600 hover:underline">
                Ver veículo e histórico
              </Link>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Criada por</dt>
          <dd className="font-medium">{order.createdByName || '—'}</dd>
          <dd className="text-slate-500">{formatDateTime(order.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Mecânico</dt>
          <dd className="font-medium">{order.mechanicName || 'Não atribuído'}</dd>
          <dd className="text-slate-500">Atualizado {formatDateTime(order.updatedAt)}</dd>
        </div>
      </dl>
    </Card>
  );
}
