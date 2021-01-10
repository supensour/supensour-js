import * as util from '@/util'

describe('index.ts', () => {
  it('export', () => {
    const keys = Object.keys(util)
    expect(keys.length).toEqual(3)
    expect(keys.includes('error')).toBe(true)
    expect(keys.includes('func')).toBe(true)
    expect(keys.includes('Optional')).toBe(true)

    expect(util.Optional).not.toBeNull()
  })
})
