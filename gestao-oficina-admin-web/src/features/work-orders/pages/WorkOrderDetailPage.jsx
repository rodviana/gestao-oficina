import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { WorkOrderStatus } from '../../../constants/labels';
import { workOrderTotal } from '../../../utils/workOrderUtils';
import { EmptyState, PageHeader } from '../../../components/ui/PageElements';
import { PrototypeBanner } from '../../../components/PrototypeChrome';
import { useAuth } from '../../../context/AuthContext';
import { UserRole } from '../../../constants/userRole';
import { showSuccess } from '../../../services/apiClient';
import { fetchMechanics } from '../../../services/authService';
import { fetchAllServiceCatalog, fetchAllPartCatalog } from '../../../services/catalogService';
import {
  assignWorkOrderMechanic,
  fetchWorkOrder,
  updateWorkOrderPayment,
  updateWorkOrderStatus,
} from '../../../services/workOrderService';
import { computeItemTotals } from '../utils/itemTotals';
import { useWorkOrderItemForm } from '../hooks/useWorkOrderItemForm';
import WorkOrderSummaryCard from '../components/WorkOrderSummaryCard';
import WorkOrderSidePanel from '../components/WorkOrderSidePanel';
import WorkOrderItemsSection from '../components/WorkOrderItemsSection';

const LOCKED = [WorkOrderStatus.DELIVERED, WorkOrderStatus.CANCELLED];

export default function WorkOrderDetailPage() {
  const { id } = useParams();
  const { session } = useAuth();
  const [order, setOrder] = useState(null);
  const [mechanics, setMechanics] = useState([]);
  const [services, setServices] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  const canManageItems =
    session?.role === UserRole.ADMIN || session?.role === UserRole.ATTENDANT;
  const canPay = canManageItems;
  const canChangeStatus = Boolean(session);

  async function loadOrder() {
    if (!session?.token) return;
    const detail = await fetchWorkOrder(session.token, id);
    setOrder(detail);
  }

  useEffect(() => {
    if (!session?.token) return undefined;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const [detail, mechanicList, serviceList, partList] = await Promise.all([
          fetchWorkOrder(session.token, id),
          fetchMechanics(session.token),
          fetchAllServiceCatalog(session.token, { onlyActive: true }),
          fetchAllPartCatalog(session.token, { onlyActive: true }),
        ]);
        if (!cancelled) {
          setOrder(detail);
          setMechanics(mechanicList);
          setServices(serviceList);
          setParts(partList);
        }
      } catch {
        if (!cancelled) setOrder(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.token, id]);

  const itemForm = useWorkOrderItemForm({
    orderId: order?.id,
    token: session?.token,
    services,
    parts,
    onChanged: loadOrder,
  });

  const total = order ? workOrderTotal(order) : 0;
  const itemsLocked = order ? LOCKED.includes(order.status) : true;
  const totals = useMemo(() => computeItemTotals(order), [order]);

  if (loading) {
    return (
      <div className="space-y-6">
        <p className="text-sm text-ink-500">Carregando OS…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <PrototypeBanner />
        <EmptyState title="OS não encontrada" />
      </div>
    );
  }

  async function handleStatus(next) {
    const updated = await updateWorkOrderStatus(session.token, order.id, next);
    setOrder(updated);
    showSuccess('Status atualizado.');
  }

  async function handlePayment(next) {
    const updated = await updateWorkOrderPayment(session.token, order.id, next);
    setOrder(updated);
    showSuccess('Pagamento atualizado.');
  }

  async function handleMechanic(nextMechanicId) {
    const updated = await assignWorkOrderMechanic(
      session.token,
      order.id,
      nextMechanicId ? Number(nextMechanicId) : null,
    );
    setOrder(updated);
    showSuccess('Mecânico atualizado.');
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
        <WorkOrderSummaryCard order={order} />
        <WorkOrderSidePanel
          order={order}
          totals={totals}
          session={session}
          mechanics={mechanics}
          canChangeStatus={canChangeStatus}
          canPay={canPay}
          canManageItems={canManageItems}
          onStatusChange={handleStatus}
          onPaymentChange={handlePayment}
          onMechanicChange={handleMechanic}
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
