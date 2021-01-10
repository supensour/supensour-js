import {
  NoSuchElementError,
  NullValueError
} from '@/util/error'
import {
  CallableFunction,
  ConsumerFunction,
  MapperFunction,
  PredicateFunction,
  SupplierFunction
} from '@/util/func'

function validateFunction (func: any, message?: string) {
  if (typeof func !== 'function') {
    throw new TypeError(message)
  }
}

/**
 * A container that may contain a null value.
 * The implementation is inspired by {@link https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Optional.html | java.util.Optional }.
 *
 * Normal way
 * ```Javascript
 * var profileUrl = user.profileUrl || '/default-profile.jpeg'
 * ```
 * With Optional
 * ```Javascript
 * var profileUrl = Optional.ofNullable(user.profileUrl)
 *    .orElse('/default-profile.jpeg')
 * ```
 *
 * @template T - The type of the value
 */
export class Optional<T> {

  private readonly value: T

  /**
   * Private constructor.
   *
   * @template T - The type of the value
   * @param value - A nullable value to be wrapped
   * @private
   */
  private constructor(value: T) {
    this.value = value
  }

  /**
   * Returns an empty Optional.
   *
   * @example
   * ```Javascript
   * Optional.empty().isEmpty() // true
   * ```
   *
   * @template T - The type of the non-existent value
   * @returns an empty Optional
   */
  static empty<T>(): Optional<T> {
    return new Optional<T>(null)
  }

  /**
   * Returns an Optional containing the given non-null value.
   *
   * @example
   * ```Javascript
   * Optional.of('a value').isPresent() // true
   * ```
   * @example
   * ```Javascript
   * Optional.of(null) // throws NullValueError
   * ```
   *
   * @template T - The type of the non-null value
   * @param value - A non-null value
   * @returns an Optional containing a non-null value
   *
   * @throws {@link NullValueError}
   * if the given value is null or undefined
   */
  static of<T>(value: T): Optional<T> {
    if (value != null) {
      return new Optional(value)
    }
    throw new NullValueError('Null or undefined value')
  }

  /**
   * Returns an Optional containing the given nullable value.
   *
   * @example
   * ```Javascript
   * Optional.ofNullable(3).isPresent() // true
   * ```
   *
   * @template T - The type of the nullable value
   * @param value - A nullable value
   * @returns an Optional containing a nullable value
   */
  static ofNullable<T>(value: T): Optional<T> {
    return new Optional(value)
  }

  /**
   * If a value is present and matches the given predicate, returns an Optional containing the value,
   * otherwise returns an empty Optional.
   *
   * @example
   * ```Javascript
   * Optional.of(2)
   *    .filter(value => value > 0)
   *    .isPresent() // true
   * ```
   *
   * @example
   * ```Javascript
   * Optional.of(2)
   *    .filter(value => value <= 0)
   *    .isPresent() // false
   * ```
   *
   * @param predicate - The predicate to test the value in this Optional
   * @returns an Optional containing the value of this Optional, if a value is present and matches the given predicate,
   * otherwise an empty Optional
   *
   * @throws <b>TypeError</b>
   * if the given predicate is not a function
   */
  filter(predicate: PredicateFunction<T>): Optional<T> {
    validateFunction(predicate, 'The given predicate is not a function')
    return this.isPresent() ? (predicate(this.value) ? this : Optional.empty()) : this
  }

  /**
   * If a value is present, maps the value with the given mapping function
   * and returns an Optional containing the value contained in the Optional returned by the mapper,
   * otherwise returns an empty Optional.
   *
   * @example
   * ```Javascript
   * Optional.of(2)
   *    .flatMap(value => Optional.of(value * 2))
   *    .get() // 4
   * ```
   *
   * @template R - The type of the Optional returned by the mapping function
   * @param mapper  - The mapping function to map the value in this Optional if it is present
   * @returns the result of the mapping if a value is present, otherwise an empty Optional
   *
   * @throws <b>TypeError</b>
   * if the given mapper is not a function or doesn't return an Optional
   */
  flatMap<R>(mapper: MapperFunction<T, Optional<R>>): Optional<R> {
    validateFunction(mapper, 'The given mapper is not a function')
    if (this.isPresent()) {
      const newOptional: Optional<R> = mapper(this.value)
      if (!(newOptional instanceof Optional)) {
        throw new TypeError('Mapper doesn\'t return an Optional')
      }
      return newOptional
    }
    return Optional.empty()
  }

