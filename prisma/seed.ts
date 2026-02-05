import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { normalizeText } from '../src/business-rules/helpers/normalize-text';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function main() {
  console.log('🌱 Rodando seed...');

  // Limpa dados (ordem importa)
  await prisma.testStep.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.businessRule.deleteMany();
  await prisma.project.deleteMany();

  // Projeto
  const project = await prisma.project.create({
    data: {
      name: 'Projeto Demo QA',
      description: 'Projeto criado via seed',
    },
  });

  // Regras de negócio
  const ruleLogin = await prisma.businessRule.create({
    data: {
      code: 'BR-LOGIN',
      title: 'Usuário deve conseguir fazer login',
      normalizedTitle: normalizeText('usuario deve conseguir fazer login'),
      description: 'Login com credenciais válidas',
    },
  });

  const ruleSenha = await prisma.businessRule.create({
    data: {
      code: 'BR-SENHA',
      title: 'Senha deve ter no mínimo 8 caracteres',
      normalizedTitle: normalizeText('senha deve ter no minimo 8 caracteres'),
      description: 'Validação de senha forte',
    },
  });

  // Caso de teste
  const testCase = await prisma.testCase.create({
    data: {
      title: 'CT-Login válido',
      description: 'Testa login com usuário válido',
      status: 'READY',
      type: 'NEW_FEATURE',
      projectId: project.id,
      rules: {
        connect: [{ code: ruleLogin.code }, { code: ruleSenha.code }],
      },
    },
  });

  // Passos de teste
  await prisma.testStep.createMany({
    data: [
      {
        testCaseId: testCase.id,
        order: 1,
        action: 'Acessar a tela de login',
        expectedResult: 'Tela exibida',
      },
      {
        testCaseId: testCase.id,
        order: 2,
        action: 'Informar usuário e senha válidos',
        expectedResult: 'Credenciais aceitas',
      },
      {
        testCaseId: testCase.id,
        order: 3,
        action: 'Clicar em entrar',
        expectedResult: 'Usuário autenticado',
      },
    ],
  });

  console.log('✅ Seed finalizado com sucesso');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
