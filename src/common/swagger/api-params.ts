import { ApiParam } from '@nestjs/swagger';

export const ApiIdParam = (name = 'id', description = 'Identificador único') =>
  ApiParam({
    name,
    description,
    required: true,
    schema: {
      type: 'string',
      example: '550e8400-e29b-41d4-a716-446655440000',
    },
  });

export const ApiCodeParam = (
  name = 'code',
  description = 'Código da entidade',
) =>
  ApiParam({
    name,
    description,
    required: true,
    schema: {
      type: 'string',
      example: 'BR-9F3A21C4',
    },
  });
