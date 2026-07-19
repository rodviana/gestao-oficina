import { DEFAULT_PAGE_SIZE } from '../constants/pagination';

/**
 * Normaliza o envelope PageResultDTO do backend.
 * pageNumber e pageMaxNumber são zero-based.
 */
export function normalizePageResult(data) {
  const pageSize = data?.pageSize ?? DEFAULT_PAGE_SIZE;
  const total = Number(data?.totalNumber ?? data?.total ?? 0);
  const page = Number(data?.pageNumber ?? data?.page ?? 0);
  const pageMaxNumber =
    data?.pageMaxNumber != null
      ? Number(data.pageMaxNumber)
      : total <= 0
        ? 0
        : Math.floor((total - 1) / pageSize);

  return {
    items: data?.items ?? [],
    total,
    page,
    pageSize,
    pageMaxNumber,
  };
}

export function emptyPageResult(pageSize = DEFAULT_PAGE_SIZE) {
  return {
    items: [],
    total: 0,
    page: 0,
    pageSize,
    pageMaxNumber: 0,
  };
}

export function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

/** Fatia local de array para paginação client-side. */
export function slicePage(items, page = 0, pageSize = DEFAULT_PAGE_SIZE) {
  const list = Array.isArray(items) ? items : [];
  const total = list.length;
  const pageMaxNumber = total <= 0 ? 0 : Math.floor((total - 1) / pageSize);
  const safePage = Math.min(Math.max(page, 0), pageMaxNumber);
  const start = safePage * pageSize;
  return {
    items: list.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    pageMaxNumber,
  };
}
