const chai = require('chai')
const spies = require('chai-spies')
chai.use(spies)
const { expect } = chai

const errorOfTypeMiddleware = require('./errorOfTypeMiddleware')

const noop = () => {}
const newError = new Error('WHOOPS!')
const throwNewError = () => { throw newError }
const identity = x => x
const mockHandlerResult = 'CALLED'
const mockHandler = (error, request, response, next) => mockHandlerResult

class MockCustomError extends Error {}
class MockMismatchError extends Error {}

describe('Middleware', () => {
  it('should return a function when instantiated', () => {
    const instantiatedMiddleware = errorOfTypeMiddleware(MockCustomError, noop)

    expect(instantiatedMiddleware).to.be.a('function')
  })

  it('should NOT call next(...), but should call handler when error class matches', () => {
    const spyNext = chai.spy(noop)
    const instantiatedMiddleware = errorOfTypeMiddleware(MockCustomError, mockHandler)

    const errorHandlerResult = instantiatedMiddleware(
      new MockCustomError('MESSAGE'), {}, {}, spyNext
    )

    expect(spyNext).not.to.have.been.called()
    expect(errorHandlerResult).to.equal(mockHandlerResult)
  })

  it('should call next(...), but should NOT call handler when error class does not match', () => {
    const spyNext = chai.spy(noop)
    const instantiatedMiddleware = errorOfTypeMiddleware(MockCustomError, mockHandler)

    const errorHandlerResult = instantiatedMiddleware(
      new MockMismatchError('MESSAGE'), {}, {}, spyNext
    )

    expect(spyNext).to.have.been.called()
    expect(errorHandlerResult).not.to.equal(mockHandlerResult)
  })

  it('should always call handler when instantiated with base Error class', () => {
    const spyNext = chai.spy(noop)
    const instantiatedMiddleware = errorOfTypeMiddleware(Error, mockHandler)

    const errorHandlerResult = instantiatedMiddleware(
      new MockCustomError('MESSAGE'), {}, {}, spyNext
    )

    expect(spyNext).not.to.have.been.called()
    expect(errorHandlerResult).to.equal(mockHandlerResult)
  })

  it('should catch and next(...) the error, when the handler provided is broken and throws', () => {
    const spyNext = chai.spy(identity)
    const instantiatedMiddleware = errorOfTypeMiddleware(MockCustomError, throwNewError)

    const errorHandlerResult = instantiatedMiddleware(
      new MockCustomError('MESSAGE'), {}, {}, spyNext
    )

    expect(spyNext).to.have.been.called.with(newError)
    expect(errorHandlerResult).to.equal(newError)
  })

  it('should throw on instantiation when not provided with an actual error', () => {
    const instantiateMiddlewareFail = () =>
      errorOfTypeMiddleware({ not: 'error' }, mockHandler)

    expect(instantiateMiddlewareFail()).to.throw()
  })

  it('should throw on instantiation when not provided with a handler function', () => {
    const instantiateMiddlewareFail = () =>
      errorOfTypeMiddleware(MockCustomError, { not: 'function' })

    expect(instantiateMiddlewareFail()).to.throw()
  })
})
