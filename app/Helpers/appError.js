class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    console.error('AppError', message, statusCode)

    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
