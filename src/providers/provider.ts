import type { InjectorToken } from './injector-token.ts';

export interface Provider {
  provide: InjectorToken<unknown>;
  useValue?: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useClass?: new (...args: any[]) => unknown;
}
