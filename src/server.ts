import type { Http2SecureServer, SecureServerOptions } from 'node:http2';
import { createSecureServer, Http2ServerRequest, Http2ServerResponse } from 'node:http2';
import { CommandBus } from './commands/command-bus.ts';
import { CommandHandler } from './commands/command-handler.ts';
import { ControllerBus } from './controllers/controller-bus.ts';
import { Controller } from './controllers/controller.ts';
import { BaseError } from './errors/base-error.ts';
import { InternalServerError } from './errors/internal-server.error.ts';
import { NotFoundError } from './errors/not-found.error.ts';
import type { AnyClass } from './helpers/any-class.ts';
import { Logger } from './logging/logger.ts';
import { InjectorToken } from './providers/injector-token.ts';
import type { Provider } from './providers/provider.ts';
import { ProvidersBus } from './providers/providers-bus.ts';
import { QueryBus } from './queries/query-bus.ts';
import type { QueryHandler } from './queries/query.handler.ts';
import { ResponseType } from './responses/response.ts';

export class Server {
  readonly #commandBus = new CommandBus();
  readonly #queryBus = new QueryBus();
  readonly #providersBus = new ProvidersBus();
  readonly #controllers = new ControllerBus();

  readonly #logger = new Logger(Server.name);
  readonly #withLogs: boolean = true;

  constructor(options: { withLogs?: boolean } = {}) {
    this.#withLogs = options.withLogs ?? this.#withLogs;
  }

  #enableCors = false;
  #server: Http2SecureServer;

  public inject(instance: typeof CommandBus): Exclude<CommandBus, 'logs' | 'register' | 'canHandle'>;
  public inject(instance: typeof QueryBus): Exclude<QueryBus, 'logs' | 'register' | 'canHandle'>;
  public inject<T>(instance: InjectorToken<T>): T;
  public inject<T>(instance: InjectorToken<T> | typeof CommandBus | typeof QueryBus) {
    if (instance === CommandBus) {
      return this.#commandBus as Exclude<CommandBus, 'logs' | 'register' | 'canHandle'>;
    }

    if (instance === QueryBus) {
      return this.#queryBus as Exclude<QueryBus, 'logs' | 'register' | 'canHandle'>;
    }

    if (instance instanceof InjectorToken) {
      return this.#providersBus.get(instance);
    }
  }

  /**
   * Enable CORS for the server
   *
   *  `res.setHeader('Access-Control-Allow-Origin', '*');`
   *
   *  `res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');`
   *
   *  `res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');`
   */
  public enableCors() {
    this.#enableCors = true;
  }

  public registerProviders(providers: Provider[]) {
    providers.forEach((provider) => this.#providersBus.register(provider));
  }

  public registerCommands(commands: AnyClass<CommandHandler<unknown>>[]) {
    commands.forEach((command) => this.#commandBus.register(command));
  }

  public registerQueries(queries: AnyClass<QueryHandler<unknown>>[]) {
    queries.forEach((query) => this.#queryBus.register(query));
  }

  public registerControllers(controllers: Controller[]) {
    controllers.forEach((controller) => this.#controllers.register(controller));
  }

  public listen(port: number) {
    if (this.#withLogs) {
      this.#commandBus.logs();
      this.#queryBus.logs();
      this.#controllers.logs();
      this.#providersBus.logs();
    }

    this.#server.listen(port, () => {
      if (this.#withLogs) {
        this.#logger.log(`Server running at https://localhost:${port}/`);
      }
    });
  }

  public createServer(options: SecureServerOptions) {
    this.#logger.log('Creating server...');
    this.#server = createSecureServer(options);

    this.#server.on('request', async (req, res) => await this.#handleRequest(req, res));
  }

  async #handleRequest(req: Http2ServerRequest, res: Http2ServerResponse) {
    const { url, method } = req;
    const canHandle = this.#controllers.canHandle(url, method);

    if (canHandle) {
      try {
        const response = await this.#controllers.handle(url, method, req);

        return this.#handleResponse(res, response);
      } catch (error) {
        if (error instanceof BaseError) {
          const response = new ResponseType(error.body, error.statusCode);

          return this.#handleResponse(res, response);
        }

        const internalError = new InternalServerError();
        const response = new ResponseType(internalError.body, internalError.statusCode);

        return this.#handleResponse(res, response);
      }
    } else {
      const notFoundError = new NotFoundError();
      const response = new ResponseType(notFoundError.body, notFoundError.statusCode);

      return this.#handleResponse(res, response);
    }
  }

  #handleResponse(res: Http2ServerResponse, response: ResponseType<unknown>) {
    if (this.#enableCors) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    res.writeHead(response.statusCode, response.headers);
    res.end(JSON.stringify(response.body));
  }
}
