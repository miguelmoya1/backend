import { ok, throws } from 'node:assert';
import { beforeEach, describe, it, mock } from 'node:test';
import { InjectorToken } from './injector-token.ts';
import { ProvidersBus } from './providers-bus.ts';

describe('ProvidersBus', () => {
  let injectorToken: InjectorToken<string>;

  beforeEach(() => {
    injectorToken = new InjectorToken('Test');
  });

  it('should be defined', () => {
    ok(ProvidersBus);
  });

  describe('register', () => {
    it('should register a provider', () => {
      const bus = new ProvidersBus();

      bus.register({
        provide: injectorToken,
        useValue: 'test',
      });

      ok(bus.get(injectorToken));
    });

    it('should throw an error if no provider is found', () => {
      const bus = new ProvidersBus();

      throws(
        () => {
          bus.get(injectorToken);
        },
        {
          message: 'No provider found for Test',
        }
      );
    });

    it('should register a class provider', () => {
      class Test {}
      const injectionTokenClass = new InjectorToken<Test>('Test');

      const bus = new ProvidersBus();

      bus.register({
        provide: injectionTokenClass,
        useClass: Test,
      });

      ok(bus.get(injectionTokenClass) instanceof Test);
    });

    it('should register a class provider with dependencies', () => {
      class Test {
        public test: string;
        constructor(test: string) {
          this.test = test;
        }
      }
      const injectionTokenClass = new InjectorToken<Test>('Test');

      const bus = new ProvidersBus();

      bus.register({
        provide: injectionTokenClass,
        useClass: Test,
      });

      ok(bus.get(injectionTokenClass) instanceof Test);

      ok(bus.get(injectionTokenClass).test === undefined);
    });
  });

  describe('get', () => {
    it('should get a provider', () => {
      const bus = new ProvidersBus();

      bus.register({
        provide: injectorToken,
        useValue: 'test',
      });

      ok(bus.get(injectorToken) === 'test');
    });
  });

  describe('logs', () => {
    it('should warn no providers registered', () => {
      const bus = new ProvidersBus();

      const mockConsoleLog = mock.method(console, 'warn', () => {}, { times: 1 });

      bus.logs();

      ok(mockConsoleLog.mock.callCount() === 1);
      ok(mockConsoleLog.mock.calls[0].arguments[0].includes('No providers registered'));

      mockConsoleLog.mock.restore();
    });

    it('should log registered providers', () => {
      const bus = new ProvidersBus();

      bus.register({
        provide: injectorToken,
        useValue: 'test',
      });

      const mockConsoleLog = mock.method(console, 'log', () => {}, { times: 1 });

      bus.logs();

      ok(mockConsoleLog.mock.callCount() === 1);
      ok(mockConsoleLog.mock.calls[0].arguments[0].includes('Registered providers: Test'));

      mockConsoleLog.mock.restore();
    });
  });
});
