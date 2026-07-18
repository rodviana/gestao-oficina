import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, FieldLabel, PageHeader, SelectInput } from '../components/ui/PageElements';
import { PrototypeBanner } from '../components/PrototypeChrome';
import { useAuth } from '../context/AuthContext';
import { showSuccess } from '../services/apiClient';
import { fetchAllPages } from '../services/pageUtils';
import { fetchCustomers } from '../services/customerService';
import { fetchVehiclesByCustomer } from '../services/vehicleService';
import { fetchMechanics } from '../services/authService';
import { createWorkOrder } from '../services/workOrderService';

export default function WorkOrderForm() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [customers, setCustomers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [customerId, setCustomerId] = useState(searchParams.get('customerId') || '');
  const [vehicleId, setVehicleId] = useState(searchParams.get('vehicleId') || '');
  const [description, setDescription] = useState('');
  const [mechanicId, setMechanicId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.token) return undefined;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const [customerList, mechanicList] = await Promise.all([
          fetchAllPages((page, pageSize) => fetchCustomers(session.token, { page, pageSize })),
          fetchMechanics(session.token),
        ]);
        if (cancelled) return;
        setCustomers(customerList);
        setMechanics(mechanicList);
        if (!customerId && customerList[0]) {
          setCustomerId(String(customerList[0].id));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.token]);

  useEffect(() => {
    if (!session?.token || !customerId) {
      setVehicles([]);
      return undefined;
    }
    let cancelled = false;

    (async () => {
      try {
        const list = await fetchVehiclesByCustomer(session.token, customerId);
        if (cancelled) return;
        setVehicles(list);
        if (vehicleId && !list.some((v) => String(v.id) === String(vehicleId))) {
          setVehicleId(list[0] ? String(list[0].id) : '');
        } else if (!vehicleId && list[0]) {
          setVehicleId(String(list[0].id));
        }
      } catch {
        if (!cancelled) setVehicles([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.token, customerId, vehicleId]);

  const vehicleOptions = useMemo(() => vehicles, [vehicles]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!customerId || !vehicleId || !description.trim()) {
      setError('Cliente, veículo e descrição são obrigatórios.');
      return;
    }
    try {
      const saved = await createWorkOrder(session.token, {
        customerId: Number(customerId),
        vehicleId: Number(vehicleId),
        description: description.trim(),
        mechanicId: mechanicId ? Number(mechanicId) : undefined,
      });
      showSuccess('Ordem de serviço aberta.');
      navigate(`/work-orders/${saved.id}`);
    } catch (err) {
      setError(err.message || 'Não foi possível abrir a OS.');
    }
  }

  if (loading) {
    return <p className="p-6 text-sm text-ink-500">Carregando…</p>;
  }

  return (
    <div className="space-y-6">
      <PrototypeBanner />
      <PageHeader
        eyebrow="RF-07"
        title="Nova ordem de serviço"
        description="Registre o atendimento com cliente, veículo e relato do problema."
        backTo="/work-orders"
      />

      <Card>
        <form className="mx-auto max-w-xl space-y-4" onSubmit={handleSubmit}>
          <div>
            <FieldLabel htmlFor="customerId">Cliente</FieldLabel>
            <SelectInput
              id="customerId"
              value={customerId}
              onChange={(e) => {
                setCustomerId(e.target.value);
                setVehicleId('');
              }}
            >
              <option value="">Selecione</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </SelectInput>
          </div>
          <div>
            <FieldLabel htmlFor="vehicleId">Veículo</FieldLabel>
            <SelectInput
              id="vehicleId"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              disabled={!customerId}
            >
              <option value="">Selecione</option>
              {vehicleOptions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plate} — {v.brand} {v.model}
                </option>
              ))}
            </SelectInput>
          </div>
          <div>
            <FieldLabel htmlFor="description">Descrição do problema</FieldLabel>
            <textarea
              id="description"
              className="input-field min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="mechanicId">Mecânico (opcional)</FieldLabel>
            <SelectInput
              id="mechanicId"
              value={mechanicId}
              onChange={(e) => setMechanicId(e.target.value)}
            >
              <option value="">Não atribuído</option>
              {mechanics.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </SelectInput>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary">
            Abrir OS
          </button>
        </form>
      </Card>
    </div>
  );
}
