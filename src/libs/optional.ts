import {
  NoSuchElementError,
  NullValueError
} from '@/libs/util/error'
import {
  CallableFunction,
  ConsumerFunction,
  MapperFunction,
  PredicateFunction,
  SupplierFunction
} from '@/libs/util/function'

export default class Optional<T> {

  private readonly value: T

  private constructor(value: T) {
    this.value = value
  }

  static empty<T>(): Optional<T> {
    return new Optional(null)
  }

  static of<T>(value: T): Optional<T> {
    if (value != null) {
      return new Optional(value)
    }
    throw new NullValueError('Null or undefined value')
  }

  static ofNullable<T>(value: T): Optional<T> {
    return new Optional(value)
  }

  filter(predicate: PredicateFunction<T>): Optional<T> {
    return this.isPresent() ? (predicate(this.value) ? this : Optional.empty()) : this
  }

  flatMap<R>(mapper: MapperFunction<T, Optional<R>>): Optional<R> {
    if (this.isPresent()) {
      const newOptional: Optional<R> = mapper(this.value)
      if (!(newOptional instanceof Optional)) {
        throw new TypeError('Mapper doesn\'t return an Optional')
      }
      return newOptional
    }
    return Optional.empty()
  }

  get(): T {
    if (this.isPresent()) {
      return this.value
    }
    throw new NoSuchElementError('Null or undefined value')
  }

  ifEmpty(onEmpty: CallableFunction): void {
    this.isPresent() || onEmpty()
  }

  ifPresent(consumer: ConsumerFunction<T>): void {
    consumer(this.value)
  }

  ifPresentOrElse(onPresent: ConsumerFunction<T>, onEmpty: CallableFunction): void {
    this.isPresent() ? onPresent(this.value) : onEmpty()
  }

  isEmpty(): boolean {
    return this.value == null
  }

  isPresent(): boolean {
    return this.value != null
  }

  map<R>(mapper: MapperFunction<T, R>): Optional<R> {
    return this.isPresent() ? new Optional<R>(mapper(this.value)) : Optional.empty()
  }

  or(supplier: SupplierFunction<Optional<T>>): Optional<T> {
    if (this.isPresent()) {
      return this
    }
    const newOptional: Optional<T> = supplier()
    if (!(newOptional instanceof Optional)) {
      throw new TypeError('Supplier doesn\'t return an Optional')
    }
    return newOptional
  }

  orElse(other: T): T {
    return this.isPresent() ? this.value : other
  }

  orElseGet(supplier: SupplierFunction<T>): T {
    return this.isPresent() ? this.value : supplier()
  }

  orElseThrow<E extends Error>(errorSupplier: SupplierFunction<E>): T {
    if (this.isPresent()) {
      return this.value
    }
    throw errorSupplier()
  }

  peek(consumer: ConsumerFunction<T>): Optional<T> {
    consumer(this.value)
    return this
  }

  toString() {
    return `Optional(${this.value})`
  }

  readonly prototype: Optional<T>
}
