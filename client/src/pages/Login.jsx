import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/authService';
import { FieldLabel, TextInput } from '../components/ui/PageElements';

export default function Login() {
  const navigate = useNavigate();
  const { login: saveSession } = useAuth();
  const [email, setEmail] = useState('admin@oficina.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      saveSession(data);
      navigate('/', { replace: true });
    } catch {
      // apiClient shows toast
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-50 p-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl md:grid-cols-2">
        <div className="border-b border-slate-200 bg-gradient-to-br from-blue-600 to-blue-700 p-8 md:border-b-0 md:border-r">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-white">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 16H9m10 0h1a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-1M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Gestão Oficina</h1>
          <p className="mt-2 text-sm leading-relaxed text-blue-100">
            Sistema integrado para gestão de oficinas automotivas.
          </p>
        </div>

        <form className="p-8" onSubmit={handleSubmit} noValidate>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Entrar</h2>
          <p className="mt-1 mb-6 text-sm text-slate-500">Use seu e-mail e senha para acessar.</p>

          <div className="mb-4">
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <TextInput
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="mb-6">
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <TextInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="mt-4 text-center text-xs text-slate-400">
            Demo: admin@oficina.com / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
