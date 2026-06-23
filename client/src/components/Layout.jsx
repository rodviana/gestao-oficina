import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roleLabel } from '../constants/userRole';
import { SidebarNavItem, SidebarSection, icons } from './SidebarNav';
import MobileNav from './MobileNav';

function userInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function Layout() {
  const { session, isAdmin, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 16H9m10 0h1a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-1M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Gestão Oficina</p>
              <p className="text-xs text-slate-500">Oficina automotiva</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                {userInitials(session?.name)}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{session?.name}</p>
                <p className="text-xs text-slate-500">{session?.email}</p>
              </div>
            </div>
            <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 md:inline">
              {roleLabel(session?.role)}
            </span>
            <button type="button" onClick={logout} className="btn-secondary px-3 py-2">
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-6">
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav className="card sticky top-[4.5rem] p-3">
            <SidebarSection>
              <SidebarNavItem to="/" end icon={icons.home}>
                Início
              </SidebarNavItem>
            </SidebarSection>

            {isAdmin && (
              <SidebarSection title="Administração">
                <SidebarNavItem to="/admin" end icon={icons.dashboard}>
                  Painel
                </SidebarNavItem>
                <SidebarNavItem to="/admin/users" end icon={icons.users}>
                  Usuários
                </SidebarNavItem>
                <SidebarNavItem to="/admin/users/new" end icon={icons.userPlus} nested>
                  Novo usuário
                </SidebarNavItem>
              </SidebarSection>
            )}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 pb-8">
          <MobileNav />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
