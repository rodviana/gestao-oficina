import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMockStore } from '../../../mock/MockStore';
import { WorkOrderStatus } from '../../../mock/labels';
import { workOrderTotal } from '../../../mock/seed';
import { EmptyState, PageHeader } from '../../../components/ui/PageElements';
import { PrototypeBanner } from '../../../components/PrototypeChrome';
import { useAuth } from '../../../context/AuthContext';
import { UserRole } from '../../../constants/userRole';
import { showSuccess } from '../../../services/apiClient';
import { computeItemTotals } from '../utils/itemTotals';
import { useWorkOrderItemForm } from '../hooks/useWorkOrderItemForm';
import WorkOrderSummaryCard from '../components/WorkOrderSummaryCard';
import WorkOrderSidePanel from '../components/WorkOrderSidePanel';
import WorkOrderItemsSection from '../components/WorkOrderItemsSection';

const LOCKED = [WorkOrderStatus.DELIVERED, WorkOrderStatus.CANCELLED];

export default function WorkOrderDetailPage() {
  const { id } = useParams();
  const store = useMockStore();
  const { session } = useAuth();
  const order = store.getWorkOrder(id);

  const canManageItems =
    session?.role === UserRole.ADMIN || session?.role === UserRole.ATTENDANT;
  const canPay = canManageItems;
  const canChangeStatus = Boolean(session);

  const services = store.listServiceCatalog().filter((s) => s.active);
  const parts = store.listPartCatalog().filter((p) => p.active);

  const itemForm = useWorkOrderItemForm({
    orderId: order?.id,
    store,
    services,
    parts,
  });

  const customer = order ? store.getCustomer(order.customerId) : null;
  const vehicle = order ? store.getVehicle(order.vehicleId) : null;
  const mechanic = order?.mechanicId
    ? store.listUsers().find((u) => u.id === order.mechanicId)
    : null;
  const creator = order?.createdById
    ? store.listUsers().find((u) => u.id === order.createdById)
    : null;
  const total = order ? workOrderTotal(order) : 0;
  const itemsLocked = order ? LOCKED.includes(order.status) : true;
  const totals = useMemo(() => computeItemTotals(order), [order]);

  if (!order) {
    return (
      <div className="space-y-6">
        <PrototypeBanner />
        <EmptyState title="OS não encontrada" />
      </div>
    );
  }

  function handleStatus(next) {
    store.updateWorkOrderStatus(order.id, next);
    showSuccess('Status atualizado.');
  }

  function handlePayment(next) {
    store.updateWorkOrderPayment(order.id, next);
    showSuccess('Pagamento atualizado.');
  }

  return (
    <div className="space-y-6">
      <PrototypeBanner />
      <PageHeader
        eyebrow="RF-07 · RF-08 · RF-09 · RF-10 · RF-13"
        title={order.number}
        description={order.description}
        backTo="/work-orders"
        actions={
          <Link to={`/work-orders/${order.id}/print`} className="btn-secondary">
            Imprimir / PDF
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <WorkOrderSummaryCard
          order={order}
          customer={customer}
          vehicle={vehicle}
          mechanic={mechanic}
          creator={creator}
        />
        <WorkOrderSidePanel
          order={order}
          totals={totals}
          session={session}
          store={store}
          canChangeStatus={canChangeStatus}
          canPay={canPay}
          canManageItems={canManageItems}
          onStatusChange={handleStatus}
          onPaymentChange={handlePayment}
        />
      </div>

      <WorkOrderItemsSection
        order={order}
        total={total}
        canManageItems={canManageItems}
        itemsLocked={itemsLocked}
        itemForm={itemForm}
      />
    </div>
  );
}
