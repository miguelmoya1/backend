import { deepStrictEqual, strictEqual } from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { BaseError } from './base-error.ts';

describe('BaseError', () => {
  const ClassBaseError = class extends BaseError {};

  let classError = new ClassBaseError();

  beforeEach(() => {
    classError = new ClassBaseError();
  });

  it('should be an abstract class', () => {
    strictEqual(typeof BaseError, 'function');

    try {
      // @ts-expect-error Testing the abstract class
      new BaseError();
    } catch (error) {
      strictEqual(error instanceof Error, true);
      strictEqual(error.message, 'Cannot construct abstract instances directly');
    }
  });

  it('should have the property statusCode', () => {
    strictEqual(classError.statusCode, 500);
  });

  it('should have the property body', () => {
    deepStrictEqual(classError.body, {
      message: undefined,
      statusCode: 500,
      status: 'error',
    });
  });

  it('should set the message and statusCode', () => {
    classError = new ClassBaseError('message', 400);

    strictEqual(classError.statusCode, 400);
    deepStrictEqual(classError.body, {
      message: 'message',
      statusCode: 400,
      status: 'error',
    });

    classError = new ClassBaseError('message', 454);

    strictEqual(classError.statusCode, 454);
    deepStrictEqual(classError.body, {
      message: 'message',
      statusCode: 454,
      status: 'error',
    });
  });
});
