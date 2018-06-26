/** Binds an error class to a handler, and returns the resulting conditional handler.
    @param {Error} T - the example error constructor to compare error class using
    @param {Function} handler - the Express handler function to call when the error class matches
    @returns {Function} - the resulting custom error handler
    @throws TypeError - on instantiation only when arguments are not correct type */
const errorOfTypeMiddleware = (T, handler) =>
(error, request, response, next) => {
  if (!(T instanceof Function) && !(new T() instanceof Error)) {
    throw new TypeError('Argument[0] "T" must be an Error class constructor function')
  }

  if (!(handler instanceof Function)) {
    throw new TypeError('Argument[1] "handler" must be a Function')
  }

  try {
    return (error instanceof T) ? handler(error, request, response, next) : next(error)
  } catch (e) {
    return next(e)
  }
}

module.exports = errorOfTypeMiddleware
