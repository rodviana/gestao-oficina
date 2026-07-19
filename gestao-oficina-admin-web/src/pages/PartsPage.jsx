import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DEFAULT_PAGE_SIZE } from '../constants/pagination';
import {
  Card,
  EmptyState,
  FieldLabel,
  PageHeader,
  SelectInput,
  TextInput,
} from '../components/ui/PageElements';
import { Pagination } from '../components/ui/Pagination';
import { showSuccess } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../constants/userRole';
import { usePagedSearch } from '../hooks/usePagedSearch';
import {
  createPartCatalogItem,
  fetchPartCatalog,
  updatePartCatalogItem,
} from '../services/catalogService';

export default function PartsPage() {
  const { session } = useAuth();
  const [query, setQuery] = useState('');
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [active, setActive] = useState(true);
  const [error, setError] = useState('');

  const { items, total, page, pageSize, pageMaxNumber, loading, setPage, reload } = usePagedSearch({
    token: session?.token,
    query,
    pageSize: DEFAULT_PAGE_SIZE,
    fetcher: (token, { search, page: p, pageSize: size }) =>
      fetchPartCatalog(token, { search, page: p, pageSize: size }),
  });

  if (session?.role === UserRole.MECHANIC) {
    return <Navigate to="/pista" replace />;
  }

  const canEdit = session?.role === UserRole.ADMIN || session?.role === UserRole.ATTENDANT;

  function resetForm() {
    setName('');
    setEditId(null);
    setActive(true);
    setError('');
  }

  function startEdit(item) {
    setEditId(item.id);
    setName(item.name);
    setActive(item.active);
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Informe o nome da peça.');
      return;
    }
    if (editId) {
      await updatePartCatalogItem(session.token, editId, { name: name.trim(), active });
      showSuccess('Peça atualizada.');
    } else {
      await createPartCatalogItem(session.token, { name: name.trim(), active: true });
      showSuccess('Peça cadastrada.');
    }
    await reload();
    resetForm();
  }

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Peças · RF-13"
        title="Peças"
        description="Catálogo de peças. O preço é informado na hora do lançamento na OS."
      />

      {canEdit && (
        <Card>
          <form className="grid gap-3 md:grid-cols-3" onSubmit={handleSubmit}>
            <div className="md:col-span-2">
              <FieldLabel htmlFor="part-name">Nome</FieldLabel>
              <TextInput id="part-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {editId && (
              <div>
                <FieldLabel htmlFor="part-active">Situação</FieldLabel>
                <SelectInput
                  id="part-active"
                  value={active ? '1' : '0'}
                  onChange={(e) => setActive(e.target.value === '1')}
                >
                  <option value="1">Ativo</option>
                  <option value="0">Inativo</option>
                </SelectInput>
              </div>
            )}
            <div className="flex items-end gap-2 md:col-span-3">
              <button type="submit" className="btn-primary">
                {editId ? 'Salvar alteração' : 'Adicionar'}
              </button>
              {editId && (
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </form>
        </Card>
      )}

      <Card>
        <FieldLabel htmlFor="part-q">Buscar</FieldLabel>
        <TextInput
          id="part-q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nome da peça"
        />
      </Card>

      <div className="table-shell">
        {loading ? (
          <p className="p-6 text-sm text-ink-500">Carregando peças…</p>
        ) : items.length === 0 ? (
          <EmptyState title="Nenhuma peça" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Situação</th>
                    {canEdit && <th />}
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => (
                    <tr key={row.id}>
                      <td className="font-medium text-ink-900">{row.name}</td>
                      <td>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            row.active
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-ink-100 text-ink-500'
                          }`}
                        >
                          {row.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      {canEdit && (
                        <td className="text-right">
                          <button
                            type="button"
                            className="text-sm font-semibold text-signal hover:underline"
                            onClick={() => startEdit(row)}
                          >
                            Editar
                          </button>
                        </td>
                      )}
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
