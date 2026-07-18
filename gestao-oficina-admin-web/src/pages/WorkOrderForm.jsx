import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMockStore } from '../mock/MockStore';
import { Card, FieldLabel, PageHeader, SelectInput } from '../components/ui/PageElements';
import { PrototypeBanner } from '../components/PrototypeChrome';
import { useAuth } from '../context/AuthContext';
import { showSuccess } from '../services/apiClient';

export default function WorkOrderForm() {
  const store = useMockStore();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const customers = store.listCustomers();
  const mechanics = store.mechanics();

  const [customerId, setCustomerId] = useState(
    searchParams.get('customerId') || customers[0]?.id || '',
  );
  const [vehicleId, setVehicleId] = useState(searchParams.get('vehicleId') || '');
  const [description, setDescription] = useState('');
  const [mechanicId, setMechanicId] = useState('');
  const [error, setError] = useState('');

  const vehicles = useMemo(
    () => (customerId ? store.listVehicles({ customerId }) : []),
    [store, customerId],
  );

  useEffect(() => {
    if (vehicleId && !vehicles.some((v) => v.id === vehicleId)) {
      setVehicleId(vehicles[0]?.id || '');
    } else if (!vehicleId && vehicles[0]) {
      setVehicleId(vehicles[0].id);
    }
  }, [vehicles, vehicleId]);

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!customerId || !vehicleId || !description.trim()) {
      setError('Cliente, veículo e descrição são obrigatórios.');
      return;
    }
    const creator =
      store.listUsers().find((u) => u.email === session?.email)?.id || 'u-1';
    const saved = store.createWorkOrder({
      customerId,
      vehicleId,
      description,
      mechanicId: mechanicId || null,
      createdById: creator,
    });
    showSuccess('Ordem de serviço aberta.');
    navigate(`/work-orders/${saved.id}`);
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
              {vehicles.map((v) => (
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
