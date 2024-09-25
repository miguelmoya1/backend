import type { AnyClass } from '../helpers/any-class.ts';
import { Logger } from '../logging/logger.ts';
import { QueryHandler } from './query.handler.ts';

export class QueryBus {
  readonly #queries = new Map<string, QueryHandler<unknown>>();
  readonly #logger = new Logger(QueryBus.name);

  register<T>(query: AnyClass<QueryHandler<T>>) {
    const handler = new query();
    const name = handler.getQuery().name;

    if (this.#queries.has(name)) {
      throw new Error(`Query ${name} already registered`);
    }

    this.#queries.set(name, handler);
  }

  async execute(instance: AnyClass) {
    const query = this.#queries.get(instance.name);

    if (!query) {
      throw new Error(`Query ${instance.name} not found`);
    }

    return await query.execute(instance);
  }

  public canHandle(instance: AnyClass) {
    return this.#queries.has(instance.name);
  }

  public logs() {
    if (this.#queries.size === 0) {
      this.#logger.warn('No queries registered');
      return;
    }

    const queries = Array.from(this.#queries.keys()).join(', ');
    this.#logger.log(`Registered queries: ${queries}`);
  }
}
