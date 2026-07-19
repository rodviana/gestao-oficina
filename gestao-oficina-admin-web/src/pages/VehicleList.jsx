import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  EmptyState,
  FieldLabel,
  PageHeader,
  TextInput,
} from '../components/ui/PageElements';
import { Pagination } from '../components/ui/Pagination';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../constants/userRole';
import { DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { usePagedSearch } from '../hooks/usePagedSearch';
import { fetchVehicles } from '../services/vehicleService';

export default function VehicleList() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [query, setQuery] = useState('');
  const canEdit = session?.role === UserRole.ADMIN || session?.role === UserRole.ATTENDANT;

  const { items, total, page, pageSize, pageMaxNumber, loading, setPage } = usePagedSearch({
    token: session?.token,
    query,
    pageSize: DEFAULT_PAGE_SIZE,
    fetcher: (token, { search, page: p, pageSize: size }) =>
      fetchVehicles(token, { search, page: p, pageSize: size }),
  });

  return (
    <div className="page-shell">
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
        {loading ? (
          <p className="p-6 text-sm text-ink-500">Carregando veículos…</p>
        ) : items.length === 0 ? (
          <EmptyState
            title="Nenhum veículo"
            description="Cadastre um veículo vinculado a um cliente."
          />
        ) : (
          <>
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
                  {items.map((v) => (
                    <tr
                      key={v.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/vehicles/${v.id}`)}
                    >
                      <td className="font-display font-bold text-ink-900">{v.plate}</td>
                      <td>
                        {v.brand} {v.model} {v.year ? `(${v.year})` : ''}
                      </td>
                      <td>{v.customerName || '—'}</td>
                      <td className="text-right text-xs font-semibold text-signal">
                        Ver detalhe →
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={page}
              pageMaxNumber={pageMaxNumber}
              totalNumber={total}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
