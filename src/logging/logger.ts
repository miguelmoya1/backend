export class Logger {
  readonly #name: string;

  constructor(name: string) {
    this.#name = name;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public log(message: any, ...extraParams: any[]) {
    this.#write('LOG', message, ...extraParams);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public error(message: any, ...extraParams: any[]) {
    this.#write('ERROR', message, ...extraParams);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public warn(message: any, ...extraParams: any[]) {
    this.#write('WARN', message, ...extraParams);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #write(LogLevel: string, message: any, ...extraParams: any[]) {
    const messageFormat = `[${this.#formatDate()}] { ${this.#name} } ${message}`;
    switch (LogLevel) {
      case 'LOG':
        console.log(messageFormat, ...extraParams);
        break;
      case 'ERROR':
        console.error(messageFormat, ...extraParams);
        break;
      case 'WARN':
        console.warn(messageFormat, ...extraParams);
        break;
    }
  }

  #formatDate(date = new Date()) {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
}
