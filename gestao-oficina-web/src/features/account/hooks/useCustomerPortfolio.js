import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import {
  getOrdersByCustomerId,
  getVehiclesByCustomerId,
  splitActiveAndHistory,
} from '../../../data/tracking';

/** Aggregates the logged-in customer's orders and vehicles for account screens. */
export function useCustomerPortfolio() {
  const { customer } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [active, setActive] = useState([]);
  const [history, setHistory] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    if (!customer) {
      setOrders([]);
      setActive([]);
      setHistory([]);
      setVehicles([]);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const nextOrders = await getOrdersByCustomerId();
        const split = splitActiveAndHistory(nextOrders);
        const nextVehicles = await getVehiclesByCustomerId(nextOrders);
        if (cancelled) return;
        setOrders(nextOrders);
        setActive(split.active);
        setHistory(split.history);
        setVehicles(nextVehicles);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Erro ao carregar seus dados.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [customer]);

  return { customer, loading, error, orders, active, history, vehicles };
}
