import { Link } from 'react-router-dom';

export function PageHeader({ eyebrow, title, description, actions, backTo, backLabel = 'Voltar' }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-200/70 bg-ink-900 text-white shadow-lift">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(circle at 85% 20%, rgba(232,93,4,0.45), transparent 40%), radial-gradient(circle at 10% 80%, rgba(255,255,255,0.08), transparent 35%)',
        }}
      />
      <div className="relative p-6 sm:p-7">
        {backTo && (
          <Link
            to={backTo}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-300 transition hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {backLabel}
          </Link>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-signal-muted">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-1.5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
        </div>
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
    <Card className="flex items-center gap-3 text-ink-500">
      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-ink-200 border-t-signal" />
      {message}
    </Card>
  );
}

export function FieldLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink-700">
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

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 5h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
          <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
        </svg>
      </div>
      <p className="font-display text-lg font-semibold text-ink-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function StatChip({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white/80 px-4 py-3 shadow-soft">
      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-ink-900">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}
