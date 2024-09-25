import { BaseError } from './base-error.ts';

export class InternalServerError extends BaseError {
  constructor() {
    super('INTERNAL_SERVER_ERROR', 500);
  }
}
