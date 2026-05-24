/**
 * AppError wraps any expected operational error (bad input, not found,
 * unauthorized, etc.) so the global error handler can distinguish it from
 * unexpected programming errors and respond with the correct HTTP status.
 */
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number
  ) {
    super(message);
    // Restore the prototype chain so `instanceof AppError` works after
    // TypeScript compiles down to ES5 classes.
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "AppError";
  }
}
