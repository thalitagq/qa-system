export function getPaginationParams(page = 1, limit = 10) {
  const take = limit;
  const skip = (page - 1) * limit;

  return { skip, take };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
