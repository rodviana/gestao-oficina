import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  PaymentStatusLabel,
  WorkOrderStatusLabel,
  WorkOrderStatusTone,
  formatDate,
  formatMoney,
} from '../constants/labels';
import { DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { workOrderTotal } from '../utils/workOrderUtils';
import {
  Card,
  EmptyState,
  FieldLabel,
  PageHeader,
  SelectInput,
  TextInput,
} from '../components/ui/PageElements';
import { Pagination } from '../components/ui/Pagination';
import { PrototypeBanner, StatusBadge } from '../components/PrototypeChrome';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../constants/userRole';
import { showSuccess } from '../services/apiClient';
import { emptyPageResult, fetchAllPages } from '../services/pageUtils';
import { fetchCustomer, fetchCustomers } from '../services/customerService';
import {
  fetchVehicle,
  fetchVehicleHistory,
  updateVehicle,
} from '../services/vehicleService';

export default function VehicleDetail() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const canEdit = session?.role === UserRole.ADMIN || session?.role === UserRole.ATTENDANT;

  const [vehicle, setVehicle] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [ordersPage, setOrdersPage] = useState(() => emptyPageResult());
  const [historyPage, setHistoryPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const editing = searchParams.get('edit') === '1' && canEdit;

  const [customerId, setCustomerId] = useState('');
  const [plate, setPlate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.token) return undefined;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const [vehicleData, customerList] = await Promise.all([
          fetchVehicle(session.token, id),
          fetchAllPages((page, pageSize) => fetchCustomers(session.token, { page, pageSize })),
        ]);
        if (cancelled) return;

        const customerData = vehicleData.customerId
          ? await fetchCustomer(session.token, vehicleData.customerId)
          : null;

        setVehicle(vehicleData);
        setCustomer(customerData);
        setCustomers(customerList);
        setCustomerId(String(vehicleData.customerId || ''));
        setPlate(vehicleData.plate || '');
        setBrand(vehicleData.brand || '');
        setModel(vehicleData.model || '');
        setYear(vehicleData.year ? String(vehicleData.year) : '');
      } catch {
        if (!cancelled) setVehicle(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.token, id]);

  useEffect(() => {
    if (!session?.token || !id) return undefined;
    let cancelled = false;

    (async () => {
      try {
        const page = await fetchVehicleHistory(session.token, id, {
          page: historyPage,
          pageSize: DEFAULT_PAGE_SIZE,
        });
        if (!cancelled) {
          setOrdersPage(page);
          if (page.page !== historyPage) setHistoryPage(page.page);
        }
      } catch {
        if (!cancelled) setOrdersPage(emptyPageResult());
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.token, id, historyPage]);

  if (loading) {
    return (
      <div className="page-shell">
        <p className="text-sm text-ink-500">Carregando veículo…</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="page-shell">
        <PrototypeBanner />
        <EmptyState
          title="Veículo não encontrado"
          action={
            <Link to="/vehicles" className="btn-secondary">
              Voltar à lista
            </Link>
          }
        />
      </div>
    );
  }

  function startEdit() {
    setCustomerId(String(vehicle.customerId));
    setPlate(vehicle.plate);
    setBrand(vehicle.brand);
    setModel(vehicle.model);
    setYear(vehicle.year ? String(vehicle.year) : '');
    setError('');
    setSearchParams({ edit: '1' });
  }

  function cancelEdit() {
    setSearchParams({});
    setError('');
  }

  async function handleSave(event) {
    event.preventDefault();
    setError('');
    if (!customerId || !plate.trim() || !brand.trim() || !model.trim()) {
      setError('Cliente, placa, marca e modelo são obrigatórios.');
      return;
    }
    try {
      const updated = await updateVehicle(session.token, vehicle.id, {
        customerId: Number(customerId),
        plate: plate.trim(),
        brand: brand.trim(),
        model: model.trim(),
        year: year ? Number(year) : null,
        active: vehicle.active !== false,
      });
      setVehicle(updated);
      const customerData = await fetchCustomer(session.token, updated.customerId);
      setCustomer(customerData);
      showSuccess('Veículo atualizado.');
      setSearchParams({});
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page-shell">
      <PrototypeBanner />
      <PageHeader
        eyebrow="Veículo · RF-05 · RF-11"
        title={vehicle.plate}
        description={`${vehicle.brand} ${vehicle.model}${vehicle.year ? ` · ${vehicle.year}` : ''}`}
        backTo="/vehicles"
        actions={
          canEdit ? (
            editing ? (
              <button
                type="button"
                className="btn-secondary !border-white/20 !bg-white/10 !text-white"
                onClick={cancelEdit}
              >
                Cancelar edição
              </button>
            ) : (
              <>
                <Link
                  to={`/work-orders/new?customerId=${vehicle.customerId}&vehicleId=${vehicle.id}`}
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
        <Card className="space-y-4 lg:col-span-1">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-ink-400">
            Dados
          </h2>
          {editing ? (
            <form className="space-y-3" onSubmit={handleSave}>
              <div>
                <FieldLabel htmlFor="customerId">Cliente</FieldLabel>
                <SelectInput
                  id="customerId"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </SelectInput>
              </div>
              <div>
                <FieldLabel htmlFor="plate">Placa</FieldLabel>
                <TextInput
                  id="plate"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                />
              </div>
              <div>
                <FieldLabel htmlFor="brand">Marca</FieldLabel>
                <TextInput id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="model">Modelo</FieldLabel>
                <TextInput id="model" value={model} onChange={(e) => setModel(e.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="year">Ano</FieldLabel>
                <TextInput id="year" value={year} onChange={(e) => setYear(e.target.value)} />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" className="btn-primary w-full">
                Salvar alterações
              </button>
            </form>
          ) : (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-ink-400">Cliente</dt>
                <dd>
                  {customer ? (
                    <button
                      type="button"
                      className="font-semibold text-signal hover:underline"
                      onClick={() => navigate(`/customers/${customer.id}`)}
                    >
                      {customer.name}
                    </button>
                  ) : (
                    vehicle.customerName || '—'
                  )}
                </dd>
                {customer && <dd className="text-ink-500">{customer.phone}</dd>}
              </div>
              <div>
                <dt className="text-ink-400">Marca / modelo</dt>
                <dd className="font-semibold text-ink-900">
                  {vehicle.brand} {vehicle.model}
                </dd>
              </div>
              <div>
                <dt className="text-ink-400">Ano</dt>
                <dd className="font-semibold text-ink-900">{vehicle.year || '—'}</dd>
              </div>
              <div>
                <dt className="text-ink-400">Atendimentos</dt>
                <dd className="font-display text-2xl font-bold text-ink-900">
                  {ordersPage.total}
                </dd>
              </div>
            </dl>
          )}
        </Card>

        <Card className="lg:col-span-2" padding={false}>
          <div className="border-b border-ink-100 px-6 py-4">
            <h2 className="font-display text-lg font-bold text-ink-900">Histórico de atendimentos</h2>
            <p className="text-sm text-ink-500">Todas as OS desta placa.</p>
          </div>
          {ordersPage.items.length === 0 ? (
            <EmptyState title="Sem histórico" description="Ainda não há OS para este veículo." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>OS</th>
                      <th>Data</th>
                      <th>Status</th>
                      <th>Pagamento</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersPage.items.map((wo) => (
                      <tr
                        key={wo.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/work-orders/${wo.id}`)}
                      >
                        <td>
                          <span className="font-display font-bold text-signal">{wo.number}</span>
                          <p className="line-clamp-1 text-xs text-ink-400">{wo.description}</p>
                        </td>
                        <td>{formatDate(wo.createdAt)}</td>
                        <td>
                          <StatusBadge
                            label={WorkOrderStatusLabel[wo.status]}
                            tone={WorkOrderStatusTone[wo.status]}
                          />
                        </td>
                        <td>{PaymentStatusLabel[wo.paymentStatus]}</td>
                        <td className="text-right font-bold">{formatMoney(workOrderTotal(wo))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={ordersPage.page}
                pageMaxNumber={ordersPage.pageMaxNumber}
                totalNumber={ordersPage.total}
                pageSize={ordersPage.pageSize}
                onPageChange={setHistoryPage}
              />
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
