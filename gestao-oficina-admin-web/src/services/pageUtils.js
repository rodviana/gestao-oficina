export function normalizePageResult(data) {
  return {
    items: data?.items ?? [],
    total: data?.totalNumber ?? data?.total ?? 0,
    page: data?.pageNumber ?? data?.page ?? 0,
    pageSize: data?.pageSize ?? 20,
    pageMaxNumber: data?.pageMaxNumber ?? 1,
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

export async function fetchAllPages(fetchPage, { pageSize = 100, maxPages = 20 } = {}) {
  const all = [];
  let page = 0;
  let pageMaxNumber = 1;

  while (page <= pageMaxNumber && page < maxPages) {
    const result = normalizePageResult(await fetchPage(page, pageSize));
    all.push(...result.items);
    pageMaxNumber = Math.max(result.pageMaxNumber - 1, 0);
    if (result.items.length < pageSize) break;
    page += 1;
  }

  return all;
}
