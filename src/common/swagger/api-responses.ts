import { ApiResponse } from '@nestjs/swagger';

export const ApiSuccessResponse = (
  status: number,
  description: string,
  example?: any,
) =>
  ApiResponse({
    status,
    description,
    schema: {
      example: {
        success: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: example ?? null,
      },
    },
  });

export const ApiErrorResponse = (
  status: number,
  description: string,
  message: string,
  error = 'HttpException',
) =>
  ApiResponse({
    status,
    description,
    schema: {
      example: {
        success: false,
        statusCode: status,
        message,
        error,
      },
    },
  });
