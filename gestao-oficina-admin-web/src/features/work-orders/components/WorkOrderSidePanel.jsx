import {
  PaymentStatus,
  PaymentStatusLabel,
  WorkOrderStatus,
  WorkOrderStatusLabel,
  formatMoney,
} from '../../../constants/labels';
import { Card, FieldLabel, SelectInput } from '../../../components/ui/PageElements';
import { UserRole } from '../../../constants/userRole';

const LOCKED = [WorkOrderStatus.DELIVERED, WorkOrderStatus.CANCELLED];

export default function WorkOrderSidePanel({
  order,
  totals,
  session,
  mechanics = [],
  canChangeStatus,
  canPay,
  canManageItems,
  onStatusChange,
  onPaymentChange,
  onMechanicChange,
}) {
  return (
    <Card className="space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Totais</p>
        <p className="mt-1 font-display text-3xl font-bold text-ink-900">
          {formatMoney(totals.total)}
        </p>
        <div className="mt-3 space-y-1 text-sm text-ink-600">
          <div className="flex justify-between">
            <span>Serviços</span>
            <span className="font-semibold text-ink-900">{formatMoney(totals.services)}</span>
          </div>
          <div className="flex justify-between">
            <span>Peças</span>
            <span className="font-semibold text-ink-900">{formatMoney(totals.parts)}</span>
          </div>
        </div>
      </div>

      {canChangeStatus && (
        <div>
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <SelectInput
            id="status"
            value={order.status}
            onChange={(e) => onStatusChange(e.target.value)}
            disabled={LOCKED.includes(order.status) && session?.role === UserRole.MECHANIC}
          >
            {Object.values(WorkOrderStatus).map((s) => (
              <option key={s} value={s}>
                {WorkOrderStatusLabel[s]}
              </option>
            ))}
          </SelectInput>
        </div>
      )}

      {canPay && (
        <div>
          <FieldLabel htmlFor="payment">Pagamento</FieldLabel>
          <SelectInput
            id="payment"
            value={order.paymentStatus}
            onChange={(e) => onPaymentChange(e.target.value)}
          >
            {Object.values(PaymentStatus).map((s) => (
              <option key={s} value={s}>
                {PaymentStatusLabel[s]}
              </option>
            ))}
          </SelectInput>
        </div>
      )}

      {canManageItems && (
        <div>
          <FieldLabel htmlFor="mechanic">Mecânico</FieldLabel>
          <SelectInput
            id="mechanic"
            value={order.mechanicId || ''}
            onChange={(e) => onMechanicChange(e.target.value || null)}
          >
            <option value="">Não atribuído</option>
            {mechanics.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </SelectInput>
        </div>
      )}
    </Card>
  );
}
