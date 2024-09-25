import { doesNotReject, ok, rejects, strictEqual, throws } from 'node:assert';
import { beforeEach, describe, it, mock } from 'node:test';
import { CommandBus } from './command-bus.ts';
import { CommandHandler } from './command-handler.ts';

class TestCommand {}

class TestCommandHandler extends CommandHandler<TestCommand> {
  protected command = TestCommand;

  async execute() {
    return 65;
  }
}

describe('CommandBus', () => {
  let commandBus: CommandBus;

  beforeEach(() => {
    commandBus = new CommandBus();
  });

  describe('register', () => {
    it('should register a command', () => {
      commandBus.register(TestCommandHandler);

      strictEqual(commandBus.canHandle(TestCommand), true);
    });

    it('should throw an error if command is already registered', () => {
      commandBus.register(TestCommandHandler);

      throws(
        () => {
          commandBus.register(TestCommandHandler);
        },
        {
          message: 'Command TestCommand already registered',
        }
      );
    });
  });

  describe('execute', () => {
    it('should throw an error if command is not found', async () => {
      rejects(
        async () => {
          await commandBus.execute(TestCommand);
        },
        {
          message: 'Command TestCommand not found',
        }
      );
    });

    it('should execute a command', async () => {
      commandBus.register(TestCommandHandler);

      doesNotReject(async () => {
        await commandBus.execute(TestCommand);
      });
    });

    it('should call the execute method', async () => {
      commandBus.register(TestCommandHandler);

      const mockExecute = mock.method(TestCommandHandler.prototype, 'execute', () => 65);

      await commandBus.execute(TestCommand);

      strictEqual(mockExecute.mock.callCount(), 1);

      mockExecute.mock.restore();
    });
  });

  describe('canHandle', () => {
    it('should return true if command is registered', () => {
      commandBus.register(TestCommandHandler);

      strictEqual(commandBus.canHandle(TestCommand), true);
    });

    it('should return false if command is not registered', () => {
      strictEqual(commandBus.canHandle(TestCommand), false);
    });
  });

  describe('logs', () => {
    it('should warn no commands registered', () => {
      const mockConsoleLog = mock.method(console, 'warn', () => {}, { times: 1 });

      commandBus.logs();

      strictEqual(mockConsoleLog.mock.callCount(), 1);
      ok(mockConsoleLog.mock.calls[0].arguments[0].includes('{ CommandBus } No commands registered'));

      mockConsoleLog.mock.restore();
    });

    it('should log registered commands', () => {
      commandBus.register(TestCommandHandler);

      const mockConsoleLog = mock.method(console, 'log', () => {}, { times: 1 });

      commandBus.logs();

      strictEqual(mockConsoleLog.mock.callCount(), 1);
      ok(mockConsoleLog.mock.calls[0].arguments[0].includes('{ CommandBus } Registered commands: TestCommand'));

      mockConsoleLog.mock.restore();
    });
  });
});
