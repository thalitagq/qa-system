import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestStepDto, UpdateTestStepDto } from './test-step.dto';
import { TestStepService } from './test-step.service';

describe('TestStepService', () => {
  let service: TestStepService;

  type PrismaMock = {
    testCase: {
      findUnique: jest.Mock;
    };
    testStep: {
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };

  const prismaMock: PrismaMock = {
    testCase: {
      findUnique: jest.fn(),
    },
    testStep: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestStepService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<TestStepService>(TestStepService);
  });

  describe('create', () => {
    it('UT-01 — deve impedir a criação de passos com a mesma ordem no mesmo caso de teste', async () => {
      const testCaseId = 'TC-1';
      const existingStep = {
        id: 'TS-1',
        testCaseId,
        order: 1,
        action: 'Abrir a página de tarefas',
        expectedResult: 'Lista de tarefas exibida',
      };
      const dto: CreateTestStepDto = {
        order: 1,
        action: 'Clicar em adicionar tarefa',
        expectedResult: 'Formulário de nova tarefa exibido',
      };

      prismaMock.testCase.findUnique.mockResolvedValue({ id: testCaseId });
      prismaMock.testStep.findFirst.mockResolvedValue(existingStep);

      const result = service.create(testCaseId, dto);

      await expect(result).rejects.toThrow(BadRequestException);
      await expect(result).rejects.toThrow(
        /^Já existe um passo com essa ordem$/,
      );
      expect(prismaMock.testCase.findUnique).toHaveBeenCalledWith({
        where: { id: testCaseId },
        select: { id: true },
      });
      expect(prismaMock.testStep.findFirst).toHaveBeenCalledWith({
        where: { testCaseId, order: dto.order },
      });
      expect(prismaMock.testStep.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('UT-02 — deve atualizar parcialmente um passo sem alterar a ordem', async () => {
      const testCaseId = 'TC-1';
      const step = {
        id: 'TS-1',
        testCaseId,
        order: 1,
        action: 'Abrir a página de tarefas',
        expectedResult: 'Lista de tarefas exibida',
      };
      const otherStep = {
        ...step,
        id: 'TS-2',
        order: 2,
        action: 'Clicar em adicionar tarefa',
        expectedResult: 'Formulário de nova tarefa exibido',
      };
      const dto: UpdateTestStepDto = {
        action: 'Abrir a página de tarefas pelo menu',
      };

      prismaMock.testCase.findUnique.mockResolvedValue({ id: testCaseId });
      prismaMock.testStep.findUnique.mockResolvedValue(step);
      // Sem o filtro de ordem, outro passo do mesmo caso pode ser encontrado.
      prismaMock.testStep.findFirst.mockResolvedValue(otherStep);
      prismaMock.testStep.update.mockResolvedValue({ ...step, ...dto });

      const result = await service.update(testCaseId, step.id, dto);

      expect(prismaMock.testCase.findUnique).toHaveBeenCalledWith({
        where: { id: testCaseId },
        select: { id: true },
      });
      expect(prismaMock.testStep.findUnique).toHaveBeenCalledWith({
        where: { id: step.id },
        select: { id: true, testCaseId: true },
      });
      expect(prismaMock.testStep.findFirst).not.toHaveBeenCalled();
      expect(prismaMock.testStep.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.testStep.update).toHaveBeenCalledWith({
        where: { id: step.id },
        data: {
          action: dto.action,
          expectedResult: undefined,
          order: undefined,
        },
      });
      expect(result.action).toBe(dto.action);
      expect(result.order).toBe(step.order);
      expect(result.expectedResult).toBe(step.expectedResult);
    });

    it('UT-03 — deve impedir a atualização de um passo de outro caso de teste', async () => {
      const testCaseId = 'TC-1';
      const step = { id: 'TS-1', testCaseId: 'TC-2' };
      const dto: UpdateTestStepDto = {
        action: 'Abrir a página de tarefas pelo menu',
        order: 1,
      };

      prismaMock.testCase.findUnique.mockResolvedValue({ id: testCaseId });
      prismaMock.testStep.findUnique.mockResolvedValue(step);

      const result = service.update(testCaseId, step.id, dto);

      await expect(result).rejects.toThrow(BadRequestException);
      await expect(result).rejects.toThrow(
        /^Passo não pertence ao caso de teste informado$/,
      );
      expect(prismaMock.testCase.findUnique).toHaveBeenCalledWith({
        where: { id: testCaseId },
        select: { id: true },
      });
      expect(prismaMock.testStep.findUnique).toHaveBeenCalledWith({
        where: { id: step.id },
        select: { id: true, testCaseId: true },
      });
      expect(prismaMock.testStep.update).not.toHaveBeenCalled();
      expect(prismaMock.testStep.findFirst).not.toHaveBeenCalled();
    });
  });
});
