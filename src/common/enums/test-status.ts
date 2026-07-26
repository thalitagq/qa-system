import { TestStatus } from '../../../generated/prisma/client';

export const TEST_STATUS_DESCRIPTION: Record<TestStatus, string> = {
  DRAFT: 'Rascunho — caso de teste ainda em construção',
  ANALYSIS: 'Em análise — aguardando validação',
  READY: 'Pronto — pode ser executado',
  EXECUTED: 'Executado — já foi validado',
};
