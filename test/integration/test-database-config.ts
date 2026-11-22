import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'dotenv';

export function configureTestDatabase(): string {
  let contents: string;

  try {
    contents = readFileSync(resolve(__dirname, '../../.env.test'), 'utf8');
  } catch {
    throw new Error(
      'Não foi possível ler .env.test. Configure TEST_DATABASE_URL nesse arquivo.',
    );
  }

  // parse() lê somente o arquivo, sem herdar variáveis do ambiente ou de .env.
  const databaseUrl = parse(contents).TEST_DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error('TEST_DATABASE_URL é obrigatória em .env.test.');
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(databaseUrl);
  } catch {
    // O erro original de URL pode conter a senha; não o propague.
    throw new Error('TEST_DATABASE_URL deve ser uma URL PostgreSQL válida.');
  }

  if (
    !['postgres:', 'postgresql:'].includes(parsedUrl.protocol) ||
    parsedUrl.hostname !== '127.0.0.1' ||
    parsedUrl.port !== '5432' ||
    parsedUrl.pathname !== '/qa_system_test' ||
    parsedUrl.username !== 'qa_test_user'
  ) {
    throw new Error(
      'TEST_DATABASE_URL deve usar PostgreSQL, host 127.0.0.1, porta 5432, banco qa_system_test e usuário qa_test_user.',
    );
  }

  // O driver pg permite que parâmetros da query sobrescrevam host, porta e usuário.
  if (parsedUrl.search || parsedUrl.hash) {
    throw new Error(
      'TEST_DATABASE_URL não pode conter parâmetros de consulta ou fragmentos.',
    );
  }

  if (!parsedUrl.password) {
    throw new Error(
      'TEST_DATABASE_URL deve conter a senha do usuário de teste.',
    );
  }

  process.env.DATABASE_URL = databaseUrl;
  return databaseUrl;
}
