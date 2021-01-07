export interface CallableFunction {
  (): void
}

export interface ConsumerFunction<T> {
  (arg: T): void
}

export interface MapperFunction<T, R> {
  (arg: T): R
}

export interface PredicateFunction<T> {
  (arg: T): boolean
}

export interface SupplierFunction<T> {
  (): T
}
