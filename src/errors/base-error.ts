export abstract class BaseError {
  readonly #message?: string;
  readonly #statusCode: number;

  constructor(message?: string, statusCode = 500) {
    this.#message = message;
    this.#statusCode = statusCode;
  }

  get statusCode() {
    return this.#statusCode;
  }

  get body() {
    return {
      message: this.#message,
      statusCode: this.#statusCode,
      status: 'error',
    };
  }
}
