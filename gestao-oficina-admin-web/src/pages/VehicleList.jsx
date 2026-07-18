import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMockStore } from '../mock/MockStore';
import {
  Card,
  EmptyState,
  FieldLabel,
  PageHeader,
  TextInput,
} from '../components/ui/PageElements';
import { PrototypeBanner } from '../components/PrototypeChrome';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../constants/userRole';

export default function VehicleList() {
  const store = useMockStore();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [query, setQuery] = useState('');
  const canEdit = session?.role === UserRole.ADMIN || session?.role === UserRole.ATTENDANT;

  const vehicles = useMemo(() => store.listVehicles({ query }), [store, query]);

  return (
    <div className="page-shell">
      <PrototypeBanner />
      <PageHeader
        eyebrow="RF-05"
        title="Veículos"
        description="Clique em um veículo para ver dados, cliente e histórico de OS."
        actions={
          canEdit ? (
            <Link to="/vehicles/new" className="btn-primary">
              Novo veículo
            </Link>
          ) : null
        }
      />

      <Card>
        <FieldLabel htmlFor="vehicle-q">Buscar</FieldLabel>
        <TextInput
          id="vehicle-q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Placa, marca ou modelo"
        />
      </Card>

      <div className="table-shell">
        {vehicles.length === 0 ? (
          <EmptyState title="Nenhum veículo" description="Cadastre um veículo vinculado a um cliente." />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Veículo</th>
                  <th>Cliente</th>
                  <th className="text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => {
                  const customer = store.getCustomer(v.customerId);
                  return (
                    <tr
                      key={v.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/vehicles/${v.id}`)}
                    >
                      <td className="font-display font-bold text-ink-900">{v.plate}</td>
                      <td>
                        {v.brand} {v.model} {v.year ? `(${v.year})` : ''}
                      </td>
                      <td>{customer?.name || '—'}</td>
                      <td className="text-right text-xs font-semibold text-signal">Ver detalhe →</td>
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
