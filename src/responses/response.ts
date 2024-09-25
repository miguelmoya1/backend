export class ResponseType<T> {
  private readonly _value: T;
  private readonly _statusCode: number;
  private readonly _headers: { [key: string]: string };

  constructor(value: T, statusCode = 200, headers = { 'Content-Type': 'application/json' }) {
    this._value = value;
    this._statusCode = statusCode;
    this._headers = headers;
  }

  get body() {
    return this._value;
  }

  get headers() {
    return this._headers;
  }

  get statusCode() {
    return this._statusCode;
  }
}
