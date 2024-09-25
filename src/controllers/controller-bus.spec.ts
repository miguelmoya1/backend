import { deepStrictEqual, ok, rejects, strictEqual } from 'node:assert';
import { Http2ServerRequest } from 'node:http2';
import { beforeEach, describe, it, mock } from 'node:test';
import { ResponseType } from '../responses/response.ts';
import { ControllerBus } from './controller-bus.ts';
import { Controller } from './controller.ts';

describe('ControllerBus', () => {
  let controllerBus: ControllerBus;

  beforeEach(() => {
    controllerBus = new ControllerBus();
  });

  describe('register', () => {
    it('should register a controller', () => {
      const controller = new Controller('/test');

      controller.GET('', () => Promise.resolve('test'));

      controllerBus.register(controller);

      strictEqual(controllerBus.canHandle('/test/', 'GET'), true);
    });

    it('should register multiple controllers', () => {
      const controller1 = new Controller('/test1');
      const controller2 = new Controller('/test2');

      controller1.GET('', () => Promise.resolve('test1'));
      controller2.GET('', () => Promise.resolve('test1'));

      controllerBus.register(controller1);
      controllerBus.register(controller2);

      strictEqual(controllerBus.canHandle('/test1/', 'GET'), true);
      strictEqual(controllerBus.canHandle('/test2/', 'GET'), true);
    });
  });

  describe('canHandle', () => {
    it('should return true when a controller can handle the request', () => {
      const controller = new Controller('/test');

      controller.GET('', () => Promise.resolve('test'));

      controllerBus.register(controller);

      strictEqual(controllerBus.canHandle('/test/', 'GET'), true);
    });

    it('should return false when no controller can handle the request', () => {
      strictEqual(controllerBus.canHandle('/test/', 'GET'), false);
    });
  });

  describe('handle', () => {
    it('should handle the request', async () => {
      const controller = new Controller('test');

      controller.GET('', () => Promise.resolve('test'));

      controllerBus.register(controller);

      const result = await controllerBus.handle('/test/', 'GET', {} as Http2ServerRequest);

      deepStrictEqual(result, new ResponseType('test', 200));
    });

    it('should throw an error when no controller can handle the request', () => {
      rejects(
        async () => {
          await controllerBus.handle('/test/', 'GET', {} as Http2ServerRequest);
        },
        {
          message: 'Controller not found',
        }
      );
    });
  });

  describe('logs', () => {
    it('should warn no controllers registered', () => {
      const mockConsoleLog = mock.method(console, 'warn', () => {}, { times: 1 });

      controllerBus.logs();

      strictEqual(mockConsoleLog.mock.callCount(), 1);
      ok(mockConsoleLog.mock.calls[0].arguments[0].includes('No controllers registered'));

      mockConsoleLog.mock.restore();
    });

    it('should log registered controllers', () => {
      const controller1 = new Controller('/test1');
      const controller2 = new Controller('/test2');

      controller1.GET('', () => Promise.resolve('test1'));
      controller2.GET('', () => Promise.resolve('test2'));

      controllerBus.register(controller1);
      controllerBus.register(controller2);

      const mockConsoleLog = mock.method(console, 'log', () => {}, { times: 1 });

      controllerBus.logs();

      strictEqual(mockConsoleLog.mock.callCount(), 1);
      ok(mockConsoleLog.mock.calls[0].arguments[0].includes('/test1/'));
      ok(mockConsoleLog.mock.calls[0].arguments[0].includes('/test2/'));

      mockConsoleLog.mock.restore();
    });
  });
});
