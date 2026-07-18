import { Link, NavLink } from 'react-router-dom';

function tabClass({ isActive }) {
  return [
    'flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-bold uppercase tracking-wide transition',
    isActive ? 'text-signal' : 'text-ink-400',
  ].join(' ');
}

export default function MobileBottomNav({ canCreate = false, showDashboard = false }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-200/80 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-lg items-stretch">
        {showDashboard ? (
          <NavLink to="/" end className={tabClass}>
            <DashIcon />
            Home
          </NavLink>
        ) : (
          <NavLink to="/pista" className={tabClass}>
            <BoardIcon />
            Pista
          </NavLink>
        )}

        {showDashboard && (
          <NavLink to="/pista" className={tabClass}>
            <BoardIcon />
            Pista
          </NavLink>
        )}

        <NavLink to="/work-orders" className={tabClass}>
          <ListIcon />
          OS
        </NavLink>

        {canCreate && (
          <div className="relative flex w-16 shrink-0 items-center justify-center">
            <Link
              to="/work-orders/new"
              className="-mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-signal text-white shadow-lift ring-4 ring-white"
              aria-label="Nova OS"
            >
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        )}

        <NavLink to="/customers" className={tabClass}>
          <UserIcon />
          Clientes
        </NavLink>

        <NavLink to="/vehicles" className={tabClass}>
          <CarIcon />
          Veículos
        </NavLink>
      </div>
    </nav>
  );
}

function DashIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

function BoardIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="4" width="5" height="16" rx="1" />
      <rect x="10" y="4" width="5" height="16" rx="1" />
      <rect x="17" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M3 13l2-5a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 5" />
      <path d="M5 13h14v5H5z" />
      <circle cx="7.5" cy="18.5" r="1.5" />
      <circle cx="16.5" cy="18.5" r="1.5" />
    </svg>
  );
}
