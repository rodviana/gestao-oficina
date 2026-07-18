import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserRole, UserRoleOptions, roleLabel } from '../constants/userRole';
import { useMockStore } from '../mock/MockStore';
import { formatDate } from '../mock/labels';
import {
  Card,
  EmptyState,
  FieldLabel,
  PageHeader,
  SelectInput,
  TextInput,
} from '../components/ui/PageElements';
import { PrototypeBanner } from '../components/PrototypeChrome';

export default function AdminUserList() {
  const store = useMockStore();
  const [role, setRole] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [query, setQuery] = useState('');

  const users = useMemo(
    () =>
      store.listUsers({
        role: role || undefined,
        active: activeFilter === 'ALL' ? undefined : activeFilter === 'ACTIVE',
        query: query || undefined,
      }),
    [store, role, activeFilter, query],
  );

  return (
    <div className="space-y-6">
      <PrototypeBanner />
      <PageHeader
        eyebrow="RF-02 · RF-03"
        title="Usuários"
        description="Consultar usuários com filtros."
        actions={
          <Link to="/admin/users/new" className="btn-primary">
            Novo usuário
          </Link>
        }
      />

      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <FieldLabel htmlFor="role">Perfil</FieldLabel>
            <SelectInput id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Todos</option>
              <option value={UserRole.ADMIN}>Administrador</option>
              {UserRoleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </SelectInput>
          </div>
          <div>
            <FieldLabel htmlFor="active">Situação</FieldLabel>
            <SelectInput
              id="active"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <option value="ALL">Todos</option>
              <option value="ACTIVE">Ativos</option>
              <option value="INACTIVE">Inativos</option>
            </SelectInput>
          </div>
          <div>
            <FieldLabel htmlFor="q">Busca</FieldLabel>
            <TextInput
              id="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nome ou e-mail"
            />
          </div>
        </div>
      </Card>

      <Card padding={false}>
        {users.length === 0 ? (
          <EmptyState title="Nenhum usuário encontrado" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-4 py-3">Perfil</th>
                  <th className="px-4 py-3">Situação</th>
                  <th className="px-4 py-3">Criado em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3 text-slate-600">{roleLabel(u.role)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          u.active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {u.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(u.createdAt)}</td>
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
