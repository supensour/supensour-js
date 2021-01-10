import { Optional } from '@/util/optional'

describe('optional.ts', () => {
  it('static#empty', () => {
    expect(Optional.empty().isEmpty()).toBe(true)
  })

  it('static#of', () => {
    expect(Optional.of(2).get()).toEqual(2)
    expect(() => Optional.of(null)).toThrow('Null or undefined value')
    expect(() => Optional.of(undefined)).toThrow('Null or undefined value')
  })

  it('static#ofNullable', () => {
    expect(Optional.ofNullable(2).get()).toEqual(2)
    expect(Optional.ofNullable(null).isEmpty()).toBe(true)
    expect(Optional.ofNullable(undefined).isEmpty()).toBe(true)
  })

  it('filter', () => {
    expect(Optional.ofNullable(2).filter(isNaN).isPresent()).toBe(false)
    expect(Optional.ofNullable(NaN).filter(isNaN).isPresent()).toBe(true)
    expect(Optional.empty<number>().filter(isNaN).isPresent()).toBe(false)
    expect(() => Optional.ofNullable(2).filter(null))
      .toThrow(new TypeError('The given predicate is not a function'))
  })

  it('flatMap', () => {
    const optional = Optional.of(2)
    expect(optional.flatMap(x => Optional.of(x * 2)).get()).toEqual(4)
    expect(Optional.empty<number>().flatMap(x => Optional.of(x * 2)).isEmpty())
      .toBe(true)
    expect(() => optional.flatMap(null).get())
      .toThrow(new TypeError('The given mapper is not a function'))
    // @ts-ignore
    expect(() => optional.flatMap(x => x).get())
      .toThrow(new TypeError('Mapper doesn\'t return an Optional'))
  })

  it('get', () => {
    expect(Optional.of(2).get()).toEqual(2)
    expect(() => Optional.empty().get()).toThrow('Null or undefined value')
  })

  it('ifEmpty', () => {
    const consumer = jest.fn()

    Optional.of(2).ifEmpty(consumer)
    expect(consumer).not.toHaveBeenCalled()

    Optional.empty().ifEmpty(consumer)
    expect(consumer).toHaveBeenCalledTimes(1)

    expect(() => Optional.of(2).ifEmpty(null))
      .toThrow('The given onEmpty action is not a function')
  })

  it('ifPresent', () => {
    const consumer = jest.fn()

    Optional.of(2).ifPresent(consumer)
    expect(consumer).toHaveBeenCalledTimes(1)
    expect(consumer).toHaveBeenLastCalledWith(2)

    consumer.mockReset()
    Optional.empty().ifPresent(consumer)
    expect(consumer).not.toHaveBeenCalled()

    expect(() => Optional.empty().ifPresent(null))
      .toThrow('The given consumer is not a function')
  })

  it('ifPresentOrElse', () => {
    const onPresent = jest.fn()
    const onEmpty = jest.fn()

    Optional.of(2).ifPresentOrElse(onPresent, onEmpty)
    expect(onPresent).toHaveBeenCalledTimes(1)
    expect(onPresent).toHaveBeenLastCalledWith(2)
    expect(onEmpty).not.toHaveBeenCalled()

    onPresent.mockReset()
    onEmpty.mockReset()
    Optional.empty().ifPresentOrElse(onPresent, onEmpty)
    expect(onPresent).not.toHaveBeenCalled()
    expect(onEmpty).toHaveBeenCalledTimes(1)

    expect(() => Optional.empty().ifPresentOrElse(null, onEmpty))
      .toThrow('The given onPresent action is not a function')
    expect(() => Optional.empty().ifPresentOrElse(onPresent, null))
      .toThrow('The given onEmpty action is not a function')
  })

  it('isEmpty', () => {
    expect(Optional.of(2).isEmpty()).toBe(false)
    expect(Optional.empty().isEmpty()).toBe(true)
  })

  it('isPresent', () => {
    expect(Optional.of(2).isPresent()).toBe(true)
    expect(Optional.empty().isPresent()).toBe(false)
  })

  it('map', () => {
    expect(Optional.of(2).map(x => x * 2).get()).toEqual(4)
    expect(Optional.empty<number>().map(x => x * 2).isEmpty()).toBe(true)
    expect(() => Optional.empty().map(null))
      .toThrow('The given mapper is not a function')
  })

  it('or', () => {
    expect(Optional.of(2).or(() => Optional.of(3)).get())
      .toEqual(2)
    expect(Optional.empty<number>().or(() => Optional.of(3)).get())
      .toEqual(3)
    expect(() => Optional.of(2).or(null))
      .toThrow(new TypeError('The given supplier is not a function'))
    // @ts-ignore
    expect(() => Optional.empty().or(() => 3))
      .toThrow(new TypeError('Supplier doesn\'t return an Optional'))
  })

  it('orElse', () => {
    expect(Optional.of(2).orElse(3)).toEqual(2)
    expect(Optional.empty<number>().orElse(3)).toEqual(3)
  })

  it('orElseGet', () => {
    expect(Optional.of(2).orElseGet(() => 3)).toEqual(2)
    expect(Optional.empty<number>().orElseGet(() => 3)).toEqual(3)
    expect(() => Optional.of(2).orElseGet(null))
      .toThrow(new TypeError('The given supplier is not a function'))
  })

  it('orElseThrow', () => {
    expect(Optional.of(2).orElseThrow(() => new Error())).toEqual(2)

    const error = new Error('Test error')
    expect(() => Optional.empty().orElseThrow(() => error))
      .toThrow(error)

    expect(() => Optional.of(2).orElseThrow(null))
      .toThrow(new TypeError('The given error supplier is not a function'))
  })

  it('peek', () => {
    const peek = jest.fn()
    Optional.empty<number>()
      .peek(peek)
      .or(() => Optional.of(2))
      .peek(peek)
      .map(x => x * 2)
      .peek(peek)

    expect(peek).toHaveBeenCalledTimes(3)
    expect(peek).toHaveBeenNthCalledWith(1, null)
    expect(peek).toHaveBeenNthCalledWith(2, 2)
    expect(peek).toHaveBeenNthCalledWith(3, 4)
  })

  it('toString', () => {
    expect(Optional.of(2).toString())
      .toEqual('Optional(2)')
    expect(Optional.ofNullable(null).toString())
      .toEqual('Optional(null)')
    expect(Optional.ofNullable(undefined).toString())
      .toEqual('Optional(undefined)')
  })
})
