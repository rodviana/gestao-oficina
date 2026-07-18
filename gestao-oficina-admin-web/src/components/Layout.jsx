import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roleLabel, UserRole } from '../constants/userRole';
import MobileBottomNav from './MobileBottomNav';

function userInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function topLinkClass({ isActive }) {
  return [
    'shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition',
    isActive
      ? 'bg-ink-900 text-white'
      : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
  ].join(' ');
}

export default function Layout() {
  const { session, logout } = useAuth();
  const isMechanic = session?.role === UserRole.MECHANIC;
  const showCatalog = !isMechanic;
  const showDashboard = !isMechanic;
  const canCreate = session?.role === UserRole.ADMIN || session?.role === UserRole.ATTENDANT;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-ink-200/60 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-4 py-2.5 lg:gap-3 lg:px-6">
          <Link to={showDashboard ? '/' : '/pista'} className="flex shrink-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-white shadow-lift">
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-signal ring-2 ring-white" />
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 16H9m10 0h1a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-1M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <span className="hidden font-display text-base font-bold tracking-tight text-ink-900 sm:inline">
              Gestão Oficina
            </span>
          </Link>

          <nav className="-mx-1 flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto px-1 md:mx-0 md:overflow-visible">
            {showDashboard && (
              <NavLink to="/" end className={topLinkClass}>
                Dashboard
              </NavLink>
            )}
            <NavLink to="/pista" className={topLinkClass}>
              Em andamento
            </NavLink>
            <NavLink to="/work-orders" className={topLinkClass}>
              OS
            </NavLink>
            <NavLink to="/customers" className={topLinkClass}>
              Clientes
            </NavLink>
            <NavLink to="/vehicles" className={topLinkClass}>
              Veículos
            </NavLink>
            {showCatalog && (
              <>
                <NavLink to="/parts" className={topLinkClass}>
                  Peças
                </NavLink>
                <NavLink to="/catalogs" className={topLinkClass}>
                  Serviços
                </NavLink>
              </>
            )}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            {canCreate && (
              <Link to="/work-orders/new" className="btn-primary !hidden !px-3.5 !py-2 sm:!inline-flex">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                Nova OS
              </Link>
            )}
            <div className="hidden items-center gap-2 lg:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-signal-soft font-display text-xs font-bold text-signal-strong">
                {userInitials(session?.name)}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-ink-900">{session?.name?.split(' ')[0]}</p>
                <p className="text-[10px] text-ink-500">{roleLabel(session?.role)}</p>
              </div>
            </div>
            <button type="button" onClick={logout} className="btn-secondary !px-3 !py-2 text-sm">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-5 pb-24 md:pb-8 lg:px-6">
        <Outlet />
      </main>

      <MobileBottomNav canCreate={canCreate} showDashboard={showDashboard} />
    </div>
  );
}
