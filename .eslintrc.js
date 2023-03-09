module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname, 
    sourceType: 'module',
  },
  
     plugins: [
    '@typescript-eslint/eslint-plugin',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'key-spacing': ["error", { "afterColon": true }],
    "object-shorthand": ["error", "always"],
    'arrow-body-style': ["error", "as-needed"],
    "object-shorthand": ["error", "properties"],
    'no-unreachable': "error",
    "@typescript-eslint/space-before-blocks": "warn",
    "space-infix-ops": "off",
    "@typescript-eslint/space-infix-ops": "warn",
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "@typescript-eslint/no-unused-vars": ["warn", { "ignoreRestSiblings": true }],
    "@typescript-eslint/no-empty-interface": "off"
  },
};
