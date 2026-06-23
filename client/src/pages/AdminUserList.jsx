import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole, UserRoleOptions, roleLabel } from '../constants/userRole';
import { fetchUserList } from '../services/authService';
import { showApiError } from '../services/apiClient';
import {
  Card,
  EmptyState,
  FieldLabel,
  PageHeader,
  SelectInput,
  TextInput,
} from '../components/ui/PageElements';

const ACTIVE_FILTER_OPTIONS = [
  { value: 'ALL', label: 'Todos' },
  { value: 'ACTIVE', label: 'Ativos' },
  { value: 'INACTIVE', label: 'Inativos' },
];

const SEARCH_FIELD_OPTIONS = [
  { value: 'NAME', label: 'Nome' },
  { value: 'EMAIL', label: 'E-mail' },
];

const ROLE_FILTER_OPTIONS = [
  { value: 'ALL', label: 'Todos' },
  { value: UserRole.ADMIN, label: 'Administrador' },
  ...UserRoleOptions,
];

const DEFAULT_FILTER = {
  role: 'ALL',
  activeFilter: 'ALL',
  searchField: 'NAME',
  searchText: '',
  page: 0,
  pageSize: 10,
};

export default function AdminUserList() {
  const { session } = useAuth();
  const [filters, setFilters] = useState(DEFAULT_FILTER);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTER);
  const [listData, setListData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadList = useCallback(async (currentFilters) => {
    setLoading(true);
    try {
      const data = await fetchUserList(session.token, currentFilters);
      setListData(data);
    } catch (error) {
      await showApiError(error);
    } finally {
      setLoading(false);
    }
  }, [session.token]);

  useEffect(() => {
    loadList(appliedFilters);
  }, [appliedFilters, loadList]);

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function handleSearch(event) {
    event.preventDefault();
    setAppliedFilters({ ...filters, page: 0 });
  }

  function handlePageChange(nextPage) {
    setAppliedFilters((current) => ({ ...current, page: nextPage }));
    setFilters((current) => ({ ...current, page: nextPage }));
  }

  const pageNumber = listData?.pageNumber ?? 0;
  const pageMaxNumber = listData?.pageMaxNumber ?? 0;
  const hasItems = listData?.items?.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administração"
        title="Usuários"
        description="Consulte os usuários cadastrados e filtre por perfil, status ou texto."
        actions={(
          <Link to="/admin/users/new" className="btn-primary">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Novo usuário
          </Link>
        )}
      />

      <Card>
        <form onSubmit={handleSearch}>
          <p className="mb-4 text-sm font-medium text-slate-900">Filtros</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <FieldLabel htmlFor="role">Perfil</FieldLabel>
              <SelectInput
                id="role"
                value={filters.role}
                onChange={(e) => updateFilter('role', e.target.value)}
              >
                {ROLE_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </SelectInput>
            </div>

            <div>
              <FieldLabel htmlFor="activeFilter">Status</FieldLabel>
              <SelectInput
                id="activeFilter"
                value={filters.activeFilter}
                onChange={(e) => updateFilter('activeFilter', e.target.value)}
              >
                {ACTIVE_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </SelectInput>
            </div>

            <div>
              <FieldLabel htmlFor="searchField">Buscar por</FieldLabel>
              <SelectInput
                id="searchField"
                value={filters.searchField}
                onChange={(e) => updateFilter('searchField', e.target.value)}
              >
                {SEARCH_FIELD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </SelectInput>
            </div>

            <div>
              <FieldLabel htmlFor="searchText">Texto</FieldLabel>
              <TextInput
                id="searchText"
                type="text"
                value={filters.searchText}
                onChange={(e) => updateFilter('searchText', e.target.value)}
                placeholder="Digite para filtrar..."
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="submit" className="btn-primary">
              Aplicar filtros
            </button>
            <button
              type="button"
              onClick={() => {
                setFilters(DEFAULT_FILTER);
                setAppliedFilters(DEFAULT_FILTER);
              }}
              className="btn-secondary"
            >
              Limpar
            </button>
          </div>
        </form>
      </Card>

      <Card padding={false} className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-3 p-12 text-sm text-slate-500">
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
            Carregando usuários...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Nome</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">E-mail</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Perfil</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Cadastro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hasItems ? listData.items.map((user) => (
                    <tr key={user.id} className="transition hover:bg-slate-50/80">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                            {user.name?.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                          </span>
                          <span className="text-sm font-medium text-slate-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{user.email}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                          {roleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${user.active ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100' : 'bg-slate-100 text-slate-600'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${user.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {user.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">{user.createdAt || '—'}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5}>
                        <EmptyState
                          title="Nenhum usuário encontrado"
                          description="Tente ajustar os filtros ou cadastre um novo usuário."
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-900">{listData?.totalNumber ?? 0}</span> usuário(s)
                {' · '}
                Página {pageNumber + 1} de {Math.max(pageMaxNumber + 1, 1)}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={pageNumber <= 0}
                  onClick={() => handlePageChange(pageNumber - 1)}
                  className="btn-secondary px-3 py-1.5"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={pageNumber >= pageMaxNumber}
                  onClick={() => handlePageChange(pageNumber + 1)}
                  className="btn-secondary px-3 py-1.5"
                >
                  Próxima
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
