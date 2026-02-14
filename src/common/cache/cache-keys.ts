export const CacheKeys = {
  testCasesList: (params: { page: number; limit: number; status?: string }) =>
    `test-cases:list:page=${params.page}:limit=${params.limit}:status=${params.status ?? 'all'}`,

  testCaseById: (id: string) => `test-cases:detail:${id}`,

  projectsList: (params: { page: number; limit: number }) =>
    `projects:list:page=${params.page}:limit=${params.limit}`,

  businessRulesList: (params: { page: number; limit: number }) =>
    `business-rules:list:page=${params.page}:limit=${params.limit}`,

  businessRuleByCode: (code: string) => `businessRule:${code}`,
};

export const CacheInvalidationPatterns = {
  testCases: 'test-cases:*',
  projects: 'projects:*',
  businessRules: 'business-rules:*',
};
