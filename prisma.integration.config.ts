import { defineConfig } from 'prisma/config';
import { configureTestDatabase } from './test/integration/test-database-config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: configureTestDatabase(),
  },
});
