import { useEffect, useRef, useState } from 'react';

export function useDebouncedSearch({ token, query, delay = 300, fetcher }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!token) {
      setData([]);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await fetcherRef.current(token, query.trim());
        if (!cancelled) setData(result?.items ?? []);
      } catch {
        if (!cancelled) setData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [token, query, delay]);

  return { data, loading };
}
