import Optional from '@/libs/optional'

console.log('Hello, World!')
const optionalNumber: Optional<Number> = Optional.ofNullable(12)
    .filter(arg => arg > 10)
console.log('Optional number is ' + optionalNumber)

export default {
  Optional
}
