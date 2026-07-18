import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useTrackLookup } from '../hooks/useTrackLookup';
import TrackLookupForm from '../components/TrackLookupForm';
import DemoLookupList from '../components/DemoLookupList';

export default function TrackHomePage() {
  const { isAuthenticated } = useAuth();
  const lookup = useTrackLookup();

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-8 sm:py-12">
      <header className="mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-shop-500">
          Gestão Oficina
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-shop-900 sm:text-5xl">
          Consulta rápida
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-shop-500">
          Sem conta: informe a OS e a placa — ou o telefone — para ver o andamento de uma OS.
        </p>
      </header>

      <TrackLookupForm lookup={lookup} />

      <p className="mt-5 text-center text-sm text-shop-500">
        {isAuthenticated ? (
          <Link to="/conta" className="font-semibold text-shop-700 underline-offset-2 hover:underline">
            Voltar para minha conta
          </Link>
        ) : (
          <>
            Prefere ver o histórico completo?{' '}
            <Link to="/login" className="font-semibold text-shop-700 underline-offset-2 hover:underline">
              Entrar na conta
            </Link>
          </>
        )}
      </p>

      <div className="mt-8">
        <DemoLookupList onSelect={lookup.fillDemo} />
      </div>
    </div>
  );
}
