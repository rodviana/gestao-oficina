import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { slicePage } from '../services/pageUtils';

/** Paginação local sobre um array já carregado. */
export function useClientPagination(items, { pageSize = DEFAULT_PAGE_SIZE, resetKey } = {}) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [resetKey, pageSize]);

  const paged = useMemo(() => slicePage(items, page, pageSize), [items, page, pageSize]);

  useEffect(() => {
    if (paged.page !== page) {
      setPage(paged.page);
    }
  }, [paged.page, page]);

  return {
    ...paged,
    setPage,
  };
}
