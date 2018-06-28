/** Binds an error class to a handler, and returns the resulting predicated handler.
    @param {Error} ErrorType - the example error constructor to compare error class
    @param {Function} handler - the Express handler function to call when the error class matches
    @returns {Function} - the resulting custom error handler
    @throws TypeError - on instantiation only when arguments are not correct type */
const errorOfTypeMiddleware = (ErrorType, handler) =>
(error, request, response, next) => {
  if (!(new ErrorType() instanceof Error)) {
    throw new TypeError('ErrorType provided is not an Error class')
  }

  if (!(handler instanceof Function)) {
    throw new TypeError('A handler must be a Function')
  }

  try {
    return (error instanceof ErrorType)
    ? handler(error, request, response, next)
    : next(error)
  } catch (e) {
    return next(e)
  }
}

module.exports = errorOfTypeMiddleware
