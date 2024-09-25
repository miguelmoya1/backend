import type { AnyClass } from '../helpers/any-class.ts';

export abstract class Handler<T> {
  protected abstract readonly handler: AnyClass<T>;
  public abstract execute(handler: T): Promise<unknown>;

  getHandler(): AnyClass<T> {
    return this.handler;
  }
}
