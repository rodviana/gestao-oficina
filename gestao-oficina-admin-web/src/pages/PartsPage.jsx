import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMockStore } from '../mock/MockStore';
import {
  Card,
  EmptyState,
  FieldLabel,
  PageHeader,
  SelectInput,
  TextInput,
} from '../components/ui/PageElements';
import { showSuccess } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../constants/userRole';

export default function PartsPage() {
  const store = useMockStore();
  const { session } = useAuth();

  if (session?.role === UserRole.MECHANIC) {
    return <Navigate to="/pista" replace />;
  }

  const canEdit = session?.role === UserRole.ADMIN || session?.role === UserRole.ATTENDANT;
  const parts = store.listPartCatalog();
  const [query, setQuery] = useState('');
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [active, setActive] = useState(true);
  const [error, setError] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return parts;
    return parts.filter((p) => p.name.toLowerCase().includes(q));
  }, [parts, query]);

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

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Informe o nome da peça.');
      return;
    }
    store.savePartCatalogItem({
      id: editId || undefined,
      name,
      active,
    });
    showSuccess(editId ? 'Peça atualizada.' : 'Peça cadastrada.');
    resetForm();
  }

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Peças · RF-09 · RF-12"
        title="Peças"
        description="Lista de peças para usar nas OS. O preço cobrado é informado só na hora do lançamento."
      />

      <div className="rounded-2xl border border-signal/20 bg-signal-soft/40 px-4 py-3 text-sm text-ink-800">
        <p className="font-semibold text-ink-900">Sem preço no cadastro</p>
        <p className="mt-0.5 text-ink-600">
          Aqui fica só o nome. O valor cobrado muda de OS para OS e é digitado ao lançar a peça.
        </p>
      </div>

      {canEdit && (
        <Card>
          <h2 className="mb-3 font-display text-lg font-bold text-ink-900">
            {editId ? 'Editar peça' : 'Nova peça'}
          </h2>
          <form className="grid gap-3 md:grid-cols-6" onSubmit={handleSubmit}>
            <div className="md:col-span-4">
              <FieldLabel htmlFor="part-name">Nome da peça</FieldLabel>
              <TextInput
                id="part-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Pastilha de freio (jogo)"
              />
            </div>
            {editId && (
              <div className="md:col-span-2">
                <FieldLabel htmlFor="part-active">Situação</FieldLabel>
                <SelectInput
                  id="part-active"
                  value={active ? '1' : '0'}
                  onChange={(e) => setActive(e.target.value === '1')}
                >
                  <option value="1">Ativa</option>
                  <option value="0">Inativa</option>
                </SelectInput>
              </div>
            )}
            <div className="flex flex-wrap items-end gap-2 md:col-span-6">
              <button type="submit" className="btn-primary">
                {editId ? 'Salvar' : 'Cadastrar peça'}
              </button>
              {editId && (
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
              )}
              {error && <p className="w-full text-sm font-medium text-red-600">{error}</p>}
            </div>
          </form>
        </Card>
      )}

      <Card padding={false}>
        <div className="flex flex-col gap-3 border-b border-ink-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-ink-900">Lista de peças</h2>
            <p className="text-xs text-ink-500">{filtered.length} peça(s)</p>
          </div>
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtrar por nome…"
            className="sm:max-w-xs"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="Nenhuma peça"
            description="Cadastre peças para agilizar o lançamento nas OS."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Peça</th>
                  <th>Situação</th>
                  {canEdit && <th />}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
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
                        {row.active ? 'Ativa' : 'Inativa'}
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
        )}
      </Card>
    </div>
  );
}
