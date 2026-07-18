import { useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useMockStore } from '../mock/MockStore';
import { buildWorkshopAnalytics } from '../mock/analytics';
import { formatMoney } from '../mock/labels';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../constants/userRole';
import {
  EvolutionChart,
  MixDoughnut,
  RankingBarChart,
  StatusBarChart,
} from '../components/dashboard/Charts';
import { DashCard, EmptyChart, Kpi } from '../features/dashboard/components/DashboardCards';

export default function Dashboard() {
  const { session } = useAuth();
  const store = useMockStore();
  const analytics = useMemo(() => buildWorkshopAnalytics(store), [store]);
  const { kpis } = analytics;

  if (session?.role === UserRole.MECHANIC) {
    return <Navigate to="/pista" replace />;
  }

  return (
    <div className="page-shell !space-y-5">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-400">
            Análise · protótipo
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 max-w-xl text-sm text-ink-500">
            Visão de OS, receita, peças e clientes.
          </p>
        </div>
        <Link to="/pista" className="btn-secondary shrink-0">
          Ir à pista
        </Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="OS ativas"
          value={kpis.activeOrders}
          hint={`${kpis.totalOrders} no total`}
          accent
        />
        <Kpi
          label="Receita paga"
          value={formatMoney(kpis.revenuePaid)}
          hint={`Em aberto ${formatMoney(kpis.revenueOpen)}`}
        />
        <Kpi
          label="Ticket médio"
          value={formatMoney(kpis.ticketMedio)}
          hint={`${kpis.deliveredCount} OS entregues`}
        />
        <Kpi
          label="Base"
          value={`${kpis.customers} / ${kpis.vehicles}`}
          hint={`${kpis.partsCatalog} peças no cadastro`}
        />
      </section>

      <section className="rounded-2xl border border-ink-200/70 bg-white p-4 shadow-soft sm:p-5">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-bold text-ink-900">Meta do mês</h2>
            <p className="text-sm text-ink-500">
              Pago em {formatMoney(kpis.thisMonthPaid)} de {formatMoney(kpis.monthlyGoal)} ·{' '}
              {kpis.thisMonthOrders} OS neste mês
            </p>
          </div>
          <span className="font-display text-xl font-bold text-signal">{kpis.goalProgress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-signal transition-all"
            style={{ width: `${kpis.goalProgress}%` }}
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <DashCard
          className="lg:col-span-2"
          title="Evolução"
          subtitle="Receita e volume de OS por mês"
        >
          <div className="h-72">
            <EvolutionChart
              labels={analytics.evolution.labels}
              ordersData={analytics.evolution.ordersData}
              revenueData={analytics.evolution.revenueData}
              paidRevenueData={analytics.evolution.paidRevenueData}
            />
          </div>
        </DashCard>

        <DashCard title="Mix receita" subtitle="Serviços × peças lançados">
          <div className="mx-auto h-64 max-w-[260px]">
            <MixDoughnut
              serviceRevenue={analytics.mix.serviceRevenue}
              partsRevenue={analytics.mix.partsRevenue}
            />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="rounded-xl bg-sky-50 px-2 py-2">
              <p className="font-bold text-sky-800">{formatMoney(analytics.mix.serviceRevenue)}</p>
              <p className="text-sky-700">Serviços</p>
            </div>
            <div className="rounded-xl bg-orange-50 px-2 py-2">
              <p className="font-bold text-signal-strong">{formatMoney(analytics.mix.partsRevenue)}</p>
              <p className="text-orange-800">Peças</p>
            </div>
          </div>
        </DashCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DashCard title="OS por status" subtitle="Funil operacional atual">
          <div className="h-64">
            <StatusBarChart rows={analytics.statusBreakdown} />
          </div>
        </DashCard>

        <DashCard title="Top peças" subtitle="Receita lançada (preço da OS)">
          <div className="h-64">
            {analytics.topParts.length === 0 ? (
              <EmptyChart />
            ) : (
              <RankingBarChart
                rows={analytics.topParts}
                color="#e85d04"
                valueFormatter={formatMoney}
              />
            )}
          </div>
        </DashCard>

        <DashCard title="Top serviços" subtitle="Mão de obra por valor">
          <div className="h-64">
            {analytics.topServices.length === 0 ? (
              <EmptyChart />
            ) : (
              <RankingBarChart
                rows={analytics.topServices}
                color="#0ea5e9"
                valueFormatter={formatMoney}
              />
            )}
          </div>
        </DashCard>

        <DashCard title="Top clientes" subtitle="Volume financeiro nas OS">
          <div className="h-64">
            {analytics.topCustomers.length === 0 ? (
              <EmptyChart />
            ) : (
              <RankingBarChart
                rows={analytics.topCustomers.map((c) => ({ name: c.name, spend: c.spend }))}
                color="#0f161e"
                valueFormatter={formatMoney}
              />
            )}
          </div>
        </DashCard>
      </section>

      <section className="rounded-2xl border border-ink-200/70 bg-white p-4 shadow-soft sm:p-5">
        <h2 className="font-display text-lg font-bold text-ink-900">Pagamentos</h2>
        <p className="mb-4 text-sm text-ink-500">Situação financeira das OS</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {analytics.paymentBreakdown.map((row) => (
            <div
              key={row.code}
              className="rounded-2xl border border-ink-100 bg-ink-50/60 px-4 py-3"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-ink-400">{row.label}</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink-900">{row.count}</p>
              <p className="text-sm font-semibold text-ink-600">{formatMoney(row.amount)}</p>
            </div>
          ))}
        </div>
        {kpis.waitingPayment > 0 && (
          <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-950">
            {kpis.waitingPayment} OS aguardando pagamento — verifique na{' '}
            <Link to="/work-orders" className="font-bold underline">
              lista de OS
            </Link>
            .
          </p>
        )}
      </section>
    </div>
  );
}
