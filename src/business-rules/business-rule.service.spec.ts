import { describe } from 'node:test';
import { BusinessRuleService } from './business-rule.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BusinessRule } from 'generated/prisma/client';
import { RedisService } from '../redis/redis.service';

void describe('businessRuleService', () => {
  let service: BusinessRuleService;

  type PrismaMock = {
    $transaction: jest.Mock;
    businessRule: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    testCase: {
      findMany: jest.Mock;
      count: jest.Mock;
    };
  };

  const prismaMock: PrismaMock = {
    $transaction: jest.fn(),
    businessRule: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    testCase: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessRuleService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BusinessRuleService>(BusinessRuleService);

    jest.clearAllMocks();
  });

  void describe('create', () => {
    it('deve criar regra quando não existir duplicidade', async () => {
      prismaMock.businessRule.findUnique.mockResolvedValue(null);

      prismaMock.businessRule.create.mockResolvedValue({
        code: 'BR-TESTE',
        title: 'Regra Teste',
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await service.create({
        title: 'Regra Teste',
      } as any);

      expect(result.code).toBeDefined();
      expect(prismaMock.businessRule.create).toHaveBeenCalled();
    });

    it('deve lançar erro se já existir regra com mesmo significado', async () => {
      prismaMock.businessRule.findUnique.mockResolvedValue({ id: '1' });

      await expect(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        service.create({ title: 'Regra Teste' } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  void describe('findByCode', () => {
    it('deve retornar regra quando existir', async () => {
      prismaMock.businessRule.findUnique.mockResolvedValue({
        code: 'BR-1',
      } as BusinessRule);

      const result = (await service.findByCode('BR-1')) as BusinessRule;

      expect(result.code).toBe('BR-1');
    });

    it('deve lançar NotFound se não existir', async () => {
      prismaMock.businessRule.findUnique.mockResolvedValue(null);

      await expect(service.findByCode('BR-X')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  void describe('update', () => {
    it('deve lançar erro se regra não existir', async () => {
      prismaMock.businessRule.findUnique.mockResolvedValue(null);

      await expect(
        service.update('BR-1', { title: 'Nova' } as BusinessRule),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve atualizar quando existir', async () => {
      prismaMock.businessRule.findUnique.mockResolvedValue({
        code: 'BR-1',
        title: 'Antiga',
        normalizedTitle: 'antiga',
      });

      prismaMock.businessRule.update.mockResolvedValue({
        code: 'BR-1',
        title: 'Nova',
      });

      const result = await service.update('BR-1', {
        title: 'Nova',
      } as BusinessRule);

      expect(result.title).toBe('Nova');
    });
  });

  void describe('deactivate', () => {
    it('deve desativar regra', async () => {
      prismaMock.businessRule.findUnique.mockResolvedValue({ code: 'BR-1' });

      prismaMock.businessRule.update.mockResolvedValue({
        code: 'BR-1',
        active: false,
      });

      const result = await service.deactivate('BR-1');

      expect(result.active).toBe(false);
    });
  });

  it('deve retornar lista de test cases', async () => {
    prismaMock.businessRule.findUnique.mockResolvedValue({ code: 'BR-1' });

    prismaMock.$transaction.mockResolvedValue([[{ id: 'TC-1' }], 1]);

    const result = await service.findTestCasesByBusinessRule('BR-1', {
      page: 1,
      limit: 10,
    });

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });
});
