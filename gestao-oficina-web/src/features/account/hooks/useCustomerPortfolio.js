import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import {
  getCustomerSummary,
  getOrdersByCustomerId,
} from '../../../data/tracking';

const EMPTY_SUMMARY = {
  vehicleCount: 0,
  activeOrderCount: 0,
  historyOrderCount: 0,
  totalOrderCount: 0,
};

/** Carrega resumo + OS ativas + últimos serviços para a home da conta. */
export function useCustomerPortfolio() {
  const { customer } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [active, setActive] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);

  useEffect(() => {
    if (!customer) {
      setSummary(EMPTY_SUMMARY);
      setActive([]);
      setRecentHistory([]);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [nextSummary, activePage, historyPage] = await Promise.all([
          getCustomerSummary(),
          getOrdersByCustomerId({ statusGroup: 'ACTIVE', page: 0 }),
          getOrdersByCustomerId({ statusGroup: 'HISTORY', page: 0, pageSize: 3 }),
        ]);
        if (cancelled) return;
        setSummary(nextSummary);
        setActive(activePage.items);
        setRecentHistory(historyPage.items);
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

  return { customer, loading, error, summary, active, recentHistory };
}
