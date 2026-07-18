export function StatusBadge({ label, tone }) {
  return <span className={`status-pill ${tone}`}>{label}</span>;
}

export function PrototypeBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 text-sm text-amber-950 shadow-sm animate-fade-in">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-signal text-[10px] font-bold text-white">
        UX
      </span>
      <div>
        <p className="font-semibold">Protótipo visual</p>
        <p className="text-xs text-amber-900/80">
          Dados mockados (RF-01 a RF-14). Arraste cards no Kanban para mudar o status da OS.
        </p>
      </div>
    </div>
  );
}
