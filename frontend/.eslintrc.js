module.exports = {
  'env': {
    'browser': true,
    'es6': true,
  },
  'extends': [
    'plugin:react/recommended',
    'eslint:recommended',
  ],
  'settings': {
    'react': {
      'createClass': 'createReactClass',
      'pragma': 'React',
      'fragment': 'Fragment',
      'version': 'detect',
      'flowVersion': '0.53',
    },
    'propWrapperFunctions': [
      'forbidExtraProps',
      {'property': 'freeze', 'object': 'Object'},
      {'property': 'myFavoriteWrapper'},
    ],
    'componentWrapperFunctions': [
      'observer', // `property`
      {'property': 'styled'},
      {'property': 'observer', 'object': 'Mobx'},
      {'property': 'observer', 'object': '<pragma>'},
    ],
    'linkComponents': [
      'Hyperlink',
      {'name': 'Link', 'linkAttribute': 'to'},
    ],
  },
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
  ],
  'rules': {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'max-len': 0,
    'valid-jsdoc': 0,
  },
}
