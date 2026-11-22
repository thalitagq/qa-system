import { randomUUID } from 'node:crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@prisma/prisma.module';
import { PrismaService } from '@prisma/prisma.service';
import { TestStatus, TestType } from 'generated/prisma/client';
import { CreateTestStepDto } from '@/test-steps/test-step.dto';
import { TestStepService } from '@/test-steps/test-step.service';

describe('TestStepService (integração)', () => {
  const projectId = randomUUID();
  const testCaseId = randomUUID();
  let module: TestingModule;
  let prisma: PrismaService;
  let service: TestStepService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [TestStepService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<TestStepService>(TestStepService);
    await module.init();
  });

  afterAll(async () => {
    try {
      if (prisma) {
        // O UUID do caso permite limpar mesmo se create() persistir e depois falhar.
        await prisma.$transaction([
          prisma.testStep.deleteMany({ where: { testCaseId } }),
          prisma.testCase.deleteMany({ where: { id: testCaseId, projectId } }),
          prisma.project.deleteMany({ where: { id: projectId } }),
        ]);
      }
    } finally {
      await module?.close();
    }
  });

  it('INT-01 — deve persistir um passo de teste válido', async () => {
    await prisma.project.create({
      data: {
        id: projectId,
        name: `Projeto INT-01 ${projectId}`,
      },
    });

    await prisma.testCase.create({
      data: {
        id: testCaseId,
        projectId,
        title: 'Adicionar uma tarefa',
        type: TestType.NEW_FEATURE,
        status: TestStatus.READY,
      },
    });

    const dto: CreateTestStepDto = {
      order: 1,
      action: 'Clicar no botão adicionar tarefa',
      expectedResult: 'Formulário de nova tarefa exibido',
    };

    const createdStep = await service.create(testCaseId, dto);
    const persistedStep = await prisma.testStep.findUnique({
      where: { id: createdStep.id },
    });

    expect(persistedStep).not.toBeNull();
    expect(persistedStep).toMatchObject({
      id: createdStep.id,
      testCaseId,
      order: dto.order,
      action: dto.action,
      expectedResult: dto.expectedResult,
    });
  });

  it('INT-02 — deve impedir passos com a mesma ordem no mesmo caso de teste', async () => {
    const int02ProjectId = randomUUID();
    const int02TestCaseId = randomUUID();
    const firstStepId = randomUUID();
    const secondStepId = randomUUID();
    const stepData = {
      testCaseId: int02TestCaseId,
      order: 1,
      action: 'Clicar no botão adicionar tarefa',
      expectedResult: 'Formulário de nova tarefa exibido',
    };

    try {
      await prisma.project.create({
        data: {
          id: int02ProjectId,
          name: `Projeto INT-02 ${int02ProjectId}`,
        },
      });

      await prisma.testCase.create({
        data: {
          id: int02TestCaseId,
          projectId: int02ProjectId,
          title: 'Impedir passos com ordem duplicada',
          type: TestType.REGRESSION,
          status: TestStatus.READY,
        },
      });

      const firstStep = await prisma.testStep.create({
        data: { id: firstStepId, ...stepData },
      });

      await expect(
        prisma.testStep.create({
          data: {
            id: secondStepId,
            ...stepData,
            action: 'Tentar adicionar outro passo com a mesma ordem',
            expectedResult: 'Passo duplicado rejeitado pelo banco de dados',
          },
        }),
      ).rejects.toMatchObject({ code: 'P2002' });

      const persistedSteps = await prisma.testStep.findMany({
        where: { testCaseId: int02TestCaseId },
      });

      expect(persistedSteps).toHaveLength(1);
      expect(persistedSteps[0]).toEqual(firstStep);
    } finally {
      await prisma.$transaction([
        prisma.testStep.deleteMany({ where: { testCaseId: int02TestCaseId } }),
        prisma.testCase.deleteMany({
          where: { id: int02TestCaseId, projectId: int02ProjectId },
        }),
        prisma.project.deleteMany({ where: { id: int02ProjectId } }),
      ]);
    }
  });
});