  /**
   * If a value is present, returns the value, otherwise throws {@link NoSuchElementError}.
   *
   * @example
   * ```Javascript
   * Optional.of(2).get() // 2
   * ```
   *
   * @example
   * ```Javascript
   * Optional.empty().get() // throws NoSuchElementError
   * ```
   *
   * @returns the non-null value contained in this Optional
   *
   * @throws {@link NoSuchElementError}
   * if no value is present
   */
  get(): T {
    if (this.isPresent()) {
      return this.value
    }
    throw new NoSuchElementError('Null or undefined value')
  }

  /**
   * If no value is present, performs the given action, otherwise does nothing.
   *
   * @example
   * ```Javascript
   * Optional.empty().ifEmpty(() => doSomething())
   * ```
   *
   * @param onEmpty - The action to be performed if no value is present
   *
   * @throws <b>TypeError</b>
   * if the given onEmpty is not a function
   */
  ifEmpty(onEmpty: CallableFunction): void {
    validateFunction(onEmpty, 'The given onEmpty action is not a function')
    this.isPresent() || onEmpty()
  }

  /**
   * If a value is present, performs the given action with the value as argument, otherwise does nothing.
   *
   * @example
   * ```Javascript
   * Optional.of(2).ifPresent(value => console.log(value)) // logs "2"
   * ```
   *
   * @param consumer - The action to be performed if a value is present
   *
   * @throws <b>TypeError</b>
   * if the given consumer is not a function
   */
  ifPresent(consumer: ConsumerFunction<T>): void {
    validateFunction(consumer, 'The given consumer is not a function')
    this.isEmpty() || consumer(this.value)
  }

  /**
   * If a value is present, performs the given onPresent action with the value as argument,
   * otherwise performs the given onEmpty action.
   *
   * @example
   * ```Javascript
   * Optional.of(2)
   *    .ifPresentOrElse(
   *      value => console.log(value),
   *      () => console.log('No such element')
   *    ) // logs "2"
   * ```
   *
   * @example
   * ```Javascript
   * Optional.empty()
   *    .ifPresentOrElse(
   *      value => console.log(value),
   *      () => console.log('No such element')
   *    ) // logs "No such element"
   * ```
   *
   * @param onPresent - The action to be performed if a value is present
   * @param onEmpty   - The action to be performed if no value is present
   *
   * @throws <b>TypeError</b>
   * if either onPresent or onEmpty is not a function
   */
  ifPresentOrElse(onPresent: ConsumerFunction<T>, onEmpty: CallableFunction): void {
    validateFunction(onPresent, 'The given onPresent action is not a function')
    validateFunction(onEmpty, 'The given onEmpty action is not a function')
    this.isPresent() ? onPresent(this.value) : onEmpty()
  }

  /**
   * If no value is present, returns true, otherwise false.
   *
   * @example
   * ```Javascript
   * Optional.empty().isEmpty() // true
   * ```
   *
   * @returns true if no value is present, otherwise false
   */
  isEmpty(): boolean {
    return this.value == null
  }

  /**
   * If a value is present, returns true, otherwise false.
   *
   * @example
   * ```Javascript
   * Optional.of(2).isPresent() // true
   * ```
   *
   * @returns true if a value is present, otherwise false
   */
  isPresent(): boolean {
    return this.value != null
  }

  /**
   * If a value is present, maps the value with the given mapping function
   * and returns an Optional containing the value returned by the mapper,
   * otherwise returns an empty Optional.
   *
   * @example
   * ```Javascript
   * Optional.of(2)
   *    .map(value => value * 2)
   *    .get() // 4
   * ```
   *
   * @template R - The type of the value returned by the mapping function
   * @param mapper  - The mapping function to map the value in this Optional if the value is present
   * @returns an Optional containing the result of the mapping if a value is present, otherwise an empty Optional
   *
   * @throws <b>TypeError</b>
   * if the given mapper is not a function
   */
  map<R>(mapper: MapperFunction<T, R>): Optional<R> {
    validateFunction(mapper, 'The given mapper is not a function')
    return this.isPresent() ? new Optional<R>(mapper(this.value)) : Optional.empty()
  }

