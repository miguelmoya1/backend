import { Logger } from '../logging/logger.ts';
import { InjectorToken } from './injector-token.ts';
import type { Provider } from './provider.ts';

export class ProvidersBus {
  readonly #providers = new Map<InjectorToken<unknown>, unknown>();
  readonly #logger = new Logger(ProvidersBus.name);

  public register(provider: Provider) {
    if (provider.useValue) {
      this.#providers.set(provider.provide, provider.useValue);
    } else if (provider.useClass) {
      const instance = new provider.useClass();
      this.#providers.set(provider.provide, instance);
    }
  }

  public get<T>(token: InjectorToken<T>) {
    const provider = this.#providers.get(token);

    if (!provider) {
      throw new Error(`No provider found for ${token.toString()}`);
    }

    return provider as T;
  }

  public logs() {
    if (this.#providers.size === 0) {
      this.#logger.warn('No providers registered');
      return;
    }

    const providers = Array.from(this.#providers.keys())
      .map((token) => token.toString())
      .join(', ');
    this.#logger.log(`Registered providers: ${providers}`);
  }
}
