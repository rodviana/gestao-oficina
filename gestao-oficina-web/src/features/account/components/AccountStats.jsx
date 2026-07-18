function StatCard({ value, label, accent = false }) {
  if (accent) {
    return (
      <div className="rounded-2xl bg-shop-900 px-3 py-4 text-center text-white">
        <p className="font-display text-2xl font-semibold">{value}</p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-shop-200">
          {label}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sand-200 bg-white px-3 py-4 text-center shadow-soft">
      <p className="font-display text-2xl font-semibold text-shop-900">{value}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-shop-500">
        {label}
      </p>
    </div>
  );
}

export default function AccountStats({ activeCount, historyCount, vehicleCount }) {
  return (
    <section className="grid grid-cols-3 gap-3">
      <StatCard value={activeCount} label="Em andamento" accent />
      <StatCard value={historyCount} label="Concluídas" />
      <StatCard value={vehicleCount} label="Veículos" />
    </section>
  );
}
