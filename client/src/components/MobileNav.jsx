import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function mobileNavClass({ isActive }) {
  return [
    'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition',
    isActive
      ? 'bg-blue-600 text-white shadow-sm'
      : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
  ].join(' ');
}

export default function MobileNav() {
  const { isAdmin } = useAuth();

  return (
    <nav className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
      <NavLink to="/" end className={mobileNavClass}>
        Início
      </NavLink>
      {isAdmin && (
        <>
          <NavLink to="/admin" end className={mobileNavClass}>
            Painel
          </NavLink>
          <NavLink to="/admin/users" end className={mobileNavClass}>
            Usuários
          </NavLink>
          <NavLink to="/admin/users/new" end className={mobileNavClass}>
            Novo
          </NavLink>
        </>
      )}
    </nav>
  );
}
