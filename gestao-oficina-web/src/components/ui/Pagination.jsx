/**
 * Paginação numerada (página zero-based no estado; exibição 1-based).
 * Oculta quando há 0 ou 1 página.
 */
export function Pagination({
  page = 0,
  pageMaxNumber = 0,
  totalNumber = 0,
  pageSize = 20,
  onPageChange,
  className = '',
}) {
  if (!onPageChange || pageMaxNumber <= 0 || totalNumber <= 0) {
    return null;
  }

  const current = Math.min(Math.max(page, 0), pageMaxNumber);
  const totalPages = pageMaxNumber + 1;
  const from = current * pageSize + 1;
  const to = Math.min((current + 1) * pageSize, totalNumber);
  const pages = visiblePages(current, pageMaxNumber);

  return (
    <div
      className={`flex flex-col gap-3 border-t border-shop-100 px-1 py-3 sm:flex-row sm:items-center sm:justify-between ${className}`.trim()}
    >
      <p className="text-xs text-shop-500">
        {from}–{to} de {totalNumber} · página {current + 1} de {totalPages}
      </p>
      <nav className="flex flex-wrap items-center gap-1" aria-label="Paginação">
        <PageButton
          disabled={current <= 0}
          onClick={() => onPageChange(current - 1)}
          label="Anterior"
        />
        {pages.map((p, idx) =>
          p === '…' ? (
            <span key={`e-${idx}`} className="px-1 text-xs text-shop-400">
              …
            </span>
          ) : (
            <PageButton
              key={p}
              active={p === current}
              onClick={() => onPageChange(p)}
              label={String(p + 1)}
            />
          ),
        )}
        <PageButton
          disabled={current >= pageMaxNumber}
          onClick={() => onPageChange(current + 1)}
          label="Próxima"
        />
      </nav>
    </div>
  );
}

function PageButton({ label, onClick, disabled = false, active = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        'min-w-[2rem] rounded-lg px-2.5 py-1.5 text-xs font-semibold transition',
        active
          ? 'bg-shop-900 text-white'
          : 'bg-shop-50 text-shop-700 hover:bg-shop-100',
        disabled ? 'cursor-not-allowed opacity-40' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </button>
  );
}

function visiblePages(current, pageMaxNumber) {
  const total = pageMaxNumber + 1;
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i);
  }

  const pages = new Set([0, pageMaxNumber, current, current - 1, current + 1]);
  if (current <= 2) {
    pages.add(2);
    pages.add(3);
  }
  if (current >= pageMaxNumber - 2) {
    pages.add(pageMaxNumber - 2);
    pages.add(pageMaxNumber - 3);
  }

  const sorted = [...pages].filter((p) => p >= 0 && p <= pageMaxNumber).sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i += 1) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('…');
    }
    result.push(sorted[i]);
  }
  return result;
}
