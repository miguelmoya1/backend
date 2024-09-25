import { deepStrictEqual, strictEqual } from 'node:assert';
import { describe, it } from 'node:test';
import { ForbiddenError } from './forbidden.error.ts';

describe('ForbiddenError', () => {
  it('should create a new instance of ForbiddenError', () => {
    const forbiddenError = new ForbiddenError();

    strictEqual(forbiddenError.statusCode, 403);
    deepStrictEqual(forbiddenError.body, {
      message: 'FORBIDDEN',
      statusCode: 403,
      status: 'error',
    });
  });
});
