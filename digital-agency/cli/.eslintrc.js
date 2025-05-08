module.exports = {
  extends: ['react-app'],
  env: {
    browser: true,
    node: true,
    jest: true
  },
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off'
  }
}; 