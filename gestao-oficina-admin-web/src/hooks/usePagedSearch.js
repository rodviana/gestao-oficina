import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { emptyPageResult } from '../services/pageUtils';

/**
 * Busca paginada com debounce no texto e reset de página ao mudar filtros.
 *
 * @param {{
 *   token?: string,
 *   query?: string,
 *   filters?: Record<string, unknown>,
 *   pageSize?: number,
 *   delay?: number,
 *   fetcher: (token: string, args: { search: string, page: number, pageSize: number, filters: object }) => Promise<object>
 * }} opts
 */
export function usePagedSearch({
  token,
  query = '',
  filters = {},
  pageSize = DEFAULT_PAGE_SIZE,
  delay = 300,
  fetcher,
}) {
  const [page, setPage] = useState(0);
  const [result, setResult] = useState(() => emptyPageResult(pageSize));
  const [loading, setLoading] = useState(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    setPage(0);
  }, [query, filtersKey, pageSize]);

  const reload = useCallback(async () => {
    if (!token) {
      setResult(emptyPageResult(pageSize));
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetcherRef.current(token, {
        search: query.trim(),
        page,
        pageSize,
        filters: JSON.parse(filtersKey),
      });
      setResult(data);
      if (data.page != null && data.page !== page) {
        setPage(data.page);
      }
    } catch {
      setResult(emptyPageResult(pageSize));
    } finally {
      setLoading(false);
    }
  }, [token, query, page, pageSize, filtersKey]);

  useEffect(() => {
    if (!token) {
      setResult(emptyPageResult(pageSize));
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetcherRef.current(token, {
          search: query.trim(),
          page,
          pageSize,
          filters: JSON.parse(filtersKey),
        });
        if (!cancelled) {
          setResult(data);
          if (data.page != null && data.page !== page) {
            setPage(data.page);
          }
        }
      } catch {
        if (!cancelled) setResult(emptyPageResult(pageSize));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [token, query, page, pageSize, filtersKey, delay]);

  return {
    items: result.items,
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    pageMaxNumber: result.pageMaxNumber,
    loading,
    setPage,
    reload,
  };
}
