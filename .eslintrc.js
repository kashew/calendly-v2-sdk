module.exports = {
  "env": {
    "browser": true
  },
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "tsconfig.eslint.json",
    "sourceType": "module"
  },
  "plugins": [
    "eslint-plugin-jsdoc",
    "eslint-plugin-prefer-arrow",
    "@typescript-eslint"
  ],
  "ignorePatterns": [ ".eslintrc.js", "jest.config.js", "rollup.config.js" ],
  "rules": {
    "semi": [ "error", "never" ],
    "quotes": [ "error", "single" ],
    "sort-imports": [ "error" ]
  }
};
