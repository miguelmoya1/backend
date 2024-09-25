import { BaseError } from './base-error.ts';

export class NotFoundError extends BaseError {
  constructor() {
    super('NOT_FOUND', 404);
  }
}
