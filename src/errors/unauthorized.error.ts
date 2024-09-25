import { BaseError } from './base-error.ts';

export class UnauthorizedError extends BaseError {
  constructor() {
    super('UNAUTHORIZED', 401);
  }
}
