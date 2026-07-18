import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const LINKS = [
  { to: '/conta', end: true, label: 'Início' },
  { to: '/conta/historico', end: false, label: 'Histórico' },
  { to: '/conta/veiculos', end: false, label: 'Veículos' },
];

export default function PortalShell() {
  const { customer, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 pb-8 pt-5">
      <header className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-shop-500">
            Gestão Oficina
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-shop-900">
            Olá, {customer?.name?.split(' ')[0]}
          </h1>
        </div>
        <button type="button" className="btn-ghost !px-3 !py-2 text-sm" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <nav className="mb-6 flex rounded-2xl bg-sand-100 p-1">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex-1 rounded-xl py-2.5 text-center text-sm font-semibold transition ${
                isActive ? 'bg-white text-shop-900 shadow-sm' : 'text-shop-500'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
