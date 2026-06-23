import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roleLabel } from '../constants/userRole';
import { fetchHome } from '../services/authService';
import { showApiError } from '../services/apiClient';
import { Card, LoadingCard, PageHeader } from '../components/ui/PageElements';

export default function Home() {
  const { session, isAdmin } = useAuth();
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await fetchHome(session.token);
        if (active) setHome(data);
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
    return <LoadingCard message="Carregando início..." />;
  }

  if (!home) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Início"
        title={home.message}
        description="Você está autenticado no sistema de gestão da oficina."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Usuário</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{home.name}</p>
          <p className="text-sm text-slate-500">{home.email}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Perfil</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{roleLabel(home.role)}</p>
          <p className="text-sm text-slate-500">ID #{home.id}</p>
        </Card>
      </div>

      {isAdmin && (
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-slate-900">Área administrativa</p>
            <p className="mt-1 text-sm text-slate-500">Gerencie usuários e acesse o painel admin.</p>
          </div>
          <Link to="/admin/users" className="btn-primary">
            Ver usuários
          </Link>
        </Card>
      )}
    </div>
  );
}
