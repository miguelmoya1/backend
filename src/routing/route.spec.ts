import { deepStrictEqual, rejects, strictEqual } from 'node:assert';
import { Http2ServerRequest } from 'node:http2';
import { beforeEach, describe, it } from 'node:test';
import { ResponseType } from '../responses/response.ts';
import { Route } from './route.ts';

describe('Route', () => {
  let route: Route<undefined>;

  beforeEach(() => {
    route = new Route('/test', 'GET', async () => void 0);
  });

  describe('canHandle', () => {
    it('should return true if route can handle', () => {
      const result = route.canHandle('/test/', 'GET');

      strictEqual(result, true);
    });

    it('should return false if route can not handle', () => {
      const result = route.canHandle('/test/', 'POST');

      strictEqual(result, false);
    });
  });

  describe('handle', () => {
    it('should handle the route', async () => {
      const result = await route.handle({} as Http2ServerRequest);

      deepStrictEqual(result, new ResponseType(void 0, 200));
    });

    it('should throw an error if handler is not found', () => {
      const route = new Route('/test', 'GET', undefined as unknown as () => Promise<ResponseType<unknown>>);

      rejects(async () => {
        await route.handle({} as Http2ServerRequest);
      });
    });
  });

  describe('prepareUrl', () => {
    it('should prepare the url', () => {
      const routeWithoutSlash = new Route('test', 'GET', async () => new ResponseType('test', 200));

      strictEqual(routeWithoutSlash.canHandle('/test/', 'GET'), true);
    });

    it('should prepare the /url', () => {
      const routeWithoutSlash = new Route('/test', 'GET', async () => new ResponseType('test', 200));

      strictEqual(routeWithoutSlash.canHandle('/test/', 'GET'), true);
    });

    it('should prepare the url/', () => {
      const routeWithoutSlash = new Route('test/', 'GET', async () => new ResponseType('test', 200));

      strictEqual(routeWithoutSlash.canHandle('/test/', 'GET'), true);
    });

    it('should prepare the /url/', () => {
      const routeWithoutSlash = new Route('/test/', 'GET', async () => new ResponseType('test', 200));

      strictEqual(routeWithoutSlash.canHandle('/test/', 'GET'), true);
    });
  });
});
