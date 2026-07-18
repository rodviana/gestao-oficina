import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import DemoAccountList from './components/DemoAccountList';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/conta" replace />;

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    const result = login(loginId, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate('/conta', { replace: true });
  }

  function fillDemo(account) {
    setLoginId(account.email);
    setPassword(account.password);
    setError('');
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-8 sm:py-12">
      <header className="mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-shop-500">
          Gestão Oficina
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-shop-900 sm:text-5xl">
          Minha oficina
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-shop-500">
          Entre com sua conta para ver o andamento atual e todo o histórico dos seus veículos.
        </p>
      </header>

      <div className="rounded-3xl border border-sand-200 bg-white/90 p-5 shadow-soft backdrop-blur sm:p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="loginId" className="mb-1.5 block text-sm font-semibold text-shop-700">
              E-mail ou telefone
            </label>
            <input
              id="loginId"
              className="field"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="Ex.: roberto@email.com"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-shop-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm font-medium text-red-700">{error}</p>}
          <button type="submit" className="btn-primary w-full">
            Entrar
          </button>
        </form>
      </div>

      <p className="mt-5 text-center text-sm text-shop-500">
        Só quer ver uma OS rápida?{' '}
        <Link to="/consulta" className="font-semibold text-shop-700 underline-offset-2 hover:underline">
          Consultar sem conta
        </Link>
      </p>

      <div className="mt-8">
        <DemoAccountList onSelect={fillDemo} />
      </div>

      <p className="mt-auto pt-10 text-center text-xs text-shop-500/80">
        Portal do cliente · protótipo com dados mockados
      </p>
    </div>
  );
}
