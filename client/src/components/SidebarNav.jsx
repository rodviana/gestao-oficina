import { NavLink } from 'react-router-dom';

function NavIcon({ children }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500 [.nav-item-active_&]:bg-blue-100 [.nav-item-active_&]:text-blue-600">
      {children}
    </span>
  );
}

export function SidebarNavItem({ to, end = true, icon, children, nested = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${isActive ? 'nav-item nav-item-active' : 'nav-item'} ${nested ? 'ml-3' : ''}`
      }
    >
      {icon && <NavIcon>{icon}</NavIcon>}
      <span>{children}</span>
    </NavLink>
  );
}

export function SidebarSection({ title, children }) {
  return (
    <div className="space-y-1">
      {title && (
        <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

export const icons = {
  home: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" strokeLinejoin="round" />
    </svg>
  ),
  dashboard: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  users: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  userPlus: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  ),
};
