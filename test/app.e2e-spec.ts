import { randomUUID } from 'node:crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { Role } from 'generated/prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { RedisService } from '@/redis/redis.service';

describe('Projetos (e2e)', () => {
  const runId = randomUUID();
  const project = {
    name: `Projeto E2E-01 ${runId}`,
    description: `Projeto criado pelo cenário E2E-01 ${runId}`,
  };
  const redisMock = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    del: jest.fn().mockResolvedValue(undefined),
  };
  let moduleFixture: TestingModule;
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue(
        new ConfigService({
          JWT_SECRET: randomUUID(),
          JWT_EXPIRES_IN: '5m',
        }),
      )
      .overrideProvider(RedisService)
      .useValue(redisMock)
      // Forneça apenas Redis aos módulos que não importam RedisModule.
      .useMocker((token) => (token === RedisService ? redisMock : undefined))
      .compile();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    jwt = moduleFixture.get<JwtService>(JwtService);
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();
  });

  afterAll(async () => {
    try {
      if (prisma) {
        // O marcador existe antes do POST, mesmo se a resposta falhar.
        await prisma.project.deleteMany({ where: project });
      }
    } finally {
      if (app) {
        await app.close();
      } else {
        await moduleFixture?.close();
      }
    }
  });

  it('E2E-01 — deve criar um projeto via POST /projects', async () => {
    const token = jwt.sign({ sub: runId, role: Role.QA });
    const response = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send(project)
      .expect(201)
      .expect('Content-Type', /json/);

    const persistedProjects = await prisma.project.findMany({ where: project });

    expect(persistedProjects).toHaveLength(1);
    expect(persistedProjects[0]).toMatchObject({ ...project, active: true });
    expect(response.body).toMatchObject({
      success: true,
      data: {
        id: persistedProjects[0].id,
        ...project,
        active: true,
      },
    });
  });
});
