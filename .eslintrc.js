module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  'rules': {
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
