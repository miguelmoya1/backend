import { deepStrictEqual, strictEqual } from 'node:assert';
import { describe, it } from 'node:test';
import { NotFoundError } from './not-found.error.ts';

describe('NotFoundError', () => {
  it('should create a new instance of NotFoundError', () => {
    const notFoundError = new NotFoundError();

    strictEqual(notFoundError.statusCode, 404);
    deepStrictEqual(notFoundError.body, {
      message: 'NOT_FOUND',
      statusCode: 404,
      status: 'error',
    });
  });
});
