import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import request from 'supertest';
import { App } from 'supertest/types';
import { TestStatus, TestType } from '../../generated/prisma/client';
import {
  ListTestCasesQueryDto,
  OrderDirection,
  TestCaseOrderBy,
} from './test-case.dto';
import { TestCaseService } from './test-case.service';
import { TestCasesController } from './test-cases.controller';

describe('TestCasesController', () => {
  let app: INestApplication<App>;
  let controller: TestCasesController;

  const serviceMock: jest.Mocked<Pick<TestCaseService, 'findAll'>> = {
    findAll: jest.fn(),
  };
  const filters = {
    status: TestStatus.READY,
    type: TestType.REGRESSION,
    projectId: '11111111-1111-4111-8111-111111111111',
    search: 'login',
  };
  const order = {
    orderBy: TestCaseOrderBy.title,
    direction: OrderDirection.asc,
  };
  const result = {
    data: [],
    meta: { page: 2, limit: 5, total: 0, totalPages: 0 },
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [TestCasesController],
      providers: [{ provide: TestCaseService, useValue: serviceMock }],
    }).compile();

    controller = module.get<TestCasesController>(TestCasesController);
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  beforeEach(() => {
    serviceMock.findAll.mockReset();
    serviceMock.findAll.mockResolvedValue(result);
  });

  afterAll(async () => {
    await app?.close();
  });

  describe('findAll (unitário)', () => {
    it('encaminha paginação, filtros e ordenação ao service', async () => {
      const query = Object.assign(new ListTestCasesQueryDto(), {
        page: 2,
        limit: 5,
        ...filters,
        ...order,
      });

      await expect(controller.findAll(query)).resolves.toEqual(result);

      expect(serviceMock.findAll).toHaveBeenCalledWith(
        { page: 2, limit: 5 },
        filters,
        order,
      );
    });

    it('preserva os valores padrão de paginação no DTO composto', () => {
      expect(new ListTestCasesQueryDto()).toMatchObject({ page: 1, limit: 10 });
    });
  });

  describe('GET /test-cases com ValidationPipe', () => {
    it('aceita paginação e status na mesma query e transforma os números', async () => {
      await request(app.getHttpServer())
        .get('/test-cases')
        .query({ page: '2', limit: '5', status: TestStatus.READY })
        .expect(200)
        .expect(result);

      expect(serviceMock.findAll).toHaveBeenCalledWith(
        { page: 2, limit: 5 },
        expect.objectContaining({ status: TestStatus.READY }),
        expect.any(Object),
      );
    });

    it('aceita os filtros e a ordenação existentes junto da paginação', async () => {
      await request(app.getHttpServer())
        .get('/test-cases')
        .query({ page: '2', limit: '5', ...filters, ...order })
        .expect(200);

      expect(serviceMock.findAll).toHaveBeenCalledWith(
        { page: 2, limit: 5 },
        filters,
        order,
      );
    });

    it('usa a paginação padrão quando a query é omitida', async () => {
      await request(app.getHttpServer()).get('/test-cases').expect(200);

      expect(serviceMock.findAll).toHaveBeenCalledWith(
        { page: 1, limit: 10 },
        expect.any(Object),
        expect.any(Object),
      );
    });

    it.each([
      { query: { status: 'INVALID_STATUS' }, field: 'status' },
      {
        query: { status: TestStatus.READY, unexpected: 'value' },
        field: 'unexpected',
      },
      { query: { page: '0' }, field: 'page' },
      { query: { limit: 'abc' }, field: 'limit' },
      { query: { direction: 'sideways' }, field: 'direction' },
    ])(
      'rejeita $field inválido ou desconhecido com HTTP 400',
      async ({ query, field }) => {
        const response = await request(app.getHttpServer())
          .get('/test-cases')
          .query(query)
          .expect(400);

        expect(response.body).toHaveProperty(
          'message',
          expect.arrayContaining([expect.stringContaining(field)]),
        );
        expect(serviceMock.findAll).not.toHaveBeenCalled();
      },
    );

    it('preserva os parâmetros e os valores padrão documentados no Swagger', () => {
      const config = new DocumentBuilder()
        .setTitle('QA System API')
        .setVersion('1.0')
        .build();
      const document = SwaggerModule.createDocument(app, config);
      const parameters = document.paths['/test-cases'].get.parameters;
      const parameter = (name: string) =>
        parameters.find((item) => 'name' in item && item.name === name);

      expect(parameter('page')).toMatchObject({
        in: 'query',
        required: false,
        description: 'Página atual',
      });
      expect(parameter('limit')).toMatchObject({ required: false });
      expect(parameter('status')).toMatchObject({
        required: false,
        schema: { enum: Object.values(TestStatus) },
      });
      expect(parameter('type')).toMatchObject({ required: false });
      expect(parameter('projectId')).toMatchObject({ required: false });
      expect(parameter('orderBy')).toMatchObject({
        schema: { default: TestCaseOrderBy.createdAt },
      });
      expect(parameter('direction')).toMatchObject({
        schema: { default: OrderDirection.desc },
      });
    });
  });
});
