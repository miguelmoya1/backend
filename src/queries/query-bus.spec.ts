import { doesNotReject, ok, rejects, strictEqual, throws } from 'node:assert';
import { beforeEach, describe, it, mock } from 'node:test';
import { QueryBus } from './query-bus.ts';
import { QueryBase } from './query.base.ts';

class TestQuery {}

class TestQueryHandler extends QueryBase<void> {
  async execute() {
    return 65;
  }
}

describe('QueryBus', () => {
  let queryBus: QueryBus;

  beforeEach(() => {
    queryBus = new QueryBus();
  });

  describe('register', () => {
    it('should register a query', () => {
      queryBus.register(TestQuery, TestQueryHandler);

      strictEqual(queryBus.canHandle(TestQuery), true);
    });

    it('should throw an error if query is already registered', () => {
      queryBus.register(TestQuery, TestQueryHandler);

      throws(
        () => {
          queryBus.register(TestQuery, TestQueryHandler);
        },
        {
          message: 'Query TestQuery already registered',
        }
      );
    });
  });

  describe('execute', () => {
    it('should throw an error if query is not found', async () => {
      rejects(
        async () => {
          await queryBus.execute(TestQuery);
        },
        {
          message: 'Query TestQuery not found',
        }
      );
    });

    it('should execute a query', async () => {
      queryBus.register(TestQuery, TestQueryHandler);

      doesNotReject(async () => {
        await queryBus.execute(TestQuery);
      });
    });

    it('should call the execute method', async () => {
      queryBus.register(TestQuery, TestQueryHandler);

      const mockExecute = mock.method(TestQueryHandler.prototype, 'execute', () => 65);

      await queryBus.execute(TestQuery);

      strictEqual(mockExecute.mock.callCount(), 1);

      mockExecute.mock.restore();
    });
  });

  describe('canHandle', () => {
    it('should return true if query is registered', () => {
      queryBus.register(TestQuery, TestQueryHandler);

      strictEqual(queryBus.canHandle(TestQuery), true);
    });

    it('should return false if query is not registered', () => {
      strictEqual(queryBus.canHandle(TestQuery), false);
    });
  });

  describe('logs', () => {
    it('should warn no queries registered', () => {
      const mockConsoleLog = mock.method(console, 'warn', () => {}, { times: 1 });

      queryBus.logs();

      strictEqual(mockConsoleLog.mock.callCount(), 1);
      ok(mockConsoleLog.mock.calls[0].arguments[0].includes('No queries registered'));

      mockConsoleLog.mock.restore();
    });

    it('should log registered queries', () => {
      queryBus.register(TestQuery, TestQueryHandler);

      const mockConsoleLog = mock.method(console, 'log', () => {}, { times: 1 });

      queryBus.logs();

      strictEqual(mockConsoleLog.mock.callCount(), 1);
      ok(mockConsoleLog.mock.calls[0].arguments[0].includes('Registered queries: TestQuery'));

      mockConsoleLog.mock.restore();
    });
  });
});
