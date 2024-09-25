import { strictEqual } from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { ResponseType } from './response.ts';

describe('ResponseType', () => {
  let response: ResponseType<string>;

  beforeEach(() => {
    response = new ResponseType('value');
  });

  it('should return the body', () => {
    strictEqual(response.body, 'value');
  });

  it('should return the headers', () => {
    strictEqual(response.headers['Content-Type'], 'application/json');
  });

  it('should return the status code', () => {
    strictEqual(response.statusCode, 200);
  });
});
