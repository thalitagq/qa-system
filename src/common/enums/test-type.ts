import { TestType } from 'generated/prisma/enums';

export const TEST_TYPE_DESCRIPTION: Record<TestType, string> = {
  ANALYSIS: 'Teste de análise',
  NEW_FEATURE: 'Teste de nova funcionalidade',
  BUG_FIX: 'Teste para correção de bug',
  IMPROVEMENT: 'Teste de melhoria',
  REGRESSION: 'Teste de regressão',
};
