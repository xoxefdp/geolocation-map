import { 
  setToStore,
  setValuesToStore,
  getFromStore,
  unsetStoreValue,
  subscribeToStoreValue,
  unsubscribeToStoreValue,
  resetStore,
 } from 'systems/store'

// ENVIRONMENT VARIABLES

// TESTS
describe('setToStore', () => {
  it('should exist', () => {
    expect(setToStore).not.toBeUndefined()
  })

  it('should be a function', () => {
    expect(typeof setToStore).toBe('function')
  })
})

describe('setValuesToStore', () => {
  it('should exist', () => {
    expect(setValuesToStore).not.toBeUndefined()
  })

  it('should be a function', () => {
    expect(setValuesToStore())
  })
})

describe('getFromStore', () => {
  it('should exist', () => {
    expect(getFromStore).not.toBeUndefined()
  })

  it('should be a function', () => {
    expect(getFromStore())
  })
})

describe('unsetStoreValue', () => {
  it('should exist', () => {
    expect(unsetStoreValue).not.toBeUndefined()
  })

  it('should be a function', () => {
    expect(unsetStoreValue())
  })
})

describe('subscribeToStoreValue', () => {
  it('should exist', () => {
    expect(subscribeToStoreValue).not.toBeUndefined()
  })

  it('should be a function', () => {
    expect(typeof subscribeToStoreValue).toBe('function')
  })
})

describe('unsubscribeToStoreValue', () => {
  it('should exist', () => {
    expect(unsubscribeToStoreValue).not.toBeUndefined()
  })

  it('should be a function', () => {
    expect(typeof unsubscribeToStoreValue).toBe('function')
  })
})

describe('resetStore', () => {
  it('should exist', () => {
    expect(resetStore).not.toBeUndefined()
  })

  it('should be a function', () => {
    expect(resetStore())
  })
})