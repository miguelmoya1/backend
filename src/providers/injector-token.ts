// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class InjectorToken<T> {
  readonly #description: string;

  constructor(description: string) {
    this.#description = description;
  }

  toString() {
    return this.#description;
  }
}
