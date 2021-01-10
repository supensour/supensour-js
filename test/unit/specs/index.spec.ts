import * as util from '@/index'

describe('index.ts', () => {
  it('export', () => {
    const keys = Object.keys(util)
    expect(keys.length).toEqual(1)
    expect(keys.includes('util')).toBe(true)
  })
})
