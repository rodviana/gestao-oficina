import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Card, FieldLabel, PageHeader, SelectInput, TextInput } from '../components/ui/PageElements';
import { PrototypeBanner } from '../components/PrototypeChrome';
import { useAuth } from '../context/AuthContext';
import { fetchAllPages } from '../services/pageUtils';
import { fetchCustomers } from '../services/customerService';
import {
  createVehicle,
  fetchVehicle,
  updateVehicle,
} from '../services/vehicleService';
import { showSuccess } from '../services/apiClient';

export default function VehicleForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { session } = useAuth();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState(searchParams.get('customerId') || '');
  const [plate, setPlate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.token) return undefined;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const customerList = await fetchAllPages((page, pageSize) =>
          fetchCustomers(session.token, { page, pageSize }),
        );
        if (cancelled) return;
        setCustomers(customerList);
        if (!customerId && customerList[0]) {
          setCustomerId(String(customerList[0].id));
        }

        if (isEdit) {
          const vehicle = await fetchVehicle(session.token, id);
          if (cancelled) return;
          setCustomerId(String(vehicle.customerId));
          setPlate(vehicle.plate || '');
          setBrand(vehicle.brand || '');
          setModel(vehicle.model || '');
          setYear(vehicle.year ? String(vehicle.year) : '');
        }
      } catch {
        if (!cancelled && isEdit) navigate('/vehicles');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.token, id, isEdit, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!customerId || !plate.trim() || !brand.trim() || !model.trim()) {
      setError('Cliente, placa, marca e modelo são obrigatórios.');
      return;
    }
    try {
      const payload = {
        customerId: Number(customerId),
        plate: plate.trim(),
        brand: brand.trim(),
        model: model.trim(),
        year: year ? Number(year) : null,
      };
      const saved = isEdit
        ? await updateVehicle(session.token, id, { ...payload, active: true })
        : await createVehicle(session.token, payload);
      showSuccess(isEdit ? 'Veículo atualizado.' : 'Veículo cadastrado.');
      navigate(saved?.id ? `/vehicles/${saved.id}` : '/vehicles');
    } catch (err) {
      setError(err.message || 'Não foi possível salvar.');
    }
  }

  if (loading) {
    return <p className="p-6 text-sm text-ink-500">Carregando…</p>;
  }

  return (
    <div className="space-y-6">
      <PrototypeBanner />
      <PageHeader
        eyebrow="RF-05"
        title={isEdit ? 'Editar veículo' : 'Novo veículo'}
        description="Vincule o veículo a um cliente. A placa identifica o carro."
        backTo="/vehicles"
      />

      <Card>
        <form className="mx-auto max-w-lg space-y-4" onSubmit={handleSubmit}>
          <div>
            <FieldLabel htmlFor="customerId">Cliente</FieldLabel>
            <SelectInput id="customerId" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
              <option value="">Selecione</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </SelectInput>
          </div>
          <div>
            <FieldLabel htmlFor="plate">Placa</FieldLabel>
            <TextInput id="plate" value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="brand">Marca</FieldLabel>
              <TextInput id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
            <div>
              <FieldLabel htmlFor="model">Modelo</FieldLabel>
              <TextInput id="model" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="year">Ano</FieldLabel>
            <TextInput id="year" value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary">
            Salvar
          </button>
        </form>
      </Card>
    </div>
  );
}
