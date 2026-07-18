import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMockStore } from '../mock/MockStore';
import { Card, FieldLabel, PageHeader, SelectInput, TextInput } from '../components/ui/PageElements';
import { PrototypeBanner } from '../components/PrototypeChrome';
import { showSuccess } from '../services/apiClient';

export default function VehicleForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const store = useMockStore();
  const navigate = useNavigate();
  const existing = id ? store.getVehicle(id) : null;
  const customers = store.listCustomers();

  const [customerId, setCustomerId] = useState(
    existing?.customerId || searchParams.get('customerId') || customers[0]?.id || '',
  );
  const [plate, setPlate] = useState(existing?.plate || '');
  const [brand, setBrand] = useState(existing?.brand || '');
  const [model, setModel] = useState(existing?.model || '');
  const [year, setYear] = useState(existing?.year ? String(existing.year) : '');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!customerId || !plate.trim() || !brand.trim() || !model.trim()) {
      setError('Cliente, placa, marca e modelo são obrigatórios.');
      return;
    }
    try {
      const saved = store.saveVehicle({
        id: existing?.id,
        customerId,
        plate,
        brand,
        model,
        year,
      });
      showSuccess(existing ? 'Veículo atualizado.' : 'Veículo cadastrado.');
      navigate(saved?.id ? `/vehicles/${saved.id}` : '/vehicles');
    } catch (err) {
      setError(err.message || 'Não foi possível salvar.');
    }
  }

  return (
    <div className="space-y-6">
      <PrototypeBanner />
      <PageHeader
        eyebrow="RF-05"
        title={existing ? 'Editar veículo' : 'Novo veículo'}
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
