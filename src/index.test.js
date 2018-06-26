const { expect } = require('chai')

const errorOfType = require('./index')

describe('Package', () => {
  it('should export middleware by default', () => {
    expect(errorOfType).not.to.be.undefined
    expect(errorOfType).to.be.a('function')
  })
})
