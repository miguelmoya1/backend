import { ok } from 'assert';
import { describe, it } from 'node:test';
import { InjectorToken } from './injector-token.ts';

describe('InjectorToken', () => {
  it('should be defined', () => {
    ok(InjectorToken);
  });

  it('should set the description', () => {
    const token = new InjectorToken('test');

    ok(token.toString() === 'test');
  });
});
