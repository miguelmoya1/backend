import type { AnyClass } from '../helpers/any-class.ts';
import { Logger } from '../logging/logger.ts';
import { CommandHandler } from './command-handler.ts';

export class CommandBus {
  readonly #commands = new Map<string, CommandHandler<unknown>>();
  readonly #logger = new Logger(CommandBus.name);

  register<T>(command: AnyClass<CommandHandler<T>>) {
    const handler = new command();
    const name = handler.getHandler().name;

    if (this.#commands.has(name)) {
      throw new Error(`Command ${name} already registered`);
    }

    this.#commands.set(name, handler);
  }

  async execute<T extends object>(instance: T): Promise<unknown> {
    const command = this.#commands.get(instance.constructor.name);

    if (!command) {
      throw new Error(`Command ${instance.constructor.name} not found`);
    }

    return await command.execute(instance);
  }

  public canHandle(instance: AnyClass) {
    return this.#commands.has(instance.name);
  }

  public logs() {
    if (this.#commands.size === 0) {
      this.#logger.warn('No commands registered');
      return;
    }

    const commands = Array.from(this.#commands.keys()).join(', ');
    this.#logger.log(`Registered commands: ${commands}`);
  }
}
