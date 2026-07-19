import { DEMO_LOOKUPS } from '../../../data/demo';
import { Pagination } from '../../../components/ui/Pagination';
import { useClientPagination } from '../../../hooks/useClientPagination';

export default function DemoLookupList({ onSelect }) {
  const paged = useClientPagination(DEMO_LOOKUPS, { resetKey: DEMO_LOOKUPS.length });

  return (
    <div>
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-shop-500">
        Exemplos para testar
      </p>
      <div className="flex flex-col gap-2">
        {paged.items.map((demo) => (
          <button
            key={demo.number + demo.plate + demo.label}
            type="button"
            onClick={() => onSelect(demo)}
            className="rounded-2xl border border-sand-200 bg-white/70 px-4 py-3 text-left text-sm transition hover:border-shop-500/40 hover:bg-white"
          >
            <span className="font-semibold text-shop-900">{demo.label}</span>
            <span className="mt-0.5 block text-shop-500">
              {demo.number ? `${demo.number} · ` : ''}
              {demo.plate}
            </span>
          </button>
        ))}
      </div>
      <Pagination
        page={paged.page}
        pageMaxNumber={paged.pageMaxNumber}
        totalNumber={paged.total}
        pageSize={paged.pageSize}
        onPageChange={paged.setPage}
      />
    </div>
  );
}
