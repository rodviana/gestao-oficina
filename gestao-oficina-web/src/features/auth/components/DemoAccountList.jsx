import { DEMO_ACCOUNTS } from '../../../data/demo';
import { Pagination } from '../../../components/ui/Pagination';
import { useClientPagination } from '../../../hooks/useClientPagination';

export default function DemoAccountList({ onSelect }) {
  const paged = useClientPagination(DEMO_ACCOUNTS, { resetKey: DEMO_ACCOUNTS.length });

  return (
    <div>
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-shop-500">
        Contas de demonstração
      </p>
      <div className="flex flex-col gap-2">
        {paged.items.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => onSelect(account)}
            className="rounded-2xl border border-sand-200 bg-white/70 px-4 py-3 text-left text-sm transition hover:border-shop-500/40 hover:bg-white"
          >
            <span className="font-semibold text-shop-900">{account.label}</span>
            <span className="mt-0.5 block text-shop-500">
              {account.email} · senha {account.password}
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
