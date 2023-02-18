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
    'semi': ["error", "always"],
    'no-multiple-empty-lines': ["error", { "max": 1, "maxEOF": 0 }],
    // 'indent': [
    //   'error',
    //   2,
    //   {
    //     MemberExpression: 1,
    //     SwitchCase: 1,
    //     ignoredNodes: [
    //       'FunctionExpression > .params[decorators.length > 0]',
    //       'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
    //       'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
    //     ],
    //   },
    // ],
    "space-before-blocks": "off",
    'object-curly-spacing': ["error", "always"],
    "object-shorthand": ["error", "always"],
    'array-bracket-spacing': ["error", "never"],
    'arrow-body-style': ["error", "as-needed"],
    "object-shorthand": ["error", "properties"],
    'array-element-newline': ["error", 'consistent'],
    'array-bracket-newline': ["error", 'consistent'],
    // "object-curly-newline": [
    //   "error",
    //   {
    //     "ObjectExpression": {'consistent':true},
    //     "ObjectPattern": {'consistent':true},
    //     "ImportDeclaration": "never",
    //     "ExportDeclaration": { "multiline": true, "minProperties": 3 }
    //   }
    // ],
    'no-unreachable': "error",
    'comma-spacing': ["error", { "before": false, "after": true }],
    "@typescript-eslint/space-before-blocks": "warn",
    "space-infix-ops": "off",
    "@typescript-eslint/space-infix-ops": "warn",
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "@typescript-eslint/no-unused-vars": ["warn", { "ignoreRestSiblings": true }]
  },
};
