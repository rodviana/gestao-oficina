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
import { PrototypeBanner } from '../components/PrototypeChrome';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../constants/userRole';
import { DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { usePagedSearch } from '../hooks/usePagedSearch';
import { fetchCustomers } from '../services/customerService';

export default function CustomerList() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [query, setQuery] = useState('');
  const canEdit = session?.role === UserRole.ADMIN || session?.role === UserRole.ATTENDANT;

  const { items, total, page, pageSize, pageMaxNumber, loading, setPage } = usePagedSearch({
    token: session?.token,
    query,
    pageSize: DEFAULT_PAGE_SIZE,
    fetcher: (token, { search, page: p, pageSize: size }) =>
      fetchCustomers(token, { search, page: p, pageSize: size }),
  });

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
        ) : items.length === 0 ? (
          <EmptyState title="Nenhum cliente" description="Cadastre o primeiro cliente." />
        ) : (
          <>
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
                  {items.map((c) => (
                    <tr
                      key={c.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/customers/${c.id}`)}
                    >
                      <td className="font-display font-bold text-ink-900">{c.name}</td>
                      <td>{c.phone}</td>
                      <td>{c.document || '—'}</td>
                      <td>{c.vehicleCount ?? '—'}</td>
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
