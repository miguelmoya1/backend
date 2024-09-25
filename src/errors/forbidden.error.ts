import { BaseError } from './base-error.ts';

export class ForbiddenError extends BaseError {
  constructor() {
    super('FORBIDDEN', 403);
  }
}
