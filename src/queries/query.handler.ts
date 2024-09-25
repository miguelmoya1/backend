import type { AnyClass } from '../helpers/any-class.ts';

export abstract class QueryHandler<T> {
  protected abstract readonly query: AnyClass<T>;
  public abstract execute(query: T): Promise<unknown>;

  getQuery(): AnyClass<T> {
    return this.query;
  }
}
