class HttpError extends Error {
  constructor(message, error) {
    super(message);
    this.code = errorCode;
  }
}

module.exports = HttpError;
