import { Link } from 'react-router-dom';

export function PageHeader({ eyebrow, title, description, actions, backTo, backLabel = 'Voltar' }) {
  return (
    <div className="card p-6">
      {backTo && (
        <Link
          to={backTo}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {backLabel}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{eyebrow}</p>
          )}
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function Card({ children, className = '', padding = true }) {
  return (
    <div className={`card ${padding ? 'p-6' : ''} ${className}`.trim()}>
      {children}
    </div>
  );
}

export function LoadingCard({ message = 'Carregando...' }) {
  return (
    <Card className="flex items-center gap-3 text-slate-500">
      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      {message}
    </Card>
  );
}

export function FieldLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
      {children}
    </label>
  );
}

export function TextInput({ className = '', ...props }) {
  return <input className={`input-field ${className}`.trim()} {...props} />;
}

export function SelectInput({ className = '', children, ...props }) {
  return (
    <select className={`select-field ${className}`.trim()} {...props}>
      {children}
    </select>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      <p className="text-sm font-medium text-slate-900">{title}</p>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  );
}
