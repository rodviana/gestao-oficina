import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { useDebouncedSearch } from '../hooks/useDebouncedSearch';
import { fetchCustomers } from '../services/customerService';
import { fetchAllPages } from '../services/pageUtils';
import { fetchVehicles } from '../services/vehicleService';

export default function CustomerList() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [query, setQuery] = useState('');
  const canEdit = session?.role === UserRole.ADMIN || session?.role === UserRole.ATTENDANT;

  const { data: customers, loading } = useDebouncedSearch({
    token: session?.token,
    query,
    fetcher: (token, search) => fetchCustomers(token, { search, page: 0, pageSize: 100 }),
  });

  const { vehicleCounts } = useVehicleCounts(session?.token);

  return (
    <div className="page-shell">
      <PrototypeBanner />
      <PageHeader
        eyebrow="RF-04"
        title="Clientes"
        description="Clique em um cliente para ver o detalhe completo."
        actions={
          canEdit ? (
            <Link to="/customers/new" className="btn-primary">
              Novo cliente
            </Link>
          ) : null
        }
      />

      <Card>
        <FieldLabel htmlFor="customer-q">Buscar</FieldLabel>
        <TextInput
          id="customer-q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nome, telefone ou documento"
        />
      </Card>

      <div className="table-shell">
        {loading ? (
          <p className="p-6 text-sm text-ink-500">Carregando clientes…</p>
        ) : customers.length === 0 ? (
          <EmptyState title="Nenhum cliente" description="Cadastre o primeiro cliente." />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Documento</th>
                  <th>Veículos</th>
                  <th className="text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr
                    key={c.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/customers/${c.id}`)}
                  >
                    <td className="font-display font-bold text-ink-900">{c.name}</td>
                    <td>{c.phone}</td>
                    <td>{c.document || '—'}</td>
                    <td>{vehicleCounts[c.id] ?? '—'}</td>
                    <td className="text-right text-xs font-semibold text-signal">Ver detalhe →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function useVehicleCounts(token) {
  const [vehicleCounts, setVehicleCounts] = useState({});

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;

    (async () => {
      try {
        const vehicles = await fetchAllPages((page, pageSize) => fetchVehicles(token, { page, pageSize }));
        const counts = {};
        vehicles.forEach((v) => {
          counts[v.customerId] = (counts[v.customerId] || 0) + 1;
        });
        if (!cancelled) setVehicleCounts(counts);
      } catch {
        if (!cancelled) setVehicleCounts({});
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return { vehicleCounts };
}
