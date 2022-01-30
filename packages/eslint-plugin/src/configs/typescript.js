module.exports = {
  extends: [
    './configs/base'
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': ['off'],
  }
}
