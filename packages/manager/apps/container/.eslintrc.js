module.exports = {
  extends: [
    '../../../../.eslintrc.js',
    'plugin:react/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'import/extensions': 'off',
  },
};
