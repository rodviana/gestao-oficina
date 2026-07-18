import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { formatMoney } from '../constants/labels';
import {
  Card,
  FieldLabel,
  PageHeader,
  SelectInput,
  TextInput,
} from '../components/ui/PageElements';
import { showSuccess } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../constants/userRole';
import {
  createServiceCatalogItem,
  fetchServiceCatalog,
  updateServiceCatalogItem,
} from '../services/catalogService';

/** Catálogo de serviços (mão de obra). Peças ficam em /parts. */
export default function CatalogPage() {
  const { session } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editId, setEditId] = useState(null);
  const [active, setActive] = useState(true);

  async function loadServices() {
    if (!session?.token) return;
    const data = await fetchServiceCatalog(session.token);
    setServices(data);
  }

  useEffect(() => {
    if (!session?.token) return undefined;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const data = await fetchServiceCatalog(session.token);
        if (!cancelled) setServices(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.token]);

  if (session?.role === UserRole.MECHANIC) {
    return <Navigate to="/pista" replace />;
  }

  const isAdmin = session?.role === UserRole.ADMIN;

  function resetForm() {
    setName('');
    setPrice('');
    setEditId(null);
    setActive(true);
  }

  function startEdit(item) {
    setEditId(item.id);
    setName(item.name);
    setPrice(String(item.defaultPrice));
    setActive(item.active);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim() || Number(price) < 0) return;
    if (editId) {
      await updateServiceCatalogItem(session.token, editId, {
        name: name.trim(),
        defaultPrice: Number(price),
        active,
      });
      showSuccess('Serviço atualizado.');
    } else {
      await createServiceCatalogItem(session.token, {
        name: name.trim(),
        defaultPrice: Number(price),
        active,
      });
      showSuccess('Serviço cadastrado.');
    }
    await loadServices();
    resetForm();
  }

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Serviços · RF-12"
        title="Serviços"
        description="Catálogo de mão de obra com valor de referência para lançar nas OS."
        actions={
          <Link to="/parts" className="btn-secondary !border-white/20 !bg-white/10 !text-white hover:!bg-white/20">
            Ir para Peças
          </Link>
        }
      />

      {isAdmin && (
        <Card>
          <form className="grid gap-3 md:grid-cols-4" onSubmit={handleSubmit}>
            <div className="md:col-span-2">
              <FieldLabel htmlFor="cat-name">Nome</FieldLabel>
              <TextInput id="cat-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <FieldLabel htmlFor="cat-price">Preço padrão</FieldLabel>
              <TextInput id="cat-price" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
              <FieldLabel htmlFor="cat-active">Situação</FieldLabel>
              <SelectInput
                id="cat-active"
                value={active ? '1' : '0'}
                onChange={(e) => setActive(e.target.value === '1')}
              >
                <option value="1">Ativo</option>
                <option value="0">Inativo</option>
              </SelectInput>
            </div>
            <div className="flex items-end gap-2 md:col-span-4">
              <button type="submit" className="btn-primary">
                {editId ? 'Salvar alteração' : 'Adicionar'}
              </button>
              {editId && (
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </Card>
      )}

      <Card padding={false}>
        {loading ? (
          <p className="p-6 text-sm text-ink-500">Carregando serviços…</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th className="text-right">Preço</th>
                <th>Situação</th>
                {isAdmin && <th />}
              </tr>
            </thead>
            <tbody>
              {services.map((row) => (
                <tr key={row.id}>
                  <td className="font-medium text-ink-900">{row.name}</td>
                  <td className="text-right">{formatMoney(row.defaultPrice)}</td>
                  <td>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        row.active ? 'bg-emerald-100 text-emerald-700' : 'bg-ink-100 text-ink-500'
                      }`}
                    >
                      {row.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  {isAdmin && (
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
        )}
      </Card>
    </div>
  );
}
