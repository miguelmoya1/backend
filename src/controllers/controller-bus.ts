import { Http2ServerRequest } from 'http2';
import { Logger } from '../logging/logger.ts';
import { Controller } from './controller.ts';

export class ControllerBus {
  readonly #controllers: Controller[] = [];
  readonly #logger = new Logger(ControllerBus.name);

  public register(controller: Controller) {
    this.#controllers.push(controller);
  }

  public canHandle(url: string, method: string) {
    return this.#controllers.some((controller) => controller.canHandle(url, method));
  }

  public async handle(url: string, method: string, req: Http2ServerRequest) {
    const controller = this.#controllers.find((controller) => controller.canHandle(url, method));

    if (!controller) {
      throw new Error('Controller not found');
    }

    return await controller.handle(url, method, req);
  }

  public logs() {
    if (this.#controllers.length === 0) {
      this.#logger.warn('No controllers registered');
      return;
    }

    const controllers = this.#controllers.map((controller) => controller.ref).join(', ');
    this.#logger.log(`Registered controllers: ${controllers}`);
  }
}
