module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'airbnb',
    ["airbnb", "airbnb/hooks"]
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
  },
  plugin: ["simple-import-sort"],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/imports": ["error", {
      groups: [
        ["^react(.*)",],
        ["@mui/(.*)",],
        ["components/*"],
        ["^@?\\w"],
        ["@/(.*)"],
        ["^[./]"]
      ]
    }] 
  }
}
