import { Http2ServerRequest } from 'http2';
import { prepareUrl } from '../helpers/prepare-url.ts';
import { ResponseType } from '../responses/response.ts';

export class Route<T> {
  readonly #url: string;
  readonly #method: string;
  readonly #handler: (req: Http2ServerRequest) => Promise<T> | T;

  constructor(url: string, method: string, handler: (req: Http2ServerRequest) => Promise<T> | T) {
    this.#url = prepareUrl(url);
    this.#method = method;
    this.#handler = handler;
  }

  public canHandle(url: string, method: string) {
    return this.#method === method && prepareUrl(this.#url) === prepareUrl(url);
  }

  public async handle(req: Http2ServerRequest) {
    if (!this.#handler) {
      throw new Error('Handler not found');
    }

    return new ResponseType(await this.#handler(req));
  }
}
