import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMockStore } from '../mock/MockStore';
import {
  PaymentStatus,
  PaymentStatusLabel,
  WorkOrderStatus,
  WorkOrderStatusLabel,
  WorkOrderStatusTone,
  formatDate,
  formatMoney,
} from '../mock/labels';
import { workOrderTotal } from '../mock/seed';
import {
  Card,
  EmptyState,
  FieldLabel,
  PageHeader,
  SelectInput,
  TextInput,
} from '../components/ui/PageElements';
import { PrototypeBanner, StatusBadge } from '../components/PrototypeChrome';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../constants/userRole';

/** Lista filtrável de OS — diferente do Kanban do Início. */
export default function WorkOrderList() {
  const store = useMockStore();
  const navigate = useNavigate();
  const { session } = useAuth();
  const canCreate = session?.role === UserRole.ADMIN || session?.role === UserRole.ATTENDANT;

  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [query, setQuery] = useState('');

  const orders = useMemo(
    () =>
      store.listWorkOrders({
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        query: query || undefined,
      }),
    [store, status, paymentStatus, query],
  );

  return (
    <div className="page-shell">
      <PrototypeBanner />
      <PageHeader
        eyebrow="Lista · RF-07"
        title="Ordens de serviço"
        description="Consulta tabular com filtros. O quadro em andamento fica no início."
        actions={
          <>
            <Link
              to="/pista"
              className="btn-secondary !border-white/20 !bg-white/10 !text-white hover:!bg-white/20"
            >
              Em andamento
            </Link>
            {canCreate && (
              <Link to="/work-orders/new" className="btn-primary">
                Nova OS
              </Link>
            )}
          </>
        }
      />

      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <SelectInput id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Todos</option>
              {Object.values(WorkOrderStatus).map((s) => (
                <option key={s} value={s}>
                  {WorkOrderStatusLabel[s]}
                </option>
              ))}
            </SelectInput>
          </div>
          <div>
            <FieldLabel htmlFor="payment">Pagamento</FieldLabel>
            <SelectInput
              id="payment"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="">Todos</option>
              {Object.values(PaymentStatus).map((s) => (
                <option key={s} value={s}>
                  {PaymentStatusLabel[s]}
                </option>
              ))}
            </SelectInput>
          </div>
          <div>
            <FieldLabel htmlFor="q">Busca</FieldLabel>
            <TextInput
              id="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="OS, placa, cliente..."
            />
          </div>
        </div>
      </Card>

      <div className="table-shell">
        <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
          <p className="text-sm font-semibold text-ink-700">
            {orders.length} ordem{orders.length === 1 ? '' : 'ns'}
          </p>
          <p className="text-xs text-ink-400">Clique na linha para abrir o detalhe</p>
        </div>
        {orders.length === 0 ? (
          <EmptyState title="Nenhuma OS encontrada" />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>OS</th>
                  <th>Cliente / placa</th>
                  <th>Problema</th>
                  <th>Aberta em</th>
                  <th>Status</th>
                  <th>Pagamento</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((wo) => {
                  const customer = store.getCustomer(wo.customerId);
                  const vehicle = store.getVehicle(wo.vehicleId);
                  return (
                    <tr
                      key={wo.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/work-orders/${wo.id}`)}
                    >
                      <td className="font-display font-bold text-signal">{wo.number}</td>
                      <td>
                        {customer?.name}
                        <span className="block text-xs text-ink-400">{vehicle?.plate}</span>
                      </td>
                      <td className="max-w-[220px]">
                        <span className="line-clamp-2 text-ink-600">{wo.description}</span>
                      </td>
                      <td>{formatDate(wo.createdAt)}</td>
                      <td>
                        <StatusBadge
                          label={WorkOrderStatusLabel[wo.status]}
                          tone={WorkOrderStatusTone[wo.status]}
                        />
                      </td>
                      <td>{PaymentStatusLabel[wo.paymentStatus]}</td>
                      <td className="text-right font-bold text-ink-900">
                        {formatMoney(workOrderTotal(wo))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
