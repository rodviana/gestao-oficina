import {
  PAYMENT_LABEL,
  STATUS,
  STATUS_FLOW,
  STATUS_HINT,
  STATUS_LABEL,
} from '../../../data/labels';

export function resolveStepState(currentStatus, step, steps) {
  if (currentStatus === STATUS.CANCELLED) {
    return step === STATUS.OPEN ? 'done' : step === STATUS.CANCELLED ? 'current' : 'idle';
  }
  const curIdx = steps.indexOf(currentStatus);
  const stepIdx = steps.indexOf(step);
  if (stepIdx < 0) return 'idle';
  if (stepIdx < curIdx) return 'done';
  if (stepIdx === curIdx) return 'current';
  return 'idle';
}

export function buildVisibleSteps(status, timeline = []) {
  return STATUS_FLOW.filter((s) => {
    if (s === STATUS.WAITING_PARTS) {
      return (
        status === STATUS.WAITING_PARTS ||
        timeline.some((t) => t.status === STATUS.WAITING_PARTS)
      );
    }
    return true;
  });
}

export default function StatusTimeline({ status, paymentStatus, timeline = [] }) {
  const steps = buildVisibleSteps(status, timeline);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-shop-900 px-5 py-6 text-white shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-shop-200">
          Situação atual
        </p>
        <p className="mt-2 font-display text-3xl font-semibold leading-tight">
          {STATUS_LABEL[status] || status}
        </p>
        <p className="mt-2 text-sm text-shop-100/80">{STATUS_HINT[status]}</p>
        {paymentStatus && (
          <p className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
            Pagamento: {PAYMENT_LABEL[paymentStatus] || paymentStatus}
          </p>
        )}
      </div>

      <ol>
        {steps.map((step, index) => {
          const state = resolveStepState(status, step, steps);
          const event = [...timeline].reverse().find((t) => t.status === step);
          return (
            <li key={step} className="relative flex gap-4 pb-6 last:pb-0">
              {index < steps.length - 1 && (
                <span
                  className={`absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-0.5 ${
                    state === 'done' || state === 'current' ? 'bg-shop-500' : 'bg-sand-200'
                  }`}
                />
              )}
              <span
                className={`relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  state === 'current'
                    ? 'bg-shop-700 text-white ring-4 ring-shop-500/20'
                    : state === 'done'
                      ? 'bg-shop-500 text-white'
                      : 'bg-sand-200 text-shop-500'
                }`}
              >
                {state === 'done' ? '✓' : index + 1}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p
                  className={`font-semibold ${
                    state === 'idle' ? 'text-shop-500/70' : 'text-shop-900'
                  }`}
                >
                  {STATUS_LABEL[step]}
                </p>
                <p className="text-sm text-shop-500">{STATUS_HINT[step]}</p>
                {event?.note && <p className="mt-1 text-sm text-shop-700">{event.note}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