  /**
   * If a value is present, returns an Optional containing the value,
   * otherwise returns an Optional returned by the given supplier function.
   *
   * @example
   * ```Javascript
   * Optional.of(2)
   *    .or(() => Optional.of(3))
   *    .get() // 2
   * ```
   *
   * @example
   * ```Javascript
   * Optional.empty()
   *    .or(() => Optional.of(3))
   *    .get() // 3
   * ```
   *
   * @param supplier  - The supplier function that produces an alternative Optional to be returned
   * @returns an Optional containing current value if it is present,
   * otherwise an Optional provided by the supplier function.
   *
   * @throws <b>TypeError</b>
   * if the given supplier is not a function or doesn't return an Optional
   */
  or(supplier: SupplierFunction<Optional<T>>): Optional<T> {
    validateFunction(supplier, 'The given supplier is not a function')
    if (this.isPresent()) {
      return this
    }
    const newOptional: Optional<T> = supplier()
    if (!(newOptional instanceof Optional)) {
      throw new TypeError('Supplier doesn\'t return an Optional')
    }
    return newOptional
  }

  /**
   * If a value is present, returns the value, otherwise returns other.
   *
   * @example
   * ```Javascript
   * Optional.of(2).orElse(3) // 2
   * ```
   *
   * @example
   * ```Javascript
   * Optional.empty().orElse(3) // 3
   * ```
   *
   * @param other - An alternative nullable value to be returned if no value is present
   * @returns a value if it is present, otherwise the given other value
   */
  orElse(other: T): T {
    return this.isPresent() ? this.value : other
  }

  /**
   * If a value is present, returns the value, otherwise returns a value returned by the supplier function.
   *
   * @example
   * ```Javascript
   * Optional.of(2).orElseGet(() => 3) // 2
   * ```
   *
   * @example
   * ```Javascript
   * Optional.empty().orElseGet(() => 3) // 3
   * ```
   *
   * @param supplier  - The supplier function that produces an alternative nullable value to be returned
   * @returns a value if it is present, otherwise a value returned by the given supplier
   *
   * @throws <b>TypeError</b>
   * if the given supplier is not a function
   */
  orElseGet(supplier: SupplierFunction<T>): T {
    validateFunction(supplier, 'The given supplier is not a function')
    return this.isPresent() ? this.value : supplier()
  }

  /**
   * If a value is present, returns the value, otherwise throws an error returned by the error supplier function.
   *
   * @example
   * ```Javascript
   * Optional.of(2).orElseThrow(() => new Error()) // 2
   * ```
   *
   * @example
   * ```Javascript
   * Optional.empty().orElseThrow(() => new Error()) // throws Error
   * ```
   *
   * @template E - The type of the error that will be returned by the error supplier function
   * @param errorSupplier - The supplier function that produces an error to be thrown
   * @returns a value if it is present
   *
   * @throws <b>TypeError</b>
   * if the given error supplier is not a function
   * @throws <b>E</b>
   * if no value is present
   */
  orElseThrow<E extends Error>(errorSupplier: SupplierFunction<E>): T {
    validateFunction(errorSupplier, 'The given error supplier is not a function')
    if (this.isPresent()) {
      return this.value
    }
    throw errorSupplier()
  }

  /**
   * Peeks current nullable value using the given consumer.
   *
   * @example
   * ```Javascript
   * Optional.empty()
   *    .peek(console.log) // logs "undefined"
   *    .or(() => Optional.of(2))
   *    .peek(console.log) // logs "2"
   *    .map(value => value * 2)
   *    .peek(console.log) // logs "4"
   * ```
   *
   * @param consumer  - The consumer function to consume current nullable value
   *
   * @throws <b>TypeError</b>
   * if the given consumer is not a function
   */
  peek(consumer: ConsumerFunction<T>): Optional<T> {
    validateFunction(consumer)
    consumer(this.value)
    return this
  }

  /**
   * Returns a string describing this instance of Optional.
   *
   * @example
   * ```Javascript
   * Optional.of(2).toString() // Optional(2)
   * ```
   *
   * @returns a string describing this instance of Optional
   */
  toString() {
    return `Optional(${this.value})`
  }

}
