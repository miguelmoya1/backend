import { deepEqual, ok, strictEqual } from 'node:assert';
import { describe, it, mock } from 'node:test';
import { Logger } from './logger.ts';

describe('Logger', () => {
  describe('log function', () => {
    it('should log a message', () => {
      const logger = new Logger('test');
      const mockConsoleLog = mock.method(console, 'log');

      logger.log('This is a log message');

      strictEqual(mockConsoleLog.mock.callCount(), 1);
      ok(mockConsoleLog.mock.calls[0].arguments[0].includes('{ test } This is a log message'));

      mockConsoleLog.mock.restore();
    });

    it('should log a message with extra parameters', () => {
      const logger = new Logger('test');
      const mockConsoleLog = mock.method(console, 'log', () => {}, { times: 1 });

      logger.log('This is a log message', { extra: 'params' });

      strictEqual(mockConsoleLog.mock.callCount(), 1);
      ok(mockConsoleLog.mock.calls[0].arguments[0].includes('{ test } This is a log message'));
      deepEqual(mockConsoleLog.mock.calls[0].arguments[1], { extra: 'params' });

      mockConsoleLog.mock.restore();
    });
  });

  describe('error function', () => {
    it('should log an error message', () => {
      const logger = new Logger('test');
      const mockConsoleError = mock.method(console, 'error', () => {}, { times: 1 });

      logger.error('This is an error message');

      strictEqual(mockConsoleError.mock.callCount(), 1);
      ok(mockConsoleError.mock.calls[0].arguments[0].includes('{ test } This is an error message'));

      mockConsoleError.mock.restore();
    });

    it('should log an error message with extra parameters', () => {
      const logger = new Logger('test');
      const mockConsoleError = mock.method(console, 'error', () => {}, { times: 1 });

      logger.error('This is an error message', { extra: 'params' });

      strictEqual(mockConsoleError.mock.callCount(), 1);
      ok(mockConsoleError.mock.calls[0].arguments[0].includes('{ test } This is an error message'));
      deepEqual(mockConsoleError.mock.calls[0].arguments[1], { extra: 'params' });

      mockConsoleError.mock.restore();
    });
  });

  describe('warn function', () => {
    it('should log a warning message', () => {
      const logger = new Logger('test');
      const mockConsoleWarn = mock.method(console, 'warn', () => {}, { times: 1 });

      logger.warn('This is a warning message');

      strictEqual(mockConsoleWarn.mock.callCount(), 1);
      ok(mockConsoleWarn.mock.calls[0].arguments[0].includes('{ test } This is a warning message'));

      mockConsoleWarn.mock.restore();
    });

    it('should log a warning message with extra parameters', () => {
      const logger = new Logger('test');
      const mockConsoleWarn = mock.method(console, 'warn', () => {}, { times: 1 });

      logger.warn('This is a warning message', { extra: 'params' });

      strictEqual(mockConsoleWarn.mock.callCount(), 1);
      ok(mockConsoleWarn.mock.calls[0].arguments[0].includes('{ test } This is a warning message'));
      deepEqual(mockConsoleWarn.mock.calls[0].arguments[1], { extra: 'params' });

      mockConsoleWarn.mock.restore();
    });
  });

  it('should log a message with the correct format', () => {
    const logger = new Logger('test');
    const mockConsoleLog = mock.method(console, 'log', () => {}, { times: 1 });

    logger.log('This is a log message');

    strictEqual(mockConsoleLog.mock.callCount(), 1);
    ok(mockConsoleLog.mock.calls[0].arguments[0].includes('{ test } This is a log message'));

    mockConsoleLog.mock.restore();
  });
});
