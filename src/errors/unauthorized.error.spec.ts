import { deepStrictEqual, strictEqual } from 'assert';
import { describe, it } from 'node:test';
import { UnauthorizedError } from './unauthorized.error.ts';

describe('UnauthorizedError', () => {
  it('should create a new instance of UnauthorizedError', () => {
    const unauthorizedError = new UnauthorizedError();

    strictEqual(unauthorizedError.statusCode, 401);
    deepStrictEqual(unauthorizedError.body, {
      message: 'UNAUTHORIZED',
      statusCode: 401,
      status: 'error',
    });
  });
});
