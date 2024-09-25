import { Http2ServerRequest } from 'http2';
import { prepareUrl } from '../helpers/prepare-url.ts';
import { Route } from '../routing/route.ts';

export class Controller {
  readonly #baseUrl: string;
  readonly #routes: Route<unknown>[] = [];
  readonly #ref: string;

  get ref() {
    return this.#ref;
  }

  constructor(baseUrl: string) {
    this.#baseUrl = prepareUrl(baseUrl);
    this.#ref = `${this.constructor.name}(${this.#baseUrl})`;
  }

  public canHandle(url: string, method: string) {
    return this.#routes.some((route) => route.canHandle(url, method));
  }

  public async handle(url: string, method: string, req: Http2ServerRequest) {
    const route = this.#routes.find((route) => route.canHandle(url, method));

    if (!route) {
      throw new Error('Route not found');
    }

    return route.handle(req);
  }

  public GET<T>(url: string, handler: (req?: Http2ServerRequest) => Promise<T> | T) {
    this.#on(url, 'GET', handler);
  }

  public POST<T>(url: string, handler: (req?: Http2ServerRequest) => Promise<T> | T) {
    this.#on(url, 'POST', handler);
  }

  public PUT<T>(url: string, handler: (req?: Http2ServerRequest) => Promise<T> | T) {
    this.#on(url, 'PUT', handler);
  }

  public DELETE<T>(url: string, handler: (req?: Http2ServerRequest) => Promise<T> | T) {
    this.#on(url, 'DELETE', handler);
  }

  #on<T>(url: string, method: string, handler: (req?: Http2ServerRequest) => Promise<T> | T) {
    const path = prepareUrl(this.#baseUrl + prepareUrl(url));

    this.#routes.push(new Route(path, method, handler));
  }
}
