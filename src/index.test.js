const { expect } = require('chai')

const whenErrorType = require('./index')

describe('Package', () => {
  it('should export middleware by default', () => {
    expect(whenErrorType).to.be.a('function')
  })
})
