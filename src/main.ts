import type { SecureServerOptions } from 'node:http2';
import { CommandBus } from './commands/command-bus.ts';
import { InjectorToken } from './providers/injector-token.ts';
import { QueryBus } from './queries/query-bus.ts';
import { Server } from './server.ts';

let server: Server;

class Http {
  public static createServer = (
    options: SecureServerOptions,
    extraOptions?: ConstructorParameters<typeof Server>[0]
  ) => {
    server = new Server(extraOptions);

    server.createServer(options);

    return server;
  };
}

function inject(instance: typeof CommandBus): Exclude<CommandBus, 'logs' | 'register' | 'canHandle'>;
function inject(instance: typeof QueryBus): Exclude<QueryBus, 'logs' | 'register' | 'canHandle'>;
function inject<T>(instance: InjectorToken<T>): T;
function inject<T>(instance: InjectorToken<T> | typeof CommandBus | typeof QueryBus) {
  if (instance === CommandBus) {
    return server.inject(instance) as Exclude<CommandBus, 'logs' | 'register' | 'canHandle'>;
  }

  if (instance === QueryBus) {
    return server.inject(instance) as Exclude<QueryBus, 'logs' | 'register' | 'canHandle'>;
  }

  if (instance instanceof InjectorToken) {
    return server.inject(instance);
  }
}

export { Http, inject };
