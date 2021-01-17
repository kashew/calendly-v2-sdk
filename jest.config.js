module.exports = {
  "roots": [
    "<rootDir>/test"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  "testEnvironment": "node",
  "moduleNameMapper": {
    "src/(.*)": "<rootDir>/src/$1",
    "src": "<rootDir>/src"
  }
}