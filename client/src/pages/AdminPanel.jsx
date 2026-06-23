import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchAdminPanel } from '../services/authService';
import { showApiError } from '../services/apiClient';
import { Card, LoadingCard, PageHeader } from '../components/ui/PageElements';

export default function AdminPanel() {
  const { session } = useAuth();
  const [panel, setPanel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await fetchAdminPanel(session.token);
        if (active) setPanel(data);
      } catch (error) {
        if (active) await showApiError(error);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [session.token]);

  if (loading) {
    return <LoadingCard message="Carregando painel..." />;
  }

  if (!panel) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administração"
        title={panel.title}
        description={panel.message}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/admin/users" className="card group p-5 transition hover:border-blue-200 hover:shadow-md">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <div>
              <p className="font-semibold text-slate-900">Usuários</p>
              <p className="mt-1 text-sm text-slate-500">Consultar, filtrar e cadastrar acessos.</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/users/new" className="card group p-5 transition hover:border-blue-200 hover:shadow-md">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M19 8v6M22 11h-6" />
              </svg>
            </span>
            <div>
              <p className="font-semibold text-slate-900">Novo usuário</p>
              <p className="mt-1 text-sm text-slate-500">Cadastrar atendente ou mecânico.</p>
            </div>
          </div>
        </Link>
      </div>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sessão</p>
        <p className="mt-2 text-sm text-slate-600">
          Logado como <span className="font-medium text-slate-900">{panel.adminName}</span>
        </p>
      </Card>
    </div>
  );
}
