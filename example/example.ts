import { readFile } from 'node:fs/promises';
import { CommandBus } from '../src/commands/command-bus.ts';
import { CommandHandler } from '../src/commands/command-handler.ts';
import type { Provider } from '../src/index.ts';
import { Controller, Http, inject, InjectorToken, QueryHandler } from '../src/index.ts';

const users = new Controller('users');

users.GET('/', async () => {
  return 'Hello World';
});

users.GET('/:id', async (req) => {
  return `User`;
});

const games = new Controller('games');

games.GET('/', async () => {
  return 'Hello World';
});

// queries
class GetUserQuery {
  public readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}

class GetUserQueryHandler extends QueryHandler<GetUserQuery> {
  public query = GetUserQuery;

  override async execute(query: GetUserQuery) {
    return `Getting user ${query.id}`;
  }
}
// queries end

// commands
class UpdateUserCommand {
  public readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}

class UpdateUserCommandHandler extends CommandHandler<UpdateUserCommand> {
  public handler = UpdateUserCommand;

  override async execute(command: UpdateUserCommand) {
    const userUseCase = inject(USER_USE_CASE);

    console.log(await userUseCase.get('1'));

    return `Updating user ${command.id}`;
  }
}
/// commands end

// providers
class UserUSerCaseImpl implements UserUseCase {
  public async get(id: string) {
    return `User ${id}`;
  }
}
interface UserUseCase {
  get(id: string): Promise<string>;
}

const USER_USE_CASE = new InjectorToken<UserUseCase>('USER_USE_CASE');

const userProvider: Provider = {
  provide: USER_USE_CASE,
  useClass: UserUSerCaseImpl,
};

// providers end

const bootstrap = async () => {
  const server = Http.createServer({
    key: await readFile('localhost.key'),
    cert: await readFile('localhost.crt'),
  });

  server.enableCors();

  server.registerControllers([users, games]);

  server.registerCommands([UpdateUserCommandHandler]);

  server.registerQueries([GetUserQueryHandler]);

  server.registerProviders([userProvider]);

  server.listen(3000);

  const commandBus = inject(CommandBus);

  console.log(await commandBus.execute(new UpdateUserCommand('1')));
};

bootstrap();
