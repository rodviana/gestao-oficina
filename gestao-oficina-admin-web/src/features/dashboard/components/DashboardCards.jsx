export function Kpi({ label, value, hint, accent = false }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-4 shadow-soft ${
        accent
          ? 'border-signal/30 bg-gradient-to-br from-signal-soft to-white'
          : 'border-ink-200/70 bg-white'
      }`}
    >
      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-ink-900 sm:text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}

export function DashCard({ title, subtitle, children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-ink-200/70 bg-white p-4 shadow-soft sm:p-5 ${className}`}
    >
      <div className="mb-3">
        <h2 className="font-display text-lg font-bold text-ink-900">{title}</h2>
        {subtitle && <p className="text-sm text-ink-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-ink-400">
      Sem dados ainda
    </div>
  );
}
