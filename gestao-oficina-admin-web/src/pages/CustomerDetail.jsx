import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMockStore } from '../mock/MockStore';
import {
  PaymentStatusLabel,
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
  TextInput,
} from '../components/ui/PageElements';
import { PrototypeBanner, StatusBadge } from '../components/PrototypeChrome';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../constants/userRole';
import { showSuccess } from '../services/apiClient';

export default function CustomerDetail() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const store = useMockStore();
  const navigate = useNavigate();
  const { session } = useAuth();
  const canEdit = session?.role === UserRole.ADMIN || session?.role === UserRole.ATTENDANT;

  const customer = store.getCustomer(id);
  const editing = searchParams.get('edit') === '1' && canEdit;

  const vehicles = useMemo(
    () => (customer ? store.listVehicles({ customerId: customer.id }) : []),
    [store, customer],
  );
  const orders = useMemo(
    () => (customer ? store.listWorkOrders({ customerId: customer.id }) : []),
    [store, customer],
  );

  const [name, setName] = useState(customer?.name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [document, setDocument] = useState(customer?.document || '');
  const [error, setError] = useState('');

  if (!customer) {
    return (
      <div className="page-shell">
        <PrototypeBanner />
        <EmptyState
          title="Cliente não encontrado"
          action={
            <Link to="/customers" className="btn-secondary">
              Voltar à lista
            </Link>
          }
        />
      </div>
    );
  }

  function startEdit() {
    setName(customer.name);
    setPhone(customer.phone);
    setDocument(customer.document || '');
    setError('');
    setSearchParams({ edit: '1' });
  }

  function cancelEdit() {
    setSearchParams({});
    setError('');
  }

  function handleSave(event) {
    event.preventDefault();
    setError('');
    if (!name.trim() || !phone.trim()) {
      setError('Nome e telefone são obrigatórios.');
      return;
    }
    store.saveCustomer({ id: customer.id, name, phone, document });
    showSuccess('Cliente atualizado.');
    setSearchParams({});
  }

  return (
    <div className="page-shell">
      <PrototypeBanner />
      <PageHeader
        eyebrow="Cliente · RF-04"
        title={customer.name}
        description={`Cadastrado em ${formatDate(customer.createdAt)}`}
        backTo="/customers"
        actions={
          canEdit ? (
            editing ? (
              <button type="button" className="btn-secondary !border-white/20 !bg-white/10 !text-white" onClick={cancelEdit}>
                Cancelar edição
              </button>
            ) : (
              <>
                <Link
                  to={`/work-orders/new?customerId=${customer.id}`}
                  className="btn-secondary !border-white/20 !bg-white/10 !text-white hover:!bg-white/20"
                >
                  Nova OS
                </Link>
                <button type="button" className="btn-primary" onClick={startEdit}>
                  Editar
                </button>
              </>
            )
          ) : null
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1 space-y-4">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-ink-400">
            Dados
          </h2>
          {editing ? (
            <form className="space-y-3" onSubmit={handleSave}>
              <div>
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <TextInput id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="phone">Telefone</FieldLabel>
                <TextInput id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="document">Documento</FieldLabel>
                <TextInput
                  id="document"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" className="btn-primary w-full">
                Salvar alterações
              </button>
            </form>
          ) : (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-ink-400">Telefone</dt>
                <dd className="font-semibold text-ink-900">{customer.phone}</dd>
              </div>
              <div>
                <dt className="text-ink-400">Documento</dt>
                <dd className="font-semibold text-ink-900">{customer.document || '—'}</dd>
              </div>
              <div>
                <dt className="text-ink-400">Veículos</dt>
                <dd className="font-display text-2xl font-bold text-ink-900">{vehicles.length}</dd>
              </div>
              <div>
                <dt className="text-ink-400">Ordens de serviço</dt>
                <dd className="font-display text-2xl font-bold text-ink-900">{orders.length}</dd>
              </div>
            </dl>
          )}
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold text-ink-900">Veículos</h2>
              {canEdit && (
                <Link
                  to={`/vehicles/new?customerId=${customer.id}`}
                  className="btn-secondary !px-3 !py-1.5 !text-xs"
                >
                  Novo veículo
                </Link>
              )}
            </div>
            {vehicles.length === 0 ? (
              <EmptyState title="Nenhum veículo" description="Vincule um carro a este cliente." />
            ) : (
              <ul className="divide-y divide-ink-100">
                {vehicles.map((v) => (
                  <li key={v.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-3 py-3 text-left transition hover:bg-ink-50/80"
                      onClick={() => navigate(`/vehicles/${v.id}`)}
                    >
                      <div>
                        <p className="font-display font-bold text-ink-900">{v.plate}</p>
                        <p className="text-sm text-ink-500">
                          {v.brand} {v.model} {v.year ? `(${v.year})` : ''}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-signal">Ver detalhe →</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card padding={false}>
            <div className="border-b border-ink-100 px-6 py-4">
              <h2 className="font-display text-lg font-bold text-ink-900">Histórico de OS</h2>
            </div>
            {orders.length === 0 ? (
              <EmptyState title="Sem ordens" description="Ainda não há OS para este cliente." />
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>OS</th>
                      <th>Placa</th>
                      <th>Data</th>
                      <th>Status</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((wo) => {
                      const vehicle = store.getVehicle(wo.vehicleId);
                      return (
                        <tr
                          key={wo.id}
                          className="cursor-pointer"
                          onClick={() => navigate(`/work-orders/${wo.id}`)}
                        >
                          <td className="font-display font-bold text-signal">{wo.number}</td>
                          <td>{vehicle?.plate}</td>
                          <td>{formatDate(wo.createdAt)}</td>
                          <td>
                            <StatusBadge
                              label={WorkOrderStatusLabel[wo.status]}
                              tone={WorkOrderStatusTone[wo.status]}
                            />
                          </td>
                          <td className="text-right font-bold">
                            {formatMoney(workOrderTotal(wo))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
