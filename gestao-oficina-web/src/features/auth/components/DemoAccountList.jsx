import { DEMO_ACCOUNTS } from '../../../data/demo';

export default function DemoAccountList({ onSelect }) {
  return (
    <div>
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-shop-500">
        Contas de demonstração
      </p>
      <div className="flex flex-col gap-2">
        {DEMO_ACCOUNTS.map((account) => (
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
    </div>
  );
}
