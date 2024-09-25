import { deepStrictEqual, rejects, strictEqual } from 'node:assert';
import { Http2ServerRequest } from 'node:http2';
import { beforeEach, describe, it } from 'node:test';
import { ResponseType } from '../responses/response.ts';
import { Controller } from './controller.ts';

describe('Controller', () => {
  let controller: Controller;

  beforeEach(() => {
    controller = new Controller('/test');
  });

  describe('GET', () => {
    it('should register a GET route', () => {
      controller.GET('', () => Promise.resolve('test'));

      strictEqual(controller.canHandle('/test/', 'GET'), true);
    });

    it('should register a POST route', () => {
      controller.POST('', () => Promise.resolve('test'));

      strictEqual(controller.canHandle('/test/', 'POST'), true);
    });

    it('should register a PUT route', () => {
      controller.PUT('', () => Promise.resolve('test'));

      strictEqual(controller.canHandle('/test/', 'PUT'), true);
    });

    it('should register a DELETE route', () => {
      controller.DELETE('', () => Promise.resolve('test'));

      strictEqual(controller.canHandle('/test/', 'DELETE'), true);
    });
  });

  describe('canHandle', () => {
    it('should return true if controller can handle', () => {
      controller.GET('', () => Promise.resolve('test'));

      const result = controller.canHandle('/test/', 'GET');

      strictEqual(result, true);
    });

    it('should return false if controller can not handle', () => {
      const result = controller.canHandle('/test/', 'GET');

      strictEqual(result, false);
    });
  });

  describe('handle', () => {
    it('should handle the route', async () => {
      controller.GET('', () => Promise.resolve('test'));

      const result = await controller.handle('/test/', 'GET', {} as Http2ServerRequest);

      deepStrictEqual(result, new ResponseType('test', 200));
    });

    it('should throw an error if route is not found', () => {
      rejects(
        async () => {
          await controller.handle('/test/', 'GET', {} as Http2ServerRequest);
        },
        {
          message: 'Route not found',
        }
      );
    });
  });

  describe('prepareUrl', () => {
    it('should prepare the url', () => {
      const controllerWithoutSlash = new Controller('test');

      controllerWithoutSlash.GET('', () => Promise.resolve('test'));

      strictEqual(controllerWithoutSlash.canHandle('/test/', 'GET'), true);
    });

    it('should prepare the /url', () => {
      const controllerWithoutSlash = new Controller('/test');

      controllerWithoutSlash.GET('', () => Promise.resolve('test'));

      strictEqual(controllerWithoutSlash.canHandle('/test/', 'GET'), true);
    });

    it('should prepare the url/', () => {
      const controllerWithoutSlash = new Controller('test/');

      controllerWithoutSlash.GET('', () => Promise.resolve('test'));

      strictEqual(controllerWithoutSlash.canHandle('/test/', 'GET'), true);
    });

    it('should prepare the /url/', () => {
      const controllerWithoutSlash = new Controller('/test/');

      controllerWithoutSlash.GET('', () => Promise.resolve('test'));

      strictEqual(controllerWithoutSlash.canHandle('/test/', 'GET'), true);
    });
  });

  describe('preparePath', () => {
    it('should prepare the /url/test/', () => {
      const controllerWithoutSlash = new Controller('test');

      controllerWithoutSlash.GET('/test', () => Promise.resolve('test'));

      strictEqual(controllerWithoutSlash.canHandle('/test/test/', 'GET'), true);
    });

    it('should prepare the url/test/', () => {
      const controllerWithoutSlash = new Controller('test');

      controllerWithoutSlash.GET('test/', () => Promise.resolve('test'));

      strictEqual(controllerWithoutSlash.canHandle('/test/test/', 'GET'), true);
    });

    it('should prepare the /url/test/', () => {
      const controllerWithoutSlash = new Controller('test');

      controllerWithoutSlash.GET('/test/', () => Promise.resolve('test'));

      strictEqual(controllerWithoutSlash.canHandle('/test/test/', 'GET'), true);
    });

    it('should prepare the url/test', () => {
      const controllerWithoutSlash = new Controller('test');

      controllerWithoutSlash.GET('test', () => Promise.resolve('test'));

      strictEqual(controllerWithoutSlash.canHandle('/test/test/', 'GET'), true);
    });
  });
});
