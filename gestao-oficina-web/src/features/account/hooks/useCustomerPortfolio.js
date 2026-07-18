import { useMemo } from 'react';
import { useAuth } from '../../auth/AuthContext';
import {
  getOrdersByCustomerId,
  getVehiclesByCustomerId,
  splitActiveAndHistory,
} from '../../../data/tracking';

/** Aggregates the logged-in customer's orders and vehicles for account screens. */
export function useCustomerPortfolio() {
  const { customer } = useAuth();

  return useMemo(() => {
    const orders = getOrdersByCustomerId(customer.id);
    const { active, history } = splitActiveAndHistory(orders);
    const vehicles = getVehiclesByCustomerId(customer.id);
    return { customer, orders, active, history, vehicles };
  }, [customer]);
}
