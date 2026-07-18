import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../services/authService';
import { FieldLabel, TextInput } from '../components/ui/PageElements';
import { notifyToast } from '../components/ToastProvider';

export default function Login() {
  const navigate = useNavigate();
  const { login: saveSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const sessionData = await apiLogin(email, password);
      saveSession(sessionData);
      navigate('/', { replace: true });
    } catch (err) {
      notifyToast({
        type: 'error',
        title: 'Atenção',
        message: err.message || 'Não foi possível entrar.',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 20% 20%, rgba(232,93,4,0.18), transparent 50%), radial-gradient(ellipse 50% 40% at 90% 10%, rgba(15,22,30,0.35), transparent 45%), linear-gradient(160deg, #0f161e 0%, #1a2430 45%, #2a3845 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-lift animate-fade-up md:grid-cols-[1.05fr_1fr]">
        <div className="relative overflow-hidden bg-ink-900 p-8 text-white md:p-10">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full opacity-50"
            style={{ background: 'radial-gradient(circle, rgba(232,93,4,0.55), transparent 70%)' }}
          />
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-signal-muted">
            Gestão Oficina
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Gestão
            <br />
            Oficina
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-300">
            Kanban da pista, OS, clientes e veículos conectados ao backend admin.
          </p>
          <ul className="mt-8 space-y-2 text-sm text-ink-300">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" /> Arraste OS no quadro
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" /> Busca por placa e telefone
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" /> Perfis admin, balcão e mecânico
            </li>
          </ul>
        </div>

        <div className="p-8 md:p-10">
          <h2 className="font-display text-2xl font-bold text-ink-900">Entrar</h2>
          <p className="mt-1 mb-5 text-sm text-ink-500">Use seu e-mail e senha cadastrados.</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <TextInput
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <TextInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
              {loading ? 'Entrando...' : 'Entrar no sistema'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
